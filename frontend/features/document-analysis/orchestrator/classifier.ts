/**
 * Classifier - Document Type Detection
 * Step 1 of the analysis pipeline
 */

import { getAIClient } from '@/lib/ai/client';
import { getSemanticCache } from '@/lib/ai/cache';
import { config } from '@/app/config';
import { ClassificationResult, CLASSIFICATION_SCHEMA, VALID_CLASSIFICATION_TYPES } from '@/features/document-analysis/types';
import { CLASSIFY_SYSTEM_INSTRUCTION, CLASSIFY_PROMPT } from '../prompts/classify';

/**
 * Generate a consistent cache key for classification requests
 */
function getClassificationCacheKey(fileName: string, imageData: string): string {
  return `classify:${fileName}:${imageData.substring(0, 100)}`;
}

export async function classifyDocument(
  imageData: string,
  fileName: string
): Promise<ClassificationResult> {
  try {
    // Check cache first
    const cache = getSemanticCache();
    const cacheKey = getClassificationCacheKey(fileName, imageData);
    
    if (config.features.semanticCache) {
      const cached = await cache.get<ClassificationResult>(cacheKey);
      if (cached) {
        console.log('Classification cache hit');
        return cached;
      }
    }

    // Call AI provider for classification
    const client = getAIClient();
    const responseText = await client.generateVision({
      imageData,
      prompt: CLASSIFY_PROMPT,
      options: {
        systemInstruction: CLASSIFY_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: CLASSIFICATION_SCHEMA,
        temperature: 0.1, // Low temperature for consistent classification
        maxOutputTokens: config.ai.maxOutputTokens, // Prevent truncation
      },
    });

    // Diagnostic: surface raw AI response to the frontend console to aid debugging
    console.log('[Classifier] Raw AI response:', responseText);

    if (!responseText || responseText.trim().length === 0) {
      console.warn('[Classifier] Empty response from AI client');
      return {
        type: 'UNKNOWN',
        confidence: 0,
        reasoning: 'Empty response from AI proxy',
      };
    }

    // Parse response
    const result = parseClassificationResponse(responseText);

    // Cache the result only if it's a valid classification (not UNKNOWN with 0 confidence)
    // This prevents caching of failed classifications
    if (config.features.semanticCache && !(result.type === 'UNKNOWN' && result.confidence === 0)) {
      await cache.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    console.error('Classification error:', error);
    
    // Return default classification on error
    return {
      type: 'UNKNOWN',
      confidence: 0,
      reasoning: `Classification failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Clear classification cache for a specific file (useful for debugging)
 */
export async function clearClassificationCache(fileName: string, imageData: string): Promise<void> {
  const cache = getSemanticCache();
  const cacheKey = getClassificationCacheKey(fileName, imageData);
  await cache.delete(cacheKey);
  console.log('[Classifier] Cache cleared for:', fileName);
}

/**
 * Parse and validate classification response
 */
function parseClassificationResponse(responseText: string): ClassificationResult {
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

    // Validate required fields
    if (!parsed.type || typeof parsed.confidence !== 'number') {
      console.error('Invalid classification format - missing required fields:', { 
        hasType: !!parsed.type, 
        hasConfidence: typeof parsed.confidence === 'number',
        parsed 
      });
      throw new Error('Invalid classification response format: missing type or confidence');
    }

    // Validate document type - include all known DocumentType values
    if (!VALID_CLASSIFICATION_TYPES.includes(parsed.type as any)) {
      console.warn(`Invalid document type: ${parsed.type}, defaulting to UNKNOWN`);
      return {
        type: 'UNKNOWN',
        confidence: 0,
        reasoning: `Invalid document type returned from model: ${parsed.type}`,
      };
    }

    return {
      type: parsed.type,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning || '',
    };
  } catch (error) {
    console.error('Failed to parse classification response:', error);
    console.error('Raw response text:', responseText);
    return {
      type: 'UNKNOWN',
      confidence: 0,
      reasoning: `Failed to parse model response: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}
