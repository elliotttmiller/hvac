/**
 * Universal AI Client
 * Supports multiple AI providers: Gemini, OpenAI, Anthropic, or custom endpoints
 */

import { GoogleGenAI } from "@google/genai";
import { config, AIProvider } from "../../app/config";

export interface AIRequestOptions {
  model?: string;
  temperature?: number;
  maxRetries?: number;
  maxTokens?: number;
  thinkingBudget?: number;
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
 * Universal AI Client
 * Automatically uses the configured provider (Gemini, OpenAI, Anthropic, or custom)
 */
export class AIClient {
  private provider: AIProvider;
  private apiKey: string;
  private model: string;
  private client: any;

  constructor(apiKey?: string, model?: string) {
    this.provider = config.ai.provider;
    this.apiKey = apiKey || config.ai.apiKey;
    this.model = model || config.ai.model;
    
    if (!this.apiKey) {
      throw new Error(
        `AI API key not configured. Set VITE_AI_API_KEY or VITE_${this.provider.toUpperCase()}_API_KEY environment variable.`
      );
    }

    // Initialize provider-specific client
    this.client = this.initializeClient();
  }

  private initializeClient() {
    switch (this.provider) {
      case 'gemini':
        return new GoogleGenAI({ apiKey: this.apiKey });
      
      case 'openai':
        // OpenAI client would be initialized here
        // For now, throw a descriptive error
        throw new Error(
          'OpenAI provider not yet implemented. Use Gemini or implement OpenAI adapter.'
        );
      
      case 'anthropic':
        // Anthropic client would be initialized here
        throw new Error(
          'Anthropic provider not yet implemented. Use Gemini or implement Anthropic adapter.'
        );
      
      case 'custom':
        // Custom client would use fetch with baseUrl
        if (!config.ai.baseUrl) {
          throw new Error('VITE_AI_BASE_URL required for custom provider');
        }
        return { baseUrl: config.ai.baseUrl };
      
      default:
        throw new Error(`Unknown AI provider: ${this.provider}`);
    }
  }

  /**
   * Generate content with text-only input
   */
  async generateText(request: AITextRequest): Promise<string> {
    const { prompt, options = {} } = request;
    const model = options.model || this.model;

    return this.executeWithRetry(async () => {
      switch (this.provider) {
        case 'gemini':
          return this.generateTextGemini(prompt, model, options);
        
        case 'openai':
          return this.generateTextOpenAI(prompt, model, options);
        
        case 'anthropic':
          return this.generateTextAnthropic(prompt, model, options);
        
        case 'custom':
          return this.generateTextCustom(prompt, model, options);
        
        default:
          throw new Error(`Provider ${this.provider} not supported`);
      }
    }, options.maxRetries);
  }

  /**
   * Generate content with vision input (image + prompt)
   */
  async generateVision(request: AIVisionRequest): Promise<string> {
    const { imageData, prompt, mimeType = 'image/png', options = {} } = request;
    const model = options.model || this.model;

    // Normalize base64 string (remove data URI prefix if present)
    const normalizedImageData = imageData.includes('base64,')
      ? imageData.split('base64,')[1]
      : imageData;

    return this.executeWithRetry(async () => {
      switch (this.provider) {
        case 'gemini':
          return this.generateVisionGemini(normalizedImageData, prompt, mimeType, model, options);
        
        case 'openai':
          return this.generateVisionOpenAI(normalizedImageData, prompt, mimeType, model, options);
        
        case 'anthropic':
          return this.generateVisionAnthropic(normalizedImageData, prompt, mimeType, model, options);
        
        case 'custom':
          return this.generateVisionCustom(normalizedImageData, prompt, mimeType, model, options);
        
        default:
          throw new Error(`Provider ${this.provider} not supported`);
      }
    }, options.maxRetries);
  }

  // ============================================================================
  // Provider-specific implementations
  // ============================================================================

  private async generateTextGemini(
    prompt: string,
    model: string,
    options: AIRequestOptions
  ): Promise<string> {
    const response = await this.client.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: options.temperature ?? config.ai.temperature,
        systemInstruction: options.systemInstruction,
        responseMimeType: options.responseMimeType,
        responseSchema: options.responseSchema,
        ...(options.thinkingBudget && {
          thinkingConfig: { thinkingBudget: options.thinkingBudget }
        }),
      },
    });

    return response.text || '';
  }

  private async generateVisionGemini(
    imageData: string,
    prompt: string,
    mimeType: string,
    model: string,
    options: AIRequestOptions
  ): Promise<string> {
    const response = await this.client.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: imageData,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        temperature: options.temperature ?? config.ai.temperature,
        systemInstruction: options.systemInstruction,
        responseMimeType: options.responseMimeType,
        responseSchema: options.responseSchema,
        ...(options.thinkingBudget && {
          thinkingConfig: { thinkingBudget: options.thinkingBudget }
        }),
      },
    });

    return response.text || '';
  }

  private async generateTextOpenAI(
    prompt: string,
    model: string,
    options: AIRequestOptions
  ): Promise<string> {
    // Placeholder for OpenAI implementation
    throw new Error('OpenAI provider not yet implemented');
  }

  private async generateVisionOpenAI(
    imageData: string,
    prompt: string,
    mimeType: string,
    model: string,
    options: AIRequestOptions
  ): Promise<string> {
    // Placeholder for OpenAI vision implementation
    throw new Error('OpenAI vision provider not yet implemented');
  }

  private async generateTextAnthropic(
    prompt: string,
    model: string,
    options: AIRequestOptions
  ): Promise<string> {
    // Placeholder for Anthropic implementation
    throw new Error('Anthropic provider not yet implemented');
  }

  private async generateVisionAnthropic(
    imageData: string,
    prompt: string,
    mimeType: string,
    model: string,
    options: AIRequestOptions
  ): Promise<string> {
    // Placeholder for Anthropic vision implementation
    throw new Error('Anthropic vision provider not yet implemented');
  }

  private async generateTextCustom(
    prompt: string,
    model: string,
    options: AIRequestOptions
  ): Promise<string> {
    // Custom provider using fetch
    const response = await fetch(`${config.ai.baseUrl}/v1/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        temperature: options.temperature ?? config.ai.temperature,
        max_tokens: options.maxTokens ?? config.ai.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || data.content || '';
  }

  private async generateVisionCustom(
    imageData: string,
    prompt: string,
    mimeType: string,
    model: string,
    options: AIRequestOptions
  ): Promise<string> {
    // Custom provider vision using fetch
    const response = await fetch(`${config.ai.baseUrl}/v1/vision`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        prompt,
        image: imageData,
        mime_type: mimeType,
        temperature: options.temperature ?? config.ai.temperature,
        max_tokens: options.maxTokens ?? config.ai.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.text || data.content || '';
  }

  // ============================================================================
  // Utility methods
  // ============================================================================

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

  /**
   * Get current provider info
   */
  getProviderInfo() {
    return {
      provider: this.provider,
      model: this.model,
      hasApiKey: !!this.apiKey,
    };
  }
}

// Export singleton instance
let clientInstance: AIClient | null = null;

export function getAIClient(): AIClient {
  if (!clientInstance) {
    clientInstance = new AIClient();
  }
  return clientInstance;
}

// Legacy support - will be removed in future versions
export const GeminiClient = AIClient;
export const getGeminiClient = getAIClient;
