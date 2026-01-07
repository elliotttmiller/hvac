/**
 * Client Configuration for Browser Environment
 * Uses import.meta.env for Vite compatibility
 * 
 * This file should ONLY be imported by frontend code.
 * For server-side configuration, use server/lib/serverConfig.ts
 */

const parseIntOr = (v: any, d: number) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

const parseFloatOr = (v: any, d: number) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : d;
};

export const clientConfig = {
  // Model defaults
  MODEL_DEFAULT: import.meta.env.VITE_AI_MODEL || 'gemini-2.5-flash',
  
  // ZERO-HITL: Default to 0.0 for maximum determinism if not explicitly set
  // This ensures the AI acts like an engineer, not a creative writer.
  MODEL_TEMPERATURE: parseFloatOr(import.meta.env.VITE_AI_TEMPERATURE, 0.0),

  // Timeouts - Default to 5 minutes
  REQUEST_TIMEOUT_MS: parseIntOr(import.meta.env.VITE_AI_REQUEST_TIMEOUT_MS, 300000),

  // Thinking budgets (tokens) - Optimized for Deep Reasoning
  MAX_THINKING_BUDGET: parseIntOr(import.meta.env.VITE_MAX_THINKING_BUDGET, 16000),
  MIN_THINKING_BUDGET: parseIntOr(import.meta.env.VITE_MIN_THINKING_BUDGET, 4000),
  MAX_THINKING_BUDGET_CAP: parseIntOr(import.meta.env.VITE_MAX_THINKING_BUDGET_CAP, 32000),
  DEFAULT_THINKING_BUDGET: parseIntOr(import.meta.env.VITE_DEFAULT_THINKING_BUDGET, 16000),

  // Token / output limits - Unlocked Hardware Limit (65k)
  DEFAULT_MAX_OUTPUT_TOKENS: parseIntOr(import.meta.env.VITE_DEFAULT_MAX_OUTPUT_TOKENS, 65536),

  // Image handling - High Fidelity for OCR (3072px)
  IMAGE_SIZE_DIVISOR: parseIntOr(import.meta.env.VITE_IMAGE_SIZE_DIVISOR, 3072),
  FILE_MAX_SIZE: parseIntOr(import.meta.env.VITE_FILE_MAX_SIZE, 20 * 1024 * 1024), // 20MB

  // Retry / backoff - Aggressive Reliability
  RATE_LIMIT_MAX_RETRIES: parseIntOr(import.meta.env.VITE_RATE_LIMIT_MAX_RETRIES, 3),
  RATE_LIMIT_DELAY_MS: parseIntOr(import.meta.env.VITE_RATE_LIMIT_DELAY_MS, 2000),
  RATE_LIMIT_EXPONENTIAL_BACKOFF: (import.meta.env.VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF || 'true') === 'true',
  BACKOFF_MULTIPLIER: parseFloatOr(import.meta.env.VITE_BACKOFF_MULTIPLIER, 2),

  // Thresholds - Calibrated for High Recall (Zero-HITL)
  HIGH_CONFIDENCE_THRESHOLD: parseFloatOr(import.meta.env.VITE_HIGH_CONFIDENCE_THRESHOLD, 0.90),

  // Visual Processing - Selective Tiling Configuration
  // Only tile images larger than this dimension to avoid wasting API calls on small PDFs
  TILING_THRESHOLD_PX: parseIntOr(import.meta.env.VITE_TILING_THRESHOLD_PX, 2000),
  
  // Cache Management - LocalStorage Limits
  // Conservative limit to stay under browser 5-10MB quota
  CACHE_MAX_SIZE_BYTES: parseIntOr(import.meta.env.VITE_CACHE_MAX_SIZE_BYTES, 4 * 1024 * 1024), // 4MB

  // Feature flags
  MOCK_MODE_ENABLED: (import.meta.env.MOCK_MODE_ENABLED || 'false') === 'true',
  FEATURE_FILE_PROCESSING: (import.meta.env.VITE_FEATURE_FILE_PROCESSING || 'true') === 'true',
};

export function calculateThinkingBudget(imageSize: number, hvacContext?: any): number {
  const { MAX_THINKING_BUDGET, MIN_THINKING_BUDGET, MAX_THINKING_BUDGET_CAP, IMAGE_SIZE_DIVISOR } = clientConfig;
  
  // Base budget scales with image density
  let baseBudget = Math.min(MAX_THINKING_BUDGET, Math.max(MIN_THINKING_BUDGET, Math.floor(imageSize / IMAGE_SIZE_DIVISOR)));

  const complexityMultipliers: Record<string, number> = {
    'data_center': 1.5,
    'hospital': 1.5,
    'laboratory': 1.6,
    'refrigeration': 1.3,
    'chilled_water': 1.2,
    'controls': 1.4
  };

  let multiplier = 1.0;
  if (hvacContext) {
    if (hvacContext.facilityType && complexityMultipliers[hvacContext.facilityType]) {
      multiplier = Math.max(multiplier, complexityMultipliers[hvacContext.facilityType]);
    }
    if (hvacContext.systemType && complexityMultipliers[hvacContext.systemType]) {
      multiplier = Math.max(multiplier, complexityMultipliers[hvacContext.systemType]);
    }
  }

  // Cap the budget to prevent runaway costs/latency
  return Math.min(MAX_THINKING_BUDGET_CAP, Math.floor(baseBudget * multiplier));
}

export function getClientConfig() {
  return clientConfig;
}

export default getClientConfig;
