/**
 * Document Analysis - Type Definitions and Zod Schemas
 * Universal Document Model for all document types
 */

import { Type } from '@google/genai';

// ============================================================================
// DOCUMENT CLASSIFICATION
// ============================================================================

export type DocumentType = 'BLUEPRINT' | 'SPEC_SHEET' | 'SCHEDULE' | 'UNKNOWN';

export interface ClassificationResult {
  type: DocumentType;
  confidence: number;
  reasoning?: string;
}

// ============================================================================
// COMPONENT DETECTION (Visual Pipeline)
// ============================================================================

export interface DetectedComponent {
  id: string;
  type: string; // 'duct', 'vav', 'ahu', 'damper', 'diffuser', etc.
  label?: string; // Tag or identifier (e.g., "VAV-101")
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] normalized 0-1
  confidence: number;
  rotation?: number; // degrees
  meta?: {
    tag?: string;
    description?: string;
    reasoning?: string;
    parent_system?: string;
    mounting?: string;
    instrument_type?: string;
  };
}

export interface Connection {
  id: string;
  from_id: string;
  to_id: string;
  type: 'supply' | 'return' | 'electric' | 'pneumatic' | 'signal';
  confidence?: number;
}

export interface VisualAnalysisResult {
  components: DetectedComponent[];
  connections: Connection[];
  metadata?: {
    total_components: number;
    total_connections: number;
    image_dimensions?: { width: number; height: number };
  };
}

// ============================================================================
// TEXT EXTRACTION (Textual Pipeline)
// ============================================================================

export interface TextBlock {
  id: string;
  text: string;
  bbox: [number, number, number, number]; // normalized 0-1
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
  
  // Analysis Results (populated based on document type)
  visual?: VisualAnalysisResult;
  textual?: TextualAnalysisResult;
  tabular?: TabularAnalysisResult;
  
  // Validation
  validation_issues?: ValidationIssue[];
  
  // Executive Summary
  executive_summary?: string;
  
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
      enum: ['BLUEPRINT', 'SPEC_SHEET', 'SCHEDULE'],
      description: 'The document type classification',
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
          id: { type: Type.STRING },
          type: { type: Type.STRING },
          label: { type: Type.STRING },
          bbox: {
            type: Type.ARRAY,
            items: { type: Type.NUMBER },
          },
          confidence: { type: Type.NUMBER },
          rotation: { type: Type.NUMBER },
          meta: {
            type: Type.OBJECT,
            properties: {
              tag: { type: Type.STRING },
              description: { type: Type.STRING },
              reasoning: { type: Type.STRING },
            },
          },
        },
        required: ['id', 'type', 'bbox', 'confidence'],
      },
    },
    connections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          from_id: { type: Type.STRING },
          to_id: { type: Type.STRING },
          type: {
            type: Type.STRING,
            enum: ['supply', 'return', 'electric', 'pneumatic', 'signal'],
          },
        },
        required: ['id', 'from_id', 'to_id', 'type'],
      },
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
