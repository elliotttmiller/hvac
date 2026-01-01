/**
 * Visual Pipeline - Blueprint Analysis
 * Detects HVAC components and connections using configured AI provider
 */

import { getAIClient } from '../../../lib/ai/client';
import { getSemanticCache } from '../../../lib/ai/cache';
import { config } from '../../../app/config';
import { VisualAnalysisResult, VISUAL_ANALYSIS_SCHEMA } from '../types';
import { DETECT_SYSTEM_INSTRUCTION, DETECT_PROMPT } from '../prompts/visual/detect';
import { generateId } from '../../../lib/utils';

/**
 * Analyze blueprint for components and connections
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

    // Call AI provider for visual analysis
    const client = getAIClient();
    const responseText = await client.generateVision({
      imageData,
      prompt: DETECT_PROMPT,
      options: {
        systemInstruction: DETECT_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: VISUAL_ANALYSIS_SCHEMA,
        temperature: 0.2, // Low temperature for consistent detection
      },
    });

    // Parse response
    const result = parseVisualResponse(responseText);

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
