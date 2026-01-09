import { GoogleGenAI, Type } from "@google/genai";
import { DetectedComponent } from "../types";
import { HVAC_KNOWLEDGE_BASE } from "../data/hvacKnowledgeBase";
import { getComponentPricing } from "./pricingService";

export type ExtractionResult = {
  detectedComponents: DetectedComponent[];
};

export type AnalysisReportResult = {
  analysisReport: string;
};

/**
 * STAGE 1: Forensic Component Extraction
 * High-precision identification and technical profiling of assets.
 */
export const stage1Extraction = async (
  base64Image: string, 
  mimeType: string
): Promise<ExtractionResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    # ROLE
    Senior Instrumentation & Controls Engineer. Expert in ISA-5.1 standards.

    # OBJECTIVE
    Perform a forensic extraction of every identifiable component in the provided HVAC P&ID. 
    Focus on granularity and technical accuracy.

    # KNOWLEDGE BASE
    ${HVAC_KNOWLEDGE_BASE}

    # REQUIREMENTS
    1. Identify every tag/instrument (VAV, TT, PT, TIC, Valve, Actuator, etc.).
    2. Extract the exact Tag ID (e.g. VAV-101).
    3. Determine the Manufacturer if visible or common for this symbol type.
    4. Estimate installation man-hours based on standard MCAA/NECA labor units.
    5. Provide specific technical specifications (Voltage, Signal Type, Range).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 4096 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          detectedComponents: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                status: { type: Type.STRING },
                cost: { type: Type.NUMBER },
                sku: { type: Type.STRING },
                description: { type: Type.STRING },
                maintenanceNotes: { type: Type.STRING },
                estimatedLifespan: { type: Type.STRING },
                efficiencyRating: { type: Type.STRING },
                estimatedInstallHours: { type: Type.NUMBER },
                technicalSpecs: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            key: { type: Type.STRING },
                            value: { type: Type.STRING }
                        },
                        required: ["key", "value"]
                    }
                }
              },
              required: ["id", "name", "type", "confidence", "status", "cost", "sku", "description", "technicalSpecs", "estimatedInstallHours"]
            }
          }
        },
        required: ["detectedComponents"]
      }
    }
  });

  const result = JSON.parse(response.text || "{}");
  
  const components: DetectedComponent[] = result.detectedComponents?.map((c: any) => {
    const specsMap: { [key: string]: string } = {};
    if (Array.isArray(c.technicalSpecs)) {
        c.technicalSpecs.forEach((spec: { key: string, value: string }) => {
            if (spec.key && spec.value) {
                specsMap[spec.key] = spec.value;
            }
        });
    }

    const componentToMatch: DetectedComponent = {
      ...c,
      technicalSpecs: specsMap,
      status: (c.status === 'verified' || c.status === 'review') ? c.status : 'review'
    };

    // Integrate Pricing Logic - Hydrating from Catalog Truth
    const pricing = getComponentPricing(componentToMatch);

    return {
      ...componentToMatch,
      cost: pricing.matched_sku !== "N/A" ? pricing.estimated_cost : c.cost,
      sku: pricing.matched_sku !== "N/A" ? pricing.matched_sku : c.sku,
      name: pricing.matched_sku !== "N/A" ? `${c.name} [${pricing.matched_sku}]` : c.name,
      description: pricing.description || c.description
    };
  }) || [];

  return { detectedComponents: components };
};

/**
 * STAGE 2: Neural Interpretation & Forensic Report
 * Deep-dive analysis of system logic, flaws, and optimizations.
 */
export const stage2Analysis = async (
  base64Image: string, 
  mimeType: string,
  detectedComponents: DetectedComponent[]
): Promise<AnalysisReportResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const context = `Extracted Components List: ${JSON.stringify(detectedComponents.map(c => ({ id: c.id, name: c.name, type: c.type })))}`;

  const prompt = `
    # ROLE
    Professional Forensic HVAC Engineer (PE).

    # CONTEXT
    Components already extracted: ${context}

    # OBJECTIVE
    Generate a high-density forensic report based on the provided P&ID. 

    # TASKS
    1. **System Topology**: Define the sequence of operations logic.
    2. **Critical Flaw Detection**: Identify safety gaps (Missing freeze-stats, static high limits, flow switches).
    3. **Engineering Observations**: Logic check on control loops.
    4. **Optimization Recommendations**: Energy recovery, VFD integration, and DCV strategies.

    # OUTPUT FORMAT
    Strict Markdown. Use professional engineering terminology.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 4096 },
      maxOutputTokens: 20000
    }
  });

  return { analysisReport: response.text || "Report generation failed." };
};
