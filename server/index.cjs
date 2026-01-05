// Use 'dotenv' to load environment variables from the project's .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const http = require('http');
const cors = require('cors');
const chokidar = require('chokidar');
const { Server } = require('socket.io');

// ============================================================================
// CONFIGURATION
// ============================================================================
// Data Root: Where user projects are stored (default: ./data/projects)
const ROOT = path.resolve(process.env.DATA_ROOT || path.join(__dirname, '../data/projects'));
const PORT = process.env.PORT || 4000;

// AI Configuration
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.VITE_AI_API_KEY;
// Prefer explicit AI_MODEL_DEFAULT, then Vite's VITE_AI_MODEL (used across frontend),
// and fall back to the recommended model (gemini-2.5-flash).
const AI_MODEL_DEFAULT = process.env.AI_MODEL_DEFAULT || process.env.VITE_AI_MODEL || 'gemini-2.5-flash';

// Mock Mode Configuration (for zero-cost debugging)
const MOCK_MODE_ENABLED = process.env.MOCK_MODE_ENABLED === 'true';
const MOCK_DATA_PATH = path.join(__dirname, 'mocks', 'golden-record.json');
const MOCK_MODE_DELAY_MS = parseInt(process.env.MOCK_MODE_DELAY_MS || '500', 10);

const app = express();
app.use(cors());
// Increased JSON payload limit for large base64 images (50MB)
app.use(express.json({ limit: '50mb' }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// ============================================================================
// INITIALIZATION: DATA DIRECTORY & DEMO PROJECT
// ============================================================================
async function ensureDataDirectory() {
  try {
    // 1. Ensure ROOT exists
    await fs.mkdir(ROOT, { recursive: true });
    
    // 2. Check if empty
    const entries = await fs.readdir(ROOT);
    if (entries.length === 0) {
      console.log('📂 Data directory empty. Initializing Demo Project...');
      
      const demoPath = path.join(ROOT, 'Demo Project');
      await fs.mkdir(demoPath, { recursive: true });
      
      // 3. Copy example images if they exist
      const exampleImagesPath = path.join(__dirname, '../docs/example_images');
      try {
        await fs.access(exampleImagesPath); // Check if source exists
        const images = await fs.readdir(exampleImagesPath);
        
        for (const img of images) {
          if (img.match(/\.(jpg|jpeg|png|gif|pdf|dwg)$/i)) {
            await fs.copyFile(
              path.join(exampleImagesPath, img),
              path.join(demoPath, img)
            );
            console.log(`   - Copied: ${img}`);
          }
        }
      } catch (err) {
        console.warn('⚠️  Could not copy example images (docs/example_images not found).');
      }
    }
  } catch (err) {
    console.error('❌ Failed to initialize data directory:', err);
  }
}

// Run initialization
ensureDataDirectory();

// ============================================================================
// AI PROXY INITIALIZATION
// ============================================================================
let genAI = null;

try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  
  if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log(`✅ AI Proxy Initialized. Model: ${AI_MODEL_DEFAULT}`);
  } else {
    console.warn('⚠️  AI Proxy Warning: GEMINI_API_KEY not found. AI features disabled.');
  }
} catch (error) {
  console.error('⚠️  AI Proxy Error: @google/generative-ai module not found.');
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

// --- 1. Runtime Configuration (Fixes 404 Error) ---
app.get('/api/runtime-config', (req, res) => {
  res.json({
    aiProvider: AI_PROVIDER,
    features: {
      cache: process.env.VITE_FEATURE_CACHE === 'true',
      fileProcessing: process.env.VITE_FEATURE_FILE_PROCESSING === 'true',
    },
    limits: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
    }
  });
});

// --- 2. AI Vision Proxy ---
app.post('/api/ai/generateVision', async (req, res) => {
  // ============================================================================
  // MOCK MODE INTERCEPTION (Zero-Cost Debugging)
  // ============================================================================
  if (MOCK_MODE_ENABLED) {
    const { prompt } = req.body;
    
    // Detect request type based on prompt content
    const isClassificationRequest = prompt && (
      prompt.includes('Classify') || 
      prompt.includes('document type') ||
      prompt.includes('BLUEPRINT') && prompt.includes('SCHEMATIC') && prompt.includes('SPEC_SHEET')
    );
    
    if (isClassificationRequest) {
      // Return mock classification response for P&ID/Schematic
      console.log('⚠️  MOCK MODE: Returning mock classification (SCHEMATIC)');
      const classificationResponse = {
        type: 'SCHEMATIC',
        confidence: 0.95,
        reasoning: 'Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines'
      };
      
      if (MOCK_MODE_DELAY_MS > 0) {
        await new Promise(resolve => setTimeout(resolve, MOCK_MODE_DELAY_MS));
      }
      
      return res.json({ text: JSON.stringify(classificationResponse) });
    }
    
    // Otherwise, return visual analysis from golden-record.json
    console.warn('⚠️  MOCK MODE: Returning static golden-record.json for visual analysis');
    
    try {
      // Read the golden record JSON file
      const mockDataRaw = await fs.readFile(MOCK_DATA_PATH, 'utf-8');
      const mockData = JSON.parse(mockDataRaw);
      
      // Optional: Simulate realistic network latency
      // This helps frontend developers test loading states
      // Configurable via MOCK_MODE_DELAY_MS (default: 500ms)
      if (MOCK_MODE_DELAY_MS > 0) {
        await new Promise(resolve => setTimeout(resolve, MOCK_MODE_DELAY_MS));
      }
      
      // Return mock data as if it came from the AI
      // The frontend expects { text: string } format
      return res.json({ text: JSON.stringify(mockData) });
      
    } catch (error) {
      console.error('❌ Mock Mode Error:', error.message);
      
      // If mock file is missing or malformed, return 500 error
      // Do NOT fall back to live API silently (explicit failure is safer)
      return res.status(500).json({ 
        error: 'Mock mode enabled but mock data file is missing or invalid',
        details: error.message,
        path: MOCK_DATA_PATH
      });
    }
  }
  
  // ============================================================================
  // LIVE AI INFERENCE (Standard Path)
  // ============================================================================
  if (!genAI) return res.status(503).json({ error: 'AI not configured on server.' });
  
  const { imageData, prompt, mimeType, model, options } = req.body;
  if (!imageData || !prompt) return res.status(400).json({ error: 'Missing data.' });

    try {
    const modelName = model || AI_MODEL_DEFAULT;
    const geminiModel = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: options?.temperature ?? 0.1,
        responseMimeType: options?.responseMimeType,
        responseSchema: options?.responseSchema
      },
      systemInstruction: options?.systemInstruction,
    });

    // Debug: log a compact preview of the request shape and size (no sensitive data)
    try {
      console.log(`AI Vision Request -> model=${modelName} imageSize=${imageData ? imageData.length : 0} mimeType=${mimeType || 'image/png'} responseMimeType=${options?.responseMimeType || 'unset'}`);
    } catch (e) {
      // ignore logging failures
    }

    // Build the request payload once (avoid duplicating large buffers)
    const requestPayload = [
      prompt,
      { inlineData: { data: imageData, mimeType: mimeType || 'image/png' } }
    ];

    // Retry wrapper for transient network/fetch failures (undici).
    // Read retry/backoff settings from environment (falls back to sensible defaults).
    const MAX_ATTEMPTS = parseInt(process.env.VITE_RATE_LIMIT_MAX_RETRIES || process.env.RATE_LIMIT_MAX_RETRIES || '3', 10);
    const BASE_DELAY_MS = parseInt(process.env.VITE_RATE_LIMIT_DELAY_MS || process.env.RATE_LIMIT_DELAY_MS || '1000', 10);
    const EXP_BACKOFF = (process.env.VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF || process.env.RATE_LIMIT_EXPONENTIAL_BACKOFF || 'true') === 'true';
    const REQUEST_TIMEOUT_MS = parseInt(process.env.VITE_AI_REQUEST_TIMEOUT_MS || '60000', 10); // 60s default

    console.log(`AI Vision: retry settings -> attempts=${MAX_ATTEMPTS}, baseDelayMs=${BASE_DELAY_MS}, exponential=${EXP_BACKOFF}, timeoutMs=${REQUEST_TIMEOUT_MS}`);

    let result;
    let lastErr;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        result = await geminiModel.generateContent(requestPayload, { timeout: REQUEST_TIMEOUT_MS });
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        // Log attempt-level error with a short indicator
        console.error(`AI Vision attempt ${attempt} failed:`, err && err.message ? err.message : err);
        // If it's the last attempt, rethrow to be handled by outer catch
        if (attempt === MAX_ATTEMPTS) {
          throw lastErr;
        }
        // Backoff delay calculation (exponential or linear)
        const delayMs = EXP_BACKOFF ? BASE_DELAY_MS * Math.pow(2, attempt - 1) : BASE_DELAY_MS * attempt;
        await new Promise(resolve => setTimeout(resolve, Math.min(delayMs, 60_000)));
      }
    }

    const responseText = result.response.text();
    
    // Validate response is not empty
    if (!responseText || responseText.trim().length === 0) {
      console.error('AI Vision Error: Empty response from Gemini API');
      return res.status(500).json({ 
        error: 'Empty response from AI model',
        details: 'The AI model returned an empty response. Please try again.'
      });
    }
    
    // Log response for debugging (first 200 chars)
    console.log('AI Vision Response:', responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''));
    
    // For JSON responses, validate they're parseable
    if (options?.responseMimeType === 'application/json') {
      try {
        // Try to parse to validate it's valid JSON
        JSON.parse(responseText);
      } catch (jsonError) {
        console.error('AI Vision Error: Invalid JSON response:', responseText.substring(0, 500));
        return res.status(500).json({ 
          error: 'Invalid JSON response from AI model',
          details: 'The AI model returned a response that is not valid JSON. This may indicate a model configuration issue.',
        });
      }
    }
    
    res.json({ text: responseText });
  } catch (error) {
    console.error('AI Vision Error:', error.message);
    console.error('Full error details:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'An error occurred while processing the AI request. Check server logs for details.'
    });
  }
});

// --- 3. AI Text Proxy ---
app.post('/api/ai/generateText', async (req, res) => {
  if (!genAI) return res.status(503).json({ error: 'AI not configured on server.' });

  const { prompt, model, options } = req.body;
  try {
    const geminiModel = genAI.getGenerativeModel({
      model: model || AI_MODEL_DEFAULT,
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
        responseMimeType: options?.responseMimeType,
        responseSchema: options?.responseSchema
      },
      systemInstruction: options?.systemInstruction,
    });

    const result = await geminiModel.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error('AI Text Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// --- 4. Project & File Management ---

function inferFileType(name) {
  const ext = path.extname(name || '').toLowerCase().replace('.', '');
  if (!ext) return 'unknown';
  if (['pdf','png','jpg','jpeg','gif'].includes(ext)) return ext;
  if (['dwg','dxf'].includes(ext)) return 'dwg';
  if (['json','geojson'].includes(ext)) return 'json';
  return ext;
}

// List Projects (Top-level folders in ROOT)
app.get('/api/projects', async (req, res) => {
  try {
    const entries = await fs.readdir(ROOT, { withFileTypes: true });
    const projects = entries
      .filter(ent => ent.isDirectory() && !ent.name.startsWith('.'))
      .map(ent => ({ id: ent.name, name: ent.name, root: ent.name }));
    
    // Default fallback if empty
    if (projects.length === 0) projects.push({ id: 'default', name: 'Default Project', root: '.' });
    
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Project File Tree
app.get('/api/projects/:projectId/tree', async (req, res) => {
  try {
    const { projectId } = req.params;
    const dir = req.query.dir ? String(req.query.dir) : '.';
    
    // Security: Prevent traversal
    const projectRoot = path.join(ROOT, projectId);
    if (!projectRoot.startsWith(ROOT)) return res.status(403).json({ error: 'Access denied' });

    const targetDir = dir === '.' ? projectRoot : path.join(projectRoot, dir);
    if (!targetDir.startsWith(projectRoot)) return res.status(403).json({ error: 'Access denied' });

    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const children = [];

    for (const ent of entries) {
      if (['node_modules', '.git', 'dist'].includes(ent.name)) continue;
      
      const relPath = path.relative(projectRoot, path.join(targetDir, ent.name)).replace(/\\/g, '/');
      
      if (ent.isDirectory()) {
        children.push({ id: relPath, name: ent.name, type: 'folder' });
      } else {
        children.push({ 
          id: relPath, 
          name: ent.name, 
          type: 'file', 
          fileType: inferFileType(ent.name) 
        });
      }
    }
    
    // Sort folders first
    children.sort((a,b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1));
    
    res.json({ tree: children });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve File Content
app.get('/api/files/content', (req, res) => {
  const { path: relPath, projectId } = req.query;
  if (!relPath) return res.status(400).send('Missing path');
  
  // If projectId is provided, look inside that project, otherwise look in ROOT (legacy support)
  const base = projectId ? path.join(ROOT, String(projectId)) : ROOT;
  const absPath = path.join(base, String(relPath));

  if (!absPath.startsWith(ROOT)) return res.status(403).send('Forbidden');

  res.sendFile(absPath, (err) => {
    if (err) res.status(404).send('Not found');
  });
});

// ============================================================================
// FILE WATCHER & SOCKET.IO
// ============================================================================
const watcher = chokidar.watch(ROOT, { 
  ignored: /(^|[\/\\])\../, // Ignore dotfiles
  ignoreInitial: true, 
  depth: 5 
});

watcher
  .on('add', p => io.emit('file-added', { path: path.relative(ROOT, p).replace(/\\/g, '/') }))
  .on('change', p => io.emit('file-changed', { path: path.relative(ROOT, p).replace(/\\/g, '/') }))
  .on('unlink', p => io.emit('file-removed', { path: path.relative(ROOT, p).replace(/\\/g, '/') }));

io.on('connection', socket => {
  console.log('🔌 Client connected:', socket.id);
  socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
});

// ============================================================================
// START SERVER
// ============================================================================
server.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`);
  console.log(`Data Root: ${ROOT}`);
  console.log(`AI Provider: ${AI_PROVIDER} (${genAI ? 'Active' : 'Disabled'})`);

  // Mock Mode Status
  if (MOCK_MODE_ENABLED) {
    console.log(`Mock Mode: ENABLED (using ${MOCK_DATA_PATH})`);
    console.log(`Simulated latency: ${MOCK_MODE_DELAY_MS}ms`);
    console.warn('WARNING: Mock mode is active. AI inference is bypassed.');
  } else {
    console.log(`Mock Mode: DISABLED (live AI inference)`);
  }
});