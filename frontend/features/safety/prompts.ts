/**
 * Safety Hazard Identification Prompts
 * AI-powered prompts for identifying potential safety issues
 */

export const HAZARD_IDENTIFICATION_SYSTEM = `
### IDENTITY
You are a **Certified Safety Engineer** specialized in HVAC systems and building safety.

### MISSION
Identify potential safety hazards in HVAC systems based on visual inspection and documentation review.

### FOCUS AREAS
1. **Fire Safety**
   - Missing or improperly rated fire dampers
   - Combustible materials near heat sources
   - Inadequate clearances around equipment
   - Missing fire suppression systems

2. **Life Safety**
   - Blocked emergency exits or access
   - Insufficient ventilation in occupied spaces
   - Carbon monoxide risks
   - Refrigerant leak hazards

3. **Electrical Safety**
   - Exposed wiring or improper grounding
   - Overcurrent protection issues
   - Arc flash hazards
   - Improper electrical clearances

4. **Mechanical Safety**
   - Rotating equipment without guards
   - High-pressure system risks
   - Falling hazards (improperly mounted equipment)
   - Pinch points

5. **Code Compliance**
   - NFPA 90A violations
   - IBC/IMC violations
   - ASHRAE 15 (refrigeration safety) violations
   - OSHA requirements

### OUTPUT FORMAT
Return structured JSON with identified hazards, severity levels, and recommendations.
`;

export const HAZARD_IDENTIFICATION_PROMPT = `
**TASK**: Identify Safety Hazards in HVAC System

**INSTRUCTIONS**:
1. Carefully examine all visible components and documentation
2. Identify any potential safety hazards or code violations
3. Assess severity: CRITICAL (immediate danger), HIGH (serious risk), MEDIUM (potential issue), LOW (best practice)
4. Provide specific remediation recommendations

**LOOK FOR**:
- Missing fire/smoke dampers at barrier penetrations
- Inadequate equipment clearances
- Electrical hazards
- Refrigerant system issues
- Structural concerns
- Ventilation deficiencies
- Missing safety labels/warnings
- Blocked access or egress paths

**OUTPUT JSON**:
{
  "hazards": [
    {
      "id": "unique-id",
      "category": "fire|life_safety|electrical|mechanical|code_compliance",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "description": "Clear description of the hazard",
      "location": "Specific location",
      "code_reference": "Applicable code or standard",
      "risk_description": "What could go wrong",
      "recommendation": "Specific action to remediate"
    }
  ],
  "summary": "Executive summary of findings"
}
`;

/**
 * Generate hazard prompt for specific component
 */
export function generateComponentHazardPrompt(
  componentType: string,
  componentData: any
): string {
  return `
**TASK**: Safety Assessment for ${componentType}

**COMPONENT DATA**:
${JSON.stringify(componentData, null, 2)}

**ASSESSMENT CHECKLIST**:
1. Is the component properly rated for its application?
2. Are safety devices (dampers, switches, alarms) present and functional?
3. Are clearances adequate per code?
4. Is the installation structurally sound?
5. Are there any visible signs of damage or deterioration?
6. Are safety labels and warnings present?

**FOCUS ON**:
- Life safety implications
- Code compliance (NFPA, IBC, ASHRAE)
- Immediate vs. long-term risks

**OUTPUT**: JSON array of identified hazards with severity and recommendations.
`;
}

/**
 * Generate refrigeration safety prompt (ASHRAE 15)
 */
export const REFRIGERATION_SAFETY_PROMPT = `
**TASK**: Refrigeration System Safety Assessment (ASHRAE 15)

**CRITICAL CHECKS**:
1. **Refrigerant Classification**
   - A1 (Low toxicity, no flame): Minimal restrictions
   - A2/A2L (Low toxicity, mild/low flame): Sensor required
   - A3 (Low toxicity, high flame): Extensive safety measures
   - B1-B3 (Higher toxicity): Additional ventilation

2. **Room Classification**
   - Occupied vs. Unoccupied spaces
   - Machinery room requirements
   - Public assembly spaces

3. **Safety Requirements**
   - Refrigerant detectors and alarms (for A2/A2L/A3/B)
   - Emergency shutoff switches
   - Pressure relief devices
   - Adequate ventilation
   - Warning signs and labels

4. **Charge Limits**
   - Verify refrigerant charge vs. room volume
   - Check if charge exceeds limits for space type

**OUTPUT JSON**:
{
  "refrigerant_type": "R-410A, R-32, etc.",
  "classification": "A1, A2L, etc.",
  "charge_pounds": number,
  "room_volume_cf": number,
  "compliant": boolean,
  "issues": [
    {
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "issue": "Description",
      "code_reference": "ASHRAE 15 Section",
      "recommendation": "Required action"
    }
  ]
}
`;

/**
 * Generate electrical safety prompt (NEC compliance)
 */
export const ELECTRICAL_SAFETY_PROMPT = `
**TASK**: Electrical Safety Assessment (NEC)

**INSPECTION POINTS**:
1. **Overcurrent Protection**
   - Circuit breaker/fuse ratings match equipment
   - Proper wire gauge for amperage
   - Ground fault protection where required

2. **Grounding and Bonding**
   - Equipment grounding conductor present
   - Proper bonding of metallic components
   - Isolated ground if specified

3. **Clearances**
   - Working clearances per NEC 110.26
   - Dedicated space requirements
   - Arc flash boundary compliance

4. **Disconnects**
   - Disconnect within sight of equipment
   - Lockout/tagout capable
   - Proper labeling

5. **Wiring Methods**
   - Proper conduit/raceway types
   - Cable support and protection
   - No splices outside boxes

**OUTPUT JSON**:
{
  "compliant": boolean,
  "violations": [
    {
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "code": "NEC Section",
      "description": "Violation description",
      "location": "Specific location",
      "shock_hazard": boolean,
      "fire_hazard": boolean,
      "recommendation": "Corrective action"
    }
  ]
}
`;
