/**
 * Visual Pipeline - Blueprint Analysis (SOTA Implementation)
 * Implements Visual Grid Tiling + Map-Reduce + Self-Correction
 * Detects HVAC components and connections using configured AI provider
 * 
 * ENHANCEMENTS:
 * - ISA-5.1 function detection for improved tag recognition
 * - Connection inference and validation
 * - Control loop detection
 * - Optimized parallel processing
 * - Quality metrics calculation
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
import { enhanceVisualAnalysis, optimizedTileProcessing, calculateQualityMetrics } from './visual-enhancements';

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

    // ENHANCEMENT: Apply post-processing enhancements
    console.log('[Visual Pipeline] Applying enhancements...');
    result = await enhanceVisualAnalysis(result, {
      enableSpatialAssociation: true, // ZERO-HITL: Merge orphaned labels
      enableShapeValidation: true,    // ZERO-HITL: Enforce geometric consistency
      enableISADetection: true,
      enableConnectionInference: true,
      enableLoopDetection: true,
      enableValidation: true
    });
    
    // Calculate quality metrics
    const qualityMetrics = calculateQualityMetrics(result);
    console.log('[Visual Pipeline] Quality Score:', qualityMetrics.overall_score.toFixed(2));
    result.metadata = {
      ...result.metadata,
      quality_metrics: qualityMetrics
    };

    // Cache the enhanced result
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
  console.log('[Visual Pipeline] Creating image tiles...');
  const tileResult = await tileImage(imageData, 'image/png', 10);
  console.log(`[Visual Pipeline] Created ${tileResult.tiles.length} tiles`);
  
  // 2. Map (Optimized Parallel Processing)
  console.log('[Visual Pipeline] Processing tiles in parallel...');
  const tileAnalyses = await optimizedTileProcessing(
    tileResult.tiles,
    async (tile, index) => {
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
    },
    {
      maxConcurrency: 4, // Process 4 tiles at a time
      onProgress: (completed, total) => {
        console.log(`[Visual Pipeline] Tile progress: ${completed}/${total}`);
      }
    }
  );
  
  // 3. Reduce (Merge)
  console.log('[Visual Pipeline] Merging tile results...');
  const mergedResult = mergeTileResults(tileAnalyses, tileResult);
  
  // 4. Refine (Full Image)
  console.log('[Visual Pipeline] Refining with full image context...');
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
      // If the model provided a polygon, prefer computing a tight bbox from it
      let normalizedBBox = validateBBox(rawBBox);
      if (Array.isArray(comp.polygon) && comp.polygon.length >= 6) {
        try {
          const pts = comp.polygon;
          let xs: number[] = [];
          let ys: number[] = [];
          for (let i = 0; i < pts.length; i += 2) {
            const x = Number(pts[i]);
            const y = Number(pts[i+1]);
            if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
            xs.push(x);
            ys.push(y);
          }
          if (xs.length > 0 && ys.length > 0) {
            const minX = Math.max(0, Math.min(...xs));
            const minY = Math.max(0, Math.min(...ys));
            const maxX = Math.min(1, Math.max(...xs));
            const maxY = Math.min(1, Math.max(...ys));
            normalizedBBox = [minX, minY, maxX, maxY] as [number, number, number, number];
          }
        } catch (e) {
          console.warn('[Visual Pipeline] Failed to compute bbox from polygon:', e);
        }
      }

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
      // If the model provided a polygon, include it in meta for downstream use
      if (Array.isArray(comp.polygon)) {
        baseComponent.meta.polygon = comp.polygon;
        baseComponent.meta.polygon_source = 'model_polygon';
      }
      
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

/**
 * Resolve type conflicts between visual shape and text tag (SHAPE-FIRST LOGIC)
 * This is the "Conflict Resolution Engine" that enforces visual precision.
 * 
 * @param tag - The text label (e.g., "PV-101", "TV-202")
 * @param shape - The detected geometric shape (e.g., "circle", "bowtie")
 * @param visualSignature - Detailed visual pattern (e.g., "circle_empty", "bowtie_with_actuator")
 * @param aiType - The type suggested by AI (may be incorrect)
 * @returns Corrected type and reasoning
 */
function resolveTypeConflict(
  tag: string, 
  shape: string, 
  visualSignature: string | undefined,
  aiType: string
): { correctedType: string; reasoning: string } {
  const tagUpper = tag.toUpperCase();
  const shapeLower = shape.toLowerCase();
  const sigLower = (visualSignature || '').toLowerCase();
  const typeLower = aiType.toLowerCase();
  
  // --- RULE 1: "Circle Safety" Rule ---
  // IF Shape = Circle (without internal actuating line) AND Type contains "valve" (but NOT Ball/Butterfly)
  // THEN: Auto-correct to instrument/indicator
  if (shapeLower === 'circle') {
    // Check if it's a Ball or Butterfly valve (allowed circular valves)
    const isBallValve = sigLower.includes('diagonal') || typeLower.includes('ball');
    const isButterflyValve = sigLower.includes('bar') || typeLower.includes('butterfly');
    
    if (!isBallValve && !isButterflyValve) {
      // Simple circle - check if incorrectly classified as valve
      if (typeLower.includes('valve') && !typeLower.includes('ball') && !typeLower.includes('butterfly')) {
        // Determine correct instrument type based on tag
        let correctedType = 'instrument_indicator';
        if (tagUpper.startsWith('P')) correctedType = 'sensor_pressure';
        else if (tagUpper.startsWith('T')) correctedType = 'sensor_temperature';
        else if (tagUpper.startsWith('F')) correctedType = 'sensor_flow';
        else if (tagUpper.startsWith('L')) correctedType = 'sensor_level';
        
        return {
          correctedType,
          reasoning: `Visual evidence (Circle shape) overrides tag inference. Reclassified from ${aiType} to ${correctedType}. In HVAC/BAS, circular symbols without internal actuating lines are instruments/sensors, not valves. Tag '${tag}' likely indicates an indicator or sensor.`
        };
      }
    }
  }
  
  // --- RULE 2: "PV Circle" Rule (HVAC Domain Specific) ---
  // IF Tag starts with "PV" AND Shape = Circle (empty) → Pressure Indicator, NOT Valve
  if (tagUpper.startsWith('PV') && shapeLower === 'circle') {
    const isEmptyCircle = sigLower === 'circle_empty' || (!sigLower.includes('diagonal') && !sigLower.includes('bar'));
    if (isEmptyCircle && typeLower.includes('valve')) {
      return {
        correctedType: 'instrument_indicator',
        reasoning: `Shape-based correction: Circle labeled 'PV' is a Pressure Indicator (Pressure View), not a Pressure Valve. Visual geometry (simple circle) confirms this is an instrument for displaying pressure readings, per HVAC/BAS conventions.`
      };
    }
  }
  
  // --- RULE 3: "*I" Tags (Indicators) ---
  // IF Tag ends with "I" (PI, TI, FI, LI, etc.) AND Shape = Circle → Always Indicator
  if (tagUpper.match(/^[A-Z]{1,2}I(-?\d+)?$/) && shapeLower === 'circle') {
    if (typeLower.includes('valve')) {
      return {
        correctedType: 'instrument_indicator',
        reasoning: `Tag ending with 'I' (${tag}) indicates an Indicator instrument. Visual confirmation: circular shape. Reclassified from ${aiType} to instrument_indicator per ISA-5.1 standards.`
      };
    }
  }
  
  // --- RULE 4: "Actuator" Rule ---
  // IF Shape = Bowtie with Actuator AND Type = Gate/Globe Valve → Control Valve
  if (shapeLower === 'bowtie' && sigLower === 'bowtie_with_actuator') {
    if (typeLower.includes('gate') || typeLower.includes('globe')) {
      return {
        correctedType: 'valve_control',
        reasoning: `Visual evidence (Actuator symbol on bowtie body) indicates automated control. Reclassified from ${aiType} to valve_control. Actuators are used for modulating/automated valves, not manual gate/globe valves.`
      };
    }
  }
  
  // --- RULE 5: Empty Bowtie = Gate Valve (NOT Control) ---
  if (shapeLower === 'bowtie' && sigLower === 'bowtie_empty') {
    if (typeLower.includes('control')) {
      return {
        correctedType: 'valve_gate',
        reasoning: `Visual evidence (Empty bowtie without actuator) indicates manual gate valve for isolation. Reclassified from ${aiType} to valve_gate. Control valves require actuator symbols.`
      };
    }
  }
  
  // --- RULE 6: Bowtie with Solid Center = Globe Valve ---
  if (shapeLower === 'bowtie' && sigLower === 'bowtie_solid_center') {
    if (!typeLower.includes('globe')) {
      return {
        correctedType: 'valve_globe',
        reasoning: `Visual evidence (Bowtie with solid center dot) indicates globe valve geometry. Reclassified from ${aiType} to valve_globe per ISA-5.1 symbology.`
      };
    }
  }
  
  // No conflict detected - return original type
  return {
    correctedType: aiType,
    reasoning: ''
  };
}

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
 * Uses regex-based pattern matching for deterministic categorization
 */
function determineHVACSubsystem(comp: any): string {
  const tag = (comp.meta?.tag || comp.label || '').toUpperCase();
  const type = (comp.type || '').toLowerCase();
  
  // Regex patterns for deterministic HVAC categorization
  
  // Airside systems (VAV, AHU, FCU, etc.)
  if (/^(VAV|AHU|FCU|RTU|MAU|DOAS|ERV|HRV)/.test(tag)) {
    return 'air_handling';
  }
  
  // Hydronic systems - Chilled Water
  if (/CHW|CHWS|CHWR|CHILLED/.test(tag) || 
      ['chiller', 'cooling_tower'].includes(type)) {
    return 'chilled_water';
  }
  
  // Hydronic systems - Hot Water
  if (/HW|HWS|HWR|HEAT|BOILER/.test(tag) && !tag.includes('CHW')) {
    return 'heating_water';
  }
  
  // Hydronic systems - Condenser Water
  if (/CNDW|CW|CONDENSER/.test(tag)) {
    return 'condenser_water';
  }
  
  // Refrigeration systems
  if (/REF|REFRIG|EVAP|COMP/.test(tag) || 
      ['compressor', 'condenser', 'evaporator', 'expansion_valve'].includes(type)) {
    return 'refrigeration';
  }
  
  // Controls and instrumentation (sensors, controllers, dampers, valves)
  if (['sensor_temperature', 'sensor_pressure', 'sensor_flow', 'sensor_level',
       'instrument_controller', 'instrument_indicator', 'valve_control', 'damper'].includes(type)) {
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
  // STEP 1: Apply conflict resolution BEFORE normalization
  const tag = comp.meta?.tag || comp.label || '';
  const shape = comp.shape || comp.meta?.shape || '';
  const visualSignature = comp.visual_signature || comp.meta?.visual_signature;
  const aiType = comp.type || 'unknown';
  
  // Run conflict resolution engine
  const { correctedType, reasoning: conflictReasoning } = resolveTypeConflict(
    tag, 
    shape, 
    visualSignature,
    aiType
  );
  
  // Apply correction if conflict was detected
  let enhanced = { ...comp };
  if (correctedType !== aiType) {
    enhanced.type = correctedType;
    // Prepend conflict resolution reasoning
    if (enhanced.meta?.reasoning) {
      enhanced.meta.reasoning = conflictReasoning;
    } else {
      enhanced.meta = { ...enhanced.meta, reasoning: conflictReasoning };
    }
  }
  
  // STEP 2: Normalize type based on ISA-5.1 tag (if no conflict correction was applied)
  if (correctedType === aiType) {
    enhanced = normalizeHVACComponentType(enhanced);
  }
  
  // STEP 3: Generate dynamic reasoning based on actual visual evidence
  // Replace generic/hardcoded reasoning with specific shape-based explanations
  if (enhanced.meta?.reasoning) {
    const existingReasoning = enhanced.meta.reasoning;
    const currentShape = enhanced.shape || enhanced.meta?.shape;
    const currentType = enhanced.type || 'component';
    
    // Only replace reasoning if it's generic (don't replace conflict resolution reasoning)
    if (!existingReasoning.includes('Visual evidence') &&
        !existingReasoning.includes('Shape-based correction') &&
        (existingReasoning.toLowerCase().includes('detected diamond shape') || 
         existingReasoning.toLowerCase().includes('diamond-shaped') ||
         existingReasoning.toLowerCase().includes('diamond shape') ||
         existingReasoning === 'Identified based on standard ISA-5.1 symbology.')) {
      
      // Generate specific reasoning based on actual shape and type
      if (currentShape) {
        const shapeReasoning = generateShapeBasedReasoning(currentShape, currentType);
        if (shapeReasoning) {
          enhanced.meta.reasoning = shapeReasoning;
        }
      } else {
        // Fallback: Use type-based reasoning if no shape available
        enhanced.meta.reasoning = `Classified as ${currentType} based on ISA-5.1 symbol recognition.`;
      }
    }
  } else if (enhanced.shape || enhanced.meta?.shape) {
    // If no reasoning exists but we have shape, generate it
    const currentShape = enhanced.shape || enhanced.meta?.shape;
    const currentType = enhanced.type || 'component';
    const shapeReasoning = generateShapeBasedReasoning(currentShape, currentType);
    if (shapeReasoning) {
      enhanced.meta = enhanced.meta || {};
      enhanced.meta.reasoning = shapeReasoning;
    }
  }
  
  // STEP 4: Add HVAC-specific metadata
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
 * Generate dynamic shape-based reasoning
 * Returns specific reasoning based on the actual detected shape and type
 */
function generateShapeBasedReasoning(shape: string, type: string): string | null {
  const shapeLower = shape.toLowerCase();
  const typeLower = type.toLowerCase();
  
  // Shape-specific reasoning templates
  const shapeReasoningMap: Record<string, string> = {
    'circle': 'Detected circular shape, indicating an instrument or sensor per ISA-5.1',
    'bowtie': 'Detected bowtie (two triangles) shape, indicating a valve body per ISA-5.1',
    'diamond': 'Detected diamond shape, indicating logic/PLC function or control element per ISA-5.1',
    'triangle': 'Detected triangular shape, indicating a control valve or check valve per ISA-5.1',
    'square': 'Detected square shape, indicating a panel instrument or equipment per ISA-5.1',
    'rectangle': 'Detected rectangular shape, indicating equipment or gate valve per ISA-5.1',
    'hexagon': 'Detected hexagonal shape, indicating computer function per ISA-5.1'
  };
  
  // Get base reasoning from shape
  let reasoning = shapeReasoningMap[shapeLower];
  
  if (!reasoning) {
    // Fallback for unknown shapes
    return `Classified as ${type} based on symbol geometry and ISA-5.1 standards.`;
  }
  
  // Add type-specific details if applicable
  if (typeLower.includes('valve')) {
    if (shapeLower === 'circle' && (typeLower.includes('ball') || typeLower.includes('butterfly'))) {
      reasoning += '. Ball and butterfly valves use circular bodies with internal actuating elements.';
    } else if (shapeLower === 'bowtie' || shapeLower === 'triangle') {
      reasoning += '. Valve body identified with appropriate actuator symbol.';
    }
  } else if (typeLower.includes('sensor') || typeLower.includes('transmitter') || typeLower.includes('indicator')) {
    if (shapeLower === 'circle') {
      reasoning += '. Circular symbols are standard for field-mounted instrumentation.';
    }
  } else if (typeLower.includes('controller')) {
    reasoning += '. Controller identified with appropriate ISA function code.';
  }
  
  return reasoning;
}

/**
 * Get HVAC component category for filtering and grouping
 * Categories: Hydronic, Airside, Controls, Equipment
 */
function getHVACComponentCategory(comp: any): string {
  const subsystem = comp.meta?.hvac_subsystem || determineHVACSubsystem(comp);
  const type = (comp.type || '').toLowerCase();
  
  // Hydronic systems (water-based)
  if (['chilled_water', 'condenser_water', 'heating_water'].includes(subsystem)) {
    return 'hydronic';
  }
  
  // Airside systems (air-based)
  if (subsystem === 'air_handling') {
    return 'airside';
  }
  
  // Refrigeration systems
  if (subsystem === 'refrigeration') {
    return 'refrigeration';
  }
  
  // Controls (sensors, controllers, valves, dampers)
  if (subsystem === 'controls' || 
      type.includes('sensor') || 
      type.includes('controller') || 
      type.includes('valve') || 
      type.includes('damper')) {
    return 'controls';
  }
  
  // Equipment (pumps, chillers, fans, etc.)
  if (type.includes('pump') || 
      type.includes('chiller') || 
      type.includes('fan') || 
      type.includes('handler')) {
    return 'equipment';
  }
  
  return 'other';
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