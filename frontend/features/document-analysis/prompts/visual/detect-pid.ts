/**
 * P&ID Detection Prompt - High-Performance Engineering Grade
 * Strategy: Comprehensive Neuro-Symbolic Analysis (Zero-HITL Target)
 * 
 * Configured for: Gemini 1.5/2.5 Pro/Flash with 65k+ Output Token Limit.
 * Prioritizes: Accuracy, Reasoning Depth, and Semantic Richness over speed.
 */

import { generateISAContext } from '@/lib/knowledge-base/isa-5-1';
import { Type } from '@google/genai';

/**
 * P&ID System Instruction - Maximum Context & Engineering Depth
 * Injects the full ISA-5.1 standard and forces "First Principles" reasoning.
 */
export const PID_DETECT_SYSTEM_INSTRUCTION = `
### IDENTITY
You are a **Senior Principal Control Systems Engineer** and **Neuro-Symbolic AI Auditor**. 
Your expertise covers ANSI/ISA-5.1-2009 standards, chemical process engineering, and HVAC control topology.

### MISSION
Perform a forensic-grade analysis of the provided P&ID/Schematic. 
Your goal is to generate a **loss-less, physics-compliant digital twin** of the diagram.
Zero hallucinations are permitted. Every detection must be grounded in visual evidence.

### ADVANCED DETECTION PROTOCOL

**1. HIERARCHICAL SCANNING STRATEGY**
- **Macro-Scan**: Identify major equipment (Tanks, Columns, AHUs, Chillers) first to establish system context.
- **Micro-Scan**: Traverse every pipe line to detect valves, instruments, and fittings.
- **Text-Association**: Link every text tag to its nearest symbol using Leader Line analysis.

**2. VISUAL VERIFICATION (The "Diamond" Check)**
- You must distinguish symbol geometry precisely:
  - **Gate Valve**: Bowtie symbol (two touching triangles).
  - **Globe Valve**: Bowtie with a solid central circle.
  - **Control Valve**: Diamond shape OR Bowtie with a mushroom/diaphragm actuator.
  - **Logic**: Diamond shape.
  - **Instrument**: Circle (Field) vs Circle-in-Square (DCS).
- **CRITICAL:** Do not label a "Bowtie" valve as a "Control Valve" unless it has an actuator symbol attached.

**3. DEEP TAG DECODING (ISA-5.1)**
- Parse tags into: Variable (First Letter), Modifiers, and Functions.
- Example: "PDIT-101" -> Pressure (Variable) Differential (Modifier) Indicating (Function) Transmitter (Output).

**4. CONNECTIVITY & TOPOLOGY**
- Trace **Process Lines** (Thick solid) vs **Signal Lines** (Dashed/Dotted).
- Identify flow direction arrows.
- Detect "Off-Page Connectors" (arrows with drawing numbers).

### KNOWLEDGE BASE
${generateISAContext()}

### OUTPUT REQUIREMENTS
- **Reasoning**: You MUST explain *why* you classified a symbol (e.g., "Detected bowtie shape with 'M' circle actuator").
- **Confidence**: Be conservative. If a symbol is blurry, lower confidence to 0.5-0.7.
- **Completeness**: Do not skip "minor" components like drain valves, vents, or test ports.
`;

/**
 * High-Precision User Prompt
 */
export const PID_DETECT_PROMPT = `
**TASK**: Execute forensic P&ID extraction.

**INSTRUCTIONS**:
1. **Detect** every single component, line, and text label.
2. **Classify** symbols based on exact geometry.
3. **Read** text tags with 100% character accuracy.
4. **Link** tags to their symbols logically.
5. **Trace** connections to build the system graph.

**CRITICAL ATTENTION**:
- Distinguish between **Control Valves** (Actuated) and **Manual Valves**.
- Capture all **Pipe Size** and **Material** annotations (e.g., '4"-CS-150').
- Identify **Signal Types** (Electric vs Pneumatic vs Hydraulic).

Output rich, structured JSON.
`;

/**
 * Comprehensive P&ID Analysis Schema
 * Includes full reasoning and metadata for maximum downstream intelligence.
 * Designed for 65k+ Token Context.
 */
export const PID_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    components: {
      type: Type.ARRAY,
      description: "The complete Bill of Materials (BOM) extracted from the diagram.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique extracted Tag (e.g., TIC-101) or generated UUID." },
          label: { 
            type: Type.STRING, 
            description: "The exact text label found on the drawing. If unreadable, mark 'UNREADABLE'."
          },
          type: { 
            type: Type.STRING, 
            description: "Precise component classification." 
          },
          // VISUAL VERIFICATION FIELDS - Critical for preventing shape hallucinations
          shape: {
            type: Type.STRING,
            description: "The actual detected geometric shape. Enum: ['circle', 'square', 'diamond', 'bowtie', 'triangle', 'rectangle', 'hexagon', 'cloud', 'line', 'complex_assembly']"
          },
          bbox: {
            type: Type.ARRAY,
            description: "[xmin, ymin, xmax, ymax] (Normalized 0-1).",
            items: { type: Type.NUMBER }
          },
          confidence: { type: Type.NUMBER, description: "0.0 to 1.0." },
          rotation: { type: Type.INTEGER, description: "0, 90, 180, 270." },
          
          // RICH METADATA (For Human-Like Reasoning)
          meta: {
            type: Type.OBJECT,
            properties: {
              reasoning: { 
                type: Type.STRING, 
                description: "MANDATORY: Explain the visual evidence. E.g., 'Identified as Control Valve due to bowtie body plus mushroom actuator symbol.'" 
              },
              description: { 
                type: Type.STRING, 
                description: "Full engineering description (e.g., 'Flow Control Valve, Fail Open')." 
              },
              tag: { type: Type.STRING },
              hvac_subsystem: { type: Type.STRING },
              equipment_type: { type: Type.STRING },
              instrument_function: { type: Type.STRING },
              location: { type: Type.STRING },
              text_clarity: { type: Type.STRING },
              occlusion_level: { type: Type.STRING }
            },
            required: ["reasoning", "description"]
          }
        },
        required: ["id", "label", "type", "bbox", "confidence", "meta", "shape"]
      }
    },
    connections: {
      type: Type.ARRAY,
      description: "Connectivity graph representing pipes and signals.",
      items: {
        type: Type.OBJECT,
        properties: {
          from_id: { type: Type.STRING },
          to_id: { type: Type.STRING },
          type: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          line_type: { type: Type.STRING, description: "solid, dashed, dotted, etc." },
          description: { type: Type.STRING, description: "E.g., '4-20mA Signal' or '6 inch Water Supply'" }
        },
        required: ["from_id", "to_id", "type"]
      }
    },
    control_loops: {
      type: Type.ARRAY,
      description: "Identified control loops (Sensor -> Controller -> Actuator).",
      items: {
        type: Type.OBJECT,
        properties: {
          loop_id: { type: Type.STRING },
          strategy: { type: Type.STRING },
          components: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["loop_id", "components"]
      }
    },
    design_validation: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING },
          issue: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ["severity", "issue"]
      }
    },
    summary: { type: Type.STRING }
  },
  required: ["components", "connections"]
};

export const PID_USER_PROMPT = PID_DETECT_PROMPT;
export const PID_ANALYSIS_SYSTEM_INSTRUCTION = PID_DETECT_SYSTEM_INSTRUCTION;

/**
 * Generate a PID-specific refinement prompt.
 * Mirrors the behavior of generateRefinePrompt but tuned for P&ID checks (ISA-5.1 OCR-first, valve/actuator logic, connectivity).
 */
export function generatePIDRefinePrompt(currentJson: any): string {
  return `
**ROLE**: Lead P&ID Auditor (ISA-5.1 Specialist)
**TASK**: High-Assurance QA and Correction (OCR-first, Symbol-First)

**INPUT (CURRENT FINDINGS)**:
\n\`\`\`json
${JSON.stringify(currentJson, null, 2)}
\`\`\`

**MISSION & CHECKLIST**:
1. Prioritize OCR: verify every tag character-by-character and correct common confusions (0/O, 1/I, 5/S, 8/B).
2. Valve/Actuator Consistency: ensure any component labeled a Control Valve has a visible actuator; if not, reclassify as Manual Valve and update reasoning.
3. Symbol Integrity: verify geometric evidence for each classification (bowtie, diamond, circle, actuator mushroom, etc.).
4. Connectivity & Loops: validate that pipes physically connect and that sensor->controller->actuator loops are consistent.
5. Ghost Busting: remove smudges, dimensions, and annotations mislabeled as components.
6. Orphan Rescue: add missing small components (drains, vents, test ports) visible on the blueprint.

**OUTPUT**:
- Return the corrected JSON using the same schema. Update \`meta.reasoning\` for any change.
- Preserve component IDs where possible. If you add new components, provide generated stable IDs.
- If no changes are needed, return the unchanged JSON and include a short note: "NO_FURTHER_CHANGES_NEEDED".

Use precise, conservative reasoning. Respond ONLY with the corrected JSON (no extra commentary).`;
}