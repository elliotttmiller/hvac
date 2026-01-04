/**
 * Universal AI Client (Proxy Version)
 * Forwards all requests to the local backend server (Port 4000).
 * 
 * NOTE: This client does NOT need API keys. It relies on the server to hold secrets.
 */

// Interface definitions
export interface AIRequestOptions {
  model?: string;
  temperature?: number;
  maxRetries?: number;
  maxTokens?: number;
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
}

export interface AITextRequest {
  prompt: string;
  options?: AIRequestOptions;
}

export interface AIVisionRequest {
  imageData: string; // base64 encoded
  prompt: string;
  mimeType?: string;
  options?: AIRequestOptions;
}

/**
 * AI Client that communicates with our own backend proxy.
 */
export class AIClient {
  private proxyBaseUrl: string;

  constructor() {
    // We point to our local Node.js server
    this.proxyBaseUrl = 'http://localhost:4000'; 
    console.log(`[AI Client] Initialized in Proxy Mode. Forwarding to: ${this.proxyBaseUrl}`);
  }

  /**
   * Generate content with text-only input via proxy
   */
  async generateText(request: AITextRequest): Promise<string> {
    const response = await fetch(`${this.proxyBaseUrl}/api/ai/generateText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Proxy API error: ${errorData.details || response.statusText}`);
    }

    const data = await response.json();
    return data.text || '';
  }

  /**
   * Generate content with vision input (image + prompt) via proxy
   */
  async generateVision(request: AIVisionRequest): Promise<string> {
    // Normalize base64 string (remove data URI prefix if present)
    const normalizedImageData = request.imageData.includes('base64,')
      ? request.imageData.split('base64,')[1]
      : request.imageData;

    const response = await fetch(`${this.proxyBaseUrl}/api/ai/generateVision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...request,
        imageData: normalizedImageData,
      }),
    });

    if (!response.ok) {
      let errorDetails = response.statusText;
      try {
        const errorData = await response.json();
        errorDetails = errorData.details || errorData.error || response.statusText;
        console.error('AI Proxy Error Response:', errorData);
      } catch (e) {
        // If we can't parse error response, use status text
      }
      throw new Error(`AI Proxy Error: ${errorDetails}`);
    }

    const data = await response.json();
    const text = data.text || '';
    
    // Validate we got a non-empty response
    if (!text || text.trim().length === 0) {
      console.error('Empty response from AI proxy');
      throw new Error('Empty response from AI service');
    }
    
    return text;
  }
}

// Export singleton instance for use across the application
let clientInstance: AIClient | null = null;

export function getAIClient(): AIClient {
  if (!clientInstance) {
    clientInstance = new AIClient();
  }
  return clientInstance;
}