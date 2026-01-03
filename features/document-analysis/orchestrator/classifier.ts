/**
 * Classifier - Document Type Detection
 * Step 1 of the analysis pipeline
 */

import { getAIClient } from '../../../lib/ai/client';
import { getSemanticCache } from '../../../lib/ai/cache';
import { config } from '../../../app/config';
import { ClassificationResult, CLASSIFICATION_SCHEMA } from '@/features/document-analysis/types';
import { CLASSIFY_SYSTEM_INSTRUCTION, CLASSIFY_PROMPT } from '../prompts/classify';

export async function classifyDocument(
  imageData: string,
  fileName: string
): Promise<ClassificationResult> {
  try {
    // Check cache first
    const cache = getSemanticCache();
    const cacheKey = `classify:${fileName}:${imageData.substring(0, 100)}`;
    
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
      },
    });

    // Parse response
    const result = parseClassificationResponse(responseText);

    // Cache the result
    if (config.features.semanticCache) {
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
      throw new Error('Invalid classification response format');
    }

    // Validate document type - include all known DocumentType values
    const validTypes = ['BLUEPRINT', 'SCHEMATIC', 'SPEC_SHEET', 'SCHEDULE'];
    if (!validTypes.includes(parsed.type)) {
      console.warn(`Invalid document type: ${parsed.type}, defaulting to UNKNOWN`);
      return {
        type: 'UNKNOWN',
        confidence: 0,
        reasoning: 'Invalid document type returned from model',
      };
    }

    return {
      type: parsed.type,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning || '',
    };
  } catch (error) {
    console.error('Failed to parse classification response:', error);
    return {
      type: 'UNKNOWN',
      confidence: 0,
      reasoning: 'Failed to parse model response',
    };
  }
}
