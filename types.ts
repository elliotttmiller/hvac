export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ANALYZER = 'ANALYZER',
  COPILOT = 'COPILOT'
}

export interface HvacEntity {
  label: string; 
  tag?: string;  
  description?: string; 
  bbox: [number, number, number, number]; 
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
    reasoning?: string;
    parent_system?: string;
    mounting?: string;
    instrument_type?: string;
  }
}

export interface ValidationIssue {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  issue: string;
  recommendation?: string;
  component_id?: string;
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
  FLASH = 'gemini-2.5-flash',
  PRO = 'gemini-2.5-pro',
  VISION = 'gemini-2.5-flash'
}