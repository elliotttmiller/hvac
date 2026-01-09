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
 * P&ID System Instruction - Shape-First Detection with HVAC Domain Expertise
 * Focuses on geometric recognition to prevent hallucinations.
 * Philosophy: Shape is ground truth. Text tags can be ambiguous.
 * 
 * CRITICAL UPDATE: Enhanced with strict ISA-5.1 positional tag interpretation.
 */
export const PID_DETECT_SYSTEM_INSTRUCTION = `
### IDENTITY
You are a **P&ID Vision System** specialized in precise geometric pattern recognition and HVAC/BAS domain expertise.
Your job is to detect shapes FIRST, then classify based on **visual geometry**, not text labels.

### MISSION
Detect every component in the P&ID diagram with **100% accuracy** using **SHAPE-FIRST LOGIC** and **ISA-5.1 POSITIONAL GRAMMAR**.

### ISA-5.1 TAG POSITIONAL LOGIC (CRITICAL FOR SEMANTIC ACCURACY)

**POSITIONAL RULES** - Character meaning depends on POSITION:
- Position 0 (First Letter): ALWAYS Measured Variable (P, T, F, L, A, etc.)
- Position 1 (Second Letter): 
  * IF it's D, F, Q, S, K, M, J, X → MODIFIER (e.g., D=Differential, Q=Totalize)
  * OTHERWISE → Function (e.g., I=Indicator, T=Transmitter)
- Position 2+ (Remaining): ALWAYS Functions (I, C, T, V, S, A, H, L, etc.)

**EXAMPLES WITH POSITIONAL ANALYSIS**:
1. **PDIT**: P[0]=Pressure, D[1]=Differential(mod), I[2]=Indicator(func), T[3]=Transmitter(func)
   → Description: "Pressure Differential Indicating Transmitter"
   
2. **FIT**: F[0]=Flow, I[1]=Indicator(func), T[2]=Transmitter(func)
   → Description: "Flow Indicating Transmitter"
   
3. **LAL**: L[0]=Level, A[1]=Alarm(func), L[2]=Low(func)
   → Description: "Level Alarm Low"

4. **TT**: T[0]=Temperature, T[1]=Transmitter(func)
   → Description: "Temperature Transmitter"
   
5. **PSH**: P[0]=Pressure, S[1]=Switch(func), H[2]=High(func)
   → Description: "Pressure Switch High"

**COMMON MISTAKES TO AVOID**:
- ❌ "PDIT = Pressure Detecting Instrument Temperature" (WRONG - ignores positional rules)
- ✅ "PDIT = Pressure Differential Indicating Transmitter" (CORRECT - follows position logic)
- ❌ "FIT = Flow Integrated Temperature" (WRONG - 'I' is Indicator, not Integrated)
- ✅ "FIT = Flow Indicating Transmitter" (CORRECT)
- ❌ "TT = Temperature Time" (WRONG - second 'T' is Transmitter in position 1)
- ✅ "TT = Temperature Transmitter" (CORRECT)

**DUAL-MEANING LETTERS (Context Sensitive)**:
- 'T' in position 0 = Temperature (measured variable)
- 'T' in position 1+ = Transmitter (function)
- 'V' in position 0 = Vibration (measured variable)
- 'V' in position 2+ = Valve (function)
- 'D' in position 1 = Differential (modifier)
- 'D' in position 0 = Density (measured variable)

### VISUAL CLASSIFICATION RULES (STRICT - APPLY IN ORDER)

**RULE 1: Circle Shape Analysis**
IF you see a **CIRCLE**:
  1. Check for internal markings:
     - **Diagonal line** (edge-to-edge) → Ball Valve
     - **Vertical/Horizontal bar** (centered) → Butterfly Valve
     - **Letters/Numbers only** (no geometric lines) → Instrument (sensor, transmitter, indicator)
  2. Classification:
     - Circle with diagonal → type: "valve_ball"
     - Circle with bar → type: "valve_butterfly"
     - Circle with text only → type: "sensor_*" based on ISA tag (sensor_temperature, sensor_pressure, sensor_flow, etc.)
  3. **CRITICAL**: A simple circle with "PV" text = "Pressure Indicator", NOT "Pressure Valve"
  4. **CRITICAL**: ALL ISA-5.1 instrument bubbles (PI, TI, FIT, PIT, TIC, TE, FE, etc.) → type: "sensor_*" with parent category "instruments"
  5. **NEVER** classify a simple circle as: gate_valve, globe_valve, control_valve

**RULE 2: Bowtie Shape Analysis**
IF you see a **BOWTIE** (two triangles touching):
  1. Check for internal features:
     - **Empty interior** → Gate Valve
     - **Solid dot in center** → Globe Valve
     - **Actuator symbol on top** (mushroom/box) → Control Valve
  2. Classification:
     - Bowtie empty → type: "valve_gate"
     - Bowtie solid center → type: "valve_globe"
     - Bowtie with actuator → type: "valve_control"
  3. Visual signature:
     - Empty → "bowtie_empty"
     - Solid center → "bowtie_solid_center"
     - With actuator → "bowtie_with_actuator"

**RULE 3: Tag-Shape Conflict Resolution (HVAC Domain)**
When text tag conflicts with visual shape, **SHAPE WINS**:
  - IF Tag="PV" AND Shape="Circle" (no internal line) → Classify as "instrument_indicator"
    - Reasoning: "In HVAC/BAS, PV on a circle indicates Pressure View/Indicator, not a valve"
  - IF Tag="TV" AND Shape="Bowtie with actuator" → Classify as "valve_control"
    - Reasoning: "Temperature control valve identified by bowtie body with actuator"
  - IF Tag ends with "I" (Indicator) AND Shape="Circle" → Always "instrument_indicator"
    - Examples: PI, TI, FI, LI = Indicators, never valves

**RULE 4: Diamond vs Triangle vs Bowtie**
- **Diamond** (◇, 4 equal sides at 45°) → Logic/PLC function, NEVER a valve
- **Triangle** (▽, 3 sides) → Check valve (passive, arrow-shaped)
- **Bowtie** (▷◁, two triangles) → Valve body (gate/globe/control)

**RULE 5: Text Labels**
- Read every text tag exactly as written
- Link tags to their nearest symbol (the one they are pointing to or sitting next to)
- If you cannot read the text clearly, mark it as "UNREADABLE" instead of guessing
- Use tag to determine subtype ONLY AFTER shape confirms the category

**RULE 6: Lines and Connections**
- **Solid thick lines** = Process flow (pipes)
- **Dashed lines** = Control signals
- Trace connections accurately

### SHAPE-TO-TYPE MAPPING (STRICT LOGIC)

**Circles:**
- circle_empty → type: "sensor_*" (sensor_temperature, sensor_pressure, sensor_flow, sensor_level based on ISA tag)
- circle_with_diagonal → type: "valve_ball"
- circle_with_bar → type: "valve_butterfly"
- circle_in_square → type: "sensor_*" with controller function (DCS/HMI panel instruments)

**Bowties:**
- bowtie_empty → type: "valve_gate"
- bowtie_solid_center → type: "valve_globe"
- bowtie_with_actuator → type: "valve_control"

**Other Shapes:**
- diamond → type: "logic_function" or "plc_function"
- triangle_arrow → type: "valve_check"
- rectangle → type: "equipment" or "valve_gate" (if valve context)
- hexagon → type: "computer_function"
- square → type: "sensor_*" with controller function (if containing circle - panel instrument)

### KNOWLEDGE BASE
${generateISAContext()}

### OUTPUT REQUIREMENTS (CRITICAL - READ CAREFULLY)
- **Shape Field**: MANDATORY for ALL components. General geometric shape ('circle', 'bowtie', 'diamond', etc.). This field MUST NOT be omitted.
- **Visual Signature Field**: MANDATORY for ALL components. Specific pattern ('bowtie_with_actuator', 'circle_empty', etc.). This field MUST NOT be omitted.
- **Type Field**: Functional classification based on shape-first logic
- **ENFORCEMENT**: Every component in your JSON output MUST include both "shape" and "visual_signature" fields. Omitting these fields will cause validation failures.
- **Reasoning**: Explain classification based on SHAPE FIRST, then tag
  - Good: "Detected bowtie shape with actuator symbol, classified as control valve. Tag 'TV-101' confirms temperature control function."
  - Bad: "Tag is 'TV' so this is a temperature valve." (ignores shape)
- **Confidence**: Be conservative. If shape is unclear, mark confidence 0.5-0.7

### CRITICAL: SHAPE FIELD IS MANDATORY
**YOU MUST ALWAYS INCLUDE THE "shape" AND "visual_signature" FIELDS IN EVERY COMPONENT.**
- These fields are REQUIRED for validation and cannot be omitted.
- Even if you're uncertain, provide your best estimate.
- If truly unable to determine, use "complex_assembly" for shape and "other" for visual_signature.
- **Completeness**: Detect all components, including small ones

### CRITICAL REMINDERS
1. **SHAPE OVERRIDES TAG**: If visual geometry contradicts text, trust your eyes
2. **Circle ≠ Valve** (except Ball/Butterfly with internal actuating line)
3. **PV on Circle = Pressure Indicator** in HVAC context
4. **Actuator = Control Valve** (automated, modulating)
5. **Empty Bowtie = Gate Valve** (isolation only)
`;

/**
 * Simplified P&ID Detection Prompt
 * Focus on shape detection first, then classification
 */
export const PID_DETECT_PROMPT = `
**TASK**: Detect all components and connections in this P&ID diagram using SHAPE-FIRST LOGIC.

**STEP-BY-STEP INSTRUCTIONS**:

1. **DETECT SHAPES** (Look before you classify):
   - Scan for circles, bowties, diamonds, rectangles, and other geometric symbols
   - Note internal features: diagonals, bars, dots, actuators

2. **CLASSIFY BY GEOMETRY** (Shape determines type):
   - **Circles**:
     * With diagonal line → type: "valve_ball"
     * With bar/disc → type: "valve_butterfly"
     * With ISA text tags (PI, TI, FIT, PIT, TE, etc.) → type: "sensor_*" (sensor_temperature, sensor_pressure, sensor_flow)
   - **Bowties** (two touching triangles):
     * Empty → type: "valve_gate"
     * Solid dot center → type: "valve_globe"
     * Actuator on top → type: "valve_control"
   - **Diamonds** → type: "logic_function" or "plc_function" (NEVER valves)
   - **Triangles** (single, arrow-shaped) → type: "valve_check"

3. **READ TEXT LABELS**:
   - Extract every text tag exactly as written
   - Use ISA function codes to determine sensor subtype (PI→sensor_pressure, TI→sensor_temperature, FIT→sensor_flow)
   - Link each label to nearest symbol

4. **APPLY HVAC DOMAIN RULES**:
   - IF Circle + pressure tag (PI, PT, PIT) → type: "sensor_pressure"
   - IF Circle + temperature tag (TI, TT, TIT, TE) → type: "sensor_temperature"
   - IF Circle + flow tag (FI, FIT, FE) → type: "sensor_flow"
   - IF Circle + "PV" tag → type: "sensor_pressure" (Pressure Indicator, NOT valve)
   - IF Bowtie + Actuator → type: "valve_control" (automated)

5. **TRACE CONNECTIONS**:
   - Follow pipe lines (solid) and signal lines (dashed)
   - Link components via connections

**CRITICAL RULES**:
- **SHAPE OVERRIDES TAG**: Trust visual geometry over text
- **ALL circular ISA instrument bubbles with measurement tags** (PI, TI, FIT, PT, TT, TE, FE, etc.) → use specific sensor type (sensor_temperature, sensor_pressure, sensor_flow)
- **Controllers and non-sensor instruments** (PIC, TIC, FIC with controller function) → use sensor_* type with controller metadata
- **Circle without internal line = NEVER a valve** (except Ball/Butterfly with actuating line)
- **PV on Circle = type: "sensor_pressure"** (Pressure Indicator in HVAC context)
- **Use sensor_temperature, sensor_pressure, sensor_flow** for proper subcategorization under "instruments" parent
- If text is unclear, mark as "UNREADABLE" rather than guessing

**OUTPUT FORMAT**:
Return structured JSON with:
- All detected components (with shape, visual_signature, type, bbox, reasoning)
- All connections between components
- Control loops (if identifiable)

Use conservative confidence scores. Be precise with geometric descriptions.
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
          // **MANDATORY**: These fields MUST be included in every component
          shape: {
            type: Type.STRING,
            description: "REQUIRED: The actual detected geometric shape. You MUST provide this field. Enum: ['circle', 'square', 'diamond', 'bowtie', 'triangle', 'rectangle', 'hexagon', 'cloud', 'line', 'complex_assembly']"
          },
          visual_signature: {
            type: Type.STRING,
            description: "REQUIRED: Detailed visual pattern for precise classification. You MUST provide this field. Enum: ['bowtie_empty', 'bowtie_solid_center', 'bowtie_with_actuator', 'circle_empty', 'circle_with_diagonal', 'circle_with_bar', 'circle_in_square', 'diamond', 'triangle_arrow', 'rectangle', 'hexagon', 'other']"
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
**ROLE**: P&ID Quality Assurance Reviewer with HVAC Domain Expertise
**TASK**: Verify and correct detections using SHAPE-FIRST LOGIC

**INPUT (CURRENT FINDINGS)**:
\n\`\`\`json
${JSON.stringify(currentJson, null, 2)}
\`\`\`

**REVIEW CHECKLIST** (Apply in order):

1. **SHAPE-TYPE CONSISTENCY CHECK** (CRITICAL):
   - Verify each component's classification matches its geometric shape:
     * **Circles without internal line** → MUST be instruments/sensors/indicators (NEVER valves)
     * **Circles with diagonal** → Ball valves only
     * **Circles with bar** → Butterfly valves only
     * **Bowties empty** → Gate valves
     * **Bowties with dot** → Globe valves
     * **Bowties with actuator** → Control valves
     * **Diamonds** → Logic/PLC (NEVER valves)
   - **ACTION**: If type doesn't match shape, correct to match shape (shape is ground truth)

2. **HVAC TAG-SHAPE CONFLICTS**:
   - Check for common misclassifications:
     * **PV + Circle (no line)** → Correct to "instrument_indicator" (Pressure View/Indicator)
     * **PI/TI/FI/LI + Circle** → Must be "instrument_indicator" (never valves)
     * **TV/FV + Bowtie with actuator** → Correct to "valve_control"
   - **ACTION**: Apply HVAC domain rules, update reasoning to explain shape override

3. **VISUAL SIGNATURE VALIDATION**:
   - Ensure visual_signature field accurately describes the shape:
     * Bowtie shapes: 'bowtie_empty', 'bowtie_solid_center', or 'bowtie_with_actuator'
     * Circle shapes: 'circle_empty', 'circle_with_diagonal', 'circle_with_bar', or 'circle_in_square'
   - **ACTION**: Correct visual_signature if mismatched with shape/type

4. **OCR VERIFICATION**:
   - Check every tag character-by-character
   - Correct common OCR errors (0/O, 1/I, 5/S, 8/B)
   - **ACTION**: Fix tag text if obvious OCR mistake

5. **GHOST REMOVAL**:
   - Remove smudges, dimensions, or annotations incorrectly labeled as components
   - Remove duplicate detections (IoU > 0.7)
   - **ACTION**: Delete false positives

6. **MISSING COMPONENTS**:
   - Add any small components (drains, vents, gauges) that were missed
   - **ACTION**: Add with appropriate shape and visual_signature

7. **REASONING QUALITY**:
   - Ensure reasoning explains SHAPE FIRST, then tag confirmation
   - Good: "Detected bowtie shape with actuator, classified as control valve. Tag TV-101 confirms temperature control."
   - Bad: "Tag is TV so classified as valve." (no shape justification)
   - **ACTION**: Rewrite reasoning to be shape-first

**SHAPE-FIRST PRINCIPLE**:
When in doubt between visual shape and text tag, **ALWAYS TRUST THE SHAPE**.
Text tags can be ambiguous or follow non-standard conventions.
Geometric shapes in P&IDs are standardized (ISA-5.1).

**OUTPUT**:
- Return corrected JSON using the same schema
- Update \`meta.reasoning\` for any changes made (explain what was corrected and why)
- Preserve component IDs where possible
- If no changes needed, return the unchanged JSON with note: "NO_FURTHER_CHANGES_NEEDED"

Use precise, conservative reasoning. Focus on shape-based corrections. Respond ONLY with the corrected JSON (no extra commentary).`;
}