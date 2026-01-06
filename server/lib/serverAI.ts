// Centralized server-side AI factory
// Returns a singleton { ai, apiKey } where ai is an initialized GoogleGenAI client.
// Implements robust timeout injection for long-running "Zero-HITL" inference tasks.

// 1. Environment Guard: Prevent client-side execution
if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
  throw new Error("serverAI.ts is a server-side only module. Do not import it in React components.");
}

// 2. Global Polyfill (Fixes ReferenceError in some Vite/Edge runtimes)
if (typeof global === 'undefined' && typeof globalThis !== 'undefined') {
  // @ts-ignore
  globalThis.global = globalThis;
}

// Use require to avoid bundling this into client-side builds
/* eslint-disable @typescript-eslint/no-var-requires */
const DEFAULT_TIMEOUT_MS = 300000; // 5 minutes default safety

async function createServerAI() {
  // Dynamic require to prevent build-time resolution in frontend bundles
  const { GoogleGenAI } = require('@google/genai');
  const { serverConfig } = require('./serverConfig');

  const apiKey = process.env.API_KEY || process.env.VITE_AI_API_KEY || process.env.GEMINI_API_KEY || '';
  
  if (!apiKey) {
    console.warn("⚠️ serverAI: No API Key found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // 3. Robust Timeout Injection
  // We wrap the generateContent method to enforce our serverConfig timeout
  try {
    const configTimeout = serverConfig?.REQUEST_TIMEOUT_MS;
    const envTimeout = parseInt(process.env.VITE_AI_REQUEST_TIMEOUT_MS || '', 10);
    // Prioritize ServerConfig > Env > Default
    const REQUEST_TIMEOUT_MS = Number.isFinite(configTimeout) ? configTimeout : (Number.isFinite(envTimeout) ? envTimeout : DEFAULT_TIMEOUT_MS);

    // Check if we are using the new SDK structure (ai.models.generateContent)
    if (ai && ai.models && typeof ai.models.generateContent === 'function') {
      const _origGenerate = ai.models.generateContent.bind(ai.models);
      
      // @ts-ignore - Runtime wrapper to inject timeout options
      ai.models.generateContent = function (params, options) {
        options = options || {};
        // Only override if not explicitly provided in the call
        const mergedOptions = Object.assign({ timeout: REQUEST_TIMEOUT_MS }, options);
        return _origGenerate(params, mergedOptions);
      };
      
      console.log(`✅ serverAI: Timeout wrapper injected (${REQUEST_TIMEOUT_MS}ms)`);
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn('serverAI: Failed to wrap generateContent with timeout. Long inferences may abort.', msg);
  }

  return { ai, apiKey };
}

// 4. Singleton Pattern using globalThis (Cross-platform safe)
const globalKey = '__HVAC_SERVER_AI__';

export async function getServerAI() {
  const _global = globalThis as any;
  
  if (!_global[globalKey]) {
    _global[globalKey] = createServerAI();
  }
  
  return _global[globalKey];
}

export default getServerAI;