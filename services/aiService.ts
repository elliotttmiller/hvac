import { DetectedComponent, AnalysisReport } from '../types';
import { 
  AnalyzeRequest, 
  AnalyzeResponse, 
  ErrorResponse,
  BackendAnalysisReport,
  PDFQuality 
} from './apiTypes';

const BACKEND_URL = "http://localhost:8000/api/analyze";
const REQUEST_TIMEOUT = 120000; // 120 seconds for local inference

// Model registry used in the UI
export const AI_MODELS = {
  FLASH: { id: 'flash', label: 'Flash (Local Speed)', description: 'Low-latency local vision', type: 'speed' },
  PRO: { id: 'pro', label: 'Pro (Remote)', description: 'Hosted reasoning engine', type: 'reasoning' },
  LOCAL_OLLAMA: { id: 'llama3.1', label: 'Local Ollama (Llama 3.1)', description: 'Local Ollama engine', type: 'local' },
  QWEN_VL: { id: 'qwen2.5-vl', label: 'Qwen 2.5 VL (Local)', description: 'Local vision+language (Qwen)', type: 'local' }
};

export type ExtractionResult = { detectedComponents: DetectedComponent[] };
export type AnalysisReportResult = { analysisReport: string };
export type GroundedPriceResult = {
  cost: number;
  currency: string;
  sourceDescription: string;
  sources: { title: string; uri: string }[];
  lastUpdated: string;
  foundName?: string;
  foundSku?: string;
  manufacturer?: string;
  specs?: Record<string, string>;
};

/**
 * Custom error class for API errors with detailed information
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public detail?: string,
    public requestId?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Parse and validate error response from backend
 */
function parseErrorResponse(data: unknown): ErrorResponse {
  if (typeof data === 'object' && data !== null && 'error' in data) {
    const err = data as ErrorResponse;
    return {
      error: err.error || 'Unknown error',
      detail: err.detail,
      request_id: err.request_id
    };
  }
  return { error: 'Unknown error occurred' };
}

/**
 * Main document analysis function with improved error handling and timeout support
 */
export const analyzeDocument = async (
  fileBase64: string,
  mimeType: string,
  onLog: (msg: string) => void,
  quality: PDFQuality = 'balanced'
): Promise<AnalysisReport> => {
  onLog?.(`🚀 Sending to local backend for vision+reasoning (quality: ${quality})...`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const requestBody: AnalyzeRequest = {
      file_base64: fileBase64,
      mime_type: mimeType,
      max_pages: 20,
      quality
    };

    const resp = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!resp.ok) {
      // Try to parse error response
      let errorData: ErrorResponse;
      try {
        errorData = await resp.json() as ErrorResponse;
      } catch {
        errorData = { error: `HTTP ${resp.status}: ${resp.statusText}` };
      }
      
      throw new APIError(
        errorData.error,
        resp.status,
        errorData.detail,
        errorData.request_id
      );
    }

    const data = await resp.json() as AnalyzeResponse;
    
    onLog?.(`✅ Analysis complete (Request ID: ${data.request_id})`);
    if (data.processing_time_seconds) {
      onLog?.(`⏱️ Processing time: ${data.processing_time_seconds.toFixed(1)}s`);
    }
    onLog?.(`📄 Pages processed: ${data.pages_processed}`);

    // Parse the report JSON string
    let reportObj: BackendAnalysisReport | { content?: string; raw_content?: string; parse_error?: boolean };
    
    if (typeof data.report === 'string') {
      try {
        reportObj = JSON.parse(data.report);
      } catch (e) {
        onLog?.("⚠️ Warning: Could not parse report JSON, using raw content");
        reportObj = { content: data.report };
      }
    } else {
      reportObj = data.report as unknown as BackendAnalysisReport;
    }

    // Check if report parsing failed on backend
    if ('parse_error' in reportObj && reportObj.parse_error) {
      onLog?.("⚠️ Warning: Backend reported JSON parsing issues");
    }

    // Format the final report
    const final: AnalysisReport = {
      id: `rep-${Math.random().toString(36).slice(2, 8)}`,
      blueprintId: '',
      blueprintName: '',
      date: new Date().toLocaleString(),
      content: formatReportContent(reportObj),
      author: 'Local Model'
    };

    return final;

  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof APIError) {
      onLog?.(`❌ Error: ${error.message}`);
      if (error.detail) {
        onLog?.(`Details: ${error.detail}`);
      }
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        const msg = `Request timeout after ${REQUEST_TIMEOUT / 1000}s. Local inference may take longer for large documents.`;
        onLog?.(`❌ ${msg}`);
        throw new APIError(msg, 408);
      }
      onLog?.(`❌ Network error: ${error.message}`);
      throw new APIError(error.message);
    }
    
    onLog?.("❌ Unknown error occurred");
    throw new APIError("Unknown error occurred");
  }
};

/**
 * Format report content from various possible response structures
 */
function formatReportContent(reportObj: unknown): string {
  if (typeof reportObj === 'string') {
    return reportObj;
  }
  
  if (typeof reportObj === 'object' && reportObj !== null) {
    // Check for content field
    if ('content' in reportObj && typeof (reportObj as { content?: unknown }).content === 'string') {
      return (reportObj as { content: string }).content;
    }
    
    // Check for raw_content (from failed parse)
    if ('raw_content' in reportObj && typeof (reportObj as { raw_content?: unknown }).raw_content === 'string') {
      return (reportObj as { raw_content: string }).raw_content;
    }
    
    // Check if it's a properly structured BackendAnalysisReport
    if ('project_info' in reportObj && 'load_calculations' in reportObj) {
      return JSON.stringify(reportObj, null, 2);
    }
    
    // Fallback to JSON stringify
    return JSON.stringify(reportObj, null, 2);
  }
  
  return String(reportObj);
}

// --- STAGE 1: Lightweight visual extraction (stub)
export const stage1Extraction = async (
  base64Image: string,
  mimeType: string,
  modelId: string
): Promise<ExtractionResult> => {
  // Heavy visual parsing happens in the backend model pipeline
  return { detectedComponents: [] };
};

// --- STAGE 2: AI INTERPRETATION
export const stage2Analysis = async (
  base64Image: string,
  mimeType: string,
  detectedComponents: DetectedComponent[],
  modelId: string = AI_MODELS.FLASH.id
): Promise<AnalysisReportResult> => {
  const localIds = ['llama3.1', 'qwen2.5-vl', 'qwen2-vl', 'ollama-llama3.1', AI_MODELS.LOCAL_OLLAMA.id];
  if (localIds.includes(modelId.toLowerCase())) {
    const report = await analyzeDocument(base64Image, mimeType, (m) => console.debug('[backend]', m));
    return { analysisReport: report.content };
  }

  // Fallback: model not available locally
  return { 
    analysisReport: `Model ${modelId} not configured for local inference. Please select a local model (Qwen/Llama) in settings.` 
  };
};

// --- STAGE 3: MULTI-PAGE SYNTHESIS
export const synthesizeMultiPageReport = async (
  pageReports: string[],
  filename: string,
  modelId: string = AI_MODELS.PRO.id
): Promise<AnalysisReportResult> => {
  // For development: simple concatenation is sufficient for single-user
  // Production note: For very large documents, consider streaming/chunking
  const combined = `DOCUMENT: ${filename}\n\n` + pageReports.map((r, i) => `--- PAGE ${i + 1} ---\n${r}\n`).join('\n');
  return { analysisReport: combined };
};

// Grounded pricing stub (pricing handled server-side)
export const performGroundedPricing = async (_component?: DetectedComponent | unknown): Promise<GroundedPriceResult> => {
  // Pricing will be implemented server-side; this is a local stub
  return { 
    cost: 0, 
    currency: 'USD', 
    sourceDescription: 'stub', 
    sources: [], 
    lastUpdated: new Date().toISOString() 
  };
};