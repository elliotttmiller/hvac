/**
 * Visual Grid Tiling - SOTA Image Processing
 * Splits high-resolution images into overlapping tiles for enhanced precision
 */

export interface TileResult {
  tiles: TileBlob[];
  fullImage: TileBlob;
  metadata: {
    originalWidth: number;
    originalHeight: number;
    tileCount: number;
    overlapPercent: number;
  };
}

export interface TileBlob {
  data: string; // base64 encoded
  mimeType: string;
  position: TilePosition;
  dimensions: {
    width: number;
    height: number;
  };
  bbox: {
    x1: number; // normalized 0-1
    y1: number; // normalized 0-1
    x2: number; // normalized 0-1
    y2: number; // normalized 0-1
  };
}

export type TilePosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'full';

/**
 * Split image into 2x2 grid with overlap
 * Returns 5 blobs: 4 quadrants + full image
 * 
 * @param imageData - Base64 encoded image data
 * @param mimeType - MIME type of the image (e.g., 'image/png')
 * @param overlapPercent - Overlap percentage (default: 10%)
 */
export async function tileImage(
  imageData: string,
  mimeType: string = 'image/png',
  overlapPercent: number = 10
): Promise<TileResult> {
  // Normalize base64 string (remove data URI prefix if present)
  const normalizedImageData = imageData.includes('base64,')
    ? imageData.split('base64,')[1]
    : imageData;

  // Load image to get dimensions
  const img = await loadImage(normalizedImageData, mimeType);
  const width = img.width;
  const height = img.height;

  // Calculate tile dimensions with overlap
  const overlapRatio = overlapPercent / 100;
  const tileWidth = width / 2;
  const tileHeight = height / 2;
  const overlapX = Math.floor(tileWidth * overlapRatio);
  const overlapY = Math.floor(tileHeight * overlapRatio);

  // Create canvas for tiling
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  // Generate 4 tiles with overlap
  const tiles: TileBlob[] = [];

  // Top-left quadrant
  tiles.push(await extractTile(
    img,
    canvas,
    ctx,
    0,
    0,
    tileWidth + overlapX,
    tileHeight + overlapY,
    width,
    height,
    'top-left',
    mimeType
  ));

  // Top-right quadrant
  tiles.push(await extractTile(
    img,
    canvas,
    ctx,
    tileWidth - overlapX,
    0,
    tileWidth + overlapX,
    tileHeight + overlapY,
    width,
    height,
    'top-right',
    mimeType
  ));

  // Bottom-left quadrant
  tiles.push(await extractTile(
    img,
    canvas,
    ctx,
    0,
    tileHeight - overlapY,
    tileWidth + overlapX,
    tileHeight + overlapY,
    width,
    height,
    'bottom-left',
    mimeType
  ));

  // Bottom-right quadrant
  tiles.push(await extractTile(
    img,
    canvas,
    ctx,
    tileWidth - overlapX,
    tileHeight - overlapY,
    tileWidth + overlapX,
    tileHeight + overlapY,
    width,
    height,
    'bottom-right',
    mimeType
  ));

  // Full image (no tiling)
  const fullImage: TileBlob = {
    data: normalizedImageData,
    mimeType,
    position: 'full',
    dimensions: { width, height },
    bbox: { x1: 0, y1: 0, x2: 1, y2: 1 },
  };

  return {
    tiles,
    fullImage,
    metadata: {
      originalWidth: width,
      originalHeight: height,
      tileCount: tiles.length,
      overlapPercent,
    },
  };
}

/**
 * Extract a tile from the source image
 */
async function extractTile(
  img: HTMLImageElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  sourceX: number,
  sourceY: number,
  tileWidth: number,
  tileHeight: number,
  imageWidth: number,
  imageHeight: number,
  position: TilePosition,
  mimeType: string
): Promise<TileBlob> {
  // Set canvas size to tile dimensions
  canvas.width = tileWidth;
  canvas.height = tileHeight;

  // Draw the tile
  ctx.drawImage(
    img,
    sourceX,
    sourceY,
    tileWidth,
    tileHeight,
    0,
    0,
    tileWidth,
    tileHeight
  );

  // Convert to base64
  const dataUrl = canvas.toDataURL(mimeType);
  const base64Data = dataUrl.split('base64,')[1];

  // Calculate normalized bounding box
  const bbox = {
    x1: sourceX / imageWidth,
    y1: sourceY / imageHeight,
    x2: (sourceX + tileWidth) / imageWidth,
    y2: (sourceY + tileHeight) / imageHeight,
  };

  return {
    data: base64Data,
    mimeType,
    position,
    dimensions: {
      width: tileWidth,
      height: tileHeight,
    },
    bbox,
  };
}

/**
 * Load image from base64 data
 */
function loadImage(base64Data: string, mimeType: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = `data:${mimeType};base64,${base64Data}`;
  });
}

/**
 * Helper: Check if tiling is beneficial for the given image
 * Returns true if image resolution is high enough to benefit from tiling
 */
export function shouldTileImage(width: number, height: number): boolean {
  const TILING_THRESHOLD = 2048; // Minimum dimension to benefit from tiling
  return width >= TILING_THRESHOLD || height >= TILING_THRESHOLD;
}
