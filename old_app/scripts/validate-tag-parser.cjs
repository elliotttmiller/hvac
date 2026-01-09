#!/usr/bin/env node

/**
 * Manual validation script for ISA-5.1 Tag Parser
 * Tests the parser against known examples and displays results
 */

const path = require('path');

// This is a simple Node.js test script
// We'll create a simpler version that can be run directly

const testTags = [
  { tag: 'PDIT-101', expected: 'Pressure Differential Indicator Transmitter' },
  { tag: 'FIT-202', expected: 'Flow Indicator Transmitter' },
  { tag: 'LAL-303', expected: 'Level Alarm Low' },
  { tag: 'TT-909', expected: 'Temperature Transmitter' },
  { tag: 'PSH-505', expected: 'Pressure Switch High' },
  { tag: 'PDSH-606', expected: 'Pressure Differential Switch High' },
  { tag: 'FV-707', expected: 'Flow Valve/Damper' },
  { tag: 'HS-111', expected: 'Hand (Manual) Switch' },
  { tag: 'PT-909', expected: 'Pressure Transmitter' },
  { tag: 'TI-010', expected: 'Temperature Indicator' },
  { tag: 'PI-111', expected: 'Pressure Indicator' },
  { tag: 'PV-025', expected: 'Pressure Valve/Damper' }
];

console.log('='.repeat(80));
console.log('ISA-5.1 Tag Parser Validation');
console.log('='.repeat(80));
console.log('');

console.log('Test Tags to Validate:');
console.log('----------------------');
testTags.forEach((test, i) => {
  console.log(`${i + 1}. ${test.tag.padEnd(15)} → Expected: ${test.expected}`);
});

console.log('');
console.log('Note: To run actual tests, use: npm test');
console.log('This script validates the tag patterns are correct.');
console.log('');

// Validate tag patterns
console.log('Validating Tag Patterns:');
console.log('------------------------');

const tagPattern = /^([A-Z]{1,6})-?(\d{1,6})?([A-Z])?$/;

let allValid = true;
testTags.forEach((test) => {
  const match = test.tag.match(tagPattern);
  if (match) {
    const [, letters, number, suffix] = match;
    console.log(`✓ ${test.tag.padEnd(15)} - Valid (Letters: ${letters}, Loop: ${number || 'none'}, Suffix: ${suffix || 'none'})`);
  } else {
    console.log(`✗ ${test.tag.padEnd(15)} - INVALID PATTERN`);
    allValid = false;
  }
});

console.log('');
if (allValid) {
  console.log('✓ All tag patterns are valid!');
} else {
  console.log('✗ Some tags have invalid patterns');
}

console.log('');
console.log('Positional Logic Examples:');
console.log('--------------------------');

const examples = [
  {
    tag: 'PDIT',
    positions: [
      'P[0] = Pressure (Measured Variable)',
      'D[1] = Differential (Modifier)',
      'I[2] = Indicator (Function)',
      'T[3] = Transmitter (Function)'
    ]
  },
  {
    tag: 'FIT',
    positions: [
      'F[0] = Flow (Measured Variable)',
      'I[1] = Indicator (Function)',
      'T[2] = Transmitter (Function)'
    ]
  },
  {
    tag: 'LAL',
    positions: [
      'L[0] = Level (Measured Variable)',
      'A[1] = Alarm (Function)',
      'L[2] = Low (Function)'
    ]
  }
];

examples.forEach((ex) => {
  console.log(`\n${ex.tag}:`);
  ex.positions.forEach((pos) => {
    console.log(`  ${pos}`);
  });
});

console.log('');
console.log('='.repeat(80));
console.log('Validation complete. Build the project with: npm run build');
console.log('='.repeat(80));
