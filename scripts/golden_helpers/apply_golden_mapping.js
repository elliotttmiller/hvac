#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONVERTED = path.resolve(__dirname, '..', 'server', 'mocks', 'golden-record.converted.json');
const MAPPING = path.resolve(__dirname, 'golden_mapping.json');
const OUT = path.resolve(__dirname, '..', 'server', 'mocks', 'golden-record.final.json');

if (!fs.existsSync(CONVERTED)) {
  console.error('Converted file not found:', CONVERTED);
  process.exit(2);
}

const converted = JSON.parse(fs.readFileSync(CONVERTED, 'utf8'));

if (!fs.existsSync(MAPPING)) {
  console.error('Mapping file not found:', MAPPING);
  console.error('Run `node scripts/generate_golden_mapping_template.js` to create an editable template, then copy to', MAPPING, 'and fill values.');
  process.exit(3);
}

const mapping = JSON.parse(fs.readFileSync(MAPPING, 'utf8'));

const finalComponents = (converted.components || []).map(c => {
  const orig = (c.meta && c.meta.original_id) || c.id;
  const map = mapping[orig];

  if (!map || !map.id) {
    // fallback: keep existing but ensure proper field names
    return {
      id: c.id,
      type: c.type,
      label: c.label,
      bbox: c.bbox,
      confidence: c.confidence ?? 0.95,
      rotation: c.rotation ?? 0,
      meta: {
        ...c.meta,
      }
    };
  }

  return {
    id: map.id,
    type: map.type || c.type,
    label: map.label || map.id,
    bbox: c.bbox,
    confidence: map.confidence ?? c.confidence ?? 0.95,
    rotation: map.rotation ?? c.rotation ?? 0,
    meta: {
      ...(map.meta || {}),
      original_id: orig,
      source_key: converted.metadata && converted.metadata.source_key
    }
  };
});

const out = {
  components: finalComponents,
  connections: converted.connections || [],
  metadata: {
    total_components: finalComponents.length,
    total_connections: (converted.connections || []).length,
    source_key: converted.metadata && converted.metadata.source_key,
    note: 'Produced by scripts/apply_golden_mapping.js'
  }
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 4), 'utf8');
console.log('Wrote final golden record to', OUT);
