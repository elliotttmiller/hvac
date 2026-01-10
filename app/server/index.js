import express from 'express';
import cors from 'cors';
import { stage1Extraction, stage2Analysis, getCacheStats } from './aiService.js';

const app = express();
const PORT = process.env.PORT_SERVER || 4000;

// Configuration constants
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;
const MIN_BASE64_LENGTH = 100; // Minimum length for valid base64 image data

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Request tracking for rate limiting
const requestCounts = new Map();

// Simple rate limiting middleware
function rateLimit(req, res, next) {
  const clientId = req.ip || 'unknown';
  const now = Date.now();
  
  if (!requestCounts.has(clientId)) {
    requestCounts.set(clientId, []);
  }
  
  const requests = requestCounts.get(clientId);
  // Remove old requests outside the window
  const recentRequests = requests.filter(time => now - time < RATE_LIMIT_WINDOW_MS);
  
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ 
      error: 'rate_limit_exceeded', 
      message: 'Too many requests. Please wait before trying again.' 
    });
  }
  
  recentRequests.push(now);
  requestCounts.set(clientId, recentRequests);
  next();
}

// Input validation middleware
function validateImageData(req, res, next) {
  const { base64Image, mimeType } = req.body;
  
  if (!base64Image || typeof base64Image !== 'string') {
    return res.status(400).json({ error: 'invalid_request', message: 'base64Image is required and must be a string' });
  }
  
  // Validate base64 format (minimum length check for valid image data)
  if (base64Image.length < MIN_BASE64_LENGTH) {
    return res.status(400).json({ error: 'invalid_request', message: 'base64Image appears to be too short' });
  }
  
  // Validate mime type if provided
  if (mimeType && !['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(mimeType)) {
    return res.status(400).json({ error: 'invalid_request', message: 'Unsupported mimeType. Use image/png, image/jpeg, or image/webp' });
  }
  
  next();
}

// Enhanced error handler with retry suggestions
function handleError(err, endpoint) {
  console.error(`[${endpoint}] Error:`, err.message);
  
  const errorResponse = {
    error: 'processing_error',
    message: 'AI processing failed',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  };
  
  // Check for common error types
  if (err.message.includes('timeout')) {
    errorResponse.error = 'timeout';
    errorResponse.message = 'Request timed out. Please try again with a smaller image.';
    errorResponse.retryable = true;
  } else if (err.message.includes('quota') || err.message.includes('rate limit')) {
    errorResponse.error = 'quota_exceeded';
    errorResponse.message = 'API quota exceeded. Please try again later.';
    errorResponse.retryable = true;
  } else if (err.message.includes('invalid') || err.message.includes('API key')) {
    errorResponse.error = 'configuration_error';
    errorResponse.message = 'Server configuration error. Please contact administrator.';
    errorResponse.retryable = false;
  }
  
  return errorResponse;
}

// Stage 1: Component Extraction
app.post('/api/ai/extract', rateLimit, validateImageData, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { base64Image, mimeType } = req.body;
    console.log(`[extract] Processing request (image size: ${base64Image.length} chars)`);
    
    const result = await stage1Extraction(base64Image, mimeType || 'image/png');
    
    const duration = Date.now() - startTime;
    console.log(`[extract] Success (${duration}ms, ${result.detectedComponents?.length || 0} components)`);
    
    res.json({
      ...result,
      meta: {
        processingTime: duration,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    const errorResponse = handleError(err, 'extract');
    res.status(500).json(errorResponse);
  }
});

// Stage 2: Analysis Report
app.post('/api/ai/analyze', rateLimit, validateImageData, async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { base64Image, mimeType, detectedComponents } = req.body;
    console.log(`[analyze] Processing request (${detectedComponents?.length || 0} components)`);
    
    const result = await stage2Analysis(base64Image, mimeType || 'image/png', detectedComponents || []);
    
    const duration = Date.now() - startTime;
    console.log(`[analyze] Success (${duration}ms)`);
    
    res.json({
      ...result,
      meta: {
        processingTime: duration,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    const errorResponse = handleError(err, 'analyze');
    res.status(500).json(errorResponse);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Cache statistics endpoint
app.get('/api/cache/stats', (req, res) => {
  try {
    const stats = getCacheStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'failed_to_get_stats', message: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'not_found', message: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`✅ AI proxy server listening on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Rate limit: ${MAX_REQUESTS_PER_WINDOW} requests per minute`);
});
