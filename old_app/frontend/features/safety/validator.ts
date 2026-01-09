/**
 * Safety Validator - Orchestrates safety checks
 * Combines deterministic rules with AI-powered hazard identification
 */

import { validateDamper, validateMultipleDampers, DamperSpecification, SafetyIssue } from './rules/dampers';
import { getAIClient } from '@/lib/ai/client';
import { HAZARD_IDENTIFICATION_SYSTEM, HAZARD_IDENTIFICATION_PROMPT } from './prompts';

export interface SafetyReport {
  timestamp: number;
  overallSafe: boolean;
  criticalIssues: SafetyIssue[];
  warnings: SafetyIssue[];
  recommendations: SafetyIssue[];
  damperValidation?: {
    totalDampers: number;
    compliantDampers: number;
    issues: SafetyIssue[];
  };
  hazardAnalysis?: {
    hazards: Hazard[];
    summary: string;
  };
}

export interface Hazard {
  id: string;
  category: 'fire' | 'life_safety' | 'electrical' | 'mechanical' | 'code_compliance';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  location?: string;
  code_reference?: string;
  risk_description?: string;
  recommendation: string;
}

/**
 * Run comprehensive safety validation
 * Combines deterministic rules with AI analysis
 */
export async function validateSafety(data: {
  dampers?: DamperSpecification[];
  imageData?: string;
  visualAnalysis?: any;
}): Promise<SafetyReport> {
  const timestamp = Date.now();
  const allIssues: SafetyIssue[] = [];
  
  // Validate dampers (deterministic)
  let damperValidation;
  if (data.dampers && data.dampers.length > 0) {
    const results = validateMultipleDampers(data.dampers);
    const compliantCount = results.filter(r => r.isCompliant).length;
    
    const damperIssues = results.flatMap(r => r.issues);
    allIssues.push(...damperIssues);
    
    damperValidation = {
      totalDampers: data.dampers.length,
      compliantDampers: compliantCount,
      issues: damperIssues,
    };
  }
  
  // AI-powered hazard identification (if image provided)
  let hazardAnalysis;
  if (data.imageData) {
    try {
      hazardAnalysis = await analyzeHazards(data.imageData);
      
      // Convert AI hazards to SafetyIssues
      const aiIssues: SafetyIssue[] = hazardAnalysis.hazards.map(h => ({
        severity: h.severity,
        code: h.code_reference || 'AI-DETECTED',
        description: h.description,
        location: h.location,
        requirement: h.risk_description || 'Safety best practice',
        recommendation: h.recommendation,
      }));
      
      allIssues.push(...aiIssues);
    } catch (error) {
      console.error('Hazard analysis failed:', error);
    }
  }
  
  // Categorize issues by severity
  const criticalIssues = allIssues.filter(i => i.severity === 'CRITICAL');
  const warnings = allIssues.filter(i => i.severity === 'WARNING');
  const recommendations = allIssues.filter(i => i.severity === 'INFO');
  
  // Overall safety status
  const overallSafe = criticalIssues.length === 0;
  
  return {
    timestamp,
    overallSafe,
    criticalIssues,
    warnings,
    recommendations,
    damperValidation,
    hazardAnalysis,
  };
}

/**
 * AI-powered hazard identification
 */
async function analyzeHazards(imageData: string): Promise<{
  hazards: Hazard[];
  summary: string;
}> {
  const client = getAIClient();
  
  const responseText = await client.generateVision({
    imageData,
    prompt: HAZARD_IDENTIFICATION_PROMPT,
    options: {
      systemInstruction: HAZARD_IDENTIFICATION_SYSTEM,
      responseMimeType: 'application/json',
      temperature: 0.1, // Low temperature for safety-critical analysis
    },
  });
  
  try {
    // Parse response
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText
        .replace(/^```json\s*/, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }
    
    const parsed = JSON.parse(cleanText);
    return {
      hazards: parsed.hazards || [],
      summary: parsed.summary || 'No summary provided',
    };
  } catch (error) {
    console.error('Failed to parse hazard analysis:', error);
    return {
      hazards: [],
      summary: 'Hazard analysis failed to parse',
    };
  }
}

/**
 * Quick safety check - returns only critical issues
 */
export async function getCriticalSafetyIssues(data: {
  dampers?: DamperSpecification[];
  imageData?: string;
}): Promise<SafetyIssue[]> {
  const report = await validateSafety(data);
  return report.criticalIssues;
}

/**
 * Get safety summary text
 */
export function getSafetySummary(report: SafetyReport): string {
  const parts: string[] = [];
  
  if (report.overallSafe) {
    parts.push('✓ No critical safety issues identified');
  } else {
    parts.push(`✗ ${report.criticalIssues.length} CRITICAL safety issue(s) found`);
  }
  
  if (report.warnings.length > 0) {
    parts.push(`⚠ ${report.warnings.length} warning(s)`);
  }
  
  if (report.recommendations.length > 0) {
    parts.push(`ℹ ${report.recommendations.length} recommendation(s)`);
  }
  
  if (report.damperValidation) {
    parts.push(
      `Dampers: ${report.damperValidation.compliantDampers}/${report.damperValidation.totalDampers} compliant`
    );
  }
  
  return parts.join(' | ');
}
