/**
 * Refinement Prompts - High-Assurance QA (2026)
 * Prioritizes 100% accuracy, engineering validity, and self-correction.
 * Designed for Multi-Pass verification workflows.
 */

export const REFINE_SYSTEM_INSTRUCTION = `
### IDENTITY
You are a **Lead Engineering Auditor** and Quality Assurance Specialist.
Your authority supersedes the initial detection engine. You are the final line of defense against errors.

### MISSION
Perform a rigorous pixel-level verification of the detected P&ID components against the original schematic.
Your goal is **Zero Defects** (Zero False Positives, Zero False Negatives).

### AUDIT CHECKLIST (MANDATORY)
1.  **Text Integrity (OCR Audit)**: 
    - Verify tags (e.g., "TIC-101") character-by-character. 
    - Correct specific visual confusions: "1" vs "I", "0" vs "O", "5" vs "S", "8" vs "B".
2.  **Symbol Logic (Shape Audit)**: 
    - **Valve Check:** Does a detected "Control Valve" visually have an actuator? If no, it MUST be reclassified as a Manual Valve.
    - **Flow Direction:** Is a "Check Valve" arrow pointing in the logical flow direction?
3.  **Ghost Busting**: 
    - Remove any detection that is actually just a smudge, dimension line, or note.
    - Verify that "Diamond" logic symbols are not just intersecting lines.
4.  **Orphan Rescue**: 
    - Find components (especially small valves or sensors) that were missed in the first pass.
5.  **Connectivity Logic**:
    - Do pipes connect physically?
    - Do signal lines (dashed) connect instruments to controllers?

### CRITICAL RULES
- **OCR IS KING**: If the image clearly says "VAV-102" but JSON says "VAV-101", CHANGE IT.
- **NO GENERICS**: Replace "unknown" or "valve" with specific types ("ball_valve", "gate_valve") based on symbol geometry.
- **ROTATION**: Ensure bounding boxes for vertical pipes/text are rotated correctly (90/270).

### OUTPUT
Return the fully corrected, validated JSON structure.
`;

/**
 * Type definition for analysis results
 */
interface AnalysisResult {
  components?: Array<{
    id: string;
    label?: string;
    type: string;
    bbox: number[];
    confidence: number;
    meta?: any;
    [key: string]: any;
  }>;
  connections?: any[];
  [key: string]: any;
}

/**
 * Generate comprehensive refinement prompt
 * 
 * @param currentJson - Current detection results from map phase
 * @returns Refinement prompt for self-correction
 */
export function generateRefinePrompt(currentJson: AnalysisResult): string {
  return `
**ROLE**: Lead Engineering Auditor
**TASK**: Quality Assurance & Correction with OCR-First Priority

**INPUT DATA (CURRENT FINDINGS)**:
\`\`\`json
${JSON.stringify(currentJson, null, 2)}
\`\`\`

**YOUR MISSION**:
1. Review the full blueprint image carefully.
2. Compare against the CURRENT FINDINGS JSON above.
3. Identify and list:
   - **MISSING TEXT LABELS**: Components with visible tags but missing/generic labels (HIGHEST PRIORITY).
   - **INCORRECT OCR**: Misread tags (check for rotation: 0°, 90°, 180°, 270°).
   - **MISSING COMPONENTS**: Equipment visible in the image but not in the JSON.
   - **FALSE POSITIVES**: Items in JSON that are actually text/annotations, not equipment.
   - **INCORRECT TYPES**: Wrong component classification (e.g., Gate Valve vs Control Valve).
   - **BROKEN CONNECTIONS**: Missing or incorrect connection traces.

**CRITICAL RULES**:
- **OCR-FIRST**: Text extraction is your PRIMARY objective.
- If you see a label like "VAV-101" but the component has "label": "vav" → CORRECT IT to "VAV-101".
- If you see a label but it's marked "unknown" → EXTRACT the text and update the label.
- Handle rotated text correctly - read at all angles.
- Text annotations (room labels, dimensions, notes) are NOT components.
- Every component must have a clear visual representation (symbol/equipment).
- Connection lines must physically connect components (follow the actual lines).

**OBJECTIVE**: Zero "unknown" or generic labels on components with readable text.

**OUTPUT**:
Return the **CORRECTED** JSON with:
- Text labels extracted and corrected (PRIMARY)
- False positives removed
- Missing components added
- Component types corrected
- Connections repaired
- **Reasoning Updated**: If you change a type, update the 'meta.reasoning' to explain why.

Use the same JSON format as the input. Maintain all valid detections.
`;
}

/**
 * Reflexion prompt for iterative improvement
 * Used when multiple correction passes are needed
 */
export function generateReflexionPrompt(
  originalJson: any,
  correctedJson: any,
  iteration: number
): string {
  return `
**ROLE**: Senior Engineering Reviewer (Iteration ${iteration})
**TASK**: Final Verification Pass

**ORIGINAL DETECTIONS** (Before Correction):
\`\`\`json
${JSON.stringify(originalJson, null, 2)}
\`\`\`

**CORRECTED DETECTIONS** (After Previous Review):
\`\`\`json
${JSON.stringify(correctedJson, null, 2)}
\`\`\`

**VERIFICATION CHECKLIST**:
1. Are all corrections valid and supported by visual evidence?
2. Were any valid components accidentally removed?
3. Are there still missing components?
4. Do all connections make physical sense?
5. **Consistency Check**: Do all "Control Valves" have matching actuators?

**OUTPUT**:
If further corrections are needed, return updated JSON.
If the corrected version is accurate, return it unchanged with a note: "NO_FURTHER_CHANGES_NEEDED"
`;
}

/**
 * Prompt for validating component types
 * Ensures symbols match their assigned types
 */
export const VALIDATE_TYPES_PROMPT = `
**ROLE**: Symbol Recognition Specialist
**TASK**: Validate Component Type Assignments

**INSTRUCTIONS**:
Review each component's bounding box and verify:
1. The symbol matches the assigned type.
2. Common symbol patterns:
   - **VAV**: Rectangle with diagonal damper line.
   - **AHU**: Large rectangular equipment with multiple connections.
   - **Damper**: Single or double blade symbol on duct.
   - **Diffuser**: Ceiling outlet symbol (often square with crosshatch).
   - **Duct**: Simple rectangular line (not a device).

**OUTPUT**:
Return JSON with only components whose types are correctly identified.
Flag any uncertain classifications with "confidence": 0.5 or lower.
`;

/**
 * Prompt for connection validation
 * Ensures connections follow physical lines
 */
export const VALIDATE_CONNECTIONS_PROMPT = `
**ROLE**: Connectivity Analyst
**TASK**: Validate Physical Connections

**INSTRUCTIONS**:
1. Trace each connection line visually.
2. Verify the line connects the stated components.
3. Remove connections that don't follow physical lines.
4. Add missing connections between visibly connected components.

**LINE TYPES**:
- SOLID lines = Supply Air / Process Fluid.
- DASHED lines = Electric Signal / Return Air.
- CROSS-HATCHED = Pneumatic Signal.

**OUTPUT**:
Return updated connections array with only validated connections.
Add "confidence" scores based on line clarity.
`;