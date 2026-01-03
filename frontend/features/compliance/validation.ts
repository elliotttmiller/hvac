/**
 * Compliance Validation Orchestrator
 * Coordinates all deterministic compliance checks
 */

import { validateVentilation, validateMultipleZones, ZoneData, VentilationResult } from './rules/ashrae-62-1';
import { validateDuct, validateMultipleDucts, DuctSpecification, DuctValidationResult } from './rules/smacna';
import { validateTag, validateMultipleTags, findDuplicateTags, TagValidationResult } from './rules/isa-5-1';

export interface ComplianceReport {
  timestamp: number;
  overallCompliance: boolean;
  ventilation?: {
    results: VentilationResult[];
    systemCompliant: boolean;
  };
  ductwork?: {
    results: DuctValidationResult[];
    compliantCount: number;
    totalCount: number;
  };
  instrumentation?: {
    results: TagValidationResult[];
    validCount: number;
    totalCount: number;
    duplicates: string[];
  };
  summary: string;
}

/**
 * Run comprehensive compliance validation
 * Checks ASHRAE 62.1, SMACNA, and ISA-5.1 standards
 */
export function validateCompliance(data: {
  zones?: ZoneData[];
  ducts?: DuctSpecification[];
  tags?: string[];
}): ComplianceReport {
  const timestamp = Date.now();
  const issues: string[] = [];
  
  // Ventilation compliance (ASHRAE 62.1)
  let ventilationReport;
  if (data.zones && data.zones.length > 0) {
    const results = validateMultipleZones(data.zones);
    const systemCompliant = results.every(r => r.isCompliant);
    
    ventilationReport = {
      results,
      systemCompliant,
    };
    
    if (!systemCompliant) {
      issues.push('Ventilation system does not meet ASHRAE 62.1 requirements');
    }
  }
  
  // Ductwork compliance (SMACNA)
  let ductworkReport;
  if (data.ducts && data.ducts.length > 0) {
    const results = validateMultipleDucts(data.ducts);
    const compliantCount = results.filter(r => r.isCompliant).length;
    const totalCount = results.length;
    
    ductworkReport = {
      results,
      compliantCount,
      totalCount,
    };
    
    if (compliantCount < totalCount) {
      issues.push(
        `${totalCount - compliantCount} duct(s) do not meet SMACNA standards`
      );
    }
  }
  
  // Instrumentation compliance (ISA-5.1)
  let instrumentationReport;
  if (data.tags && data.tags.length > 0) {
    const results = validateMultipleTags(data.tags);
    const validCount = results.filter(r => r.isValid).length;
    const totalCount = results.length;
    const duplicates = findDuplicateTags(data.tags);
    
    instrumentationReport = {
      results,
      validCount,
      totalCount,
      duplicates,
    };
    
    if (validCount < totalCount) {
      issues.push(
        `${totalCount - validCount} tag(s) do not conform to ISA-5.1 format`
      );
    }
    
    if (duplicates.length > 0) {
      issues.push(`Found ${duplicates.length} duplicate tag(s)`);
    }
  }
  
  // Overall compliance
  const overallCompliance = issues.length === 0;
  
  // Generate summary
  const summary = overallCompliance
    ? 'All systems meet applicable standards'
    : `Compliance issues found: ${issues.join('; ')}`;
  
  return {
    timestamp,
    overallCompliance,
    ventilation: ventilationReport,
    ductwork: ductworkReport,
    instrumentation: instrumentationReport,
    summary,
  };
}

/**
 * Quick validation - returns only boolean compliance status
 */
export function isCompliant(data: {
  zones?: ZoneData[];
  ducts?: DuctSpecification[];
  tags?: string[];
}): boolean {
  const report = validateCompliance(data);
  return report.overallCompliance;
}

/**
 * Get compliance issues as a flat list
 */
export function getComplianceIssues(data: {
  zones?: ZoneData[];
  ducts?: DuctSpecification[];
  tags?: string[];
}): string[] {
  const report = validateCompliance(data);
  const issues: string[] = [];
  
  // Ventilation issues
  if (report.ventilation) {
    report.ventilation.results
      .filter(r => !r.isCompliant)
      .forEach(r => issues.push(r.details));
  }
  
  // Ductwork issues
  if (report.ductwork) {
    report.ductwork.results
      .filter(r => !r.isCompliant)
      .forEach(r => issues.push(...r.issues));
  }
  
  // Instrumentation issues
  if (report.instrumentation) {
    report.instrumentation.results
      .filter(r => !r.isValid)
      .forEach(r => issues.push(...r.issues));
    
    if (report.instrumentation.duplicates.length > 0) {
      issues.push(
        `Duplicate tags found: ${report.instrumentation.duplicates.join(', ')}`
      );
    }
  }
  
  return issues;
}
