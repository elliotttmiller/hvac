/**
 * Application Configuration
 * Central configuration file for environment variables and app settings
 */

export const config = {
  // API Keys
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    model: 'gemini-2.5-flash',
  },

  // Feature Flags
  features: {
    semanticCache: true,
    fileProcessing: true,
    complianceEngine: false, // Future
    safetyEngine: false, // Future
    pricingEngine: false, // Future
  },

  // Rate Limiting
  rateLimit: {
    maxRetries: 3,
    retryDelayMs: 1000,
    exponentialBackoff: true,
  },

  // File Processing
  fileProcessing: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    supportedFormats: ['pdf', 'png', 'jpg', 'jpeg', 'dwg'],
    pdfDpi: 300,
  },
} as const;

export type AppConfig = typeof config;
