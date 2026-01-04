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
import { mergeComponents, localToGlobal } from '../../../lib/utils/math';
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
    // Simple string substring is risky for base64 which often has identical headers
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
  const allComponents: DetectedComponent[] = [];
  const allConnections: Connection[] = [];
  
  for (const { tile, result } of tileAnalyses) {
    for (const component of result.components) {
      // Transform local to global
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
  
  return parseVisualResponse(responseText);
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

    // Ensure all components have required fields
    const validatedComponents = components.map((comp: any) => ({
      id: comp.id || generateId(),
      type: comp.type || 'unknown',
      label: comp.label || comp.tag || 'unknown',
      bbox: validateBBox(comp.bbox || comp.bbox_2d),
      confidence: typeof comp.confidence === 'number' ? comp.confidence : 0.5,
      rotation: typeof comp.rotation === 'number' ? Math.round(comp.rotation) : 0,
      meta: comp.meta || { 
        description: comp.description || comp.functional_desc,
        reasoning: comp.reasoning 
      },
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
  
  // Check if legacy 0-1000 scale is used
  const maxVal = Math.max(...bbox);
  if (maxVal > 1.0) {
    return bbox.map(v => v / 1000) as [number, number, number, number];
  }
  
  return bbox as [number, number, number, number];
}