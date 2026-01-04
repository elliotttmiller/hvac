/**
 * Math Utilities for HVAC Analysis
 * Box merging, IoU calculation, and coordinate transformations with precision handling
 */

export interface BoundingBox {
  x1: number; y1: number; x2: number; y2: number;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface TransformRecord {
  timestamp: string;
  operation: 'resize' | 'crop' | 'rotate' | 'normalize';
  originalSize: { width: number; height: number };
  newSize: { width: number; height: number };
  maintainedAspectRatio?: boolean;
  padding?: { top: number; right: number; bottom: number; left: number };
}

export interface Component {
  id: string;
  bbox: [number, number, number, number]; // [xmin, ymin, xmax, ymax] (canonical)
  confidence?: number;
  type?: string;
  meta?: {
    originalDimensions?: { width: number; height: number };
    transformHistory?: TransformRecord[];
    [key: string]: any;
  };
  [key: string]: any;
}

// Precision configuration (centralized small config for math helpers)
import { config } from '@/app/config';

export const PRECISION_CONFIG = {
  COORDINATE_TOLERANCE: 1e-6,
  IOU_EPSILON: 1e-8,
  // Wire debug mode to app config (VITE_FEATURE_PRECISION_DEBUG)
  DEBUG_MODE: !!config.features.precisionDebug,
};

/**
 * Calculate box area for validation and debugging
 */
export function calculateBoxArea(box: [number, number, number, number]): number {
  const [x1, y1, x2, y2] = box;
  return Math.max(0, (x2 - x1) * (y2 - y1));
}

/**
 * Validate normalized box coordinates (0-1 range)
 */
export function validateNormalizedBox(box: [number, number, number, number]): boolean {
  const [x1, y1, x2, y2] = box;
  const tolerance = PRECISION_CONFIG.COORDINATE_TOLERANCE;
  
  // Check bounds [0, 1] with tolerance
  if (x1 < -tolerance || x1 > 1 + tolerance || 
      y1 < -tolerance || y1 > 1 + tolerance ||
      x2 < -tolerance || x2 > 1 + tolerance ||
      y2 < -tolerance || y2 > 1 + tolerance) {
    return false;
  }
  
  // Check logical ordering
  if (x2 < x1 - tolerance || y2 < y1 - tolerance) {
    return false;
  }
  
  return true;
}

/**
 * Validate IoU precision to detect floating-point issues
 */
export function validateIoUPrecision(
  box1: [number, number, number, number],
  box2: [number, number, number, number],
  iou: number
): { valid: boolean; warning?: string } {
  const tolerance = PRECISION_CONFIG.COORDINATE_TOLERANCE;
  
  // Check for extreme values
  if (iou < 0 || iou > 1) {
    return { valid: false, warning: `IoU out of bounds: ${iou}` };
  }
  
  // Check for very small boxes that might cause precision issues
  const area1 = calculateBoxArea(box1);
  const area2 = calculateBoxArea(box2);
  
  if (area1 < tolerance || area2 < tolerance) {
    return { 
      valid: true, 
      warning: `Very small boxes detected (area1: ${area1}, area2: ${area2}) - precision may be affected` 
    };
  }
  
  return { valid: true };
}

/**
 * Calculate Intersection over Union (IoU) with precision validation
 */
export function calculateIoU(
  box1: [number, number, number, number],
  box2: [number, number, number, number]
): number {
  // Canonical format: [xmin, ymin, xmax, ymax]
  const [x1_1, y1_1, x2_1, y2_1] = box1;
  const [x1_2, y1_2, x2_2, y2_2] = box2;

  const epsilon = PRECISION_CONFIG.IOU_EPSILON;

  // Validate coordinates before calculation
  if (!validateNormalizedBox(box1) || !validateNormalizedBox(box2)) {
    if (PRECISION_CONFIG.DEBUG_MODE) {
      console.warn('[Math][IoU] Invalid normalized coordinates detected', { box1, box2 });
    }
    return 0;
  }

  const intersectX1 = Math.max(x1_1, x1_2);
  const intersectY1 = Math.max(y1_1, y1_2);
  const intersectX2 = Math.min(x2_1, x2_2);
  const intersectY2 = Math.min(y2_1, y2_2);

  // No intersection (with epsilon tolerance)
  if (intersectX2 <= intersectX1 + epsilon || intersectY2 <= intersectY1 + epsilon) return 0;

  const intersectionArea = (intersectX2 - intersectX1) * (intersectY2 - intersectY1);
  const box1Area = Math.max(0, (x2_1 - x1_1)) * Math.max(0, (y2_1 - y1_1));
  const box2Area = Math.max(0, (x2_2 - x1_2)) * Math.max(0, (y2_2 - y1_2));

  // Handle near-zero area boxes
  if (box1Area < epsilon || box2Area < epsilon) return 0;

  const unionArea = box1Area + box2Area - intersectionArea;
  if (unionArea < epsilon) return 0;

  const iou = intersectionArea / unionArea;
  return Math.min(Math.max(iou, 0), 1);
}

/**
 * Debug wrapper: logs IoU calculations with precision validation
 */
export function debugIoU(box1: [number, number, number, number], box2: [number, number, number, number], label?: string): number {
  try {
    const iou = calculateIoU(box1, box2);
    if (PRECISION_CONFIG.DEBUG_MODE) {
      const precisionCheck = validateIoUPrecision(box1, box2, iou);
      
      if (!precisionCheck.valid) {
        console.warn('[Math][IoU][Precision]', label || '', 'Precision warning:', precisionCheck.warning);
      }
      
      console.debug('[Math][IoU]', {
        label: label || 'unnamed',
        box1,
        box2,
        iou,
        area1: calculateBoxArea(box1),
        area2: calculateBoxArea(box2),
        precisionCheck
      });
    }
    return iou;
  } catch (err) {
    console.error('[Math][IoU][Error]', label || '', err);
    return 0;
  }
}

/**
 * Merge duplicate detections (NMS) with optional type-aware processing
 */
export function mergeComponents(
  components: Component[],
  iouThreshold: number = 0.5,
  config: { typeAware?: boolean } = {}
): Component[] {
  const { typeAware = true } = config;
  
  if (components.length === 0) return [];
  if (components.length === 1) return [...components];

  const sorted = [...components].sort((a, b) => (b.confidence || 1) - (a.confidence || 1));
  const kept: Component[] = [];
  const suppressed = new Set<string>();
  const processedCount = { total: components.length, kept: 0, suppressed: 0 };

  for (const current of sorted) {
    if (suppressed.has(current.id)) continue;

    let shouldKeep = true;
    for (const keptComponent of kept) {
      // Type-aware merging: only merge same-type components
      if (typeAware && current.type && keptComponent.type && current.type !== keptComponent.type) {
        continue;
      }
      
      if (calculateIoU(current.bbox, keptComponent.bbox) > iouThreshold) {
        shouldKeep = false;
        suppressed.add(current.id);
        processedCount.suppressed++;
        break;
      }
    }

    if (shouldKeep) {
      kept.push(current);
      processedCount.kept++;
    }
  }

  if (PRECISION_CONFIG.DEBUG_MODE) {
    console.debug('[Math][NMS]', {
      total: processedCount.total,
      kept: processedCount.kept,
      suppressed: processedCount.suppressed,
      ratio: (processedCount.kept / processedCount.total * 100).toFixed(1) + '%',
      iouThreshold,
      typeAware
    });
  }

  return kept;
}

/**
 * Transform local tile coordinates to global image coordinates
 * 
 * @param localBox - Bounding box in local tile coordinates [xmin, ymin, xmax, ymax] (0-1 normalized within tile)
 * @param tile - Tile information, supports both formats:
 *               1. { xOffset, yOffset, width, height } - offset and dimensions in normalized coordinates
 *               2. { x1, y1, x2, y2 } - bounding box format from tiling.ts
 * @returns Global bounding box [xmin, ymin, xmax, ymax] in full image coordinates (0-1 normalized)
 */
export function normalizeCoordinates(
  localBox: [number, number, number, number],
  tile: { xOffset: number; yOffset: number; width: number; height: number } | { x1: number; y1: number; x2: number; y2: number }
): [number, number, number, number] {
  // localBox expected in canonical [xmin, ymin, xmax, ymax]
  const [xmin, ymin, xmax, ymax] = localBox;

  // Support both tile formats: { x1, y1, x2, y2 } and { xOffset, yOffset, width, height }
  let tileX1: number, tileY1: number, tileWidth: number, tileHeight: number;
  
  if ('x1' in tile && 'y1' in tile && 'x2' in tile && 'y2' in tile) {
    // Bounding box format from tiling.ts
    const bboxTile = tile as { x1: number; y1: number; x2: number; y2: number };
    tileX1 = bboxTile.x1;
    tileY1 = bboxTile.y1;
    tileWidth = bboxTile.x2 - bboxTile.x1;
    tileHeight = bboxTile.y2 - bboxTile.y1;
  } else if ('xOffset' in tile && 'yOffset' in tile && 'width' in tile && 'height' in tile) {
    // Legacy format with explicit offset and dimensions
    const legacyTile = tile as { xOffset: number; yOffset: number; width: number; height: number };
    tileX1 = legacyTile.xOffset;
    tileY1 = legacyTile.yOffset;
    tileWidth = legacyTile.width;
    tileHeight = legacyTile.height;
  } else {
    // Malformed tile object - this should never happen in production
    console.error('Invalid tile format:', tile);
    throw new Error('Tile object must have either {x1, y1, x2, y2} or {xOffset, yOffset, width, height} properties');
  }

  // Transform: global = tileOffset + (local * tileDimension)
  const globalXmin = tileX1 + (xmin * tileWidth);
  const globalYmin = tileY1 + (ymin * tileHeight);
  const globalXmax = tileX1 + (xmax * tileWidth);
  const globalYmax = tileY1 + (ymax * tileHeight);

  // Clamp to [0, 1] range with tolerance for precision
  const tolerance = PRECISION_CONFIG.COORDINATE_TOLERANCE;
  const result: [number, number, number, number] = [
    Math.min(Math.max(globalXmin, -tolerance), 1 + tolerance),
    Math.min(Math.max(globalYmin, -tolerance), 1 + tolerance),
    Math.min(Math.max(globalXmax, -tolerance), 1 + tolerance),
    Math.min(Math.max(globalYmax, -tolerance), 1 + tolerance)
  ];

  // Debug info for tracing transforms
  if (PRECISION_CONFIG.DEBUG_MODE) {
    console.debug('[Math][normalizeCoordinates]', {
      localBox,
      tile,
      result,
      precisionCheck: validateNormalizedBox(result)
    });
  }

  return result;
}

// Alias for compatibility
export const localToGlobal = normalizeCoordinates;

/**
 * Generate unique ID with timestamp for traceability
 */
export function generateId(prefix: string = 'comp'): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Create transform record for metadata tracking
 */
export function createTransformRecord(
  operation: TransformRecord['operation'],
  originalSize: { width: number; height: number },
  newSize: { width: number; height: number },
  options: { maintainedAspectRatio?: boolean; padding?: TransformRecord['padding'] } = {}
): TransformRecord {
  return {
    timestamp: new Date().toISOString(),
    operation,
    originalSize,
    newSize,
    maintainedAspectRatio: options.maintainedAspectRatio,
    padding: options.padding
  };
}

/**
 * Get image dimensions from various sources
 */
export function getImageDimensions(image: HTMLImageElement | { width: number; height: number }): ImageDimensions {
  if ('naturalWidth' in image) {
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      aspectRatio: image.naturalWidth / image.naturalHeight
    };
  } else {
    return {
      width: image.width,
      height: image.height,
      aspectRatio: image.width / image.height
    };
  }
}