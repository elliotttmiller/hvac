/// <reference types="node" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_AI_API_KEY?: string;
  readonly VITE_GEMINI_API_KEY?: string;
  readonly VITE_AI_MODEL?: string;
  readonly VITE_AI_REQUEST_TIMEOUT_MS?: string;
  readonly VITE_FEATURE_CACHE?: string;
  // add other VITE_ variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
