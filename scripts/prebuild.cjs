#!/usr/bin/env node
// prebuild.cjs
// Cleans build caches and temporary artifacts before running `npm run build`.
// This script is run automatically by npm when a "prebuild" script is defined.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

const targets = [
  'dist',
  '.vite',
  'node_modules/.vite',
  'node_modules/.cache',
  '.cache',
  'logs',
  '.parcel-cache',
];

function rmrf(p) {
  const full = path.resolve(ROOT, p);
  try {
    if (fs.existsSync(full)) {
      console.log(`[prebuild] removing ${full}`);
      fs.rmSync(full, { recursive: true, force: true });
    }
  } catch (err) {
    console.warn(`[prebuild] failed removing ${full}: ${err.message}`);
  }
}

function safeExec(cmd) {
  try {
    console.log(`[prebuild] running: ${cmd}`);
    execSync(cmd, { stdio: 'inherit', cwd: ROOT });
  } catch (err) {
    console.warn(`[prebuild] command failed: ${cmd} -> ${err.message}`);
  }
}

// Remove listed targets
for (const t of targets) rmrf(t);

// Run npm cache clean to clear npm's cache (force)
safeExec('npm cache clean --force');

// Ensure pdf.worker.min.js from pdfjs-dist is available in `public/` so the
// bundler and runtime can load a matching worker version regardless of Vite
// resolution differences between dev and build.
try {
  const srcWorker = require('path').resolve(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js');
  const destDir = require('path').resolve(__dirname, '..', 'public');
  const dest = require('path').resolve(destDir, 'pdf.worker.min.js');
  if (require('fs').existsSync(srcWorker)) {
    if (!require('fs').existsSync(destDir)) require('fs').mkdirSync(destDir, { recursive: true });
    console.log(`[prebuild] copying pdf.worker.min.js -> ${dest}`);
    require('fs').copyFileSync(srcWorker, dest);
  } else {
    console.warn('[prebuild] pdf.worker.min.js not found in node_modules/pdfjs-dist/build; skipping copy');
  }
} catch (err) {
  console.warn('[prebuild] error while attempting to copy pdf.worker.min.js:', err && err.message ? err.message : err);
}

console.log('[prebuild] cleanup complete. Proceeding with build.');
