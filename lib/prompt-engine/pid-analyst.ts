import { generateISAContext } from '../knowledge-base/isa-5-1';
import { Type } from '@google/genai';

/**
 * CENTRALIZED PROMPT ENGINE: P&ID ANALYST (STATE-OF-THE-ART)
 * 
 * Implements a "Neuro-Symbolic" Cognitive Architecture.
 * This prompt forces the model to simulate a Senior Principal Engineer's 
 * visual cortex and reasoning centers.
 */

// 1. SYSTEM INSTRUCTION - HYPER-OPTIMIZED
export const PID_ANALYSIS_SYSTEM_INSTRUCTION = `
### 1. IDENTITY & OPERATIONAL MANDATE
**DESIGNATION**: Neuro-Symbolic ISA-5.1 Inference Engine (v9.0-Architect).
**BASE MODEL**: Gemini 3.0 Pro Vision (Thinking Enabled).
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

### 4. OUTPUT DIRECTIVES
- Output **ONLY** valid JSON.
- Coordinates must be normalized [0-1000].
- The "reasoning" field is mandatory for every entity. Explain **WHY** you classified it.
`;

// 2. USER TASK PROMPT
export const PID_USER_PROMPT = `
**COMMAND**: INITIATE DEEP-DIVE ANALYSIS.

**TARGET ARTIFACT**: The attached HVAC/Process Control Document.

**OBJECTIVES**:
1.  **Inventory Extraction**: Catalog every distinct ISA-5.1 component.
2.  **Signal Graphing**: Map the connectivity. Who speaks to whom? (Source -> Medium -> Target).
3.  **Loop Identification**: Group components into functional Control Loops (e.g., "Discharge Air Temp Loop").
4.  **Engineering Validation**: Act as a PE (Professional Engineer). Flag code violations, topology errors, or ambiguous symbology.

**RESPONSE FORMAT**:
Strict adherence to the \`PID_ANALYSIS_SCHEMA\`. No markdown chatter outside the JSON.
`;

// 3. OUTPUT SCHEMA
export const PID_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    executive_summary: { 
      type: Type.STRING, 
      description: "A professional engineering assessment of the system's purpose, complexity, and design philosophy." 
    },
    entities: {
      type: Type.ARRAY,
      description: "The extracted Bill of Materials (BOM) and Symbol Map.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "UUID" },
          tag: { type: Type.STRING, description: "The Normalized Tag (e.g., TIC-101). CORRECT ROTATION ERRORS." },
          label: { type: Type.STRING, description: "The raw visual class (e.g., symbol_circle_solid_line)." },
          
          // Semantic Attributes
          functional_desc: { type: Type.STRING, description: "The ISA-5.1 definition (e.g., 'Temperature Indicator Controller')." },
          instrument_type: { type: Type.STRING, description: "Enum: ['Discrete', 'Shared Display', 'Computer', 'Logic', 'Mechanical']" },
          location: { type: Type.STRING, description: "Enum: ['Field', 'Main Panel', 'Aux Panel']" },
          
          // Topology
          parent_system: { type: Type.STRING, description: "The enclosing equipment (e.g., 'AHU-1')." },
          
          // Meta-Cognition
          reasoning: { type: Type.STRING, description: "Explain the visual features that led to this conclusion." },
          confidence: { type: Type.NUMBER, description: "0.0 to 1.0" },
          bbox_2d: {
            type: Type.ARRAY,
            description: "[ymin, xmin, ymax, xmax] (0-1000 scale)",
            items: { type: Type.NUMBER }
          }
        },
        required: ["id", "tag", "functional_desc", "instrument_type", "location", "reasoning", "bbox_2d"]
      }
    },
    connections: {
      type: Type.ARRAY,
      description: "The connectivity graph (Edges).",
      items: {
        type: Type.OBJECT,
        properties: {
          source: { type: Type.STRING, description: "Tag or ID of the sender" },
          target: { type: Type.STRING, description: "Tag or ID of the receiver" },
          medium: { type: Type.STRING, description: "Enum: ['Hydraulic', 'Pneumatic', 'Electric', 'Data', 'Capillary']" },
          description: { type: Type.STRING, description: "Contextual description (e.g., '4-20mA Signal')" }
        },
        required: ["source", "target", "medium"]
      }
    },
    control_loops: {
      type: Type.ARRAY,
      description: "Functional groups of components working together.",
      items: {
        type: Type.OBJECT,
        properties: {
          loop_id: { type: Type.STRING, description: "The common numeric identifier (e.g., '101')" },
          strategy: { type: Type.STRING, description: "e.g., 'Feedback PID', 'Cascade', 'Feedforward'" },
          components: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of tags in this loop." }
        }
      }
    },
    design_validation: {
      type: Type.ARRAY,
      description: "Engineering audit findings.",
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING, description: "CRITICAL, WARNING, INFO" },
          issue: { type: Type.STRING, description: "The detected anomaly." },
          recommendation: { type: Type.STRING, description: "The corrective action based on ASHRAE/ISA standards." }
        }
      }
    }
  }
};

// 4. COPILOT SHARED INSTRUCTION
export const COPILOT_SYSTEM_INSTRUCTION = `
### ROLE: HVAC-AGI (Expert Consultant)
You are a Distinguished Engineer in Mechanical Systems and Building Automation.

${generateISAContext()}

### INTERACTION GUIDELINES
1.  **Technical Precision**: Use correct terminology (e.g., "dry-bulb temperature", "enthalpy", "static pressure").
2.  **Safety First**: If a user suggests a configuration that violates safety codes (e.g., removing a fire damper), REJECT it and cite the code.
3.  **Holistic Thinking**: When asked about a single component, explain its impact on the wider system efficiency.
`;
