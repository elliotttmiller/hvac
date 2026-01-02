/**
 * Math Utilities for HVAC Analysis
 * Box merging, IoU calculation, and coordinate transformations
 */

export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Component {
  id: string;
  bbox: [number, number, number, number];
  [key: string]: any;
}

/**
 * Calculate Intersection over Union (IoU) between two bounding boxes
 * Used for deduplication in overlapping tile regions
 * 
 * @param box1 - First bounding box [x1, y1, x2, y2]
 * @param box2 - Second bounding box [x1, y1, x2, y2]
 * @returns IoU score between 0 and 1
 */
export function calculateIoU(
  box1: [number, number, number, number],
  box2: [number, number, number, number]
): number {
  const [x1_1, y1_1, x2_1, y2_1] = box1;
  const [x1_2, y1_2, x2_2, y2_2] = box2;

  // Calculate intersection area
  const intersectX1 = Math.max(x1_1, x1_2);
  const intersectY1 = Math.max(y1_1, y1_2);
  const intersectX2 = Math.min(x2_1, x2_2);
  const intersectY2 = Math.min(y2_1, y2_2);

  // Check if there's no intersection
  if (intersectX2 < intersectX1 || intersectY2 < intersectY1) {
    return 0;
  }

  const intersectionArea = (intersectX2 - intersectX1) * (intersectY2 - intersectY1);

  // Calculate union area
  const box1Area = (x2_1 - x1_1) * (y2_1 - y1_1);
  const box2Area = (x2_2 - x1_2) * (y2_2 - y1_2);
  const unionArea = box1Area + box2Area - intersectionArea;

  // Avoid division by zero
  if (unionArea === 0) {
    return 0;
  }

  return intersectionArea / unionArea;
}

/**
 * Merge duplicate detections using Non-Maximum Suppression (NMS)
 * Removes overlapping boxes based on IoU threshold
 * 
 * @param components - Array of detected components
 * @param iouThreshold - IoU threshold for considering boxes as duplicates (default: 0.5)
 * @returns Deduplicated array of components
 */
export function mergeComponents(
  components: Component[],
  iouThreshold: number = 0.5
): Component[] {
  if (components.length === 0) {
    return [];
  }

  // Sort by confidence (if available) in descending order
  const sorted = [...components].sort((a, b) => {
    const confA = a.confidence ?? 1;
    const confB = b.confidence ?? 1;
    return confB - confA;
  });

  const kept: Component[] = [];
  const suppressed = new Set<string>();

  for (const current of sorted) {
    if (suppressed.has(current.id)) {
      continue;
    }

    // Check against all kept boxes
    let shouldKeep = true;
    for (const keptComponent of kept) {
      const iou = calculateIoU(current.bbox, keptComponent.bbox);
      if (iou > iouThreshold) {
        // This is a duplicate - suppress it
        shouldKeep = false;
        suppressed.add(current.id);
        break;
      }
    }

    if (shouldKeep) {
      kept.push(current);
    }
  }

  return kept;
}

/**
 * Transform local tile coordinates to global image coordinates
 * 
 * @param localBbox - Bounding box in local tile coordinates [x1, y1, x2, y2] (0-1 range)
 * @param tileBbox - Tile's position in global image [x1, y1, x2, y2] (0-1 range)
 * @returns Global bounding box in image coordinates (0-1 range)
 */
export function localToGlobal(
  localBbox: [number, number, number, number],
  tileBbox: { x1: number; y1: number; x2: number; y2: number }
): [number, number, number, number] {
  // The pipeline historically has had inconsistent bbox orderings from
  // different vision models: some return [x1, y1, x2, y2] and some
  // return [ymin, xmin, ymax, xmax]. To be robust, try both
  // interpretations and pick the one that yields a valid positive
  // width/height in normalized 0-1 space.

  const tryInterpretation = (
    order: 'xyxy' | 'yxyx'
  ): [number, number, number, number] => {
    let x1: number, y1: number, x2: number, y2: number;
    if (order === 'xyxy') {
      [x1, y1, x2, y2] = localBbox as [number, number, number, number];
    } else {
      // input is [ymin, xmin, ymax, xmax]
      const [ymin, xmin, ymax, xmax] = localBbox as [number, number, number, number];
      x1 = xmin;
      y1 = ymin;
      x2 = xmax;
      y2 = ymax;
    }

    const tileWidth = tileBbox.x2 - tileBbox.x1;
    const tileHeight = tileBbox.y2 - tileBbox.y1;

    const globalX1 = tileBbox.x1 + x1 * tileWidth;
    const globalY1 = tileBbox.y1 + y1 * tileHeight;
    const globalX2 = tileBbox.x1 + x2 * tileWidth;
    const globalY2 = tileBbox.y1 + y2 * tileHeight;

    return [globalX1, globalY1, globalX2, globalY2];
  };

  const a = tryInterpretation('xyxy');
  const b = tryInterpretation('yxyx');

  const widthA = a[2] - a[0];
  const heightA = a[3] - a[1];
  const widthB = b[2] - b[0];
  const heightB = b[3] - b[1];

  // Prefer the interpretation that results in positive width/height and
  // coordinates inside [0,1]. If both are plausible, prefer 'xyxy'.
  const isAValid = widthA > 0 && heightA > 0 && a.every((v) => v >= 0 && v <= 1);
  const isBValid = widthB > 0 && heightB > 0 && b.every((v) => v >= 0 && v <= 1);

  if (isAValid) return a;
  if (isBValid) return b;

  // Fallback to 'xyxy' interpretation (best-effort)
  return a;
}

/**
 * Calculate Euclidean distance between two points
 * 
 * @param p1 - First point [x, y]
 * @param p2 - Second point [x, y]
 * @returns Distance between points
 */
export function euclideanDistance(
  p1: [number, number],
  p2: [number, number]
): number {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Snap duct endpoints to nearby VAV connectors
 * If a duct endpoint is within snapThreshold of a VAV, snap it to the VAV center
 * 
 * @param ductEndpoint - Duct endpoint [x, y] (0-1 normalized)
 * @param vavBbox - VAV bounding box [x1, y1, x2, y2] (0-1 normalized)
 * @param snapThreshold - Maximum distance for snapping (default: 0.02 = 2%)
 * @returns Snapped endpoint or original if no snap occurred
 */
export function snapToVAV(
  ductEndpoint: [number, number],
  vavBbox: [number, number, number, number],
  snapThreshold: number = 0.02
): [number, number] {
  const [x1, y1, x2, y2] = vavBbox;
  
  // Calculate VAV center
  const vavCenter: [number, number] = [
    (x1 + x2) / 2,
    (y1 + y2) / 2
  ];
  
  // Calculate distance
  const distance = euclideanDistance(ductEndpoint, vavCenter);
  
  // Snap if within threshold
  if (distance <= snapThreshold) {
    return vavCenter;
  }
  
  return ductEndpoint;
}

/**
 * Calculate center point of a bounding box
 * 
 * @param bbox - Bounding box [x1, y1, x2, y2]
 * @returns Center point [x, y]
 */
export function getBboxCenter(
  bbox: [number, number, number, number]
): [number, number] {
  const [x1, y1, x2, y2] = bbox;
  return [(x1 + x2) / 2, (y1 + y2) / 2];
}

/**
 * Calculate area of a bounding box
 * 
 * @param bbox - Bounding box [x1, y1, x2, y2]
 * @returns Area
 */
export function getBboxArea(
  bbox: [number, number, number, number]
): number {
  const [x1, y1, x2, y2] = bbox;
  return (x2 - x1) * (y2 - y1);
}

/**
 * Check if a point is inside a bounding box
 * 
 * @param point - Point [x, y]
 * @param bbox - Bounding box [x1, y1, x2, y2]
 * @returns True if point is inside bbox
 */
export function isPointInBbox(
  point: [number, number],
  bbox: [number, number, number, number]
): boolean {
  const [x, y] = point;
  const [x1, y1, x2, y2] = bbox;
  return x >= x1 && x <= x2 && y >= y1 && y <= y2;
}

/**
 * Normalize coordinates to 0-1 range
 * 
 * @param value - Value to normalize
 * @param max - Maximum value in the range
 * @returns Normalized value (0-1)
 */
export function normalize(value: number, max: number): number {
  return value / max;
}

/**
 * Denormalize coordinates from 0-1 range to pixel coordinates
 * 
 * @param value - Normalized value (0-1)
 * @param max - Maximum value in the range
 * @returns Denormalized value
 */
export function denormalize(value: number, max: number): number {
  return value * max;
}
