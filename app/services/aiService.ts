import { DetectedComponent } from "../types";
import { HVAC_KNOWLEDGE_BASE } from "../data/hvacKnowledgeBase";
import { getComponentPricing } from "./pricingService";
import { aiCache } from "./semanticCache";

// Single source of truth for the active model
export const ACTIVE_MODEL_NAME = 'gemini-3-flash-preview';

// Server proxy configuration
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

export type ExtractionResult = {
  detectedComponents: DetectedComponent[];
  meta?: {
    processingTime: number;
    timestamp: string;
  };
};

export type AnalysisReportResult = {
  analysisReport: string;
  meta?: {
    processingTime: number;
    timestamp: string;
  };
};

/**
 * Enhanced error handling with retry logic
 */
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  maxRetries = 2
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        return response;
      }
      
      // Retry on server errors (5xx) or rate limit (429)
      if (!response.ok && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.warn(`Request failed (${response.status}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      return response;
    } catch (error) {
      lastError = error as Error;
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        console.warn(`Request error, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError || new Error('Request failed after retries');
}

/**
 * STAGE 1: Forensic Component Extraction
 * Now uses secure server-side proxy instead of direct API calls
 */
export const stage1Extraction = async (
  base64Image: string, 
  mimeType: string
): Promise<ExtractionResult> => {
  // 1. CACHE CHECK (Client-side for instant results)
  const cacheKey = aiCache.generateKey('STAGE_1_EXTRACTION', base64Image);
  const cachedResult = aiCache.get<ExtractionResult>(cacheKey);
  
  if (cachedResult) {
      console.log('%c[CLIENT CACHE HIT] Stage 1 - Instant result', 'color: #10b981; font-weight: bold;');
      return cachedResult;
  }

  // 2. API EXECUTION via Server Proxy
  try {
    const response = await fetchWithRetry(`${SERVER_URL}/api/ai/extract`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        mimeType
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const result = await response.json();
    
    // 3. CACHE SET
    aiCache.set(cacheKey, result);
    
    console.log(`[Stage 1] Success: ${result.detectedComponents?.length || 0} components detected`);
    if (result.meta?.processingTime) {
      console.log(`[Stage 1] Processing time: ${result.meta.processingTime}ms`);
    }

    return result;
  } catch (error) {
    console.error('[Stage 1] Error:', error);
    throw new Error(`Component extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * STAGE 2: AI Interpretation & Forensic Report
 * Now uses secure server-side proxy instead of direct API calls
 */
export const stage2Analysis = async (
  base64Image: string, 
  mimeType: string,
  detectedComponents: DetectedComponent[]
): Promise<AnalysisReportResult> => {
  // 1. CACHE CHECK (Semantic: Image + Component Context)
  const cacheKey = aiCache.generateKey('STAGE_2_ANALYSIS', base64Image, detectedComponents);
  const cachedResult = aiCache.get<AnalysisReportResult>(cacheKey);

  if (cachedResult) {
      console.log('%c[CLIENT CACHE HIT] Stage 2 - Instant result', 'color: #10b981; font-weight: bold;');
      return cachedResult;
  }

  // 2. API EXECUTION via Server Proxy
  try {
    const response = await fetchWithRetry(`${SERVER_URL}/api/ai/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        mimeType,
        detectedComponents: detectedComponents.map(c => ({ 
          id: c.id, 
          name: c.name, 
          type: c.type 
        }))
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Server error: ${response.status}`);
    }

    const result = await response.json();
    
    // 3. CACHE SET
    aiCache.set(cacheKey, result);
    
    console.log(`[Stage 2] Success: Report generated`);
    if (result.meta?.processingTime) {
      console.log(`[Stage 2] Processing time: ${result.meta.processingTime}ms`);
    }

    return result;
  } catch (error) {
    console.error('[Stage 2] Error:', error);
    throw new Error(`Analysis report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};