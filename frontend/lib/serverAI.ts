// Centralized server-side AI factory
// Returns a singleton { ai, apiKey } where ai is an initialized GoogleGenAI
// client with runtime wrapper that injects VITE_AI_REQUEST_TIMEOUT_MS into
// all generateContent calls by default.

// Use require to avoid bundling this into client-side builds
/* eslint-disable @typescript-eslint/no-var-requires */
const DEFAULT_TIMEOUT_MS = 60000;

async function createServerAI() {
  const { GoogleGenAI } = require('@google/genai');
  // Centralized server config (balanced defaults)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { serverConfig } = require('./serverConfig');

  const apiKey = process.env.API_KEY || process.env.VITE_AI_API_KEY || process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });

  // Inject timeout into generateContent calls (server-side only)
  try {
    const envTimeout = parseInt(process.env.VITE_AI_REQUEST_TIMEOUT_MS || process.env.REQUEST_TIMEOUT_MS || String(DEFAULT_TIMEOUT_MS), 10);
    const REQUEST_TIMEOUT_MS = Number.isFinite(serverConfig?.REQUEST_TIMEOUT_MS) ? serverConfig.REQUEST_TIMEOUT_MS : envTimeout;

    if (ai && ai.models && typeof ai.models.generateContent === 'function') {
      const _origGenerate = ai.models.generateContent.bind(ai.models);
      // @ts-ignore runtime wrapper
      ai.models.generateContent = function (params, options) {
        options = options || {};
        const mergedOptions = Object.assign({ timeout: REQUEST_TIMEOUT_MS }, options);
        return _origGenerate(params, mergedOptions);
      };
    }
  } catch (e) {
    console.warn('serverAI: failed to wrap generateContent with timeout:', e && e.message ? e.message : e);
  }

  return { ai, apiKey };
}

// Cache singleton on global to survive module reloads in dev
const globalKey = '__HVAC_SERVER_AI__';
if (!(global as any)[globalKey]) {
  (global as any)[globalKey] = createServerAI();
}

export async function getServerAI() {
  return (global as any)[globalKey];
}

export default getServerAI;
