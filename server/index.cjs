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
  if (!genAI) return res.status(503).json({ error: 'AI not configured on server.' });
  
  const { imageData, prompt, mimeType, model, options } = req.body;
  if (!imageData || !prompt) return res.status(400).json({ error: 'Missing data.' });

  try {
    const geminiModel = genAI.getGenerativeModel({
      model: model || AI_MODEL_DEFAULT,
      generationConfig: {
        temperature: options?.temperature ?? 0.1,
        responseMimeType: options?.responseMimeType,
        responseSchema: options?.responseSchema
      },
      systemInstruction: options?.systemInstruction,
    });

    const result = await geminiModel.generateContent([
      prompt,
      { inlineData: { data: imageData, mimeType: mimeType || 'image/png' } }
    ]);
    
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error('AI Vision Error:', error.message);
    res.status(500).json({ error: error.message });
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
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📂 Data Root: ${ROOT}`);
  console.log(`🤖 AI Provider: ${AI_PROVIDER} (${genAI ? 'Active' : 'Disabled'})`);
});