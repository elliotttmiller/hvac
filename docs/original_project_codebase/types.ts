export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ANALYZER = 'ANALYZER',
  COPILOT = 'COPILOT',
  KNOWLEDGE_GRAPH = 'KNOWLEDGE_GRAPH'
}

// Matches inference_graph.py HvacEntity / Symbol structure
export interface HvacEntity {
  label: string; // e.g., "instrument_discrete_field"
  tag?: string;  // e.g., "TIC-101"
  description?: string; // e.g., "Temperature Indicator Controller"
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] in pixels
  confidence?: number;
  attributes?: {
    type: string;
    text: string;
    confidence: number;
  }[];
}

export interface RayServeResponse {
  entities: HvacEntity[];
  quote: any | null;
  metadata: {
    raw_count: number;
    entity_count: number;
  };
}

export interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  x: number; // Percentage
  y: number; // Percentage
  width: number; // Percentage
  height: number; // Percentage
  rotation?: number;
  type?: 'component' | 'text' | 'symbol';
  meta?: {
    tag?: string;
    description?: string;
  }
}

export interface AnalysisResult {
  fileId: string;
  fileName: string;
  timestamp: number;
  detectedObjects: DetectedObject[];
  complianceScore: number;
  issues: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  timestamp: number;
}

export enum GeminiModel {
  FLASH = 'gemini-3-flash-preview',
  PRO = 'gemini-3-pro-preview',
  VISION = 'gemini-2.5-flash-image'
}
