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
}

/**
 * Main orchestrator function - entry point for document analysis
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
    console.log('Step 1: Classifying document...');
    let classification;
    
    if (forcedType) {
      classification = { 
        type: forcedType, 
        confidence: 1, 
        reasoning: 'Manual override by user' 
      };
      console.log('Using forced classification:', classification);
    } else {
      classification = await classifyDocument(imageData, options.fileName);
      console.log('Classification result:', classification);
    }

    // Step 2: Route to appropriate pipeline
    console.log('Step 2: Routing to pipeline...');
    const route = routeToPipeline(classification.type);
    console.log('Selected pipeline:', route.pipeline);

    // Step 3: Execute pipeline
    let analysisResult: any = null;
    if (route.handler) {
      console.log('Step 3: Executing pipeline...');
      analysisResult = await route.handler(imageData);
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

    console.log('Analysis complete:', {
      document_id: result.document_id,
      type: result.document_type,
      processing_time_ms: result.processing_time_ms,
      components: result.visual?.components?.length || 0
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