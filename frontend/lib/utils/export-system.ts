/**
 * Export System for Analysis Results
 * Supports multiple formats: JSON, CSV, PDF annotations
 */

import type { VisualAnalysisResult, DetectedComponent, Connection } from '../../../features/document-analysis/types';

export type ExportFormat = 'json' | 'csv' | 'pdf' | 'excel';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeMetadata?: boolean;
  includeConnections?: boolean;
  includeQualityMetrics?: boolean;
  prettify?: boolean;
}

/**
 * Export analysis results in various formats
 */
export class ResultExporter {
  /**
   * Export to JSON
   */
  static toJSON(result: VisualAnalysisResult, options: { prettify?: boolean } = {}): string {
    if (options.prettify) {
      return JSON.stringify(result, null, 2);
    }
    return JSON.stringify(result);
  }
  
  /**
   * Export components to CSV
   */
  static toCSV(result: VisualAnalysisResult): string {
    const lines: string[] = [];
    
    // Header
    const headers = [
      'ID',
      'Type',
      'Label',
      'Confidence',
      'BBox_X1',
      'BBox_Y1',
      'BBox_X2',
      'BBox_Y2',
      'ISA_Function',
      'Description',
      'Location',
      'Detection_Quality'
    ];
    lines.push(headers.join(','));
    
    // Components
    for (const component of result.components) {
      const row = [
        this.escapeCSV(component.id),
        this.escapeCSV(component.type),
        this.escapeCSV(component.label),
        component.confidence.toFixed(3),
        component.bbox[0].toFixed(4),
        component.bbox[1].toFixed(4),
        component.bbox[2].toFixed(4),
        component.bbox[3].toFixed(4),
        this.escapeCSV(component.meta?.isa_function || ''),
        this.escapeCSV(component.meta?.description || ''),
        this.escapeCSV(component.meta?.location || ''),
        this.escapeCSV(component.meta?.detection_quality || '')
      ];
      lines.push(row.join(','));
    }
    
    return lines.join('\n');
  }
  
  /**
   * Export connections to CSV
   */
  static connectionsToCSV(result: VisualAnalysisResult): string {
    const lines: string[] = [];
    
    // Header
    const headers = [
      'Connection_ID',
      'From_ID',
      'From_Label',
      'To_ID',
      'To_Label',
      'Type',
      'Confidence'
    ];
    lines.push(headers.join(','));
    
    // Build component lookup
    const componentMap = new Map(result.components.map(c => [c.id, c]));
    
    // Connections
    for (const connection of result.connections) {
      const fromComp = componentMap.get(connection.from_id);
      const toComp = componentMap.get(connection.to_id);
      
      const row = [
        this.escapeCSV(connection.id),
        this.escapeCSV(connection.from_id),
        this.escapeCSV(fromComp?.label || ''),
        this.escapeCSV(connection.to_id),
        this.escapeCSV(toComp?.label || ''),
        this.escapeCSV(connection.type),
        connection.confidence?.toFixed(3) || ''
      ];
      lines.push(row.join(','));
    }
    
    return lines.join('\n');
  }
  
  /**
   * Export as Excel-compatible format
   */
  static toExcel(result: VisualAnalysisResult): {
    components: string;
    connections: string;
    metadata: string;
  } {
    return {
      components: this.toCSV(result),
      connections: this.connectionsToCSV(result),
      metadata: this.metadataToCSV(result)
    };
  }
  
  /**
   * Export metadata to CSV
   */
  static metadataToCSV(result: VisualAnalysisResult): string {
    const lines: string[] = [];
    lines.push('Key,Value');
    
    const metadata = result.metadata || {};
    for (const [key, value] of Object.entries(metadata)) {
      if (typeof value === 'object') {
        lines.push(`${this.escapeCSV(key)},${this.escapeCSV(JSON.stringify(value))}`);
      } else {
        lines.push(`${this.escapeCSV(key)},${this.escapeCSV(String(value))}`);
      }
    }
    
    return lines.join('\n');
  }
  
  /**
   * Create downloadable file
   * Browser-only: Creates and triggers download of a file
   */
  static download(content: string, filename: string, mimeType: string): void {
    // Check if running in browser environment
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      console.error('Download functionality requires browser environment');
      return;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  /**
   * Export and download results
   */
  static exportAndDownload(result: VisualAnalysisResult, options: ExportOptions): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const baseFilename = options.filename || `hvac-analysis-${timestamp}`;
    
    switch (options.format) {
      case 'json': {
        const content = this.toJSON(result, { prettify: options.prettify });
        this.download(content, `${baseFilename}.json`, 'application/json');
        break;
      }
      
      case 'csv': {
        // Export as ZIP with multiple CSVs (components, connections, metadata)
        const components = this.toCSV(result);
        const connections = this.connectionsToCSV(result);
        const metadata = this.metadataToCSV(result);
        
        // For now, download components CSV (proper ZIP implementation would require library)
        this.download(components, `${baseFilename}-components.csv`, 'text/csv');
        
        if (options.includeConnections) {
          this.download(connections, `${baseFilename}-connections.csv`, 'text/csv');
        }
        
        if (options.includeMetadata) {
          this.download(metadata, `${baseFilename}-metadata.csv`, 'text/csv');
        }
        break;
      }
      
      case 'excel': {
        const excel = this.toExcel(result);
        this.download(excel.components, `${baseFilename}-components.csv`, 'text/csv');
        this.download(excel.connections, `${baseFilename}-connections.csv`, 'text/csv');
        this.download(excel.metadata, `${baseFilename}-metadata.csv`, 'text/csv');
        break;
      }
      
      case 'pdf': {
        console.warn('PDF export not yet implemented');
        // TODO: Implement PDF generation with annotations
        break;
      }
    }
  }
  
  /**
   * Escape CSV field
   * Handles commas, quotes, newlines, and carriage returns
   */
  private static escapeCSV(field: string): string {
    // Trim leading/trailing whitespace for cleaner output
    const trimmed = field.trim();
    
    // Check if escaping is needed
    if (trimmed.includes(',') || trimmed.includes('"') || 
        trimmed.includes('\n') || trimmed.includes('\r')) {
      // Escape quotes by doubling them
      return `"${trimmed.replace(/"/g, '""')}"`;
    }
    return trimmed;
  }
}

/**
 * Generate summary report
 */
export function generateSummaryReport(result: VisualAnalysisResult): string {
  const lines: string[] = [];
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('           HVAC AI PLATFORM - ANALYSIS REPORT          ');
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('');
  
  // Metadata
  const metadata = result.metadata || {};
  lines.push('DOCUMENT INFORMATION:');
  lines.push(`  Document Type: ${metadata.document_type || 'Unknown'}`);
  lines.push(`  File Name: ${metadata.file_name || 'Unknown'}`);
  lines.push(`  Timestamp: ${metadata.timestamp ? new Date(metadata.timestamp).toLocaleString() : 'Unknown'}`);
  lines.push(`  Processing Time: ${metadata.processing_time_ms ? (metadata.processing_time_ms / 1000).toFixed(2) + 's' : 'Unknown'}`);
  lines.push('');
  
  // Components
  lines.push('COMPONENT ANALYSIS:');
  lines.push(`  Total Components: ${result.components.length}`);
  
  // Group by type
  const typeGroups = new Map<string, number>();
  for (const component of result.components) {
    typeGroups.set(component.type, (typeGroups.get(component.type) || 0) + 1);
  }
  
  lines.push('  Component Types:');
  for (const [type, count] of Array.from(typeGroups.entries()).sort((a, b) => b[1] - a[1])) {
    lines.push(`    - ${type}: ${count}`);
  }
  lines.push('');
  
  // ISA Functions
  const isaFunctions = result.components.filter(c => c.meta?.isa_function).length;
  lines.push(`  ISA Functions Detected: ${isaFunctions} (${(isaFunctions / result.components.length * 100).toFixed(1)}%)`);
  lines.push('');
  
  // Connections
  lines.push('CONNECTION ANALYSIS:');
  lines.push(`  Total Connections: ${result.connections.length}`);
  
  // Group by connection type
  const connTypeGroups = new Map<string, number>();
  for (const connection of result.connections) {
    connTypeGroups.set(connection.type, (connTypeGroups.get(connection.type) || 0) + 1);
  }
  
  if (connTypeGroups.size > 0) {
    lines.push('  Connection Types:');
    for (const [type, count] of Array.from(connTypeGroups.entries()).sort((a, b) => b[1] - a[1])) {
      lines.push(`    - ${type}: ${count}`);
    }
  }
  lines.push('');
  
  // Quality Metrics
  if (metadata.quality_metrics) {
    const qm = metadata.quality_metrics;
    lines.push('QUALITY METRICS:');
    lines.push(`  Overall Score: ${(qm.overall_score * 100).toFixed(1)}%`);
    lines.push(`  Detection Quality: ${(qm.detection_quality * 100).toFixed(1)}%`);
    lines.push(`  ISA Completeness: ${(qm.isa_completeness * 100).toFixed(1)}%`);
    lines.push(`  Connection Coverage: ${(qm.connection_coverage * 100).toFixed(1)}%`);
    lines.push(`  Average Confidence: ${(qm.confidence_avg * 100).toFixed(1)}%`);
    lines.push('');
  }
  
  // Control Loops
  if (metadata.control_loops && metadata.control_loops.length > 0) {
    lines.push('CONTROL LOOPS:');
    lines.push(`  Total Loops Detected: ${metadata.control_loops.length}`);
    for (const loop of metadata.control_loops.slice(0, 10)) {
      lines.push(`    - ${loop.name} (${loop.components.length} components)`);
    }
    if (metadata.control_loops.length > 10) {
      lines.push(`    ... and ${metadata.control_loops.length - 10} more`);
    }
    lines.push('');
  }
  
  // Validation Issues
  if (metadata.validation_issues && metadata.validation_issues.length > 0) {
    lines.push('VALIDATION ISSUES:');
    const errors = metadata.validation_issues.filter((i: any) => i.severity === 'error').length;
    const warnings = metadata.validation_issues.filter((i: any) => i.severity === 'warning').length;
    lines.push(`  Errors: ${errors}`);
    lines.push(`  Warnings: ${warnings}`);
    
    if (errors > 0) {
      lines.push('  Critical Issues:');
      for (const issue of metadata.validation_issues.filter((i: any) => i.severity === 'error').slice(0, 5)) {
        lines.push(`    - ${issue.issue}`);
      }
    }
    lines.push('');
  }
  
  lines.push('═══════════════════════════════════════════════════════');
  lines.push('           Generated by HVAC AI Platform               ');
  lines.push('═══════════════════════════════════════════════════════');
  
  return lines.join('\n');
}

/**
 * Copy results to clipboard
 * Browser-only: Uses Clipboard API to copy text
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Check if Clipboard API is available
  if (typeof navigator === 'undefined' || !navigator.clipboard?.writeText) {
    console.warn('Clipboard API not available in this environment');
    return false;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
