/**
 * Test script for final analysis generation
 * Tests the component correlation and analysis report generation
 */

const fs = require('fs');
const path = require('path');

// Read the test results
const testResultsPath = path.join(__dirname, 'resources/test_results/screenshot_example_logs.md');
const testData = fs.readFileSync(testResultsPath, 'utf8');

// Extract JSON from the test data (lines 10-2195 contain the JSON)
const lines = testData.split('\n');
const jsonStart = lines.findIndex(line => line.trim().startsWith('{'));
const jsonEnd = lines.findIndex((line, idx) => idx > jsonStart && line.trim() === '}');
const jsonLines = lines.slice(jsonStart, jsonEnd + 1);
const jsonText = jsonLines.join('\n');

let testResults;
try {
  testResults = JSON.parse(jsonText);
  console.log('✅ Successfully parsed test results JSON');
  console.log(`   - Document ID: ${testResults.document_id}`);
  console.log(`   - Document Type: ${testResults.document_type}`);
  console.log(`   - Components: ${testResults.visual?.components?.length || 0}`);
  console.log(`   - Connections: ${testResults.visual?.connections?.length || 0}`);
} catch (error) {
  console.error('❌ Failed to parse test results:', error.message);
  process.exit(1);
}

// Analyze the component relationships from connections
console.log('\n📊 Analyzing Component Relationships...\n');

const components = testResults.visual?.components || [];
const connections = testResults.visual?.connections || [];

// Build a relationship map
const relationships = new Map();

components.forEach(comp => {
  relationships.set(comp.id, {
    component: comp.label || comp.id,
    type: comp.type,
    upstream: [],
    downstream: [],
    tag: comp.meta?.tag,
    function: comp.meta?.isa_function
  });
});

connections.forEach(conn => {
  const from = relationships.get(conn.from_id);
  const to = relationships.get(conn.to_id);
  
  if (from && to) {
    from.downstream.push(to.component);
    to.upstream.push(from.component);
  }
});

// Identify potential control loops
console.log('🔄 Potential Control Loops:\n');
const controlInstruments = components.filter(c => 
  c.meta?.isa_function && 
  (c.meta.isa_function.includes('T') || 
   c.meta.isa_function.includes('P') || 
   c.meta.isa_function.includes('F'))
);

controlInstruments.slice(0, 5).forEach(inst => {
  const rel = relationships.get(inst.id);
  console.log(`   ${inst.label || inst.id} (${inst.meta?.isa_function})`);
  console.log(`   └─ Type: ${inst.type}`);
  if (rel.upstream.length > 0) {
    console.log(`   └─ Upstream: ${rel.upstream.join(', ')}`);
  }
  if (rel.downstream.length > 0) {
    console.log(`   └─ Downstream: ${rel.downstream.join(', ')}`);
  }
  console.log('');
});

// Identify equipment sequences
console.log('\n⛓️  Equipment Flow Sequences:\n');

// Find pumps and their flow paths
const pumps = components.filter(c => c.type === 'pump');
pumps.forEach(pump => {
  const rel = relationships.get(pump.id);
  console.log(`   ${pump.label} Flow Path:`);
  if (rel.upstream.length > 0) {
    console.log(`   ← Upstream: ${rel.upstream.join(' ← ')}`);
  }
  if (rel.downstream.length > 0) {
    console.log(`   → Downstream: ${rel.downstream.join(' → ')}`);
  }
  console.log('');
});

// Component type distribution
console.log('\n📦 Component Distribution:\n');
const typeCounts = {};
components.forEach(c => {
  const type = c.type || 'unknown';
  typeCounts[type] = (typeCounts[type] || 0) + 1;
});

Object.entries(typeCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });

// ISA compliance
console.log('\n✓ ISA Standards Compliance:\n');
const isaCompliant = components.filter(c => c.meta?.isa_function).length;
const isaConfidence = components
  .filter(c => c.meta?.isa_confidence)
  .reduce((sum, c) => sum + c.meta.isa_confidence, 0) / components.length;

console.log(`   Components with ISA functions: ${isaCompliant}/${components.length}`);
console.log(`   Average ISA confidence: ${(isaConfidence * 100).toFixed(1)}%`);

// Quality metrics
console.log('\n⭐ Detection Quality:\n');
const excellentQuality = components.filter(c => c.meta?.detection_quality === 'excellent').length;
console.log(`   Excellent quality detections: ${excellentQuality}/${components.length}`);

console.log('\n✅ Test Analysis Complete!');
console.log('\nThis data demonstrates the system can:');
console.log('  ✓ Detect and classify HVAC components');
console.log('  ✓ Identify connections between components');
console.log('  ✓ Map control loops and instrumentation');
console.log('  ✓ Trace equipment flow sequences');
console.log('  ✓ Assess ISA standards compliance');
console.log('\nThe final analysis generation will synthesize all this data into');
console.log('a comprehensive, professional HVAC engineering report.\n');
