#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// paths: script lives in scripts/golden_helpers -> go up two levels to project root
const GOLDEN_PATH = path.resolve(__dirname, '..', '..', 'server', 'mocks', 'golden-record.json');
const BOXES_PATH = path.resolve(__dirname, '..', '..', 'server', 'mocks', 'actual_annotations.json');
const OUT_PATH = path.resolve(__dirname, '..', '..', 'server', 'mocks', 'golden-record.updated.json');

function parseNumber(v){
  if (v == null) return NaN;
  return Number(String(v).replace(/[, ]+/g, ''));
}

if (!fs.existsSync(GOLDEN_PATH)){
  console.error('Golden record not found at', GOLDEN_PATH); process.exit(2);
}
if (!fs.existsSync(BOXES_PATH)){
  console.error('Boxes file not found at', BOXES_PATH); process.exit(3);
}

const golden = JSON.parse(fs.readFileSync(GOLDEN_PATH,'utf8'));
const boxesJson = JSON.parse(fs.readFileSync(BOXES_PATH,'utf8'));
const boxes = Array.isArray(boxesJson.boxes)? boxesJson.boxes.slice() : [];
const imgW = parseNumber(boxesJson.width) || parseNumber(boxesJson.imageWidth) || null;
const imgH = parseNumber(boxesJson.height) || parseNumber(boxesJson.imageHeight) || null;

if (!imgW || !imgH){
  console.error('Image width/height not found in boxes JSON; width=', boxesJson.width, 'height=', boxesJson.height);
  process.exit(4);
}

// Sort boxes top-to-bottom (y numeric ascending). If y is string, parse.
boxes.sort((a,b)=> parseNumber(a.y) - parseNumber(b.y));

const components = Array.isArray(golden.components) ? golden.components.slice() : [];

if (boxes.length < components.length) {
  console.warn('Warning: fewer boxes than components; mapping by available boxes');
}

// Assign normalized bbox to components in order
for (let i=0;i<components.length;i++){
  const comp = components[i];
  const box = boxes[i];
  if (!box) {
    console.warn(`No box for component index ${i} (${comp.id}), leaving bbox undefined`);
    continue;
  }
  const left = parseNumber(box.x);
  const top = parseNumber(box.y);
  const bw = parseNumber(box.width);
  const bh = parseNumber(box.height);
  const right = left + bw;
  const bottom = top + bh;
  // normalize and round to 3 decimal places (per guide: at least 3 decimal places)
  const round3 = v => Math.round(v * 1000) / 1000;
  const ymin = round3(top / imgH);
  const xmin = round3(left / imgW);
  const ymax = round3(bottom / imgH);
  const xmax = round3(right / imgW);

  // Build a normalized component in the requested canonical shape.
  // Preserve existing values when available, otherwise use sensible defaults.
  const existingMeta = comp.meta && typeof comp.meta === 'object' ? { ...comp.meta } : {};

  const canonical = {
    id: comp.id || comp.label || `component-${i}`,
    type: comp.type || 'unknown',
    label: comp.label || comp.id || '',
    bbox: [ymin, xmin, ymax, xmax],
    confidence: (typeof comp.confidence === 'number' && !Number.isNaN(comp.confidence)) ? comp.confidence : 0.95,
    rotation: (typeof comp.rotation === 'number' && !Number.isNaN(comp.rotation)) ? comp.rotation : 0,
    meta: {
      // tag preferred: existing meta.tag -> label -> id -> box.label
      tag: existingMeta.tag || comp.label || comp.id || box.label || '',
      // description and reasoning preserved if present
      description: existingMeta.description || existingMeta.desc || '',
      reasoning: existingMeta.reasoning || existingMeta.reason || undefined,
      // merge any remaining meta keys (but do not overwrite the canonical ones)
      ...Object.fromEntries(Object.entries(existingMeta).filter(([k]) => !['tag','description','desc','reasoning','reason'].includes(k)))
    }
  };

  // If the box itself has a label and meta.tag is empty, use that
  if ((!canonical.meta.tag || canonical.meta.tag === '') && box.label) canonical.meta.tag = box.label;

  // Replace the existing component with the canonical shape
  components[i] = canonical;
}

const out = {
  components,
  connections: golden.connections || [],
  metadata: golden.metadata || { total_components: components.length, total_connections: (golden.connections||[]).length }
};

// Stringify with indentation, then collapse any multi-line bbox arrays to a single-line
let text = JSON.stringify(out, null, 4);
// Replace occurrences like:
// "bbox": [\n    0.123,\n    0.456,\n    0.789,\n    0.012\n]
// with: "bbox": [0.123, 0.456, 0.789, 0.012]
text = text.replace(/"bbox": \[\s*([\d\.\-eE\+,\s]+?)\s*\]/g, (m, g) => {
  const nums = g.replace(/\s+/g, ' ').trim().replace(/\s*,\s*/g, ', ');
  return `"bbox": [${nums}]`;
});

fs.writeFileSync(OUT_PATH, text, 'utf8');
console.log('Wrote updated golden record to', OUT_PATH);
console.log('If this looks good, move it to', GOLDEN_PATH, 'or replace the original.');
