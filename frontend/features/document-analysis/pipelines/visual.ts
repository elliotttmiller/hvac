/**
 * Visual Pipeline - Blueprint Analysis (SOTA Implementation)
 * Implements Visual Grid Tiling + Map-Reduce + Self-Correction
 * Detects HVAC components and connections using configured AI provider
 */

import { getAIClient } from '../../../lib/ai/client';
import { getSemanticCache } from '../../../lib/ai/cache';
import { config } from '../../../app/config';
import { VisualAnalysisResult, VISUAL_ANALYSIS_SCHEMA, DetectedComponent, Connection } from '../types';
import { DETECT_SYSTEM_INSTRUCTION, DETECT_PROMPT } from '../prompts/visual/detect';
import { 
  PID_DETECT_SYSTEM_INSTRUCTION, 
  PID_DETECT_PROMPT, 
  PID_ANALYSIS_SCHEMA, 
  generatePIDRefinePrompt 
} from '../prompts/visual/detect-pid';
import { REFINE_SYSTEM_INSTRUCTION, generateRefinePrompt } from '../prompts/refinement';
import { tileImage, shouldTileImage, TileResult } from '../../../lib/file-processing/tiling';
import { mergeComponents, localToGlobal, calculateIoU } from '../../../lib/utils/math';
import { normalizeBackendBBox } from '../../../lib/geometry';
import { generateId } from '../../../lib/utils';

type BlueprintType = 'PID' | 'HVAC';

/**
 * Get appropriate prompts based on blueprint type
 */
function getPromptsForBlueprintType(blueprintType: BlueprintType): {
  systemInstruction: string;
  prompt: string;
  schema: any;
} {
  if (blueprintType === 'PID') {
    return {
      systemInstruction: PID_DETECT_SYSTEM_INSTRUCTION,
      prompt: PID_DETECT_PROMPT,
      schema: PID_ANALYSIS_SCHEMA
    };
  }
  
  return {
    systemInstruction: DETECT_SYSTEM_INSTRUCTION,
    prompt: DETECT_PROMPT,
    schema: VISUAL_ANALYSIS_SCHEMA
  };
}

/**
 * Analyze blueprint for components and connections
 */
export async function analyzeVisual(imageData: string): Promise<VisualAnalysisResult> {
  try {
    // Check cache first
    const cache = getSemanticCache();
    // Use a hash of the image data for the cache key to prevent collisions
    // In production, use a proper hash. For now, use a longer substring + length
    const cacheKey = `visual:${imageData.length}:${imageData.substring(imageData.length - 64)}`;
    
    if (config.features.semanticCache) {
      const cached = await cache.get<VisualAnalysisResult>(cacheKey);
      if (cached) {
        console.log('Visual analysis cache hit');
        // Mark as cached for the orchestrator
        (cached as any)._from_cache = true;
        return cached;
      }
    }

    // Step 1: Detect blueprint type (P&ID vs HVAC)
    console.log('Detecting blueprint type (P&ID vs HVAC)...');
    const blueprintType = await detectBlueprintType(imageData);
    console.log(`Blueprint type detected: ${blueprintType}`);

    // Determine if we should use tiling based on image size
    const useTiling = await shouldUseTiling(imageData);
    
    let result: VisualAnalysisResult;
    
    if (useTiling) {
      console.log('Using SOTA tiling approach for high-resolution image');
      result = await analyzeWithTiling(imageData, blueprintType);
    } else {
      console.log('Using standard single-pass analysis');
      result = await analyzeStandard(imageData, blueprintType);
    }

    // Cache the result
    if (config.features.semanticCache) {
      await cache.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    console.error('Visual analysis error:', error);
    
    // Return empty result on error
    return {
      components: [],
      connections: [],
      metadata: {
        total_components: 0,
        total_connections: 0,
        error: error instanceof Error ? error.message : String(error)
      },
    };
  }
}

async function detectBlueprintType(imageData: string): Promise<BlueprintType> {
  const client = getAIClient();
  const detectionPrompt = `
Analyze this engineering diagram.
Return ONLY "PID" if it contains instrumentation bubbles (circles with text like PI, TT, FIC) and valve symbols.
Return ONLY "HVAC" if it contains ductwork, VAV boxes, and diffusers.
`;

  try {
    const response = await client.generateVision({
      imageData,
      prompt: detectionPrompt,
      options: {
        systemInstruction: 'You are an engineering classifier. Respond with ONLY "PID" or "HVAC".',
        temperature: 0.1,
      },
    });

    const cleaned = response.trim().toUpperCase();
    if (cleaned.includes('PID') || cleaned.includes('INSTRUMENT')) {
      return 'PID';
    }
    return 'HVAC';
  } catch (error) {
    console.warn('Blueprint type detection failed, defaulting to HVAC:', error);
    return 'HVAC';
  }
}

async function analyzeStandard(imageData: string, blueprintType: BlueprintType): Promise<VisualAnalysisResult> {
  const client = getAIClient();
  const { systemInstruction, prompt, schema } = getPromptsForBlueprintType(blueprintType);
  
  const responseText = await client.generateVision({
    imageData,
    prompt,
    options: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: schema,
      temperature: 0.1, // Strict for JSON
    },
  });

  return parseVisualResponse(responseText);
}

async function analyzeWithTiling(imageData: string, blueprintType: BlueprintType): Promise<VisualAnalysisResult> {
  const client = getAIClient();
  const { systemInstruction, prompt, schema } = getPromptsForBlueprintType(blueprintType);
  
  // 1. Tile
  const tileResult = await tileImage(imageData, 'image/png', 10);
  
  // 2. Map (Parallel)
  const tileAnalyses = await Promise.all(
    tileResult.tiles.map(async (tile) => {
      const responseText = await client.generateVision({
        imageData: tile.data,
        prompt,
        options: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.1,
        },
      });
      
      const tileResult = parseVisualResponse(responseText);
      return { tile, result: tileResult };
    })
  );
  
  // 3. Reduce (Merge)
  const mergedResult = mergeTileResults(tileAnalyses, tileResult);
  
  // 4. Refine (Full Image)
  const refinedResult = await refineWithFullImage(
    mergedResult,
    tileResult.fullImage.data,
    blueprintType
  );
  
  return refinedResult;
}

function mergeTileResults(
  tileAnalyses: Array<{ tile: any; result: VisualAnalysisResult }>,
  tileData: TileResult
): VisualAnalysisResult {
  console.log('[Visual Pipeline][Merge] mergeTileResults called - tiles:', tileAnalyses.length);
  console.debug('[Visual Pipeline][Merge] tileData.metadata:', tileData.metadata);

  const allComponents: DetectedComponent[] = [];
  const allConnections: Connection[] = [];
  
  for (const { tile, result } of tileAnalyses) {
    for (const component of result.components) {
      // Transform local to global
      try {
        const globalBbox = localToGlobal(component.bbox, tile.bbox);
        console.debug('[Visual Pipeline][Merge] tile:', tile.position, 'local bbox:', component.bbox, '-> global bbox:', globalBbox);

        allComponents.push({
          ...component,
          bbox: globalBbox,
          meta: {
            ...component.meta,
            source_tile: tile.position,
          },
        });
      } catch (err) {
        console.error('[Visual Pipeline][Merge] Failed to transform bbox for component', component.id, 'error:', err);
        // Push component with original bbox so it's visible for debugging
        allComponents.push({
          ...component,
          bbox: component.bbox,
          meta: {
            ...component.meta,
            source_tile: tile.position,
            transform_error: String(err)
          },
        });
      }
    }
    
    allConnections.push(...result.connections);
  }
  
  // Deduplicate
  const deduplicatedComponents = mergeComponents(allComponents, 0.5);
  
  return {
    components: deduplicatedComponents as unknown as DetectedComponent[],
    connections: allConnections,
    metadata: {
      total_components: deduplicatedComponents.length,
      total_connections: allConnections.length,
    },
  };
}

async function refineWithFullImage(
  mergedResult: VisualAnalysisResult,
  fullImageData: string,
  blueprintType: BlueprintType
): Promise<VisualAnalysisResult> {
  const client = getAIClient();
  
  const refinePrompt = blueprintType === 'PID' 
    ? generatePIDRefinePrompt(mergedResult)
    : generateRefinePrompt(mergedResult);
  
  const responseText = await client.generateVision({
    imageData: fullImageData,
    prompt: refinePrompt,
    options: {
      systemInstruction: 'You are a QA Auditor. Fix the JSON.',
      responseMimeType: 'application/json',
      responseSchema: blueprintType === 'PID' ? PID_ANALYSIS_SCHEMA : VISUAL_ANALYSIS_SCHEMA,
      temperature: 0.1,
    },
  });
  
  const refinedResult = parseVisualResponse(responseText);

  // --- CRITICAL FIX: PRESERVE TILED COORDINATES ---
  // Map high-precision BBoxes from 'mergedResult' back onto 'refinedResult'
  const finalComponents = refinedResult.components.map(refinedComp => {
    console.debug('[Visual Pipeline][Refine] refinedComp:', refinedComp.id, 'bbox:', refinedComp.bbox);
    // 1. Try Exact ID Match
    let match = mergedResult.components.find(c => c.id === refinedComp.id);
    
    // 2. Try Label Match (if ID changed but text is same)
    if (!match && refinedComp.label) {
      match = mergedResult.components.find(c => c.label === refinedComp.label);
    }
    
    // 3. Try Spatial Match (IoU > 0.5)
    if (!match) {
      // compute IoU values for debugging
      let best: { c: any; iou: number } | null = null;
      for (const c of mergedResult.components) {
        const iou = calculateIoU(c.bbox, refinedComp.bbox);
        if (!best || iou > best.iou) best = { c, iou };
      }
      if (best) {
        console.debug('[Visual Pipeline][Refine] Best spatial match for', refinedComp.id, 'is', best.c.id, 'iou=', best.iou);
        if (best.iou > 0.5) match = best.c;
      }
    }

    if (match) {
      console.debug('[Visual Pipeline][Refine] Mapping refined', refinedComp.id, '-> matched', match.id, 'using bbox:', match.bbox);
      // Use the Tiled BBox (High Precision) instead of the Refined BBox (Low Precision)
      return {
        ...refinedComp,
        bbox: match.bbox, 
        confidence: Math.max(refinedComp.confidence, match.confidence)
      };
    }
    
    return refinedComp; // Keep new items found during refinement
  });

  return {
    ...refinedResult,
    components: finalComponents,
    connections: refinedResult.connections.length > 0 ? refinedResult.connections : mergedResult.connections,
    metadata: {
        ...refinedResult.metadata,
        total_components: finalComponents.length
    }
  };
}

async function shouldUseTiling(imageData: string): Promise<boolean> {
  try {
    const normalized = imageData.includes('base64,') ? imageData.split('base64,')[1] : imageData;
    // Tiling is expensive. Only use for images > 500KB or very large dimensions.
    return normalized.length > 500000; 
  } catch {
    return false;
  }
}

/**
 * Robust JSON Parsing with Infinite Precision Fix
 */
function parseVisualResponse(responseText: string): VisualAnalysisResult {
  try {
    // 1. Clean Markdown
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText
        .replace(/^```json\s*/, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    // 2. Safeguard: Truncate extremely long floating point numbers using Regex
    // This catches the "0.123456789..." hallucination before JSON.parse chokes
    cleanText = cleanText.replace(/(\d+\.\d{10,})/g, (match) => {
      return parseFloat(match).toFixed(4);
    });

    const parsed = JSON.parse(cleanText);

    // Validate structure (Handle both schema formats)
    const components = Array.isArray(parsed.components) ? parsed.components : (parsed.entities || []);
    const connections = Array.isArray(parsed.connections) ? parsed.connections : [];

    // Ensure all components have required fields and record normalization metadata
    const validatedComponents = components.map((comp: any) => {
      const rawBBox = comp.bbox || comp.bbox_2d || null;
      const normalizedBBox = validateBBox(rawBBox);

      const baseMeta = comp.meta || {
        description: comp.description || comp.functional_desc,
        reasoning: comp.reasoning
      };

      const transformHistory = Array.isArray(baseMeta?.transform_history) ? [...baseMeta.transform_history] : [];
      transformHistory.push({
        timestamp: new Date().toISOString(),
        operation: 'normalize_bbox',
        details: {
          original_bbox: rawBBox,
          normalized_bbox: normalizedBBox
        }
      });

      const baseComponent = {
        id: comp.id || generateId(),
        type: comp.type || 'unknown',
        label: comp.label || comp.tag || 'unknown',
        bbox: normalizedBBox,
        confidence: typeof comp.confidence === 'number' ? comp.confidence : 0.5,
        rotation: typeof comp.rotation === 'number' ? Math.round(comp.rotation) : 0,
        meta: {
          ...baseMeta,
          raw_backend_output: rawBBox,
          transform_history: transformHistory
        },
      } as any;
      
      // Apply HVAC-specific enhancements
      return enhanceHVACComponent(baseComponent);
    });

    // Ensure all connections have required fields
    const validatedConnections = connections.map((conn: any) => ({
      id: conn.id || generateId(),
      from_id: conn.from_id || '',
      to_id: conn.to_id || '',
      type: conn.type || 'unknown',
      confidence: conn.confidence,
    }));

    return {
      components: validatedComponents,
      connections: validatedConnections,
      metadata: {
        total_components: validatedComponents.length,
        total_connections: validatedConnections.length,
        process_log: parsed.summary || parsed.process_log
      },
    };
  } catch (error) {
    console.error('[Visual Pipeline - Parse] Failed to parse response:', error);
    console.error('[Visual Pipeline - Parse] Text snippet:', responseText.substring(0, 500) + '...');
    
    return {
      components: [],
      connections: [],
      metadata: { 
        total_components: 0, 
        total_connections: 0,
        parse_error: error instanceof Error ? error.message : String(error)
      },
    };
  }
}

function validateBBox(bbox: any): [number, number, number, number] {
  if (!Array.isArray(bbox) || bbox.length !== 4) return [0,0,0,0];
  try {
    // Use geometry heuristic to normalize and canonicalize various backend bbox formats
    const normalized = normalizeBackendBBox(bbox as number[]);
    return normalized as [number, number, number, number];
  } catch (err) {
    console.warn('[Visual Pipeline] validateBBox failed to normalize bbox', bbox, err);
    // Fallback: attempt simple scaling
    const maxVal = Math.max(...bbox);
    if (maxVal > 1.0) {
      return bbox.map((v: number) => v / 1000) as [number, number, number, number];
    }
    return bbox as [number, number, number, number];
  }
}

/**
 * HVAC-Specific Helper Functions
 * These functions add HVAC intelligence to component detection
 */

// ISA-5.1 prefix-based type mapping
const ISA_PREFIX_TYPE_MAP: Record<string, string> = {
  'TT': 'sensor_temperature',
  'TI': 'sensor_temperature',
  'TE': 'sensor_temperature',
  'TIC': 'instrument_controller',
  'PT': 'sensor_pressure',
  'PI': 'sensor_pressure',
  'PE': 'sensor_pressure',
  'PIC': 'instrument_controller',
  'FT': 'sensor_flow',
  'FI': 'sensor_flow',
  'FE': 'sensor_flow',
  'FIC': 'instrument_controller',
  'LT': 'sensor_level',
  'LI': 'sensor_level',
  'LE': 'sensor_level',
  'LIC': 'instrument_controller',
  'FV': 'valve_control',
  'TV': 'valve_control',
  'PV': 'valve_control',
  'LV': 'valve_control',
  'HV': 'valve_control',
  'SOV': 'valve_solenoid',
  'BV': 'valve_ball',
  'CV': 'valve_control',
  'AHU': 'air_handler',
  'FCU': 'air_handler',
  'VAV': 'air_handler',
  'PUMP': 'pump',
  'CHILLER': 'chiller',
  'CT': 'cooling_tower'
};

/**
 * Normalize HVAC component type based on ISA-5.1 tag prefix
 */
function normalizeHVACComponentType(comp: any): any {
  if (!comp.meta?.tag && !comp.label) return comp;
  
  const tag = (comp.meta?.tag || comp.label).toUpperCase();
  const normalized = { ...comp };
  
  // Check for ISA prefix matches
  for (const [prefix, type] of Object.entries(ISA_PREFIX_TYPE_MAP)) {
    if (tag.startsWith(prefix)) {
      normalized.type = type;
      break;
    }
  }
  
  // Equipment-based normalization for common HVAC equipment
  if (tag.includes('AHU')) normalized.type = 'air_handler';
  if (tag.includes('PUMP')) normalized.type = 'pump';
  if (tag.includes('CHILLER')) normalized.type = 'chiller';
  
  return normalized;
}

/**
 * Determine HVAC subsystem classification for a component
 */
function determineHVACSubsystem(comp: any): string {
  const tag = (comp.meta?.tag || comp.label || '').toUpperCase();
  
  // Chilled water system indicators
  if (tag.includes('CHW') || tag.includes('CHILLED') || 
      ['CHILLER', 'COOLING_TOWER'].includes(comp.type)) {
    return 'chilled_water';
  }
  
  // Condenser water system
  if (tag.includes('CNDW') || tag.includes('CONDENSER')) {
    return 'condenser_water';
  }
  
  // Air handling system
  if (tag.includes('AHU') || tag.includes('FCU') || tag.includes('VAV') || 
      ['air_handler', 'air_handling_unit', 'fan_coil_unit'].includes(comp.type)) {
    return 'air_handling';
  }
  
  // Refrigeration system
  if (tag.includes('REF') || tag.includes('REFRIG') || 
      ['compressor', 'condenser', 'evaporator', 'expansion_valve'].includes(comp.type)) {
    return 'refrigeration';
  }
  
  // Heating system
  if (tag.includes('HW') || tag.includes('HEAT') || tag.includes('BOILER')) {
    return 'heating_water';
  }
  
  // Controls and instrumentation
  if (['sensor_temperature', 'sensor_pressure', 'sensor_flow', 'sensor_level',
       'instrument_controller', 'valve_control', 'damper'].includes(comp.type)) {
    return 'controls';
  }
  
  return 'other';
}

/**
 * Extract ISA-5.1 function code from tag
 */
function extractISAFunction(tag?: string): string | null {
  if (!tag) return null;
  
  // Match ISA-5.1 function codes (1-3 letters followed by dash and numbers)
  const match = tag.match(/^([A-Z]{1,3})-(\d+)/i);
  if (match) {
    return match[1].toUpperCase();
  }
  
  return null;
}

/**
 * Enhance component with HVAC-specific metadata
 */
function enhanceHVACComponent(comp: any): any {
  const enhanced = normalizeHVACComponentType(comp);
  
  // Add HVAC-specific metadata
  enhanced.meta = {
    ...enhanced.meta,
    hvac_subsystem: enhanced.meta?.hvac_subsystem || determineHVACSubsystem(enhanced),
    component_category: getHVACComponentCategory(enhanced),
    isa_function: extractISAFunction(enhanced.meta?.tag || enhanced.label),
    detection_quality: assessDetectionQuality(enhanced)
  };
  
  return enhanced;
}

/**
 * Get HVAC component category for filtering and grouping
 */
function getHVACComponentCategory(comp: any): string {
  const subsystem = comp.meta?.hvac_subsystem || determineHVACSubsystem(comp);
  
  if (['chilled_water', 'condenser_water', 'heating_water'].includes(subsystem)) {
    return 'water_system';
  }
  
  if (subsystem === 'air_handling') {
    return 'air_system';
  }
  
  if (subsystem === 'refrigeration') {
    return 'refrigeration';
  }
  
  if (subsystem === 'controls') {
    return 'controls';
  }
  
  return 'equipment';
}

/**
 * Assess detection quality for confidence scoring
 */
function assessDetectionQuality(comp: any): string {
  if (!comp.confidence) return 'unknown';
  
  if (comp.confidence >= 0.9) return 'excellent';
  if (comp.confidence >= 0.7) return 'good';
  if (comp.confidence >= 0.5) return 'fair';
  return 'poor';
}