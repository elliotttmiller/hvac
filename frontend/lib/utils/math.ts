/**
 * Math Utilities for HVAC Analysis
 * Box merging, IoU calculation, and coordinate transformations
 */

export interface BoundingBox {
  x1: number; y1: number; x2: number; y2: number;
}

export interface Component {
  id: string;
  bbox: [number, number, number, number]; // [xmin, ymin, xmax, ymax] (canonical)
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
 * Calculate Intersection over Union (IoU)
 */
export function calculateIoU(
  box1: [number, number, number, number],
  box2: [number, number, number, number]
): number {
  // Canonical format: [xmin, ymin, xmax, ymax]
  const [x1_1, y1_1, x2_1, y2_1] = box1;
  const [x1_2, y1_2, x2_2, y2_2] = box2;

  const epsilon = PRECISION_CONFIG.IOU_EPSILON;

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

// Debug wrapper: logs IoU calculations when running in dev
export function debugIoU(box1: [number, number, number, number], box2: [number, number, number, number], label?: string) {
  try {
    const iou = calculateIoU(box1, box2);
    if (PRECISION_CONFIG.DEBUG_MODE) {
      const area1 = Math.max(0, (box1[2] - box1[0])) * Math.max(0, (box1[3] - box1[1]));
      const area2 = Math.max(0, (box2[2] - box2[0])) * Math.max(0, (box2[3] - box2[1]));
      console.debug('[Math][IoU]', { label: label || '', box1, box2, iou, area1, area2 });
    }
    return iou;
  } catch (err) {
    console.error('[Math][IoU] failed', err);
    return 0;
  }
}

/**
 * Merge duplicate detections (NMS)
 */
export function mergeComponents(
  components: Component[],
  iouThreshold: number = 0.5
): Component[] {
  if (components.length === 0) return [];

  const sorted = [...components].sort((a, b) => (b.confidence || 1) - (a.confidence || 1));
  const kept: Component[] = [];
  const suppressed = new Set<string>();

  for (const current of sorted) {
    if (suppressed.has(current.id)) continue;

    let shouldKeep = true;
    for (const keptComponent of kept) {
      if (current.type === keptComponent.type && 
          calculateIoU(current.bbox, keptComponent.bbox) > iouThreshold) {
        shouldKeep = false;
        suppressed.add(current.id);
        break;
      }
    }

    if (shouldKeep) kept.push(current);
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

  // Debug info for tracing transforms
  console.debug('[Math][localToGlobal] localBox=', localBox, 'tile=', tile, '=> global=', [globalXmin, globalYmin, globalXmax, globalYmax]);

  return [globalXmin, globalYmin, globalXmax, globalYmax];
}

// Alias for compatibility
export const localToGlobal = normalizeCoordinates;

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}