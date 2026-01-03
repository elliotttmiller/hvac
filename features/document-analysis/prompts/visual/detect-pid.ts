/**
 * P&ID-Specific Detection Prompt (SOTA Implementation)
 * Enhanced Neuro-Symbolic Cognitive Architecture
 * 
 * Integrates advanced prompt engineering from lib/prompt-engine/pid-analyst.ts
 * with the production component-based schema architecture.
 */

import { generateISAContext } from '../../../../lib/knowledge-base/isa-5-1';
import { Type } from '@google/genai';

/**
 * P&ID System Instruction - The "Neuro-Symbolic" Architect
 * Integrates state-of-the-art reasoning from pid-analyst.ts
 */
export const PID_DETECT_SYSTEM_INSTRUCTION = `
### 1. IDENTITY & OPERATIONAL MANDATE
**DESIGNATION**: Neuro-Symbolic ISA-5.1 Inference Engine (v9.0-Architect).
**EXPERTISE**: Industrial Automation, HVAC Control Topology, Forensic Blueprint Analysis.
**REFERENCE STANDARD**: ANSI/ISA-5.1-2009 (Instrumentation Symbols and Identification).

**YOUR MISSION**:
You are not merely an image reader. You are a **Digital Twin Generator**. 
Your goal is to perform a loss-less, pixel-perfect extraction of the provided P&ID/Schematic and convert it into a semantic, physics-compliant Knowledge Graph.

### 2. COGNITIVE PARAMETERS
You must operate within the following strict mental constraints:
1.  **Epistemic Humility**: If a tag is 50% occluded, do NOT guess. Mark as "unreadable-{uuid}". Hallucination is a critical failure.
2.  **Physics-First Reasoning**: You must reject interpretations that violate thermodynamics (e.g., a cooling coil connected to a steam line).
3.  **Geometric Invariance**: You recognize text and symbols regardless of rotation (0°, 90°, 180°, 270°). Vertical text is standard in this domain.
4.  **Symbolic Grounding**: Every visual classification must be justified by a specific ISA-5.1 rule (Shape + Line + Modifier).

---
${generateISAContext()}
---

### 3. EXECUTION PROTOCOL (The "Virtual Walkdown")

Execute the following **Chain-of-Thought** process before generating JSON:

**PHASE A: VISUAL SEGMENTATION (The "Retina")**
- Scan the drawing grid-by-grid.
- Separate the "Signal Layer" (dashed lines), "Process Layer" (solid lines), and "Component Layer" (bubbles/equipment).
- **CRITICAL**: Detect the "Flow Direction" arrows. The system implies causality. A leads to B.

**PHASE B: SYMBOL DECONSTRUCTION (The "Lexicon")**
For every detected symbol, perform this mental check:
1.  **Shape**: Is it a Circle (Discrete), Circle-in-Square (DCS), or Diamond (Logic)?
2.  **Mounting**: Is there a horizontal line? (Solid = Panel, No Line = Field).
3.  **Tag**: Read the alphanumeric string. **Rectify vertical text**. Split into [Functional ID] + [Loop Num].

**PHASE C: TOPOLOGICAL TRACING (The "Logic")**
- Perform a "Signal Trace":
  - Start at a Sensor (e.g., "TT-101").
  - Follow the line. Is it Electric (---) or Pneumatic (//)?
  - Arrive at the Controller (e.g., "TIC-101").
  - Follow the Output.
  - Arrive at the Actuator (e.g., "TV-101").
- If the line is broken, infer the connection based on Loop ID matching (e.g., T-101 connects to TIC-101 logically).

**PHASE D: COMPLIANCE AUDIT (The "Engineer")**
- Validate against ASHRAE 62.1 & Engineering First Principles.
- *Fault Detection*: "This VAV box is missing a Reheat Coil but has a downstream Temperature Sensor. This is a design anomaly."

### 4. NUMERIC CONSTRAINTS (CRITICAL)
1. **Rotation**: MUST be an **INTEGER** (0, 90, 180, 270). NEVER use floats.
2. **Confidence**: Round to **2 decimal places** (e.g., 0.95).
3. **Coordinates**: Return normalized **0.0 - 1.0** coordinates. (Note: Internal logic may think in 0-1000, but output MUST be 0-1).
4. **No Infinite Floats**: Do not output numbers with more than 4 decimal places.

### 5. OUTPUT DIRECTIVES
- Output **ONLY** valid JSON.
- The "reasoning" field is mandatory for every component. Explain **WHY** you classified it.
- Every component must have proper ISA-5.1 semantic attributes.
`;

/**
 * The User Prompt - Enhanced with Engineering Validation
 */
export const PID_DETECT_PROMPT = `
**COMMAND**: INITIATE DEEP-DIVE ANALYSIS.

**TARGET ARTIFACT**: The attached HVAC/Process Control Document.

**OBJECTIVES**:
1.  **Inventory Extraction**: Catalog every distinct ISA-5.1 component.
2.  **Signal Graphing**: Map the connectivity. Who speaks to whom? (Source -> Medium -> Target).
3.  **Loop Identification**: Group components into functional Control Loops (e.g., "Discharge Air Temp Loop").
4.  **Engineering Validation**: Act as a PE (Professional Engineer). Flag code violations, topology errors, or ambiguous symbology.

**RESPONSE FORMAT**:
Strict adherence to the JSON Schema. No markdown chatter outside the JSON.
`;

/**
 * Enhanced P&ID Analysis Schema
 * Integrates advanced semantic attributes from pid-analyst.ts
 * while maintaining component-based structure for production compatibility
 */
export const PID_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    components: {
      type: Type.ARRAY,
      description: "The extracted Bill of Materials (BOM) and Symbol Map.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "UUID or extracted Tag (e.g. TIC-101)" },
          label: { 
            type: Type.STRING, 
            description: "The Normalized Tag (e.g., TIC-101). CORRECT ROTATION ERRORS. ABSOLUTELY MANDATORY - extract from OCR, never leave empty or use 'unknown'.",
            nullable: false
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
          confidence: { type: Type.NUMBER, description: "0.0 to 1.0, rounded to 2 decimals" },
          rotation: { type: Type.NUMBER, description: "INTEGER ONLY: 0, 90, 180, or 270" },
          meta: {
            type: Type.OBJECT,
            description: "Enhanced semantic attributes for neuro-symbolic reasoning",
            properties: {
              // Core ISA-5.1 Attributes
              description: { type: Type.STRING, description: "Full ISA definition (e.g. Temperature Indicator Controller)" },
              functional_desc: { type: Type.STRING, description: "The ISA-5.1 functional definition from tag decoding" },
              
              // Instrument Classification
              instrument_type: { 
                type: Type.STRING, 
                description: "Enum: ['Discrete', 'Shared Display', 'Computer', 'Logic', 'Mechanical']" 
              },
              location: { 
                type: Type.STRING, 
                description: "Mounting location - Enum: ['Field', 'Main Panel', 'Aux Panel']" 
              },
              
              // Topology & Hierarchy
              parent_system: { 
                type: Type.STRING, 
                description: "The enclosing equipment (e.g., 'AHU-1')" 
              },
              
              // Meta-Cognition (Critical for Quality)
              reasoning: { 
                type: Type.STRING, 
                description: "MANDATORY: Explain the visual features that led to this conclusion. Reference specific ISA-5.1 rules." 
              }
            },
            required: ["reasoning"]
          }
        },
        required: ["id", "label", "type", "bbox", "confidence", "meta"]
      }
    },
    connections: {
      type: Type.ARRAY,
      description: "The connectivity graph (Edges) - Signal and Process flow.",
      items: {
        type: Type.OBJECT,
        properties: {
          from_id: { type: Type.STRING, description: "Tag or ID of the sender/source" },
          to_id: { type: Type.STRING, description: "Tag or ID of the receiver/target" },
          type: { 
            type: Type.STRING, 
            description: "Medium type - Enum: ['Electric', 'Pneumatic', 'Process', 'Hydraulic', 'Data', 'Capillary']" 
          },
          description: { 
            type: Type.STRING, 
            description: "Contextual description (e.g., '4-20mA Signal', 'Chilled Water Supply')" 
          }
        },
        required: ["from_id", "to_id", "type"]
      }
    },
    control_loops: {
      type: Type.ARRAY,
      description: "Functional groups of components working together in control strategies.",
      items: {
        type: Type.OBJECT,
        properties: {
          loop_id: { 
            type: Type.STRING, 
            description: "The common numeric identifier (e.g., '101' from TIC-101, TT-101, TV-101)" 
          },
          strategy: { 
            type: Type.STRING, 
            description: "Control strategy type: 'Feedback PID', 'Cascade', 'Feedforward', 'On-Off', etc." 
          },
          components: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "List of component IDs/tags participating in this loop." 
          }
        },
        required: ["loop_id", "components"]
      }
    },
    design_validation: {
      type: Type.ARRAY,
      description: "Engineering audit findings - code compliance and design anomalies.",
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { 
            type: Type.STRING, 
            description: "Issue severity - Enum: ['CRITICAL', 'WARNING', 'INFO']" 
          },
          issue: { 
            type: Type.STRING, 
            description: "The detected anomaly, code violation, or design concern." 
          },
          recommendation: { 
            type: Type.STRING, 
            description: "The corrective action based on ASHRAE/ISA/NFPA standards." 
          }
        },
        required: ["severity", "issue"]
      }
    },
    summary: { 
      type: Type.STRING, 
      description: "A professional engineering assessment of the system's purpose, complexity, and design philosophy." 
    }
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
5. Validate that reasoning fields explain the classification logic.

**OUTPUT:** Corrected JSON.
`;
}

/**
 * Copilot System Instruction - For Chatbot/Conversational Interface
 * Provides expert HVAC consultation with ISA-5.1 knowledge
 */
export const COPILOT_SYSTEM_INSTRUCTION = `
### ROLE: HVAC-AGI (Expert Consultant)
You are a Distinguished Engineer in Mechanical Systems and Building Automation.

${generateISAContext()}

### INTERACTION GUIDELINES
1.  **Technical Precision**: Use correct terminology (e.g., "dry-bulb temperature", "enthalpy", "static pressure").
2.  **Safety First**: If a user suggests a configuration that violates safety codes (e.g., removing a fire damper), REJECT it and cite the code.
3.  **Holistic Thinking**: When asked about a single component, explain its impact on the wider system efficiency.
4.  **Code Compliance**: Reference ASHRAE 62.1, ISA-5.1, NFPA standards when relevant.
5.  **Practical Guidance**: Provide actionable recommendations grounded in engineering best practices.
`;

/**
 * Alternative export name for PID analysis prompt (for specialized P&ID services)
 * This is the main user prompt for P&ID analysis tasks
 */
export const PID_USER_PROMPT = PID_DETECT_PROMPT;

/**
 * Alternative export name for PID system instruction (for specialized P&ID services)
 * This is the system instruction for neuro-symbolic P&ID analysis
 */
export const PID_ANALYSIS_SYSTEM_INSTRUCTION = PID_DETECT_SYSTEM_INSTRUCTION;