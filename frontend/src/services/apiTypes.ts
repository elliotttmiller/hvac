/**
 * TypeScript types matching backend Pydantic models for strict type safety.
 * These interfaces mirror the API contracts defined in backend/models.py
 */

export type ComplianceStatus = 'COMPLIANT' | 'NON_COMPLIANT' | 'REVIEW_REQUIRED';

export type PDFQuality = 'fast' | 'balanced' | 'detailed' | 'ultra';

export interface AnalyzeRequest {
  file_base64: string;
  mime_type: string;
  max_pages?: number;
  quality?: PDFQuality;
}

export interface UploadRequest {
  file_base64: string;
  filename?: string;
}

export interface ProjectInfo {
  project_name: string;
  climate_zone: string;
  design_temp_heating: number;
  design_temp_cooling: number;
  building_type?: 'residential' | 'commercial';
  total_conditioned_area_sqft?: number;
}

export interface LoadBreakdownItem {
  component: string;
  area_sqft: number;
  u_value: number;
  load_btu: number;
}

export interface LoadCalculations {
  total_heating_load: number;
  total_cooling_load: number;
  calculation_method: string;
  heating_load_breakdown?: LoadBreakdownItem[];
  cooling_load_breakdown?: LoadBreakdownItem[];
}

export interface EquipmentAnalysis {
  proposed_heating_capacity: number;
  heating_oversize_percent: number;
  status: ComplianceStatus;
  proposed_cooling_capacity?: number;
  cooling_oversize_percent?: number;
  heating_status?: 'COMPLIANT' | 'NON_COMPLIANT';
  cooling_status?: 'COMPLIANT' | 'NON_COMPLIANT';
  equipment_model?: string | null;
}

export interface ComplianceViolation {
  rule: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  recommendation?: string;
}

export interface ComplianceStatusReport {
  violations: ComplianceViolation[];
  overall_status: ComplianceStatus;
}

export interface AdditionalObservations {
  duct_sizing_notes?: string | null;
  insulation_notes?: string | null;
  safety_concerns?: string | null;
  assumptions_made?: string[];
}

export interface BackendAnalysisReport {
  project_info: ProjectInfo;
  load_calculations: LoadCalculations;
  equipment_analysis: EquipmentAnalysis;
  compliance_status: ComplianceStatusReport;
  request_id?: string;
  additional_observations?: AdditionalObservations;
  reasoning?: string;
}

export interface AnalyzeResponse {
  report: string; // JSON string of BackendAnalysisReport
  request_id: string;
  pages_processed: number;
  processing_time_seconds?: number;
}

export interface UploadResponse {
  upload_id: string;
  filename: string;
  pages: string[];
  total_pages: number;
  request_id: string;
}

export interface ModelStatus {
  model: string;
  loaded: boolean;
  matched_model?: string;
  available: string[];
  error?: string;
}

export interface ErrorResponse {
  error: string;
  detail?: string;
  request_id?: string;
}
