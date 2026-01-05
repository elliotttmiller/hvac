# Prompt Engineering Best Practices Guide

**State-of-the-Art Prompt Engineering for AI Vision Models (2024-2025)**

This guide consolidates industry best practices for prompt engineering, specifically optimized for AI vision models producing structured JSON outputs. These techniques are applied throughout our HVAC AI platform to maximize accuracy, consistency, and reliability.

---

## Table of Contents

1. [Core Principles](#core-principles)
2. [Structured Output Engineering](#structured-output-engineering)
3. [Few-Shot Learning Techniques](#few-shot-learning-techniques)
4. [Chain-of-Thought Reasoning](#chain-of-thought-reasoning)
5. [Delimiter and Organization Strategies](#delimiter-and-organization-strategies)
6. [Vision Model Specific Techniques](#vision-model-specific-techniques)
7. [Iteration and Refinement](#iteration-and-refinement)
8. [Quality Assurance and Validation](#quality-assurance-and-validation)
9. [Platform-Specific Implementation](#platform-specific-implementation)

---

## Core Principles

### 1. Clarity and Specificity

**Principle**: Be explicit and unambiguous in all instructions.

**Implementation:**
```markdown
❌ BAD: "Analyze this image"
✅ GOOD: "Detect all HVAC components in this P&ID schematic. For each component, extract the ISA-5.1 tag, type, bounding box coordinates (normalized 0-1), and confidence score."
```

**Guidelines:**
- State the exact task in the first sentence
- Define all expected outputs explicitly
- Specify data types, formats, and constraints
- Avoid ambiguous terms like "some", "might", "usually"
- Use technical terminology consistently

**Example from Platform:**
```typescript
export const CLASSIFY_PROMPT = `
**TASK**: Classify this document into exactly one of four categories.

**CATEGORIES**:
1. BLUEPRINT - Architectural and mechanical drawings
2. SCHEMATIC - Process and instrumentation diagrams
3. SPEC_SHEET - Text-heavy specification documents
4. SCHEDULE - Tabular equipment lists and schedules

**OUTPUT FORMAT**: JSON with fields: type, confidence, reasoning
`;
```

### 2. Context Engineering

**Principle**: Provide domain-specific context to guide model understanding.

**Implementation:**
```markdown
❌ BAD: "You are an AI assistant"
✅ GOOD: "You are a Distinguished HVAC Systems Engineer with expertise in ISA-5.1 instrumentation standards, P&ID interpretation, and building automation systems."
```

**Context Layers:**
1. **Identity**: Define the AI's role and expertise
2. **Domain Knowledge**: Reference relevant standards and methodologies
3. **Task Framing**: Position the task within professional context
4. **Quality Expectations**: Set industry-standard quality bars

**Example from Platform:**
```typescript
export const PID_DETECT_SYSTEM_INSTRUCTION = `
### 1. IDENTITY & OPERATIONAL MANDATE
**DESIGNATION**: Neuro-Symbolic ISA-5.1 Inference Engine (v9.0-Architect).
**EXPERTISE**: Industrial Automation, HVAC Control Topology, Forensic Blueprint Analysis.
**REFERENCE STANDARD**: ANSI/ISA-5.1-2009 (Instrumentation Symbols and Identification).

**YOUR MISSION**:
You are a **Digital Twin Generator**. Your goal is to perform a loss-less, 
pixel-perfect extraction of the provided P&ID and convert it into a semantic, 
physics-compliant Knowledge Graph.
`;
```

### 3. Constraint Definition

**Principle**: Explicitly state all constraints, boundaries, and validation rules.

**Implementation:**
```markdown
**CONSTRAINTS**:
1. Rotation MUST be an INTEGER (0, 90, 180, 270) - NEVER use floats
2. Confidence MUST be rounded to 2 decimal places (e.g., 0.95)
3. Coordinates MUST be normalized to 0.0-1.0 range
4. All fields marked REQUIRED must be present
5. Maximum output length: 8192 tokens
```

**Constraint Categories:**
- **Data Type Constraints**: Integer, float, string, enum
- **Range Constraints**: Min/max values, allowed ranges
- **Format Constraints**: Date formats, coordinate systems, tag patterns
- **Structural Constraints**: Required fields, array lengths, nesting depth
- **Logical Constraints**: Business rules, physics validation

---

## Structured Output Engineering

### 1. Predefined JSON Schemas

**Principle**: Define exact JSON structure with field-level specifications.

**Best Practice Pattern:**
```typescript
export const SCHEMA = {
  type: "object" as const,
  properties: {
    field_name: {
      type: "string",
      description: "Clear description of purpose, format, and constraints"
    },
    numeric_field: {
      type: "number",
      description: "Range: 0.0-1.0, rounded to 2 decimals"
    },
    enum_field: {
      type: "string",
      enum: ["option1", "option2", "option3"],
      description: "Must be one of the enumerated values"
    }
  },
  required: ["field_name", "numeric_field"]
};
```

**Schema Design Principles:**
1. **Descriptive Field Names**: Use clear, unambiguous names
2. **Comprehensive Descriptions**: Explain purpose, format, valid values
3. **Type Safety**: Specify exact types (string, number, integer, boolean)
4. **Required vs Optional**: Clearly mark required fields
5. **Nested Structures**: Use objects and arrays appropriately
6. **Validation Rules**: Embed constraints in descriptions

**Example from Platform:**
```typescript
export const PID_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    components: {
      type: Type.ARRAY,
      description: "Complete component inventory with bounding boxes",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { 
            type: Type.STRING, 
            description: "Unique identifier - use extracted ISA-5.1 tag or UUID" 
          },
          label: { 
            type: Type.STRING, 
            description: "Normalized tag (e.g., TIC-101). If >80% occluded, use descriptive placeholder." 
          },
          type: { 
            type: Type.STRING, 
            description: "HVAC component type: air_handler, pump, chiller, sensor_temperature, etc." 
          },
          bbox: {
            type: Type.ARRAY,
            description: "[xmin, ymin, xmax, ymax] normalized to 0-1 range",
            items: { type: Type.NUMBER }
          },
          confidence: { 
            type: Type.NUMBER, 
            description: "Detection confidence: 0.0-1.0, rounded to 2 decimals" 
          }
        },
        required: ["id", "label", "type", "bbox", "confidence"]
      }
    }
  },
  required: ["components"]
};
```

### 2. Response Format Instructions

**Principle**: Explicitly request JSON format and specify handling of edge cases.

**Template:**
```markdown
**OUTPUT FORMAT**:
- Return ONLY valid JSON matching the provided schema
- Do NOT include markdown code blocks (```json)
- Do NOT include explanatory text outside JSON
- Use null for missing/unknown values
- Empty arrays [] for no results, NOT null
- Ensure all required fields are present
```

**Edge Case Handling:**
```markdown
**EDGE CASES**:
- If component tag is unreadable: Use descriptive placeholder (e.g., "sensor-unreadable-1")
- If confidence is uncertain: Default to 0.5
- If bounding box cannot be determined: Use [0.0, 0.0, 0.0, 0.0]
- If component type is ambiguous: Use "equipment" generic type
```

---

## Few-Shot Learning Techniques

### 1. Example-Based Learning

**Principle**: Provide concrete examples of expected input-output pairs.

**Structure:**
```markdown
**EXAMPLE 1 (Positive Case)**:
Input: Temperature sensor with tag "TT-101" at top-left
Output: 
{
  "id": "TT-101",
  "label": "TT-101",
  "type": "sensor_temperature",
  "bbox": [0.05, 0.05, 0.15, 0.10],
  "confidence": 0.95
}

**EXAMPLE 2 (Edge Case)**:
Input: Partially occluded valve with broken tag "T...V-...02"
Output:
{
  "id": "valve-unknown-1",
  "label": "TV-102",  // Reconstructed from context
  "type": "valve_control",
  "bbox": [0.45, 0.60, 0.50, 0.65],
  "confidence": 0.65,
  "meta": {
    "occlusion_level": "partial",
    "tag_reconstruction": true
  }
}

**EXAMPLE 3 (Negative Case - What NOT to do)**:
❌ WRONG: { "components": null }
✅ CORRECT: { "components": [] }
```

**Few-Shot Design Principles:**
1. **Positive Examples**: Show ideal cases
2. **Edge Cases**: Demonstrate handling of ambiguity
3. **Negative Examples**: Show common mistakes to avoid
4. **Progressive Complexity**: Start simple, increase difficulty
5. **Diverse Coverage**: Cover all major scenarios

### 2. Pattern Recognition Training

**Implementation:**
```markdown
**PATTERN LEARNING**:
When you see these visual patterns, classify as follows:

1. Circle with letters "TT" → sensor_temperature
2. Circle with letters "PT" → sensor_pressure
3. Diamond shape with "TV" → valve_control
4. Rectangle with internal fan symbol → fan or blower
5. Circle with internal "X" → pump

Practice on this example:
[Show image with labeled examples]
```

---

## Chain-of-Thought Reasoning

### 1. Step-by-Step Processing

**Principle**: Break complex tasks into sequential reasoning steps.

**Pattern:**
```markdown
**REASONING PROTOCOL** (Execute BEFORE generating JSON):

**STEP 1: Visual Scanning**
- Divide drawing into systematic grid (4x4 or 8x8)
- Scan each cell methodically (left-to-right, top-to-bottom)
- Note all symbols, text, and connection lines

**STEP 2: Symbol Classification**
For each detected symbol:
- Identify base shape (circle, diamond, rectangle, etc.)
- Check for modifiers (lines through symbol, internal markings)
- Read associated text/tags
- Cross-reference with ISA-5.1 symbol library

**STEP 3: Relationship Mapping**
- Trace connection lines between components
- Identify signal types (solid, dashed, dotted)
- Group components into control loops
- Map equipment sequences

**STEP 4: Validation**
- Verify tag format compliance (ISA-5.1)
- Check for physics violations
- Confirm complete coverage
- Validate confidence scores

**STEP 5: JSON Generation**
- Convert analysis to structured JSON
- Ensure all required fields present
- Apply numerical constraints
- Add reasoning metadata
```

**Benefits:**
- Improves accuracy on complex tasks
- Provides transparency in decision-making
- Enables debugging of reasoning errors
- Reduces hallucination and logical errors

### 2. Cognitive Constraints

**Principle**: Define "mental model" parameters to guide reasoning.

**Example from Platform:**
```typescript
### 2. COGNITIVE PARAMETERS FOR MAXIMUM DETECTION
Operate within these strict mental constraints:
1.  **Exhaustive Visual Scanning**: Grid-by-grid analysis. No area skipped.
2.  **Multi-Scale Detection**: Identify both large equipment AND small symbols.
3.  **Occlusion Handling**: Use contextual clues for partially hidden components.
4.  **Geometric Invariance**: Recognize symbols at ANY rotation (0°, 90°, 180°, 270°).
5.  **Tag Reconstruction**: Reconstruct broken tags across lines (e.g., "T\nIC\n-101" → "TIC-101").
6.  **Physics-First Reasoning**: Reject interpretations violating thermodynamics.
7.  **Symbolic Grounding**: Every classification justified by ISA-5.1 rule.
```

---

## Delimiter and Organization Strategies

### 1. Clear Section Marking

**Principle**: Use visual delimiters to separate instruction components.

**Implementation:**
```markdown
### 1. IDENTITY
[Role and expertise definition]

---

### 2. TASK DEFINITION
[Specific task instructions]

---

### 3. INPUT SPECIFICATION
[Expected input format and characteristics]

---

### 4. OUTPUT REQUIREMENTS
**FORMAT**: [Structure definition]
**CONSTRAINTS**: [Validation rules]
**SCHEMA**: [JSON schema]

---

### 5. EXAMPLES
[Few-shot examples]

---

### 6. EDGE CASES
[Special handling instructions]
```

**Delimiter Options:**
- `---` Horizontal rules
- `###` Markdown headers
- `**SECTION:**` Bold markers
- XML-style tags: `<INSTRUCTIONS>...</INSTRUCTIONS>`
- Triple backticks for code/schema blocks

### 2. Hierarchical Organization

**Structure:**
```
LEVEL 1: Major Sections (### or ----)
  LEVEL 2: Subsections (**Bold** or ####)
    LEVEL 3: Details (Bullets or numbered lists)
      LEVEL 4: Examples (Indented blocks)
```

**Benefits:**
- Improves prompt readability
- Helps model parse complex instructions
- Enables selective attention to relevant sections
- Reduces ambiguity and cross-contamination

---

## Vision Model Specific Techniques

### 1. Image Context Description

**Principle**: Provide visual context even though model can "see" the image.

**Pattern:**
```markdown
**IMAGE CONTEXT**:
You are analyzing a P&ID schematic showing:
- Medium: HVAC control systems
- Expected components: 20-100 items
- Complexity: Industrial-grade with ISA-5.1 tagging
- Quality: Engineering drawing (line art, not photo)
- Layout: Multi-zone system with equipment and instrumentation
```

**Why This Helps:**
- Primes model for specific visual patterns
- Sets expectations for complexity and detail
- Activates relevant pattern recognition
- Reduces misclassification of similar-looking items

### 2. Multi-Modal Integration

**Pattern:**
```markdown
**ANALYSIS PROTOCOL**:
1. **Visual Analysis**: Detect symbols, shapes, and spatial relationships
2. **Text Extraction**: OCR all labels, tags, and annotations
3. **Symbolic Reasoning**: Apply ISA-5.1 knowledge to classify components
4. **Topological Mapping**: Trace connections and relationships
5. **Synthesis**: Generate structured knowledge representation
```

### 3. Spatial Reasoning Instructions

**Technique:**
```markdown
**SPATIAL AWARENESS**:
- Components near each other often belong to same subsystem
- Follow connection lines to identify relationships
- Vertical text is standard in HVAC drawings (not an error)
- Rotated symbols (90°, 180°, 270°) are normal
- Overlapping elements indicate layered information (not occlusion)
```

---

## Iteration and Refinement

### 1. Multi-Pass Processing

**Architecture:**
```markdown
**PASS 1: Initial Detection**
- Comprehensive component detection
- Broad classification
- High recall, moderate precision

**PASS 2: Refinement**
- Improve classification accuracy
- Resolve ambiguities
- Enhance confidence scores

**PASS 3: Validation**
- Check completeness
- Verify tag formats
- Validate relationships
- Flag anomalies
```

**Implementation in Code:**
```typescript
// Example from platform
export function generatePIDRefinePrompt(currentJson: any): string {
  return `
**ROLE:** HVAC Detection Specialist - Completeness Auditor
**CONTEXT:** Current detections: ${JSON.stringify(currentJson).slice(0, 4000)}...
**MISSION:** ENSURE 100% COMPONENT DETECTION COVERAGE

**VERIFICATION PROTOCOL**:
1. Coverage Analysis: Verify ALL grid areas analyzed
2. Tag Continuity: Check for related components (if TT-101, expect TIC-101)
3. Low-Confidence Review: Re-examine components with confidence < 0.6
4. Occluded Text Recovery: Use spatial proximity to reconstruct tags

**ACTION ITEMS**:
- ADD missing components
- IMPROVE confidence scores using context
- RECONSTRUCT incomplete tags
- ENHANCE metadata
  `;
}
```

### 2. Self-Correction Patterns

**Technique:**
```markdown
**SELF-CHECK**:
Before finalizing output, verify:
1. ✓ All required fields present
2. ✓ All numerical values in valid ranges
3. ✓ All enum values from allowed list
4. ✓ No null values for required fields
5. ✓ JSON is valid (no trailing commas, quotes balanced)
6. ✓ Reasoning provided for all classifications
7. ✓ Confidence scores justified by visual evidence
```

---

## Quality Assurance and Validation

### 1. Confidence Calibration

**Principle**: Request realistic, calibrated confidence scores.

**Guidelines:**
```markdown
**CONFIDENCE SCORING**:
- 0.95-1.00: Crystal clear, unambiguous detection
- 0.80-0.94: Clear detection with minor uncertainty
- 0.60-0.79: Reasonable detection with moderate ambiguity
- 0.40-0.59: Uncertain detection, needs verification
- 0.00-0.39: Low confidence, likely needs manual review

**FACTORS AFFECTING CONFIDENCE**:
- Text clarity (readable vs. blurry)
- Symbol completeness (full vs. partial occlusion)
- Standard compliance (ISA-5.1 vs. non-standard)
- Context support (isolated vs. connected to known components)
```

### 2. Reasoning Documentation

**Principle**: Require explanations for all classifications.

**Pattern:**
```markdown
**REASONING REQUIREMENT**:
For EVERY detected component, provide reasoning field explaining:
1. Visual evidence that led to classification
2. Specific ISA-5.1 rule or pattern matched
3. Contextual clues supporting interpretation
4. Uncertainty factors, if any

**EXAMPLE**:
"Classified as sensor_temperature (TT-101) based on: circular symbol with horizontal line (field-mounted per ISA-5.1), clear 'TT' text indicating temperature transmitter, connected via dashed line (electric signal) to controller TIC-101."
```

---

## Platform-Specific Implementation

### Classification Prompts

**Current Enhanced Structure:**
```typescript
export const CLASSIFY_SYSTEM_INSTRUCTION = `
### IDENTITY
You are an **Engineering Document Controller** with expertise in HVAC systems.

### MISSION
Classify the provided document into one of four categories:
[Detailed category definitions]

### CLASSIFICATION RULES
[Explicit decision criteria]

### OUTPUT
Return ONLY valid JSON matching the schema. Include your reasoning.
`;
```

**Key Enhancements:**
- Clear role definition
- Explicit classification criteria
- Structured output requirements
- Reasoning mandate

### P&ID Detection Prompts

**Architecture:**
```typescript
// System Instruction: "Who you are"
export const PID_DETECT_SYSTEM_INSTRUCTION = `
1. IDENTITY & OPERATIONAL MANDATE
2. COGNITIVE PARAMETERS FOR MAXIMUM DETECTION
3. ISA-5.1 CONTEXT [Generated dynamically]
4. HVAC-SPECIFIC DETECTION PROTOCOL
5. NUMERIC CONSTRAINTS
6. OUTPUT DIRECTIVES
`;

// User Prompt: "What to do"
export const PID_DETECT_PROMPT = `
**COMMAND**: INITIATE DEEP-DIVE ANALYSIS.
**OBJECTIVES**: [Numbered list of specific goals]
**COMPONENT TYPES**: [Comprehensive taxonomy]
**DETECTION RULES**: [Specific pattern recognition rules]
**RESPONSE FORMAT**: Strict schema compliance
`;

// Schema: "How to structure output"
export const PID_ANALYSIS_SCHEMA = {
  // Detailed JSON schema with descriptions
};
```

### Final Analysis Prompts

**Structure:**
```typescript
export const FINAL_ANALYSIS_SYSTEM_INSTRUCTION = `
### IDENTITY & ROLE
[Expert HVAC Systems Engineer persona]

### MISSION
[Generate comprehensive technical reports]

### REPORT STRUCTURE
[9 required sections with descriptions]

### OUTPUT GUIDELINES
[Professional standards and quality requirements]

### TONE & STYLE
[Engineering-focused, solution-oriented]
`;

export const generateFinalAnalysisPrompt = (inferenceResults: any): string => {
  return `
Generate comprehensive report based on:
[Structured data presentation]

## CRITICAL INSTRUCTIONS FOR COMPONENT CORRELATION:
[5 specific correlation mandates]
[Explicit use of connection data]
  `;
};
```

---

## Best Practices Summary

### Do's ✅
1. **Be Explicit**: State everything clearly, avoid assumptions
2. **Provide Context**: Give domain knowledge and background
3. **Use Structure**: Organize with headers, bullets, delimiters
4. **Define Constraints**: Specify all validation rules upfront
5. **Show Examples**: Include few-shot learning samples
6. **Request Reasoning**: Mandate explanations for decisions
7. **Enable Iteration**: Design for multi-pass refinement
8. **Validate Output**: Build in self-checking mechanisms

### Don'ts ❌
1. **Don't Be Vague**: Avoid ambiguous language
2. **Don't Assume Knowledge**: Don't rely on implicit understanding
3. **Don't Overload**: Keep prompts focused on one task
4. **Don't Ignore Edge Cases**: Address special situations
5. **Don't Skip Schema**: Always define output structure
6. **Don't Accept Poor Responses**: Implement refinement loops
7. **Don't Forget Context**: Provide visual/domain context
8. **Don't Neglect Constraints**: Specify all limitations

---

## Version History

- **v1.0** (January 2026): Initial comprehensive guide based on 2024-2025 best practices
- Incorporates research from: Hostinger, GeeksforGeeks, TechVoot, Google AI Flow, Skrew.AI, PromptLayer

---

## References

1. **Prompt Engineering Best Practices** (Hostinger, 2024)
2. **Google AI Prompt Engineering Guide** (2025)
3. **Mastering AI Excellence: Prompt Engineering** (TechVoot, 2025)
4. **AI Prompt Best Practices** (PromptLayer, 2024)
5. **Prompt Engineering for AI Engineers** (Skrew.AI, 2024)

---

**Document Maintained By**: HVAC AI Platform Team  
**Application**: Frontend prompt engineering in /prompts/, /pipelines/, /gemini-prompt-engine/
