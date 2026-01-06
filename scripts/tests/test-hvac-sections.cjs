#!/usr/bin/env node
/**
 * Test script for HVAC Industry-Standard Report Sections
 * Validates that new HVAC sections are properly formatted
 */

const { formatFinalAnalysisReport } = require('../../server/lib/report-formatter.cjs');

console.log('🧪 Testing HVAC Industry-Standard Report Sections\n');

// Comprehensive HVAC report with all new sections
const hvacReport = {
  report_title: "Variable Air Volume HVAC System Analysis",
  executive_summary: "This document presents a comprehensive analysis of a Variable Air Volume (VAV) HVAC system designed for a commercial office building. The system employs energy-efficient variable speed drives and demand-based ventilation control to optimize comfort while minimizing energy consumption.",
  design_overview: "The VAV system architecture utilizes a central air handling unit with variable frequency drive control, feeding multiple VAV terminal units throughout the building. The design incorporates demand-controlled ventilation based on CO2 sensing, economizer operation for free cooling, and zone-level temperature control. The mechanical ventilation strategy meets ASHRAE 62.1 requirements with outdoor air monitoring and proportional control.",
  system_workflow_narrative: "Outdoor air enters through the economizer section where dampers modulate based on outdoor conditions. Mixed air passes through pre-filters and heating/cooling coils before the supply fan delivers conditioned air to VAV boxes. Each VAV terminal unit modulates airflow based on zone temperature setpoint, maintaining occupant comfort while reducing energy waste during low-load conditions.",
  ventilation_design: "The system provides 15 CFM per person minimum outdoor airflow per ASHRAE 62.1-2019 requirements. Outdoor air intake is monitored via CO2 sensors (700-1000 ppm setpoint) with economizer operation prioritized when outdoor conditions permit. Exhaust air is managed through dedicated exhaust fans with parallel control to maintain building pressurization.",
  control_logic_analysis: "The building management system (BMS) coordinates VAV operation through a network of DDC controllers. Supply air temperature resets based on outdoor air temperature and zone demand. VAV boxes respond to zone thermostats with PI control algorithms, modulating dampers to maintain setpoint. Static pressure in the ductwork is monitored and supply fan speed is modulated via VFD to maintain optimal pressure across all zones.",
  equipment_specifications: "Primary air handler: 12,000 CFM capacity with 75% efficient pleated filters, DX cooling coil (120 MBH capacity), hot water heating coil, and VFD-controlled supply fan (15 HP). VAV terminal units: Pressure-independent with hot water reheat coils, 300-1200 CFM range. All equipment meets ASHRAE 90.1 efficiency requirements with MERV 13 filtration.",
  heating_cooling_loads: "Design heating load: 450,000 BTU/hr calculated per ACCA Manual J methodology. Cooling load: 35 tons (420 MBH) determined using ASHRAE Fundamentals Heat Balance Method accounting for envelope gains, internal loads (3.5 W/sf), and ventilation loads. Equipment sizing includes 15% safety factor per industry standard practices.",
  standards_compliance: "System design complies with ASHRAE 62.1-2019 (ventilation), ASHRAE 90.1-2019 (energy efficiency), ISA-5.1 instrumentation tagging standards, and SMACNA ductwork construction standards. Installation will be graded per ANSI/RESNET/ACCA 310 for quality verification. The design targets ENERGY STAR certification with EUI below 45 kBtu/sf-yr.",
  critical_equipment: [
    { tag: "AHU-01", role: "Primary air handling unit providing conditioned air to all zones" },
    { tag: "VAV-201 through VAV-220", role: "Zone-level VAV terminal units with reheat capability" },
    { tag: "BMS-MAIN", role: "Building management system coordinating all HVAC control sequences" }
  ],
  engineering_observations: "The VAV system design demonstrates current industry best practices with variable speed control, demand-based ventilation, and comprehensive BMS integration. Energy modeling projects 30% savings versus constant volume baseline. Recommend commissioning per ASHRAE Guideline 0 to verify sequence of operations and optimize control parameters."
};

console.log('Test 1: HVAC Industry Sections Formatting');
console.log('=============================================\n');

try {
  const formattedReport = formatFinalAnalysisReport(hvacReport);
  
  // Validation checks for all HVAC sections
  const hasTitle = formattedReport.includes('VARIABLE AIR VOLUME');
  const hasExecutiveSummary = formattedReport.includes('## EXECUTIVE SUMMARY');
  const hasDesignOverview = formattedReport.includes('## DESIGN OVERVIEW');
  const hasSystemWorkflow = formattedReport.includes('## SYSTEM WORKFLOW');
  const hasVentilation = formattedReport.includes('## VENTILATION DESIGN');
  const hasControlLogic = formattedReport.includes('## CONTROL LOGIC ANALYSIS');
  const hasEquipmentSpecs = formattedReport.includes('## EQUIPMENT SELECTION & SPECIFICATIONS');
  const hasLoads = formattedReport.includes('## HEATING & COOLING LOADS');
  const hasCompliance = formattedReport.includes('## STANDARDS COMPLIANCE');
  const hasCriticalEquipment = formattedReport.includes('## CRITICAL EQUIPMENT');
  const hasObservations = formattedReport.includes('## ENGINEERING OBSERVATIONS');
  
  // Check for key HVAC content
  const hasASHRAE = formattedReport.includes('ASHRAE');
  const hasACCA = formattedReport.includes('ACCA');
  const hasISA = formattedReport.includes('ISA');
  const hasENERGYSTAR = formattedReport.includes('ENERGY STAR');
  const hasCFM = formattedReport.includes('CFM');
  
  console.log('✅ Section validation:');
  console.log(`  - Title formatted: ${hasTitle ? '✅' : '❌'}`);
  console.log(`  - Executive Summary: ${hasExecutiveSummary ? '✅' : '❌'}`);
  console.log(`  - Design Overview: ${hasDesignOverview ? '✅' : '❌'}`);
  console.log(`  - System Workflow: ${hasSystemWorkflow ? '✅' : '❌'}`);
  console.log(`  - Ventilation Design: ${hasVentilation ? '✅' : '❌'}`);
  console.log(`  - Control Logic: ${hasControlLogic ? '✅' : '❌'}`);
  console.log(`  - Equipment Specs: ${hasEquipmentSpecs ? '✅' : '❌'}`);
  console.log(`  - Heating/Cooling Loads: ${hasLoads ? '✅' : '❌'}`);
  console.log(`  - Standards Compliance: ${hasCompliance ? '✅' : '❌'}`);
  console.log(`  - Critical Equipment: ${hasCriticalEquipment ? '✅' : '❌'}`);
  console.log(`  - Engineering Observations: ${hasObservations ? '✅' : '❌'}`);
  
  console.log('\n✅ HVAC Content validation:');
  console.log(`  - ASHRAE standards referenced: ${hasASHRAE ? '✅' : '❌'}`);
  console.log(`  - ACCA standards referenced: ${hasACCA ? '✅' : '❌'}`);
  console.log(`  - ISA standards referenced: ${hasISA ? '✅' : '❌'}`);
  console.log(`  - ENERGY STAR referenced: ${hasENERGYSTAR ? '✅' : '❌'}`);
  console.log(`  - Technical units (CFM): ${hasCFM ? '✅' : '❌'}`);
  
  const allSectionsValid = hasTitle && hasExecutiveSummary && hasDesignOverview && 
                          hasSystemWorkflow && hasVentilation && hasControlLogic &&
                          hasEquipmentSpecs && hasLoads && hasCompliance &&
                          hasCriticalEquipment && hasObservations;
  
  const allContentValid = hasASHRAE && hasACCA && hasISA && hasENERGYSTAR && hasCFM;
  
  if (allSectionsValid && allContentValid) {
    console.log('\n✅ Test 1 PASSED: All HVAC industry sections properly formatted\n');
  } else {
    console.log('\n❌ Test 1 FAILED: Some HVAC sections missing or improperly formatted\n');
    console.log('Report preview (first 1000 chars):');
    console.log(formattedReport.substring(0, 1000) + '...\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Test 1 FAILED with error:', error.message);
  process.exit(1);
}

console.log('Test 2: Backwards Compatibility');
console.log('=============================================\n');

try {
  // Test with legacy field names
  const legacyReport = {
    report_title: "Legacy System Report",
    executive_summary: "Testing backwards compatibility with old field names.",
    system_workflow_narrative: "System flow description.",
    control_logic_analysis: "Control logic description.",
    specifications_and_details: "Old-style specifications field.",
    critical_equipment: [],
    engineering_observations: "Observations."
  };
  
  const formatted = formatFinalAnalysisReport(legacyReport);
  
  const hasLegacySpec = formatted.includes('## TECHNICAL SPECIFICATIONS');
  const hasLegacyContent = formatted.includes('Old-style specifications');
  
  console.log('✅ Backwards compatibility validation:');
  console.log(`  - Legacy spec section: ${hasLegacySpec ? '✅' : '❌'}`);
  console.log(`  - Legacy content preserved: ${hasLegacyContent ? '✅' : '❌'}`);
  
  if (hasLegacySpec && hasLegacyContent) {
    console.log('\n✅ Test 2 PASSED: Backwards compatibility maintained\n');
  } else {
    console.log('\n❌ Test 2 FAILED: Backwards compatibility broken\n');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Test 2 FAILED with error:', error.message);
  process.exit(1);
}

console.log('=============================================');
console.log('✅ All HVAC section tests PASSED');
console.log('=============================================\n');

console.log('📊 Summary:');
console.log('  - Design Overview: ✅ New HVAC section');
console.log('  - Ventilation Design: ✅ New HVAC section');
console.log('  - Equipment Specifications: ✅ New HVAC section');
console.log('  - Heating & Cooling Loads: ✅ New HVAC section');
console.log('  - Standards Compliance: ✅ New HVAC section');
console.log('  - ASHRAE/ACCA/ISA References: ✅ Industry standards');
console.log('  - ENERGY STAR Integration: ✅ Certification ready');
console.log('  - Backwards Compatibility: ✅ Legacy fields supported\n');
