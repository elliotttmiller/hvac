/**
 * ISA-5.1 & ASHRAE HVAC Knowledge Base (Reference: ANSI/ISA-5.1-2009)
 * Optimized for Gemini 3.0 Pro Neuro-Symbolic Context Injection.
 */

// --- 1. IDENTIFICATION LETTERS (FUNCTIONAL ID) ---

export const ISA_FIRST_LETTER: Record<string, string> = {
  'A': "Analysis (Composition/Property)",
  'B': "Burner / Combustion",
  'C': "User's Choice (Usually Conductivity)",
  'D': "User's Choice (Usually Density)",
  'E': "Voltage",
  'F': "Flow Rate",
  'G': "User's Choice (Gauging/Position)",
  'H': "Hand (Manually Initiated)",
  'I': "Current (Electrical)",
  'J': "Power",
  'K': "Time / Time Schedule",
  'L': "Level",
  'M': "User's Choice (Moisture/Humidity)",
  'N': "User's Choice",
  'O': "User's Choice",
  'P': "Pressure / Vacuum",
  'Q': "Quantity",
  'R': "Radiation",
  'S': "Speed / Frequency",
  'T': "Temperature",
  'U': "Multivariable",
  'V': "Vibration / Mech. Analysis",
  'W': "Weight / Force",
  'X': "Unclassified",
  'Y': "Event / State / Presence",
  'Z': "Position / Dimension"
};

export const ISA_MODIFIER_FIRST: Record<string, string> = {
  'D': "Differential (e.g., PD = Pressure Diff)",
  'F': "Ratio / Fraction (e.g., FF = Flow Ratio)",
  'J': "Scan",
  'K': "Time Rate of Change",
  'Q': "Integrate / Totalizer (e.g., FQ = Flow Total)",
  'S': "Safety (e.g., PS = Pressure Safety)"
};

export const ISA_SUCCEEDING_LETTERS: Record<string, string> = {
  'A': "Alarm",
  'B': "User's Choice",
  'C': "Controller",
  'E': "Sensor / Primary Element",
  'G': "Glass / Viewing Device",
  'H': "High (Modifier)",
  'I': "Indicator (Readout)",
  'K': "Control Station (Manual/Auto)",
  'L': "Low (Modifier) or Light (Pilot)",
  'M': "Middle / Intermediate",
  'O': "Orifice / Restriction",
  'P': "Test Point",
  'R': "Recorder",
  'S': "Switch",
  'T': "Transmitter",
  'U': "Multifunction",
  'V': "Valve / Damper / Actuator",
  'W': "Well / Probe",
  'Y': "Relay / Compute / Convert",
  'Z': "Driver / Actuator / Unclassified"
};

// --- 2. SYMBOL SHAPES & MOUNTING (THE "FOUR QUADRANTS") ---

export const INSTRUMENT_SYMBOLS = `
VISUAL SHAPE DECODING (The "Four Quadrants" of ISA-5.1):

1. **DISCRETE INSTRUMENTS** (Single physical device):
   - Shape: **CIRCLE**
   - Example: Field Thermostat, Pressure Gauge.

2. **SHARED DISPLAY / CONTROL** (DCS / HMI / SCADA):
   - Shape: **CIRCLE INSIDE SQUARE**
   - Meaning: Accessible via video terminal (Software).

3. **COMPUTER FUNCTION** (Process Computer):
   - Shape: **HEXAGON**
   - Meaning: Computation occurring in a supervisory computer.

4. **LOGIC / PLC** (Programmable Logic Controller):
   - Shape: **DIAMOND** (often inside a square)
   - Meaning: Interlock logic, binary control.
`;

export const MOUNTING_LOCATION_RULES = `
MOUNTING LOCATION (Horizontal Lines inside the Shape):

A. **NO LINE**: Field Mounted. (Physical location on the pipe/duct).
B. **SOLID HORIZONTAL LINE**: Primary Location (Control Room / Main Panel). Accessible to operator.
C. **DASHED HORIZONTAL LINE**: Auxiliary Location (Behind Panel / Rack). Not accessible to operator.
`;

// --- 3. LINE SYMBOLOGY (CONNECTIVITY) ---

export const LINE_SYMBOLOGY = `
CONNECTION MEDIUMS (Line Styles):

1. **PROCESS CONNECTION**: Solid thick line. (Pipe, Duct).
2. **UNDEFINED SIGNAL**: Line with diagonal strokes per inch (generic).
3. **PNEUMATIC SIGNAL**: Line with double slash marks (//).
4. **ELECTRIC SIGNAL**: Dashed line (---) OR Triple dashed.
5. **HYDRAULIC SIGNAL**: Line with 'L' marks.
6. **CAPILLARY TUBE**: Line with 'X' marks (Filled System).
7. **SOFTWARE/DATA LINK**: Line with circles (o-o-o).
8. **MECHANICAL LINK**: Line with circles within circles or generic linkage.
`;

// --- 4. VALVE & ACTUATOR LOGIC ---

export const VALVE_ACTUATOR_LOGIC = `
VALVE FAIL MODES:
- **FO**: Fail Open (Arrow pointing up/away from stem).
- **FC**: Fail Closed (Arrow pointing down/toward stem).
- **FL**: Fail Last / Locked.
- **FI**: Fail Indeterminate.

ACTUATOR SYMBOLS:
- **Diaphragm**: Semicircle/Mushroom top.
- **Motor (M)**: Circle with 'M'.
- **Solenoid (S)**: Box with 'S'.
- **Piston**: Cylinder shape.
- **Hand**: T-Bar or Wheel.
`;

// --- 5. HVAC SPECIFIC CONTEXT ---

export const HVAC_EQUIPMENT_PATTERNS: Record<string, string> = {
  "AHU": "Air Handling Unit",
  "RTU": "Rooftop Unit",
  "VAV": "Variable Air Volume Box",
  "EF": "Exhaust Fan",
  "SF": "Supply Fan",
  "CH": "Chiller",
  "CT": "Cooling Tower",
  "P": "Pump",
  "DMP": "Damper",
  "SD": "Smoke Damper",
  "FD": "Fire Damper",
  "VFD": "Variable Frequency Drive",
  "HUM": "Humidifier",
  "HX": "Heat Exchanger",
  "OAI": "Outside Air Intake"
};

export const ENGINEERING_FIRST_PRINCIPLES = `
PHYSICS & TOPOLOGY RULES:
1. **Control Loop Integrity**: A Sensor (T) must eventually influence an Actuator (V/DMP) via a Controller (C).
2. **Mass Balance**: In HVAC, Supply Air Flow = Return Air + Exhaust Air + Leakage.
3. **Heat Exchange**: Coils require piping connections (Supply & Return). 
   - If you see a coil symbol inside an AHU, look for "CHWS/CHWR" (Chilled Water) or "HWS/HWR" (Hot Water) tags.
`;

// --- 6. CONTEXT GENERATOR ---

export const generateISAContext = (): string => {
  return `
    === ISA-5.1 KNOWLEDGE BASE ===
    
    [IDENTIFICATION LETTERS]
    FIRST_LETTERS: ${JSON.stringify(ISA_FIRST_LETTER)}
    MODIFIERS: ${JSON.stringify(ISA_MODIFIER_FIRST)}
    SUCCEEDING: ${JSON.stringify(ISA_SUCCEEDING_LETTERS)}
    
    [VISUAL DEFINITIONS]
    ${INSTRUMENT_SYMBOLS}
    ${MOUNTING_LOCATION_RULES}
    ${LINE_SYMBOLOGY}
    ${VALVE_ACTUATOR_LOGIC}
    
    [HVAC DOMAIN]
    EQUIPMENT_MAP: ${JSON.stringify(HVAC_EQUIPMENT_PATTERNS)}
    ${ENGINEERING_FIRST_PRINCIPLES}
    
    === END KNOWLEDGE BASE ===
  `;
};
