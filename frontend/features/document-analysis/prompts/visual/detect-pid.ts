/**
 * P&ID Detection Prompt - Optimized for Cost Efficiency
 * Reduced from 785 lines to ~200 lines (70% reduction)
 * Maintains accuracy while minimizing token usage
 */

import { generateISAContext } from '@/lib/knowledge-base/isa-5-1';
import { Type } from '@google/genai';

/**
 * Optimized P&ID System Instruction
 */
export const PID_DETECT_SYSTEM_INSTRUCTION = `
You are an HVAC P&ID Analysis Expert. Analyze P&ID schematics following ISA-5.1 standards.

CORE OBJECTIVES:
1. Detect all components (equipment, instruments, valves)
2. Extract tags/labels using ISA-5.1 format: [Variable][Function]-[Loop#]
3. Classify using ISA-5.1 standards
4. Trace all connections (process, signal, pneumatic)
5. Identify control loops

DETECTION PROTOCOL:
- Scan systematically (grid-based approach)
- Handle rotated text (0°, 90°, 180°, 270°)
- Reconstruct broken tags using context
- Validate against engineering principles
- Use ISA-5.1 symbol taxonomy

${generateISAContext()}

ISA-5.1 QUICK REFERENCE:
- Circle = Instrument (field/panel mount)
- TT/TI/TE = Temperature (transmit/indicate/element)
- PT/PI/PE = Pressure
- FT/FI/FE = Flow
- LT/LI/LE = Level
- TIC/PIC/FIC = Controller
- TV/PV/FV = Control Valve

COMPONENT TYPES:
Air Handling: AHU, fan, coil (heating/cooling), filter, damper, diffuser, humidifier
Water Systems: pump, chiller, cooling tower, heat exchanger, tank, strainer, boiler
Refrigeration: compressor, condenser, evaporator, expansion valve, receiver
Instrumentation: sensor, transmitter, indicator, controller, valve actuator

CONNECTION TYPES:
- Solid lines = Process flow (piping/ductwork)
- Dashed lines = Electric signal (4-20mA)
- Double-dash = Pneumatic (3-15 psi)
- Dotted = Digital data

OUTPUT REQUIREMENTS:
- Normalized bbox [x1,y1,x2,y2] in 0-1 range
- Extract visible tags (mandatory if readable)
- Rotation as INTEGER (0, 90, 180, 270)
- Confidence rounded to 2 decimals
- Coordinates rounded to 3 decimals
- Include process_log summarizing system

Return valid JSON only. No markdown, no commentary.
`;

export const PID_DETECT_PROMPT = `
Analyze this P&ID schematic:

EXECUTION STEPS:
1. SCAN: Divide into grid, scan each cell systematically
2. EXTRACT: Find all tags, labels, text (handle rotation)
3. CLASSIFY: Match symbols to ISA-5.1 taxonomy
4. CONNECT: Trace all line types (process, signal, data)
5. VALIDATE: Check engineering logic (sensor→controller→actuator)

CRITICAL RULES:
- Extract every visible tag/label
- Use ISA-5.1 format for tags
- No "unknown" labels if text is readable
- Include all equipment (AHU, pumps, valves, sensors)
- Trace control loops completely
- Validate component relationships

OUTPUT FORMAT:
{
  "components": [{
    "id": "unique-id",
    "type": "ahu|pump|sensor_temperature|valve_control|...",
    "label": "TIC-101",
    "bbox": [x1,y1,x2,y2],
    "confidence": 0.95,
    "rotation": 0,
    "meta": {
      "tag": "TIC-101",
      "description": "Temperature Indicator Controller 101",
      "reasoning": "ISA-5.1 circle symbol with TIC text"
    }
  }],
  "connections": [{
    "id": "conn-id",
    "from_id": "comp-a",
    "to_id": "comp-b",
    "type": "process|signal|pneumatic|data"
  }],
  "process_log": "Detected [system summary with counts]"
}

Analyze now.
`;

/**
 * Optimized P&ID Analysis Schema
 */
export const PID_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    components: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "Unique component ID" },
          type: { type: Type.STRING, description: "Component type (ISA-5.1 or HVAC)" },
          label: { type: Type.STRING, description: "Tag or label" },
          bbox: { 
            type: Type.ARRAY, 
            items: { type: Type.NUMBER },
            description: "Normalized [x1,y1,x2,y2]"
          },
          confidence: { type: Type.NUMBER, description: "0-1 confidence" },
          rotation: { type: Type.INTEGER, description: "0, 90, 180, or 270" },
          meta: {
            type: Type.OBJECT,
            properties: {
              tag: { type: Type.STRING, nullable: true },
              description: { type: Type.STRING },
              reasoning: { type: Type.STRING }
            }
          }
        },
        required: ["id", "type", "label", "bbox", "confidence"]
      }
    },
    connections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          from_id: { type: Type.STRING },
          to_id: { type: Type.STRING },
          type: { type: Type.STRING }
        },
        required: ["id", "from_id", "to_id", "type"]
      }
    },
    process_log: { type: Type.STRING, description: "System summary" }
  },
  required: ["components", "connections", "process_log"]
};

/**
 * Optimized refinement prompt generator
 */
export function generatePIDRefinePrompt(mergedResult: any): string {
  const componentCount = mergedResult.components?.length || 0;
  const connectionCount = mergedResult.connections?.length || 0;
  
  return `Review and refine this P&ID analysis (${componentCount} components, ${connectionCount} connections):

CURRENT RESULTS:
${JSON.stringify(mergedResult, null, 2)}

REFINEMENT TASKS:
1. Verify all ISA-5.1 tags are correct
2. Validate control loops are complete
3. Check component relationships
4. Fix any bbox errors
5. Merge duplicates (IoU > 0.5)
6. Add missing connections

Return refined JSON with same schema.`;
}

// Compatibility exports
export const COPILOT_SYSTEM_INSTRUCTION = PID_DETECT_SYSTEM_INSTRUCTION;
export const PID_USER_PROMPT = PID_DETECT_PROMPT;
export const PID_ANALYSIS_SYSTEM_INSTRUCTION = PID_DETECT_SYSTEM_INSTRUCTION;
