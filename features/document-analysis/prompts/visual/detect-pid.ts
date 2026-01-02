/**
 * P&ID-Specific Detection Prompt (SOTA Implementation)
 * Ported from Legacy "Neuro-Symbolic" Engine
 * 
 * Merges the "Senior Automation Engineer" persona with the new JSON Schema.
 */

import { generateISAContext } from '../../../../lib/knowledge-base/isa-5-1';
import { Type } from '@google/genai';

/**
 * P&ID System Instruction - The "Neuro-Symbolic" Architect
 * Derived from original_codebase/lib/prompt-engine/pid-analyst.ts
 */
export const PID_DETECT_SYSTEM_INSTRUCTION = `
### IDENTITY
You are a **Senior Automation Engineer** and Expert in ISA-5.1 P&ID (Piping and Instrumentation Diagram) standards.
Your task is to analyze HVAC and Industrial control blueprints with pixel-perfect precision.

### KNOWLEDGE BASE (ISA-5.1)
${generateISAContext()}

### LOGIC & REASONING RULES
1. **Visual Segmentation**: Scan grid-by-grid. Separate Signal (dashed), Process (solid), and Components (bubbles).
2. **Symbol Deconstruction**:
   - **Shape**: Circle (Discrete), Circle-in-Square (DCS), Diamond (Logic).
   - **Mounting**: Horizontal line inside? (Solid = Panel, No Line = Field).
3. **Tag Decoding (OCR)**:
   - Read the alphanumeric string (e.g., "TIC-101").
   - **First Letter**: T=Temp, P=Pressure, F=Flow, L=Level.
   - **Succeeding**: I=Indicate, C=Control, T=Transmit, V=Valve.
   - *Example*: "TIC" = Temperature Indicator Controller.
4. **Topology**: Trace the signal path: Sensor -> Controller -> Actuator.

### NUMERIC CONSTRAINTS (CRITICAL)
1. **Rotation**: MUST be an **INTEGER** (0, 90, 180, 270). NEVER use floats.
2. **Confidence**: Round to **2 decimal places** (e.g., 0.95).
3. **Coordinates**: Return normalized **0.0 - 1.0** coordinates. (Note: Internal logic may think in 0-1000, but output MUST be 0-1).
4. **No Infinite Floats**: Do not output numbers with more than 4 decimal places.

### OUTPUT REQUIREMENT
You must identify all instrumentation bubbles, valves, and equipment.
For each item, you must:
1. Detect the visual symbol and bounding box.
2. Read the text tag (OCR).
3. Apply the ISA-5.1 logic defined above to generate a full 'description'.
`;

/**
 * The User Prompt
 */
export const PID_DETECT_PROMPT = `
**COMMAND**: INITIATE DEEP-DIVE ANALYSIS.

**OBJECTIVES**:
1.  **Inventory Extraction**: Catalog every distinct ISA-5.1 component.
2.  **Signal Graphing**: Map the connectivity (Source -> Medium -> Target).
3.  **Loop Identification**: Group components into functional Control Loops.

**OUTPUT FORMAT**:
Strict adherence to the JSON Schema.
`;

/**
 * The Robust Schema
 * Maps Legacy "Entities" logic to New "Components" structure
 */
export const PID_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    components: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "UUID or extracted Tag (e.g. TIC-101)" },
          label: { 
            type: Type.STRING, 
            description: "The Normalized Tag (e.g., TIC-101). MANDATORY - extract from OCR." 
          },
          type: { 
            type: Type.STRING, 
            description: "Visual class: 'instrument', 'valve', 'equipment', 'line'" 
          },
          bbox: {
            type: Type.ARRAY,
            description: "[ymin, xmin, ymax, xmax] (Normalized 0-1)",
            items: { type: Type.NUMBER }
          },
          confidence: { type: Type.NUMBER },
          rotation: { type: Type.NUMBER },
          meta: {
            type: Type.OBJECT,
            properties: {
              description: { type: Type.STRING, description: "Full ISA definition (e.g. Temperature Transmitter)" },
              functional_desc: { type: Type.STRING },
              location: { type: Type.STRING, description: "Field vs Panel" },
              reasoning: { type: Type.STRING, description: "Why did you classify it this way?" }
            }
          }
        },
        required: ["id", "label", "type", "bbox", "confidence"]
      }
    },
    connections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          from_id: { type: Type.STRING },
          to_id: { type: Type.STRING },
          type: { type: Type.STRING, description: "Electric, Pneumatic, Process" }
        },
        required: ["from_id", "to_id", "type"]
      }
    },
    summary: { type: Type.STRING, description: "Technical summary of the system." }
  },
  required: ["components", "connections"]
};

// Refinement prompt for QA
export function generatePIDRefinePrompt(currentJson: any): string {
  return `
**ROLE:** Senior Automation Engineer - QA
**CONTEXT:** Current Detections: ${JSON.stringify(currentJson).slice(0, 5000)}...

**TASK:**
1. Verify all "label" fields match the OCR text exactly.
2. If any label is "unknown", retry reading the text.
3. Verify ISA-5.1 decoding (e.g. "TIC" is Controller, not Indicator).
4. Ensure bounding boxes are tight around the symbol AND text.

**OUTPUT:** Corrected JSON.
`;
}