/**
 * Enhanced Visual Pipeline Integration
 * Integrates all optimization and accuracy improvements into the visual analysis pipeline
 */

import { enhanceComponentsWithISA } from '../../../lib/utils/isa-detector';
import { parallelMap, ProgressTracker } from '../../../lib/utils/parallel-processor';
import {
  inferMissingConnections,
  enhanceConnections,
  validateConnections,
  detectControlLoops,
  traceConnectionPaths,
  validateAndCorrectConnectionTypes
} from '../../../lib/utils/connection-engine';
import { applySpatialAssociation } from '../../../lib/utils/spatial-association';
import { normalizeComponents, normalizeConnections } from '../../../lib/utils/type-normalization';
import { applyShapeValidation } from '../../../lib/utils/shape-validator';
import type { VisualAnalysisResult, DetectedComponent, Connection } from '../types';

/**
 * Post-process visual analysis results with all enhancements
 */
export async function enhanceVisualAnalysis(
  result: VisualAnalysisResult,
  options: {
    enableISADetection?: boolean;
    enableConnectionInference?: boolean;
    enableLoopDetection?: boolean;
    enableValidation?: boolean;
    enableSpatialAssociation?: boolean;
    enableShapeValidation?: boolean;
  } = {}
): Promise<VisualAnalysisResult> {
  const {
    enableISADetection = true,
    enableConnectionInference = true,
    enableLoopDetection = true,
    enableValidation = true,
    enableSpatialAssociation = true,
    enableShapeValidation = true
  } = options;
  
  console.log('[Enhancement] Starting post-processing enhancements...');
  const startTime = Date.now();
  
  let components = [...result.components];
  let connections = [...result.connections];
  
  // Step -1: Normalize AI output types to schema enums (ZERO-HITL Data Integrity)
  console.log('[Enhancement] Normalizing component and connection types...');
  components = normalizeComponents(components);
  connections = normalizeConnections(connections);
  console.log('[Enhancement] Type normalization complete');
  
  // Step 0: Apply spatial association to merge orphaned labels (ZERO-HITL Priority)
  // This must run BEFORE ISA detection to ensure proper tagging
  if (enableSpatialAssociation) {
    console.log('[Enhancement] Applying spatial association to merge orphaned labels...');
    const beforeMerge = components.length;
    components = applySpatialAssociation(components, {
      maxDistance: 0.08, // 8% of normalized image size
      useEdgeDistance: true,
      minConfidence: 0.5
    });
    const afterMerge = components.length;
    const mergeCount = beforeMerge - afterMerge;
    console.log(
      `[Enhancement] Spatial association complete: ${mergeCount} orphaned labels merged, ` +
      `${components.length} total components remain`
    );
  }
  
  // Step 0.5: Apply strict geometric shape validation (ZERO-HITL Critical)
  // This enforces shape-type consistency to prevent hallucinations like "circles as valves"
  if (enableShapeValidation) {
    console.log('[Enhancement] Applying strict geometric shape validation...');
    components = applyShapeValidation(components);
    const correctedCount = components.filter(c => c.meta?.shape_validation?.corrected).length;
    console.log(
      `[Enhancement] Shape validation complete: ${correctedCount} components corrected`
    );
  }
  
  // Step 1: Enhance ISA function detection
  if (enableISADetection) {
    console.log('[Enhancement] Detecting ISA functions...');
    components = enhanceComponentsWithISA(components);
    
    const nullISACount = components.filter(c => !c.meta?.isa_function).length;
    const totalComponents = components.length;
    console.log(
      `[Enhancement] ISA detection complete: ${totalComponents - nullISACount}/${totalComponents} components have ISA functions ` +
      `(${Math.round((totalComponents - nullISACount) / totalComponents * 100)}%)`
    );
  }
  
  // Step 2: Enhance connections with metadata
  if (connections.length > 0) {
    console.log('[Enhancement] Enhancing connections...');
    connections = enhanceConnections(components, connections);
  }
  
  // Step 3: Infer missing connections via control loop analysis
  if (enableConnectionInference) {
    console.log('[Enhancement] Inferring missing connections via control loops...');
    const inferred = inferMissingConnections(components, connections);
    
    if (inferred.length > 0) {
      console.log(`[Enhancement] Found ${inferred.length} inferred control loop connections`);
      connections = [...connections, ...inferred];
    }
    
    // Step 3b: Trace connection paths for additional discovery
    console.log('[Enhancement] Tracing physical connection paths...');
    const traced = traceConnectionPaths(components, connections, {
      maxDistance: 0.08,
      requireAlignment: true,
      traceProcessFlow: true,
      traceSignalFlow: true
    });
    
    if (traced.length > 0) {
      console.log(`[Enhancement] Discovered ${traced.length} additional connections via path tracing`);
      connections = [...connections, ...traced];
    }
  }
  
  // Step 4: Validate and correct connection types
  let validationIssues: any[] = [];
  if (enableValidation) {
    console.log('[Enhancement] Validating connections...');
    validationIssues = validateConnections(components, connections);
    
    if (validationIssues.length > 0) {
      const errors = validationIssues.filter(i => i.severity === 'error').length;
      const warnings = validationIssues.filter(i => i.severity === 'warning').length;
      console.warn(
        `[Enhancement] Connection validation found ${validationIssues.length} issues ` +
        `(${errors} errors, ${warnings} warnings)`
      );
      
      // Attempt to auto-correct connection type mismatches
      console.log('[Enhancement] Auto-correcting connection type mismatches...');
      connections = validateAndCorrectConnectionTypes(connections, components);
    }
  }
  
  // Step 5: Detect control loops
  let controlLoops: any[] = [];
  if (enableLoopDetection) {
    console.log('[Enhancement] Detecting control loops...');
    controlLoops = detectControlLoops(components, connections);
    console.log(`[Enhancement] Detected ${controlLoops.length} control loops`);
  }
  
  const duration = Date.now() - startTime;
  console.log(`[Enhancement] Post-processing complete in ${duration}ms`);
  
  return {
    ...result,
    components,
    connections,
    metadata: {
      ...result.metadata,
      enhancement: {
        spatial_association_enabled: enableSpatialAssociation,
        orphaned_labels_merged: components.filter(c => c.meta?.merged_from_orphaned_label).length,
        shape_validation_enabled: enableShapeValidation,
        shape_violations_corrected: components.filter(c => c.meta?.shape_validation?.corrected).length,
        isa_detection_enabled: enableISADetection,
        isa_functions_detected: components.filter(c => c.meta?.isa_function).length,
        isa_detection_rate: components.filter(c => c.meta?.isa_function).length / components.length,
        connection_inference_enabled: enableConnectionInference,
        inferred_connections: connections.filter((c: any) => c.inferred).length,
        validation_enabled: enableValidation,
        validation_issues: validationIssues.length,
        loop_detection_enabled: enableLoopDetection,
        control_loops: controlLoops.length,
        enhancement_duration_ms: duration
      },
      control_loops: controlLoops,
      validation_issues: validationIssues
    }
  };
}

/**
 * Optimize parallel tile processing
 */
export async function optimizedTileProcessing<T, R>(
  tiles: T[],
  processor: (tile: T, index: number) => Promise<R>,
  options: {
    maxConcurrency?: number;
    onProgress?: (completed: number, total: number) => void;
  } = {}
): Promise<R[]> {
  const { maxConcurrency = 4, onProgress } = options;
  
  console.log(`[Optimization] Processing ${tiles.length} tiles with concurrency ${maxConcurrency}`);
  const tracker = new ProgressTracker(tiles.length, 500);
  
  const results = await parallelMap(
    tiles,
    async (tile, index) => {
      const result = await processor(tile, index);
      tracker.increment();
      if (onProgress) {
        onProgress(index + 1, tiles.length);
      }
      return result;
    },
    maxConcurrency
  );
  
  tracker.finish();
  return results;
}

/**
 * Component deduplication with enhanced IoU matching
 */
export function enhancedDeduplication(
  components: DetectedComponent[],
  iouThreshold: number = 0.5
): DetectedComponent[] {
  const deduplicated: DetectedComponent[] = [];
  const processed = new Set<number>();
  
  for (let i = 0; i < components.length; i++) {
    if (processed.has(i)) continue;
    
    const current = components[i];
    const duplicates: DetectedComponent[] = [current];
    
    // Find all duplicates
    for (let j = i + 1; j < components.length; j++) {
      if (processed.has(j)) continue;
      
      const other = components[j];
      const iou = calculateIoU(current.bbox, other.bbox);
      
      // Consider duplicates if high IoU AND same type
      if (iou > iouThreshold && current.type === other.type) {
        duplicates.push(other);
        processed.add(j);
      }
    }
    
    // Merge duplicates - keep highest confidence
    const merged = mergeDuplicates(duplicates);
    deduplicated.push(merged);
    processed.add(i);
  }
  
  console.log(
    `[Deduplication] Reduced ${components.length} components to ${deduplicated.length} ` +
    `(removed ${components.length - deduplicated.length} duplicates)`
  );
  
  return deduplicated;
}

/**
 * Merge duplicate components
 */
function mergeDuplicates(duplicates: DetectedComponent[]): DetectedComponent {
  if (duplicates.length === 1) return duplicates[0];
  
  // Sort by confidence
  const sorted = [...duplicates].sort((a, b) => b.confidence - a.confidence);
  const best = sorted[0];
  
  // Merge metadata from all duplicates
  const mergedMeta = duplicates.reduce((acc, dup) => {
    return {
      ...acc,
      ...dup.meta,
      sources: [...(acc.sources || []), dup.id],
      merged_from_count: duplicates.length
    };
  }, {} as any);
  
  return {
    ...best,
    confidence: Math.max(...duplicates.map(d => d.confidence)),
    meta: mergedMeta
  };
}

/**
 * Calculate Intersection over Union for two bboxes
 */
function calculateIoU(
  bbox1: [number, number, number, number],
  bbox2: [number, number, number, number]
): number {
  const [x1Min, y1Min, x1Max, y1Max] = bbox1;
  const [x2Min, y2Min, x2Max, y2Max] = bbox2;
  
  // Calculate intersection
  const xMin = Math.max(x1Min, x2Min);
  const yMin = Math.max(y1Min, y2Min);
  const xMax = Math.min(x1Max, x2Max);
  const yMax = Math.min(y1Max, y2Max);
  
  if (xMax < xMin || yMax < yMin) return 0;
  
  const intersection = (xMax - xMin) * (yMax - yMin);
  
  // Calculate union
  const area1 = (x1Max - x1Min) * (y1Max - y1Min);
  const area2 = (x2Max - x2Min) * (y2Max - y2Min);
  const union = area1 + area2 - intersection;
  
  return intersection / union;
}

/**
 * Quality metrics calculation
 */
export function calculateQualityMetrics(result: VisualAnalysisResult): {
  overall_score: number;
  detection_quality: number;
  isa_completeness: number;
  connection_coverage: number;
  confidence_avg: number;
  metrics: Record<string, number>;
} {
  const components = result.components;
  const connections = result.connections;
  
  // Detection quality (based on confidence)
  const avgConfidence = components.length > 0
    ? components.reduce((sum, c) => sum + c.confidence, 0) / components.length
    : 0;
  
  // ISA completeness
  const isaComplete = components.filter(c => c.meta?.isa_function).length;
  const isaCompleteness = components.length > 0 ? isaComplete / components.length : 0;
  
  // Connection coverage (ratio of connections to components)
  const connectionCoverage = components.length > 0
    ? Math.min(connections.length / components.length, 1)
    : 0;
  
  // Detection quality score
  const excellentDetections = components.filter(
    c => c.meta?.detection_quality === 'excellent'
  ).length;
  const detectionQuality = components.length > 0
    ? excellentDetections / components.length
    : 0;
  
  // Overall score (weighted average)
  const overallScore = (
    avgConfidence * 0.3 +
    isaCompleteness * 0.25 +
    connectionCoverage * 0.20 +
    detectionQuality * 0.25
  );
  
  return {
    overall_score: overallScore,
    detection_quality: detectionQuality,
    isa_completeness: isaCompleteness,
    connection_coverage: connectionCoverage,
    confidence_avg: avgConfidence,
    metrics: {
      total_components: components.length,
      total_connections: connections.length,
      isa_functions_detected: isaComplete,
      excellent_detections: excellentDetections,
      avg_confidence: avgConfidence
    }
  };
}
