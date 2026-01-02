/**
 * Orchestrator - Main Entry Point
 * Coordinates the entire document analysis pipeline
 */

import { classifyDocument } from './classifier';
import { routeToPipeline } from './router';
import { UniversalDocumentResult, DocumentType } from '../types';
import { generateId } from '../../../lib/utils';
import { getAIClient } from '../../../lib/ai/client';
import { getSemanticCache } from '../../../lib/ai/cache';
import { config } from '../../../app/config';

export interface AnalysisOptions {
  fileName: string;
  skipCache?: boolean;
}

/**
 * Main orchestrator function - entry point for document analysis
 */
export async function analyzeDocument(
  imageData: string,
  options: AnalysisOptions
): Promise<UniversalDocumentResult> {
  const startTime = Date.now();
  const documentId = generateId();

  try {
    // Step 1: Classify the document
    console.log('Step 1: Classifying document...');
    const classification = await classifyDocument(imageData, options.fileName);
    console.log('Classification result:', classification);

    // Step 1b: Quick schematic check for BLUEPRINTs only. This is done once
    // here (orchestrator) and passed into downstream pipelines to avoid
    // repeated schematic checks per tile. Results are cached in the semantic
    // cache so repeated uploads reuse the decision.
    let isSchematic = false;
    try {
      if (classification.type === 'BLUEPRINT') {
        const cache = getSemanticCache();
        // Use the full normalized image (base64 payload) as cache input for correctness.
        const normalizedImageData = imageData.includes('base64,') ? imageData.split('base64,')[1] : imageData;
        const cacheKeyInput = `schematic:${normalizedImageData}`;
        const cached = await cache.get<boolean>(cacheKeyInput);
        if (cached !== null) {
          isSchematic = !!cached;
        } else {
          const client = getAIClient();
          const responseText = await client.generateVision({
            imageData,
            prompt: `{"is_schematic": true}`,
            options: {
              systemInstruction: `You are an expert at identifying whether a technical drawing is a P&ID/schematic. Return strict JSON: {"is_schematic": true} or {"is_schematic": false}. Do not add commentary.`,
              responseMimeType: 'application/json',
              responseSchema: '{"type":"object","properties":{"is_schematic":{"type":"boolean"}}}',
              temperature: 0.0,
            },
          });

          let clean = responseText.trim();
          if (clean.startsWith('```')) {
            clean = clean.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          const parsed = JSON.parse(clean);
          isSchematic = !!parsed.is_schematic;

          // Cache the boolean result for future runs using configured TTL
          const ttlDays = (config && config.features && config.features.schematicCacheTtlDays) || 7;
          const ttlMs = ttlDays * 24 * 60 * 60 * 1000;
          await cache.set<boolean>(cacheKeyInput, isSchematic, ttlMs);
        }
      }
    } catch (err) {
      console.warn('Orchestrator quick schematic check failed, continuing with generic pipeline', err);
      isSchematic = false;
    }

    // Step 2: Route to appropriate pipeline
    console.log('Step 2: Routing to pipeline...');
    const route = routeToPipeline(classification.type);
    console.log('Selected pipeline:', route.pipeline);

    // Step 3: Execute pipeline
    let analysisResult: any = null;
    if (route.handler) {
      console.log('Step 3: Executing pipeline...');
      // Pass orchestrator-level hints (for example isSchematic) into the pipeline
      // so it doesn't need to call quick checks per tile.
      analysisResult = await route.handler(imageData, { isSchematic });
      console.log('Pipeline execution complete');
    } else {
      console.warn('No pipeline handler available for document type:', classification.type);
    }

    // Step 4: Construct universal result
    const result: UniversalDocumentResult = {
      document_id: documentId,
      document_type: classification.type,
      file_name: options.fileName,
      timestamp: Date.now(),
      classification,
      processing_time_ms: Date.now() - startTime,
      cache_hit: false,
    };

    // Attach pipeline-specific results
    if (classification.type === 'BLUEPRINT' && analysisResult) {
      result.visual = analysisResult;
    } else if (classification.type === 'SPEC_SHEET' && analysisResult) {
      result.textual = analysisResult;
    } else if (classification.type === 'SCHEDULE' && analysisResult) {
      result.tabular = analysisResult;
    }

    console.log('Analysis complete:', {
      document_id: result.document_id,
      type: result.document_type,
      processing_time_ms: result.processing_time_ms,
    });

    return result;
  } catch (error) {
    console.error('Analysis error:', error);
    
    // Return error result
    return {
      document_id: documentId,
      document_type: 'UNKNOWN',
      file_name: options.fileName,
      timestamp: Date.now(),
      classification: {
        type: 'UNKNOWN',
        confidence: 0,
        reasoning: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      processing_time_ms: Date.now() - startTime,
      validation_issues: [
        {
          id: generateId(),
          severity: 'CRITICAL',
          issue: 'Document analysis failed',
          recommendation: 'Please try uploading the document again or contact support',
        },
      ],
    };
  }
}
