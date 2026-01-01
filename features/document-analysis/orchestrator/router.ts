/**
 * Router - Pipeline Selection
 * Step 2 of the analysis pipeline - routes to appropriate processing pipeline
 */

import { DocumentType } from '../types';
import { analyzeVisual } from '../pipelines/visual';
import { analyzeTextual } from '../pipelines/textual';
import { analyzeTabular } from '../pipelines/tabular';

export interface RouteResult {
  pipeline: 'visual' | 'textual' | 'tabular' | 'none';
  handler: ((imageData: string) => Promise<any>) | null;
}

/**
 * Route document to appropriate analysis pipeline based on classification
 */
export function routeToPipeline(documentType: DocumentType): RouteResult {
  switch (documentType) {
    case 'BLUEPRINT':
      return {
        pipeline: 'visual',
        handler: analyzeVisual,
      };

    case 'SPEC_SHEET':
      return {
        pipeline: 'textual',
        handler: analyzeTextual,
      };

    case 'SCHEDULE':
      return {
        pipeline: 'tabular',
        handler: analyzeTabular,
      };

    case 'UNKNOWN':
    default:
      return {
        pipeline: 'none',
        handler: null,
      };
  }
}
