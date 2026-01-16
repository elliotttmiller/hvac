#!/usr/bin/env node
// prebuild.js
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
    const out = execSync(cmd, { stdio: 'inherit', cwd: ROOT });
    return out;
  } catch (err) {
    console.warn(`[prebuild] command failed: ${cmd} -> ${err.message}`);
  }
}

// Remove listed targets
for (const t of targets) rmrf(t);

// Run npm cache clean to clear npm's cache (force) - optional but requested
safeExec('npm cache clean --force');

console.log('[prebuild] cleanup complete. Proceeding with build.');
