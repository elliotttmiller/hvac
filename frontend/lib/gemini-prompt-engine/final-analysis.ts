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
 */
function minifyForAnalysis(visualResults: any) {
  if (!visualResults) return { components: [], connections: [] };

  const components = visualResults.components?.map((c: any) => ({
    tag: c.label || c.id,     // The human readable ID
    type: c.type,             // The functional type
    desc: c.meta?.description || c.type, // The description
    // We EXCLUDE bbox, polygon, rotation, confidence (AI doesn't need these for text analysis)
    meta: {
      subsystem: c.meta?.hvac_subsystem,
      function: c.meta?.functional_desc
    }
  })) || [];

  const connections = visualResults.connections?.map((c: any) => ({
    from: c.from_id,
    to: c.to_id,
    type: c.type,
    // We EXCLUDE confidence, line_type (visuals are irrelevant to logic now)
  })) || [];

  return { components, connections };
}

export const FINAL_ANALYSIS_SYSTEM_INSTRUCTION = `
### ROLE
Senior HVAC Systems Engineer & Technical Auditor.

### MISSION
Analyze the provided structured data (Component Inventory & Connectivity Graph) to generate a **Professional Engineering System Assessment**.

### CORE OBJECTIVE: CORRELATION & INTEGRATION
Do not just list parts. You must explain **how the system works**.
- **Trace Flows**: Follow the path from Source (e.g., Tank/Pump) to Destination.
- **Explain Loops**: Correlate Sensors -> Controllers -> Actuators.
- **Identify Logic**: Explain the relationship between interlocks, safety valves, and primary equipment.

### TONE
Technical, concise, authoritative. Use standard engineering terminology (ASHRAE/ISA).
`;

export const generateFinalAnalysisPrompt = (inferenceResults: any): string => {
  const { document_type, classification, visual } = inferenceResults;
  
  // OPTIMIZATION: Process data before sending to AI
  const { components, connections } = minifyForAnalysis(visual);

  return `
**INPUT DATA FOR ANALYSIS**:

**Document Type**: ${document_type} (${classification?.reasoning || 'No context'})

**Logical Topology (Minified for Processing)**:
- Component Count: ${components.length}
- Connection Count: ${connections.length}

\`\`\`json
{
  "components": ${JSON.stringify(components)},
  "connectivity_graph": ${JSON.stringify(connections)}
}
\`\`\`

**ANALYSIS REQUIREMENTS**:
1. **Executive Summary**: What is this system? (e.g., "Chilled Water Distribution with Primary/Secondary Pumping").
2. **Control Logic**: detailed breakdown of identified control loops (e.g., "TIC-101 modulates Control Valve FV-101 to maintain setpoint").
3. **Process Narrative**: Step-by-step flow description from upstream to downstream.
4. **Integration**: How do the subsystems (Sensors, Valves, Equipment) interact?

**OUTPUT**: Strict JSON following the provided schema.
`;
};

/**
 * Optimized Schema - Focused on Engineering Narrative
 * Less nested arrays, more descriptive fields for "High Level" understanding.
 */
export const FINAL_ANALYSIS_SCHEMA = {
  type: "object" as const,
  properties: {
    report_title: { type: "string" },
    executive_summary: { 
      type: "string", 
      description: "High-level overview of the system's purpose, capacity, and design intent." 
    },
    system_architecture: {
      type: "object",
      properties: {
        primary_system_type: { type: "string" }, // e.g. "Hydronic Cooling"
        topology_description: { type: "string" }, // e.g. "Closed loop with variable speed pumping"
        critical_equipment: { type: "array", items: { type: "string" } }
      }
    },
    // CRITICAL SECTION: The "Correlation" Logic
    control_and_operation: {
      type: "object",
      properties: {
        control_loops_identified: {
          type: "array",
          description: "List of specific control strategies found.",
          items: {
            type: "object",
            properties: {
              loop_tag: { type: "string" }, // e.g. "T-101"
              strategy: { type: "string" }, // e.g. "Temperature Control"
              narrative: { type: "string" } // e.g. "TT-101 measures discharge temp and modulates valve TV-101 via PLC."
            }
          }
        },
        process_flow_narrative: {
          type: "string",
          description: "A paragraph describing the physical flow of medium through the system (Start -> End)."
        },
        interlocks_and_safety: {
          type: "string",
          description: "Description of safety devices (PRVs, Switches) and their logic."
        }
      }
    },
    technical_inventory: {
      type: "object",
      properties: {
        instrumentation_summary: { type: "string" },
        valves_and_actuators: { type: "string" },
        piping_spec_notes: { type: "string" }
      }
    },
    engineering_audit: {
      type: "object",
      properties: {
        design_quality: { type: "string" }, // "High", "Medium", "Incomplete"
        missing_components: { type: "array", items: { type: "string" } },
        recommendations: { type: "array", items: { type: "string" } }
      }
    }
  },
  required: [
    "report_title",
    "executive_summary",
    "system_architecture",
    "control_and_operation",
    "technical_inventory",
    "engineering_audit"
  ]
};

export const generateFinalAnalysis = async (inferenceResults: any): Promise<any> => {
  const { ai, apiKey } = await getServerAI();
  if (!apiKey) throw new Error("API Key is missing.");

  try {
    console.log('🎯 Generating Optimized Final Analysis Report...');
    
    // 1. Prepare Optimized Prompt (Reduced Token Count)
    const prompt = generateFinalAnalysisPrompt(inferenceResults);
    
    // 2. Inference
    const response = await ai.models.generateContent({
      model: GeminiModel.FLASH, // Flash is perfect for summarization
      contents: { parts: [{ text: prompt }] },
      config: {
        // Reduced thinking budget - The "hard" vision work is done. 
        // This is just text synthesis, which requires less "reasoning" power.
        thinkingConfig: { thinkingBudget: 4096 }, 
        systemInstruction: FINAL_ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: FINAL_ANALYSIS_SCHEMA,
        temperature: 0.2,
        maxOutputTokens: serverConfig.DEFAULT_MAX_OUTPUT_TOKENS
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
    return analysisReport;

  } catch (error) {
    console.error('❌ Final Analysis Failed:', error);
    // Return a graceful fallback structure so UI doesn't crash
    return {
      report_title: "Analysis Generation Failed",
      executive_summary: "The system could not generate the final textual analysis. Please review the detected components manually.",
      system_architecture: {},
      control_and_operation: { control_loops_identified: [] },
      technical_inventory: {},
      engineering_audit: { recommendations: [] }
    };
  }
};