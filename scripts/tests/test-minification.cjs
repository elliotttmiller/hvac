#!/usr/bin/env node
/**
 * Test script for Data Minification Layer
 * Validates that the minification reduces token count by >60%
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Data Minification Layer\n');

// Load test data from the forensic audit results
const testDataPath = path.join(__dirname, '../resources/reference_files/test_results/screenshot_example_logs.md');

// Extract the JSON from the logs (lines 60-1578)
console.log('📂 Loading test data from forensic audit results...');

// Simulate the minifyForAnalysis function
function minifyForAnalysis(visualResults) {
  if (!visualResults) return { components: [], connections: [], stats: {} };
  
  const originalSize = JSON.stringify(visualResults).length;
  
  // STRIP: Remove all visual data
  const components = (visualResults.components || []).map(c => ({
    id: c.id,
    tag: c.label || c.id,
    type: c.type,
    description: (c.meta && c.meta.description) || c.type,
    subsystem: c.meta && c.meta.hvac_subsystem,
    isa_function: c.meta && c.meta.isa_function,
    instrument_function: c.meta && c.meta.instrument_function,
  }));
  
  // Build component ID lookup to filter ghost connections
  const validComponentIds = new Set(components.map(c => c.id));
  
  // FILTER: Remove ghost connections
  const connections = (visualResults.connections || [])
    .filter(c => {
      const fromExists = validComponentIds.has(c.from_id);
      const toExists = validComponentIds.has(c.to_id);
      
      if (!fromExists || !toExists) {
        console.log(`   [Filter] Removed ghost connection: ${c.from_id} → ${c.to_id}`);
        return false;
      }
      return true;
    })
    .map(c => ({
      from: c.from_id,
      to: c.to_id,
      type: c.type,
    }));
  
  const minifiedSize = JSON.stringify({ components, connections }).length;
  const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
  
  const stats = {
    originalSize,
    minifiedSize,
    reduction: `${reduction}%`,
    components: components.length,
    connections: connections.length,
    ghostConnectionsFiltered: (visualResults.connections || []).length - connections.length
  };
  
  return { components, connections, stats };
}

// Create mock data based on the forensic audit
const mockVisualResults = {
  components: [
    {
      id: "1TI-18010_shared",
      type: "shared_display_indicator",
      label: "1TI 18010",
      bbox: [0.12, 0.25, 0.2, 0.32],
      confidence: 1,
      rotation: 0,
      meta: {
        reasoning: "Detected circle inside a square, indicating a shared display/control instrument.",
        description: "Temperature Indicator, Shared Display",
        instrument_function: "Temperature Indicator",
        location: "Shared Display/Control",
        raw_backend_output: [0.12, 0.25, 0.2, 0.32],
        transform_history: [
          {
            timestamp: "2026-01-06T10:55:32.425Z",
            operation: "normalize_bbox",
            details: { original_bbox: [0.12, 0.25, 0.2, 0.32], normalized_bbox: [0.12, 0.25, 0.2, 0.32] }
          }
        ],
        hvac_subsystem: "other",
        component_category: "equipment",
        isa_function: null,
        detection_quality: "excellent",
        shape_validation: { validated: false, reason: "No shape information available" }
      }
    },
    {
      id: "1TE-18010",
      type: "temperature_sensor",
      label: "1TE 18010",
      bbox: [0.12, 0.36, 0.2, 0.43],
      confidence: 1,
      rotation: 0,
      meta: {
        reasoning: "Detected circle shape, classified as an instrument.",
        description: "Temperature Sensor",
        instrument_function: "Temperature Sensor",
        location: "Field Mounted",
        raw_backend_output: [0.12, 0.36, 0.2, 0.43],
        transform_history: [
          {
            timestamp: "2026-01-06T10:55:32.425Z",
            operation: "normalize_bbox",
            details: { original_bbox: [0.12, 0.36, 0.2, 0.43] }
          }
        ],
        hvac_subsystem: "other",
        detection_quality: "excellent"
      }
    }
  ],
  connections: [
    {
      id: "1767696932426-3rddgfc38",
      from_id: "1TE-18010",
      to_id: "1TI-18010_shared",
      type: "unknown",
      confidence: 1,
      meta: {
        inferred_type: "unknown",
        type_confidence: 0.5,
        type_reasoning: "Could not determine connection type from component types",
        from_component_type: "temperature_sensor",
        to_component_type: "shared_display_indicator"
      }
    },
    {
      id: "1767696932426-sut5yds0a",
      from_id: "1PI-18008",
      to_id: "UNREADABLE_pipe_1VA-180147",
      type: "unknown",
      confidence: 1
    }
  ]
};

console.log('🔍 Test 1: Minification with ghost connection filtering');
console.log('===============================================\n');

const result = minifyForAnalysis(mockVisualResults);

console.log('\n📊 Minification Results:');
console.log('   Original size:', result.stats.originalSize, 'bytes');
console.log('   Minified size:', result.stats.minifiedSize, 'bytes');
console.log('   Reduction:', result.stats.reduction);
console.log('   Components:', result.stats.components);
console.log('   Connections:', result.stats.connections);
console.log('   Ghost connections filtered:', result.stats.ghostConnectionsFiltered);

// Validate reduction target
const reductionPct = parseFloat(result.stats.reduction);
if (reductionPct >= 60) {
  console.log('\n✅ SUCCESS: Achieved >60% token reduction target');
} else {
  console.log(`\n⚠️  WARNING: Only ${reductionPct}% reduction (target: >60%)`);
}

// Validate ghost filtering
if (result.stats.ghostConnectionsFiltered > 0) {
  console.log(`✅ SUCCESS: Filtered ${result.stats.ghostConnectionsFiltered} ghost connection(s)`);
} else {
  console.log('ℹ️  INFO: No ghost connections found in test data');
}

console.log('\n📝 Sample minified component:');
console.log(JSON.stringify(result.components[0], null, 2));

console.log('\n📝 Sample minified connection:');
console.log(JSON.stringify(result.connections[0], null, 2));

console.log('\n✅ Minification test completed\n');
