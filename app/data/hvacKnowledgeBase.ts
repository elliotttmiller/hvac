/**
 * HVAC_KNOWLEDGE_BASE.ts
 * 
 * AUTHORITY: ANSI/ISA-5.1-2024, ASHRAE Guideline 13, InstruNexus Forensic Analysis.
 * PURPOSE: Provides the "Cognitive Logic" for decoding P&ID symbols and tags.
 * 
 * STRUCTURE:
 * 1. DECODING MATRIX (The "Grammar" of Tags)
 * 2. VISUAL GEOMETRY (The "Shape" of Symbols)
 * 3. COMPONENT MORPHOLOGY (Hardware Identification)
 * 4. SYSTEM LOGIC (Control Loops & Safety)
 */

export const HVAC_KNOWLEDGE_BASE = `
# ENGINEERING REFERENCE: ANSI/ISA-5.1 & HVAC AUTOMATION

## SECTION 1: THE ISA-5.1 DECODING MATRIX (STRICT)

### 1.1 The Parsing Rule (The "5-Column Logic")
To decode a tag (e.g., "PDIC"), analyze letters sequentially. 
**CRITICAL RULE:** Check Column 2 (Modifiers) *immediately* after the 1st letter.
*   *Example:* **PDT** = Pressure (Col 1) + Differential (Col 2) + Transmitter (Col 4).
*   *Example:* **LAH** = Level (Col 1) + Alarm (Col 3) + High (Col 5).

### 1.2 Master Lookup Table
| Letter | Col 1: Variable | Col 2: Modifier | Col 3: Readout/Passive | Col 4: Output/Active | Col 5: Modifier |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | Analysis (CO2, pH) | - | Alarm | - | - |
| **B** | Burner/Flame | - | User Choice | User Choice | User Choice |
| **C** | Conductivity | - | - | **Control** (Controller) | Close |
| **D** | Density | **Differential** | - | - | Deviation |
| **E** | Voltage | - | **Element** (Sensor) | - | - |
| **F** | Flow Rate | Ratio | - | - | - |
| **G** | Gauging | - | Glass / Gauge | - | - |
| **H** | Hand (Manual) | - | - | - | **High** |
| **I** | Current (Amps) | - | **Indicate** (Display) | - | - |
| **K** | Time / Schedule | Time Rate | - | Control Station | - |
| **L** | Level | - | Light (Pilot) | - | **Low** |
| **M** | Moisture | Momentary | - | - | Middle |
| **P** | Pressure | - | Point (Test) | - | - |
| **Q** | Quantity | **Totalizer** | - | - | - |
| **R** | Radiation | - | **Record** (Trend) | - | Run |
| **S** | Speed/Freq | Safety | - | **Switch** | Stop |
| **T** | Temperature | - | - | **Transmit** | - |
| **U** | Multivariable | - | Multifunction | Multifunction | - |
| **V** | Vibration | - | - | **Valve** / Damper | - |
| **Y** | Event / State | - | - | **Relay** / Compute | - |
| **Z** | Position | - | - | **Actuator** / Driver | - |

---

## SECTION 2: SYMBOL & LINE DECODING (VISUAL GEOMETRY)

### 2.1 Instrument Bubbles (The "Brain")
*   **Circle (Empty):** Discrete/Hardware (e.g., Physical Thermostat, Gauge).
*   **Circle (in Square):** Shared Display/Control (Software Point in BAS/DCS).
*   **Hexagon:** Computer Function (Logic/Optimization).
*   **Diamond (in Square):** PLC (Industrial/Safety Logic).

### 2.2 Line Topology (The "Nervous System")
*   **No Line (in bubble):** Field Mounted (Local to pipe/duct).
*   **Solid Line (in bubble):** Control Room / Front of Panel (Accessible).
*   **Dashed Line (in bubble):** Behind Panel (Virtual/Internal).
*   **Line Types:**
    *   **Solid Thick:** Process Piping (Water/Air).
    *   **- - - Dashed:** Electric Signal (Analog/Digital).
    *   **// Hash Marks:** Pneumatic Signal (Compressed Air).
    *   **—o—o—:** Data Link (Software/BACnet/Modbus).
    *   **X-X-X:** Capillary (Remote Seal).

---

## SECTION 3: COMPONENT MORPHOLOGY (HARDWARE ID)

### 3.1 Valve Body Types (Visual Shape)
*   **Bowtie (Two Triangles):** Generic 2-Way Valve.
*   **Bowtie + Filled Circle:** Globe Valve (Modulating/Throttling).
*   **Bowtie + Open Circle:** Ball Valve (Isolation/On-Off).
*   **Bowtie + Slash:** Butterfly Valve (Large Diameter).
*   **Three-Way:** Three triangles meeting at center (Mixing/Diverting).

### 3.2 Actuator Types (Top of Valve)
*   **Dome / Mushroom:** Pneumatic Diaphragm.
*   **Box with 'M':** Electric Motor.
*   **Box with 'S':** Solenoid (Fast Acting).
*   **Cylinder:** Piston (High Force).

### 3.3 Fail-Safe Logic (Arrows on Stem)
*   **Arrow Up / Away from Valve:** Fail Open (FO).
*   **Arrow Down / Toward Valve:** Fail Closed (FC).
*   **"X" or Lock Symbol:** Fail Last / Fail Steady (FL).

---

## SECTION 4: SYSTEM LOGIC & COMPLIANCE (ASHRAE)

### 4.1 Loop Integrity Audit (Forensic Check)
*   **Open Loop Fault:** A Valve (TV/CV) exists without a controlling Sensor (TE/TT) or Controller (TC).
*   **Orphaned Sensor:** A Sensor (TE/TT) exists with no signal line to a Controller or Display.

### 4.2 Mandatory Safety Interlocks (Life Safety)
*   **Freeze Stat:** Look for **TSL**, **Tbz**, or **TS** (Low Temp Switch) on the coil face.
*   **High Static:** Look for **PSH** or **DPSH** (High Pressure Switch) on the Supply Fan discharge.
*   **Smoke Detection:** Look for **SD** or **XS** (Smoke Detector) in Supply/Return air streams.

### 4.3 Energy Code (ASHRAE 90.1)
*   **Economizer:** Requires OA Damper + RA Damper + MAT (Mixed Air Temp) Sensor.
*   **Ventilation:** Requires **AFMS** (Airflow Measuring Station) or **FE** (Flow Element) on OA Intake.

---

## SECTION 5: COMMON HVAC TAG DIALECT
*Map generic ISA tags to specific HVAC equipment:*
*   **TT / TE:** Duct Temperature Sensor (10k Thermistor or RTD).
*   **DPT / PDT:** Duct Static Pressure or Filter Status.
*   **FM / FE / AFMS:** Airflow Station.
*   **VFD / SC:** Variable Frequency Drive (Fan Speed Control).
*   **DM / DMP:** Damper Actuator.
*   **OAT:** Outside Air Temperature.
*   **SAT:** Supply Air Temperature.
*   **RAT:** Return Air Temperature.
`;