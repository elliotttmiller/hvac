#!/usr/bin/env node
/**
 * Test script for Professional Report Formatter
 * Validates that reports are formatted correctly with proper structure
 */

const { formatFinalAnalysisReport, exportReportWithMetadata } = require('../../server/lib/report-formatter.cjs');

console.log('🧪 Testing Professional Report Formatter\n');

// Sample report data (from reference file)
const sampleReport = {
  report_title: "Hydraulic Valve Control System with Partial Stroke Test Capability",
  executive_summary: "This document outlines a hydraulic control system designed for an unclassified control valve, incorporating a Partial Stroke Test Device for enhanced reliability and safety. The system integrates various field-mounted and shared display/control switches, along with position feedback, to manage valve operation and diagnostic functions.",
  system_workflow_narrative: "The process begins with the Hydraulic Supply, which provides motive power to the system. This supply is routed through the Partial Stroke Test Device, tagged as PSTD NOTE-1, before reaching the Unclassified Control Valve, XV XXXX. The PSTD NOTE-1 is integral to the hydraulic path, suggesting it either conditions the hydraulic fluid or acts as an intermediary control element for the main valve.",
  control_logic_analysis: "The control strategy for this system is distributed, involving multiple hand switches and logic functions. A central logic function, I, receives input signals from shared display/control hand switches HS XXXX B and HS XXXX E.",
  specifications_and_details: "The system incorporates a Partial Stroke Test Device, PSTD NOTE-1, which is a key feature for maintaining the reliability and safety of the Unclassified Control Valve, XV XXXX.",
  critical_equipment: [
    { tag: "PSTD NOTE-1", role: "Partial Stroke Test Device for valve diagnostics and reliability" },
    { tag: "XV XXXX", role: "Unclassified Control Valve - primary flow control element" }
  ],
  engineering_observations: "The layered control architecture suggests a robust system for both operational control and diagnostic testing of the valve."
};

console.log('Test 1: Basic Report Formatting');
console.log('=====================================\n');

try {
  const formattedReport = formatFinalAnalysisReport(sampleReport);
  
  // Validation checks
  const hasTitle = formattedReport.includes('HYDRAULIC VALVE CONTROL SYSTEM');
  const hasSections = formattedReport.includes('## EXECUTIVE SUMMARY') &&
                     formattedReport.includes('## SYSTEM WORKFLOW') &&
                     formattedReport.includes('## CONTROL LOGIC ANALYSIS') &&
                     formattedReport.includes('## TECHNICAL SPECIFICATIONS');
  const hasEquipment = formattedReport.includes('## CRITICAL EQUIPMENT') &&
                       formattedReport.includes('PSTD NOTE-1');
  const hasFooter = formattedReport.includes('Report Generated:');
  const hasSeparators = formattedReport.includes('========') && 
                        formattedReport.includes('--------');
  
  console.log('✅ Format validation:');
  console.log(`  - Title formatted: ${hasTitle ? '✅' : '❌'}`);
  console.log(`  - Section headers: ${hasSections ? '✅' : '❌'}`);
  console.log(`  - Critical equipment: ${hasEquipment ? '✅' : '❌'}`);
  console.log(`  - Footer present: ${hasFooter ? '✅' : '❌'}`);
  console.log(`  - Separators present: ${hasSeparators ? '✅' : '❌'}`);
  
  const allValid = hasTitle && hasSections && hasEquipment && hasFooter && hasSeparators;
  
  if (allValid) {
    console.log('\n✅ Test 1 PASSED: Report formatting is correct\n');
  } else {
    console.log('\n❌ Test 1 FAILED: Report formatting has issues\n');
    console.log('Generated report preview:');
    console.log(formattedReport.substring(0, 500) + '...\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Test 1 FAILED with error:', error.message);
  process.exit(1);
}

console.log('Test 2: Report with Metadata');
console.log('=====================================\n');

try {
  const metadata = {
    document_type: 'P&ID',
    classification: 'Hydraulic Control System',
    document_id: 'TEST-001'
  };
  
  const fullReport = exportReportWithMetadata(sampleReport, metadata);
  
  const hasMetadata = fullReport.includes('Document Type: P&ID') &&
                     fullReport.includes('Classification: Hydraulic Control System') &&
                     fullReport.includes('Document ID: TEST-001');
  
  console.log('✅ Metadata validation:');
  console.log(`  - Metadata block present: ${hasMetadata ? '✅' : '❌'}`);
  console.log(`  - Generated timestamp: ${fullReport.includes('Generated:') ? '✅' : '❌'}`);
  
  if (hasMetadata) {
    console.log('\n✅ Test 2 PASSED: Metadata formatting is correct\n');
  } else {
    console.log('\n❌ Test 2 FAILED: Metadata formatting has issues\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Test 2 FAILED with error:', error.message);
  process.exit(1);
}

console.log('Test 3: Empty/Partial Report Handling');
console.log('=====================================\n');

try {
  const minimalReport = {
    report_title: "Minimal Test Report",
    executive_summary: "This is a minimal test report."
  };
  
  const formatted = formatFinalAnalysisReport(minimalReport);
  
  const hasTitle = formatted.includes('MINIMAL TEST REPORT');
  const hasSummary = formatted.includes('This is a minimal test report');
  const notBroken = !formatted.includes('undefined') && !formatted.includes('null');
  
  console.log('✅ Minimal report validation:');
  console.log(`  - Title formatted: ${hasTitle ? '✅' : '❌'}`);
  console.log(`  - Summary present: ${hasSummary ? '✅' : '❌'}`);
  console.log(`  - No broken fields: ${notBroken ? '✅' : '❌'}`);
  
  if (hasTitle && hasSummary && notBroken) {
    console.log('\n✅ Test 3 PASSED: Minimal report handling is correct\n');
  } else {
    console.log('\n❌ Test 3 FAILED: Minimal report handling has issues\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Test 3 FAILED with error:', error.message);
  process.exit(1);
}

console.log('=====================================');
console.log('✅ All report formatter tests PASSED');
console.log('=====================================\n');

console.log('📊 Summary:');
console.log('  - Report structure: Professional markdown format');
console.log('  - Section headers: Clear and consistent');
console.log('  - Separators: 80-character lines for readability');
console.log('  - Metadata support: Included when provided');
console.log('  - Error handling: Graceful fallbacks for missing fields\n');
