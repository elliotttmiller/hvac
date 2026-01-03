/**
 * Application Configuration
 * Central configuration file for environment variables and app settings
 * 
 * Supports multiple AI providers - configure via environment variables
 */

export type AIProvider = 'gemini' | 'openai' | 'anthropic' | 'custom';

/**
 * Get configuration from environment variables with fallbacks
 */
export const config = {
  // AI Provider Configuration
  ai: {
    // Provider selection: 'gemini', 'openai', 'anthropic', 'custom'
    provider: (import.meta.env.VITE_AI_PROVIDER || 'gemini') as AIProvider,
    
    // API Keys for different providers
    apiKey: import.meta.env.VITE_AI_API_KEY || 
            import.meta.env.VITE_GEMINI_API_KEY || 
            import.meta.env.VITE_OPENAI_API_KEY || 
            import.meta.env.VITE_ANTHROPIC_API_KEY || 
            '',
    
    // Model selection (provider-specific)
    model: import.meta.env.VITE_AI_MODEL || 'gemini-2.5-flash',
    
    // Vision-specific model for complex P&ID analysis (optional override)
    // Legacy code used gemini-3-pro-preview for superior reasoning on P&IDs
    visionModel: import.meta.env.VITE_AI_VISION_MODEL || import.meta.env.VITE_AI_MODEL || 'gemini-2.5-flash',
    
    // Base URL for custom providers
    baseUrl: import.meta.env.VITE_AI_BASE_URL || '',
    
    // Default temperature for inference
    // Note: Vision analysis intentionally omits temperature to match legacy behavior
    temperature: parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.2'),
    
    // Max tokens for response
    maxTokens: parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '4096'),
  },

  // Feature Flags
  features: {
    semanticCache: import.meta.env.VITE_FEATURE_CACHE !== 'false',
    fileProcessing: import.meta.env.VITE_FEATURE_FILE_PROCESSING !== 'false',
    complianceEngine: import.meta.env.VITE_FEATURE_COMPLIANCE === 'true',
    safetyEngine: import.meta.env.VITE_FEATURE_SAFETY === 'true',
    pricingEngine: import.meta.env.VITE_FEATURE_PRICING === 'true',
  },

  // Rate Limiting
  rateLimit: {
    maxRetries: parseInt(import.meta.env.VITE_RATE_LIMIT_MAX_RETRIES || '3'),
    retryDelayMs: parseInt(import.meta.env.VITE_RATE_LIMIT_DELAY_MS || '1000'),
    exponentialBackoff: import.meta.env.VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF !== 'false',
  },

  // File Processing
  fileProcessing: {
    maxFileSize: parseInt(import.meta.env.VITE_FILE_MAX_SIZE || String(10 * 1024 * 1024)), // Default 10MB
    supportedFormats: (import.meta.env.VITE_FILE_SUPPORTED_FORMATS || 'pdf,png,jpg,jpeg,dwg').split(','),
    pdfDpi: parseInt(import.meta.env.VITE_FILE_PDF_DPI || '300'),
  },

  // Legacy support - will be removed in future versions
  get gemini() {
    console.warn('config.gemini is deprecated. Use config.ai instead.');
    return {
      apiKey: this.ai.apiKey,
      model: this.ai.model,
    };
  },
} as const;

export type AppConfig = typeof config;
