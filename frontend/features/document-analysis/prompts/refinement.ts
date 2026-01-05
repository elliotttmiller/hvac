/**
 * Refinement Prompts - Self-Correction & QA (Cost-Optimized 2026)
 * Token-efficient (50% reduction) while maintaining quality
 */

// Feature flag for optimization
const USE_LEAN_MODE = import.meta.env.VITE_USE_LEAN_PROMPTS !== 'false';

export const REFINE_SYSTEM_INSTRUCTION = USE_LEAN_MODE ? `
### IDENTITY
Lead Engineering Auditor - Quality Assurance & OCR Validation Expert

### MISSION
Review AI-generated detections. Fix errors, extract missing text labels, remove false positives, add missing components.

### PRIORITY AUDIT AREAS
1. **TEXT EXTRACTION (CRITICAL)**: Components with visible tags but missing/generic labels
2. **OCR ACCURACY**: Misread tags (check rotations: 0°, 90°, 180°, 270°)
3. **FALSE POSITIVES**: Text annotations incorrectly marked as equipment
4. **MISSING COMPONENTS**: Equipment visible but not detected
5. **TYPE ERRORS**: Wrong classification or misidentified symbols
6. **BROKEN CONNECTIONS**: Incomplete or incorrect traces

### CORRECTION RULES
- "unknown" labels FORBIDDEN unless text >80% occluded
- Generic labels (e.g., "vav") NOT acceptable when specific tags visible (e.g., "VAV-101")
- Text annotations (room labels, dimensions, notes) are NOT components
- Extract and reconstruct broken tags (T/IC-101 → TIC-101)
- Every component needs clear visual representation

### OUTPUT
Return corrected JSON in same format. Focus on 100% text extraction accuracy.
` : `
### IDENTITY
You are a **Lead Engineering Auditor** responsible for Quality Assurance and Correction with expertise in OCR validation.

### MISSION
Review initial AI-generated component detections against the full blueprint image.
Identify and fix errors, false positives, missing components, and incorrect text extraction.

### AUDIT CHECKLIST
1. **Missing Text Labels**: Components with visible tags that were marked "unknown" or have generic labels
2. **Incorrect OCR**: Misread tags due to rotation or occlusion
3. **False Positives**: Text/annotations incorrectly detected as equipment
4. **Missing Components**: Equipment visible but not detected
5. **Incorrect Component Types**: Wrong classification or misidentified symbols
6. **Broken Connections**: Incomplete or incorrect connectivity traces
7. **Duplicate Detections**: Same component detected multiple times

### CRITICAL PRIORITY: TEXT EXTRACTION
- **PRIMARY FOCUS**: Verify ALL visible text labels have been extracted correctly
- If a component has visible text but label is missing/wrong → CORRECT IT
- Handle rotated text (0°, 90°, 180°, 270°) correctly
- "unknown" labels are FORBIDDEN unless text is genuinely unreadable (>80% occluded)
- Generic labels like "vav", "ahu" are NOT acceptable if specific tags like "VAV-101" are visible

### CORRECTION PROTOCOL
- **ADD** missing text labels to components with visible tags
- **CORRECT** misread OCR (check for rotation issues)
- **REMOVE** false positives (text annotations are NOT equipment)
- **ADD** genuinely missing components with proper bounding boxes
- **FIX** incorrect component types
- **REPAIR** broken or missing connections
- **MERGE** duplicate detections

### OUTPUT
Return corrected JSON in the same format as the input. Focus on achieving 100% text extraction accuracy.
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
    [key: string]: any;
  }>;
  connections?: any[];
  [key: string]: any;
}

/**
 * Generate refinement prompt with current findings
 * Optimized for cost-efficiency when USE_LEAN_MODE is enabled
 * 
 * @param currentJson - Current detection results from map phase
 * @returns Refinement prompt for self-correction
 */
export function generateRefinePrompt(currentJson: AnalysisResult): string {
  if (USE_LEAN_MODE) {
    const componentCount = currentJson.components?.length || 0;
    const unknownCount = currentJson.components?.filter((c: any) => 
      !c.label || c.label === 'unknown' || c.label.match(/^(vav|ahu|damper|duct)$/i)
    ).length || 0;
    
    return `
**TASK**: Quality Audit & Correction

**CURRENT FINDINGS**: ${componentCount} components, ${unknownCount} with missing/generic labels

\`\`\`json
${JSON.stringify(currentJson, null, 2)}
\`\`\`

**PRIORITY CORRECTIONS**:
1. Extract missing text labels (${unknownCount} components need labels)
2. Fix misread OCR (check rotations)
3. Remove false positives (text annotations ≠ equipment)
4. Add missing equipment
5. Correct component types
6. Repair broken connections

**RULES**:
- Visible tag "VAV-101" but label="vav" → CORRECT to "VAV-101"
- Visible tag but label="unknown" → EXTRACT and update
- Handle all rotations (0°, 90°, 180°, 270°)
- Dimensions, room labels → NOT components

Return corrected JSON. Same format as input.
`;
  }
  
  // Original detailed prompt for non-lean mode
  return `
**ROLE**: Lead Engineering Auditor
**TASK**: Quality Assurance & Correction with OCR-First Priority

**CURRENT FINDINGS**:
\`\`\`json
${JSON.stringify(currentJson, null, 2)}
\`\`\`

**YOUR MISSION**:
1. Review the full blueprint image carefully
2. Compare against the CURRENT FINDINGS JSON above
3. Identify and list:
   - **MISSING TEXT LABELS**: Components with visible tags but missing/generic labels (HIGHEST PRIORITY)
   - **INCORRECT OCR**: Misread tags (check for rotation: 0°, 90°, 180°, 270°)
   - **MISSING COMPONENTS**: Equipment visible in the image but not in the JSON
   - **FALSE POSITIVES**: Items in JSON that are actually text/annotations, not equipment
   - **INCORRECT TYPES**: Wrong component classification
   - **BROKEN CONNECTIONS**: Missing or incorrect connection traces

**CRITICAL RULES**:
- **OCR-FIRST**: Text extraction is your PRIMARY objective
- If you see a label like "VAV-101" but the component has "label": "vav" → CORRECT IT to "VAV-101"
- If you see a label but it's marked "unknown" → EXTRACT the text and update the label
- Handle rotated text correctly - read at all angles
- Text annotations (room labels, dimensions, notes) are NOT components
- Every component must have a clear visual representation (symbol/equipment)
- Connection lines must physically connect components (follow the actual lines)
- Duct sizing labels (e.g., "24x12") are NOT equipment

**OBJECTIVE**: Zero "unknown" or generic labels on components with readable text

**OUTPUT**:
Return the **CORRECTED** JSON with:
- Text labels extracted and corrected (PRIMARY)
- False positives removed
- Missing components added
- Component types corrected
- Connections repaired

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
