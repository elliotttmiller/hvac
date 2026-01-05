import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from '@/features/document-analysis/types';
import { generateId } from '@/lib/utils';
import { 
  PID_ANALYSIS_SYSTEM_INSTRUCTION, 
  PID_ANALYSIS_SCHEMA,
  PID_USER_PROMPT 
} from '@/features/document-analysis/prompts/visual/detect-pid';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Configuration constants - Optimized for Gemini 2.5 API limits (2026)
// API Version: Google AI Gemini API (generativelanguage.googleapis.com/v1beta)
// Official thinking budget limit: 0-24,576 tokens (24K) - Verified Jan 2026
// Official max output tokens: 65,535 tokens - Verified Jan 2026
// Source: https://ai.google.dev/gemini-api/docs/thinking
const MAX_THINKING_BUDGET = 16000;  // Optimized: Balanced for complex HVAC analysis
const MIN_THINKING_BUDGET = 4000;   // Optimized: Sufficient for simple diagrams
const MAX_THINKING_BUDGET_CAP = 24000; // FIXED: Was 64K (over limit), now 24K (official max)
const IMAGE_SIZE_DIVISOR = 2000;    // Optimized: More conservative budget calculation
const BASE_RETRY_DELAY_MS = 1000;
const BACKOFF_MULTIPLIER = 2;
const HIGH_CONFIDENCE_THRESHOLD = 0.95;
const DEFAULT_MAX_OUTPUT_TOKENS = 16384; // Optimized: Increased from 8192, still well under 65K limit

/**
 * Enhanced P&ID Analysis Engine with HVAC-Specific Intelligence.
 * 
 * Features:
 * - Adaptive thinking budgets based on image complexity
 * - Multi-stage retry logic with confidence tracking
 * - Robust JSON parsing with error recovery
 * - HVAC-specific component detection
 * 
 * @param base64Image - The raw base64 string of the blueprint.
 * @param options - Configuration options for analysis
 * @returns Structured JSON analysis result complying with PID_ANALYSIS_SCHEMA.
 */
export const analyzePID = async (base64Image: string, options: {
  maxRetries?: number;
  hvacContext?: {
    systemType?: string; // 'chilled_water', 'condenser_water', 'refrigeration', 'air_handling'
    facilityType?: string; // 'data_center', 'hospital', 'laboratory', 'commercial'
  }
} = {}) => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  // Normalize base64 string (remove data URI prefix if present)
  const imageBytes = base64Image.includes('base64,') 
    ? base64Image.split('base64,')[1] 
    : base64Image;

  const maxRetries = options.maxRetries || 3;
  let attempt = 0;
  let bestResult: any = null;
  let bestConfidence = 0;

  while (attempt < maxRetries) {
    try {
      console.log(`🚀 P&ID Analysis Attempt ${attempt + 1}/${maxRetries} - HVAC Specialized Mode`);
      
      // Calculate adaptive thinking budget based on image complexity
      const thinkingBudget = calculateThinkingBudget(base64Image.length, options.hvacContext);
      console.log(`📊 Adaptive thinking budget: ${thinkingBudget} tokens`);
      
      const response = await ai.models.generateContent({
        model: GeminiModel.FLASH, // OPTIMIZED: Use Flash for free tier compatibility (Pro has no free access as of 2026)
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: 'image/png',
                data: imageBytes
              }
            },
            {
              text: generateContextAwarePrompt(PID_USER_PROMPT, options.hvacContext)
            }
          ]
        },
        config: {
          // Adaptive thinking budget allows deeper analysis for complex drawings.
          // NOTE: 'enableMultiStepReasoning' was removed because the
          // @google/genai TypeScript definitions do not include it on
          // ThinkingConfig (TS2353). If multi-step reasoning becomes a
          // supported option in the future, reintroduce here guarded by
          // a runtime feature flag and update types accordingly.
          thinkingConfig: { 
            thinkingBudget: thinkingBudget
          },
          systemInstruction: PID_ANALYSIS_SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: PID_ANALYSIS_SCHEMA,
          // Start deterministic, increase creativity on retries
          temperature: attempt === 0 ? 0.1 : 0.3,
          maxOutputTokens: DEFAULT_MAX_OUTPUT_TOKENS
        }
      });

      let jsonText = response.text || "{}";
      
      // Robust Markdown and JSON cleanup
      jsonText = cleanJSONResponse(jsonText);
      
      // Parse with validation and error recovery
      const parsedResult = validateAndRecoverResult(jsonText, attempt);
      
      // Calculate result confidence based on component coverage
      const resultConfidence = calculateResultConfidence(parsedResult, options.hvacContext);
      console.log(`📊 Analysis Result Confidence: ${resultConfidence.toFixed(3)} - Components: ${parsedResult.components?.length || 0}`);
      
      // Track best result across attempts
      if (resultConfidence > bestConfidence) {
        bestConfidence = resultConfidence;
        bestResult = parsedResult;
      }
      
      // Early exit if we have high confidence
      if (resultConfidence >= HIGH_CONFIDENCE_THRESHOLD) {
        console.log('✅ High confidence result achieved - skipping remaining attempts');
        break;
      }
      
      attempt++;

    } catch (error) {
      console.error(`❌ Analysis Attempt ${attempt + 1} Failed:`, error);
      attempt++;
      
      if (attempt === maxRetries) {
        console.warn('⚠️ All analysis attempts failed - returning best available result');
        return bestResult || createFallbackResult(options.hvacContext);
      }
      
      // Exponential backoff between retries
      await new Promise(resolve => setTimeout(resolve, BASE_RETRY_DELAY_MS * Math.pow(BACKOFF_MULTIPLIER, attempt)));
    }
  }

  // Add metadata for traceability
  if (bestResult) {
    bestResult.metadata = {
      analysis_version: '2.0.0-hvac-enhanced',
      timestamp: new Date().toISOString(),
      attempts: attempt,
      best_confidence: bestConfidence,
      hvac_context: options.hvacContext,
      model_used: GeminiModel.FLASH // Updated for free tier compatibility
    };
  }

  return bestResult || createFallbackResult(options.hvacContext);
};

/**
 * Generate context-aware prompt with HVAC specialization
 */
function generateContextAwarePrompt(basePrompt: string, hvacContext?: any): string {
  if (!hvacContext) return basePrompt;
  
  const contextEnhancements = [];
  
  if (hvacContext.systemType) {
    const systemDescriptions: Record<string, string> = {
      'chilled_water': 'chilled water systems (primary/secondary pumping, chillers, cooling towers)',
      'condenser_water': 'condenser water systems with cooling towers and heat rejection',
      'refrigeration': 'refrigeration circuits (DX systems, compressors, condensers, evaporators)',
      'air_handling': 'air handling units with coils, fans, filters, and dampers'
    };
    contextEnhancements.push(`You are analyzing ${systemDescriptions[hvacContext.systemType] || hvacContext.systemType} drawings.`);
  }
  
  if (hvacContext.facilityType) {
    const facilityContexts: Record<string, string> = {
      'data_center': 'mission-critical data center HVAC systems requiring N+1 redundancy',
      'hospital': 'healthcare HVAC systems with strict pressure relationships and filtration requirements',
      'laboratory': 'laboratory HVAC systems with precise temperature/humidity control',
      'commercial': 'commercial building HVAC systems with VAV boxes and energy recovery'
    };
    contextEnhancements.push(`This is for a ${facilityContexts[hvacContext.facilityType] || hvacContext.facilityType}.`);
  }
  
  return contextEnhancements.length > 0 
    ? `${basePrompt}\n\n**HVAC CONTEXT ENHANCEMENT:**\n${contextEnhancements.join(' ')}`
    : basePrompt;
}

/**
 * Calculate adaptive thinking budget based on image complexity and HVAC context
 */
function calculateThinkingBudget(imageSize: number, hvacContext?: any): number {
  // Base budget based on image size (larger images need more analysis)
  let baseBudget = Math.min(MAX_THINKING_BUDGET, Math.max(MIN_THINKING_BUDGET, imageSize / IMAGE_SIZE_DIVISOR));
  
  // HVAC complexity multipliers - more complex systems need deeper analysis
  const complexityMultipliers: Record<string, number> = {
    'data_center': 1.5,      // High redundancy, complex control
    'hospital': 1.4,         // Strict code compliance, pressure relationships
    'laboratory': 1.6,       // Precise control, complex exhaust
    'refrigeration': 1.3,    // Complex thermodynamic cycles
    'chilled_water': 1.2     // Primary/secondary systems
  };
  
  let multiplier = 1.0;
  
  if (hvacContext) {
    if (hvacContext.facilityType && complexityMultipliers[hvacContext.facilityType]) {
      multiplier = Math.max(multiplier, complexityMultipliers[hvacContext.facilityType]);
    }
    if (hvacContext.systemType && complexityMultipliers[hvacContext.systemType]) {
      multiplier = Math.max(multiplier, complexityMultipliers[hvacContext.systemType]);
    }
  }
  
  return Math.min(MAX_THINKING_BUDGET_CAP, Math.floor(baseBudget * multiplier)); // Cap at 64K tokens
}

/**
 * Advanced JSON cleanup and normalization
 */
function cleanJSONResponse(jsonText: string): string {
  // Remove markdown code blocks with various formats
  jsonText = jsonText
    .replace(/^```(?:json)?\s*/gm, '')
    .replace(/\s*```$/gm, '')
    .replace(/```/g, '');
  
  // Fix common JSON syntax issues
  jsonText = jsonText
    .replace(/,\s*}/g, '}')          // Remove trailing commas before }
    .replace(/,\s*]/g, ']')          // Remove trailing commas before ]
    .replace(/'/g, '"')              // Convert single quotes to double quotes
    .replace(/\bundefined\b/g, 'null') // Convert undefined to null
    .replace(/\bNaN\b/g, 'null')     // Convert NaN to null
    .replace(/\bInfinity\b/g, '1e308'); // Handle Infinity
  
  // Fix truncated JSON
  if (!jsonText.trim().startsWith('{')) {
    jsonText = '{' + jsonText;
  }
  if (!jsonText.trim().endsWith('}')) {
    jsonText = jsonText + '}';
  }
  
  return jsonText;
}

/**
 * Validate result and apply intelligent recovery strategies
 */
function validateAndRecoverResult(jsonText: string, attempt: number): any {
  try {
    const parsed = JSON.parse(jsonText);
    
    // Validate minimum required structure
    if (!parsed.components || !Array.isArray(parsed.components)) {
      console.warn('⚠️ Missing components array - applying structure recovery');
      parsed.components = [];
    }
    
    // Validate component structure and apply recovery
    parsed.components.forEach((comp: any, index: number) => {
      if (!comp.id || !comp.label || !comp.bbox || comp.confidence === undefined) {
        console.warn(`⚠️ Component ${index} missing required fields - applying recovery`);
        comp.id = comp.id || generateId(); // Use unique ID generator
        comp.label = comp.label || 'unknown';
        comp.confidence = comp.confidence || 0.5;
        comp.bbox = comp.bbox || [0.1, 0.1, 0.2, 0.2];
      }
      
      // Ensure meta object exists with reasoning
      if (!comp.meta) {
        comp.meta = {};
      }
      if (!comp.meta.reasoning) {
        comp.meta.reasoning = 'Component detected but reasoning not provided';
      }
    });
    
    return parsed;
    
  } catch (error) {
    console.error('❌ JSON Parsing Failed:', error);
    console.error('📄 Text snippet:', jsonText.substring(0, 500) + '...');
    
    // Intelligent recovery based on attempt number
    if (attempt === 0) {
      // First attempt failure - try pattern-based extraction
      return {
        components: extractComponentsFromText(jsonText),
        connections: [],
        control_loops: [],
        summary: `Initial analysis failed: ${error instanceof Error ? error.message : String(error)}. Using pattern extraction fallback.`
      };
    } else {
      // Multiple failures - return minimal valid structure
      return createMinimalValidResult(jsonText);
    }
  }
}

/**
 * Extract HVAC components from raw text when JSON parsing fails
 */
function extractComponentsFromText(text: string): any[] {
  const components: any[] = [];
  
  // Common HVAC component tag patterns
  const hvacPatterns = [
    { pattern: /(?:TI|TE|TT|TIC|TIR|TIT)-\d+/g, type: 'sensor_temperature' },
    { pattern: /(?:PI|PE|PT|PIC|PIR|PIT)-\d+/g, type: 'sensor_pressure' },
    { pattern: /(?:FI|FE|FT|FIC|FIR|FIT)-\d+/g, type: 'sensor_flow' },
    { pattern: /(?:LI|LE|LT|LIC|LIR|LIT)-\d+/g, type: 'sensor_level' },
    { pattern: /(?:HV|CV|FV|TV|PV|LV)-\d+/g, type: 'valve_control' },
    { pattern: /(?:FCV|TCV|PCV|LCV)-\d+/g, type: 'valve_control' },
    { pattern: /(?:SOV|SV)-\d+/g, type: 'valve_solenoid' },
    { pattern: /(?:BV)-\d+/g, type: 'valve_ball' },
    { pattern: /(?:AHU|FCU|VAV)-\d+/g, type: 'air_handler' },
    { pattern: /(?:PUMP)-\d+/g, type: 'pump' },
    { pattern: /(?:CHILLER)-\d+/g, type: 'chiller' },
    { pattern: /(?:CT|COOLING_TOWER)-\d+/g, type: 'cooling_tower' }
  ];
  
  hvacPatterns.forEach(({ pattern, type }) => {
    const matches = text.match(pattern) || [];
    const uniqueMatches = [...new Set(matches)]; // Remove duplicates
    
    uniqueMatches.forEach(match => {
      components.push({
        id: generateId(), // Use unique ID generator
        label: match.trim(),
        type: type,
        bbox: [0.1, 0.1, 0.2, 0.2], // Placeholder bbox
        confidence: 0.6,
        meta: {
          tag: match.trim(),
          description: `Pattern-extracted ${type.replace('_', ' ')}`,
          reasoning: 'Recovered from failed JSON parsing using pattern matching',
          extraction_method: 'pattern_match',
          hvac_subsystem: 'controls' // Default subsystem
        }
      });
    });
  });
  
  console.log(`🔍 Pattern extraction recovered ${components.length} components`);
  
  // Add generic component if none found
  if (components.length === 0) {
    components.push({
      id: generateId(), // Use unique ID generator
      label: 'unknown_component',
      type: 'equipment',
      bbox: [0.1, 0.1, 0.2, 0.2],
      confidence: 0.3,
      meta: {
        description: 'Fallback component - analysis failed',
        reasoning: 'No components detected in text - minimal fallback structure',
        hvac_subsystem: 'controls'
      }
    });
  }
  
  return components;
}

/**
 * Create minimal valid result structure when all else fails
 */
function createMinimalValidResult(fallbackText: string): any {
  return {
    components: [
      {
        id: generateId(), // Use unique ID generator
        label: 'analysis_failed',
        type: 'equipment',
        bbox: [0.0, 0.0, 1.0, 1.0],
        confidence: 0.1,
        meta: {
          description: 'Analysis failed - minimal fallback structure',
          reasoning: 'All parsing attempts failed',
          raw_text_sample: fallbackText.substring(0, 200) + '...',
          hvac_subsystem: 'controls'
        }
      }
    ],
    connections: [],
    control_loops: [],
    summary: `CRITICAL: Analysis pipeline failed. Raw response: ${fallbackText.substring(0, 500)}...`
  };
}

/**
 * Calculate comprehensive result confidence score
 */
function calculateResultConfidence(result: any, hvacContext?: any): number {
  if (!result.components || !Array.isArray(result.components)) return 0.0;
  
  const componentCount = result.components.length;
  if (componentCount === 0) return 0.0;
  
  // Average component confidence
  const avgConfidence = result.components.reduce((sum: number, comp: any) => 
    sum + (comp.confidence || 0.5), 0) / componentCount;
  
  // Component count factor (more components = better coverage)
  const countFactor = Math.min(1.0, componentCount / 50);
  
  // Quality factor based on metadata completeness
  let qualityScore = 0.5;
  const hasReasoning = result.components.every((comp: any) => comp.meta?.reasoning);
  const hasTags = result.components.every((comp: any) => comp.meta?.tag || comp.label);
  const hasSubsystems = result.components.some((comp: any) => comp.meta?.hvac_subsystem);
  
  if (hasReasoning) qualityScore += 0.3;
  if (hasTags) qualityScore += 0.1;
  if (hasSubsystems) qualityScore += 0.1;
  if (result.connections?.length > 0) qualityScore += 0.1;
  if (result.control_loops?.length > 0) qualityScore += 0.1;
  
  qualityScore = Math.min(1.0, qualityScore);
  
  // Context awareness bonus
  let contextBonus = 0.0;
  if (hvacContext) {
    const contextSignals = [
      hvacContext.systemType,
      hvacContext.facilityType
    ].filter(Boolean).length;
    
    contextBonus = Math.min(0.10, contextSignals * 0.05);
  }
  
  // Final confidence calculation
  const finalConfidence = (
    avgConfidence * 0.5 +
    countFactor * 0.2 +
    qualityScore * 0.25 +
    contextBonus * 0.05
  );
  
  return parseFloat(finalConfidence.toFixed(3));
}

/**
 * Create fallback result when all analysis attempts fail
 */
function createFallbackResult(hvacContext?: any): any {
  console.warn('⚠️ Creating fallback result after all analysis attempts failed');
  
  return {
    components: [
      {
        id: generateId(), // Use unique ID generator
        label: 'analysis_failed',
        type: 'equipment',
        bbox: [0.0, 0.0, 1.0, 1.0],
        confidence: 0.1,
        meta: {
          description: 'Analysis failed - fallback structure',
          reasoning: 'All analysis attempts failed - check image quality and format',
          hvac_context: hvacContext,
          hvac_subsystem: 'controls'
        }
      }
    ],
    connections: [],
    control_loops: [],
    summary: `CRITICAL ERROR: Analysis pipeline failed after all retry attempts. This may indicate:
1. Image quality issues (blurry, low resolution)
2. Unsupported file format
3. Extremely complex drawing requiring manual review
4. AI service connectivity issues

Please verify image quality and try again.`,
    metadata: {
      fallback_created: true,
      timestamp: new Date().toISOString(),
      error_context: 'all_attempts_failed'
    }
  };
}