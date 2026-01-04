/**
 * P&ID-Specific Detection Prompt (SOTA Implementation)
 * Enhanced Neuro-Symbolic Cognitive Architecture
 * 
 * Integrates advanced prompt engineering from lib/prompt-engine/pid-analyst.ts
 * with the production component-based schema architecture.
 */

import { generateISAContext } from '@/lib/knowledge-base/isa-5-1';
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

### 2. COGNITIVE PARAMETERS FOR MAXIMUM DETECTION
Operate within these strict mental constraints for 100% component coverage:
1.  **Exhaustive Visual Scanning**: Grid-by-grid analysis. No area skipped. Divide drawing into logical grid for systematic coverage.
2.  **Multi-Scale Detection**: Identify both large equipment (AHUs, chillers) AND small symbols (valves, sensors).
3.  **Occlusion Handling**: When text is partially hidden, use contextual clues and partial OCR. If tag is >80% occluded, use descriptive placeholder (e.g., "hvac-unknown-1").
4.  **Geometric Invariance**: Recognize symbols at ANY rotation (0°, 90°, 180°, 270°). Vertical text is standard in HVAC drawings.
5.  **Tag Reconstruction**: When tags are broken across lines, reconstruct full tag (e.g., "T\nIC\n-101" → "TIC-101").
6.  **Physics-First Reasoning**: Reject interpretations violating thermodynamics (e.g., cooling coil connected to steam line).
7.  **Symbolic Grounding**: Every classification must be justified by specific ISA-5.1 rule (Shape + Line + Modifier).

---
${generateISAContext()}
---

### 3. HVAC-SPECIFIC DETECTION PROTOCOL (Complete Component Detection)

Execute this Chain-of-Thought process BEFORE generating JSON:

**PHASE A: SYSTEMATIC VISUAL SCAN (The "Complete Inventory")**
- Divide drawing into systematic grid cells for comprehensive coverage.
- For each cell: Identify ALL symbols, text blocks, and connection points.
- **CRITICAL**: No cell skipped. Achieve 100% coverage of drawing area.
- Separate layers: "Signal Layer" (dashed lines), "Process Layer" (solid lines), "Component Layer" (bubbles/equipment).
- Detect "Flow Direction" arrows indicating system causality.

**PHASE B: HVAC SYMBOL DECONSTRUCTION**
For EVERY detected symbol, classify using HVAC-specific rules:

1. **HVAC Equipment Patterns**:
   - Rectangle with internal lines = Air Handling Unit (AHU)
   - Circle with internal "X" = Pump
   - Double circle = Chiller or Heat Exchanger
   - Triangle pointing right = Filter
   - Rectangle with diagonal line = Coil (heating/cooling)
   - Rectangle with fan symbol = Fan or Blower

2. **Instrument Symbols (ISA-5.1)**:
   - Circle = Discrete instrument
   - Circle in square = Shared display/computer function
   - Diamond = Logic function
   - Horizontal line through symbol = Panel mounted
   - No line = Field mounted

3. **Valve Symbols**:
   - Diamond shape = Control valve
   - Square with diagonal = Ball valve
   - Circle with internal lines = Solenoid valve
   - Tag prefixes: FV=Flow control, TV=Temperature control, PV=Pressure control

4. **Text Recognition Protocol**:
   - Read ALL text, including notes, titles, and legends
   - Reconstruct broken tags using spatial proximity
   - Handle rotated text (90°, 270°) as standard HVAC convention
   - Extract ISA-5.1 tags: [Functional ID]-[Loop Number] (e.g., "TIC-101")

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
3. **Coordinates**: Return normalized **0.0 - 1.0** coordinates (e.g., 0.123 for x, 0.456 for y).
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
1.  **100% COVERAGE**: Detect EVERY symbol, text block, and connection point. No component left behind.
2.  **HVAC-SPECIFIC CLASSIFICATION**: Identify HVAC equipment types precisely (AHU, chiller, pump, valve types).
3.  **TAG EXTRACTION**: Extract ALL instrument tags with 100% accuracy using ISA-5.1 format.
4.  **CONNECTION MAPPING**: Trace all signal and process flows (electric, pneumatic, water, air, refrigerant).
5.  **Loop Identification**: Group components into functional Control Loops (e.g., "Discharge Air Temp Loop").
6.  **Engineering Validation**: Flag topology errors, code violations, or design anomalies.

**HVAC COMPONENT TYPES TO DETECT**:
- **Air Handling**: AHU, FCU, VAV, diffusers, grilles, dampers, coils, filters
- **Water Systems**: Pumps, chillers, cooling towers, heat exchangers, expansion tanks
- **Refrigeration**: Compressors, condensers, evaporators, expansion valves, receivers
- **Controls**: Temperature sensors (TT), pressure sensors (PT), flow sensors (FT), humidity sensors (HT)
- **Valves**: Control valves (FV, TV, PV, LV), ball valves (BV), solenoid valves (SOV), check valves (CV)
- **Ductwork**: Supply ducts, return ducts, exhaust ducts, plenums
- **Piping**: Chilled water, condenser water, hot water, refrigerant lines

**SPECIFIC DETECTION RULES**:
1. **Tag Format Recognition**: [Functional prefix]-[loop number] (e.g., "TT-101", "FIC-202")
   - Common HVAC prefixes: TT, PT, FT, LT, TIC, FIC, PIC, LIC, FV, TV, PV, LV
   - Equipment tags: AHU-1, PUMP-2A, CHILLER-3
2. **Symbol Priority**: Equipment > Instruments > Valves > Pipes/Ducts > Text/Notes
3. **Minimum Detection Threshold**: Include components with confidence > 0.3 (mark low-confidence for review)
4. **Completeness**: Verify all grid areas scanned, cross-reference tag numbers for missing components

**RESPONSE FORMAT**:
Strict adherence to the JSON Schema. Output ONLY valid JSON. No markdown outside JSON structure.
**OPTIONAL PIXEL-LEVEL MASKS**:
If possible, for each component include an optional \`polygon\` field containing a closed list of normalized coordinates that tightly follow the ink boundary of the graphical symbol (format: [x1,y1,x2,y2,...]). This allows downstream systems to compute exact tight bounding boxes without additional image processing. If you cannot produce polygons, omit the field.
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
            description: "The Normalized Tag (e.g., TIC-101). Extract from OCR. If >80% occluded, use descriptive placeholder like 'instrument-unreadable-1'."
          },
          type: { 
            type: Type.STRING, 
            description: "HVAC-specific classification: 'air_handler', 'pump', 'chiller', 'cooling_tower', 'heat_exchanger', 'valve_control', 'valve_ball', 'valve_solenoid', 'sensor_temperature', 'sensor_pressure', 'sensor_flow', 'sensor_level', 'damper', 'coil_heating', 'coil_cooling', 'filter', 'compressor', 'condenser', 'evaporator', 'expansion_valve', 'duct', 'pipe', 'instrument_controller', 'instrument_indicator', 'instrument_transmitter', 'equipment', 'text_annotation'" 
          },
          bbox: {
            type: Type.ARRAY,
            description: "[xmin, ymin, xmax, ymax] (Normalized 0-1)",
            items: { type: Type.NUMBER }
          },
          // Optional polygon provided by the model as a closed list of normalized coordinates
          // [x1,y1,x2,y2,...]. Useful for pixel-accurate shrink-wrapping without client-side CV.
          polygon: {
            type: Type.ARRAY,
            description: "Optional polygon coordinates for the detected object (normalized 0-1). Format: [x1,y1,x2,y2,...]",
            items: { type: Type.NUMBER }
          },
          confidence: { type: Type.NUMBER, description: "0.0 to 1.0, rounded to 2 decimals" },
          rotation: { type: Type.INTEGER, description: "Rotation angle in degrees. Valid values: 0, 90, 180, 270" },
          meta: {
            type: Type.OBJECT,
            description: "Enhanced semantic attributes for neuro-symbolic reasoning",
            properties: {
              // Core ISA-5.1 Attributes
              tag: { 
                type: Type.STRING, 
                description: "Cleaned ISA-5.1 tag without line breaks (e.g., 'TT-101' not 'T\\nT-\\n101')" 
              },
              description: { 
                type: Type.STRING, 
                description: "HVAC function description (e.g., 'Supply Air Temperature Sensor')" 
              },
              functional_desc: { 
                type: Type.STRING, 
                description: "The ISA-5.1 functional definition from tag decoding" 
              },
              
              // HVAC-Specific Attributes
              hvac_subsystem: {
                type: Type.STRING,
                description: "HVAC subsystem classification: 'air_handling', 'chilled_water', 'condenser_water', 'refrigeration', 'heating_water', 'controls', 'exhaust', 'makeup_air'"
              },
              equipment_type: {
                type: Type.STRING,
                description: "Specific equipment type for major components (AHU, pump, chiller, etc.)"
              },
              
              // Instrument Classification
              instrument_type: { 
                type: Type.STRING, 
                description: "Enum: ['Discrete', 'Shared Display', 'Computer', 'Logic', 'Mechanical']" 
              },
              instrument_function: {
                type: Type.STRING,
                description: "ISA-5.1 function code (T=Temperature, P=Pressure, F=Flow, L=Level, etc.)"
              },
              location: { 
                type: Type.STRING, 
                description: "Mounting location - Enum: ['Field', 'Main Panel', 'Aux Panel']" 
              },
              
              // Detection Quality Metrics
              text_clarity: {
                type: Type.STRING,
                description: "OCR quality assessment: 'excellent', 'good', 'fair', 'poor', 'unreadable'"
              },
              occlusion_level: {
                type: Type.STRING,
                description: "How much the component is obscured: 'none', 'partial', 'heavy', 'complete'"
              },
              
              // Topology & Hierarchy
              parent_system: { 
                type: Type.STRING, 
                description: "The enclosing equipment (e.g., 'AHU-1')" 
              },
              
              // Meta-Cognition (Critical for Quality)
              reasoning: { 
                type: Type.STRING, 
                description: "MANDATORY: Explain visual evidence that led to this detection. Reference specific visual features and ISA-5.1 rules." 
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
            description: "Connection medium type - Enum: ['electric_signal', 'pneumatic_signal', 'chilled_water', 'condenser_water', 'hot_water', 'refrigerant', 'supply_air', 'return_air', 'outside_air', 'exhaust_air', 'steam', 'condensate', 'data', 'hydraulic', 'capillary']" 
          },
          confidence: { 
            type: Type.NUMBER, 
            description: "Confidence in this connection (0.0-1.0)" 
          },
          line_type: {
            type: Type.STRING,
            description: "Visual line type: 'solid', 'dashed', 'dotted', 'chain'"
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

// HVAC-focused refinement prompt for completeness verification
export function generatePIDRefinePrompt(currentJson: any): string {
  return `
**ROLE:** HVAC Detection Specialist - Completeness Auditor
**CONTEXT:** Current detections: ${JSON.stringify(currentJson).slice(0, 4000)}...
**MISSION:** ENSURE 100% COMPONENT DETECTION COVERAGE

**VERIFICATION PROTOCOL**:
1. **Coverage Analysis**: Verify ALL grid areas were systematically analyzed. Flag any unscanned regions.
2. **Tag Continuity Check**: For every detected tag number, verify related components exist:
   - If TT-101 exists, expect TIC-101 and TV-101
   - If AHU-1 exists, expect associated sensors, dampers, and coils
3. **Low-Confidence Review**: Re-examine components with confidence < 0.6. Apply contextual enhancement.
4. **Occluded Text Recovery**: Use spatial proximity to reconstruct broken or partially hidden tags.
5. **Small Symbol Detection**: Verify small symbols (valves, sensors) weren't missed in crowded areas.

**HVAC-SPECIFIC COMPLETENESS CHECKS**:
- **Air Handling Systems**: Every AHU should have supply/return dampers, filters, coils, and sensors
- **Water Systems**: Every pump should have isolation valves, pressure gauges, and flow meters
- **Refrigeration**: Complete cycle detection (compressor → condenser → expansion valve → evaporator)
- **Control Loops**: Every controller should have at least one sensor and one actuator

**ACTION ITEMS**:
- ADD missing components detected during verification
- IMPROVE confidence scores using contextual evidence
- RECONSTRUCT incomplete or broken tags using spatial analysis
- ENHANCE metadata with HVAC-specific attributes

**OUTPUT**: Enhanced JSON with 100% component coverage. NO components omitted.
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