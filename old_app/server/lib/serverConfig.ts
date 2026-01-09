// Centralized server configuration for AI/runtime settings
// Reads from environment variables and provides helper functions

const parseIntOr = (v: any, d: number) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

const parseFloatOr = (v: any, d: number) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : d;
};

export const serverConfig = {
  // Model defaults
  MODEL_DEFAULT: process.env.VITE_AI_MODEL || 'gemini-2.5-flash',
  
  // ZERO-HITL: Default to 0.0 for maximum determinism if not explicitly set
  // This ensures the AI acts like an engineer, not a creative writer.
  MODEL_TEMPERATURE: parseFloatOr(process.env.VITE_AI_TEMPERATURE, 0.0),

  // Timeouts - Default to 5 minutes to match .env
  REQUEST_TIMEOUT_MS: parseIntOr(process.env.VITE_AI_REQUEST_TIMEOUT_MS, 300000),

  // Thinking budgets (tokens) - Optimized for Deep Reasoning
  MAX_THINKING_BUDGET: parseIntOr(process.env.VITE_MAX_THINKING_BUDGET, 16000),
  MIN_THINKING_BUDGET: parseIntOr(process.env.VITE_MIN_THINKING_BUDGET, 4000),
  MAX_THINKING_BUDGET_CAP: parseIntOr(process.env.VITE_MAX_THINKING_BUDGET_CAP, 32000),
  DEFAULT_THINKING_BUDGET: parseIntOr(process.env.VITE_DEFAULT_THINKING_BUDGET, 16000),

  // Token / output limits - Unlocked Hardware Limit (65k)
  DEFAULT_MAX_OUTPUT_TOKENS: parseIntOr(process.env.VITE_DEFAULT_MAX_OUTPUT_TOKENS, 65536),

  // Image handling - High Fidelity for OCR (3072px)
  IMAGE_SIZE_DIVISOR: parseIntOr(process.env.VITE_IMAGE_SIZE_DIVISOR, 3072),
  FILE_MAX_SIZE: parseIntOr(process.env.VITE_FILE_MAX_SIZE, 20 * 1024 * 1024), // 20MB

  // Retry / backoff - Aggressive Reliability
  RATE_LIMIT_MAX_RETRIES: parseIntOr(process.env.VITE_RATE_LIMIT_MAX_RETRIES, 3),
  RATE_LIMIT_DELAY_MS: parseIntOr(process.env.VITE_RATE_LIMIT_DELAY_MS, 2000),
  RATE_LIMIT_EXPONENTIAL_BACKOFF: (process.env.VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF || 'true') === 'true',
  BACKOFF_MULTIPLIER: parseFloatOr(process.env.VITE_BACKOFF_MULTIPLIER, 2),

  // Thresholds - Calibrated for High Recall (Zero-HITL)
  HIGH_CONFIDENCE_THRESHOLD: parseFloatOr(process.env.VITE_HIGH_CONFIDENCE_THRESHOLD, 0.90),

  // Feature flags
  MOCK_MODE_ENABLED: (process.env.MOCK_MODE_ENABLED || 'false') === 'true',
  FEATURE_FILE_PROCESSING: (process.env.VITE_FEATURE_FILE_PROCESSING || 'true') === 'true',
};

export function calculateThinkingBudget(imageSize: number, hvacContext?: any): number {
  const { MAX_THINKING_BUDGET, MIN_THINKING_BUDGET, MAX_THINKING_BUDGET_CAP, IMAGE_SIZE_DIVISOR } = serverConfig;
  
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

export function getServerConfig() {
  return serverConfig;
}

export default getServerConfig;