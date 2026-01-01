/**
 * Shared utility functions
 */

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format timestamp to readable string
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Normalize bounding box to 0-1 range
 */
export function normalizeBbox(
  bbox: [number, number, number, number],
  imageWidth: number,
  imageHeight: number
): [number, number, number, number] {
  return [
    bbox[0] / imageWidth,
    bbox[1] / imageHeight,
    bbox[2] / imageWidth,
    bbox[3] / imageHeight,
  ];
}

/**
 * Denormalize bounding box from 0-1 range to pixel coordinates
 */
export function denormalizeBbox(
  bbox: [number, number, number, number],
  imageWidth: number,
  imageHeight: number
): [number, number, number, number] {
  return [
    bbox[0] * imageWidth,
    bbox[1] * imageHeight,
    bbox[2] * imageWidth,
    bbox[3] * imageHeight,
  ];
}
