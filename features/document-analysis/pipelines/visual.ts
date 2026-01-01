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
import { REFINE_SYSTEM_INSTRUCTION, generateRefinePrompt } from '../prompts/refinement';
import { tileImage, shouldTileImage, TileResult } from '../../../lib/file-processing/tiling';
import { mergeComponents, localToGlobal } from '../../../lib/utils/math';
import { generateId } from '../../../lib/utils';
import { getImageDimensions } from '../../../lib/file-processing/converters';

/**
 * Analyze blueprint for components and connections
 * Uses SOTA tiling approach for high-resolution images
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

    // Determine if we should use tiling based on image size
    const useTiling = await shouldUseTiling(imageData);
    
    let result: VisualAnalysisResult;
    
    if (useTiling) {
      console.log('Using SOTA tiling approach for high-resolution image');
      result = await analyzeWithTiling(imageData);
    } else {
      console.log('Using standard single-pass analysis');
      result = await analyzeStandard(imageData);
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
 * Standard analysis without tiling (for smaller images)
 */
async function analyzeStandard(imageData: string): Promise<VisualAnalysisResult> {
  const client = getAIClient();
  const responseText = await client.generateVision({
    imageData,
    prompt: DETECT_PROMPT,
    options: {
      systemInstruction: DETECT_SYSTEM_INSTRUCTION,
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
async function analyzeWithTiling(imageData: string): Promise<VisualAnalysisResult> {
  const client = getAIClient();
  
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
        prompt: DETECT_PROMPT,
        options: {
          systemInstruction: DETECT_SYSTEM_INSTRUCTION,
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
    tileResult.fullImage.data
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
  fullImageData: string
): Promise<VisualAnalysisResult> {
  const client = getAIClient();
  
  // Generate refinement prompt with current results
  const refinePrompt = generateRefinePrompt({
    components: mergedResult.components,
    connections: mergedResult.connections,
  });
  
  // Call AI with full image for correction
  const responseText = await client.generateVision({
    imageData: fullImageData,
    prompt: refinePrompt,
    options: {
      systemInstruction: REFINE_SYSTEM_INSTRUCTION,
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
