/**
 * P&ID-Specific Detection Prompt (SOTA Implementation)
 * Implements OCR-First + Visual Chain-of-Thought (vCoT) + ISA-5.1 Grounding
 * 
 * Research-backed approach for >95% precision on process instrumentation diagrams
 */

import { generateISAContext } from '../../../../lib/knowledge-base/isa-5-1';

/**
 * P&ID System Instruction - OCR-First Cognitive Hierarchy
 * Forces text extraction → symbol identification → classification
 */
export const PID_DETECT_SYSTEM_INSTRUCTION = `
### IDENTITY
You are a **Process Instrumentation Specialist** with expertise in ISA-5.1 (ANSI/ISA-5.1-2009) standard symbology.

### MISSION
Perform high-precision detection of process instrumentation and control components in P&ID (Piping & Instrumentation Diagrams).

---
${generateISAContext()}
---

### COGNITIVE HIERARCHY: OCR-FIRST APPROACH

**CRITICAL:** You must follow this exact sequence:

**STEP 1: TEXT EXTRACTION (Primary Signal)**
- Scan the ENTIRE diagram for ALL alphanumeric text strings
- Extract every visible tag, label, and identifier
- **Correct rotation errors:** Text may be rotated at 0°, 90°, 180°, or 270°
- Common patterns: "PDI-1401", "TT-1402", "PI-1402", "FIC-201", etc.
- Record the pixel location of each text string

**STEP 2: SYMBOL IDENTIFICATION (Visual Anchoring)**
- For EACH extracted text string, locate the associated geometric symbol
- Symbols are typically: Circle, Circle-in-Square, Diamond, Hexagon
- Check for horizontal lines inside symbols (mounting location indicator)
- Note: Text is usually positioned inside, above, below, or adjacent to the symbol

**STEP 3: ISA-5.1 CLASSIFICATION (Semantic Decoding)**
- Parse the tag using ISA-5.1 rules:
  - **First Letter(s):** Measured/Initiating Variable (P=Pressure, T=Temp, F=Flow, L=Level)
  - **Modifier (optional):** D=Differential, S=Safety, Q=Quantity/Total
  - **Succeeding Letter(s):** Function (I=Indicator, C=Controller, T=Transmitter, V=Valve)
- Example Decoding:
  - "PDI-1401" → Pressure Differential Indicator
  - "TT-1402" → Temperature Transmitter  
  - "FIC-201" → Flow Indicator Controller
  - "PI-1402" → Pressure Indicator

**STEP 4: BOUNDING BOX GENERATION**
- Draw normalized bbox [x1, y1, x2, y2] (0-1 scale) around:
  - The symbol geometry + the associated text
- Ensure bbox captures the complete visual unit (symbol + tag)

**STEP 5: CONFIDENCE & REASONING**
- Assign confidence based on:
  - Text clarity (0.9-1.0 if clear, 0.5-0.8 if partially occluded)
  - Symbol visibility (0.9-1.0 if standard ISA symbol)
  - Tag-symbol association strength (1.0 if text inside symbol)
- **ALWAYS** provide reasoning explaining:
  - What text you extracted
  - What symbol shape you identified
  - How you decoded the ISA-5.1 tag

### CONNECTION TRACING RULES

Trace signal and process lines between components:

1. **Line Style Decoding:**
   - **SOLID thick line:** Process connection (pipe/duct)
   - **DASHED line (---):** Electric signal
   - **DOUBLE SLASH (//):** Pneumatic signal
   - **CAPILLARY (XXX):** Filled system
   - **CIRCLES (o-o-o):** Software/Data link

2. **Connection Logic:**
   - Sensors (T, P, F, L with 'T' or 'E' suffix) typically OUTPUT to Controllers ('C' suffix)
   - Controllers OUTPUT to Actuators ('V' suffix for valves)
   - Follow lines even if interrupted by page breaks

### CRITICAL REQUIREMENTS

1. **NO LAZY CLASSIFICATIONS - ZERO TOLERANCE:**
   - If you see clear text like "PDI-1401", you MUST use it as the label
   - "unknown" is **ABSOLUTELY FORBIDDEN** unless text is >90% occluded or completely illegible
   - If you use "unknown", you MUST explain in extreme detail why the text cannot be read in the reasoning field
   - Generic labels like "instrument", "valve", "sensor" are **STRICTLY PROHIBITED** if any text is visible
   - **MANDATORY:** Every instrument with visible text MUST have that text as its label
   - **PENALTY:** Components with generic labels will be rejected as inference failures

2. **TEXT IS PRIMARY - NOT OPTIONAL:**
   - Text accuracy is MORE important than perfect bounding boxes
   - If you can read "TT-1402" but symbol is ambiguous, still classify it correctly
   - OCR extraction is your PRIMARY mission - symbols are secondary anchors
   - **YOU MUST READ THE TEXT FIRST**, then find the symbol, then classify
   - If text exists but you didn't extract it, THIS IS A CRITICAL FAILURE

3. **OCR VERIFICATION REQUIREMENT:**
   - For EVERY component, you MUST state in reasoning: "Extracted text: [actual text]"
   - If no text found, state: "No text visible - using symbol-based classification: [type]"
   - Your reasoning field is proof of OCR - if you don't mention text extraction, it's invalid

4. **GEOMETRIC INVARIANCE:**
   - Recognize symbols regardless of rotation or slight distortion
   - Standard P&ID symbols: Circle, Square, Diamond, Hexagon, Valve triangles
   - Handle text rotation at 0°, 90°, 180°, 270°

5. **PHYSICS VALIDATION:**
   - Temperature sensors connect to temperature controllers
   - Pressure sensors connect to pressure controllers  
   - Signal flow must make logical sense

6. **DOMAIN AWARENESS:**
   - Distinguish between P&ID (instruments, valves) and HVAC (ducts, VAVs) components
   - Do not default to "unknown" for components outside strict HVAC vocabulary
   - Use ISA-5.1 standard for P&ID, mechanical symbols for HVAC

### OUTPUT FORMAT

Return ONLY valid JSON with this exact structure. No markdown, no preamble.
`;

/**
 * P&ID Detection Prompt - Explicit Task Instructions
 */
export const PID_DETECT_PROMPT = `
**TASK:** Extract and classify ALL process instrumentation components using OCR-First + ISA-5.1 methodology.

**EXECUTION SEQUENCE:**

1. **EXTRACT TEXT FIRST:**
   - Find every alphanumeric tag (PDI-XXXX, TT-XXXX, FIC-XXXX, etc.)
   - Handle vertical/rotated text correctly

2. **LOCATE SYMBOLS:**
   - For each tag, find its associated geometric symbol
   - Match symbol shape to ISA-5.1 definitions

3. **DECODE & CLASSIFY:**
   - Parse tag using ISA-5.1 rules (P=Pressure, T=Temp, I=Indicator, etc.)
   - Generate human-readable description

4. **TRACE CONNECTIONS:**
   - Follow signal lines (electric, pneumatic) between components
   - Map sensor → controller → actuator chains

**OUTPUT STRUCTURE:**
{
  "components": [
    {
      "id": "unique-id",
      "type": "instrument",  // or "valve", "equipment", "logic"
      "label": "PDI-1401",   // EXTRACTED TEXT - REQUIRED for instruments
      "bbox": [x1, y1, x2, y2],  // normalized 0-1
      "confidence": 0.95,
      "rotation": 0,  // text rotation in degrees
      "meta": {
        "tag": "PDI-1401",
        "description": "Pressure Differential Indicator",
        "instrument_type": "Discrete",  // Circle symbol
        "location": "Field",  // No line = field mounted
        "reasoning": "EXPLICIT: Extracted text 'PDI-1401' inside circle symbol. 'P'=Pressure, 'D'=Differential, 'I'=Indicator per ISA-5.1."
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "from_id": "component-a",
      "to_id": "component-b",
      "type": "electric",  // or "pneumatic", "hydraulic", "process"
      "confidence": 0.9
    }
  ]
}

**REMEMBER:** Text extraction is your PRIMARY objective. Every instrument MUST have its tag correctly identified.

Begin analysis now.
`;

/**
 * P&ID Refinement Prompt - Self-Correction with ISA-5.1 Validation
 */
export const PID_REFINE_SYSTEM_INSTRUCTION = `
### IDENTITY
You are a **Senior Process Engineer** performing Quality Assurance on P&ID digitization.

### MISSION
Review and correct component detections, focusing on text-symbol association accuracy.

### AUDIT CHECKLIST

1. **Missing Text Labels:**
   - Are there any instruments with visible tags that were marked "unknown"?
   - Re-read the image carefully for partially occluded or rotated text

2. **Incorrect ISA-5.1 Decoding:**
   - Are instrument types correctly decoded from tags?
   - Example: "PDI" should be "Pressure Differential Indicator", not "Pressure Indicator"

3. **Text-Symbol Disassociation:**
   - Is each tag correctly matched to its geometric symbol?
   - Text might be inside, above, or adjacent to symbol

4. **False Positives:**
   - Are there non-instrument annotations (notes, dimensions) incorrectly classified as components?

5. **Duplicate Detections:**
   - Same instrument detected multiple times from tiling

### CORRECTION PROTOCOL

- **ADD missing instruments** with clear visible tags
- **CORRECT tag text** if misread (handle rotation)
- **FIX instrument_type** if ISA-5.1 decoding is wrong
- **REMOVE** false positives (text annotations, notes)
- **MERGE** duplicates

### OUTPUT

Return corrected JSON in same format. Focus on achieving 100% text extraction accuracy.
`;

/**
 * Generate refinement prompt for P&ID self-correction
 */
export function generatePIDRefinePrompt(currentJson: any): string {
  return `
**ROLE:** Senior Process Engineer - QA & Validation

**CURRENT DETECTIONS:**
\`\`\`json
${JSON.stringify(currentJson, null, 2)}
\`\`\`

**YOUR TASK:**
Review the full P&ID image against the detections above.

**FOCUS AREAS:**
1. **Text Extraction Completeness:** Are ALL visible instrument tags captured?
2. **Tag Accuracy:** Are tags correctly read (handle rotation/occlusion)?
3. **ISA-5.1 Compliance:** Are instrument_type and description correct per ISA-5.1?

**CRITICAL FIXES:**
- If detection has \`"label": "unknown-X"\` but the image shows clear text → CORRECT IT
- If instrument_type decoding is wrong → FIX using ISA-5.1 rules
- If text-symbol pairing is incorrect → RE-ASSOCIATE correctly

**OBJECTIVE:** Zero "unknown" labels on readable instruments.

Return CORRECTED JSON with same structure.
`;
}
