/**
 * File Processing - MIME Type Validation
 * Validates uploaded files against supported formats
 */

export const SUPPORTED_MIME_TYPES = {
  // Images
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg'],
  
  // Documents
  'application/pdf': ['pdf'],
  
  // CAD Files
  'application/acad': ['dwg'],
  'application/x-acad': ['dwg'],
  'application/x-dwg': ['dwg'],
  'image/vnd.dwg': ['dwg'],
  'image/x-dwg': ['dwg'],
} as const;

export type SupportedMimeType = keyof typeof SUPPORTED_MIME_TYPES;

export interface FileValidationResult {
  valid: boolean;
  mimeType?: string;
  extension?: string;
  error?: string;
}

/**
 * Validate if a file is supported
 */
export function validateFile(file: File): FileValidationResult {
  const mimeType = file.type;
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  // Check by MIME type
  if (mimeType && mimeType in SUPPORTED_MIME_TYPES) {
    return {
      valid: true,
      mimeType,
      extension,
    };
  }

  // Check by extension as fallback
  // Object.entries loses literal typings; assert shape as [string, string[]][] for safe iteration
  // Object.entries loses literal/readonly typings; coerce through unknown then to a readonly tuple array
  for (const [mime, exts] of (Object.entries(SUPPORTED_MIME_TYPES) as unknown as [string, readonly string[]][])) {
    if ((exts as readonly string[]).includes(extension)) {
      return {
        valid: true,
        mimeType: mime,
        extension,
      };
    }
  }

  return {
    valid: false,
    error: `Unsupported file type. Supported formats: ${Object.values(SUPPORTED_MIME_TYPES).flat().join(', ')}`,
  };
}

/**
 * Get MIME type from file extension
 */
export function getMimeTypeFromExtension(extension: string): string | null {
  const ext = extension.toLowerCase();
  
  for (const [mime, exts] of (Object.entries(SUPPORTED_MIME_TYPES) as unknown as [string, readonly string[]][])) {
    if ((exts as readonly string[]).includes(ext)) {
      return mime;
    }
  }
  
  return null;
}

/**
 * Check if file is an image format
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

/**
 * Check if file is a PDF
 */
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Check if file is a CAD drawing
 */
export function isCadFile(file: File): boolean {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension === 'dwg';
}
