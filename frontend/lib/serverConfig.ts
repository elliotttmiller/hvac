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

// Use a safe environment accessor so this module can run both in Node (server)
// and in the browser (Vite uses import.meta.env). Prefer process.env when
// available, otherwise fall back to import.meta.env or an empty object.
let env: Record<string, any> = {};
if (typeof process !== 'undefined' && (process as any).env) {
  env = (process as any).env;
} else {
  try {
    env = (import.meta as any).env || {};
  } catch (e) {
    env = {};
  }
}

export const serverConfig = {
  // Model defaults
  MODEL_DEFAULT: env.VITE_AI_MODEL || 'gemini-2.5-flash',

  // Timeouts
  REQUEST_TIMEOUT_MS: parseIntOr(env.VITE_AI_REQUEST_TIMEOUT_MS, 60000),

  // Thinking budgets (tokens)
  MAX_THINKING_BUDGET: parseIntOr(env.VITE_MAX_THINKING_BUDGET, 16000),
  MIN_THINKING_BUDGET: parseIntOr(env.VITE_MIN_THINKING_BUDGET, 4000),
  MAX_THINKING_BUDGET_CAP: parseIntOr(env.VITE_MAX_THINKING_BUDGET_CAP, 24000),
  DEFAULT_THINKING_BUDGET: parseIntOr(env.VITE_DEFAULT_THINKING_BUDGET, 16000),

  // Token / output limits
  DEFAULT_MAX_OUTPUT_TOKENS: parseIntOr(env.VITE_DEFAULT_MAX_OUTPUT_TOKENS, 16384),

  // Image handling
  IMAGE_SIZE_DIVISOR: parseIntOr(env.VITE_IMAGE_SIZE_DIVISOR, 2000),
  FILE_MAX_SIZE: parseIntOr(env.VITE_FILE_MAX_SIZE, 10 * 1024 * 1024),

  // Retry / backoff
  RATE_LIMIT_MAX_RETRIES: parseIntOr(env.VITE_RATE_LIMIT_MAX_RETRIES, 3),
  RATE_LIMIT_DELAY_MS: parseIntOr(env.VITE_RATE_LIMIT_DELAY_MS, 1000),
  RATE_LIMIT_EXPONENTIAL_BACKOFF: (env.VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF || 'true') === 'true',
  BACKOFF_MULTIPLIER: parseFloatOr(env.VITE_BACKOFF_MULTIPLIER, 2),

  // Thresholds
  HIGH_CONFIDENCE_THRESHOLD: parseFloatOr(env.VITE_HIGH_CONFIDENCE_THRESHOLD, 0.95),

  // Feature flags
  MOCK_MODE_ENABLED: (env.MOCK_MODE_ENABLED || 'false') === 'true',
  FEATURE_FILE_PROCESSING: (env.VITE_FEATURE_FILE_PROCESSING || 'true') === 'true',
};

export function calculateThinkingBudget(imageSize: number, hvacContext?: any): number {
  const { MAX_THINKING_BUDGET, MIN_THINKING_BUDGET, MAX_THINKING_BUDGET_CAP, IMAGE_SIZE_DIVISOR } = serverConfig;
  let baseBudget = Math.min(MAX_THINKING_BUDGET, Math.max(MIN_THINKING_BUDGET, Math.floor(imageSize / IMAGE_SIZE_DIVISOR)));

  const complexityMultipliers: Record<string, number> = {
    'data_center': 1.5,
    'hospital': 1.4,
    'laboratory': 1.6,
    'refrigeration': 1.3,
    'chilled_water': 1.2,
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

  return Math.min(MAX_THINKING_BUDGET_CAP, Math.floor(baseBudget * multiplier));
}

export function getServerConfig() {
  return serverConfig;
}

export default getServerConfig;
