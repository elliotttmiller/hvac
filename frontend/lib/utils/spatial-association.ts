/**
 * Spatial Association Engine
 * Implements deterministic geometric post-processing to resolve spatial ambiguities
 * that the AI model misses, particularly orphaned text labels.
 * 
 * OBJECTIVE: Eliminate "UNLABELED" components by merging nearby text labels with
 * unlabeled symbols using proximity-based matching.
 */

import { DetectedComponent } from '@/features/document-analysis/types';

/**
 * Calculate Euclidean distance between two bbox centers
 */
function calculateDistance(
  bbox1: [number, number, number, number],
  bbox2: [number, number, number, number]
): number {
  const center1 = [(bbox1[0] + bbox1[2]) / 2, (bbox1[1] + bbox1[3]) / 2];
  const center2 = [(bbox2[0] + bbox2[2]) / 2, (bbox2[1] + bbox2[3]) / 2];
  
  return Math.sqrt(
    Math.pow(center2[0] - center1[0], 2) +
    Math.pow(center2[1] - center1[1], 2)
  );
}

/**
 * Calculate minimum edge-to-edge distance between two bboxes
 */
function calculateEdgeDistance(
  bbox1: [number, number, number, number],
  bbox2: [number, number, number, number]
): number {
  const [x1min, y1min, x1max, y1max] = bbox1;
  const [x2min, y2min, x2max, y2max] = bbox2;
  
  // Check if boxes overlap
  const xOverlap = x1max >= x2min && x2max >= x1min;
  const yOverlap = y1max >= y2min && y2max >= y1min;
  
  if (xOverlap && yOverlap) {
    return 0; // Boxes overlap
  }
  
  // Calculate edge-to-edge distances
  let dx = 0, dy = 0;
  
  if (x1max < x2min) dx = x2min - x1max;
  else if (x2max < x1min) dx = x1min - x2max;
  
  if (y1max < y2min) dy = y2min - y1max;
  else if (y2max < y1min) dy = y1min - y2max;
  
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a label looks like an engineering tag (e.g., "HV-101", "TIC-202")
 * Engineering tags typically follow patterns like:
 * - Letter-Number format: "HV-101", "PDI-1401"
 * - Pure letters with numbers: "TIC202", "FV101"
 */
function isEngineeringTag(label: string): boolean {
  if (!label || typeof label !== 'string') return false;
  
  const trimmed = label.trim();
  
  // Pattern 1: Letter(s)-Number(s) with optional hyphen
  // Examples: HV-101, PDI-1401, TIC-202, FV101
  const tagPattern = /^[A-Z]{1,4}-?\d{2,4}$/i;
  
  if (tagPattern.test(trimmed)) return true;
  
  // Pattern 2: ISA function codes (2 letters + optional modifier)
  // Examples: TT, PT, FT, TIC, PIC, FV, CV
  const functionCodePattern = /^[A-Z]{2,4}$/i;
  
  // Only consider short codes (2-4 letters) as potential tags
  if (functionCodePattern.test(trimmed) && trimmed.length <= 4) return true;
  
  return false;
}

/**
 * Check if a component appears to be unlabeled or has a generic label
 */
function isUnlabeledOrGeneric(component: DetectedComponent): boolean {
  const label = (component.label || '').toLowerCase().trim();
  
  // Check for explicit unlabeled markers
  if (
    label === '' ||
    label === 'unlabeled' ||
    label === 'unknown' ||
    label === 'n/a' ||
    label === 'none'
  ) {
    return true;
  }
  
  // Check if label is just the type (e.g., "valve", "instrument")
  if (component.type && label === component.type.toLowerCase()) {
    return true;
  }
  
  return false;
}

/**
 * Check if a component appears to be an orphaned text label
 */
function isOrphanedTextLabel(component: DetectedComponent): boolean {
  const type = (component.type || '').toLowerCase();
  const label = (component.label || '').trim();
  
  // Check type indicators for text/label
  const isTextType = 
    type === 'text' ||
    type === 'label' ||
    type === 'text_label' ||
    type === 'annotation' ||
    type === 'tag';
  
  // Has an engineering tag-like label
  const hasEngineeringTag = isEngineeringTag(label);
  
  return isTextType && hasEngineeringTag && label.length > 0;
}

/**
 * Calculate a priority score for label-component pairing
 * Higher score = better match
 */
function calculatePairingScore(
  label: DetectedComponent,
  component: DetectedComponent,
  distance: number
): number {
  let score = 0;
  
  // Distance factor (closer is better)
  // Normalize distance to 0-1 range, then invert
  const maxDistance = 0.15; // Maximum reasonable distance
  const distanceFactor = Math.max(0, 1 - (distance / maxDistance));
  score += distanceFactor * 50; // Max 50 points for distance
  
  // Engineering tag bonus (prioritize proper tags over generic text)
  if (isEngineeringTag(label.label)) {
    score += 30;
  }
  
  // Label length bonus (shorter, specific tags preferred over long descriptions)
  const labelLength = (label.label || '').trim().length;
  if (labelLength >= 3 && labelLength <= 8) {
    score += 15; // Ideal tag length
  } else if (labelLength > 8) {
    score += 5; // Long labels are likely descriptions, not tags
  }
  
  // Confidence bonus
  const labelConfidence = label.confidence || 0.5;
  const componentConfidence = component.confidence || 0.5;
  score += (labelConfidence + componentConfidence) * 2.5; // Max 5 points
  
  return score;
}

/**
 * Merge orphaned text labels with unlabeled components based on spatial proximity
 * 
 * This function implements a deterministic geometric post-processing algorithm that:
 * 1. Identifies orphaned text labels (detected as separate "text" components)
 * 2. Identifies unlabeled components (components without proper labels)
 * 3. Calculates proximity between them
 * 4. Merges them when proximity threshold is met, prioritizing engineering tags
 * 
 * @param components - Array of detected components
 * @param options - Configuration options
 * @returns Updated array with merged components
 */
export function mergeOrphanedLabels(
  components: DetectedComponent[],
  options: {
    maxDistance?: number;
    useEdgeDistance?: boolean;
    minConfidence?: number;
  } = {}
): DetectedComponent[] {
  const {
    maxDistance = 0.08, // Maximum normalized distance to consider (8% of image)
    useEdgeDistance = true, // Use edge-to-edge vs center-to-center
    minConfidence = 0.5
  } = options;
  
  console.log('[Spatial Association] Starting orphaned label detection...');
  
  // Separate components into categories
  const orphanedLabels: DetectedComponent[] = [];
  const unlabeledComponents: DetectedComponent[] = [];
  const labeledComponents: DetectedComponent[] = [];
  
  for (const comp of components) {
    if (isOrphanedTextLabel(comp)) {
      orphanedLabels.push(comp);
    } else if (isUnlabeledOrGeneric(comp)) {
      unlabeledComponents.push(comp);
    } else {
      labeledComponents.push(comp);
    }
  }
  
  console.log(
    `[Spatial Association] Found ${orphanedLabels.length} orphaned labels, ` +
    `${unlabeledComponents.length} unlabeled components, ` +
    `${labeledComponents.length} already labeled`
  );
  
  if (orphanedLabels.length === 0 || unlabeledComponents.length === 0) {
    console.log('[Spatial Association] No merging needed');
    return components;
  }
  
  // Track which labels and components have been merged
  const mergedLabelIds = new Set<string>();
  const mergedComponentIds = new Set<string>();
  const mergedComponents: DetectedComponent[] = [];
  
  // For each unlabeled component, find the best matching orphaned label
  for (const component of unlabeledComponents) {
    if (mergedComponentIds.has(component.id)) continue;
    
    let bestMatch: {
      label: DetectedComponent;
      distance: number;
      score: number;
    } | null = null;
    
    // Find all nearby labels
    for (const label of orphanedLabels) {
      if (mergedLabelIds.has(label.id)) continue;
      
      // Calculate distance
      const distance = useEdgeDistance
        ? calculateEdgeDistance(component.bbox, label.bbox)
        : calculateDistance(component.bbox, label.bbox);
      
      // Skip if too far
      if (distance > maxDistance) continue;
      
      // Skip if confidence too low
      if ((label.confidence || 0) < minConfidence) continue;
      
      // Calculate pairing score
      const score = calculatePairingScore(label, component, distance);
      
      // Update best match
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { label, distance, score };
      }
    }
    
    // If we found a good match, merge them
    if (bestMatch) {
      const { label, distance, score } = bestMatch;
      
      console.log(
        `[Spatial Association] Merging "${label.label}" → "${component.type}" ` +
        `(distance: ${distance.toFixed(4)}, score: ${score.toFixed(1)})`
      );
      
      // Create merged component
      const merged: DetectedComponent = {
        ...component,
        label: label.label,
        // Use the higher confidence
        confidence: Math.max(component.confidence || 0, label.confidence || 0),
        meta: {
          ...component.meta,
          // Preserve tag information
          tag: label.label,
          // Add merge metadata for traceability
          merged_from_orphaned_label: true,
          orphaned_label_id: label.id,
          merge_distance: distance,
          merge_score: score,
          // Preserve original reasoning
          reasoning: component.meta?.reasoning || `${component.type} with merged tag ${label.label}`
        }
      };
      
      mergedComponents.push(merged);
      mergedLabelIds.add(label.id);
      mergedComponentIds.add(component.id);
    } else {
      // No match found, keep as is
      labeledComponents.push(component);
    }
  }
  
  // Add remaining unmerged orphaned labels (keep as separate text components)
  const remainingLabels = orphanedLabels.filter(l => !mergedLabelIds.has(l.id));
  
  console.log(
    `[Spatial Association] Completed merging: ` +
    `${mergedComponents.length} components merged, ` +
    `${remainingLabels.length} labels remain orphaned`
  );
  
  // Return the combined result
  return [
    ...labeledComponents,
    ...mergedComponents,
    ...remainingLabels
  ];
}

/**
 * Post-process visual analysis results to merge orphaned labels
 * This is the main entry point for the spatial association pipeline
 */
export function applySpatialAssociation(
  components: DetectedComponent[],
  options?: {
    maxDistance?: number;
    useEdgeDistance?: boolean;
    minConfidence?: number;
  }
): DetectedComponent[] {
  console.log('[Spatial Association] Starting spatial association post-processing...');
  
  const startTime = Date.now();
  const originalCount = components.length;
  
  // Apply orphaned label merging
  const result = mergeOrphanedLabels(components, options);
  
  const duration = Date.now() - startTime;
  const merged = originalCount - result.length;
  
  console.log(
    `[Spatial Association] Post-processing complete in ${duration}ms: ` +
    `${originalCount} → ${result.length} components (${merged} merged)`
  );
  
  return result;
}
