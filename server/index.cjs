const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const http = require('http');
const cors = require('cors');
const chokidar = require('chokidar');
const { Server } = require('socket.io');

const ROOT = path.resolve(process.env.DATA_ROOT || path.join(__dirname, '../data/projects'));
const PORT = process.env.PORT || 4000;

// Ensure data directory exists and has demo content
async function ensureDataDirectory() {
  try {
    await fs.access(ROOT);
  } catch {
    // Create data/projects directory
    await fs.mkdir(ROOT, { recursive: true });
    console.log('Created data directory:', ROOT);
  }

  // Check if directory is empty
  const entries = await fs.readdir(ROOT);
  if (entries.length === 0) {
    // Create Demo Project folder
    const demoPath = path.join(ROOT, 'Demo Project');
    await fs.mkdir(demoPath, { recursive: true });
    
    // Copy sample images from docs/example_images to demo project
    const exampleImagesPath = path.join(__dirname, '../docs/example_images');
    try {
      const images = await fs.readdir(exampleImagesPath);
      for (const img of images) {
        if (img.match(/\.(jpg|jpeg|png|gif|pdf)$/i)) {
          const src = path.join(exampleImagesPath, img);
          const dest = path.join(demoPath, img);
          await fs.copyFile(src, dest);
        }
      }
      console.log('Created Demo Project with sample images');
    } catch (err) {
      console.warn('Could not copy sample images:', err.message);
    }
  }
}

// Initialize data directory before starting server
(async () => {
  await ensureDataDirectory();
})().catch(err => console.error('Failed to initialize data directory:', err));

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

function inferFileType(name) {
  const ext = path.extname(name || '').toLowerCase().replace('.', '');
  if (!ext) return undefined;
  if (['pdf','png','jpg','jpeg','gif'].includes(ext)) return ext;
  if (['dwg','dxf'].includes(ext)) return 'dwg';
  if (['json','geojson'].includes(ext)) return 'json';
  return ext;
}

async function readTree(dir) {
  async function recurse(fullPath) {
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    const children = [];
    for (const ent of entries) {
      if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'dist' || ent.name === 'logs') continue;
      const full = path.join(fullPath, ent.name);
      try {
        const stat = await fs.stat(full);
        if (stat.isDirectory()) {
          const node = {
            id: path.relative(ROOT, full).replace(/\\/g, '/'),
            name: ent.name,
            type: 'folder',
            children: await recurse(full),
          };
          children.push(node);
        } else {
          children.push({
            id: path.relative(ROOT, full).replace(/\\/g, '/'),
            name: ent.name,
            type: 'file',
            fileType: inferFileType(ent.name),
          });
        }
      } catch (e) {
        // skip unreadable files
      }
    }
    return children.sort((a,b)=> (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1));
  }

  return recurse(dir);
}

app.get('/api/projects', async (req, res) => {
  try {
    // List all directories in ROOT as separate projects
    const entries = await fs.readdir(ROOT, { withFileTypes: true });
    const projects = [];
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        projects.push({
          id: entry.name,
          name: entry.name,
          root: entry.name
        });
      }
    }
    
    // If no projects, return a default one
    if (projects.length === 0) {
      projects.push({ id: 'local', name: 'Projects', root: '.' });
    }
    
    res.json({ projects });
  } catch (err) {
    console.error('Error listing projects:', err);
    res.json({ projects: [ { id: 'local', name: 'Projects', root: '.' } ] });
  }
});

app.get('/api/projects/:projectId/tree', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const dir = req.query.dir ? String(req.query.dir) : '.';
    
    // Resolve the project root directory
    const projectRoot = path.join(ROOT, projectId);
    if (!projectRoot.startsWith(ROOT)) return res.status(400).json({ error: 'Invalid project' });
    
    // Resolve directory within project
    const absDir = dir === '.' ? projectRoot : path.join(projectRoot, dir.replace(new RegExp(`^${projectId}/?`), ''));
    if (!absDir.startsWith(projectRoot)) return res.status(400).json({ error: 'Invalid directory' });

    // Return top-level immediate children (non-recursive)
    async function readImmediateChildren(fullPath) {
      const entries = await fs.readdir(fullPath, { withFileTypes: true });
      const children = [];
      for (const ent of entries) {
        if (ent.name === 'node_modules' || ent.name === '.git' || ent.name === 'dist' || ent.name === 'logs') continue;
        const full = path.join(fullPath, ent.name);
        try {
          const stat = await fs.stat(full);
          if (stat.isDirectory()) {
            children.push({
              id: path.join(projectId, path.relative(projectRoot, full)).replace(/\\/g, '/'),
              name: ent.name,
              type: 'folder'
            });
          } else {
            children.push({
              id: path.join(projectId, path.relative(projectRoot, full)).replace(/\\/g, '/'),
              name: ent.name,
              type: 'file',
              fileType: inferFileType(ent.name)
            });
          }
        } catch (e) {
          // skip
        }
      }
      return children.sort((a,b)=> (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1));
    }

    const children = await readImmediateChildren(absDir);
    res.json({ tree: children });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/files/content', (req, res) => {
  const rel = req.query.path;
  if (!rel) return res.status(400).send('Missing path');
  const abs = path.join(ROOT, rel);
  // prevent path traversal
  if (!abs.startsWith(ROOT)) return res.status(403).send('Forbidden');
  res.sendFile(abs, err => {
    if (err) res.status(404).send('Not found');
  });
});

// === AI / Gemini proxy endpoints (server-side) ===
app.post('/api/generate-thinking', async (req, res) => {
  try {
    const { prompt, history } = req.body || {};
    // Require the service at runtime to avoid bundling server SDKs into client code
    const svc = require('../services/geminiService');
    const text = await svc.generateThinkingResponse(prompt || '', history || []);
    res.json({ text });
  } catch (e) {
    console.error('generate-thinking error', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/analyze-blueprint', async (req, res) => {
  try {
    const { image } = req.body || {};
    const svc = require('../services/geminiService');
    const result = await svc.analyzeBlueprintImage(image || '');
    // result is stringified JSON from the service
    res.json(JSON.parse(result));
  } catch (e) {
    console.error('analyze-blueprint error', e);
    res.status(500).json({ error: String(e) });
  }
});

app.post('/api/generate-inventory', async (req, res) => {
  try {
    const { analysis } = req.body || {};
    const svc = require('../services/geminiService');
    const inv = await svc.generateInventoryFromAnalysis(analysis || '');
    res.json(JSON.parse(inv));
  } catch (e) {
    console.error('generate-inventory error', e);
    res.status(500).json({ error: String(e) });
  }
});

// Watch for file changes and broadcast minimal events
const watcher = chokidar.watch(ROOT, { ignored: /node_modules|\.git|dist|logs/, ignoreInitial: true, depth: 5 });
watcher
  .on('add', p => io.emit('file-added', { path: path.relative(ROOT, p).replace(/\\/g, '/') }))
  .on('change', p => io.emit('file-changed', { path: path.relative(ROOT, p).replace(/\\/g, '/') }))
  .on('unlink', p => io.emit('file-removed', { path: path.relative(ROOT, p).replace(/\\/g, '/') }));

io.on('connection', socket => {
  // basic connection logging
  console.log('socket connected', socket.id);
  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
});

server.listen(PORT, () => console.log('Local file API listening on', PORT, 'root=', ROOT));
