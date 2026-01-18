# Error Handling in HVAC Analysis System

## Overview

This document describes the comprehensive error handling strategy for AI provider errors, particularly for Google Gemini API integration. The system distinguishes between retryable and non-retryable errors to provide graceful degradation and prevent wasting API quota.

## Error Classification

### Non-Retryable Errors (Fail Fast)

These errors indicate permanent failures that won't be resolved by retrying:

#### 1. `AIQuotaExceededError` (HTTP 429)
- **Cause**: API quota is exhausted
- **Behavior**: Stop immediately, report progress
- **HTTP Status**: 429 (Too Many Requests)
- **User Action**: Wait for quota reset or upgrade plan
- **Example Message**: 
  ```
  Gemini API quota exceeded. Processed 3/10 pages successfully. 
  Please wait before retrying or check your quota at https://aistudio.google.com/app/apikey
  ```

#### 2. `AIAuthenticationError` (HTTP 401)
- **Cause**: Invalid or missing API key
- **Behavior**: Stop immediately with error
- **HTTP Status**: 401 (Unauthorized)
- **User Action**: Check API key configuration
- **Example Message**:
  ```
  Gemini API authentication failed. Please check your API key.
  ```

#### 3. `AIInvalidRequestError` (HTTP 400)
- **Cause**: Malformed request or incompatible model
- **Behavior**: Stop immediately with error
- **HTTP Status**: 400 (Bad Request)
- **User Action**: Report bug or check configuration
- **Example Message**:
  ```
  Invalid request to AI provider: [specific error details]
  ```

### Retryable Errors (Exponential Backoff)

These errors are temporary and may resolve with retrying:

#### 1. `AIRateLimitError` (HTTP 429)
- **Cause**: Temporary rate limiting
- **Behavior**: Retry with exponential backoff
- **Max Retries**: 2 (configurable)
- **Initial Delay**: 2 seconds
- **Backoff Factor**: 2x (4s, 8s...)
- **Jitter**: Yes (prevents thundering herd)
- **User Action**: None (automatic)

#### 2. Network Errors
- **Cause**: Connection issues, timeouts
- **Behavior**: Retry with exponential backoff
- **Covered By**: `httpx.RequestError`, `httpx.TimeoutException`
- **User Action**: None (automatic)

#### 3. Model Failures
- **Cause**: Temporary AI model issues
- **Behavior**: Retry with exponential backoff
- **Covered By**: `OpenAIError`, `AIProviderError`
- **User Action**: None (automatic)

## Implementation Details

### Custom Exception Hierarchy

```python
AIProviderError (base)
├── AIQuotaExceededError (non-retryable)
├── AIRateLimitError (retryable)
├── AIAuthenticationError (non-retryable)
└── AIInvalidRequestError (non-retryable)
```

### Error Detection in `ai_client.py`

The `_handle_gemini_error()` method converts generic Gemini exceptions to typed exceptions:

```python
def _handle_gemini_error(self, error: Exception) -> None:
    error_str = str(error).lower()
    
    # Check for quota exceeded (429 or ResourceExhausted)
    if "quota" in error_str or "resource" in error_str or "429" in error_str:
        raise AIQuotaExceededError(...)
    
    # Check for rate limiting
    if "rate limit" in error_str or "too many requests" in error_str:
        raise AIRateLimitError(...)
    
    # Check for authentication errors
    if "auth" in error_str or "permission" in error_str or "401" in error_str:
        raise AIAuthenticationError(...)
    
    # Check for invalid request
    if "invalid" in error_str or "400" in error_str:
        raise AIInvalidRequestError(...)
    
    # Generic API error
    raise AIProviderError(...)
```

### Retry Logic in `utils.py`

The `retry_with_backoff` decorator now supports excluding specific exceptions:

```python
@retry_with_backoff(
    max_retries=settings.max_retries,
    initial_delay=settings.retry_initial_delay,
    jitter=True,
    exceptions=(OpenAIError, httpx.RequestError, AIProviderError),
    exclude_exceptions=(AIQuotaExceededError, AIAuthenticationError, AIInvalidRequestError)
)
async def extract_page_text(...):
    # Function implementation
```

### Server Error Handling in `server.py`

Each API call is wrapped with specific error handling:

```python
try:
    extracted = await extract_page_text(image_data_url, p, request_id)
    extracted_data.append(f"--- PAGE {p} ---\n{extracted}")
    pages_processed += 1
    
except AIQuotaExceededError as e:
    # Fail immediately with progress report
    raise HTTPException(
        status_code=429,
        detail=f"Gemini API quota exceeded. Processed {p-1}/{max_pages} pages..."
    )
    
except AIAuthenticationError as e:
    # Fail immediately with auth error
    raise HTTPException(status_code=401, detail="Authentication failed...")
    
except AIInvalidRequestError as e:
    # Fail immediately with invalid request error
    raise HTTPException(status_code=400, detail="Invalid request...")
    
except Exception as e:
    # Log and continue (graceful degradation)
    logger.error(f"Page {p} extraction failed: {e}")
    failed_pages.append(p)
    continue
```

## Graceful Degradation

When processing multi-page documents, the system continues processing remaining pages if individual pages fail:

1. **Page 1 fails** (network timeout) → Retry 2 times → Skip if still fails → Continue to Page 2
2. **Page 2 succeeds** → Add to extracted_data → Continue
3. **Page 3 fails** (quota exceeded) → **STOP IMMEDIATELY** → Report pages 2 as completed

This approach ensures:
- Maximum data extraction before failure
- Clear communication about what succeeded
- No wasted API quota on impossible operations

## Configuration

Error handling behavior can be configured via environment variables:

```bash
# Maximum retry attempts (default: 2)
MAX_RETRIES=2

# Initial retry delay in seconds (default: 2.0)
RETRY_INITIAL_DELAY=2.0

# Backoff multiplier (default: 2.0)
RETRY_BACKOFF_FACTOR=2.0
```

## Monitoring and Debugging

All errors are logged with structured information:

```
[req-abc123] ERROR: Gemini quota exceeded on page 5: Quota exceeded. Please wait...
[req-abc123] WARNING: Attempt 1/3 failed for extract_page_text: Network timeout. Retrying in 2.1s...
[req-abc123] INFO: Page 6 extraction succeeded
```

Each log entry includes:
- **Request ID**: Unique identifier for tracing
- **Severity**: ERROR, WARNING, INFO, DEBUG
- **Context**: Function name, page number, error details
- **Action**: What the system is doing (retrying, stopping, continuing)

## Testing

The error handling system is tested in `test_error_handling.py`:

```bash
python3 test_error_handling.py
```

Tests verify:
- Exception hierarchy is correct
- Error messages are informative
- Error types can be distinguished
- Retry logic excludes non-retryable errors

## Best Practices

### For Users

1. **Monitor quota usage**: Check https://aistudio.google.com/app/apikey regularly
2. **Set up alerts**: Configure billing alerts in Google Cloud Console
3. **Use rate limits wisely**: Process documents during off-peak hours
4. **Have fallback**: Keep Ollama available for local processing

### For Developers

1. **Always check error type**: Use specific exception catches before generic ones
2. **Provide context**: Include page numbers and request IDs in error messages
3. **Log everything**: Log attempts, successes, and failures with appropriate severity
4. **Test error paths**: Simulate quota, auth, and network errors in tests
5. **Document assumptions**: Comment why certain errors are retryable vs not

## Comparison: Before vs After

### Before (Original Implementation)

```python
# ❌ All errors were retried indiscriminately
@retry_with_backoff(exceptions=(Exception,))
async def extract_page_text(...):
    return await ai_client.generate_with_image(...)

# Problem: Quota errors were retried, wasting quota
# Problem: Auth errors were retried, delaying failure notification
# Problem: No progress reporting on partial failures
```

### After (Fixed Implementation)

```python
# ✅ Only transient errors are retried
@retry_with_backoff(
    exceptions=(OpenAIError, httpx.RequestError, AIProviderError),
    exclude_exceptions=(AIQuotaExceededError, AIAuthenticationError, AIInvalidRequestError)
)
async def extract_page_text(...):
    try:
        return await ai_client.generate_with_image(...)
    except AIQuotaExceededError:
        logger.error("Quota exceeded - failing fast")
        raise
    except AIRateLimitError:
        logger.warning("Rate limit - will retry with backoff")
        raise

# Benefits: Quota errors fail immediately
# Benefits: Progress is reported (e.g., "Processed 5/10 pages")
# Benefits: Rate limits are handled with exponential backoff
```

## Troubleshooting

### Quota Exceeded on First Page

**Symptom**: Application fails immediately with 429 error on the first page.

**Diagnosis**:
```bash
# Check your quota usage
# Visit: https://aistudio.google.com/app/apikey

# Check logs for request details
grep "req-" backend.log | grep "429"
```

**Solutions**:
1. Wait for quota to reset (usually monthly)
2. Upgrade your Gemini API plan
3. Switch to Ollama for unlimited local processing

### Intermittent Rate Limit Errors

**Symptom**: Random failures with "rate limit exceeded" that eventually succeed.

**Diagnosis**: This is normal behavior. The system automatically retries with backoff.

**Solutions**:
1. No action needed - system handles automatically
2. Increase `MAX_RETRIES` if failures persist
3. Add delay between document processing

### Authentication Failures

**Symptom**: All requests fail with 401 error.

**Diagnosis**:
```bash
# Check API key is set
echo $GEMINI_API_KEY

# Check .env file
cat .env | grep GEMINI_API_KEY
```

**Solutions**:
1. Verify API key is correct (no extra spaces)
2. Generate new key at https://aistudio.google.com/app/apikey
3. Update .env file and restart application

## Related Documentation

- [GEMINI_INTEGRATION.md](./GEMINI_INTEGRATION.md) - Gemini setup and configuration
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and data flow
- [PERFORMANCE.md](./PERFORMANCE.md) - Performance optimization strategies
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Testing procedures

## Support

For issues related to error handling:
1. Check logs for request ID and error details
2. Review this document for error classification
3. Create an issue with request ID and error message
4. Include relevant log snippets (sanitize API keys!)

## Changelog

- **2026-01-18**: Initial comprehensive error handling implementation
  - Added typed exception hierarchy
  - Implemented retry exclusion for quota/auth errors
  - Added progress reporting on quota failures
  - Updated documentation
