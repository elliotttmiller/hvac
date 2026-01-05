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
  'S': "Safety (e.g., PS = Pressure Safety)",
  'M': "Momentary / Peak",
  'X': "Unclassified / Multi-parameter"
};

// Additional ISA pattern recognition helpers
export const ISA_TAG_PATTERNS = {
  // Common multi-letter patterns
  'TE': 'Temperature Element/Sensor',
  'TT': 'Temperature Transmitter',
  'TI': 'Temperature Indicator',
  'TIC': 'Temperature Indicator Controller',
  'TRC': 'Temperature Recorder Controller',
  'TA': 'Temperature Alarm',
  'TSH': 'Temperature Switch High',
  'TSL': 'Temperature Switch Low',
  'TSHH': 'Temperature Switch High-High',
  'TSLL': 'Temperature Switch Low-Low',
  'TV': 'Temperature Valve',
  'TY': 'Temperature Relay/Transducer',
  
  'PE': 'Pressure Element/Sensor',
  'PT': 'Pressure Transmitter',
  'PI': 'Pressure Indicator',
  'PIC': 'Pressure Indicator Controller',
  'PRC': 'Pressure Recorder Controller',
  'PA': 'Pressure Alarm',
  'PSH': 'Pressure Switch High',
  'PSL': 'Pressure Switch Low',
  'PV': 'Pressure Valve',
  'PY': 'Pressure Relay/Transducer',
  'PDI': 'Pressure Differential Indicator',
  'PDSH': 'Pressure Differential Switch High',
  
  'FE': 'Flow Element/Sensor',
  'FT': 'Flow Transmitter',
  'FI': 'Flow Indicator',
  'FIC': 'Flow Indicator Controller',
  'FRC': 'Flow Recorder Controller',
  'FA': 'Flow Alarm',
  'FSH': 'Flow Switch High',
  'FSL': 'Flow Switch Low',
  'FV': 'Flow Valve',
  'FY': 'Flow Relay/Transducer',
  'FQ': 'Flow Totalizer',
  'FQI': 'Flow Totalizer Indicator',
  
  'LE': 'Level Element/Sensor',
  'LT': 'Level Transmitter',
  'LI': 'Level Indicator',
  'LIC': 'Level Indicator Controller',
  'LRC': 'Level Recorder Controller',
  'LA': 'Level Alarm',
  'LSH': 'Level Switch High',
  'LSL': 'Level Switch Low',
  'LV': 'Level Valve',
  'LG': 'Level Gauge/Glass',
  
  'HS': 'Hand Switch',
  'HIC': 'Hand Indicator Controller',
  
  'ZS': 'Position Switch',
  'ZT': 'Position Transmitter',
  'ZSO': 'Position Switch Open',
  'ZSC': 'Position Switch Closed',
  
  'SS': 'Speed Switch',
  'ST': 'Speed Transmitter',
  'SIC': 'Speed Indicator Controller',
  
  'AE': 'Analysis Element',
  'AT': 'Analysis Transmitter',
  'AI': 'Analysis Indicator',
  'AIC': 'Analysis Indicator Controller'
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
   - Example: Field Thermostat, Pressure Gauge, Flow Transmitter.
   - Variations: May have internal markings or letters.

2. **SHARED DISPLAY / CONTROL** (DCS / HMI / SCADA):
   - Shape: **CIRCLE INSIDE SQUARE**
   - Meaning: Accessible via video terminal (Software).
   - Common in modern automation systems.

3. **COMPUTER FUNCTION** (Process Computer):
   - Shape: **HEXAGON**
   - Meaning: Computation occurring in a supervisory computer.
   - Used for complex calculations and data logging.

4. **LOGIC / PLC** (Programmable Logic Controller):
   - Shape: **DIAMOND** (often inside a square)
   - Meaning: Interlock logic, binary control, sequencing.
   - Essential for automated control sequences.

5. **AUXILIARY DEVICES**:
   - **Orifice Plate**: Rectangle with diagonal line
   - **Restriction**: Hourglass or narrowing symbol
   - **Test Connection**: Circle with 'T' or 'TP'
   - **Well/Thermowell**: Extended element symbol
   - **Primary Element**: Symbol showing measurement point

6. **SPECIALIZED INSTRUMENTS**:
   - **Analyzer**: Circle with 'A' prefix (e.g., AT, AC)
   - **Conductivity**: Circle with 'C' or 'COND'
   - **Density**: Circle with 'D' or 'DENS'
   - **Humidity/Moisture**: Circle with 'M' or 'HUM'
   - **Vibration**: Circle with 'V' or 'VIB'
   - **Position/Limit Switch**: Square with 'Z' or 'LS'
   - **Speed/Frequency**: Circle with 'S' or 'FREQ'

7. **MULTI-FUNCTION INSTRUMENTS**:
   - **Recorder/Controller**: Circle with 'RC'
   - **Indicator/Controller**: Circle with 'IC'  
   - **Indicator/Transmitter**: Circle with 'IT'
   - **Indicator/Alarm**: Circle with 'IA'
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
- **FSO**: Fail Safe Open.
- **FSC**: Fail Safe Closed.

VALVE TYPES & SYMBOLS:
- **Control Valve**: Triangle or diamond with stem line
- **Ball Valve**: Circle with diagonal line (quarter-turn)
- **Globe Valve**: Circular body with perpendicular stem
- **Butterfly Valve**: Circle with diagonal bar (BFV)
- **Check Valve**: Triangle or arrow pointing flow direction
- **Gate Valve**: Rectangle with gate symbol
- **Plug Valve**: Circle with plug representation
- **Three-Way Valve**: Y-shaped or T-junction with diverter
- **Pressure Relief Valve**: Spring-loaded symbol (PRV)
- **Solenoid Valve**: Box with coil symbol or 'SOL'
- **Needle Valve**: Tapered stem symbol
- **Diaphragm Valve**: Diaphragm actuated symbol

ACTUATOR SYMBOLS:
- **Diaphragm**: Semicircle/Mushroom top.
- **Motor (M)**: Circle with 'M' or motor winding symbol.
- **Solenoid (S)**: Box with 'S' or coil symbol.
- **Electric**: Lightning bolt or 'E'.
- **Pneumatic**: Double slash marks (//).
- **Hydraulic**: 'H' or hydraulic symbol.
- **Piston**: Cylinder shape with rod.
- **Hand**: T-Bar or Wheel symbol.
- **Spring**: Coil spring symbol (for return).
`;

// --- 5. HVAC SPECIFIC CONTEXT ---

export const HVAC_EQUIPMENT_PATTERNS: Record<string, string> = {
  "AHU": "Air Handling Unit",
  "RTU": "Rooftop Unit",
  "VAV": "Variable Air Volume Box",
  "CAV": "Constant Air Volume Box",
  "EF": "Exhaust Fan",
  "SF": "Supply Fan",
  "RF": "Return Fan",
  "CH": "Chiller",
  "CT": "Cooling Tower",
  "P": "Pump",
  "DMP": "Damper",
  "SD": "Smoke Damper",
  "FD": "Fire Damper",
  "MD": "Motorized Damper",
  "BD": "Backdraft Damper",
  "VFD": "Variable Frequency Drive",
  "HUM": "Humidifier",
  "DHUM": "Dehumidifier",
  "HX": "Heat Exchanger",
  "PHX": "Plate Heat Exchanger",
  "OAI": "Outside Air Intake",
  "FCU": "Fan Coil Unit",
  "ERV": "Energy Recovery Ventilator",
  "HRV": "Heat Recovery Ventilator",
  "MAU": "Makeup Air Unit",
  "EU": "Exhaust Unit",
  "DOAS": "Dedicated Outdoor Air System",
  "TU": "Terminal Unit",
  "VVT": "Variable Volume Terminal",
  "FPB": "Fire Protection Box",
  "SB": "Sound Box/Attenuator",
  "COMP": "Compressor",
  "COND": "Condenser",
  "EVAP": "Evaporator",
  "EXV": "Expansion Valve",
  "TXV": "Thermostatic Expansion Valve",
  "PRV": "Pressure Relief Valve",
  "BFV": "Butterfly Valve",
  "GV": "Globe Valve",
  "CHV": "Check Valve",
  "BV": "Ball Valve",
  "PRG": "Pressure Regulator",
  "STRN": "Strainer",
  "FLTR": "Filter",
  "SEP": "Separator"
};

export const ENGINEERING_FIRST_PRINCIPLES = `
PHYSICS & TOPOLOGY RULES:
1. **Control Loop Integrity**: A Sensor (T) must eventually influence an Actuator (V/DMP) via a Controller (C).
2. **Mass Balance**: In HVAC, Supply Air Flow = Return Air + Exhaust Air + Leakage.
3. **Heat Exchange**: Coils require piping connections (Supply & Return). 
   - If you see a coil symbol inside an AHU, look for "CHWS/CHWR" (Chilled Water) or "HWS/HWR" (Hot Water) tags.
4. **Pressure Relationships**: Higher pressure flows to lower pressure. Check valve prevents backflow.
5. **Signal Flow**: Sensors → Transmitters → Controllers → Actuators (typical control loop).
6. **Instrumentation Hierarchy**: Primary Element (E) → Transmitter (T) → Indicator/Controller (I/C) → Final Element (V).
7. **Safety Interlocks**: High/Low switches (SH/SL) typically connect to alarms or shutdown sequences.
`;

// --- 7. ADVANCED ISA TAG DETECTION ---

/**
 * Parse an ISA tag and extract semantic information
 */
export interface ParsedISATag {
  tag: string;
  measuredVariable: string | null;
  modifier: string | null;
  functions: string[];
  loopNumber: string | null;
  suffix: string | null;
  confidence: number;
  reasoning: string;
}

/**
 * Parse an ISA-5.1 tag with fuzzy matching support
 * Examples: "TIC-101", "FV-202A", "PDSH-303", "T/IC-101" (broken)
 */
export function parseISATag(rawTag: string): ParsedISATag {
  // Clean the tag - remove line breaks, spaces, normalize
  const cleanTag = rawTag.replace(/[\n\r\s]/g, '').toUpperCase();
  
  // Try to match standard ISA pattern: [Letters]-[Number][Suffix]
  // Pattern: 1-4 letters, optional dash, 1-6 digits, optional letter suffix
  const match = cleanTag.match(/^([A-Z]{1,4})-?(\d{1,6})([A-Z]?)$/);
  
  if (!match) {
    return {
      tag: cleanTag,
      measuredVariable: null,
      modifier: null,
      functions: [],
      loopNumber: null,
      suffix: null,
      confidence: 0,
      reasoning: `No ISA pattern detected for: ${rawTag}`
    };
  }
  
  const [, letters, number, suffix] = match;
  
  // Check if it's a known pattern first
  if (ISA_TAG_PATTERNS[letters]) {
    return {
      tag: cleanTag,
      measuredVariable: letters.charAt(0),
      modifier: letters.length > 1 && ISA_MODIFIER_FIRST[letters.charAt(1)] ? letters.charAt(1) : null,
      functions: letters.slice(letters.length > 1 && ISA_MODIFIER_FIRST[letters.charAt(1)] ? 2 : 1).split(''),
      loopNumber: number,
      suffix: suffix || null,
      confidence: 0.95,
      reasoning: `Known ISA pattern: ${ISA_TAG_PATTERNS[letters]}`
    };
  }
  
  // Parse letter by letter
  const firstLetter = letters.charAt(0);
  const measuredVariable = ISA_FIRST_LETTER[firstLetter] ? firstLetter : null;
  
  // Check for modifier in second position
  let modifier: string | null = null;
  let functionStart = 1;
  if (letters.length > 1 && ISA_MODIFIER_FIRST[letters.charAt(1)]) {
    modifier = letters.charAt(1);
    functionStart = 2;
  }
  
  // Remaining letters are functions
  const functions = letters.slice(functionStart).split('').filter(l => ISA_SUCCEEDING_LETTERS[l]);
  
  const confidence = measuredVariable ? 0.7 : 0.3;
  
  return {
    tag: cleanTag,
    measuredVariable,
    modifier,
    functions,
    loopNumber: number,
    suffix: suffix || null,
    confidence,
    reasoning: measuredVariable 
      ? `Parsed ISA tag: ${ISA_FIRST_LETTER[firstLetter]}${modifier ? ` ${ISA_MODIFIER_FIRST[modifier]}` : ''}${functions.map(f => ` ${ISA_SUCCEEDING_LETTERS[f]}`).join('')}`
      : `Partial ISA pattern match from label: ${cleanTag}`
  };
}

/**
 * Generate optimized ISA context for lean prompts
 */
export function generateOptimizedISAContext(): string {
  return `
    ISA-5.1 QUICK REF:
    
    First: T=Temp P=Press F=Flow L=Level H=Hand A=Analysis S=Speed Z=Position
    Mod: D=Diff Q=Total S=Safety
    Suffix: I=Indicator C=Controller T=Transmitter V=Valve S=Switch A=Alarm E=Element
    
    Shapes: ○=Field, ⬚○=Panel, ◇=Logic, ⬡=Computer
    Lines: ━=Process, - - -=Electric, //=Pneumatic
    Valves: FO=FailOpen FC=FailClose FL=FailLast
  `;
}

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
