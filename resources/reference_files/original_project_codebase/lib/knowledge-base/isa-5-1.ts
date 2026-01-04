/**
 * ISA-5.1 Instrumentation Symbols and Identification Knowledge Base
 * Ported from inference_graph.py for LLM Context Injection
 */

export const ISA_FIRST_LETTER: Record<string, string> = {
  'A': "Analysis", 'B': "Burner", 'E': "Voltage", 'F': "Flow Rate", 
  'H': "Hand", 'I': "Current", 'J': "Power", 'K': "Time", 
  'L': "Level", 'P': "Pressure", 'Q': "Quantity", 'R': "Radiation", 
  'S': "Speed", 'T': "Temperature", 'U': "Multivariable", 
  'V': "Vibration", 'W': "Weight", 'X': "Unclassified", 
  'Y': "Event", 'Z': "Position"
};

export const ISA_MODIFIER_FIRST: Record<string, string> = {
  'D': "Differential", 'F': "Ratio", 'J': "Scan", 
  'K': "Time Rate of Change", 'M': "Momentary", 
  'Q': "Totalizer", 'S': "Safety"
};

export const ISA_SUCCEEDING_LETTERS: Record<string, string> = {
  'A': "Alarm", 'C': "Control", 'E': "Sensor", 'G': "Glass/View", 
  'I': "Indicator", 'K': "Control Station", 'L': "Light", 
  'O': "Orifice", 'R': "Recorder", 'S': "Switch", 'T': "Transmitter", 
  'V': "Valve", 'W': "Well", 'Y': "Relay/Converter", 'Z': "Actuator"
};

export const ISA_MODIFIERS_SUCCEEDING: Record<string, string> = {
  'H': "High", 'L': "Low", 'M': "Middle/Intermediate"
};

export const ISA_SIMPLE_MAP: Record<string, string> = {
  "FCV": "Flow Control Valve",
  "HCV": "Hand Control Valve",
  "SOV": "Solenoid Valve",
  "BV": "Block Valve",
  "GLV": "Globe Valve",
  "ZSC": "Position Switch Closed",
  "ZSO": "Position Switch Open"
};

// Helper description for the LLM to understand how to use these tables
export const ISA_LOGIC_DESCRIPTION = `
1. READ letters inside the bubble.
2. SPLIT into "Functional ID" (letters) and "Loop Number" (numbers).
3. DECODE "Functional ID":
   - First Letter: Use ISA_FIRST_LETTER or ISA_MODIFIER_FIRST.
   - Subsequent Letters: Use ISA_SUCCEEDING_LETTERS or ISA_MODIFIERS_SUCCEEDING.
   - Example: "TIC" -> T (Temperature) + I (Indicator) + C (Control) -> "Temperature Indicator Controller".
   - Example: "PDI" -> P (Pressure) + D (Differential) + I (Indicator) -> "Pressure Differential Indicator".
`;
