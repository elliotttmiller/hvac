/// <reference types="vite/client" />

// Project-specific environment variables used by the app
interface ImportMetaEnv {
  readonly VITE_AI_PROVIDER?: string;
  readonly VITE_AI_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_ANTHROPIC_API_KEY?: string;
  readonly VITE_AI_MODEL?: string;
  readonly VITE_AI_BASE_URL?: string;
  readonly VITE_AI_TEMPERATURE?: string;
  readonly VITE_AI_MAX_TOKENS?: string;
  readonly VITE_FEATURE_CACHE?: string;
  readonly VITE_FEATURE_FILE_PROCESSING?: string;
  readonly VITE_FEATURE_COMPLIANCE?: string;
  readonly VITE_FEATURE_SAFETY?: string;
  readonly VITE_FEATURE_PRICING?: string;
  readonly VITE_RATE_LIMIT_MAX_RETRIES?: string;
  readonly VITE_RATE_LIMIT_DELAY_MS?: string;
  readonly VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF?: string;
  readonly VITE_FILE_MAX_SIZE?: string;
  readonly VITE_FILE_SUPPORTED_FORMATS?: string;
  readonly VITE_FILE_PDF_DPI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
