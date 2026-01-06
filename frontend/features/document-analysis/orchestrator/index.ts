/**
 * Orchestrator - Main Entry Point
 * Coordinates the entire document analysis pipeline
 */

import { classifyDocument } from './classifier';
import { routeToPipeline } from './router';
import { UniversalDocumentResult, DocumentType } from '../types';
import { generateId } from '../../../lib/utils';

export interface AnalysisOptions {
  fileName: string;
  skipCache?: boolean;
  onProgress?: (msg: string) => void;
}

/**
 * Main orchestrator function - entry point for document analysis
 * STAGE 1: Fast visual analysis and component detection
 */
export async function analyzeDocument(
  imageData: string,
  options: AnalysisOptions,
  forcedType?: DocumentType // Allow manual override
): Promise<UniversalDocumentResult> {
  const startTime = Date.now();
  const documentId = generateId();

  try {
    // Step 1: Classify (or use override)
    const emit = (m: any) => {
      try {
        const text = typeof m === 'string' ? m : (typeof m === 'object' ? JSON.stringify(m) : String(m));
        console.log(text);
        options.onProgress?.(text);
      } catch (e) {
        try { console.log(m); options.onProgress?.(String(m)); } catch { /* ignore */ }
      }
    };

    emit('Step 1: Classifying document...');
    let classification;
    
    if (forcedType) {
      classification = { 
        type: forcedType, 
        confidence: 1, 
        reasoning: 'Manual override by user' 
      };
      emit(['Using forced classification:', classification]);
    } else {
      classification = await classifyDocument(imageData, options.fileName);
      emit(['Classification result:', classification]);
    }

    // Step 2: Route to appropriate pipeline
  emit('Step 2: Routing to pipeline...');
  const route = routeToPipeline(classification.type);
  emit(['Selected pipeline:', route.pipeline]);

    // Step 3: Execute pipeline
    let analysisResult: any = null;
    if (route.handler) {
      emit('Step 3: Executing pipeline...');
      analysisResult = await route.handler(imageData);
      emit('Pipeline execution complete');
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
      cache_hit: (analysisResult as any)?._from_cache || false, // Check for cache flag from pipeline
    };

    // Attach pipeline-specific results
    // Treat SCHEMATIC the same as BLUEPRINT for the result structure
    if ((classification.type === 'BLUEPRINT' || classification.type === 'SCHEMATIC') && analysisResult) {
      result.visual = analysisResult;
    } else if (classification.type === 'SPEC_SHEET' && analysisResult) {
      result.textual = analysisResult;
    } else if (classification.type === 'SCHEDULE' && analysisResult) {
      result.tabular = analysisResult;
    }

    emit(['Analysis complete:', {
      document_id: result.document_id,
      type: result.document_type,
      processing_time_ms: result.processing_time_ms,
      components: result.visual?.components?.length || 0
    }]);

    // STAGE 1 COMPLETE: Return visual results immediately
    // Stage 2 (final analysis) will be triggered separately as a background job
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

/**
 * STAGE 2: Background final analysis generation
 * Triggered after Stage 1 completes successfully
 * Runs asynchronously and does not block user interaction
 */
export async function generateBackgroundAnalysis(
  documentResult: UniversalDocumentResult,
  options?: {
    onProgress?: (msg: string) => void;
    onComplete?: (report: any) => void;
    onError?: (error: Error) => void;
  }
): Promise<string> {
  // Only generate for visual documents with components
  const shouldGenerate = 
    (documentResult.document_type === 'BLUEPRINT' || documentResult.document_type === 'SCHEMATIC') &&
    documentResult.visual?.components && 
    documentResult.visual.components.length > 0;
  
  if (!shouldGenerate) {
    console.log('[Stage 2] Skipping final analysis - not applicable for this document type');
    options?.onComplete?.(null);
    return 'skipped';
  }
  
  try {
    console.log('[Stage 2] Starting background final analysis...');
    options?.onProgress?.('Starting background analysis...');
    
    // Import background worker
    const { queueFinalAnalysis } = await import('../../../lib/ai/background-worker');
    
    // Queue the job
    const jobId = await queueFinalAnalysis(
      documentResult,
      options?.onProgress,
      options?.onComplete,
      options?.onError
    );
    
    console.log(`[Stage 2] Background analysis queued with job ID: ${jobId}`);
    return jobId;
  } catch (error) {
    console.error('[Stage 2] Failed to queue background analysis:', error);
    options?.onError?.(error instanceof Error ? error : new Error(String(error)));
    throw error;
  }
}