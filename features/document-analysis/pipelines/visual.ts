/**
 * Visual Pipeline - Blueprint Analysis (SOTA Implementation)
 * Implements Visual Grid Tiling + Map-Reduce + Self-Correction
 * Detects HVAC components and connections using configured AI provider
 * 
 * Enhanced with P&ID-specific detection for process instrumentation diagrams
 */

import { getAIClient } from '../../../lib/ai/client';
import { getSemanticCache } from '../../../lib/ai/cache';
import { config } from '../../../app/config';
import { VisualAnalysisResult, VISUAL_ANALYSIS_SCHEMA, DetectedComponent, Connection } from '../types';
import { DETECT_SYSTEM_INSTRUCTION, DETECT_PROMPT } from '../prompts/visual/detect';
import { PID_DETECT_SYSTEM_INSTRUCTION, PID_DETECT_PROMPT, PID_REFINE_SYSTEM_INSTRUCTION, generatePIDRefinePrompt } from '../prompts/visual/detect-pid';
import { REFINE_SYSTEM_INSTRUCTION, generateRefinePrompt } from '../prompts/refinement';
import { tileImage, shouldTileImage, TileResult } from '../../../lib/file-processing/tiling';
import { mergeComponents, localToGlobal } from '../../../lib/utils/math';
import { generateId } from '../../../lib/utils';
import { getImageDimensions } from '../../../lib/file-processing/converters';

/**
 * Blueprint type for specialized routing
 */
type BlueprintType = 'PID' | 'HVAC';

/**
 * Get appropriate prompts based on blueprint type
 */
function getPromptsForBlueprintType(blueprintType: BlueprintType): {
  systemInstruction: string;
  prompt: string;
} {
  if (blueprintType === 'PID') {
    return {
      systemInstruction: PID_DETECT_SYSTEM_INSTRUCTION,
      prompt: PID_DETECT_PROMPT,
    };
  }
  
  return {
    systemInstruction: DETECT_SYSTEM_INSTRUCTION,
    prompt: DETECT_PROMPT,
  };
}


/**
 * Analyze blueprint for components and connections
 * Uses SOTA tiling approach for high-resolution images
 * Automatically detects P&ID vs HVAC blueprints and routes to appropriate pipeline
 */
export async function analyzeVisual(imageData: string): Promise<VisualAnalysisResult> {
  try {
    console.log('[Visual Pipeline] Starting analysis...');
    
    // Check cache first
    const cache = getSemanticCache();
    const cacheKey = `visual:${imageData.substring(0, 100)}`;
    
    if (config.features.semanticCache) {
      const cached = await cache.get<VisualAnalysisResult>(cacheKey);
      if (cached) {
        console.log('[Visual Pipeline] Cache hit - returning cached result');
        return cached;
      }
    }

    // Step 1: Detect blueprint type (P&ID vs HVAC)
    console.log('[Visual Pipeline] Step 1: Detecting blueprint type (P&ID vs HVAC)...');
    const blueprintType = await detectBlueprintType(imageData);
    console.log(`[Visual Pipeline] Blueprint type detected: ${blueprintType}`);

    // Determine if we should use tiling based on image size
    console.log('[Visual Pipeline] Step 2: Checking if tiling is needed...');
    const useTiling = await shouldUseTiling(imageData);
    console.log(`[Visual Pipeline] Tiling decision: ${useTiling ? 'ENABLED' : 'DISABLED'}`);
    
    let result: VisualAnalysisResult;
    
    if (useTiling) {
      console.log('[Visual Pipeline] Using SOTA tiling approach for high-resolution image');
      result = await analyzeWithTiling(imageData, blueprintType);
    } else {
      console.log('[Visual Pipeline] Using standard single-pass analysis');
      result = await analyzeStandard(imageData, blueprintType);
    }

    // Validate result
    if (!result.components || result.components.length === 0) {
      console.warn('[Visual Pipeline] WARNING: Zero components detected - possible silent failure');
      console.warn('[Visual Pipeline] This could indicate:');
      console.warn('  1. API authentication failure');
      console.warn('  2. Overly aggressive confidence filtering');
      console.warn('  3. Tiling coordinate transformation error');
      console.warn('  4. Image quality or format issue');
    } else {
      console.log(`[Visual Pipeline] SUCCESS: Detected ${result.components.length} components and ${result.connections.length} connections`);
    }

    // Cache the result
    if (config.features.semanticCache) {
      await cache.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    console.error('[Visual Pipeline] CRITICAL ERROR:', error);
    console.error('[Visual Pipeline] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    // Return empty result on error (but log extensively)
    return {
      components: [],
      connections: [],
      metadata: {
        total_components: 0,
        total_connections: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
    };
  }
}

/**
 * Detect if blueprint is a P&ID (process instrumentation) or HVAC (ductwork) diagram
 * Uses heuristic: presence of ISA-5.1 tags (e.g., PDI-1401, TT-1402) indicates P&ID
 */
async function detectBlueprintType(imageData: string): Promise<BlueprintType> {
  const client = getAIClient();
  
  // Quick heuristic check prompt
  const detectionPrompt = `
Analyze this engineering diagram and determine its type.

**INDICATORS OF P&ID (Process & Instrumentation Diagram):**
- Instrument bubbles/circles with ISA-5.1 tags like: PDI, TT, FIC, PI, LT, TIC
- Tag format: LETTERS-NUMBERS (e.g., "PDI-1401", "TT-1402")
- Focus on control instrumentation, valves, process lines
- Dashed signal lines connecting instruments

**INDICATORS OF HVAC (Heating/Ventilation/Air Conditioning):**
- Ductwork (rectangular air passages)
- VAV boxes, AHUs (Air Handling Units)
- Dampers, diffusers, grilles
- Duct sizing labels (e.g., "24x12")

Return ONLY "PID" or "HVAC" as a single word.
`;

  try {
    const response = await client.generateVision({
      imageData,
      prompt: detectionPrompt,
      options: {
        systemInstruction: 'You are an engineering document classifier. Respond with ONLY "PID" or "HVAC".',
        temperature: 0.1,
      },
    });

    const cleaned = response.trim().toUpperCase();
    
    // Check for P&ID indicators (all uppercase for case-insensitive matching)
    if (cleaned.includes('PID') || cleaned.includes('INSTRUMENTATION')) {
      return 'PID';
    }
    
    // Default to HVAC for backward compatibility
    return 'HVAC';
  } catch (error) {
    console.warn('Blueprint type detection failed, defaulting to HVAC:', error);
    return 'HVAC';
  }
}

/**
 * Standard analysis without tiling (for smaller images)
 */
async function analyzeStandard(imageData: string, blueprintType: BlueprintType): Promise<VisualAnalysisResult> {
  console.log('[Visual Pipeline - Standard] Starting single-pass analysis...');
  const client = getAIClient();
  
  // Select prompts based on blueprint type
  const { systemInstruction, prompt } = getPromptsForBlueprintType(blueprintType);
  
  console.log(`[Visual Pipeline - Standard] Using ${blueprintType} prompts`);
  
  try {
    const responseText = await client.generateVision({
      imageData,
      prompt,
      options: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: VISUAL_ANALYSIS_SCHEMA,
        temperature: 0.1, // Very low for deterministic OCR extraction
      },
    });

    console.log('[Visual Pipeline - Standard] Received response from AI');
    const result = parseVisualResponse(responseText);
    console.log(`[Visual Pipeline - Standard] Parsed ${result.components.length} components`);
    return result;
  } catch (error) {
    console.error('[Visual Pipeline - Standard] Error during analysis:', error);
    throw error;
  }
}

/**
 * SOTA Analysis with Visual Grid Tiling + Map-Reduce + Self-Correction
 */
async function analyzeWithTiling(imageData: string, blueprintType: BlueprintType): Promise<VisualAnalysisResult> {
  console.log('[Visual Pipeline - Tiling] Starting tiled analysis...');
  const client = getAIClient();
  
  // Select prompts based on blueprint type
  const { systemInstruction, prompt } = getPromptsForBlueprintType(blueprintType);
  
  // Step 1: Tile the image into 2x2 grid with 15% overlap (optimized for edge detection)
  console.log('[Visual Pipeline - Tiling] Step 1: Tiling image into grid...');
  const tileResult = await tileImage(imageData, 'image/png', 15);
  console.log(`[Visual Pipeline - Tiling] Created ${tileResult.tiles.length} tiles (2x2 grid with 15% overlap)`);
  
  // Step 2: MAP - Process tiles in parallel
  console.log('[Visual Pipeline - Tiling] Step 2: Processing tiles in parallel (MAP phase)...');
  const tileAnalyses = await Promise.all(
    tileResult.tiles.map(async (tile, index) => {
      console.log(`[Visual Pipeline - Tiling] Processing tile ${index + 1}/${tileResult.tiles.length} (position: ${tile.position})`);
      try {
        const responseText = await client.generateVision({
          imageData: tile.data,
          prompt,
          options: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: VISUAL_ANALYSIS_SCHEMA,
            temperature: 0.1, // Very low for deterministic OCR extraction
          },
        });
        
        const tileResult = parseVisualResponse(responseText);
        console.log(`[Visual Pipeline - Tiling] Tile ${index + 1}: Found ${tileResult.components.length} components`);
        return { tile, result: tileResult };
      } catch (error) {
        console.error(`[Visual Pipeline - Tiling] ERROR in tile ${index + 1}:`, error);
        // Return empty result for failed tile instead of failing entire pipeline
        return { 
          tile, 
          result: { 
            components: [], 
            connections: [], 
            metadata: { total_components: 0, total_connections: 0 } 
          } 
        };
      }
    })
  );
  
  // Step 3: REDUCE - Transform and merge results
  console.log('[Visual Pipeline - Tiling] Step 3: Merging tile results (REDUCE phase)...');
  const mergedResult = mergeTileResults(tileAnalyses, tileResult);
  console.log(`[Visual Pipeline - Tiling] After merge: ${mergedResult.components.length} components, ${mergedResult.connections.length} connections`);
  
  // Step 4: REFINE - Self-correction pass with full image
  console.log('[Visual Pipeline - Tiling] Step 4: Self-correction refinement with full image...');
  const refinedResult = await refineWithFullImage(
    mergedResult,
    tileResult.fullImage.data,
    blueprintType
  );
  console.log(`[Visual Pipeline - Tiling] After refinement: ${refinedResult.components.length} components, ${refinedResult.connections.length} connections`);
  
  return refinedResult;
}

/**
 * Merge results from multiple tiles into a single result
 * Transforms local coordinates to global and deduplicates
 */
function mergeTileResults(
  tileAnalyses: Array<{ tile: any; result: VisualAnalysisResult }>,
  tileData: TileResult
): VisualAnalysisResult {
  console.log('[Visual Pipeline - Merge] Starting merge of tile results...');
  const allComponents: DetectedComponent[] = [];
  const allConnections: Connection[] = [];
  
  // Transform each tile's components to global coordinates
  for (const { tile, result } of tileAnalyses) {
    console.log(`[Visual Pipeline - Merge] Processing tile at position ${tile.position}: ${result.components.length} components`);
    
    for (const component of result.components) {
      // Transform local bbox (0-1 relative to tile) to global coordinates (0-1 relative to full image)
      const globalBbox = localToGlobal(component.bbox, tile.bbox);
      
      // Validate transformed coordinates
      if (globalBbox.some(coord => coord < 0 || coord > 1)) {
        console.warn(`[Visual Pipeline - Merge] WARNING: Invalid global coordinates for component ${component.id}:`, globalBbox);
        console.warn(`[Visual Pipeline - Merge]   Local bbox: ${component.bbox}`);
        console.warn(`[Visual Pipeline - Merge]   Tile bbox: ${JSON.stringify(tile.bbox)}`);
        // Clamp to valid range
        globalBbox[0] = Math.max(0, Math.min(1, globalBbox[0]));
        globalBbox[1] = Math.max(0, Math.min(1, globalBbox[1]));
        globalBbox[2] = Math.max(0, Math.min(1, globalBbox[2]));
        globalBbox[3] = Math.max(0, Math.min(1, globalBbox[3]));
      }
      
      allComponents.push({
        ...component,
        bbox: globalBbox,
        meta: {
          ...component.meta,
          source_tile: tile.position,
        },
      });
    }
    
    // Connections will be refined in the full-image pass
    allConnections.push(...result.connections);
  }
  
  // Deduplicate components using IoU-based NMS
  console.log(`[Visual Pipeline - Merge] Before deduplication: ${allComponents.length} components`);
  const deduplicatedComponents = mergeComponents(allComponents, 0.5);
  console.log(`[Visual Pipeline - Merge] After deduplication: ${deduplicatedComponents.length} components (removed ${allComponents.length - deduplicatedComponents.length} duplicates)`);
  
  return {
    // mergeComponents returns a generic Component[]; cast to DetectedComponent[] to satisfy types
    components: deduplicatedComponents as unknown as DetectedComponent[],
    connections: allConnections, // Will be refined in next step
    metadata: {
      total_components: deduplicatedComponents.length,
      total_connections: allConnections.length,
    },
  };
}

/**
 * Refine results using the full image (Self-Correction / Reflexion)
 */
async function refineWithFullImage(
  mergedResult: VisualAnalysisResult,
  fullImageData: string,
  blueprintType: BlueprintType
): Promise<VisualAnalysisResult> {
  const client = getAIClient();
  
  // Generate refinement prompt with current results based on blueprint type
  const refinePrompt = blueprintType === 'PID' 
    ? generatePIDRefinePrompt({
        components: mergedResult.components,
        connections: mergedResult.connections,
      })
    : generateRefinePrompt({
        components: mergedResult.components,
        connections: mergedResult.connections,
      });
  
  const refineSystemInstruction = blueprintType === 'PID' 
    ? PID_REFINE_SYSTEM_INSTRUCTION 
    : REFINE_SYSTEM_INSTRUCTION;
  
  // Call AI with full image for correction
  const responseText = await client.generateVision({
    imageData: fullImageData,
    prompt: refinePrompt,
    options: {
      systemInstruction: refineSystemInstruction,
      responseMimeType: 'application/json',
      responseSchema: VISUAL_ANALYSIS_SCHEMA,
      temperature: 0.1, // Very low temperature for correction
    },
  });
  
  const refinedResult = parseVisualResponse(responseText);
  
  console.log('Refinement complete:');
  console.log(`  Components: ${mergedResult.components.length} -> ${refinedResult.components.length}`);
  console.log(`  Connections: ${mergedResult.connections.length} -> ${refinedResult.connections.length}`);
  
  return refinedResult;
}

/**
 * Check if image should use tiling based on dimensions
 */
async function shouldUseTiling(imageData: string): Promise<boolean> {
  try {
    // Create a temporary image to get dimensions
    const normalizedImageData = imageData.includes('base64,')
      ? imageData.split('base64,')[1]
      : imageData;
    
    const img = await loadImageFromBase64(normalizedImageData);
    return shouldTileImage(img.width, img.height);
  } catch (error) {
    console.warn('Failed to determine image size, using standard analysis:', error);
    return false;
  }
}

/**
 * Load image from base64 to get dimensions
 */
function loadImageFromBase64(base64Data: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = `data:image/png;base64,${base64Data}`;
  });
}

/**
 * Parse and validate visual analysis response
 */
function parseVisualResponse(responseText: string): VisualAnalysisResult {
  try {
    // Remove markdown code blocks if present
    let cleanText = responseText.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText
        .replace(/^```json\s*/, '')
        .replace(/^```\s*/, '')
        .replace(/\s*```$/, '');
    }

    const parsed = JSON.parse(cleanText);

    // Validate structure
    const components = Array.isArray(parsed.components) ? parsed.components : [];
    const connections = Array.isArray(parsed.connections) ? parsed.connections : [];

    console.log(`[Visual Pipeline - Parse] Parsing response: ${components.length} components, ${connections.length} connections`);

    // Ensure all components have required fields
    const validatedComponents = components.map((comp: any) => {
      // Validate bbox coordinates
      let bbox = Array.isArray(comp.bbox) && comp.bbox.length === 4 
        ? comp.bbox 
        : [0, 0, 0, 0];
      
      // Ensure bbox coordinates are in valid range [0, 1]
      bbox = bbox.map((coord: number) => {
        if (typeof coord !== 'number' || isNaN(coord)) {
          console.warn(`[Visual Pipeline - Parse] Invalid coordinate value: ${coord}, using 0`);
          return 0;
        }
        if (coord < 0 || coord > 1) {
          console.warn(`[Visual Pipeline - Parse] Coordinate out of range [0,1]: ${coord}, clamping`);
          return Math.max(0, Math.min(1, coord));
        }
        return coord;
      });

      const validated = {
        id: comp.id || generateId(),
        type: comp.type || 'unknown',
        label: comp.label || comp.type || 'unlabeled',
        bbox: bbox as [number, number, number, number],
        confidence: typeof comp.confidence === 'number' ? comp.confidence : 0.5,
        rotation: comp.rotation,
        meta: comp.meta || {},
      };

      // CRITICAL VALIDATION: Reject generic labels for instruments
      // Expanded list of forbidden generic labels
      const forbiddenLabels = [
        'unknown', 'unlabeled', 'instrument', 'valve', 'sensor', 'component',
        'equipment', 'device', 'element', 'item', 'object', 'symbol'
      ];
      
      const labelLower = validated.label.toLowerCase();
      const isGenericLabel = !comp.label || 
                            comp.label === '' ||
                            comp.label === validated.type ||
                            forbiddenLabels.some(forbidden => labelLower === forbidden || labelLower.includes(forbidden)) ||
                            labelLower === 'null' ||
                            labelLower === 'undefined';
      
      if (isGenericLabel && !validated.label.includes('unreadable')) {
        console.error(`[Visual Pipeline - Parse] ⚠️ CRITICAL: Component ${validated.id} has FORBIDDEN generic label: "${validated.label}"`);
        console.error(`[Visual Pipeline - Parse]   This violates OCR-First mandate. Component should have extracted text.`);
        console.error(`[Visual Pipeline - Parse]   Type: ${validated.type}, Confidence: ${validated.confidence}`);
        console.error(`[Visual Pipeline - Parse]   Reasoning: ${validated.meta?.reasoning || 'Not provided'}`);
        console.error(`[Visual Pipeline - Parse]   Bbox: [${bbox.join(', ')}]`);
        
        // Mark as OCR failure with more descriptive label
        validated.label = `unreadable-OCR-failed-${validated.type}-bbox-${bbox[0].toFixed(3)}-${bbox[1].toFixed(3)}`;
        validated.confidence = Math.min(validated.confidence, 0.3); // Reduce confidence for failed OCR
        
        // Add warning to metadata
        validated.meta = {
          ...validated.meta,
          ocr_failure: true,
          original_label: comp.label || 'none',
          warning: 'AI failed to extract text label - OCR-First mandate violated'
        };
      }

      return validated;
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
      },
    };
  } catch (error) {
    console.error('[Visual Pipeline - Parse] Failed to parse visual response:', error);
    console.error('[Visual Pipeline - Parse] Response text preview:', responseText.substring(0, 500));
    return {
      components: [],
      connections: [],
      metadata: {
        total_components: 0,
        total_connections: 0,
        parse_error: error instanceof Error ? error.message : 'Unknown parse error',
      },
    };
  }
}
