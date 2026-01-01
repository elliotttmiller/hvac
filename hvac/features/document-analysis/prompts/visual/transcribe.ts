/**
 * Transcription Prompts - OCR+ with Symbol Decoding
 * Enhanced text extraction with rotation correction and symbol interpretation
 */

export const TRANSCRIBE_SYSTEM_INSTRUCTION = `
### IDENTITY
You are an **Engineering Scribe** specialized in technical document transcription and symbol decoding.

### MISSION
Extract and transcribe ALL text from technical drawings with maximum accuracy.
Handle rotated text, decode engineering symbols, and preserve formatting.

### TRANSCRIPTION RULES
1. **TEXT EXTRACTION**
   - Extract all visible text regardless of orientation
   - Preserve text hierarchy (titles, labels, notes, dimensions)
   - Maintain spatial relationships

2. **ROTATION CORRECTION**
   - Detect text at any angle (0°, 45°, 90°, 135°, 180°, 270°)
   - Read and correct orientation
   - Mark original rotation angle

3. **SYMBOL DECODING**
   - Convert engineering symbols to readable text:
     * Ø → "Diameter"
     * Δ → "Delta" / "Change"
     * ± → "Plus/Minus"
     * ° → "Degrees"
     * ∠ → "Angle"
     * ≈ → "Approximately"
   - Decode subscripts and superscripts

4. **TABLE RECOGNITION**
   - Identify tabular data structures
   - Extract headers and rows
   - Preserve cell relationships

### OUTPUT FORMAT
Return structured JSON with text blocks, tables, and metadata.
`;

export const TRANSCRIBE_PROMPT = `
**TASK**: Comprehensive Text Transcription & Symbol Decoding.

**OBJECTIVES**:
1. **TEXT EXTRACTION**: Extract all visible text
   - Title blocks, notes, labels, dimensions
   - Handle rotated text (0°, 45°, 90°, 180°, 270°)
   - Correct orientation and preserve readability

2. **SYMBOL DECODING**: Convert engineering symbols
   - Ø → Diameter
   - Δ → Delta
   - ± → Plus/Minus
   - Subscripts/superscripts → Clear notation

3. **TABLE EXTRACTION**: Identify and extract tables
   - Equipment schedules
   - General notes
   - Legend/symbol key
   - Revision blocks

**OUTPUT FORMAT**:
{
  "text_blocks": [
    {
      "id": "unique-id",
      "text": "Extracted and corrected text",
      "bbox": [x1, y1, x2, y2],  // normalized 0-1
      "confidence": 0.95,
      "rotation": 0,  // original rotation in degrees
      "font_size": "large|medium|small",
      "category": "title|label|note|dimension|annotation"
    }
  ],
  "tables": [
    {
      "id": "table-id",
      "title": "Equipment Schedule",
      "headers": ["Column1", "Column2"],
      "rows": [
        ["Data1A", "Data1B"],
        ["Data2A", "Data2B"]
      ],
      "bbox": [x1, y1, x2, y2]
    }
  ]
}

Transcribe now.
`;

/**
 * Focused prompt for extracting specific information
 */
export function generateTargetedTranscriptionPrompt(target: string): string {
  return `
**TASK**: Targeted Text Extraction - ${target}

**FOCUS**: Extract only text related to "${target}"

**INSTRUCTIONS**:
1. Scan the document for relevant text
2. Extract and transcribe accurately
3. Handle rotated text
4. Decode symbols

**OUTPUT**: JSON array of text blocks matching the target criteria.
`;
}

/**
 * Prompt for extracting dimensions and measurements
 */
export const EXTRACT_DIMENSIONS_PROMPT = `
**TASK**: Extract All Dimensions and Measurements

**OBJECTIVES**:
- Find all dimensional callouts (e.g., "24x12", "Ø18")
- Extract room dimensions
- Note elevation markers
- Identify scale information

**OUTPUT**:
{
  "dimensions": [
    {
      "value": "24x12",
      "type": "duct_size",
      "location": "Main supply duct",
      "bbox": [x1, y1, x2, y2]
    }
  ]
}
`;

/**
 * Prompt for legend/symbol key extraction
 */
export const EXTRACT_LEGEND_PROMPT = `
**TASK**: Extract Legend/Symbol Key

**OBJECTIVE**: Find and transcribe the drawing legend/symbol key

**EXTRACT**:
- Symbol descriptions
- Line type definitions (solid, dashed, dotted)
- Abbreviations and their meanings
- Equipment symbols and names

**OUTPUT**:
{
  "legend_entries": [
    {
      "symbol": "Rectangle with diagonal line",
      "meaning": "Variable Air Volume Box (VAV)",
      "additional_notes": "Indicates damper control"
    }
  ]
}
`;
