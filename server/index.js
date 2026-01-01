const path = require('path');
const fs = require('fs').promises;
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
  // single project representing the repo root
  res.json({ projects: [ { id: 'local', name: path.basename(ROOT), root: '.' } ] });
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
