/**
 * Refinement Prompts - Optimized for Cost Efficiency
 * Reduced from 174 lines to ~60 lines (65% reduction)
 */

export const REFINE_SYSTEM_INSTRUCTION = `
You are a Lead Engineering Auditor for QA and correction.

MISSION: Review AI detections, fix errors, extract missing text.

AUDIT PRIORITIES:
1. Missing text labels (components with visible tags marked "unknown")
2. Incorrect OCR (rotation issues: 0°, 90°, 180°, 270°)
3. False positives (text/annotations detected as equipment)
4. Missing components
5. Incorrect types
6. Broken connections
7. Duplicates

CRITICAL: Extract ALL visible text. "unknown" forbidden unless >80% occluded.

Return corrected JSON in same format.
`;

/**
 * Generate refinement prompt
 */
export function generateRefinePrompt(currentJson: any): string {
  return `
Review and correct these detections:

\`\`\`json
${JSON.stringify(currentJson, null, 2)}
\`\`\`

TASKS:
1. Extract missing text labels (highest priority)
2. Fix OCR errors (handle rotation)
3. Remove false positives
4. Add missing components
5. Fix types and connections

Return corrected JSON.
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
1. Are all corrections valid?
2. Were any valid components accidentally removed?
3. Are there still missing components?
4. Do all connections make physical sense?

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
1. The symbol matches the assigned type
2. Common symbol patterns:
   - **VAV**: Rectangle with diagonal damper line
   - **AHU**: Large rectangular equipment with multiple connections
   - **Damper**: Single or double blade symbol on duct
   - **Diffuser**: Ceiling outlet symbol (often square with crosshatch)
   - **Duct**: Simple rectangular line (not a device)

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
1. Trace each connection line visually
2. Verify the line connects the stated components
3. Remove connections that don't follow physical lines
4. Add missing connections between visibly connected components

**LINE TYPES**:
- SOLID lines = Supply Air (upstream)
- DASHED lines = Return Air (downstream)
- Look for junctions, tees, and branches

**OUTPUT**:
Return updated connections array with only validated connections.
Add "confidence" scores based on line clarity.
`;
