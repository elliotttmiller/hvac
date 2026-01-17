<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HVAC Analysis AI - Local-First Architecture

This application provides AI-powered HVAC engineering analysis using a fully local inference pipeline with **Ollama (Qwen 2.5 VL)**, **FastAPI**, and **Model Context Protocol (MCP)** servers.

## Architecture Overview

### Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: FastAPI (Python) with strict Pydantic models
- **Inference Engine**: Ollama (Qwen 2.5 VL) - Local vision-language model
- **Document Processing**: MCP servers for PDF handling and HVAC calculations
- **Hardware Target**: 8GB VRAM constraint

### Data Flow: Extract-Then-Reason Pipeline

```
User Upload (PDF/Image)
    ↓
Frontend (React)
    ↓
FastAPI Backend (/api/analyze)
    ↓
MCP PDF Server → Extract pages → Render as PNG (2x zoom)
    ↓
Phase 1: Per-Page Extraction
    Ollama (Qwen VL) → Extract literal text/dimensions
    ↓
Phase 2: Engineering Reasoning
    Ollama → Apply MN HVAC Code → Generate compliance report
    ↓
Response with JSON Report + Request Tracing
```

### Key Features

✅ **Strict Type Safety**: Pydantic models (backend) + TypeScript interfaces (frontend)  
✅ **Error Resilience**: Retry logic with exponential backoff, graceful degradation  
✅ **Request Tracing**: End-to-end observability with request IDs  
✅ **Context Management**: Token tracking and truncation for large documents  
✅ **JSON Repair**: Automatic recovery from malformed LLM outputs  
✅ **Input Sanitization**: Protection against path traversal and injection attacks  
✅ **Resource Optimization**: 2x zoom PDFs balanced for quality and VRAM usage  

## Run Locally

**Prerequisites:**  
- Node.js (v20+)
- Python 3.12+
- Ollama with Qwen 2.5 VL model installed

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
pip install -r backend/requirements.txt
```

### 2. Start Ollama

Ensure Ollama is running with the Qwen 2.5 VL model:

```bash
ollama pull qwen2.5-vl:latest
ollama serve
```

### 3. Start Backend Server

```bash
python -m uvicorn backend.server:app --reload --port 8000
```

### 4. Start Frontend Dev Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### `POST /api/analyze`
Analyze a blueprint PDF or image with full HVAC compliance checking.

**Request:**
```json
{
  "file_base64": "data:application/pdf;base64,...",
  "mime_type": "application/pdf",
  "max_pages": 20
}
```

**Response:**
```json
{
  "report": "{...JSON report...}",
  "request_id": "req-abc123",
  "pages_processed": 5,
  "processing_time_seconds": 45.3
}
```

### `POST /api/upload`
Upload and preview a PDF with page thumbnails.

### `GET /api/model`
Check Ollama model availability and status.

### `GET /api/catalog`
Retrieve HVAC component pricing catalog.

## Error Handling Strategy

### Backend (Python)
- **Retry Logic**: 3 attempts with exponential backoff for transient failures
- **Graceful Degradation**: Continue processing remaining pages if individual pages fail
- **JSON Repair**: Automatic cleanup of markdown fences, trailing commas, malformed quotes
- **Structured Logging**: All errors logged with request ID for tracing

### Frontend (TypeScript)
- **Timeout Handling**: 120s timeout for local inference (configurable)
- **Error Display**: User-friendly messages with technical details in console
- **APIError Class**: Structured error information with status codes and request IDs

## MCP Servers

### `pdf_server.py`
- `split_pdf_metadata(pdf_base64)` → Returns page count and metadata
- `render_page_for_vision(pdf_base64, page_number)` → Renders PNG at 2x zoom for OCR

### `hvac_server.py`
- `calculate_manual_j_load(area_sqft, u_value, is_basement)` → Heating load calculation
- `check_compliance(load, capacity)` → MN Rule 1322.0403 validation (40% max oversize)

### `engineering_server.py`
- `lookup_component_price(query)` → Fuzzy search in pricing catalog
- `consult_knowledge_base(topic)` → ISA-5.1 / ASHRAE reference lookup
- `calculate_load_zone_7(area, u_value)` → MN Climate Zone 7 calculations

## Performance Considerations

### Memory Optimization (8GB VRAM)
- Single model instance (no parallel loading)
- 2x zoom for PDF rendering (balanced quality vs. size)
- Context window truncation at 28k tokens with 10% safety margin
- Serial page processing to avoid OOM

### Latency Expectations
- Single image: ~10-15 seconds
- Multi-page PDF (10 pages): ~60-90 seconds
- Large documents (20 pages): ~120-180 seconds

## Observability

All requests are traced with a unique `request_id`. Logs follow structured format:

```
2024-01-16 10:30:45 - backend.server - [INFO] - [req-abc123] Starting: analyze_document
2024-01-16 10:30:50 - backend.server - [INFO] - [req-abc123] Scanning Page 1/5...
2024-01-16 10:31:25 - backend.server - [INFO] - [req-abc123] Completed: analyze_document in 40.2s
```

## Development Notes

### Type Safety
- Backend: Pydantic models in `backend/models.py`
- Frontend: TypeScript interfaces in `services/apiTypes.ts`
- No `any` types allowed in core data paths

### Testing Locally
```bash
# Test model availability
curl http://localhost:11434/v1/models

# Test backend health
curl http://localhost:8000/api/model

# Upload a test PDF
curl -X POST http://localhost:8000/api/upload \
  -H "Content-Type: application/json" \
  -d '{"file_base64": "...base64...", "filename": "test.pdf"}'
```

## Security

- ✅ Filename sanitization (path traversal prevention)
- ✅ Base64 validation before decoding
- ✅ Input validation on all MCP tools
- ✅ Error messages don't leak sensitive paths
- ✅ CORS configured for local development only

## Future Enhancements

- [ ] Server-Sent Events (SSE) for real-time progress streaming
- [ ] Batch processing for multi-document analysis
- [ ] Vector DB integration for knowledge base (replace keyword search)
- [ ] Redis caching for repeated queries
- [ ] Prometheus metrics for production monitoring

---

View your app in AI Studio: https://ai.studio/apps/drive/1wsedyuyXCPkKPQt5mS8QF0xoKifejDFg
