// Minimal Gemini API client skeleton (TypeScript)
// Place your real API key in an environment variable (e.g. GEMINI_API_KEY) or pass it to the constructor.

export type GeminiResponse = {
  text?: string;
  json?: any;
};

/**
 * GeminiClient - lightweight helper for calling a Gemini-style image analysis endpoint.
 * - Works in browser or Node (when fetch/FormData are available).
 * - Accepts Blob | ArrayBuffer | Uint8Array for image input to avoid Node Buffer/browser Blob mismatches.
 */
export class GeminiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string, baseUrl = 'https://api.gemini.example') {
    // Prefer explicit apiKey, then common env locations on globalThis, then fall back to empty.
    const gw = globalThis as any;
    this.apiKey =
      apiKey ||
      gw?.GEMINI_API_KEY ||
      gw?.VITE_GEMINI_API_KEY ||
      (gw?.process && gw.process.env && gw.process.env.GEMINI_API_KEY) ||
      '';

    this.baseUrl = baseUrl;
    if (!this.apiKey) {
      throw new Error('Gemini API key not set. Pass apiKey to GeminiClient or set GEMINI_API_KEY/VITE_GEMINI_API_KEY in env.');
    }
  }

  async analyzeImage(image: Blob | ArrayBuffer | Uint8Array, prompt: string): Promise<GeminiResponse> {
    // Normalize input to Blob so FormData.append works in browsers.
    let imageBlob: Blob;
    if (image instanceof Blob) {
      imageBlob = image;
    } else if (image instanceof Uint8Array) {
      // Make a copy of the bytes to ensure we pass a plain ArrayBufferView (not SharedArrayBuffer)
      const copy = image.slice();
      imageBlob = new Blob([copy]);
    } else {
      // ArrayBuffer
      imageBlob = new Blob([image]);
    }

    const form = new FormData();
    form.append('image', imageBlob, 'image.png');
    form.append('prompt', prompt);

    const res = await fetch(`${this.baseUrl}/v1/analyze/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: form,
    });

    if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
    const body = await res.json();
    return { text: body?.text, json: body };
  }

  // TODO: add analyzeText(), streaming helpers, retry/backoff, and token accounting.
}
