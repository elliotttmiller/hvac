import { DetectedComponent, AnalysisReport } from '../types';

const BACKEND_URL = "http://localhost:8000/api/analyze";

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

export const analyzeDocument = async (
  fileBase64: string,
  mimeType: string,
  onLog: (msg: string) => void
): Promise<AnalysisReport> => {
  onLog?.("🚀 Sending to local backend for vision+reasoning...");

  const resp = await fetch(BACKEND_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file_base64: fileBase64, mime_type: mimeType })
  });

  if (!resp.ok) throw new Error(`Backend error: ${resp.status} ${resp.statusText}`);
  const data = await resp.json();

  let reportObj: any = null;
  if (typeof data.report === 'string') {
    try { reportObj = JSON.parse(data.report); } catch (e) { reportObj = { content: data.report }; }
  } else {
    reportObj = data.report;
  }

  const final: AnalysisReport = {
    id: `rep-${Math.random().toString(36).slice(2,8)}`,
    blueprintId: '',
    blueprintName: '',
    date: new Date().toLocaleString(),
    content: typeof reportObj === 'string' ? reportObj : (reportObj.content || JSON.stringify(reportObj, null, 2)),
    author: 'Local Model'
  };

  return final;
};

// --- STAGE 1: Lightweight visual extraction (stub)
export const stage1Extraction = async (
  base64Image: string,
  mimeType: string,
  modelId: string
): Promise<ExtractionResult> => {
  // For now, return an empty list. The heavy visual parsing happens in the backend model pipeline.
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

  // Fallback: model not available locally — return an explanatory message
  return { analysisReport: `Model ${modelId} not configured for local inference. Please select a local model (Qwen/Llama) in settings.` };
};

// --- STAGE 3: MULTI-PAGE SYNTHESIS
export const synthesizeMultiPageReport = async (
  pageReports: string[],
  filename: string,
  modelId: string = AI_MODELS.PRO.id
): Promise<AnalysisReportResult> => {
  const combined = `DOCUMENT: ${filename}\n\n` + pageReports.map((r, i) => `--- PAGE ${i+1} ---\n${r}\n`).join('\n');
  return { analysisReport: combined };
};

// Grounded pricing stub (pricing will be handled server-side later)
export const performGroundedPricing = async (_component?: DetectedComponent | any): Promise<GroundedPriceResult> => {
  // Pricing will be implemented server-side; this is a local stub to keep the UI working.
  return { cost: 0, currency: 'USD', sourceDescription: 'stub', sources: [], lastUpdated: new Date().toISOString() } as GroundedPriceResult;
};