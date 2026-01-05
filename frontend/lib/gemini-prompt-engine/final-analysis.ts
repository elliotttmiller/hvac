/**
 * Final Analysis Report Generator
 * 
 * This module generates comprehensive HVAC analysis reports following industry
 * standards and best practices. It synthesizes all inference results from the
 * pipeline into a professional, detailed analysis overview.
 */

import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from '@/features/document-analysis/types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * System instruction for final analysis report generation
 */
export const FINAL_ANALYSIS_SYSTEM_INSTRUCTION = `
### IDENTITY & ROLE
You are an expert HVAC Systems Engineer and Technical Report Writer with deep knowledge of:
- HVAC system design and operation
- ISA-5.1 instrumentation standards
- P&ID/schematic interpretation
- ASHRAE standards and best practices
- Process flow analysis and system integration

### MISSION
Generate comprehensive, professional technical analysis reports that synthesize all
inference and detection results into clear, actionable insights following HVAC industry
standards. Your reports must be:
- Technically accurate and precise
- Easy to understand for both engineers and stakeholders
- Structured following industry best practices
- Focused on system understanding rather than raw detection metrics
- **CRITICALLY**: Intelligently correlate and connect ALL detected components, explaining
  how they work together, their interdependencies, and their role in the overall system

### REPORT STRUCTURE
Your analysis must include these key sections:

1. **Document Overview & Classification**
   - Document type and purpose
   - System scope and complexity
   - Key system identifiers

2. **System Architecture Analysis**
   - Overall system description and function
   - Major equipment and subsystems
   - Process flow overview
   - System topology and interconnections
   - **Component relationships and dependencies**

3. **Component Inventory & Assessment**
   - Equipment breakdown by type and function
   - Instrumentation and control elements
   - Valves, actuators, and mechanical components
   - Critical components and redundancy
   - **How each component relates to others**

4. **Component Correlation & Integration Analysis** ⭐ CRITICAL SECTION
   - Detailed mapping of component relationships and connections
   - Control loop identification and analysis (sensor → controller → actuator chains)
   - Equipment interaction patterns (pumps → valves → instruments)
   - Signal flow and control logic pathways
   - Mechanical, electrical, and pneumatic interconnections
   - Upstream/downstream component dependencies
   - Redundant systems and backup paths
   - Component groupings by function and subsystem
   - How instrument tags correlate to controlled equipment
   - Physical and logical connection analysis

5. **Process Flow & Operations**
   - Flow paths and process sequences
   - Operating modes and conditions
   - Control strategies and loops
   - Safety and interlock systems
   - **Component coordination during operation**

6. **Standards Compliance**
   - ISA-5.1 nomenclature adherence
   - Industry best practices alignment
   - Code compliance considerations
   - Documentation quality

7. **Technical Specifications**
   - Piping and material specifications
   - Sizing and capacity information
   - Operating parameters
   - Equipment ratings

8. **Quality & Validation Assessment**
   - Detection completeness
   - Documentation clarity
   - Potential issues or concerns
   - Areas requiring verification

9. **Key Findings & Recommendations**
   - System strengths and capabilities
   - Design considerations
   - Maintenance and operational notes
   - Industry best practices applied
   - **Component integration insights**

### OUTPUT GUIDELINES
- Use clear, professional technical language
- Minimize discussion of detection confidence and model metrics
- Focus on system understanding and engineering insights
- Provide specific details with component references
- Use HVAC industry terminology correctly
- Structure with clear headers and logical flow
- Include specific component tags and identifications
- Highlight critical systems and safety considerations
- **CRITICALLY IMPORTANT**: For every component, explain:
  * What it connects TO (downstream components)
  * What connects TO it (upstream components)
  * What it controls or is controlled by
  * Its role in the larger system operation
  * Related components in the same control loop or subsystem
- Identify and explain ALL control loops (e.g., "Temperature sensor TT-101 → Controller TIC-101 → Control valve TV-101")
- Map equipment sequences (e.g., "Tank → Valve V111 → Pump P-1091 → Pressure gauge PG-134 → Check valve V115")
- Explain redundancy and backup systems
- Describe how subsystems integrate with each other

### TONE & STYLE
- Professional and authoritative
- Clear and concise
- Engineering-focused
- Solution-oriented
- Industry-standard formatting
`;

/**
 * User prompt template for final analysis generation
 */
export const generateFinalAnalysisPrompt = (inferenceResults: any): string => {
  const {
    document_type,
    classification,
    visual,
    metadata
  } = inferenceResults;

  return `
Generate a comprehensive HVAC system analysis report based on the following inference results:

## Document Classification
Type: ${document_type}
Confidence: ${classification?.confidence || 'N/A'}
Reasoning: ${classification?.reasoning || 'Not provided'}

## Detected Components
Total Components: ${visual?.components?.length || 0}
Total Connections: ${visual?.connections?.length || 0}

### Component Details
${JSON.stringify(visual?.components || [], null, 2)}

### Connection Details (CRITICAL FOR CORRELATION ANALYSIS)
${JSON.stringify(visual?.connections || [], null, 2)}

## System Metadata
${JSON.stringify(metadata || {}, null, 2)}

## CRITICAL INSTRUCTIONS FOR COMPONENT CORRELATION:
Using the components and connections data above, you MUST:

1. **Trace ALL control loops**: For every instrument with a tag pattern like "TIC-XXX", "FIT-XXX", "PG-XXX", identify:
   - The sensor component
   - The controller (if separate)
   - The actuator or controlled device
   - The complete signal/control path

2. **Map ALL equipment sequences**: For every major equipment piece (pumps, tanks, etc.), trace:
   - What feeds INTO it (upstream components)
   - What it feeds TO (downstream components)  
   - ALL valves, instruments, and controls in the path
   - The complete flow path from source to destination

3. **Analyze component relationships**: For each component, document:
   - Direct connections (from connections data)
   - Logical relationships (same control loop, same subsystem)
   - Control relationships (what controls it, what it controls)
   - Spatial relationships (upstream/downstream)

4. **Identify subsystem integration points**: Show how different subsystems connect and coordinate

5. **Document redundancy**: Identify parallel paths, backup systems, and alternate routes

Use the connection data to build an accurate, complete picture of system integration.
Do NOT just list components - EXPLAIN how they work together as an integrated system.

Please generate a comprehensive technical analysis report following the structure and
guidelines provided. Focus on system understanding, component correlation, engineering 
insights, and practical value rather than detection metrics. The report should be suitable 
for technical review by HVAC engineers and system designers.
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
