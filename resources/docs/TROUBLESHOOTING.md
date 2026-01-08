# Troubleshooting Inference Test Issues

This document addresses common issues found during inference testing and provides solutions.

## Overview

The test results in `screenshot_example_logs.md` revealed several issues that have been addressed:

1. **API Rate Limiting (429 Errors)**
2. **File System Errors (500 Errors)**
3. **Empty Component Results**
4. **Error Message Clarity**

## Issue 1: API Rate Limiting (HTTP 429 - Too Many Requests)

### Problem
```
AI Vision attempt 1 failed: [GoogleGenerativeAI Error]: Error fetching from 
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: 
[429 Too Many Requests] You exceeded your current quota, please check your plan and billing details.
```

### Root Cause
The Gemini API has rate limits and quota restrictions. When these are exceeded, the API returns a 429 error.

### Solutions

#### Solution 1: Enable Mock Mode (Recommended for Development)
Mock mode allows you to test the platform without consuming API quota:

1. Open your `.env` file (or create one from `.env.example`)
2. Add or uncomment these lines:
   ```env
   MOCK_MODE_ENABLED=true
   MOCK_MODE_DELAY_MS=500
   ```
3. Restart the server

Mock mode returns pre-recorded responses from `server/mocks/golden-record.json`.

#### Solution 2: Check Your API Quota
1. Visit https://ai.google.dev/gemini-api/docs/rate-limits
2. Check your current usage at https://ai.dev/rate-limit
3. Verify your billing details if needed
4. Consider upgrading your plan for higher quotas

#### Solution 3: Reduce Retry Attempts
The server now fails fast on rate limit errors instead of retrying (which wastes quota). The configuration has been optimized:
```env
VITE_RATE_LIMIT_MAX_RETRIES=2
```

### Improvements Made
- Server now returns HTTP 429 (instead of 500) for rate limit errors
- Retry logic now skips retries for rate limit and authentication errors
- Error messages now suggest enabling mock mode
- Default retry count reduced from 3 to 2 to conserve quota

---

## Issue 2: File System Errors (HTTP 500 on /api/projects/:projectId/tree)

### Problem
```
:3000/api/projects/default/tree?dir=.:1   Failed to load resource: 
the server responded with a status of 500 (Internal Server Error)
```

### Root Cause
The project directory didn't exist, causing the file tree endpoint to fail when trying to read it.

### Solution
The server now automatically creates missing project directories:

```javascript
// Check if directory exists, create if it doesn't
try {
  await fs.access(targetDir);
} catch (accessErr) {
  console.log(`[File Tree] Creating missing directory: ${targetDir}`);
  await fs.mkdir(targetDir, { recursive: true });
  return res.json({ tree: [] });
}
```

### Improvements Made
- Auto-creates missing project directories
- Returns empty tree for newly created directories
- Better error logging with context

---

## Issue 3: Empty Component Results

### Problem
```json
{
  "visual": {
    "components": [],
    "connections": [],
    "metadata": {
      "total_components": 0,
      "total_connections": 0,
      "error": "AI Proxy Error: An error occurred while processing the AI request."
    }
  }
}
```

### Root Cause
When the AI API fails (due to rate limiting or other errors), the visual analysis pipeline returns empty results.

### Solution
This is expected behavior when API calls fail. The improvements to error handling (see Issue 1) will now:

1. Return clear error messages indicating the specific problem (rate limit, auth, timeout)
2. Suggest actionable solutions (enable mock mode, check API key, etc.)
3. Prevent cascading errors by failing fast

### Best Practice
Always enable mock mode during development to avoid hitting rate limits:
```env
MOCK_MODE_ENABLED=true
```

---

## Issue 4: Generic Error Messages

### Problem
All API errors returned generic 500 status codes with unhelpful messages:
```
"error": "An error occurred while processing the AI request. Check server logs for details."
```

### Solution
The server now provides specific error messages based on error type:

| Error Type | Status Code | Message |
|------------|-------------|---------|
| Rate Limit | 429 | API rate limit exceeded. Please check your API quota and billing details, or try again later. Consider enabling MOCK_MODE_ENABLED=true in your .env file. |
| Authentication | 401 | API authentication failed. Please verify your GEMINI_API_KEY in the .env file is valid. |
| Timeout | 504 | AI request timed out. Try reducing image size or increasing VITE_AI_REQUEST_TIMEOUT_MS in .env. |
| Other | 500 | Generic error with specific details |

### Improvements Made
```javascript
// Check for rate limiting / quota errors (429)
if (error.status === 429 || error.statusText === 'Too Many Requests' || 
    errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
  statusCode = 429;
  errorDetails = 'API rate limit exceeded. Consider enabling MOCK_MODE_ENABLED=true...';
}
```

---

## Testing Your Fixes

### 1. Test with Mock Mode
```bash
# In your .env file
MOCK_MODE_ENABLED=true

# Start the server
npm run dev:api

# In another terminal
npm run dev
```

You should see:
```
Mock Mode: ENABLED (using server/mocks/golden-record.json)
WARNING: Mock mode is active. AI inference is bypassed.
```

### 2. Test File Tree Endpoint
Visit `http://localhost:3000` and open the project explorer. Missing directories should be created automatically.

### 3. Test Error Handling
Temporarily set an invalid API key to test error messages:
```env
VITE_AI_API_KEY=invalid_key_for_testing
MOCK_MODE_ENABLED=false
```

You should see a clear authentication error (401) instead of a generic 500 error.

---

## Configuration Reference

### Recommended Development Settings
```env
# Use mock mode to avoid quota issues
MOCK_MODE_ENABLED=true
MOCK_MODE_DELAY_MS=500

# Optimized retry settings (fails fast on rate limits)
VITE_RATE_LIMIT_MAX_RETRIES=2
VITE_RATE_LIMIT_DELAY_MS=800
VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF=true

# Reasonable timeouts
VITE_AI_REQUEST_TIMEOUT_MS=120000
AI_GENERATION_TIMEOUT_MS=180000
```

### Recommended Production Settings
```env
# Disable mock mode for live inference
MOCK_MODE_ENABLED=false

# Enable caching to reduce API calls
VITE_FEATURE_CACHE=true

# Same retry settings (server fails fast on 429/401/403)
VITE_RATE_LIMIT_MAX_RETRIES=2
VITE_RATE_LIMIT_DELAY_MS=800
VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF=true
```

---

## Summary of Changes

### Server (server/index.cjs)
1. ✅ Improved error handling with specific status codes (429, 401, 504)
2. ✅ Added fail-fast logic for rate limit and auth errors (no wasted retries)
3. ✅ Auto-create missing project directories
4. ✅ Better error logging with context
5. ✅ Clear, actionable error messages

### Configuration (.env.example)
1. ✅ Added mock mode documentation
2. ✅ Reduced default retries from 3 to 2
3. ✅ Added comments explaining fail-fast behavior

### Documentation
1. ✅ Created this troubleshooting guide
2. ✅ Documented all issues found in test results
3. ✅ Provided clear solutions for each issue

---

## Additional Resources

- **Gemini API Rate Limits**: https://ai.google.dev/gemini-api/docs/rate-limits
- **Check Your Usage**: https://ai.dev/rate-limit
- **Mock Mode Guide**: See `server/mocks/golden-record.json` for example data
- **Environment Configuration**: See `.env.example` for all available options

---

## Getting Help

If you continue to experience issues:

1. Check the server logs for detailed error messages
2. Verify your `.env` configuration matches the recommendations above
3. Try enabling mock mode to isolate API issues
4. Check that your API key is valid and has sufficient quota
5. Review the test results in `screenshot_example_logs.md` for comparison
