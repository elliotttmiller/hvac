# Gemini AI Provider Integration Guide

This guide explains how to use Google Gemini (2.5 Flash and 3 Flash Preview) with the HVAC Analysis application.

## Overview

The HVAC Analysis application now supports two AI providers:
- **Ollama** (default) - Local AI inference with models like Qwen 2.5 VL
- **Google Gemini** - Cloud-based AI inference with Gemini 2.5 Flash or Gemini 3 Flash Preview

## Supported Gemini Models

- `gemini-2.0-flash-exp` - Gemini 2.5 Flash (recommended)
- `gemini-2.0-flash-thinking-exp-01-21` - Gemini 3 Flash Preview (experimental)

## Configuration

### Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Environment Variables

You have two options for configuration:

#### Option A: Using `.env` file (Development)

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set the following:
   ```bash
   # AI Provider Configuration
   AI_PROVIDER=gemini
   
   # Google Gemini Configuration
   GEMINI_API_KEY=your-actual-api-key-here
   GEMINI_MODEL=gemini-2.0-flash-exp
   ```

#### Option B: Using `.env.local` file (Production)

1. Create a `.env.local` file:
   ```bash
   touch .env.local
   ```

2. Add your configuration:
   ```bash
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your-actual-api-key-here
   GEMINI_MODEL=gemini-2.0-flash-exp
   ```

**Note:** `.env.local` takes precedence over `.env` and is automatically ignored by git.

### Step 3: Verify Configuration

Run the integration test to verify your setup:

```bash
# Test with Ollama (default)
AI_PROVIDER=ollama python3 test_gemini_integration.py

# Test with Gemini (requires API key)
AI_PROVIDER=gemini GEMINI_API_KEY=your-key python3 test_gemini_integration.py
```

## Usage

### Starting the Application

Once configured, start the application normally:

```bash
# Using the orchestrated startup script
python start.py

# Or manually
python -m uvicorn backend.server:app --reload --port 8000
```

The application will automatically use the configured AI provider.

### Switching Between Providers

To switch providers, update your `.env` or `.env.local` file:

**For Ollama:**
```bash
AI_PROVIDER=ollama
```

**For Gemini:**
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your-actual-api-key-here
```

Then restart the application.

## Model Selection

### Gemini 2.5 Flash (`gemini-2.0-flash-exp`)

- **Use case:** General purpose, balanced performance
- **Strengths:** Fast inference, cost-effective, good quality
- **Best for:** Most HVAC analysis tasks

### Gemini 3 Flash Preview (`gemini-2.0-flash-thinking-exp-01-21`)

- **Use case:** Experimental, advanced reasoning
- **Strengths:** Enhanced reasoning capabilities, complex analysis
- **Best for:** Detailed engineering analysis, complex blueprints
- **Note:** Experimental model, may change

To change models, update your `.env`:

```bash
GEMINI_MODEL=gemini-2.0-flash-exp
# or
GEMINI_MODEL=gemini-2.0-flash-thinking-exp-01-21
```

## Cost Considerations

### Ollama (Local)
- **Cost:** Free (uses your local hardware)
- **Requirements:** GPU with 8GB+ VRAM
- **Pros:** No API costs, complete privacy, offline capable
- **Cons:** Slower on consumer hardware, requires local setup

### Gemini (Cloud)
- **Cost:** Pay per token (see [Google AI Pricing](https://ai.google.dev/pricing))
- **Requirements:** Internet connection, API key
- **Pros:** Fast inference, no local GPU needed, always up-to-date
- **Cons:** API costs, requires internet, data sent to cloud

**Estimated costs per analysis:**
- Simple blueprint (5 pages): ~$0.01-0.05
- Complex blueprint (20 pages): ~$0.05-0.20

## Troubleshooting

### Understanding Error Types

The application distinguishes between different types of errors and handles them appropriately:

**Non-Retryable Errors (Fail Fast):**
- **Quota Exceeded (429)**: Your API quota is exhausted. The system will stop immediately and report progress.
- **Authentication Failed (401)**: Invalid or missing API key. Check your configuration.
- **Invalid Request (400)**: Malformed request. Usually indicates a bug or incompatible model.

**Retryable Errors (Automatic Retry):**
- **Rate Limit (429)**: Temporary rate limiting. The system automatically retries with exponential backoff.
- **Network Errors**: Connection issues. The system retries up to 2 times.
- **Timeout**: Request took too long. The system retries with backoff.

**Graceful Degradation:**
- If individual pages fail during extraction, the system continues processing remaining pages
- Final report indicates which pages were successfully processed
- Partial results are better than total failure

### Error: "GEMINI_API_KEY must be set when using gemini provider"

**Solution:** Ensure you've set a valid API key in your `.env` or `.env.local` file.

```bash
# Check your configuration
cat .env | grep GEMINI_API_KEY
```

### Error: "Invalid API key"

**Solution:** Verify your API key is correct:
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Check your API key
3. Copy it exactly (no extra spaces)
4. Update your `.env` file

### Error: "Rate limit exceeded"

**Solution:** You've hit the Gemini API rate limit. The application will automatically retry with exponential backoff. Options:
1. Wait - The system will retry automatically with increasing delays
2. Request a rate limit increase from Google
3. Switch to Ollama for unlimited local processing

**Note:** The application now handles rate limiting gracefully with automatic retries.

### Error: "Quota exceeded"

**Solution:** You've exhausted your Gemini API quota. The application will stop processing and report how many pages were successfully completed. Options:
1. Wait until your quota resets (usually monthly)
2. Upgrade your Gemini API plan for higher quotas
3. Switch to Ollama for unlimited local processing
4. Resume processing later - the system reports which pages were completed

**Note:** The application will NOT retry quota exceeded errors to avoid burning through your quota faster.

### Mixed Results Quality

**Tip:** Different models may perform differently on your specific blueprints:
- Try both Gemini 2.5 Flash and 3 Flash Preview
- Compare with Ollama results
- Adjust temperature settings in `config.py` if needed

## Advanced Configuration

### Custom Temperature Settings

Edit `backend/config.py` to adjust AI behavior:

```python
# For more deterministic results (less creative)
extraction_temperature: float = 0.0
reasoning_temperature: float = 0.0

# For more creative/flexible results
extraction_temperature: float = 0.3
reasoning_temperature: float = 0.5
```

### Custom Token Limits

Adjust token limits for longer/shorter responses:

```python
extraction_max_tokens: int = 2000  # Increase for detailed extraction
context_window_max_tokens: int = 28000  # Increase for large documents
```

## Security Best Practices

1. **Never commit your API key to git**
   - Use `.env.local` (automatically git-ignored)
   - Or use environment variables

2. **Rotate your API keys regularly**
   - Generate new keys periodically
   - Revoke old keys

3. **Monitor your API usage**
   - Check [Google Cloud Console](https://console.cloud.google.com/)
   - Set up billing alerts

4. **Use environment-specific keys**
   - Different keys for dev/staging/production
   - Easier to track and revoke if needed

## Testing Your Setup

Run the comprehensive test suite:

```bash
# Basic tests (no API key needed)
python3 test_gemini_integration.py

# With your API key
AI_PROVIDER=gemini GEMINI_API_KEY=your-key python3 test_gemini_integration.py
```

Expected output:
```
============================================================
GEMINI INTEGRATION TEST SUITE
============================================================

TEST 1: Ollama Provider
✓ All Ollama tests passed!

TEST 2: Gemini Provider Validation
✓ All Gemini validation tests passed!

TEST 3: Gemini Provider Initialization
✓ Gemini initialization test passed!

TEST 4: Provider Switching
✓ Provider switching test passed!

============================================================
TEST SUMMARY
============================================================
Tests passed: 4/4

✅ ALL TESTS PASSED!
```

## Migration from Ollama to Gemini

If you're currently using Ollama and want to try Gemini:

1. Keep your existing `.env` as-is (Ollama configuration)
2. Create `.env.local` with Gemini configuration
3. Application will automatically use `.env.local`
4. To switch back, delete or rename `.env.local`

This allows easy switching without losing your configurations.

## Support

- **Issues:** [GitHub Issues](https://github.com/elliotttmiller/hvac/issues)
- **Documentation:** [docs/](../docs/)
- **Gemini API Docs:** [Google AI Documentation](https://ai.google.dev/docs)

## FAQ

**Q: Can I use both Ollama and Gemini?**  
A: Not simultaneously, but you can easily switch by changing `AI_PROVIDER` and restarting.

**Q: Which model is better for my use case?**  
A: Try both! Gemini is faster and doesn't require local GPU. Ollama is free and private. For most users, start with Gemini 2.5 Flash.

**Q: Is my data private with Gemini?**  
A: Data sent to Gemini is processed by Google. For complete privacy, use Ollama. See [Google's Privacy Policy](https://policies.google.com/privacy).

**Q: Can I use this in production?**  
A: Yes! Both providers are production-ready. Ensure you have proper error handling and monitoring in place.

**Q: What happens if Gemini API is down?**  
A: The application will fail to process documents. Consider implementing fallback to Ollama for critical applications.

## Changelog

- **2026-01-18**: Initial Gemini integration
  - Added support for Gemini 2.5 Flash and 3 Flash Preview
  - Created AI client abstraction layer
  - Added comprehensive test suite
  - Updated documentation
