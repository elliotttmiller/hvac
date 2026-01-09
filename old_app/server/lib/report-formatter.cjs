/**
 * Professional Report Formatter
 * 
 * Transforms the final analysis JSON into a properly formatted, 
 * professional HVAC engineering report in markdown format.
 * Updated to include industry-standard HVAC report sections.
 */

/**
 * Formats the final analysis report into professional markdown
 * @param {Object} report - The analysis report object
 * @returns {string} - Professionally formatted markdown report
 */
function formatFinalAnalysisReport(report) {
  if (!report) return '';

  const sections = [];
  const line = (char = '=', length = 80) => char.repeat(length);

  // Title Section
  if (report.report_title) {
    sections.push(line('='));
    sections.push(report.report_title.toUpperCase());
    sections.push(line('='));
    sections.push('');
  }

  // Executive Summary
  if (report.executive_summary) {
    sections.push('## EXECUTIVE SUMMARY');
    sections.push('');
    sections.push(formatParagraph(report.executive_summary));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // Design Overview
  if (report.design_overview) {
    sections.push('## DESIGN OVERVIEW');
    sections.push('');
    sections.push(formatParagraph(report.design_overview));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // System Workflow Narrative
  if (report.system_workflow_narrative) {
    sections.push('## SYSTEM WORKFLOW');
    sections.push('');
    sections.push(formatParagraph(report.system_workflow_narrative));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // Ventilation Design
  if (report.ventilation_design) {
    sections.push('## VENTILATION DESIGN');
    sections.push('');
    sections.push(formatParagraph(report.ventilation_design));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // Control Logic Analysis
  if (report.control_logic_analysis) {
    sections.push('## CONTROL LOGIC ANALYSIS');
    sections.push('');
    sections.push(formatParagraph(report.control_logic_analysis));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // Equipment Selection & Specifications
  if (report.equipment_specifications) {
    sections.push('## EQUIPMENT SELECTION & SPECIFICATIONS');
    sections.push('');
    sections.push(formatParagraph(report.equipment_specifications));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // Heating & Cooling Loads
  if (report.heating_cooling_loads) {
    sections.push('## HEATING & COOLING LOADS');
    sections.push('');
    sections.push(formatParagraph(report.heating_cooling_loads));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // Standards Compliance
  if (report.standards_compliance) {
    sections.push('## STANDARDS COMPLIANCE');
    sections.push('');
    sections.push(formatParagraph(report.standards_compliance));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // Technical Specifications (legacy field for backwards compatibility)
  if (report.specifications_and_details && !report.equipment_specifications) {
    sections.push('## TECHNICAL SPECIFICATIONS');
    sections.push('');
    sections.push(formatParagraph(report.specifications_and_details));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // Critical Equipment
  if (report.critical_equipment && Array.isArray(report.critical_equipment) && report.critical_equipment.length > 0) {
    sections.push('## CRITICAL EQUIPMENT');
    sections.push('');
    
    // Create a formatted table for better visual presentation
    sections.push(line('-', 80));
    sections.push(formatTableRow(['#', 'Equipment Tag', 'Role & Description'], [3, 20, 57]));
    sections.push(line('=', 80));
    
    report.critical_equipment.forEach((equip, idx) => {
      const tag = equip.tag || equip.name || `Equipment ${idx + 1}`;
      const role = equip.role || 'No description available';
      sections.push(formatTableRow([`${idx + 1}`, tag, role], [3, 20, 57]));
      sections.push(line('-', 80));
    });
    
    sections.push('');
    sections.push(`Total Equipment: ${report.critical_equipment.length} items`);
    sections.push('');
  }

  // Engineering Observations
  if (report.engineering_observations) {
    sections.push('## ENGINEERING OBSERVATIONS');
    sections.push('');
    sections.push(formatParagraph(report.engineering_observations));
    sections.push('');
    sections.push(line('-'));
    sections.push('');
  }

  // Footer
  sections.push('');
  sections.push(line('='));
  sections.push(`Report Generated: ${new Date().toISOString().split('T')[0]}`);
  sections.push(line('='));

  return sections.join('\n');
}

/**
 * Formats a paragraph with proper line wrapping and spacing
 * @param {string} text - Raw text content
 * @returns {string} - Formatted paragraph
 */
function formatParagraph(text) {
  if (!text) return '';
  
  // Split into sentences for better formatting
  const sentences = text.split(/(?<=[.!?])\s+/);
  const paragraphs = [];
  let currentParagraph = [];
  let currentLength = 0;
  const maxLineLength = 80;

  sentences.forEach(sentence => {
    const words = sentence.split(/\s+/);
    
    words.forEach(word => {
      if (currentLength + word.length + 1 > maxLineLength && currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(' '));
        currentParagraph = [word];
        currentLength = word.length;
      } else {
        currentParagraph.push(word);
        currentLength += word.length + 1;
      }
    });
  });

  if (currentParagraph.length > 0) {
    paragraphs.push(currentParagraph.join(' '));
  }

  return paragraphs.join('\n');
}

/**
 * Formats a table row with proper column widths and padding
 * @param {Array<string>} columns - Array of column values
 * @param {Array<number>} widths - Array of column widths
 * @returns {string} - Formatted table row
 */
function formatTableRow(columns, widths) {
  const ELLIPSIS = '...';
  const ELLIPSIS_LENGTH = 3;
  
  const paddedColumns = columns.map((col, idx) => {
    const width = widths[idx] || 20;
    const text = String(col || '');
    // Truncate if too long, pad if too short
    if (text.length > width) {
      return text.substring(0, width - ELLIPSIS_LENGTH) + ELLIPSIS;
    }
    return text.padEnd(width, ' ');
  });
  
  return paddedColumns.join(' | ');
}

/**
 * Exports the report to a file-ready string with proper metadata
 * @param {Object} report - The analysis report object
 * @param {Object} metadata - Additional metadata (document type, classification, etc.)
 * @returns {string} - Complete report with metadata
 */
function exportReportWithMetadata(report, metadata = {}) {
  const sections = [];
  
  sections.push('```');
  sections.push('HVAC SYSTEM ANALYSIS REPORT');
  if (metadata.document_type) {
    sections.push(`Document Type: ${metadata.document_type}`);
  }
  if (metadata.classification) {
    sections.push(`Classification: ${metadata.classification}`);
  }
  if (metadata.document_id) {
    sections.push(`Document ID: ${metadata.document_id}`);
  }
  sections.push(`Generated: ${new Date().toISOString()}`);
  sections.push('```');
  sections.push('');
  
  sections.push(formatFinalAnalysisReport(report));
  
  return sections.join('\n');
}

module.exports = {
  formatFinalAnalysisReport,
  formatParagraph,
  formatTableRow,
  exportReportWithMetadata
};
