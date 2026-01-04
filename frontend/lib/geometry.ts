/**
 * Geometry utilities for converting normalized bboxes to display pixels
 * and normalizing backend bbox formats.
 * 
 * BBOX FORMAT CONVENTIONS:
 * =======================
 * 
 * **Canonical Format (Internal Standard):**
 * - Format: [xmin, ymin, xmax, ymax]
 * - Values: normalized 0.0 to 1.0 (floating point)
 * - Used throughout the application internally
 * - Used in mock data (golden-record.json)
 * - Used in stored annotations
 * - Used in InteractiveViewer rendering
 * 
 * **Alternative Formats (External APIs):**
 * - Gemini API: [ymin, xmin, ymax, xmax] (requires conversion)
 * - Pixel coordinates: absolute pixel values (requires normalization)
 * - 0-1000 normalized: scaled integers (requires scaling)
 * 
 * **IMPORTANT:** Always assume canonical format unless explicitly specified
 * via the `order` parameter. The previous heuristic-based auto-detection
 * was removed because it caused false positives on wide images where
 * x coordinates are naturally larger than y coordinates.
 */
export type NormBBox = [number, number, number, number]; // [xmin, ymin, xmax, ymax]

export function normalizeBackendBBox(raw: number[], options?: { space?: 'pixels'|'norm-0-1'|'norm-0-1000', order?: 'ymin_xmin_ymax_xmax'|'xmin_ymin_xmax_ymax', imageSize?: {width:number,height:number} }): NormBBox {
  if (!Array.isArray(raw) || raw.length < 4) return [0,0,0,0];

  const space = options?.space;
  const order = options?.order;

  let a = raw.slice(0,4).map(n => Number(n));

  // If values are large (>1) and likely 0-1000 normalized, scale down
  const maxVal = Math.max(...a.map(Math.abs));
  if (!space) {
    if (maxVal > 1 && maxVal <= 1000) {
      a = a.map(v => v / 1000);
    } else if (maxVal > 1 && maxVal > 1000) {
      // If pixels provided and imageSize known, try normalizing by imageSize
      if (options?.imageSize) {
        const { width, height } = options.imageSize;
        // Heuristic: assume raw order is [x1,y1,x2,y2] in pixels
        const [r0,r1,r2,r3] = a;
        return [r0/width, r1/height, r2/width, r3/height];
      }
      // Fallback: scale by maxVal
      a = a.map(v => v / maxVal);
    }
  }

  // Order detection: only swap if explicitly specified
  // Default: assume canonical [xmin, ymin, xmax, ymax] format
  // This is the standard format used by most vision APIs including our golden records
  let xmin, ymin, xmax, ymax;
  if (order === 'ymin_xmin_ymax_xmax') {
    // Explicitly specified [ymin, xmin, ymax, xmax] format (e.g., Gemini API)
    // [ymin, xmin, ymax, xmax] -> map to [xmin,ymin,xmax,ymax]
    ymin = a[0]; xmin = a[1]; ymax = a[2]; xmax = a[3];
  } else {
    // Default: assume canonical [xmin,ymin,xmax,ymax] format
    // This applies to:
    // - Our golden record mock data
    // - Most standard bbox formats (COCO, Pascal VOC, etc.)
    // - Normalized coordinates from our own pipeline
    xmin = a[0]; ymin = a[1]; xmax = a[2]; ymax = a[3];
  }

  // Clip to [0,1]
  xmin = Math.max(0, Math.min(1, xmin));
  ymin = Math.max(0, Math.min(1, ymin));
  xmax = Math.max(0, Math.min(1, xmax));
  ymax = Math.max(0, Math.min(1, ymax));

  return [xmin, ymin, xmax, ymax];
}

export function convertNormalizedToDisplay(norm: NormBBox, origSize: {width:number,height:number}, displaySize: {width:number,height:number}, maintainAspect = true) {
  const [xmin, ymin, xmax, ymax] = norm;
  const origW = origSize.width, origH = origSize.height;

  const abs = {
    x1: xmin * origW,
    y1: ymin * origH,
    x2: xmax * origW,
    y2: ymax * origH,
  };

  if (maintainAspect) {
    const scaleW = displaySize.width / origW;
    const scaleH = displaySize.height / origH;
    const scale = Math.min(scaleW, scaleH);
    const newW = origW * scale;
    const newH = origH * scale;
    const padX = (displaySize.width - newW) / 2;
    const padY = (displaySize.height - newH) / 2;

    const x = abs.x1 * scale + padX;
    const y = abs.y1 * scale + padY;
    const w = (abs.x2 - abs.x1) * scale;
    const h = (abs.y2 - abs.y1) * scale;
    return { x, y, w, h };
  } else {
    const sx = displaySize.width / origW;
    const sy = displaySize.height / origH;
    const x = abs.x1 * sx;
    const y = abs.y1 * sy;
    const w = (abs.x2 - abs.x1) * sx;
    const h = (abs.y2 - abs.y1) * sy;
    return { x, y, w, h };
  }
}

export function convertDisplayToNormalized(pixelBox: {x:number,y:number,w:number,h:number}, displaySize: {width:number,height:number}) : NormBBox {
  const xmin = pixelBox.x / displaySize.width;
  const ymin = pixelBox.y / displaySize.height;
  const xmax = (pixelBox.x + pixelBox.w) / displaySize.width;
  const ymax = (pixelBox.y + pixelBox.h) / displaySize.height;
  return [xmin, ymin, xmax, ymax];
}

export function areaOfNormBBox(b:[number,number,number,number]){ const w=b[2]-b[0]; const h=b[3]-b[1]; return Math.max(0,w*h); }

/**
 * Convert between coordinate formats
 * - 'gemini' = [ymin, xmin, ymax, xmax] normalized 0..1
 * - 'canonical' = [xmin, ymin, xmax, ymax] normalized 0..1 (repo internal)
 * - 'absolute' = [x1, y1, x2, y2] in pixels
 */
export function convertCoordinateFormat(
  box: number[] | { x1: number; y1: number; x2: number; y2: number },
  fromFormat: 'gemini' | 'canonical' | 'absolute',
  toFormat: 'gemini' | 'canonical' | 'absolute',
  imageSize?: { width: number; height: number }
): NormBBox | [number, number, number, number] {
  // Ensure imageSize exists when converting to/from absolute
  if ((fromFormat === 'absolute' || toFormat === 'absolute') && !imageSize) {
    throw new Error('imageSize is required when converting to/from absolute coordinates');
  }

  // Helper: convert any input to canonical normalized [xmin, ymin, xmax, ymax]
  let canonical: NormBBox;
  if (fromFormat === 'canonical') {
    const arr = box as number[];
    canonical = [arr[0], arr[1], arr[2], arr[3]];
  } else if (fromFormat === 'gemini') {
    const arr = box as number[];
    // gemini: [ymin, xmin, ymax, xmax]
    canonical = [arr[1], arr[0], arr[3], arr[2]];
  } else { // absolute
    const abs = box as { x1: number; y1: number; x2: number; y2: number };
    canonical = [abs.x1 / imageSize!.width, abs.y1 / imageSize!.height, abs.x2 / imageSize!.width, abs.y2 / imageSize!.height];
  }

  // Convert canonical to target
  if (toFormat === 'canonical') return canonical;
  if (toFormat === 'gemini') {
    // [xmin, ymin, xmax, ymax] -> [ymin, xmin, ymax, xmax]
    return [canonical[1], canonical[0], canonical[3], canonical[2]];
  }

  // to absolute
  return [
    canonical[0] * imageSize!.width,
    canonical[1] * imageSize!.height,
    canonical[2] * imageSize!.width,
    canonical[3] * imageSize!.height,
  ];
}

/**
 * Transform bbox coordinates when image dimensions change (canonical input/output)
 */
export function transformBoundingBoxForResize(
  bbox: NormBBox,
  originalSize: { width: number; height: number },
  newSize: { width: number; height: number },
  maintainAspect: boolean = true
): NormBBox {
  // Convert normalized canonical to absolute in original image
  const absX1 = bbox[0] * originalSize.width;
  const absY1 = bbox[1] * originalSize.height;
  const absX2 = bbox[2] * originalSize.width;
  const absY2 = bbox[3] * originalSize.height;

  if (maintainAspect) {
    const scaleW = newSize.width / originalSize.width;
    const scaleH = newSize.height / originalSize.height;
    const scale = Math.min(scaleW, scaleH);
    const newW = originalSize.width * scale;
    const newH = originalSize.height * scale;
    const padX = (newSize.width - newW) / 2;
    const padY = (newSize.height - newH) / 2;

    const newX1 = absX1 * scale + padX;
    const newY1 = absY1 * scale + padY;
    const newX2 = absX2 * scale + padX;
    const newY2 = absY2 * scale + padY;

    return [newX1 / newSize.width, newY1 / newSize.height, newX2 / newSize.width, newY2 / newSize.height];
  } else {
    const scaleX = newSize.width / originalSize.width;
    const scaleY = newSize.height / originalSize.height;
    const newX1 = absX1 * scaleX;
    const newY1 = absY1 * scaleY;
    const newX2 = absX2 * scaleX;
    const newY2 = absY2 * scaleY;
    return [newX1 / newSize.width, newY1 / newSize.height, newX2 / newSize.width, newY2 / newSize.height];
  }
}
