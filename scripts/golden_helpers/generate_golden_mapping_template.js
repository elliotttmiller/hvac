#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONVERTED = path.resolve(__dirname, '..', 'server', 'mocks', 'golden-record.converted.json');
const TEMPLATE = path.resolve(__dirname, 'golden_mapping.template.json');

if (!fs.existsSync(CONVERTED)) {
  console.error('Converted source not found:', CONVERTED);
  process.exit(2);
}

const converted = JSON.parse(fs.readFileSync(CONVERTED, 'utf8'));

const template = {};
for (const c of converted.components || []) {
  const orig = (c.meta && c.meta.original_id) || c.id;
  template[orig] = {
    id: "",
    type: "",
    label: "",
    confidence: c.confidence ?? 0.95,
    rotation: c.rotation ?? 0,
    meta: {
      tag: "",
      description: "",
      reasoning: ""
    }
  };
}

fs.writeFileSync(TEMPLATE, JSON.stringify(template, null, 4), 'utf8');
console.log('Wrote mapping template to', TEMPLATE);
console.log('Edit that file to add target ids/types/labels, then run scripts/apply_golden_mapping.js to produce the final golden-record.json');
