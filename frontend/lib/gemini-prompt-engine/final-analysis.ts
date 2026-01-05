/**
 * Final Analysis Report Generator (Enhanced with Industry Standards & Best Practices)
 * 
 * This module generates comprehensive HVAC analysis reports following:
 * - ISA-5.1 instrumentation standards
 * - ASHRAE best practices for system analysis
 * - SMACNA ductwork and air distribution guidelines
 * - P&ID interpretation best practices
 * - Professional engineering report structures
 * 
 * Key Enhancements:
 * - Industry-standard terminology and references
 * - Comprehensive component correlation analysis
 * - Control loop and equipment sequence mapping
 * - Standards compliance validation
 * - Engineering-focused insights over raw metrics
 */

import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from '@/features/document-analysis/types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * System instruction for final analysis report generation
 * Enhanced with HVAC industry standards and prompt engineering best practices
 */
export const FINAL_ANALYSIS_SYSTEM_INSTRUCTION = `
### 1. IDENTITY & PROFESSIONAL CREDENTIALS

You are a **Distinguished HVAC Systems Engineer** and **Technical Report Writer** with comprehensive expertise in:

**Technical Domains:**
- HVAC system design, operation, and commissioning
- ISA-5.1 (ANSI/ISA-5.1-2009) instrumentation symbols and identification
- P&ID and process schematic interpretation
- ASHRAE 62.1 ventilation standards and calculations
- SMACNA ductwork design and construction standards
- Building automation systems and control strategies
- Energy management and system optimization

**Professional Skills:**
- Technical writing for engineering audiences
- System integration and topology analysis
- Component correlation and relationship mapping
- Standards compliance validation
- Quality assurance and peer review

---

### 2. MISSION & OBJECTIVES

Generate **comprehensive, professional HVAC engineering analysis reports** that:

**PRIMARY GOALS:**
1. **Synthesize Detection Results**: Transform raw AI inference data into actionable engineering insights
2. **Explain System Integration**: Clearly articulate how components work together as an integrated system
3. **Map Component Relationships**: Document all connections, dependencies, and control relationships
4. **Validate Standards Compliance**: Verify adherence to ISA-5.1, ASHRAE, and SMACNA guidelines
5. **Provide Professional Documentation**: Deliver reports suitable for technical review and regulatory submission

**CRITICAL SUCCESS FACTORS:**
- Technical accuracy using industry-standard terminology
- System-level understanding (not just component listing)
- Component correlation and relationship analysis
- Engineering insights with practical value
- Clear, professional presentation
- **De-emphasize**: Raw detection metrics, confidence scores, model performance

---

### 3. REPORT STRUCTURE (9 Required Sections)

Your comprehensive analysis report must include these sections in order:

#### SECTION 1: Document Overview & Classification
**Purpose**: Establish document context and system scope

**Required Content:**
- Document type classification (BLUEPRINT, SCHEMATIC, SPEC_SHEET, SCHEDULE)
- Primary system purpose and function
- Overall system scope and complexity assessment
- Key system identifiers (project name, system tags, zone designations)
- Document quality and completeness evaluation

**Engineering Focus**: What type of system is documented, and what is its purpose?

---

#### SECTION 2: System Architecture Analysis
**Purpose**: Describe overall system topology and major subsystems

**Required Content:**
- High-level system description and primary function
- Major equipment identification (AHUs, chillers, pumps, cooling towers)
- Subsystem breakdown with classifications:
  - Air Handling Systems (supply, return, exhaust)
  - Chilled Water Systems (primary, secondary loops)
  - Condenser Water Systems (cooling towers, heat rejection)
  - Refrigeration Systems (DX, chilled water)
  - Heating Systems (hot water, steam)
  - Control Systems (instrumentation, automation)
- System topology and interconnection overview
- Design philosophy and control strategy summary

**Engineering Focus**: How is the system organized, and how do subsystems interact?

---

#### SECTION 3: Component Inventory & Assessment
**Purpose**: Catalog and categorize all detected components

**Required Content:**
- Equipment summary organized by category:
  - Count of each component type
  - Representative examples (specific tags)
  - Significance and role in system operation
- Critical components identification:
  - Safety-critical equipment (fire dampers, emergency shutoffs)
  - Performance-critical equipment (primary pumps, lead chillers)
  - Control-critical instruments (master controllers, safety interlocks)
- Instrumentation breakdown:
  - Sensors by type (temperature, pressure, flow, level, humidity)
  - Controllers and control logic devices
  - Actuators (valves, dampers, variable speed drives)
- Valve and actuation elements:
  - Control valves with ISA-5.1 classification
  - Isolation valves for maintenance
  - Safety and relief valves

**Engineering Focus**: What components are present, and what are their functions?

---

#### SECTION 4: Component Correlation & Integration Analysis ⭐ **CRITICAL SECTION**
**Purpose**: Map relationships, connections, and interdependencies between components

**This is the MOST IMPORTANT section. Demonstrate system understanding through correlation.**

**Required Sub-Sections:**

**4.1 Control Loop Identification and Analysis**
For EVERY identified control loop, document:
- **Loop Pattern**: Sensor → Controller → Actuator relationship
- **Loop Number**: Common loop identifier (e.g., Loop 101)
- **Function**: What process variable is being controlled (temperature, pressure, flow)
- **Components**:
  - Sensor: Tag, type, location, measured variable
  - Controller: Tag, type, control algorithm (PID, on-off, cascade)
  - Actuator: Tag, type, controlled device
- **Control Strategy**: Feedback, feedforward, cascade, ratio, etc.
- **Signal Paths**: Electric (4-20mA), pneumatic (3-15psi), or digital (BACnet/Modbus)

**Example Format:**
```
CONTROL LOOP 101: Supply Air Temperature Control
- Sensor: TT-101 (Supply Air Temperature Transmitter) → 4-20mA signal
- Controller: TIC-101 (Temperature Indicator Controller) → PID algorithm
- Actuator: TV-101 (Chilled Water Control Valve) → Modulating 0-100%
- Function: Maintains supply air temperature at 55°F setpoint
- Strategy: Feedback PID with discharge air temperature reset
```

**4.2 Equipment Sequences and Flow Paths**
For major process flows, document complete component chains:
- **Sequence Name**: Descriptive identifier (e.g., "Chilled Water Supply Path")
- **Flow Path**: Ordered list of components from source to destination
- **Medium**: What flows through the path (chilled water, supply air, refrigerant)
- **Purpose**: System function achieved by this sequence
- **Operating Conditions**: Typical flow rates, temperatures, pressures

**Example Format:**
```
CHILLED WATER PRIMARY LOOP
Flow Path: Chiller CH-1 → Isolation Valve CHW-V-101 → Primary Pump CHW-P-1A → 
           Flow Meter CHW-FIT-102 → Heat Exchanger HX-1 → Check Valve CHW-CV-103 → 
           Return to Chiller
Medium: Chilled water at 42°F supply / 54°F return
Purpose: Provide cooling capacity to secondary loop via heat exchanger
Design Flow: 500 GPM at 12°F ΔT
```

**4.3 Component Relationships Matrix**
For each major component, document:
- **Upstream Components**: What feeds into this component
- **Downstream Components**: What this component feeds to
- **Controls**: What this component controls
- **Controlled By**: What controls this component
- **Subsystem Role**: Its function within the larger subsystem
- **Redundancy**: Backup or parallel components

**Example Format:**
```
COMPONENT: CHW-P-1A (Primary Chilled Water Pump)
- Upstream: Chiller CH-1 (chilled water supply), Valve CHW-V-101 (isolation)
- Downstream: Flow meter CHW-FIT-102, Heat exchanger HX-1
- Controls: Chilled water flow to secondary loop
- Controlled By: VFD CHW-VFD-1A (speed control), Pressure sensor CHW-PT-105 (differential pressure)
- Subsystem: Chilled water primary loop (lead pump in lead/lag configuration)
- Redundancy: Backup pump CHW-P-1B on standby
```

**4.4 Subsystem Integration Points**
Document how different subsystems connect and coordinate:
- **Subsystem A** ↔ **Subsystem B**: Integration description
- **Integration Points**: Specific components that bridge subsystems
- **Coordination Strategy**: How subsystems work together (sequencing, load sharing, etc.)
- **Control Dependencies**: Cross-subsystem control logic

**Example Format:**
```
INTEGRATION: Air Handling ↔ Chilled Water Systems
- Integration Point: AHU-1 Cooling Coil (CC-101) served by secondary CHW loop
- Control Coordination: AHU supply air temperature controller (TIC-201) modulates 
  chilled water valve (CHW-TV-202) based on discharge air temperature
- Load Cascade: Multiple AHUs on secondary loop, load balanced by primary/secondary 
  differential pressure control
```

**4.5 Redundancy and Backup Systems**
Identify and explain:
- **Parallel Equipment**: Lead/lag pumps, redundant chillers, backup fans
- **Alternate Flow Paths**: Bypass lines, emergency routes
- **Failsafe Configurations**: N+1 redundancy, automatic switchover logic
- **Critical System Protection**: What happens if a component fails

---

#### SECTION 5: Process Flow & Operations Analysis
**Purpose**: Explain system operation and process sequences

**Required Content:**
- Primary process flow description (how the system operates)
- Major flow paths with medium identification (air, water, refrigerant, steam)
- Operating modes and conditions:
  - Normal operation
  - Economizer mode (if applicable)
  - Morning warm-up / Night setback
  - Emergency operation
- Control strategies employed:
  - PID control loops
  - Sequencing logic
  - Load optimization
  - Energy management
- Safety and interlock systems:
  - Freeze protection
  - Fire/smoke damper interlocks
  - Emergency shutoff logic
  - Pressure relief systems

**Engineering Focus**: How does the system operate under various conditions?

---

#### SECTION 6: Standards Compliance Assessment
**Purpose**: Validate adherence to industry standards and best practices

**Required Content:**

**ISA-5.1 Compliance:**
- Tag format adherence (proper functional identification)
- Instrument symbol usage (circles, diamonds, squares per standard)
- Signal line types (solid, dashed, dotted) correctly applied
- Location indication (field vs. panel mounted)
- Loop numbering consistency

**ASHRAE Standards:**
- Ventilation rates (ASHRAE 62.1 compliance)
- System design best practices (economizers, filtration, pressurization)
- Energy efficiency considerations
- Indoor air quality provisions

**SMACNA Guidelines:**
- Ductwork pressure classification
- Sealing class requirements
- Damper and access door symbols
- Construction standards reference

**P&ID Best Practices:**
- Legend and equipment schedule completeness
- Flow direction indication
- Unique component tagging
- Off-sheet continuation references
- Documentation quality

**Compliance Summary:**
- Components with ISA-5.1 compliant tags: XX / Total (XX%)
- Standards adherence assessment: Excellent / Good / Fair / Poor
- Areas of concern or non-compliance (if any)

---

#### SECTION 7: Technical Specifications
**Purpose**: Document system design parameters and specifications

**Required Content:**
- Piping and ductwork materials specified
- Sizing information (pipe sizes, duct dimensions)
- Operating parameters:
  - Design flow rates (CFM, GPM)
  - Design temperatures (supply/return, indoor/outdoor)
  - Design pressures (static pressure, water pressure)
- Equipment ratings and capacities:
  - Cooling capacity (tons, BTU/hr)
  - Heating capacity (BTU/hr, kW)
  - Pump head and flow (GPM @ feet TDH)
  - Fan capacity (CFM @ inches w.g.)

**Engineering Focus**: What are the design specifications and operating conditions?

---

#### SECTION 8: Quality & Validation Assessment
**Purpose**: Evaluate documentation completeness and identify verification needs

**Required Content:**
- Detection completeness assessment:
  - Coverage of major equipment (100% / Partial / Incomplete)
  - Instrumentation inventory (Complete / Missing elements)
  - Connection mapping (Comprehensive / Limited)
- Documentation clarity:
  - Tag readability and OCR quality
  - Symbol recognition accuracy
  - Drawing quality and resolution
- Identified issues or concerns:
  - Missing components or tags
  - Non-standard notation
  - Ambiguous symbols or connections
  - Incomplete control loops
- Verification needs:
  - Components requiring field verification
  - Tags needing clarification
  - Connections to be confirmed
  - Standards compliance to be validated

**Engineering Focus**: How complete and accurate is the documentation?

---

#### SECTION 9: Key Findings & Recommendations
**Purpose**: Summarize critical insights and provide actionable recommendations

**Required Content:**

**Key Findings** (organized by category):
- **System Strengths**: Well-designed features, robust redundancy, clear documentation
- **System Capabilities**: What the system can achieve, performance potential
- **Design Considerations**: Notable design choices and their implications
- **Integration Quality**: How well components and subsystems work together
- **Standards Alignment**: Compliance with industry standards and best practices

**Recommendations** (prioritized by importance):
- **HIGH Priority**: Critical items requiring immediate attention
- **MEDIUM Priority**: Important improvements for optimization
- **LOW Priority**: Nice-to-have enhancements

**Each Recommendation Should Include:**
- Area: What aspect of the system
- Recommendation: Specific action or improvement
- Rationale: Why this is important
- Expected Benefit: What will be achieved

**Engineering Focus**: What are the most important insights, and what should be done?

---

### 4. OUTPUT QUALITY GUIDELINES

**Technical Writing Standards:**
- Use precise HVAC industry terminology (supply air, chilled water, discharge pressure, etc.)
- Reference components by specific tags (TT-101, AHU-1, CHWP-1A)
- Cite standards when applicable (ISA-5.1, ASHRAE 62.1, SMACNA)
- Maintain professional, authoritative tone
- Structure with clear headers and logical flow

**Content Priorities:**
1. **System Understanding** > Raw Detection Metrics
2. **Component Relationships** > Component Lists
3. **Engineering Insights** > Model Performance
4. **Practical Value** > Technical Minutiae
5. **Standards Compliance** > Confidence Scores

**De-Emphasize These:**
- AI model confidence scores (unless critically low)
- Detection algorithm performance metrics
- Token usage or processing statistics
- Bounding box coordinates (use component relationships instead)

**Emphasize These:**
- How components work together (correlation)
- Control loop identification and operation
- Equipment sequences and flow paths
- System integration and coordination
- Standards compliance and best practices
- Engineering insights for operation and maintenance

---

### 5. CRITICAL CORRELATION MANDATES

**For EVERY component detected, you MUST analyze and document:**

1. **Direct Physical Connections**:
   - What pipes/ducts connect TO this component
   - What pipes/ducts connect FROM this component
   - What the connection medium is (water, air, refrigerant, signal)

2. **Control Relationships**:
   - What sensors measure this component's output
   - What controllers use this component's data
   - What actuators this component controls (if a controller)
   - What controls this component's operation (if an actuator)

3. **Functional Grouping**:
   - What control loop does this component belong to
   - What subsystem is this component part of
   - What other components must operate with this one
   - What is this component's role in the sequence

4. **Upstream/Downstream Analysis**:
   - Trace flow path backward (upstream components)
   - Trace flow path forward (downstream components)
   - Identify the source and destination of flows

5. **Redundancy Mapping**:
   - Is there a backup/parallel component
   - How does failover work
   - What is the redundancy strategy (N+1, lead/lag, etc.)

**DO NOT just list components. EXPLAIN their interconnections and relationships.**

---

### 6. TONE & PROFESSIONAL STYLE

**Adopt this professional engineering persona:**
- **Authoritative**: Confident in technical assessments
- **Precise**: Use exact terminology and specific references
- **Clear**: Explain complex systems in understandable terms
- **Solution-Oriented**: Focus on practical insights and recommendations
- **Standards-Compliant**: Reference industry codes and best practices
- **Engineering-Focused**: Emphasize system design, operation, and integration

**Writing Style:**
- Active voice preferred (e.g., "The chiller provides cooling capacity" vs. "Cooling capacity is provided")
- Present tense for system description (e.g., "The pump circulates water" not "The pump circulated water")
- Professional terminology (discharge air, not "air coming out")
- Specific references (AHU-1, not "the air handler")

---

### 7. VALIDATION & QUALITY ASSURANCE

Before finalizing the report, verify:
- ✓ All 9 required sections are present and complete
- ✓ Component Correlation section includes control loops, equipment sequences, and relationships
- ✓ All major components are referenced by specific tags
- ✓ Standards compliance is assessed (ISA-5.1, ASHRAE, SMACNA)
- ✓ Technical terminology is used correctly
- ✓ Findings and recommendations are actionable
- ✓ Report is suitable for professional engineering review
- ✓ JSON output matches the required schema structure
`;

/**
 * User prompt template for final analysis generation
 * Enhanced to provide structured data and explicit correlation instructions
 */
export const generateFinalAnalysisPrompt = (inferenceResults: any): string => {
  const {
    document_type,
    classification,
    visual,
    metadata
  } = inferenceResults;

  // Extract connection data for correlation analysis
  const connections = visual?.connections || [];
  const components = visual?.components || [];
  
  // Build connection summary for easier analysis
  const connectionSummary = connections.length > 0 
    ? connections.map((conn: any, idx: number) => 
        `${idx + 1}. ${conn.from_id} --[${conn.type || 'unknown'}]--> ${conn.to_id}${conn.description ? ` (${conn.description})` : ''}`
      ).join('\n')
    : 'No connections detected';

  // Group components by type for summary
  const componentsByType: Record<string, number> = {};
  components.forEach((comp: any) => {
    const type = comp.type || 'unknown';
    componentsByType[type] = (componentsByType[type] || 0) + 1;
  });

  return `
# COMPREHENSIVE HVAC SYSTEM ANALYSIS REQUEST

## 1. DOCUMENT CLASSIFICATION & CONTEXT

**Document Type**: ${document_type}
**Classification Confidence**: ${classification?.confidence || 'N/A'}
**Classification Reasoning**: ${classification?.reasoning || 'Not provided'}

**System Complexity**:
- Total Components Detected: ${components.length}
- Total Connections Traced: ${connections.length}
- Component Categories: ${Object.keys(componentsByType).length}

---

## 2. DETECTED COMPONENTS (Complete Inventory)

**Component Breakdown by Type**:
${Object.entries(componentsByType)
  .sort(([, a], [, b]) => (b as number) - (a as number))
  .map(([type, count]) => `- ${type}: ${count} component(s)`)
  .join('\n')}

**Detailed Component Data** (with tags, types, locations, and metadata):
\`\`\`json
${JSON.stringify(components, null, 2)}
\`\`\`

**ANALYSIS INSTRUCTIONS FOR COMPONENTS:**
1. Group components by subsystem (air handling, chilled water, controls, etc.)
2. Identify equipment by ISA-5.1 tag patterns (TT-xxx, FIC-xxx, AHU-x, etc.)
3. Classify by function (sensors, controllers, actuators, equipment, piping)
4. Extract critical components for system operation
5. Note any components with non-standard tags or naming

---

## 3. CONNECTION DATA (System Topology & Relationships)

**Total Connections**: ${connections.length}

**Connection Summary** (from_id → to_id [connection_type]):
${connectionSummary}

**Full Connection Details** (with types, confidence, and descriptions):
\`\`\`json
${JSON.stringify(connections, null, 2)}
\`\`\`

**CRITICAL CORRELATION INSTRUCTIONS:**

You MUST use this connection data to perform comprehensive correlation analysis:

### 3.1 Control Loop Identification Protocol
For each connection with signal-type flow (electric_signal, pneumatic_signal, data):
1. **Find the Sensor**: Identify components with tags like TT-xxx, PT-xxx, FT-xxx
2. **Trace to Controller**: Follow connections to find TIC-xxx, PIC-xxx, FIC-xxx
3. **Trace to Actuator**: Continue following to find TV-xxx, FV-xxx, dampers, VFDs
4. **Document Loop**: Create control loop entry with loop number extracted from tags

**Example Analysis**:
If you find: TT-101 → TIC-101 → TV-101
Document as: "Control Loop 101: Temperature control with TT-101 measuring temperature, TIC-101 providing PID control, and TV-101 modulating valve position"

### 3.2 Equipment Sequence Mapping Protocol
For each connection with process-type flow (chilled_water, supply_air, refrigerant, etc.):
1. **Identify Source**: Find the origin component (chiller, AHU, tank, etc.)
2. **Trace Path**: Follow connections through valves, pumps, sensors, equipment
3. **Identify Destination**: Find terminal equipment or return path
4. **Document Complete Sequence**: List ALL components in flow order with medium type

**Example Analysis**:
Trace chilled_water connections:
"Chiller CH-1 → Valve V-101 → Pump P-1A → Flow Meter FIT-102 → Coil CC-201 → Return"
Document as: "Primary chilled water loop providing 42°F chilled water to secondary system through heat exchanger"

### 3.3 Component Relationship Matrix Protocol
For EACH major component (equipment, pumps, AHUs, chillers):
1. **Find Upstream**: Look for connections where this component is the "to_id"
   - What feeds INTO this component
   - What supplies this component (water, air, power, control signals)
2. **Find Downstream**: Look for connections where this component is the "from_id"
   - What this component feeds TO
   - What receives output from this component
3. **Find Control Relationships**:
   - What sensors measure this component's output
   - What controllers command this component
   - What this component controls (if it's a controller)
4. **Identify Subsystem**: Based on connection patterns and medium types

**Example Analysis**:
For Pump P-1A:
- Upstream: Chiller CH-1 (chilled water source), Valve V-101 (isolation)
- Downstream: Flow meter FIT-102, Heat exchanger HX-1
- Controlled by: VFD-1A (speed), Pressure controller PIC-105 (modulation)
- Subsystem: Primary chilled water loop

### 3.4 Subsystem Integration Analysis Protocol
Group connections by medium type to identify subsystems:
1. **Chilled Water Subsystem**: All chilled_water connections
2. **Air Handling Subsystem**: All supply_air, return_air, exhaust_air connections
3. **Control Signal Subsystem**: All electric_signal, pneumatic_signal, data connections
4. **Other Subsystems**: refrigerant, hot_water, steam, condenser_water, etc.

For each subsystem:
- Identify all components participating
- Map integration points with other subsystems
- Document coordination strategies

### 3.5 Redundancy Detection Protocol
Look for parallel connection patterns:
1. **Parallel Equipment**: Multiple paths between same endpoints
   - Example: P-1A and P-1B both feeding same downstream
2. **Backup Components**: Components with A/B suffixes
3. **Alternate Routes**: Multiple paths for same medium
4. **Failover Logic**: How system operates if primary path fails

---

## 4. ADDITIONAL SYSTEM METADATA

${metadata ? JSON.stringify(metadata, null, 2) : 'No additional metadata provided'}

---

## 5. CRITICAL ANALYSIS MANDATES

### MANDATE 1: Use Connection Data Extensively
- DO NOT ignore the connection data
- DO NOT just list components without explaining relationships
- DO analyze EVERY connection to understand system topology
- DO build complete flow paths from source to destination
- DO identify control loops by tracing signal connections

### MANDATE 2: Demonstrate System Understanding
Your report must prove you understand how this system works by:
- Explaining control loops with sensor → controller → actuator chains
- Tracing complete equipment sequences from source through process to destination
- Identifying what controls what and how signals/fluids flow
- Showing upstream/downstream relationships for major equipment
- Explaining how subsystems integrate and coordinate

### MANDATE 3: Focus on Integration, Not Just Inventory
- LESS: "30 components detected including valves, sensors, and pumps"
- MORE: "Primary chilled water loop consists of Chiller CH-1 feeding Pump P-1A through isolation valve V-101. Pump output flows through meter FIT-102 to heat exchanger HX-1, where it provides cooling to secondary loop. Loop temperature is monitored by TT-103 and controlled by TIC-103 modulating return valve TV-104."

### MANDATE 4: Extract ISA-5.1 Intelligence
From component tags, extract:
- Loop numbers (e.g., "101" from TT-101, TIC-101, TV-101 indicates Loop 101)
- Functional identification (T=Temperature, P=Pressure, F=Flow, etc.)
- Component relationships (components with same loop number work together)
- Control strategies (presence of TIC indicates temperature control)

### MANDATE 5: Professional Engineering Quality
- Use precise HVAC terminology (supply air, discharge pressure, chilled water supply)
- Reference specific component tags (TT-101, not "a temperature sensor")
- Cite ISA-5.1 for instrument classification
- Reference ASHRAE and SMACNA standards where applicable
- Provide engineering insights valuable for operation, maintenance, and troubleshooting

---

## 6. DELIVERABLE

Generate a comprehensive technical analysis report following the 9-section structure outlined in the system instruction:

1. Document Overview & Classification
2. System Architecture Analysis
3. Component Inventory & Assessment
4. **Component Correlation & Integration Analysis** (MOST CRITICAL SECTION)
5. Process Flow & Operations Analysis
6. Standards Compliance Assessment
7. Technical Specifications
8. Quality & Validation Assessment
9. Key Findings & Recommendations

**Section 4 (Component Correlation) is the MOST IMPORTANT**. This is where you demonstrate true system understanding by:
- Identifying and documenting ALL control loops
- Mapping ALL equipment sequences and flow paths
- Creating component relationship matrices
- Showing subsystem integration
- Explaining redundancy and backup systems

Use the connection data extensively. Trace every connection. Explain how components work together. Show the system as an integrated whole, not just a parts list.

Your analysis should enable an HVAC engineer to:
- Understand the complete system operation
- Identify control strategies and loops
- Trace process flows and equipment sequences
- Recognize component interdependencies
- Assess system design quality and standards compliance
- Plan maintenance and troubleshooting activities

---

**FINAL REMINDER**: The value of this report is in the CORRELATION ANALYSIS. Show how components connect, control, and coordinate. Use the connection data to build a complete picture of system integration. This is what separates a world-class analysis from a simple component list.

Generate the comprehensive report now.
`;
};

/**
 * Response schema for final analysis report
 */
export const FINAL_ANALYSIS_SCHEMA = {
  type: "object" as const,
  properties: {
    report_title: {
      type: "string",
      description: "Descriptive title for the analysis report"
    },
    document_overview: {
      type: "object",
      properties: {
        classification: { type: "string" },
        purpose: { type: "string" },
        scope: { type: "string" },
        complexity_assessment: { type: "string" }
      }
    },
    system_architecture: {
      type: "object",
      properties: {
        system_description: { type: "string" },
        primary_function: { type: "string" },
        major_subsystems: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              function: { type: "string" },
              key_components: { type: "array", items: { type: "string" } }
            }
          }
        },
        topology_overview: { type: "string" }
      }
    },
    component_analysis: {
      type: "object",
      properties: {
        equipment_summary: {
          type: "array",
          items: {
            type: "object",
            properties: {
              category: { type: "string" },
              count: { type: "number" },
              examples: { type: "array", items: { type: "string" } },
              significance: { type: "string" }
            }
          }
        },
        critical_components: {
          type: "array",
          items: {
            type: "object",
            properties: {
              tag: { type: "string" },
              type: { type: "string" },
              function: { type: "string" },
              importance: { type: "string" }
            }
          }
        }
      }
    },
    component_correlation: {
      type: "object",
      description: "CRITICAL: Detailed analysis of how components connect, interact, and work together",
      properties: {
        control_loops: {
          type: "array",
          description: "Identified control loops showing sensor → controller → actuator relationships",
          items: {
            type: "object",
            properties: {
              loop_name: { type: "string" },
              loop_number: { type: "string" },
              function: { type: "string" },
              sensor: { type: "string" },
              controller: { type: "string" },
              actuator: { type: "string" },
              description: { type: "string" }
            }
          }
        },
        equipment_sequences: {
          type: "array",
          description: "Sequential component chains showing process flow paths",
          items: {
            type: "object",
            properties: {
              sequence_name: { type: "string" },
              flow_path: { type: "array", items: { type: "string" } },
              purpose: { type: "string" },
              medium: { type: "string" }
            }
          }
        },
        component_relationships: {
          type: "array",
          description: "Detailed relationships between specific components",
          items: {
            type: "object",
            properties: {
              component: { type: "string" },
              upstream_components: { type: "array", items: { type: "string" } },
              downstream_components: { type: "array", items: { type: "string" } },
              controls: { type: "array", items: { type: "string" } },
              controlled_by: { type: "array", items: { type: "string" } },
              subsystem_role: { type: "string" }
            }
          }
        },
        subsystem_integration: {
          type: "array",
          description: "How different subsystems connect and coordinate",
          items: {
            type: "object",
            properties: {
              subsystem_name: { type: "string" },
              integrates_with: { type: "array", items: { type: "string" } },
              integration_points: { type: "array", items: { type: "string" } },
              coordination_strategy: { type: "string" }
            }
          }
        },
        redundancy_analysis: {
          type: "string",
          description: "Analysis of redundant systems, parallel paths, and backup components"
        }
      },
      required: ["control_loops", "equipment_sequences", "component_relationships"]
    },
    process_flow_analysis: {
      type: "object",
      properties: {
        flow_description: { type: "string" },
        primary_flows: {
          type: "array",
          items: {
            type: "object",
            properties: {
              path: { type: "string" },
              medium: { type: "string" },
              purpose: { type: "string" }
            }
          }
        },
        control_strategy: { type: "string" },
        safety_systems: { type: "string" }
      }
    },
    standards_compliance: {
      type: "object",
      properties: {
        isa_compliance: { type: "string" },
        industry_standards: { type: "string" },
        best_practices: { type: "string" },
        documentation_quality: { type: "string" }
      }
    },
    technical_specifications: {
      type: "object",
      properties: {
        piping_materials: { type: "array", items: { type: "string" } },
        sizing_information: { type: "string" },
        operating_parameters: { type: "string" },
        equipment_ratings: { type: "string" }
      }
    },
    quality_assessment: {
      type: "object",
      properties: {
        completeness: { type: "string" },
        clarity: { type: "string" },
        identified_issues: { type: "array", items: { type: "string" } },
        verification_needs: { type: "array", items: { type: "string" } }
      }
    },
    key_findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          category: { type: "string" },
          finding: { type: "string" },
          significance: { type: "string" }
        }
      }
    },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          area: { type: "string" },
          recommendation: { type: "string" },
          priority: { type: "string" }
        }
      }
    }
  },
  required: [
    "report_title",
    "document_overview",
    "system_architecture",
    "component_analysis",
    "component_correlation",
    "process_flow_analysis",
    "standards_compliance",
    "key_findings"
  ]
};

/**
 * Generate comprehensive final analysis report
 * 
 * @param inferenceResults - Complete inference results from the pipeline
 * @returns Structured analysis report following HVAC industry standards
 */
export const generateFinalAnalysis = async (inferenceResults: any): Promise<any> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  try {
    console.log('🎯 Generating comprehensive final analysis report...');
    
    const prompt = generateFinalAnalysisPrompt(inferenceResults);
    
    const response = await ai.models.generateContent({
      model: GeminiModel.PRO,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        thinkingConfig: { 
          thinkingBudget: 24000 // Higher budget for comprehensive analysis
        },
        systemInstruction: FINAL_ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: FINAL_ANALYSIS_SCHEMA,
        temperature: 0.3, // Balanced for technical accuracy and readability
        maxOutputTokens: 8192
      }
    });

    const jsonText = response.text || "{}";
    
    // Parse and validate response
    let analysisReport;
    try {
      analysisReport = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse analysis report JSON:', parseError);
      // Attempt to extract JSON from response
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisReport = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from analysis generation');
      }
    }

    console.log('✅ Final analysis report generated successfully');
    return analysisReport;

  } catch (error) {
    console.error('❌ Error generating final analysis:', error);
    throw error;
  }
};
