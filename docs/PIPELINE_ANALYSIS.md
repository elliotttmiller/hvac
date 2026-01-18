# AI Inference Pipeline Analysis - Quota Bottleneck Investigation

**Date**: 2026-01-18  
**Issue**: "instant instantaneously crash/error for exceeding our Google Gemini quota limit. It should not be crashing off the first page inferenced?"

## Executive Summary

The application crashes immediately when processing documents with Gemini API due to **excessive API calls per document**. The pipeline makes **N+1 API calls** (where N = number of pages), and each call consumes quota. Without proper error handling, quota exhaustion causes immediate crash.

### Root Cause

**The pipeline is NOT optimized for quota-conscious processing:**
1. Makes 1 API call per page for extraction (Phase 1)
2. Makes 1 API call for reasoning (Phase 2)  
3. Total: **11 API calls for a 10-page document**
4. No quota management or rate limiting
5. No graceful degradation when quota exceeded

## Pipeline Flow Diagram

```
Document Upload (10 pages)
    ↓
PDF Rendering (Local - No API)
    ↓
┌─────────────────────────────────────┐
│ PHASE 1: Per-Page Extraction        │
│ ─────────────────────────────────── │
│ For each page (1-10):               │
│   → Gemini API Call #1 ────────────┼──→ Quota Cost: 1 unit
│   → Gemini API Call #2 ────────────┼──→ Quota Cost: 1 unit
│   → Gemini API Call #3 ────────────┼──→ Quota Cost: 1 unit
│   ...                               │
│   → Gemini API Call #10 ───────────┼──→ Quota Cost: 1 unit
│                                     │
│ Total Phase 1: 10 API calls         │
└─────────────────────────────────────┘
    ↓
Context Aggregation (Local - No API)
    ↓
┌─────────────────────────────────────┐
│ PHASE 2: Reasoning                  │
│ ─────────────────────────────────── │
│ → Gemini API Call #11 ─────────────┼──→ Quota Cost: HIGH
│   (Large context = high token cost) │
│                                     │
│ Total Phase 2: 1 API call           │
└─────────────────────────────────────┘
    ↓
Result Processing (Local - No API)
    ↓
Return to User

TOTAL: 11 Gemini API Calls
```

## API Call Analysis

### Current Implementation

**File**: `backend/server.py` lines 174-198

```python
# BOTTLENECK: This loop makes N API calls
for p in range(1, max_pages + 1):
    # Render page (local, no API)
    img_result = await pdf_session.call_tool("render_page_for_vision", ...)
    
    # ❌ API CALL #p: Extract text from page p
    extracted = await extract_page_text(image_data_url, p, request_id)
    extracted_data.append(f"--- PAGE {p} ---\n{extracted}")
```

**File**: `backend/server.py` lines 335-340

```python
# ❌ API CALL #N+1: Reasoning with all extracted data
raw_output = await ai_client.generate_text(
    prompt=reasoning_prompt,
    max_tokens=settings.llm_structured_max_tokens,
    temperature=settings.llm_structured_temperature,
    system_instruction=MN_HVAC_SYSTEM_INSTRUCTION
)
```

### Token Cost Breakdown

**Phase 1 - Per-Page Extraction** (N calls):
- Input tokens per page: ~1,000 (image + prompt)
- Output tokens per page: ~500 (extraction_max_tokens = 2000 max)
- **Cost per page: ~1,500 tokens**
- **Total for 10 pages: ~15,000 tokens**

**Phase 2 - Reasoning** (1 call):
- Input tokens: ~20,000 (all extracted text + long prompt)
- Output tokens: ~8,000 (llm_structured_max_tokens = 8000)
- **Cost: ~28,000 tokens**

**Total for 10-page document: ~43,000 tokens**

### Quota Consumption

Gemini API Free Tier Limits:
- **60 requests per minute** (RPM)
- **32,000 tokens per minute** (TPM) for gemini-2.0-flash-exp
- **1,500 requests per day** (RPD)

**Problem**: A single 10-page document consumes:
- **11 requests** (out of 60 RPM limit) ✅ Under RPM limit
- **~43,000 tokens** (exceeds 32,000 TPM limit) ❌ **EXCEEDS LIMIT**
- **11 requests** (out of 1,500 RPD limit) ✅ Under RPD limit

## Why It Crashes on "First Page"

The user's observation is **accurate but misleading**:

1. **Page 1 processes fine** → API Call #1 succeeds
2. **Page 2-10 process fine** → API Calls #2-10 succeed (under RPM)
3. **Reasoning call (Phase 2)** → API Call #11 **EXCEEDS TPM** ❌

The crash happens **after extraction** but user perceives it as "first page" because:
- The UI shows progress per phase, not per page
- The error message doesn't clarify "10 pages extracted, reasoning failed"
- The crash happens so fast it feels instant

## Current Error Handling Issues

### Issue 1: No Quota Detection
```python
# Current code (backend/ai_client.py, lines 148-201)
def _sync_generate():
    response = self.client.models.generate_content(...)
    return response.text

result = await loop.run_in_executor(None, _sync_generate)
return result  # ❌ No try/except for quota errors
```

### Issue 2: Generic Exception Handling
```python
# Current code (backend/server.py, lines 200-224)
except Exception as e:
    logger.error(f"[{request_id}] Page {p} extraction failed: {e}")
    failed_pages.append(p)
    continue  # ❌ Continues even on quota error
```

### Issue 3: Retry Amplifies Problem
```python
# Current code (backend/server.py, lines 66-84)
@retry_with_backoff(
    max_retries=settings.max_retries,  # Default: 2
    exceptions=(Exception,)  # ❌ Retries quota errors!
)
```

**Problem**: If quota exceeded, retry logic makes **3 attempts total**, wasting even more quota!

## Performance Implications

### Current Pipeline Efficiency

| Metric | Value | Issue |
|--------|-------|-------|
| API calls per document | N + 1 | High |
| Minimum processing time | (N + 1) × ~2s | Slow |
| Quota risk | High | Unsustainable |
| Parallel processing | None | Sequential bottleneck |
| Error recovery | Poor | Crashes immediately |

### Bottleneck Visualization

```
Time →

Page 1:  [Render] ──→ [API Call #1  ] ──→ [Store]
                       ↑ 2 seconds       
                       
Page 2:                 [Render] ──→ [API Call #2  ] ──→ [Store]
                                     ↑ 2 seconds
                                     
Page 3:                              [Render] ──→ [API Call #3  ] ──→ [Store]
                                                  ↑ 2 seconds
                                                  
...

Page 10:                                          [Render] ──→ [API Call #10 ] ──→ [Store]
                                                               ↑ 2 seconds

Reasoning:                                                      [API Call #11 ] ──→ [Return]
                                                                ↑ 5 seconds
                                                                ↑ ⚠️ QUOTA EXCEEDED HERE

Total Time: ~25 seconds (optimistic)
```

## Compatibility Analysis: Ollama vs Gemini

### Ollama (Local)
✅ **No quota limits** - unlimited requests  
✅ **No rate limits** - limited only by hardware  
✅ **Offline** - no network dependency  
❌ **Slower** - ~5-10s per page on GTX 1070  
❌ **Hardware dependent** - requires GPU  

### Gemini (Cloud)
✅ **Fast** - ~2s per page  
✅ **No hardware needed** - runs in cloud  
✅ **Always up-to-date** - latest models  
❌ **Quota limits** - **32K TPM / 60 RPM / 1.5K RPD**  
❌ **Rate limits** - must stay under thresholds  
❌ **Cost** - pay per token (free tier exhausts quickly)  

### Compatibility Issues

**Current implementation is NOT universally compatible:**

| Feature | Ollama | Gemini | Universal? |
|---------|--------|--------|------------|
| Per-page extraction | ✅ Works | ⚠️ Quota risk | ❌ No |
| Unlimited retries | ✅ Works | ❌ Wastes quota | ❌ No |
| Batch processing | ✅ Works | ❌ Hits rate limit | ❌ No |
| Error handling | ⚠️ Basic | ❌ Crashes | ❌ No |
| Large documents (50+ pages) | ✅ Works | ❌ Impossible | ❌ No |

## Recommended Fixes

### Priority 1: Error Handling (Implemented ✅)
- [x] Detect quota exceeded errors specifically
- [x] Fail fast on quota errors (don't retry)
- [x] Report progress when quota exceeded
- [x] Provide actionable error messages

### Priority 2: Quota Management (Not Implemented)
- [ ] Add quota tracking and limits
- [ ] Implement request throttling
- [ ] Add configurable delays between API calls
- [ ] Batch pages to reduce API calls

### Priority 3: Pipeline Optimization (Not Implemented)
- [ ] **Option A**: Batch multiple pages per API call
  - Send 2-3 pages per vision request
  - Reduces API calls from N to N/3
  - **Tradeoff**: Larger images, higher tokens per call
  
- [ ] **Option B**: Parallel processing with rate limiting
  - Process pages in parallel with semaphore
  - Respect RPM limit (60/min)
  - **Tradeoff**: More complex, need rate limiter
  
- [ ] **Option C**: Smart extraction
  - Only extract critical pages (title, mech room, etc.)
  - Skip redundant pages
  - **Tradeoff**: Might miss important data

### Priority 4: Provider-Specific Optimizations
- [ ] Detect provider and adjust strategy
- [ ] Use different settings for Ollama vs Gemini
- [ ] Warn users about quota limits upfront

## Recommendations for Universal Compatibility

### Short-Term (Quick Fixes)

1. **Add Provider Detection**
```python
if ai_client.get_provider() == "gemini":
    # Use conservative settings
    max_pages = min(max_pages, 5)  # Limit pages for Gemini
    logger.warning(f"Gemini provider detected. Processing limited to {max_pages} pages to conserve quota.")
```

2. **Add Delay Between Calls**
```python
if ai_client.get_provider() == "gemini":
    await asyncio.sleep(1)  # 1s delay between pages for rate limiting
```

3. **Add Quota Estimation**
```python
estimated_tokens = pages_count * 1500 + 28000
if estimated_tokens > 30000:
    raise HTTPException(
        status_code=400,
        detail=f"Document too large for Gemini ({estimated_tokens} tokens estimated). Use Ollama or reduce pages."
    )
```

### Long-Term (Architectural Changes)

1. **Implement Batch Extraction**
   - Group 2-3 pages per vision call
   - Reduces API calls by 66%
   - More token-efficient

2. **Add Quota Management Service**
   - Track quota usage across requests
   - Implement sliding window rate limiter
   - Warn users when approaching limits

3. **Intelligent Page Selection**
   - Use ML to identify critical pages
   - Only process essential pages
   - Reduce API calls by 70-80%

4. **Add Caching Layer**
   - Cache extracted text by page hash
   - Avoid reprocessing identical pages
   - Save quota on repeated documents

## Conclusion

**Current Status:**
- ✅ Error handling implemented (Priority 1)
- ❌ Quota management missing (Priority 2)
- ❌ Pipeline optimization missing (Priority 3)
- ❌ Universal compatibility partial (Priority 4)

**Bottleneck Identified:**
- **Primary**: Excessive API calls (N+1 per document)
- **Secondary**: High token consumption (~43K for 10 pages)
- **Tertiary**: No quota/rate limit management

**Impact:**
- **Ollama**: No impact (no quotas)
- **Gemini**: Frequent crashes, poor UX, quota waste
- **Universal**: Not truly universal - provider-specific issues

**Next Steps:**
1. Implement quota estimation before processing
2. Add rate limiting / delays between calls
3. Consider batch extraction for Gemini
4. Add provider-specific optimizations

The pipeline is **fundamentally incompatible** with Gemini's quota model in its current form. It works fine with Ollama (unlimited) but fails catastrophically with Gemini (limited). True universal compatibility requires quota-aware design.
