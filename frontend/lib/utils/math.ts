/**
 * Math Utilities for HVAC Analysis
 * Box merging, IoU calculation, and coordinate transformations
 */

export interface BoundingBox {
  x1: number; y1: number; x2: number; y2: number;
}

export interface Component {
  id: string;
  bbox: [number, number, number, number]; // [ymin, xmin, ymax, xmax]
  [key: string]: any;
}

/**
 * Calculate Intersection over Union (IoU)
 */
export function calculateIoU(
  box1: [number, number, number, number],
  box2: [number, number, number, number]
): number {
  // Gemini format: [ymin, xmin, ymax, xmax]
  const [y1_1, x1_1, y2_1, x2_1] = box1;
  const [y1_2, x1_2, y2_2, x2_2] = box2;

  const intersectX1 = Math.max(x1_1, x1_2);
  const intersectY1 = Math.max(y1_1, y1_2);
  const intersectX2 = Math.min(x2_1, x2_2);
  const intersectY2 = Math.min(y2_1, y2_2);

  if (intersectX2 < intersectX1 || intersectY2 < intersectY1) return 0;

  const intersectionArea = (intersectX2 - intersectX1) * (intersectY2 - intersectY1);
  const box1Area = (x2_1 - x1_1) * (y2_1 - y1_1);
  const box2Area = (x2_2 - x1_2) * (y2_2 - y1_2);
  const unionArea = box1Area + box2Area - intersectionArea;

  return unionArea === 0 ? 0 : intersectionArea / unionArea;
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
 */
export function normalizeCoordinates(
  localBox: [number, number, number, number],
  tile: { xOffset: number; yOffset: number; width: number; height: number }
): [number, number, number, number] {
  const [ymin, xmin, ymax, xmax] = localBox;

  const globalYmin = tile.yOffset + (ymin * tile.height);
  const globalXmin = tile.xOffset + (xmin * tile.width);
  const globalYmax = tile.yOffset + (ymax * tile.height);
  const globalXmax = tile.xOffset + (xmax * tile.width);

  return [globalYmin, globalXmin, globalYmax, globalXmax];
}

// Alias for compatibility
export const localToGlobal = normalizeCoordinates;

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}