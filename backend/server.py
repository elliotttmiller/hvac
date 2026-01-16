import sys
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import AsyncExitStack
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from openai import AsyncOpenAI
from backend.constants import MN_HVAC_SYSTEM_INSTRUCTION
import os
import base64
from uuid import uuid4
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = AsyncOpenAI(base_url="http://localhost:11434/v1", api_key="ollama")
MODEL_NAME = "qwen2.5vl"

class AnalyzeRequest(BaseModel):
    file_base64: str
    mime_type: str


class UploadRequest(BaseModel):
    file_base64: str
    filename: str | None = None


@app.get("/api/catalog")
async def get_catalog():
    try:
        with open("backend/data/pricing_catalog.json", "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except FileNotFoundError:
        return {"error": "catalog not found"}
@app.post("/api/analyze")
async def analyze_document(request: AnalyzeRequest):
    """Extract-then-Reason pipeline (Gemini-style).

    Phase 1 - Extraction: Fast per-page extraction of literal text/numbers from pages.
    Phase 2 - Reasoning: Feed extracted data into the MN_HVAC_SYSTEM_INSTRUCTION and return strict JSON.
    """
    print(f"Starting 'Gemini-Style' Pipeline with {MODEL_NAME}")

    is_pdf = request.mime_type and request.mime_type.lower().startswith("application/pdf")
    # Fallback sniff
    if not is_pdf:
        try:
            _, body_b64 = (request.file_base64.split(",", 1) if "," in request.file_base64 else (None, request.file_base64))
            raw = base64.b64decode(body_b64)
            if raw[:4] == b"%PDF":
                is_pdf = True
        except Exception:
            pass

    base_dir = os.path.dirname(__file__)
    extracted_data = []

    async with AsyncExitStack() as stack:
        if is_pdf:
            # start pdf mcp and get page count
            pdf_params = StdioServerParameters(command=sys.executable, args=[os.path.join(base_dir, "mcp_servers", "pdf_server.py")])
            pdf_read_write = await stack.enter_async_context(stdio_client(pdf_params))
            pdf_read_stream, pdf_write_stream = pdf_read_write
            pdf_session = await stack.enter_async_context(ClientSession(pdf_read_stream, pdf_write_stream))
            await pdf_session.initialize()

            meta_result = await pdf_session.call_tool("split_pdf_metadata", arguments={"pdf_base64": request.file_base64})
            doc_info = json.loads(meta_result.content[0].text)
            total_pages = doc_info.get('total_pages', 1)

            # limit pages to first 20 by default to keep latency reasonable
            max_pages = min(total_pages, 20)
            for p in range(1, max_pages + 1):
                print(f"   Scanning Page {p}...")
                img_result = await pdf_session.call_tool("render_page_for_vision", arguments={"pdf_base64": request.file_base64, "page_number": p})
                img_data = json.loads(img_result.content[0].text)
                image_data_url = f"data:image/png;base64,{img_data.get('image_data')}"

                # Fast extraction prompt (literal text/dimensions)
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
                extracted = resp.choices[0].message.content
                extracted_data.append(f"--- PAGE {p} ---\n{extracted}")

        else:
            # single image - treat as one page
            if request.file_base64.startswith('data:'):
                image_data_url = request.file_base64
            else:
                image_data_url = f"data:{request.mime_type};base64,{request.file_base64}"

            resp = await client.chat.completions.create(
                model=MODEL_NAME,
                messages=[
                    {"role": "user", "content": [
                        {"type": "text", "text": "Read this blueprint image. List ALL text, room names, dimensions, window sizes, and equipment model numbers you see. Be literal."},
                        {"type": "image_url", "image_url": {"url": image_data_url}}
                    ]}
                ],
                max_tokens=1200,
                temperature=0.0
            )
            extracted_data.append(f"--- IMAGE ---\n{resp.choices[0].message.content}")

    # Phase 2: Reasoning with strict system prompt
    print("Running Engineering Inference (Gemini Logic)...")
    full_context = "\n\n".join(extracted_data)

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
    print("Report generated.")
    return {"report": raw_json}


@app.post("/api/upload")
async def upload_pdf(request: UploadRequest):
    """Accept a base64 PDF, save it under backend/uploads and return rendered page previews (data urls).

    Response: { upload_id, filename, pages: [data:image/png;base64,...], total_pages }
    """
    os.makedirs("backend/uploads", exist_ok=True)
    upload_id = f"up-{uuid4().hex[:8]}"
    filename = request.filename or f"{upload_id}.pdf"
    # Save the PDF file
    try:
        header, b64 = request.file_base64.split(",", 1) if "," in request.file_base64 else (None, request.file_base64)
        pdf_bytes = base64.b64decode(b64)
        save_path = os.path.join("backend", "uploads", f"{upload_id}.pdf")
        with open(save_path, "wb") as f:
            f.write(pdf_bytes)
    except Exception as e:
        return {"error": "failed to save upload", "detail": str(e)}

    # Render pages using pdf mcp server
    base_dir = os.path.dirname(__file__)
    server_params = {
        "pdf": StdioServerParameters(command=sys.executable, args=[os.path.join(base_dir, "mcp_servers", "pdf_server.py")]) 
    }

    pages: list[str] = []
    total_pages = 0

    async with AsyncExitStack() as stack:
        pdf_read_write = await stack.enter_async_context(stdio_client(server_params["pdf"]))
        pdf_read_stream, pdf_write_stream = pdf_read_write
        pdf_session = await stack.enter_async_context(ClientSession(pdf_read_stream, pdf_write_stream))
        await pdf_session.initialize()

        # 1. Get metadata
        meta_result = await pdf_session.call_tool("split_pdf_metadata", arguments={"pdf_base64": request.file_base64})
        doc_info = json.loads(meta_result.content[0].text)
        total_pages = doc_info.get("total_pages", 0)

        # limit to first 20 pages to avoid huge payloads by default
        max_pages = min(total_pages, 20)

        for p in range(1, max_pages + 1):
            img_result = await pdf_session.call_tool("render_page_for_vision", arguments={"pdf_base64": request.file_base64, "page_number": p})
            img_data = json.loads(img_result.content[0].text)
            data_url = f"data:image/png;base64,{img_data['image_data']}"
            pages.append(data_url)

    return {"upload_id": upload_id, "filename": filename, "pages": pages, "total_pages": total_pages}


@app.get("/api/model")
async def get_model_status():
    """Return which MODEL_NAME is configured and whether Ollama reports it as loaded."""
    ollama_url = "http://localhost:11434/v1/models"
    try:
        async with httpx.AsyncClient() as client_http:
            resp = await client_http.get(ollama_url, timeout=5.0)
            if resp.status_code != 200:
                return {"model": MODEL_NAME, "loaded": False, "error": f"ollama returned {resp.status_code}"}
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

            return {"model": MODEL_NAME, "loaded": loaded, "matched_model": matched_model, "available": available, "raw": body}
    except Exception as e:
        return {"model": MODEL_NAME, "loaded": False, "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)