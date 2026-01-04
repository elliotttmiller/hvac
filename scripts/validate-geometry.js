#!/usr/bin/env node

/**
 * Manual validation script for geometry bbox normalization
 * Tests the fix for coordinate drift issue
 */

// Simulate the normalizeBackendBBox function
function normalizeBackendBBox(raw, options = {}) {
  if (!Array.isArray(raw) || raw.length < 4) return [0,0,0,0];

  const space = options?.space;
  const order = options?.order;

  let a = raw.slice(0,4).map(n => Number(n));

  // If values are large (>1) and likely 0-1000 normalized, scale down
  const maxVal = Math.max(...a.map(Math.abs));
  if (!space) {
    if (maxVal > 1 && maxVal <= 1000) {
      a = a.map(v => v / 1000);
    } else if (maxVal > 1000) {
      if (options?.imageSize) {
        const { width, height } = options.imageSize;
        const [r0,r1,r2,r3] = a;
        return [r0/width, r1/height, r2/width, r3/height];
      }
      a = a.map(v => v / maxVal);
    }
  }

  // Order detection: only swap if explicitly specified
  let xmin, ymin, xmax, ymax;
  if (order === 'ymin_xmin_ymax_xmax') {
    ymin = a[0]; xmin = a[1]; ymax = a[2]; xmax = a[3];
  } else {
    xmin = a[0]; ymin = a[1]; xmax = a[2]; ymax = a[3];
  }

  // Clip to [0,1]
  xmin = Math.max(0, Math.min(1, xmin));
  ymin = Math.max(0, Math.min(1, ymin));
  xmax = Math.max(0, Math.min(1, xmax));
  ymax = Math.max(0, Math.min(1, ymax));

  return [xmin, ymin, xmax, ymax];
}

console.log('='.repeat(80));
console.log('GEOMETRY BBOX NORMALIZATION VALIDATION');
console.log('='.repeat(80));
console.log();

// Test cases from golden-record.json
const testCases = [
  { id: 'SOV-301202', bbox: [0.123, 0.252, 0.151, 0.285] },
  { id: 'SOV-301203A', bbox: [0.476, 0.065, 0.563, 0.111] },
  { id: 'SOV-291201A', bbox: [0.476, 0.136, 0.563, 0.18] },
  { id: 'SOV-301203B', bbox: [0.477, 0.207, 0.561, 0.255] },
  { id: 'PT-302318', bbox: [0.58, 0.381, 0.662, 0.424] },
  { id: 'TT-302319', bbox: [0.581, 0.685, 0.666, 0.731] },
];

console.log('Test 1: Golden Record Bboxes (should remain unchanged)');
console.log('-'.repeat(80));

let allPassed = true;

testCases.forEach(({ id, bbox }) => {
  const result = normalizeBackendBBox(bbox);
  const passed = JSON.stringify(result) === JSON.stringify(bbox);
  
  console.log(`${passed ? '✓' : '✗'} ${id.padEnd(20)} Input: [${bbox.map(v => v.toFixed(3)).join(', ')}]`);
  console.log(`  ${' '.repeat(21)} Output: [${result.map(v => v.toFixed(3)).join(', ')}]`);
  
  if (!passed) {
    console.log(`  ${' '.repeat(21)} ❌ MISMATCH! Expected no change.`);
    allPassed = false;
  }
  console.log();
});

console.log();
console.log('Test 2: Wide Image Regression Test (x > y should NOT trigger swap)');
console.log('-'.repeat(80));

// The bug was: when x1 > y1 AND x2 > y2, it incorrectly swapped coordinates
const wideImageTest = [0.476, 0.065, 0.563, 0.111];
const wideImageResult = normalizeBackendBBox(wideImageTest);
const wideImagePassed = JSON.stringify(wideImageResult) === JSON.stringify(wideImageTest);

console.log(`${wideImagePassed ? '✓' : '✗'} Wide Image Test    Input: [${wideImageTest.map(v => v.toFixed(3)).join(', ')}]`);
console.log(`  ${' '.repeat(21)} Output: [${wideImageResult.map(v => v.toFixed(3)).join(', ')}]`);

if (!wideImagePassed) {
  console.log(`  ${' '.repeat(21)} ❌ MISMATCH! Coordinates were incorrectly swapped.`);
  console.log(`  ${' '.repeat(21)} This is the BUG we're fixing!`);
  allPassed = false;
}
console.log();

console.log();
console.log('Test 3: Explicit Order Parameter (Gemini format conversion)');
console.log('-'.repeat(80));

// When order is explicitly specified as ymin_xmin_ymax_xmax, it SHOULD swap
const geminiFormat = [0.065, 0.476, 0.111, 0.563];
const geminiResult = normalizeBackendBBox(geminiFormat, { order: 'ymin_xmin_ymax_xmax' });
const geminiExpected = [0.476, 0.065, 0.563, 0.111];
const geminiPassed = JSON.stringify(geminiResult) === JSON.stringify(geminiExpected);

console.log(`${geminiPassed ? '✓' : '✗'} Gemini Format      Input: [${geminiFormat.map(v => v.toFixed(3)).join(', ')}]`);
console.log(`  ${' '.repeat(21)} Output: [${geminiResult.map(v => v.toFixed(3)).join(', ')}]`);
console.log(`  ${' '.repeat(21)} Expected: [${geminiExpected.map(v => v.toFixed(3)).join(', ')}]`);

if (!geminiPassed) {
  console.log(`  ${' '.repeat(21)} ❌ MISMATCH! Explicit order parameter not working.`);
  allPassed = false;
}
console.log();

console.log();
console.log('='.repeat(80));
if (allPassed) {
  console.log('✓ ALL TESTS PASSED! Bbox normalization is working correctly.');
} else {
  console.log('✗ SOME TESTS FAILED! Review the output above.');
  process.exit(1);
}
console.log('='.repeat(80));
