/**
 * HVAC_KNOWLEDGE_BASE.ts
 * 
 * AUDITED REFERENCE: ANSI/ISA-5.1-2024, ASHRAE Guideline 13, & InstruNexus Detailed Analysis
 * OPTIMIZATION LEVEL: Professional Engineering (PE) / Forensic Analysis
 */

export const HVAC_KNOWLEDGE_BASE = `
# OFFICIAL ENGINEERING REFERENCE: ANSI/ISA-5.1 & ASHRAE GUIDELINE 13

## SECTION 1: THE ISA-5.1 DECODING MATRIX (STRICT)
[... Standard ISA-5.1 Decoding Matrix as defined previously ...]

## SECTION 2: PARSING EXAMPLES (TRAINING DATA)
[... Standard Parsing Examples as defined previously ...]

---

## SECTION 3: FORENSIC FLAW DETECTION PATTERNS

### 3.1 Control Loop Discontinuity
*   **Sensor-less Control:** Identify Control Valves (TV/PV) or Dampers (ZV/FV) that lack a corresponding Transmitter (TT/PT/FT) or Indicating Controller (TIC/PIC) in the local loop.
*   **Floating Output:** Logic relays (Y) with no defined input source.

### 3.2 Critical Safety Omissions
*   **Air Side:** Missing Low-Limit Temperature Switch (Freeze-stat / TSL) on coils exposed to outdoor air. Missing Duct High Static Pressure Switch (PSH) on VAV systems.
*   **Water Side:** Missing Flow Switch (FS) on Chillers/Boilers. Missing High-Pressure Cutout on pumps.

### 3.3 Redundancy & Maintenance Risks
*   **Single Point Failure:** Main headers lacking bypass valves. Systems with only one sensor for main discharge air control (DPT/TT).
*   **Access Issues:** Instrumentation located in unreachable areas of the ductwork without access panels labeled.

---

## SECTION 4: OPTIMIZATION & ENHANCEMENT FRAMEWORK

### 4.1 Energy Recovery & Savings
*   **Variable Flow:** Recommend VFDs for any constant speed pump/fan symbols identified.
*   **DCV Implementation:** Propose adding CO2 sensors (AIT/AT) for high-occupancy zones to trigger Demand Controlled Ventilation.
*   **Economizers:** Suggest adding Return Air (RA) and Outside Air (OA) enthalpy sensors if only dry-bulb is detected.

### 4.2 Instrumentation Density
*   **Granularity:** Suggest sub-metering (Current Transmitters / IT) for major equipment packages.
*   **Validation:** Recommend adding Test Plugs (PT/TT points) upstream and downstream of major heat exchangers.

---

## SECTION 5: SYMBOL & LINE DECODING (VISUAL GEOMETRY)
[... Standard Symbol & Line Decoding as defined previously ...]
`;