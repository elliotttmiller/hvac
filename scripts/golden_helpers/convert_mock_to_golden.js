#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC = path.resolve(__dirname, '..', 'server', 'mocks', 'golden-record.json');
const OUT = path.resolve(__dirname, '..', 'server', 'mocks', 'golden-record.converted.json');

if (!fs.existsSync(SRC)) {
  console.error('Source file not found:', SRC);
  process.exit(2);
}

const raw = fs.readFileSync(SRC, 'utf8');
let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error('Failed to parse JSON from', SRC, err.message);
  process.exit(3);
}

const imgW = Number(data.width);
const imgH = Number(data.height);
if (!imgW || !imgH) {
  console.error('Missing width/height in source JSON (required for normalization)');
  process.exit(4);
}

const boxes = Array.isArray(data.boxes) ? data.boxes : [];

const components = boxes.map((b, idx) => {
  const x = Number(b.x);
  const y = Number(b.y);
  const bw = Number(b.width);
  const bh = Number(b.height);

  const left = x;
  const top = y;
  const right = x + bw;
  const bottom = y + bh;

  const toFixed = (v) => Number((v).toFixed(6));

  const bbox = [
    toFixed(top / imgH),
    toFixed(left / imgW),
    toFixed(bottom / imgH),
    toFixed(right / imgW),
  ];

  const label = b.label || `component_${idx}`;
  const id = b.id ? `${label.replace(/\s+/g, '_')}-${b.id}` : `${label.replace(/\s+/g, '_')}-${idx}`;

  return {
    id,
    type: label,
    label: label,
    bbox,
    confidence: b.confidence == null ? 0.95 : Number(b.confidence),
    rotation: 0,
    meta: {
      original_id: b.id,
      source_key: data.key || null
    }
  };
});

const out = {
  components,
  connections: [],
  metadata: {
    total_components: components.length,
    total_connections: 0,
    source_key: data.key || null,
    note: 'Converted from legacy boxes format by scripts/convert_mock_to_golden.js'
  }
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 4), 'utf8');
console.log('Wrote converted file to', OUT);
