/**
 * Final Analysis Report Generator (Optimized)
 * 
 * Strategy:
 * 1. Minify Input: Strip visual data (bbox, poly) to reduce token usage by ~60%.
 * 2. Logical Focus: Prompt emphasizes topology and control logic over simple inventory.
 * 3. Structured Output: Professional engineering report format.
 */

import { GeminiModel } from '@/features/document-analysis/types';
import { getServerAI } from '../serverAI';
import { serverConfig } from '../serverConfig';

/**
 * Helper: Strips heavy visual data to send only logical context to the AI.
 * This massively reduces token cost and latency.
 * 
 * PHASE 1 ENHANCEMENT: Aggressive minification - removes ALL visual metadata
 * including bbox, confidence, rotation, and other detection metrics.
 * Focus purely on system logic and relationships.
 */
function minifyForAnalysis(visualResults: any) {
  if (!visualResults) return { components: [], connections: [] };

  const components = visualResults.components?.map((c: any) => ({
    id: c.id,                 // Component identifier
    tag: c.label || c.id,     // The human readable ID (e.g., "PDI-1401")
    type: c.type,             // The functional type (e.g., "valve", "pump")
    description: c.meta?.description || c.type, // Functional description
    // Only keep non-visual metadata that helps understand system logic
    subsystem: c.meta?.hvac_subsystem,
    function: c.meta?.functional_desc,
    isa_function: c.meta?.isa_function,
    instrument_type: c.meta?.instrument_type
  })) || [];

  const connections = visualResults.connections?.map((c: any) => ({
    from: c.from_id,
    to: c.to_id,
    type: c.type  // Connection type (e.g., 'supply', 'control_signal')
    // EXCLUDED: confidence, line coordinates, visual properties
  })) || [];

  return { components, connections };
}

export const FINAL_ANALYSIS_SYSTEM_INSTRUCTION = `
### ROLE
You are a Senior HVAC Systems Engineer preparing a comprehensive handover document for a client or colleague that meets industry standards for professional engineering reports.

### MISSION
Transform the structured component and connectivity data into a **professional engineering narrative** that reads like a technical report written by a human expert, NOT a machine-generated list. The report should follow industry-standard HVAC documentation practices.

### CRITICAL REQUIREMENTS - "NO BEAN COUNTING"
1. **NEVER** mention detection metrics like "confidence scores", "total components detected", or "bounding boxes"
2. **NEVER** output simple inventories like "There are 5 valves and 3 pumps"
3. **DO NOT** list component counts or statistics
4. **DO NOT** reference the detection process or AI analysis

### WRITING STYLE - "NARRATIVE FLOW"
- Write in paragraph form, not bullet points or tables
- Use a top-to-bottom, upstream-to-downstream flow when describing processes
- Explain the system as if walking someone through the physical installation
- Use phrases like: "begins at...", "flows through...", "is controlled by...", "maintains..."

### ANALYSIS APPROACH - "CORRELATION & INTEGRATION"
1. **Trace Physical Flow**: Identify the start and end of the process by analyzing connections
2. **Explain Control Strategies**: Show how sensors influence controllers which modulate actuators
3. **Describe Relationships**: Connect components logically (e.g., "Pump P-101 supplies chilled water to Coil C-201 via Supply Header SH-01")
4. **Identify Subsystems**: Group related equipment and explain their collective purpose

### HVAC INDUSTRY STANDARDS
Include relevant analysis for:
- **Design Overview**: System design approach, mechanical ventilation strategy, heating/cooling methodology
- **Ventilation Design**: Outdoor airflow rates, exhaust rates, fresh air intake strategy (when applicable)
- **Heating & Cooling Loads**: Reference to load calculations, capacity requirements (when equipment data is available)
- **Equipment Selection**: Equipment specifications, controls strategy, efficiency considerations
- **Standards Compliance**: Reference to applicable standards (ASHRAE, ACCA, ISA-5.1, ANSI/RESNET/ACCA 310, building codes, ENERGY STAR)

### ACCURACY - "TRUTHFULNESS"
- ONLY reference components and tags that exist in the provided data
- DO NOT invent or assume equipment not shown
- If information is missing or unclear, state so professionally
- Base all descriptions on the connectivity graph and component metadata
- When load calculations or specific compliance details are not available, note this limitation professionally

### TONE
Professional, technical, authoritative. Use standard engineering terminology (ASHRAE/ISA standards). Write as if this analysis will be filed as official project documentation for building code compliance and ENERGY STAR certification.
`;

export const generateFinalAnalysisPrompt = (inferenceResults: any): string => {
  const { document_type, classification, visual } = inferenceResults;
  
  // OPTIMIZATION: Process data before sending to AI
  const { components, connections } = minifyForAnalysis(visual);

  return `
**DOCUMENT CONTEXT**:
Type: ${document_type}
Classification: ${classification?.reasoning || 'Engineering drawing'}

**SYSTEM DATA** (Minified for Narrative Generation):

\`\`\`json
{
  "components": ${JSON.stringify(components, null, 2)},
  "connections": ${JSON.stringify(connections, null, 2)}
}
\`\`\`

**YOUR TASK**:
Generate a comprehensive professional HVAC engineering report that follows industry standards for technical documentation. Structure your analysis as follows:

1. **Executive Summary**: Start with a high-level overview (2-3 sentences) describing what type of HVAC system this is, its primary purpose, and key design features. Example: "This schematic depicts a Chilled Water Distribution System serving a multi-story commercial building. The design employs primary-secondary pumping with variable flow control for optimal efficiency."

2. **Design Overview**: Provide a paragraph describing the overall HVAC system design approach, including the mechanical ventilation strategy, heating and cooling methodology, and system architecture. Address how the system meets building requirements.

3. **System Workflow Narrative**: Write a detailed paragraph describing the complete process flow from start to finish. Follow the physical path that the working fluid (water, air, refrigerant) takes through the system. Use the connection graph to determine upstream and downstream relationships. Example: "Chilled water enters the distribution loop via Supply Header SH-01, where it encounters Isolation Valve IV-101 before reaching Primary Pump P-101..."

4. **Ventilation Design** (if applicable): Describe the ventilation system design, including outdoor airflow design rates, exhaust rates for common spaces, fresh air intake strategy, and air distribution methodology. If ventilation components are not evident in the drawing, note this professionally.

5. **Control Logic Analysis**: Explain the control strategies in paragraph form. Show how instruments (temperature sensors, pressure transmitters) send signals to controllers, which then modulate final control elements (valves, dampers). Include discussion of control sequences and operational modes.

6. **Equipment Selection & Specifications**: Provide a paragraph detailing the HVAC equipment specifications, including controls strategy, efficiency considerations, and any capacity or performance requirements evident in the data. Address equipment sizing approach when information is available.

7. **Heating & Cooling Loads** (when applicable): If heating or cooling equipment is present, discuss the system's approach to meeting thermal loads, referencing industry standards such as ACCA Manual J or ASHRAE Fundamentals where applicable. If load calculations are not available in the drawing, acknowledge this limitation.

8. **Standards Compliance**: Discuss applicable industry standards and codes, which may include ASHRAE standards, ISA-5.1 for instrumentation, ACCA standards, ANSI/RESNET/ACCA 310 for HVAC system installation grading, building codes, and ENERGY STAR considerations. Only reference standards that are relevant to the components and systems shown.

**IMPORTANT GUIDELINES**: 
- Write as a human engineer, not as a detection system
- NO mentions of detection metrics, confidence scores, or component counts
- Focus on HOW the system works, not WHAT was detected
- Use the connectivity data to establish flow direction and control relationships
- Only reference components that actually exist in the provided data
- For sections where data is limited or unavailable (e.g., load calculations), acknowledge this professionally rather than inventing information
- Ensure the report meets professional standards suitable for building code compliance review and project documentation
`;
};

/**
 * PHASE 2: Narrative-Focused Schema with HVAC Industry Standards
 * Structured to produce comprehensive engineering narrative text following industry best practices.
 * Includes sections required for professional HVAC documentation and compliance reporting.
 */
export const FINAL_ANALYSIS_SCHEMA = {
  type: "object" as const,
  properties: {
    // High-level title for the report
    report_title: { 
      type: "string",
      description: "A concise title describing the system (e.g., 'Commercial Chilled Water System Analysis' or 'Variable Air Volume HVAC System Report')"
    },
    
    // 2-3 sentence overview of the entire system
    executive_summary: { 
      type: "string", 
      description: "High-level overview explaining what type of HVAC system this is, its primary purpose, and key design features. Should read like an abstract suitable for management review. 2-4 sentences."
    },
    
    // Overall design approach and methodology
    design_overview: {
      type: "string",
      description: "Paragraph describing the overall HVAC system design approach, mechanical ventilation strategy, heating/cooling methodology, and system architecture. Explain how the design meets building requirements. Minimum 100 words."
    },
    
    // Detailed process flow narrative (top-to-bottom)
    system_workflow_narrative: {
      type: "string",
      description: "Detailed paragraph(s) describing the complete physical flow through the system from start to finish. Follow the connectivity graph to trace upstream to downstream. Explain what happens step-by-step as the working fluid moves through the system. Minimum 150 words."
    },
    
    // Ventilation system design (if applicable)
    ventilation_design: {
      type: "string",
      description: "Paragraph describing ventilation system design including outdoor airflow rates, exhaust rates, fresh air intake strategy, and air distribution. If ventilation components are not present, state 'Ventilation details not available in this drawing' professionally. Can be brief if not applicable."
    },
    
    // Control strategy explanation
    control_logic_analysis: {
      type: "string",
      description: "Paragraph explaining control strategies employed in the system. Describe how sensors measure process variables, how controllers process signals, and how final control elements respond. Include control sequences and operational modes. Minimum 100 words."
    },
    
    // Equipment specifications and selection criteria
    equipment_specifications: {
      type: "string",
      description: "Paragraph detailing HVAC equipment specifications, controls strategy, efficiency considerations, and capacity/performance requirements. Address equipment sizing approach when available. Include manufacturer standards and performance criteria if evident."
    },
    
    // Heating and cooling loads discussion
    heating_cooling_loads: {
      type: "string",
      description: "Paragraph discussing the system's approach to meeting thermal loads. Reference industry standards such as ACCA Manual J or ASHRAE Fundamentals where applicable. If load calculations are not available in the drawing, acknowledge this limitation professionally. Can state 'Load calculation details not included in this schematic' if not applicable."
    },
    
    // Standards compliance and codes
    standards_compliance: {
      type: "string",
      description: "Paragraph discussing applicable industry standards and building codes relevant to the system shown. May include ASHRAE standards, ISA-5.1 for instrumentation, ACCA standards, ANSI/RESNET/ACCA 310 for installation grading, building codes, and ENERGY STAR considerations. Only reference standards applicable to components shown in the drawing."
    },
    
    // Optional: Key equipment identification
    critical_equipment: {
      type: "array",
      description: "List of primary equipment tags central to system operation (e.g., pumps, chillers, air handlers, control valves). Maximum 10 items.",
      items: {
        type: "object",
        properties: {
          tag: { type: "string", description: "Equipment tag (e.g., 'AHU-01' or 'P-101')" },
          role: { type: "string", description: "Brief description of its role in the system (1 sentence)" }
        }
      }
    },
    
    // Optional: Engineering notes
    engineering_observations: {
      type: "string",
      description: "Optional paragraph noting interesting design features, potential concerns, recommendations, or observations about the system design quality and compliance posture based on industry best practices."
    }
  },
  required: [
    "report_title",
    "executive_summary",
    "design_overview",
    "system_workflow_narrative",
    "control_logic_analysis",
    "equipment_specifications",
    "standards_compliance"
  ]
};

export const generateFinalAnalysis = async (inferenceResults: any): Promise<any> => {
  const { ai, apiKey } = await getServerAI();
  if (!apiKey) throw new Error("API Key is missing.");

  try {
    console.log('🎯 Generating Optimized Final Analysis Report...');
    
    // 1. Prepare Optimized Prompt (Reduced Token Count)
    const prompt = generateFinalAnalysisPrompt(inferenceResults);
    
    // Calculate appropriate output token budget based on component count
    // Rule of thumb: ~100 tokens per component for comprehensive narrative
    // + 1000 tokens base for executive summary and conclusions
    // INCREASED: To ensure full, complete reports without truncation
    const componentCount = inferenceResults.visual?.components?.length || 0;
    const tokensPerComponent = 100; // Increased for more detailed narratives
    const baseTokens = 1000; // Increased base allocation
    const calculatedTokens = Math.min(
      baseTokens + (componentCount * tokensPerComponent),
      8192 // Increased cap to 8k tokens for comprehensive reports
    );
    
    console.log(`   [Token Budget] Components: ${componentCount}, Calculated: ${calculatedTokens} tokens (cap: 8192)`);
    
    // 2. Inference with optimized configuration
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH, // Flash is perfect for summarization
      contents: { parts: [{ text: prompt }] },
      config: {
        // OPTIMIZED: Dynamic thinking budget based on complexity
        // Simple diagrams (<10 components): 2048 tokens
        // Medium diagrams (10-30 components): 4096 tokens  
        // Complex diagrams (>30 components): 6144 tokens (max)
        thinkingConfig: { 
          thinkingBudget: Math.min(2048 + (componentCount * 100), 6144)
        }, 
        systemInstruction: FINAL_ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: FINAL_ANALYSIS_SCHEMA,
        temperature: 0.2,
        maxOutputTokens: calculatedTokens
      }
    });

    // 3. Parse
    const jsonText = response.text || "{}";
    let analysisReport;
    
    try {
      analysisReport = JSON.parse(jsonText);
    } catch (e) {
      // Simple regex fallback
      const match = jsonText.match(/\{[\s\S]*\}/);
      if (match) analysisReport = JSON.parse(match[0]);
      else throw new Error('Analysis generation failed to produce valid JSON');
    }

    console.log('✅ Analysis Report Generated.');
    console.log(`   [Output] ~${jsonText.length} characters (estimated ~${Math.ceil(jsonText.length / 4)} tokens)`);
    
    return analysisReport;

  } catch (error) {
    console.error('❌ Final Analysis Failed:', error);
    // Return a graceful fallback structure so UI doesn't crash
    return {
      report_title: "Analysis Generation Failed",
      executive_summary: "The system could not generate the final narrative analysis. Please review the detected components manually.",
      design_overview: "Analysis unavailable due to processing error.",
      system_workflow_narrative: "Analysis unavailable due to processing error.",
      ventilation_design: "Analysis unavailable due to processing error.",
      control_logic_analysis: "Analysis unavailable due to processing error.",
      equipment_specifications: "No specifications available.",
      heating_cooling_loads: "Load analysis unavailable.",
      standards_compliance: "Compliance analysis unavailable.",
      critical_equipment: [],
      engineering_observations: ""
    };
  }
};