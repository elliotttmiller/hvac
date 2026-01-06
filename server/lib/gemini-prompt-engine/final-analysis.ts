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
You are a Senior HVAC Systems Engineer preparing a handover document for a client or colleague.

### MISSION
Transform the structured component and connectivity data into a **professional engineering narrative** that reads like a technical report written by a human expert, NOT a machine-generated list.

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

### ACCURACY - "TRUTHFULNESS"
- ONLY reference components and tags that exist in the provided data
- DO NOT invent or assume equipment not shown
- If information is missing or unclear, state so professionally
- Base all descriptions on the connectivity graph and component metadata

### TONE
Professional, technical, authoritative. Use standard engineering terminology (ASHRAE/ISA standards). Write as if this analysis will be filed as official project documentation.
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
Generate a professional engineering analysis that explains this HVAC system in narrative form.

1. **Executive Summary**: Start with a high-level overview (2-3 sentences) describing what type of system this is and its primary purpose. Example: "This schematic depicts a Chilled Water Distribution System serving a multi-story commercial building. The design employs primary-secondary pumping with variable flow control for optimal efficiency."

2. **System Workflow Narrative**: Write a detailed paragraph describing the complete process flow from start to finish. Follow the physical path that the working fluid (water, air, refrigerant) takes through the system. Use the connection graph to determine upstream and downstream relationships. Example: "Chilled water enters the distribution loop via Supply Header SH-01, where it encounters Isolation Valve IV-101 before reaching Primary Pump P-101. The pump discharges through Check Valve CV-101..."

3. **Control Logic Analysis**: Explain the control strategies in paragraph form. Show how instruments (temperature sensors, pressure transmitters) send signals to controllers, which then modulate final control elements (valves, dampers). Example: "Temperature Transmitter TT-101 continuously monitors the supply water temperature and sends a 4-20mA signal to Temperature Indicating Controller TIC-101. The controller processes this input and modulates Control Valve TV-101 to maintain the setpoint of 42°F..."

4. **Specifications and Details**: Provide a paragraph summarizing any engineering details visible in the data such as pipe sizes, material specifications, equipment ratings, or special notes. If no specific details are available, acknowledge this professionally.

**REMEMBER**: 
- Write as a human engineer, not as a detection system
- NO mentions of detection metrics, confidence scores, or component counts
- Focus on HOW the system works, not WHAT was detected
- Use the connectivity data to establish flow direction and control relationships
- Only reference components that actually exist in the provided data
`;
};

/**
 * PHASE 2: Narrative-Focused Schema
 * Structured to produce engineering narrative text, NOT metrics or inventories.
 * Each field is designed to hold paragraph-length descriptions.
 */
export const FINAL_ANALYSIS_SCHEMA = {
  type: "object" as const,
  properties: {
    // High-level title for the report
    report_title: { 
      type: "string",
      description: "A concise title describing the system (e.g., 'Chilled Water System Analysis')"
    },
    
    // 2-3 sentence overview of the entire system
    executive_summary: { 
      type: "string", 
      description: "High-level overview explaining what type of system this is, its primary purpose, and key design features. Should read like an abstract. 2-4 sentences."
    },
    
    // Detailed process flow narrative (top-to-bottom)
    system_workflow_narrative: {
      type: "string",
      description: "A detailed paragraph (or multiple paragraphs) describing the complete physical flow through the system from start to finish. Follow the connectivity graph to trace upstream to downstream. Explain what happens step-by-step as the working fluid moves through the system. Minimum 150 words."
    },
    
    // Control strategy explanation
    control_logic_analysis: {
      type: "string",
      description: "A paragraph explaining the control strategies employed in the system. Describe how sensors measure process variables, how controllers process these signals, and how final control elements respond. Identify control loops by showing the sensor -> controller -> actuator relationships. Minimum 100 words."
    },
    
    // Technical specifications summary
    specifications_and_details: {
      type: "string",
      description: "A paragraph summarizing any engineering specifications, pipe sizes, materials, equipment ratings, or special technical notes found in the component data. If limited information is available, acknowledge this professionally. Can be brief if data is sparse."
    },
    
    // Optional: Key equipment identification
    critical_equipment: {
      type: "array",
      description: "List of primary equipment tags that are central to system operation (e.g., pumps, chillers, air handlers). Maximum 10 items.",
      items: {
        type: "object",
        properties: {
          tag: { type: "string", description: "Equipment tag (e.g., 'P-101')" },
          role: { type: "string", description: "Brief description of its role in the system (1 sentence)" }
        }
      }
    },
    
    // Optional: Engineering notes
    engineering_observations: {
      type: "string",
      description: "Optional paragraph noting any interesting design features, potential concerns, or recommendations based on the observed topology and control strategy."
    }
  },
  required: [
    "report_title",
    "executive_summary",
    "system_workflow_narrative",
    "control_logic_analysis",
    "specifications_and_details"
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
      system_workflow_narrative: "Analysis unavailable due to processing error.",
      control_logic_analysis: "Analysis unavailable due to processing error.",
      specifications_and_details: "No specifications available.",
      critical_equipment: [],
      engineering_observations: ""
    };
  }
};