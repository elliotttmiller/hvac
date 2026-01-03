/**
 * Textual Pipeline - Specification Extraction
 * Extracts structured text and tables from specification documents
 */

import { getAIClient } from '../../../lib/ai/client';
import { getSemanticCache } from '../../../lib/ai/cache';
import { config } from '../../../app/config';
import { TextualAnalysisResult, TEXTUAL_ANALYSIS_SCHEMA } from '@/features/document-analysis/types';
import { EXTRACT_SPECS_SYSTEM_INSTRUCTION, EXTRACT_SPECS_PROMPT } from '../prompts/textual/extract-specs';
import { generateId } from '../../../lib/utils';

/**
 * Analyze specification documents for text and tables
 */
export async function analyzeTextual(imageData: string): Promise<TextualAnalysisResult> {
  try {
    // Check cache first
    const cache = getSemanticCache();
    const cacheKey = `textual:${imageData.substring(0, 100)}`;
    
    if (config.features.semanticCache) {
      const cached = await cache.get<TextualAnalysisResult>(cacheKey);
      if (cached) {
        console.log('Textual analysis cache hit');
        return cached;
      }
    }

    // Call AI provider for textual analysis
    const client = getAIClient();
    const responseText = await client.generateVision({
      imageData,
      prompt: EXTRACT_SPECS_PROMPT,
      options: {
        systemInstruction: EXTRACT_SPECS_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: TEXTUAL_ANALYSIS_SCHEMA,
        temperature: 0.1, // Very low temperature for accurate transcription
      },
    });

    // Parse response
    const result = parseTextualResponse(responseText);

    // Cache the result
    if (config.features.semanticCache) {
      await cache.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    console.error('Textual analysis error:', error);
    
    // Return empty result on error
    return {
      text_blocks: [],
      tables: [],
      metadata: {
        total_text_blocks: 0,
        total_tables: 0,
      },
    };
  }
}

/**
 * Parse and validate textual analysis response
 */
function parseTextualResponse(responseText: string): TextualAnalysisResult {
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
    const textBlocks = Array.isArray(parsed.text_blocks) ? parsed.text_blocks : [];
    const tables = Array.isArray(parsed.tables) ? parsed.tables : [];

    // Ensure all text blocks have required fields
    const validatedTextBlocks = textBlocks.map((block: any) => ({
      id: block.id || generateId(),
      text: block.text || '',
      bbox: Array.isArray(block.bbox) && block.bbox.length === 4 
        ? block.bbox 
        : [0, 0, 0, 0],
      confidence: block.confidence,
      rotation: block.rotation,
      font_size: block.font_size,
    }));

    // Ensure all tables have required fields
    const validatedTables = tables.map((table: any) => ({
      id: table.id || generateId(),
      headers: Array.isArray(table.headers) ? table.headers : [],
      rows: Array.isArray(table.rows) ? table.rows : [],
      bbox: table.bbox,
    }));

    // Calculate word count
    const wordCount = validatedTextBlocks.reduce((total: number, block: any) => {
      return total + (block.text.split(/\s+/).length || 0);
    }, 0);

    return {
      text_blocks: validatedTextBlocks,
      tables: validatedTables,
      metadata: {
        total_text_blocks: validatedTextBlocks.length,
        total_tables: validatedTables.length,
        word_count: wordCount,
      },
    };
  } catch (error) {
    console.error('Failed to parse textual response:', error);
    console.error('Response text:', responseText);
    return {
      text_blocks: [],
      tables: [],
      metadata: {
        total_text_blocks: 0,
        total_tables: 0,
      },
    };
  }
}
