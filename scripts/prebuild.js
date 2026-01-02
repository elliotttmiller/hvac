#!/usr/bin/env node
/**
 * prebuild.js
 * Run automatically before `npm run build` (via npm's pre<task> hook).
 * This script removes build/runtime caches to ensure a fresh build.
 * It deletes common cache locations such as `.next`, `node_modules/.cache`, and `node_modules/.vite`.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Determine the workspace root dynamically. Prefer an explicit env var
// PREBUILD_ROOT for CI or special setups; otherwise use the current
// working directory (what `npm` sets when running lifecycle scripts).
const root = process.env.PREBUILD_ROOT
  ? path.resolve(process.env.PREBUILD_ROOT)
  : path.resolve(process.cwd());
console.log(`Using prebuild root: ${root}`);

const targets = [
  path.join(root, '.next'),
  path.join(root, '.vite'),                // Vite's top-level cache
  path.join(root, 'node_modules', '.vite'),
  path.join(root, 'node_modules', '.cache'),
  path.join(root, '.parcel-cache'),
  path.join(root, '.cache'),               // generic cache dir
  path.join(root, 'dist'),                 // optionally remove dist to ensure clean output
];

function rmrf(target) {
  try {
    if (fs.existsSync(target)) {
      console.log(`Removing ${target}`);
      // Use rmSync with recursive and force
      fs.rmSync(target, { recursive: true, force: true });
      console.log(`Removed ${target}`);
    } else {
      console.log(`Not found: ${target}`);
    }
  } catch (err) {
    console.error(`Failed to remove ${target}:`, err);
    process.exitCode = 1;
  }
}

for (const t of targets) {
  rmrf(t);
}

console.log('Prebuild cleanup completed.');
