const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const multer = require('multer');
const express = require('express');
const http = require('http');
const cors = require('cors');
const chokidar = require('chokidar');
const { Server } = require('socket.io');

const ROOT = path.resolve(process.env.WORKSPACES_ROOT || path.join(__dirname, '..'));
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const PROJECTS_FILE = path.join(__dirname, 'data', 'projects.json');

async function readProjectsFile() {
  try {
    const txt = await fs.readFile(PROJECTS_FILE, 'utf8');
    const parsed = JSON.parse(txt || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (e) {
    return [];
  }
}

async function writeProjectsFile(arr) {
  try {
    await fs.writeFile(PROJECTS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write projects file', e);
    throw e;
  }
}

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
    const projects = await readProjectsFile();
    if (!projects || projects.length === 0) {
      return res.json({ projects: [ { id: 'local', name: path.basename(ROOT), root: '.' } ] });
    }
    return res.json({ projects });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// File upload for a specific project - saves file to project folder under ROOT and appends metadata
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const projDir = path.join(ROOT, req.params.id || 'default');
    try {
      fsSync.mkdirSync(projDir, { recursive: true });
      cb(null, projDir);
    } catch (e) {
      cb(e);
    }
  },
  filename: function (req, file, cb) {
    const name = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, name);
  }
});
const upload = multer({ storage });

app.post('/api/projects/:id/files', upload.single('file'), async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!req.file) return res.status(400).json({ error: 'Missing file' });

    const projects = await readProjectsFile();
    const idx = projects.findIndex(p => p.id === projectId);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });

    const file = req.file;
    const relPath = path.relative(ROOT, file.path).replace(/\\/g, '/');
    const meta = {
      id: Date.now().toString() + '-' + Math.random().toString(36).slice(2, 8),
      name: file.originalname,
      filename: file.filename,
      size: file.size,
      path: relPath,
      uploadedAt: new Date().toISOString(),
      analyzedAt: null,
    };

    const existing = projects[idx];
    const nextFiles = Array.isArray(existing.files) ? [...existing.files, meta] : [meta];
    const updated = { ...existing, files: nextFiles };
    projects[idx] = updated;
    await writeProjectsFile(projects);

    res.json({ project: updated });
  } catch (e) {
    console.error('POST /api/projects/:id/files error', e);
    res.status(500).json({ error: e.message });
  }
});

// Create a new project and persist
app.post('/api/projects', async (req, res) => {
  try {
    const { name, location, notes } = req.body || {};
    if (!name) return res.status(400).json({ error: 'Missing name' });
    const projects = await readProjectsFile();
    const id = Date.now().toString();
    const project = {
      id,
      name,
      location: location ?? null,
      notes: notes ?? null,
      createdAt: new Date().toISOString(),
      status: 'not_started'
    };
    projects.push(project);
    await writeProjectsFile(projects);
    res.status(201).json({ project });
  } catch (e) {
    console.error('POST /api/projects error', e);
    res.status(500).json({ error: e.message });
  }
});

// Patch/update a project
app.patch('/api/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body || {};
    const projects = await readProjectsFile();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const existing = projects[idx];
    const updated = { ...existing, ...updates };
    projects[idx] = updated;
    await writeProjectsFile(projects);
    res.json({ project: updated });
  } catch (e) {
    console.error('PATCH /api/projects/:id error', e);
    res.status(500).json({ error: e.message });
  }
});

// Delete a project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const projects = await readProjectsFile();
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    projects.splice(idx, 1);
    await writeProjectsFile(projects);
    res.status(204).send();
  } catch (e) {
    console.error('DELETE /api/projects/:id error', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/projects/:projectId/tree', async (req, res) => {
  try {
    const tree = await readTree(ROOT);
    res.json({ tree });
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

// Add runtime-config endpoint
app.get('/api/runtime-config', (req, res) => {
  res.json({
    apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:4000',
    environment: process.env.NODE_ENV || 'development',
  });
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
