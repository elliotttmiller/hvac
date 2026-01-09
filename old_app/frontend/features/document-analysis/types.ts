/**
 * Document Analysis - Universal Type Definitions
 * This file is the SINGLE SOURCE OF TRUTH for all data structures in the application.
 */

import { Type } from '@google/genai';

// ============================================================================
// DOCUMENT CLASSIFICATION
// ============================================================================

// ------------------------------------------------------------------
// Shared app-level types (migrated from repo root `types.ts`)
// ------------------------------------------------------------------
export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ANALYZER = 'ANALYZER',
  COPILOT = 'COPILOT',
  PROJECTS = 'PROJECTS'
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

export type DocumentType = 'BLUEPRINT' | 'SCHEMATIC' | 'SPEC_SHEET' | 'SCHEDULE' | 'UNKNOWN';

// Valid document types that can be returned by the classifier (excludes UNKNOWN)
export const VALID_CLASSIFICATION_TYPES: ReadonlyArray<Exclude<DocumentType, 'UNKNOWN'>> = [
  'BLUEPRINT',
  'SCHEMATIC', 
  'SPEC_SHEET',
  'SCHEDULE'
] as const;

export interface ClassificationResult {
  type: DocumentType;
  confidence: number;
  reasoning?: string;
}

// ============================================================================
// COMPONENT DETECTION (Visual Pipeline)
// ============================================================================

export interface DetectedComponent {
  id: string;   // The primary identifier (e.g. "PDI-1401" or UUID)
  type: string; // 'valve', 'instrument', 'duct', 'vav', etc.
  label: string; // The OCR text extracted (e.g., "PDI-1401")
  
  // Canonical normalized bbox format used across the system:
  // [xmin, ymin, xmax, ymax] with values in the 0-1 range (floating point)
  // Ingest pipelines should normalize backend outputs to this format and
  // store the original backend output in meta.raw_backend_output for auditing.
  bbox: [number, number, number, number]; 
  
  confidence: number;
  rotation?: number; // degrees
  meta?: {
    tag?: string;
    description?: string;
    reasoning?: string;
    parent_system?: string;
    mounting?: string;
    instrument_type?: string;
    source_tile?: string;
    // Optional transform history for traceability
    transform_history?: Array<{
      timestamp: string;
      operation: string;
      original_size?: [number, number];
      new_size?: [number, number];
      maintained_aspect_ratio?: boolean;
      padding?: { top?: number; right?: number; bottom?: number; left?: number };
      details?: any;
    }>;
    [key: string]: any;
  };
}

export interface Connection {
  id: string;
  from_id: string;
  to_id: string;
  type: 'supply' | 'return' | 'electric' | 'pneumatic' | 'signal' | 'process' | 
        'control_signal' | 'electric_signal' | 'process_flow' | 'hydraulic' | 'unknown';
  confidence?: number;
}

export interface VisualAnalysisResult {
  components: DetectedComponent[];
  connections: Connection[];
  metadata?: {
    total_components: number;
    total_connections: number;
    // Original high-resolution image dimensions (pixels) when available
    image_dimensions?: { width: number; height: number };
    // Optionally store original image size field for clarity
    original_image_dimensions?: { width: number; height: number };
    process_log?: string; // AI reasoning trace for user transparency
    parse_error?: string; // Capture parsing errors
    error?: string; // Add error property for additional error details
    // Enhancement metadata
    enhancement?: any;
    quality_metrics?: any;
    label_generation?: {
      generated_count: number;
      conflicts_resolved: number;
    };
    control_loops?: any[];
    validation_issues?: any[];
  };
}

// ============================================================================
// TEXT EXTRACTION (Textual Pipeline)
// ============================================================================

export interface TextBlock {
  id: string;
  text: string;
  bbox: [number, number, number, number]; // [xmin, ymin, xmax, ymax]
  confidence?: number;
  rotation?: number;
  font_size?: number;
}

export interface TableData {
  id: string;
  headers: string[];
  rows: string[][];
  bbox?: [number, number, number, number];
}

export interface TextualAnalysisResult {
  text_blocks: TextBlock[];
  tables: TableData[];
  metadata?: {
    total_text_blocks: number;
    total_tables: number;
    word_count?: number;
  };
}

// ============================================================================
// TABULAR DATA (Schedule Pipeline)
// ============================================================================

export interface EquipmentItem {
  id: string;
  tag: string;
  type: string;
  model?: string;
  cfm?: number;
  voltage?: string;
  notes?: string;
  [key: string]: any; // Allow flexible attributes
}

export interface TabularAnalysisResult {
  equipment: EquipmentItem[];
  metadata?: {
    total_items: number;
  };
}

// ============================================================================
// VALIDATION & DISCREPANCIES (Logic Pipeline)
// ============================================================================

export type IssueSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export interface ValidationIssue {
  id: string;
  severity: IssueSeverity;
  issue: string;
  recommendation?: string;
  component_id?: string;
  location?: string;
}

export interface CorrelationResult {
  discrepancies: ValidationIssue[];
  matched_count: number;
  unmatched_blueprint: string[];
  unmatched_schedule: string[];
}

// ============================================================================
// FINAL ANALYSIS REPORT (NARRATIVE-FOCUSED)
// ============================================================================

/**
 * Final Analysis Report - Narrative Engineering Assessment
 * This structure emphasizes human-readable text over metrics and inventories.
 * The output should read like a professional handover document.
 */
export interface FinalAnalysisReport {
  // Report identification
  report_title: string;
  
  // High-level system overview (2-4 sentences)
  executive_summary: string;
  
  // Detailed process flow narrative (paragraph format)
  system_workflow_narrative: string;
  
  // Control strategy explanation (paragraph format)
  control_logic_analysis: string;
  
  // Technical specifications summary (paragraph format)
  specifications_and_details: string;
  
  // Optional: Key equipment with their roles
  critical_equipment?: Array<{
    tag: string;
    role: string;
  }>;
  
  // Optional: Engineering observations and recommendations
  engineering_observations?: string;
}

// ============================================================================
// UNIVERSAL DOCUMENT RESULT
// ============================================================================

export interface UniversalDocumentResult {
  // Metadata
  document_id: string;
  document_type: DocumentType;
  file_name: string;
  timestamp: number;
  
  // Classification
  classification: ClassificationResult;
  
  // Analysis Results
  visual?: VisualAnalysisResult;
  textual?: TextualAnalysisResult;
  tabular?: TabularAnalysisResult;
  
  // Validation
  validation_issues?: ValidationIssue[];
  
  // Executive Summary
  executive_summary?: string;
  
  // Final Analysis Report
  final_analysis?: FinalAnalysisReport;
  
  // Processing metadata
  processing_time_ms?: number;
  cache_hit?: boolean;
}

// ============================================================================
// GEMINI RESPONSE SCHEMAS (for structured output)
// ============================================================================

export const CLASSIFICATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    type: {
      type: Type.STRING,
      enum: ['BLUEPRINT', 'SCHEMATIC', 'SPEC_SHEET', 'SCHEDULE'],
      description: 'The document type classification. SCHEMATIC includes P&IDs.',
    },
    confidence: {
      type: Type.NUMBER,
      description: 'Confidence score between 0 and 1',
    },
    reasoning: {
      type: Type.STRING,
      description: 'Explanation of why this classification was chosen',
    },
  },
  required: ['type', 'confidence'],
};

export const VISUAL_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    components: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { 
            type: Type.STRING,
            description: "Unique ID. MUST be the text tag if visible (e.g. 'PDI-1401')."
          },
          type: { 
            type: Type.STRING,
            description: "Classification (e.g. 'valve', 'instrument', 'duct')."
          },
          label: { 
            type: Type.STRING,
            description: "The exact text extracted via OCR (e.g. 'PDI 1401'). MANDATORY. NEVER use 'unknown'."
          },
          bbox: {
            type: Type.ARRAY,
            description: "Normalized coordinates [xmin, ymin, xmax, ymax]. MANDATORY.",
            items: { type: Type.NUMBER },
          },
          confidence: { type: Type.NUMBER },
          rotation: { type: Type.NUMBER, description: "Integer degrees (0, 90, 180)." },
          meta: {
            type: Type.OBJECT,
            properties: {
              tag: { type: Type.STRING },
              description: { type: Type.STRING },
              reasoning: { type: Type.STRING },
            },
          },
        },
        required: ['id', 'type', 'label', 'bbox', 'confidence'],
      },
    },
    connections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          from_id: { type: Type.STRING },
          to_id: { type: Type.STRING },
          type: {
            type: Type.STRING,
            enum: ['supply', 'return', 'electric', 'pneumatic', 'signal', 'process'],
          },
        },
        required: ['from_id', 'to_id', 'type'],
      },
    },
    process_log: {
      type: Type.STRING,
      description: 'A technical summary of the system detected.',
    },
  },
  required: ['components', 'connections'],
};

export const TEXTUAL_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    text_blocks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          text: { type: Type.STRING },
          bbox: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
          },
          confidence: { type: Type.NUMBER },
          rotation: { type: Type.NUMBER },
        },
        required: ['id', 'text', 'bbox'],
      },
    },
    tables: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          headers: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          rows: {
            type: Type.ARRAY,
            items: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
        },
        required: ['id', 'headers', 'rows'],
      },
    },
  },
  required: ['text_blocks', 'tables'],
};