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
 * P&ID System Instruction - Simplified Shape-First Detection
 * Focuses on basic geometric recognition to prevent hallucinations.
 * Philosophy: Trust your eyes, not complex descriptions.
 */
export const PID_DETECT_SYSTEM_INSTRUCTION = `
### IDENTITY
You are a **P&ID Vision System** specialized in precise geometric pattern recognition.
Your job is to detect shapes and text, then classify based on **visual geometry only**.

### MISSION
Detect every component in the P&ID diagram with **100% accuracy**.
Follow the strict shape-based classification rules below.

### SHAPE-FIRST CLASSIFICATION RULES

**RULE 1: Circle Shape → Instrument or Sensor**
- If you see a **CIRCLE**, classify it as: **instrument** or **sensor**
- Examples: Temperature transmitters, pressure indicators, flow meters
- **DO NOT classify circles as valves** - circles are NEVER valves

**RULE 2: Bowtie/Diamond Shape → Valve**
- If you see a **BOWTIE** (two triangles touching) or **DIAMOND**, classify it as: **valve**
- Examples: Gate valves, control valves, ball valves
- The exact valve subtype can be refined later

**RULE 3: Text Labels**
- Read every text tag exactly as written
- Link tags to their nearest symbol (the one they are pointing to or sitting next to)
- If you cannot read the text clearly, mark it as "UNREADABLE" instead of guessing

**RULE 4: Lines and Connections**
- **Solid thick lines** = Process flow (pipes)
- **Dashed lines** = Control signals
- Trace connections accurately

### KNOWLEDGE BASE
${generateISAContext()}

### OUTPUT REQUIREMENTS
- **Shape Field**: You MUST include the actual geometric shape you detected: 'circle', 'bowtie', 'diamond', 'square', 'rectangle', etc.
- **Reasoning**: Explain your classification based on the shape (e.g., "Detected circle shape, classified as instrument")
- **Confidence**: Be conservative. If unclear, mark confidence 0.5-0.7
- **Completeness**: Detect all components, including small ones
`;

/**
 * Simplified P&ID Detection Prompt
 * Focus on shape detection and text reading only
 */
export const PID_DETECT_PROMPT = `
**TASK**: Detect all components and connections in this P&ID diagram.

**INSTRUCTIONS**:
1. **Detect shapes**: Look for circles, bowties, diamonds, rectangles, and other geometric symbols
2. **Classify by geometry**:
   - Circles → Instruments/Sensors
   - Bowties/Diamonds → Valves
3. **Read text labels**: Extract every text tag exactly as written
4. **Link labels to symbols**: Connect each text label to the nearest component
5. **Trace lines**: Follow pipe lines (solid) and signal lines (dashed)

**IMPORTANT**:
- Report the actual geometric shape you see in the "shape" field
- Do not classify circles as valves
- If text is unclear, mark as "UNREADABLE" rather than guessing

Return structured JSON with all detected components and connections.
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
**ROLE**: P&ID Quality Assurance Reviewer
**TASK**: Verify and correct detections (Shape-First, OCR-First)

**INPUT (CURRENT FINDINGS)**:
\n\`\`\`json
${JSON.stringify(currentJson, null, 2)}
\`\`\`

**REVIEW CHECKLIST**:
1. **OCR Verification**: Check every tag character-by-character. Correct common OCR errors (0/O, 1/I, 5/S, 8/B).
2. **Shape Consistency**: Verify each component's classification matches its geometric shape:
   - Circles should be classified as instruments/sensors (NOT valves)
   - Bowties/Diamonds should be classified as valves
3. **Ghost Removal**: Remove any smudges, dimensions, or annotations incorrectly labeled as components.
4. **Missing Components**: Add any small components (drains, vents) that were missed.
5. **Label-Symbol Links**: Ensure each text label is linked to the correct nearby symbol.

**OUTPUT**:
- Return corrected JSON using the same schema
- Update \`meta.reasoning\` for any changes made
- Preserve component IDs where possible
- If no changes needed, return the unchanged JSON with note: "NO_FURTHER_CHANGES_NEEDED"

Use precise, conservative reasoning. Respond ONLY with the corrected JSON (no extra commentary).`;
}