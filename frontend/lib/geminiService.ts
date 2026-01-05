// This module is used by both server and client. Avoid importing Node-only SDKs
// into the browser bundle. When running in a browser environment we proxy calls
// to the server via fetch to keep secrets and server-side SDKs out of the client.

import { GeminiModel } from '@/features/document-analysis/types';

// Detect browser environment
const isBrowser = typeof window !== 'undefined' && typeof window.fetch === 'function';

// Server-side implementation (lazy require to avoid bundling in client)
const serverImpl = async () => {
  // Use dynamic import/require so bundlers don't include server-only deps in the client
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { GoogleGenAI } = require('@google/genai');
  const { COPILOT_SYSTEM_INSTRUCTION } = require('../features/document-analysis/prompts/visual/detect-pid');
  const { analyzePID } = require('./gemini-prompt-engine/pid-analysis');

  // Accept multiple env variable names for backwards compatibility with .env files
  const apiKey = process.env.API_KEY || process.env.VITE_AI_API_KEY || process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({ apiKey });

  return { ai, apiKey, analyzePID, COPILOT_SYSTEM_INSTRUCTION } as const;
};

// Browser-safe proxy implementations
export const generateThinkingResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  if (isBrowser) {
    // Call backend API endpoint (server must implement /api/generate-thinking)
    const res = await fetch('/api/generate-thinking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, history })
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    return data.text || data.result || '';
  }

  // Server path
  const { ai, apiKey, COPILOT_SYSTEM_INSTRUCTION } = await serverImpl();
  if (!apiKey) throw new Error('API Key is missing');

  const context = history.map(h => `${h.role}: ${h.parts[0].text}`).join('\n');
  const fullPrompt = `${context}\nuser: ${prompt}\nmodel:`;

  const response = await ai.models.generateContent({
    model: GeminiModel.FLASH, // OPTIMIZED: Use Flash for free tier compatibility (Pro has no free access as of 2026)
    contents: fullPrompt,
    config: {
      thinkingConfig: { thinkingBudget: 16000 },
      systemInstruction: COPILOT_SYSTEM_INSTRUCTION
    }
  });

  return response.text || 'No response generated.';
};

export const analyzeBlueprintImage = async (base64Image: string): Promise<string> => {
  if (isBrowser) {
    const res = await fetch('/api/analyze-blueprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    return JSON.stringify(data);
  }

  const { analyzePID } = await serverImpl();
  try {
    const result = await analyzePID(base64Image);
    return JSON.stringify(result);
  } catch (error) {
    console.error('Analysis Error:', error);
    return JSON.stringify({ error: 'Analysis failed', details: error instanceof Error ? error.message : error });
  }
};

export const generateInventoryFromAnalysis = async (analysisText: string): Promise<string> => {
  if (isBrowser) {
    const res = await fetch('/api/generate-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysis: analysisText })
    });
    if (!res.ok) return '[]';
    const data = await res.json();
    return JSON.stringify(data || []);
  }

  const { ai, apiKey } = await serverImpl();

  // Legacy support: if the analysisText is already JSON (from new method), just return it formatted
  try {
    const data = JSON.parse(analysisText);
    if (data.entities) {
      const inventory = data.entities.reduce((acc: any[], curr: any) => {
        const existing = acc.find(i => i.name === curr.description);
        if (existing) { existing.count++; } else { acc.push({ name: curr.description || curr.label, count: 1 }); }
        return acc;
      }, []);
      return JSON.stringify(inventory);
    }
  } catch (e) {
    // Fallback for plain text
  }

  if (!apiKey) return '[]';

  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH,
      contents: `Extract inventory from: "${analysisText}". Format: [{"name": "Name", "count": 1}]`,
      config: { responseMimeType: 'application/json' }
    });
    return response.text || '[]';
  } catch (e) {
    return '[]';
  }
};
