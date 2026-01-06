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
   - Shape: **CIRCLE** (Simple circle)
   - Example: Field Thermostat, Pressure Gauge, Flow Transmitter.
   - Variations: May have internal markings or letters.
   - **CRITICAL**: Circles are **NEVER** Gate/Globe/Control valves. Only Ball and Butterfly valves use circular geometry.

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

VALVE TYPES & PRECISE GEOMETRIC DEFINITIONS:

**BOWTIE VALVES** (Two touching triangles - PRIMARY VALVE GEOMETRY):
- **Gate Valve**: Bowtie shape, EMPTY interior. Full bore when open. Isolating service.
- **Globe Valve**: Bowtie shape with SOLID DOT in center. Throttling service. S-curve flow path.
- **Control Valve**: Bowtie shape with ACTUATOR on top (Mushroom/Box). Modulating service. Automated control.

**ROTARY VALVES** (The ONLY circular valves):
- **Ball Valve**: Circle (○) with SINGLE DIAGONAL LINE bisecting center (quarter-turn, 90°). Full bore.
- **Butterfly Valve (BFV)**: Circle (○) with SINGLE VERTICAL/HORIZONTAL BAR representing disc. Throttling or isolation.
- **Plug Valve**: Circle with cylindrical plug representation (small rectangle or tapered shape inside).

**OTHER VALVE TYPES**:
- **Check Valve**: Solid triangle (►) or arrow pointing in flow direction. Passive, prevents backflow.
- **Three-Way Valve**: Y-shape or T-junction with diverter element. Three ports visible.
- **Pressure Relief Valve (PRV/PSV)**: Spring-loaded symbol - triangle with coil spring on top.
- **Solenoid Valve**: Rectangle/box with electrical coil symbol (|||) or 'SOV' label.
- **Needle Valve**: Small body with tapered needle stem for fine flow control.
- **Diaphragm Valve**: Body with flexible diaphragm actuator shown as curved membrane.

CRITICAL DISTINCTIONS (Common Confusion Points):
1. **Circle vs Bowtie**: Circle = Instrument OR Ball/Butterfly valve (look for internal line). Bowtie = Gate/Globe/Control valve.
2. **Gate vs Globe vs Control**: All use bowtie. Gate=Empty, Globe=Solid dot, Control=Has actuator.
3. **Diamond vs Triangle**: Diamond (◇) = PLC/Logic function. Triangle/Bowtie (▽) = Control valve body.
4. **Ball vs Butterfly**: Ball has diagonal line. Butterfly has centered bar/disc.
5. **Control Valve vs Check Valve**: Control valve has stem + actuator. Check valve is passive, arrow-shaped, no actuator.

ACTUATOR SYMBOLS:
- **Diaphragm**: Semicircle/Mushroom top (spring-opposed or double-acting).
- **Motor (M)**: Circle with 'M' or motor winding symbol. Electric rotary actuator for MOV (Motor Operated Valve).
- **Solenoid (S)**: Box with 'S' or coil symbol (|||). Fast on/off action.
- **Electric (E)**: Lightning bolt or 'E'. Generic electric actuation.
- **Pneumatic**: Double slash marks (//) on signal line. Air-operated (3-15 PSI typical).
- **Hydraulic**: 'H' or hydraulic cylinder symbol. Liquid-operated (high force).
- **Piston**: Cylinder shape with rod. Linear motion actuator.
- **Hand (Manual)**: T-Bar (hand wheel), Lever, or Wrench symbol. Manual operation only.
- **Spring**: Coil spring symbol (for return-to-position on loss of signal).
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

// --- HVAC DOMAIN-SPECIFIC RULES ---

export const HVAC_DOMAIN_RULES = `
HVAC/BAS SPECIFIC CLASSIFICATION RULES:

**DAMPERS vs BUTTERFLY VALVES**:
- **Damper**: Used in DUCTWORK (airside systems). Rectangular or circular blade in air stream.
  - Context: AHU, VAV, exhaust/supply ducts
  - Tags: DMP, SD (Smoke Damper), FD (Fire Damper), MD (Motorized Damper)
  - Symbol: Similar to butterfly valve but in duct context
- **Butterfly Valve**: Used in PIPING (waterside systems). Circular disc in pipe.
  - Context: Chilled water, condenser water, hydronic loops
  - Tags: BFV, with CHW/HW/CW prefix
  - Symbol: Circle with centered bar/disc

**SENSORS - Mounting Context**:
- **Duct-Mounted (Insertion)**: Probe extending into duct. Measures air properties.
  - Applications: Supply air temp, return air temp, mixed air temp
  - Tags: SAT, RAT, MAT, OAT
  - Symbol: Sensor with extension into duct
- **Pipe-Mounted (Well)**: Thermowell/probe in pipe. Measures fluid properties.
  - Applications: Chilled water temp, hot water temp, condenser water temp
  - Tags: CHWST, CHWRT, HWST, HWRT
  - Symbol: Sensor with well extending into pipe

**INSTRUMENTS vs VALVES**:
- **Pressure Indicator (PI)**: ALWAYS a circular instrument. Displays pressure reading.
  - Shape: CIRCLE with "PI" text
  - Function: Indication/Display only, no control action
  - NEVER classify as valve
- **Pressure Valve (PV)**: Can be circular (Ball/Butterfly) OR bowtie (Control/Gate/Globe).
  - Shape: If CIRCLE, must have internal actuating element (diagonal line for ball, bar for butterfly)
  - Shape: If BOWTIE, standard valve body
  - Function: Flow control/isolation
`;

export const HVAC_TAG_AMBIGUITY_TABLE: Record<string, { 
  industrial_meaning: string; 
  hvac_meaning: string; 
  shape_rule: string;
}> = {
  "PV": {
    industrial_meaning: "Pressure Valve (generic control valve)",
    hvac_meaning: "Pressure Indicator/View (display instrument) OR Pressure Valve (if ball/butterfly)",
    shape_rule: "IF CIRCLE without internal line → Pressure Indicator. IF CIRCLE with diagonal/bar → Ball/Butterfly Valve. IF BOWTIE → Control Valve."
  },
  "TV": {
    industrial_meaning: "Temperature Valve",
    hvac_meaning: "Temperature Valve (control valve for heating/cooling)",
    shape_rule: "IF BOWTIE with actuator → Temperature Control Valve. IF CIRCLE → Check for Ball/Butterfly features."
  },
  "FV": {
    industrial_meaning: "Flow Valve",
    hvac_meaning: "Flow Valve (balancing or control valve)",
    shape_rule: "IF BOWTIE → Flow Control Valve. IF CIRCLE with diagonal → Ball Valve."
  },
  "PI": {
    industrial_meaning: "Pressure Indicator",
    hvac_meaning: "Pressure Indicator (gauge, display)",
    shape_rule: "ALWAYS CIRCLE. NEVER a valve. Display instrument only."
  },
  "TI": {
    industrial_meaning: "Temperature Indicator",
    hvac_meaning: "Temperature Indicator (display)",
    shape_rule: "ALWAYS CIRCLE. Display instrument only."
  },
  "FI": {
    industrial_meaning: "Flow Indicator",
    hvac_meaning: "Flow Indicator (display)",
    shape_rule: "ALWAYS CIRCLE. Display instrument only."
  }
};

// --- ASHRAE & SMACNA STANDARDS (Token-Optimized) ---

export const ASHRAE_STANDARDS = {
  // Temperature ranges (ASHRAE 90.1, 55)
  comfort_zone: { heating: "68-75°F", cooling: "73-79°F", humidity: "30-60% RH" },
  chilled_water: { supply: "42-48°F", return: "54-58°F", delta_t: "10-14°F" },
  hot_water: { supply: "140-180°F", return: "120-160°F", delta_t: "20-40°F" },
  condenser_water: { supply: "85-95°F", return: "95-105°F", approach: "7-10°F to WB" },
  
  // Pressure & flow standards
  duct_velocity_limits: { supply: "1500-2500 FPM", return: "1000-1500 FPM", exhaust: "1500-2000 FPM" },
  static_pressure: { supply: "1.0-4.0 in w.g.", return: "-0.5 to -2.0 in w.g." },
  hydronic_pressure: { typical: "10-50 PSI", max_design: "125-150 PSI" },
  
  // Ventilation (ASHRAE 62.1)
  outdoor_air: { office: "5-20 CFM/person", classroom: "10-15 CFM/person", lab: "0.5-2.0 ACH" },
  
  // Energy efficiency (ASHRAE 90.1)
  economizer: "Required for cooling > 54k BTU/h in most climates",
  vav_turndown: "30% minimum (Standard 90.1-2019)",
  chiller_efficiency: { water: ">0.6 kW/ton", air: ">1.0 kW/ton" }
};

export const SMACNA_DUCT_STANDARDS = {
  pressure_classes: {
    low: "±2 in w.g. or less",
    medium: "±2 to ±6 in w.g.",
    high: "±6 to ±10 in w.g."
  },
  sealing: {
    seal_class_a: "Leakage ≤ 4 CFM/100 sq ft @ 1 in w.g.",
    seal_class_b: "Leakage ≤ 8 CFM/100 sq ft @ 1 in w.g.",
    seal_class_c: "Leakage ≤ 24 CFM/100 sq ft @ 1 in w.g."
  },
  construction: "Follow SMACNA HVAC Duct Construction Standards - Metal & Flexible (latest edition)"
};

// --- COMMON P&ID CONVENTIONS & LEGEND SYMBOLS ---

export const COMMON_PID_CONVENTIONS = {
  // Line types (ISO 14617, ISA-5.1)
  process_line: "Solid thick line (1.0-1.5mm) - Main process flow (piping, ductwork)",
  instrument_signal: "Dashed line (---) or dot-dash (·-·-) - Electrical/electronic signal",
  pneumatic_signal: "Line with // marks - Pneumatic signal (3-15 PSI)",
  hydraulic_signal: "Line with H or -H-H- - Hydraulic signal",
  capillary_tube: "Line with X marks - Filled system (thermostat capillary)",
  software_link: "Line with ○○○ - Digital/data communication (Ethernet, fieldbus)",
  mechanical_link: "Double line or chain symbol - Mechanical connection (shaft, linkage)",
  
  // Equipment symbols
  heat_exchanger_shell_tube: "Circle with X or horizontal lines (tubes)",
  heat_exchanger_plate: "Stacked rectangles or PHX label",
  pump_centrifugal: "Circle with impeller blades (curved lines)",
  pump_positive_displacement: "Circle with gear teeth or lobes",
  compressor: "Circle with diagonal shaft, often labeled COMP",
  tank_vessel: "Vertical rectangle (vessel) or horizontal ellipse (tank)",
  filter_strainer: "Triangle or mesh symbol with label FLTR/STRN",
  
  // Valve positioning conventions
  normally_open: "Shown in NO (Normally Open) position unless labeled NC",
  normally_closed: "Labeled NC (Normally Closed) if not default",
  fail_position: "Arrow indicates fail mode: ↑=FO (Fail Open), ↓=FC (Fail Closed)"
};

// --- GEOMETRIC DISAMBIGUATION (Prevent "Diamond Shape" Hallucination) ---

export const GEOMETRIC_VISUAL_GUIDE = `
CRITICAL: DIAMOND vs TRIANGLE vs CIRCLE DISTINCTION

**DIAMOND (◇)**: 4 equal sides, 90° rotated square
- **USE**: PLC/Logic functions, Binary control, Sequencing, Interlocks
- **NEVER**: Control valves (those are TRIANGLES)
- Example: "Start/Stop Logic", "High Pressure Interlock"

**TRIANGLE (▽ or △)**: 3 sides, pointed shape
- **USE**: Control valves (modulating), Check valves (flow direction arrow)
- **STEM INDICATOR**: Control valve has vertical line (stem) from top
- Example: "TCV-101" (Temperature Control Valve), "CHV-202" (Check Valve)

**CIRCLE (○)**: Round shape
- **USE**: Instruments, Sensors, Ball valves, Butterfly valves
- **INTERNAL MARKINGS**: Letters inside indicate function (TT, PI, FIC, etc.)
- Example: "TT-101" (Temperature Transmitter), "BV-301" (Ball Valve with diagonal line)

**HEXAGON (⬡)**: 6 sides
- **USE**: Computer functions, Data logging, Supervisory control
- Example: "Historian", "SCADA Server"

**SQUARE (□)**: 4 equal sides, straight edges
- **USE**: Shared display (HMI), Panel instruments (when containing a circle)
- Example: Circle-in-square = DCS faceplate

**RECTANGLE (▬)**: 4 sides, longer than tall
- **USE**: Gate valves, Orifice plates, Equipment outlines
- Example: "GV-101" (Gate Valve)

REASONING RULES FOR AI:
1. If you see 4 sides at 90° rotation → DIAMOND → Logic/PLC → NOT a valve
2. If you see 3 sides with a stem → TRIANGLE → Control Valve
3. If you see a circle with text inside → INSTRUMENT → Read the ISA tag
4. If you see diagonal line in circle → Ball or Butterfly Valve (check if single line or bar)
5. NEVER say "diamond-shaped valve" - Diamonds are for logic, Triangles are for valves
`;

export const ENGINEERING_FIRST_PRINCIPLES = `
PHYSICS & TOPOLOGY RULES:
1. **Control Loop Integrity**: A Sensor (T) must eventually influence an Actuator (V/DMP) via a Controller (C).
   - Example: TT-101 (Temp Transmitter) → TIC-101 (Temp Controller) → TV-101 (Temp Control Valve)
2. **Mass Balance**: In HVAC, Supply Air Flow = Return Air + Exhaust Air + Leakage.
   - Closed systems: What goes in must come out (conservation of mass).
3. **Heat Exchange**: Coils require piping connections (Supply & Return). 
   - If you see a coil symbol inside an AHU, look for "CHWS/CHWR" (Chilled Water) or "HWS/HWR" (Hot Water) tags.
   - Typical setpoints: CHW 42-48°F supply, 54-58°F return. HW 140-180°F supply, 120-160°F return.
4. **Pressure Relationships**: Higher pressure flows to lower pressure. Check valve prevents backflow.
   - HVAC typical static pressures: Supply 1-4" w.g., Return -0.5 to -2" w.g.
   - Hydronic systems: 10-50 PSI typical, 125-150 PSI max design.
5. **Signal Flow**: Sensors → Transmitters → Controllers → Actuators (typical control loop).
   - 4-20mA standard for analog signals (0% = 4mA, 100% = 20mA).
   - 3-15 PSI standard for pneumatic signals (0% = 3 PSI, 100% = 15 PSI).
6. **Instrumentation Hierarchy**: Primary Element (E) → Transmitter (T) → Indicator/Controller (I/C) → Final Element (V).
7. **Safety Interlocks**: High/Low switches (SH/SL) typically connect to alarms or shutdown sequences.
   - High temp alarm (TSH): Triggers at T_max to prevent overheating.
   - Low flow alarm (FSL): Triggers at F_min to prevent equipment damage.
8. **Pump Configurations**:
   - Primary/Secondary: Decouples production from distribution. Primary serves load, secondary distributes.
   - Primary-Only Variable Flow: Single loop with VFDs, requires careful ΔP control.
   - Constant/Variable: Constant primary + variable secondary for energy efficiency.
9. **Air Distribution Principles**:
   - VAV systems: Vary airflow, maintain temp. Typical turndown 30-100% of design CFM.
   - CAV systems: Fixed airflow, vary temp via reheat or damper control.
   - Duct sizing: Velocity limits - Supply 1500-2500 FPM, Return 1000-1500 FPM (ASHRAE/SMACNA).
10. **Refrigeration Cycle** (ASHRAE Fundamentals):
    - Evaporator (low P, low T) → Compressor (ΔP, ΔT) → Condenser (high P, high T) → Expansion Valve (ΔP).
    - Superheat: Temp above saturation at suction (5-15°F typical).
    - Subcooling: Temp below saturation at liquid line (10-20°F typical).
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
    
    ${GEOMETRIC_VISUAL_GUIDE}
    
    [HVAC DOMAIN]
    EQUIPMENT_MAP: ${JSON.stringify(HVAC_EQUIPMENT_PATTERNS)}
    ${HVAC_DOMAIN_RULES}
    TAG_AMBIGUITY_TABLE: ${JSON.stringify(HVAC_TAG_AMBIGUITY_TABLE, null, 2)}
    ${ENGINEERING_FIRST_PRINCIPLES}
    
    [ASHRAE STANDARDS]
    ${JSON.stringify(ASHRAE_STANDARDS, null, 2)}
    
    [P&ID CONVENTIONS]
    ${JSON.stringify(COMMON_PID_CONVENTIONS, null, 2)}
    
    === END KNOWLEDGE BASE ===
  `;
};
