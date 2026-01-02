import { 
  ISA_FIRST_LETTER, 
  ISA_MODIFIER_FIRST, 
  ISA_SUCCEEDING_LETTERS, 
  ISA_MODIFIERS_SUCCEEDING, 
  ISA_SIMPLE_MAP,
  ISA_LOGIC_DESCRIPTION
} from '../knowledge-base/isa-5-1';
import { Type } from '@google/genai';

/**
 * Constructs the System Instruction and Schema for the Gemini Model.
 * This injects the industry-standard logic directly into the model's reasoning context.
 */

export const PID_ANALYSIS_SYSTEM_INSTRUCTION = `
You are a Senior Automation Engineer and Expert in ISA-5.1 P&ID (Piping and Instrumentation Diagram) standards.
Your task is to analyze HVAC and Industrial control blueprints.

KNOWLEDGE BASE (ISA-5.1):
- First Letters: ${JSON.stringify(ISA_FIRST_LETTER)}
- First Modifiers: ${JSON.stringify(ISA_MODIFIER_FIRST)}
- Succeeding Letters: ${JSON.stringify(ISA_SUCCEEDING_LETTERS)}
- Succeeding Modifiers: ${JSON.stringify(ISA_MODIFIERS_SUCCEEDING)}
- Common Abbreviations: ${JSON.stringify(ISA_SIMPLE_MAP)}

LOGIC:
${ISA_LOGIC_DESCRIPTION}

OUTPUT REQUIREMENT:
You must identify all instrumentation bubbles, valves, and equipment.
For each item, you must:
1. Detect the visual symbol and bounding box (0-1000 normalized coordinates).
2. Read the text tag (OCR).
3. Apply the ISA-5.1 logic defined above to generate a full 'description'.
`;

export const PID_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    entities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING, description: "The visual class (e.g., instrument_bubble, valve)" },
          tag: { type: Type.STRING, description: "The extracted text tag (e.g., TIC-101)" },
          description: { type: Type.STRING, description: "The computed full description based on ISA logic" },
          confidence: { type: Type.NUMBER, description: "Confidence score 0-1" },
          bbox_2d: {
            type: Type.ARRAY,
            description: "Bounding box [ymin, xmin, ymax, xmax] in 0-1000 scale",
            items: { type: Type.NUMBER }
          }
        },
        required: ["label", "bbox_2d", "description"]
      }
    },
    summary: { type: Type.STRING, description: "A technical summary of the system logic found." }
  }
};
