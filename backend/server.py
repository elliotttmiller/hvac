import sys
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import AsyncExitStack
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from openai import AsyncOpenAI
from backend.constants import MN_HVAC_SYSTEM_INSTRUCTION
from backend.models import (
    AnalyzeRequest, AnalyzeResponse, UploadRequest, UploadResponse,
    ModelStatus, ErrorResponse, PDFMetadata, PageImageData, AnalysisReport
)
from backend.utils import (
    RequestTracer, retry_with_backoff, repair_json, validate_json_schema,
    sanitize_filename, truncate_to_token_limit, log_model_interaction, logger
)
import os
import base64
from uuid import uuid4
import httpx
import time

app = FastAPI(title="HVAC Analysis API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncOpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "qwen2.5vl"


@app.get("/api/catalog")
async def get_catalog():
    try:
        with open("backend/data/pricing_catalog.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        return {"error": "catalog not found"}
@retry_with_backoff(max_retries=2, initial_delay=2.0, exceptions=(Exception,))
async def extract_page_text(image_data_url: str, page_num: int, request_id: str) -> str:
    """Extract text from a single page with retry logic."""
    with RequestTracer(request_id, f"extract_page_{page_num}"):
        resp = await client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {"role": "user", "content": [
                    {"type": "text", "text": "Read this blueprint page. List ALL text, room names, dimensions, window sizes, and equipment model numbers you see. Be literal."},
                    {"type": "image_url", "image_url": {"url": image_data_url}}
                ]}
            ],
            max_tokens=1200,
            temperature=0.0
        )
        return resp.choices[0].message.content


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze_document(request: AnalyzeRequest):
    """Extract-then-Reason pipeline with robust error handling and retry logic.

    Phase 1 - Extraction: Fast per-page extraction of literal text/numbers from pages.
    Phase 2 - Reasoning: Feed extracted data into the MN_HVAC_SYSTEM_INSTRUCTION and return strict JSON.
    
    Features:
    - Request tracing for observability
    - Graceful degradation on page failures
    - JSON repair and validation
    - Context window management
    """
    request_id = f"req-{uuid4().hex[:12]}"
    start_time = time.time()
    
    with RequestTracer(request_id, "analyze_document"):
        logger.info(f"[{request_id}] Starting pipeline with {MODEL_NAME}")

        is_pdf = request.mime_type and request.mime_type.lower().startswith("application/pdf")
        # Fallback sniff for PDF
        if not is_pdf:
            try:
                _, body_b64 = (request.file_base64.split(",", 1) if "," in request.file_base64 else (None, request.file_base64))
                raw = base64.b64decode(body_b64)
                if raw[:4] == b"%PDF":
                    is_pdf = True
            except Exception as e:
                logger.warning(f"[{request_id}] PDF detection failed: {e}")

        base_dir = os.path.dirname(__file__)
        extracted_data = []
        pages_processed = 0
        failed_pages = []

        async with AsyncExitStack() as stack:
            if is_pdf:
                # Start PDF MCP server
                try:
                    pdf_params = StdioServerParameters(
                        command=sys.executable, 
                        args=[os.path.join(base_dir, "mcp_servers", "pdf_server.py")]
                    )
                    pdf_read_write = await stack.enter_async_context(stdio_client(pdf_params))
                    pdf_read_stream, pdf_write_stream = pdf_read_write
                    pdf_session = await stack.enter_async_context(ClientSession(pdf_read_stream, pdf_write_stream))
                    await pdf_session.initialize()

                    # Get metadata
                    meta_result = await pdf_session.call_tool("split_pdf_metadata", arguments={"pdf_base64": request.file_base64})
                    doc_info_raw = meta_result.content[0].text
                    doc_info = json.loads(doc_info_raw)
                    
                    if "error" in doc_info:
                        raise HTTPException(status_code=400, detail=f"PDF metadata error: {doc_info['error']}")
                    
                    total_pages = doc_info.get('total_pages', 1)
                    max_pages = min(total_pages, request.max_pages or 20)
                    
                    logger.info(f"[{request_id}] Processing {max_pages}/{total_pages} pages")

                    # Process each page with graceful failure handling
                    for p in range(1, max_pages + 1):
                        try:
                            logger.info(f"[{request_id}] Scanning Page {p}/{max_pages}...")
                            img_result = await pdf_session.call_tool(
                                "render_page_for_vision", 
                                arguments={"pdf_base64": request.file_base64, "page_number": p}
                            )
                            img_data = json.loads(img_result.content[0].text)
                            
                            if "error" in img_data:
                                logger.error(f"[{request_id}] Page {p} render error: {img_data['error']}")
                                failed_pages.append(p)
                                continue
                            
                            image_data_url = f"data:image/png;base64,{img_data.get('image_data')}"

                            # Extract text with retry logic
                            extracted = await extract_page_text(image_data_url, p, request_id)
                            extracted_data.append(f"--- PAGE {p} ---\n{extracted}")
                            pages_processed += 1
                            
                        except Exception as e:
                            logger.error(f"[{request_id}] Page {p} extraction failed: {e}")
                            failed_pages.append(p)
                            # Continue processing remaining pages (graceful degradation)
                            continue

                except Exception as e:
                    logger.error(f"[{request_id}] PDF processing error: {e}")
                    raise HTTPException(status_code=500, detail=f"PDF processing failed: {str(e)}")

            else:
                # Single image processing
                try:
                    if request.file_base64.startswith('data:'):
                        image_data_url = request.file_base64
                    else:
                        image_data_url = f"data:{request.mime_type};base64,{request.file_base64}"

                    extracted = await extract_page_text(image_data_url, 1, request_id)
                    extracted_data.append(f"--- IMAGE ---\n{extracted}")
                    pages_processed = 1
                    
                except Exception as e:
                    logger.error(f"[{request_id}] Image extraction failed: {e}")
                    raise HTTPException(status_code=500, detail=f"Image processing failed: {str(e)}")

        if not extracted_data:
            raise HTTPException(status_code=500, detail="No data extracted from document")

        # Phase 2: Reasoning with context window management
        logger.info(f"[{request_id}] Running engineering inference...")
        full_context = "\n\n".join(extracted_data)
        
        # Truncate if needed to fit context window
        full_context = truncate_to_token_limit(full_context, max_tokens=28000)
        
        try:
            final = await client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "system", "content": MN_HVAC_SYSTEM_INSTRUCTION},
                    {"role": "user", "content": f"Here is the data extracted from the plans:\n\n{full_context}\n\nGenerate the compliance report."}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )

            raw_json = final.choices[0].message.content
            
            # Attempt JSON repair if needed
            parsed = repair_json(raw_json)
            if not parsed:
                logger.error(f"[{request_id}] JSON repair failed")
                # Return raw JSON anyway for client-side handling
                parsed = {"raw_content": raw_json, "parse_error": True}
            
            # Validate schema
            required_keys = ["project_info", "load_calculations", "equipment_analysis", "compliance_status"]
            if not validate_json_schema(parsed, required_keys):
                logger.warning(f"[{request_id}] JSON schema validation failed, returning partial data")
            
            processing_time = time.time() - start_time
            logger.info(f"[{request_id}] Report generated in {processing_time:.2f}s")
            
            if failed_pages:
                logger.warning(f"[{request_id}] Failed pages: {failed_pages}")
            
            return AnalyzeResponse(
                report=json.dumps(parsed) if isinstance(parsed, dict) else raw_json,
                request_id=request_id,
                pages_processed=pages_processed,
                processing_time_seconds=round(processing_time, 2)
            )
            
        except Exception as e:
            logger.error(f"[{request_id}] Inference failed: {e}")
            raise HTTPException(status_code=500, detail=f"Inference failed: {str(e)}")


@app.post("/api/upload", response_model=UploadResponse)
async def upload_pdf(request: UploadRequest):
    """Accept a base64 PDF, save it securely and return rendered page previews.

    Response includes page thumbnails for UI preview with proper error handling.
    """
    request_id = f"req-{uuid4().hex[:12]}"
    
    with RequestTracer(request_id, "upload_pdf"):
        os.makedirs("backend/uploads", exist_ok=True)
        upload_id = f"up-{uuid4().hex[:8]}"
        
        # Sanitize filename to prevent path traversal
        safe_filename = sanitize_filename(request.filename) if request.filename else f"{upload_id}.pdf"
        
        # Save the PDF file
        try:
            header, b64 = request.file_base64.split(",", 1) if "," in request.file_base64 else (None, request.file_base64)
            pdf_bytes = base64.b64decode(b64)
            save_path = os.path.join("backend", "uploads", f"{upload_id}.pdf")
            with open(save_path, "wb") as f:
                f.write(pdf_bytes)
            logger.info(f"[{request_id}] Saved PDF: {save_path}")
        except Exception as e:
            logger.error(f"[{request_id}] Failed to save PDF: {e}")
            raise HTTPException(status_code=500, detail=f"Failed to save upload: {str(e)}")

        # Render pages using PDF MCP server
        base_dir = os.path.dirname(__file__)
        pages: list[str] = []
        total_pages = 0

        try:
            async with AsyncExitStack() as stack:
                pdf_params = StdioServerParameters(
                    command=sys.executable, 
                    args=[os.path.join(base_dir, "mcp_servers", "pdf_server.py")]
                )
                pdf_read_write = await stack.enter_async_context(stdio_client(pdf_params))
                pdf_read_stream, pdf_write_stream = pdf_read_write
                pdf_session = await stack.enter_async_context(ClientSession(pdf_read_stream, pdf_write_stream))
                await pdf_session.initialize()

                # 1. Get metadata
                meta_result = await pdf_session.call_tool("split_pdf_metadata", arguments={"pdf_base64": request.file_base64})
                doc_info = json.loads(meta_result.content[0].text)
                
                if "error" in doc_info:
                    raise HTTPException(status_code=400, detail=f"PDF metadata error: {doc_info['error']}")
                
                total_pages = doc_info.get("total_pages", 0)

                # Limit to first 20 pages for preview
                max_pages = min(total_pages, 20)

                for p in range(1, max_pages + 1):
                    try:
                        img_result = await pdf_session.call_tool(
                            "render_page_for_vision", 
                            arguments={"pdf_base64": request.file_base64, "page_number": p}
                        )
                        img_data = json.loads(img_result.content[0].text)
                        
                        if "error" in img_data:
                            logger.error(f"[{request_id}] Page {p} render error: {img_data['error']}")
                            continue
                        
                        data_url = f"data:image/png;base64,{img_data['image_data']}"
                        pages.append(data_url)
                    except Exception as e:
                        logger.error(f"[{request_id}] Failed to render page {p}: {e}")
                        # Continue with remaining pages

            return UploadResponse(
                upload_id=upload_id,
                filename=safe_filename,
                pages=pages,
                total_pages=total_pages,
                request_id=request_id
            )
            
        except Exception as e:
            logger.error(f"[{request_id}] Upload processing failed: {e}")
            raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")


@app.get("/api/model", response_model=ModelStatus)
async def get_model_status():
    """Return which MODEL_NAME is configured and whether Ollama reports it as loaded."""
    ollama_url = "http://localhost:11434/v1/models"
    try:
        async with httpx.AsyncClient() as client_http:
            resp = await client_http.get(ollama_url, timeout=5.0)
            if resp.status_code != 200:
                return ModelStatus(
                    model=MODEL_NAME, 
                    loaded=False, 
                    error=f"Ollama returned {resp.status_code}"
                )
            body = resp.json()
            # Ollama may return an object with 'models' or 'data' keys or a list
            candidates = None
            if isinstance(body, dict):
                candidates = body.get('models') or body.get('data') or []
            elif isinstance(body, list):
                candidates = body
            else:
                candidates = []

            loaded = False
            matched_model = None
            available = []
            for m in candidates:
                if not isinstance(m, dict):
                    continue
                mid = (m.get('id') or m.get('name') or '')
                available.append(mid)
                # exact or substring match
                if mid and (MODEL_NAME == mid or MODEL_NAME in mid or mid in MODEL_NAME):
                    matched_model = mid
                    loaded = True
                    break

            # Fallback heuristic: look for 'qwen' or 'llama' mentions
            if not loaded:
                for mid in available:
                    nm = mid.lower()
                    if 'qwen' in nm and 'qwen' in MODEL_NAME:
                        matched_model = mid
                        loaded = True
                        break
                    if 'llama' in nm and 'llama' in MODEL_NAME:
                        matched_model = mid
                        loaded = True
                        break

            return ModelStatus(
                model=MODEL_NAME, 
                loaded=loaded, 
                matched_model=matched_model, 
                available=available
            )
    except Exception as e:
        return ModelStatus(model=MODEL_NAME, loaded=False, error=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)