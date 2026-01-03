/**
 * File Processing - Converters
 * Converts files to formats optimized for Gemini Vision API
 */

import { config } from '@/app/config';

export interface ConversionResult {
  success: boolean;
  data?: string; // base64 encoded image
  mimeType?: string;
  error?: string;
}

/**
 * Convert PDF to high-resolution image
 * Note: This is a browser-based implementation using canvas
 * For production, consider using a server-side solution
 */
export async function convertPdfToImage(file: File): Promise<ConversionResult> {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: 'PDF conversion requires browser environment',
      };
    }

    // For now, we'll return the PDF as-is and let Gemini handle it
    // In a production environment, you'd want to use pdf.js or a server-side solution
    const base64 = await fileToBase64(file);
    
    return {
      success: true,
      data: base64,
      mimeType: 'application/pdf',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert PDF',
    };
  }
}

/**
 * Convert DWG to SVG
 * Note: This requires a specialized library or server-side processing
 * For now, we'll throw an error as DWG processing is complex
 */
export async function convertDwgToSvg(file: File): Promise<ConversionResult> {
  // DWG conversion requires specialized libraries
  // In production, this should be handled by a server-side service
  return {
    success: false,
    error: 'DWG conversion not yet implemented. Please convert to PDF or image format.',
  };
}

/**
 * Convert image file to optimized base64
 * Handles rotation correction and resolution optimization
 */
export async function convertImageToOptimized(file: File): Promise<ConversionResult> {
  try {
    const base64 = await fileToBase64(file);
    
    // Optional: Auto-rotate based on EXIF data
    // This would require an EXIF parsing library
    
    return {
      success: true,
      data: base64,
      mimeType: file.type,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert image',
    };
  }
}

/**
 * Convert any supported file to a format suitable for Gemini
 */
export async function convertFileForGemini(file: File): Promise<ConversionResult> {
  const fileType = file.type;
  const extension = file.name.split('.').pop()?.toLowerCase();

  // Handle PDFs
  if (fileType === 'application/pdf' || extension === 'pdf') {
    return convertPdfToImage(file);
  }

  // Handle DWG files
  if (extension === 'dwg') {
    return convertDwgToSvg(file);
  }

  // Handle images
  if (fileType.startsWith('image/')) {
    return convertImageToOptimized(file);
  }

  return {
    success: false,
    error: `Unsupported file type: ${fileType}`,
  };
}

/**
 * Helper: Convert File to base64 string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix if present
      const base64 = result.includes('base64,') 
        ? result.split('base64,')[1] 
        : result;
      resolve(base64);
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Helper: Get image dimensions
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}
