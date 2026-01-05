/**
 * Tabular Pipeline - Schedule Analysis
 * Extracts equipment data from schedule/tabular documents
 */

import { getAIClient } from '@/lib/ai/client';
import { getSemanticCache } from '@/lib/ai/cache';
import { config } from '@/app/config';
import { TabularAnalysisResult } from '@/features/document-analysis/types';
import { EXTRACT_SPECS_SYSTEM_INSTRUCTION, EXTRACT_SPECS_PROMPT } from '../prompts/textual/extract-specs';
import { generateId } from '@/lib/utils';
import { Type } from '@google/genai';

// Schema for tabular data extraction
const TABULAR_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    equipment: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          tag: { type: Type.STRING },
          type: { type: Type.STRING },
          model: { type: Type.STRING },
          cfm: { type: Type.NUMBER },
          voltage: { type: Type.STRING },
          notes: { type: Type.STRING },
        },
        required: ['id', 'tag', 'type'],
      },
    },
  },
  required: ['equipment'],
};

const TABULAR_SYSTEM_INSTRUCTION = `
### IDENTITY
You are a **Schedule Data Extractor** expert in HVAC equipment lists.

### MISSION
Extract structured equipment data from schedules, tables, and equipment lists.

### EXTRACTION RULES
1. **Equipment Identification**: Extract each equipment item as a separate entry
2. **Tag Extraction**: Identify equipment tags/IDs (e.g., "VAV-101", "AHU-2")
3. **Specifications**: Extract model numbers, CFM ratings, voltage, etc.
4. **Structured Format**: Return data in consistent JSON structure

### OUTPUT
Return equipment list with all available attributes.
`;

const TABULAR_PROMPT = `
**TASK**: Extract Equipment Schedule Data.

**INSTRUCTIONS**:
1. Identify all equipment items in the schedule
2. Extract equipment tags/IDs
3. Extract specifications (model, CFM, voltage, etc.)
4. Preserve all available attributes

**OUTPUT FORMAT**:
{
  "equipment": [
    {
      "id": "unique-id",
      "tag": "VAV-101",
      "type": "Variable Air Volume Box",
      "model": "Model XYZ-1000",
      "cfm": 2000,
      "voltage": "208/230 VAC",
      "notes": "Reheat coil included"
    }
  ]
}

Extract now.
`;

/**
 * Analyze schedule documents for equipment data
 */
export async function analyzeTabular(imageData: string): Promise<TabularAnalysisResult> {
  try {
    // Check cache first
    const cache = getSemanticCache();
    const cacheKey = `tabular:${imageData.substring(0, 100)}`;
    
    if (config.features.semanticCache) {
      const cached = await cache.get<TabularAnalysisResult>(cacheKey);
      if (cached) {
        console.log('Tabular analysis cache hit');
        return cached;
      }
    }

    // Call AI provider for tabular analysis
    const client = getAIClient();
    const responseText = await client.generateVision({
      imageData,
      prompt: TABULAR_PROMPT,
      options: {
        systemInstruction: TABULAR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: TABULAR_ANALYSIS_SCHEMA,
        temperature: 0.1, // Very low temperature for accurate data extraction
        maxOutputTokens: config.ai.maxOutputTokens, // Prevent truncation
      },
    });

    // Parse response
    const result = parseTabularResponse(responseText);

    // Cache the result
    if (config.features.semanticCache) {
      await cache.set(cacheKey, result);
    }

    return result;
  } catch (error) {
    console.error('Tabular analysis error:', error);
    
    // Return empty result on error
    return {
      equipment: [],
      metadata: {
        total_items: 0,
      },
    };
  }
}

/**
 * Parse and validate tabular analysis response
 */
function parseTabularResponse(responseText: string): TabularAnalysisResult {
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
    const equipment = Array.isArray(parsed.equipment) ? parsed.equipment : [];

    // Ensure all equipment items have required fields
    const validatedEquipment = equipment.map((item: any) => ({
      id: item.id || generateId(),
      tag: item.tag || '',
      type: item.type || 'Unknown',
      model: item.model,
      cfm: item.cfm,
      voltage: item.voltage,
      notes: item.notes,
      // Include any additional fields
      ...Object.keys(item).reduce((acc, key) => {
        if (!['id', 'tag', 'type', 'model', 'cfm', 'voltage', 'notes'].includes(key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {} as Record<string, any>),
    }));

    return {
      equipment: validatedEquipment,
      metadata: {
        total_items: validatedEquipment.length,
      },
    };
  } catch (error) {
    console.error('Failed to parse tabular response:', error);
    console.error('Response text:', responseText);
    return {
      equipment: [],
      metadata: {
        total_items: 0,
      },
    };
  }
}
