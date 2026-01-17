# Architecture Documentation

## System Overview

The HVAC Analysis application implements a **local-first, Extract-Then-Reason** pipeline for analyzing HVAC blueprints and generating code compliance reports.

## High-Level Architecture

```
┌─────────────────┐
│   React UI      │
│  (Frontend)     │
└────────┬────────┘
         │ HTTP/JSON
         ▼
┌─────────────────┐
│   FastAPI       │
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌────────┐
│ MCP   │  │ Ollama │
│Servers│  │(Qwen)  │
└───────┘  └────────┘
```

## Component Details

### 1. Frontend (React + TypeScript)

**Location**: `/services`, `/components`, `/views`

**Responsibilities**:
- User interface for blueprint upload
- Progress indication and error display
- Report visualization
- Type-safe API communication

**Key Files**:
- `services/aiService.ts` - API client with error handling
- `services/apiTypes.ts` - TypeScript interfaces matching backend
- `App.tsx` - Main application component

**Technology Stack**:
- React 19
- TypeScript 5.8
- Vite (build tool)
- Tailwind CSS

### 2. Backend (FastAPI + Python)

**Location**: `/backend`

**Responsibilities**:
- API endpoint management
- Request routing and validation
- Orchestration of MCP servers and Ollama
- Error handling and logging
- Request tracing

**Key Files**:
- `server.py` - Main FastAPI application
- `models.py` - Pydantic data models (strict typing)
- `utils.py` - Retry logic, JSON repair, logging utilities
- `config.py` - Configuration management
- `constants.py` - System prompts and constants

**API Endpoints**:
- `POST /api/analyze` - Main document analysis
- `POST /api/upload` - PDF upload with preview
- `GET /api/model` - Model status check
- `GET /api/catalog` - Pricing catalog retrieval

### 3. MCP Servers (Model Context Protocol)

**Location**: `/backend/mcp_servers`

MCP servers provide deterministic tools that the AI can call during reasoning.

#### 3.1 PDF Server (`pdf_server.py`)

**Purpose**: PDF processing and image rendering

**Tools**:
- `split_pdf_metadata(pdf_base64)` → Returns page count and metadata
- `render_page_for_vision(pdf_base64, page_number)` → PNG at 2x zoom

**Implementation**:
- Uses PyMuPDF (fitz) for rendering
- Configurable zoom factor (default 2x)
- Error handling for corrupted PDFs
- Structured logging

#### 3.2 HVAC Logic Server (`hvac_server.py`)

**Purpose**: Engineering calculations

**Tools**:
- `calculate_manual_j_load(area_sqft, u_value, is_basement)` → Heating load (BTU/h)
- `check_compliance(load, capacity)` → MN Rule 1322.0403 validation

**Implementation**:
- Pure Python calculations (no AI)
- Input validation with ValueError exceptions
- Minnesota Climate Zone 7 constants

#### 3.3 Engineering Server (`engineering_server.py`)

**Purpose**: Knowledge base and pricing lookups

**Tools**:
- `lookup_component_price(query)` → Fuzzy search in pricing catalog
- `consult_knowledge_base(topic)` → ISA-5.1 / ASHRAE reference
- `calculate_load_zone_7(area, u_value)` → Zone 7 calculations

**Implementation**:
- FuzzyWuzzy for component matching
- Keyword search for knowledge base (production: use vector DB)
- JSON catalog loading at startup

### 4. Inference Engine (Ollama + Qwen 2.5 VL)

**Purpose**: Local vision-language model inference

**Model**: Qwen 2.5 VL (vision-language)
**API**: OpenAI-compatible endpoint (http://localhost:11434/v1)

**Usage Pattern**:
1. **Phase 1 - Extraction**: Per-page literal text extraction
2. **Phase 2 - Reasoning**: Aggregated reasoning with system prompt

**Parameters**:
- Extraction: `temperature=0.0` (deterministic)
- Reasoning: `temperature=0.1` (minimal creativity)
- Max tokens: 1200 (extraction), unlimited (reasoning)

## Data Flow: Request Lifecycle

### `/api/analyze` Request

```
1. Frontend sends PDF (base64)
   ↓
2. FastAPI validates request (Pydantic)
   ↓
3. Request ID generated (req-abc123)
   ↓
4. PDF Server MCP: Get page count
   ↓
5. For each page (serial):
   a. PDF Server MCP: Render page → PNG
   b. Ollama: Extract text (Phase 1)
   c. Append to extracted_data[]
   [Retry on failure: 3 attempts]
   ↓
6. Aggregate all extracted_data
   ↓
7. Truncate if > 28k tokens
   ↓
8. Ollama: Engineering reasoning (Phase 2)
   System Prompt: MN_HVAC_SYSTEM_INSTRUCTION
   ↓
9. Parse JSON response
   ↓
10. Repair malformed JSON if needed
   ↓
11. Validate schema
   ↓
12. Return AnalyzeResponse with request_id
```

### Error Handling Points

| Point | Error Type | Strategy |
|-------|-----------|----------|
| PDF decode | Base64 error | Return 400 with detail |
| Page render | MCP error | Log and skip page (graceful) |
| Text extraction | Model timeout | Retry 2x with backoff |
| JSON parsing | Malformed JSON | Repair with regex |
| Context overflow | Token limit | Truncate with warning |

## Type Safety Strategy

### Backend (Python)

```python
# All API requests/responses use Pydantic models
class AnalyzeRequest(BaseModel):
    file_base64: str
    mime_type: str
    max_pages: Optional[int] = 20

class AnalyzeResponse(BaseModel):
    report: str
    request_id: str
    pages_processed: int
```

**Benefits**:
- Automatic validation
- OpenAPI schema generation
- IDE autocomplete
- Runtime type checking

### Frontend (TypeScript)

```typescript
// Interfaces mirror backend Pydantic models
interface AnalyzeRequest {
  file_base64: string;
  mime_type: string;
  max_pages?: number;
}
```

**Benefits**:
- Compile-time type checking
- No `any` types in core paths
- Refactoring safety
- Documentation through types

## Observability & Debugging

### Request Tracing

Every request gets a unique ID: `req-abc123456789`

**Log Format**:
```
2024-01-16 10:30:45 - backend.server - [INFO] - [req-abc123] Starting: analyze_document
2024-01-16 10:30:50 - backend.server - [INFO] - [req-abc123] Scanning Page 1/5...
2024-01-16 10:31:25 - backend.server - [INFO] - [req-abc123] Completed: analyze_document in 40.2s
```

**Trace Path**:
1. Frontend generates fetch → request_id in response
2. Backend logs all operations with request_id
3. MCP servers log tool calls
4. Ollama calls logged with token counts

### Structured Logging

**Levels**:
- `DEBUG`: Token counts, intermediate states
- `INFO`: Request lifecycle, page progress
- `WARNING`: JSON repair attempts, context truncation
- `ERROR`: Failures with stack traces

**Configuration**: `backend/config.py` → `log_level`

## Security Considerations

### Input Validation

1. **Filename Sanitization**:
   ```python
   sanitize_filename(filename)  # Removes ../,  path traversal
   ```

2. **Base64 Validation**:
   ```python
   if len(pdf_bytes) < 10:
       raise ValueError("Invalid PDF")
   ```

3. **Page Range Validation**:
   ```python
   if page_number < 1 or page_number > total_pages:
       return error
   ```

### CORS Configuration

**Development**: `allow_origins=["*"]`
**Production**: Restrict to specific domains in `.env`

### File Upload Limits

- Max file size: 50MB (configurable)
- Max pages: 50 (configurable)
- Allowed types: PDF, PNG, JPEG

## Configuration Management

### Environment Variables

**File**: `.env` (copy from `.env.example`)

**Prefix**: None (variables use direct names without prefix)

**Key Settings**:
```bash
MODEL_NAME=qwen2.5vl
MAX_PAGES_DEFAULT=20
PDF_ZOOM_FACTOR=2.0
CONTEXT_WINDOW_MAX_TOKENS=28000
```

**Loading**: `backend/config.py` uses `pydantic-settings`

### Runtime Configuration

Configuration can be changed via:
1. Environment variables (highest priority)
2. `.env` file
3. Default values in `config.py`

## Deployment Considerations

### Local Development

```bash
# Terminal 1: Backend
python -m uvicorn backend.server:app --reload

# Terminal 2: Ollama
ollama serve

# Terminal 3: Frontend
npm run dev
```

**Note**: Development uses `http://localhost` for all communication. For production deployment, consider:
- Using HTTPS with proper certificates
- Configuring OLLAMA_BASE_URL in environment
- Setting up proper CORS restrictions
- Implementing authentication/authorization

### Production (Single Server)

```bash
# Use systemd services for:
- ollama.service (GPU server)
- hvac-backend.service (FastAPI)
- hvac-frontend.service (Nginx serving built React)
```

### Resource Requirements

**Minimum**:
- 8GB VRAM GPU (NVIDIA recommended)
- 16GB RAM
- 50GB disk (model storage)

**Recommended**:
- 12GB VRAM GPU
- 32GB RAM
- 100GB disk

## Future Architecture Improvements

### Short-Term
1. [ ] Add Redis for result caching
2. [ ] Implement SSE for progress streaming
3. [ ] Add Celery for async task queue

### Medium-Term
1. [ ] Multi-GPU support with load balancing
2. [ ] PostgreSQL for persistent storage
3. [ ] Vector DB for knowledge base (Chroma/Weaviate)

### Long-Term
1. [ ] Kubernetes deployment
2. [ ] Distributed tracing (Jaeger)
3. [ ] Model serving optimization (vLLM)

---

**Last Updated**: 2024-01-16
**Version**: 2.0.0
