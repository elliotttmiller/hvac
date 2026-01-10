import { GoogleGenAI, Type } from "@google/genai";
import { DetectedComponent } from "../types";
import { HVAC_KNOWLEDGE_BASE } from "../data/hvacKnowledgeBase";
import { getComponentPricing } from "./pricingService";
import { aiCache } from "./semanticCache";

// Single source of truth for the active model
export const ACTIVE_MODEL_NAME = 'gemini-3-flash-preview';

export type ExtractionResult = {
  detectedComponents: DetectedComponent[];
};

export type AnalysisReportResult = {
  analysisReport: string;
};

/**
 * STAGE 1: Forensic Component Extraction
 * High-precision identification and technical profiling of assets.
 * OPTIMIZED: Uses Gemini 3 Flash for maximum cost-efficiency while maintaining high reasoning via thinking budget.
 */
export const stage1Extraction = async (
  base64Image: string, 
  mimeType: string
): Promise<ExtractionResult> => {
  // 1. CACHE CHECK
  const cacheKey = aiCache.generateKey('STAGE_1_EXTRACTION', base64Image);
  const cachedResult = aiCache.get<ExtractionResult>(cacheKey);
  
  if (cachedResult) {
      return cachedResult;
  }

  // 2. API EXECUTION
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const prompt = `
    # ROLE
    Senior Instrumentation & Controls Engineer. Expert in ISA-5.1 standards.

    # OBJECTIVE
    Perform a rigorous, pixel-level forensic extraction of EVERY single component in the P&ID. 
    It is critical to detect ALL assets, not just a sample. High recall is the priority.

    # STRATEGY - CRITICAL
    1.  **Systematic Grid Scan**: Visually traverse the drawing from Top-Left to Bottom-Right, section by section.
    2.  **Exhaustive Listing**: Do NOT group similar items (e.g., do not say "3x VAVs"). You must return a distinct JSON object for EACH individual component found.
    3.  **Symbol Sensitivity**: deeply analyze small circles (sensors), distinct valve geometries, damper blades, and equipment tags.
    4.  **Implicit Detection**: If a line interacts with a device, check for associated actuators or sensors that might be unlabeled but visually present.

    # KNOWLEDGE BASE
    ${HVAC_KNOWLEDGE_BASE}

    # REQUIREMENTS
    1. Identify every tag/instrument (VAV, TT, PT, TIC, Valve, Actuator, Dampers, Thermostats, Pumps, Fans, etc.).
    2. Extract the exact Tag ID (e.g., VAV-101). If ID is illegible or missing, generate a logical unique ID (e.g., VAV-001, VAV-002).
    3. Determine the Manufacturer if visible or common for this symbol type.
    4. Estimate installation man-hours based on standard MCAA/NECA labor units.
    5. Provide specific technical specifications (Voltage, Signal Type, Range).
  `;

  const response = await ai.models.generateContent({
    model: ACTIVE_MODEL_NAME,
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 16000 },
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

  const finalResult = { detectedComponents: components };

  // 3. CACHE SET
  aiCache.set(cacheKey, finalResult);

  return finalResult;
};

/**
 * STAGE 2: AI Interpretation & Forensic Report
 * Deep-dive analysis of system logic, flaws, and optimizations.
 * OPTIMIZED: Uses Gemini 3 Flash for efficient yet professional engineering reasoning.
 */
export const stage2Analysis = async (
  base64Image: string, 
  mimeType: string,
  detectedComponents: DetectedComponent[]
): Promise<AnalysisReportResult> => {
  // 1. CACHE CHECK (Semantic: Image + Component Context)
  // If the user manually edits components in the UI, this key changes, triggering a fresh analysis.
  const cacheKey = aiCache.generateKey('STAGE_2_ANALYSIS', base64Image, detectedComponents);
  const cachedResult = aiCache.get<AnalysisReportResult>(cacheKey);

  if (cachedResult) {
      return cachedResult;
  }

  // 2. API EXECUTION
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const context = `Extracted Components List: ${JSON.stringify(detectedComponents.map(c => ({ id: c.id, name: c.name, type: c.type })))}`;

  const prompt = `
    # ROLE
    Professional Forensic HVAC Engineer (PE).

    # CONTEXT
    Components already extracted: ${context}

    # OBJECTIVE
    Generate a high-density, professionally formatted forensic report.

    # OUTPUT STRUCTURE RULES
    1.  **Start with a Blockquote**: Use ">" to create an Executive Summary at the very top. Summarize the system type, overall health, and critical actions in 3-4 sentences.
    2.  **Section Headers**: Use "##" for major sections (System Topology, Critical Findings, Recommendations).
    3.  **Bulleted Lists**: Use lists for findings to ensure readability.
    4.  **Tables**: If comparing data (e.g., flow rates, schedules), use Markdown tables.

    # CONTENT TASKS
    1.  **System Topology**: Define the sequence of operations logic.
    2.  **Critical Flaw Detection**: Identify safety gaps (Missing freeze-stats, static high limits, flow switches).
    3.  **Engineering Observations**: Logic check on control loops.
    4.  **Optimization Recommendations**: Energy recovery, VFD integration.

    # FORMATTING CONSTRAINT
    *   Do NOT include standard memo headers (To, From, Date).
    *   Start directly with the Executive Summary blockquote.
    *   Use technical but accessible language.
  `;

  const response = await ai.models.generateContent({
    model: ACTIVE_MODEL_NAME,
    contents: {
      parts: [
        { inlineData: { mimeType: mimeType, data: base64Image } },
        { text: prompt }
      ]
    },
    config: {
      thinkingConfig: { thinkingBudget: 12000 },
      maxOutputTokens: 20000
    }
  });

  const finalResult = { analysisReport: response.text || "Report generation failed." };

  // 3. CACHE SET
  aiCache.set(cacheKey, finalResult);

  return finalResult;
};