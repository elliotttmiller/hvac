/**
 * Gemini 2.5 Flash AI Client
 * Unified client for all Vision, OCR, and Reasoning tasks
 */

import { GoogleGenAI } from "@google/genai";
import { config } from "../../app/config";

export interface GeminiRequestOptions {
  model?: string;
  temperature?: number;
  maxRetries?: number;
  thinkingBudget?: number;
  systemInstruction?: string;
  responseMimeType?: string;
  responseSchema?: any;
}

export interface GeminiTextRequest {
  prompt: string;
  options?: GeminiRequestOptions;
}

export interface GeminiVisionRequest {
  imageData: string; // base64 encoded
  prompt: string;
  mimeType?: string;
  options?: GeminiRequestOptions;
}

export class GeminiClient {
  private client: GoogleGenAI;
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || config.gemini.apiKey;
    
    if (!this.apiKey) {
      throw new Error(
        'Gemini API key not configured. Set VITE_GEMINI_API_KEY environment variable.'
      );
    }

    this.client = new GoogleGenAI({ apiKey: this.apiKey });
  }

  /**
   * Generate content with text-only input
   */
  async generateText(request: GeminiTextRequest): Promise<string> {
    const { prompt, options = {} } = request;
    const model = options.model || config.gemini.model;

    return this.executeWithRetry(async () => {
      const response = await this.client.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: options.temperature,
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType,
          responseSchema: options.responseSchema,
          ...(options.thinkingBudget && {
            thinkingConfig: { thinkingBudget: options.thinkingBudget }
          }),
        },
      });

      return response.text || '';
    }, options.maxRetries);
  }

  /**
   * Generate content with vision input (image + prompt)
   */
  async generateVision(request: GeminiVisionRequest): Promise<string> {
    const { imageData, prompt, mimeType = 'image/png', options = {} } = request;
    const model = options.model || config.gemini.model;

    // Normalize base64 string (remove data URI prefix if present)
    const normalizedImageData = imageData.includes('base64,')
      ? imageData.split('base64,')[1]
      : imageData;

    return this.executeWithRetry(async () => {
      const response = await this.client.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                mimeType,
                data: normalizedImageData,
              },
            },
            {
              text: prompt,
            },
          ],
        },
        config: {
          temperature: options.temperature,
          systemInstruction: options.systemInstruction,
          responseMimeType: options.responseMimeType,
          responseSchema: options.responseSchema,
          ...(options.thinkingBudget && {
            thinkingConfig: { thinkingBudget: options.thinkingBudget }
          }),
        },
      });

      return response.text || '';
    }, options.maxRetries);
  }

  /**
   * Execute a function with exponential backoff retry logic
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries?: number
  ): Promise<T> {
    const retries = maxRetries ?? config.rateLimit.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Check if it's a rate limit error (429)
        const isRateLimit = 
          error?.status === 429 || 
          error?.message?.includes('429') ||
          error?.message?.toLowerCase().includes('rate limit');

        if (!isRateLimit || attempt === retries) {
          // Not a rate limit error, or we've exhausted retries
          throw error;
        }

        // Calculate exponential backoff delay
        const baseDelay = config.rateLimit.retryDelayMs;
        const delay = config.rateLimit.exponentialBackoff
          ? baseDelay * Math.pow(2, attempt)
          : baseDelay;

        console.warn(
          `Rate limit hit. Retrying in ${delay}ms (attempt ${attempt + 1}/${retries})...`
        );

        await this.sleep(delay);
      }
    }

    throw lastError || new Error('Unknown error during retry');
  }

  /**
   * Sleep utility for retry delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
let clientInstance: GeminiClient | null = null;

export function getGeminiClient(): GeminiClient {
  if (!clientInstance) {
    clientInstance = new GeminiClient();
  }
  return clientInstance;
}
