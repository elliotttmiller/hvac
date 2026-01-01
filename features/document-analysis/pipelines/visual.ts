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
    // Check cache first
    const cache = getSemanticCache();
    const cacheKey = `visual:${imageData.substring(0, 100)}`;
    
    if (config.features.semanticCache) {
      const cached = await cache.get<VisualAnalysisResult>(cacheKey);
      if (cached) {
        console.log('Visual analysis cache hit');
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
    
    if (cleaned.includes('PID') || cleaned.includes('P&ID') || cleaned.includes('INSTRUMENTATION')) {
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
  const client = getAIClient();
  
  // Select prompts based on blueprint type
  const { systemInstruction, prompt } = getPromptsForBlueprintType(blueprintType);
  
  const responseText = await client.generateVision({
    imageData,
    prompt,
    options: {
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: VISUAL_ANALYSIS_SCHEMA,
      temperature: 0.2,
    },
  });

  return parseVisualResponse(responseText);
}

/**
 * SOTA Analysis with Visual Grid Tiling + Map-Reduce + Self-Correction
 */
async function analyzeWithTiling(imageData: string, blueprintType: BlueprintType): Promise<VisualAnalysisResult> {
  const client = getAIClient();
  
  // Select prompts based on blueprint type
  const { systemInstruction, prompt } = getPromptsForBlueprintType(blueprintType);
  
  // Step 1: Tile the image into 2x2 grid with 10% overlap
  console.log('Step 1: Tiling image...');
  const tileResult = await tileImage(imageData, 'image/png', 10);
  console.log(`Created ${tileResult.tiles.length} tiles`);
  
  // Step 2: MAP - Process tiles in parallel
  console.log('Step 2: Processing tiles in parallel (MAP phase)...');
  const tileAnalyses = await Promise.all(
    tileResult.tiles.map(async (tile) => {
      const responseText = await client.generateVision({
        imageData: tile.data,
        prompt,
        options: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: VISUAL_ANALYSIS_SCHEMA,
          temperature: 0.2,
        },
      });
      
      const tileResult = parseVisualResponse(responseText);
      return { tile, result: tileResult };
    })
  );
  
  // Step 3: REDUCE - Transform and merge results
  console.log('Step 3: Merging tile results (REDUCE phase)...');
  const mergedResult = mergeTileResults(tileAnalyses, tileResult);
  
  // Step 4: REFINE - Self-correction pass with full image
  console.log('Step 4: Self-correction refinement...');
  const refinedResult = await refineWithFullImage(
    mergedResult,
    tileResult.fullImage.data,
    blueprintType
  );
  
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
  const allComponents: DetectedComponent[] = [];
  const allConnections: Connection[] = [];
  
  // Transform each tile's components to global coordinates
  for (const { tile, result } of tileAnalyses) {
    for (const component of result.components) {
      // Transform local bbox to global coordinates
      const globalBbox = localToGlobal(component.bbox, tile.bbox);
      
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
  console.log(`Before deduplication: ${allComponents.length} components`);
  const deduplicatedComponents = mergeComponents(allComponents, 0.5);
  console.log(`After deduplication: ${deduplicatedComponents.length} components`);
  
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

    // Ensure all components have required fields
    const validatedComponents = components.map((comp: any) => ({
      id: comp.id || generateId(),
      type: comp.type || 'unknown',
      label: comp.label,
      bbox: Array.isArray(comp.bbox) && comp.bbox.length === 4 
        ? comp.bbox 
        : [0, 0, 0, 0],
      confidence: typeof comp.confidence === 'number' ? comp.confidence : 0.5,
      rotation: comp.rotation,
      meta: comp.meta || {},
    }));

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
    console.error('Failed to parse visual response:', error);
    console.error('Response text:', responseText);
    return {
      components: [],
      connections: [],
      metadata: {
        total_components: 0,
        total_connections: 0,
      },
    };
  }
}
