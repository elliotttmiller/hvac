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

// Semantic Cache: In-memory caching for cost optimization
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

class SemanticCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly maxAge = 3600000; // 1 hour
  private readonly maxSize = 50; // Keep last 50 analyses

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    entry.hits++;
    console.log(`✅ Cache HIT (hits: ${entry.hits})`);
    return entry.data;
  }

  set<T>(key: string, data: T): void {
    if (this.cache.size >= this.maxSize) {
      const oldest = Array.from(this.cache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      this.cache.delete(oldest[0]);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      hits: 0
    });
  }

  clear(): void {
    this.cache.clear();
  }
}

const cache = new SemanticCache();

// ISA-5.1 Validation: Engineering standards compliance
const ISA_5_1_FIRST_LETTERS: Record<string, string> = {
  'A': 'Analysis',
  'B': 'Burner/Combustion',
  'C': 'Conductivity',
  'D': 'Density/Specific Gravity',
  'E': 'Voltage',
  'F': 'Flow',
  'G': 'Gauging/Position',
  'H': 'Hand',
  'I': 'Current',
  'J': 'Power',
  'K': 'Time/Schedule',
  'L': 'Level',
  'M': 'Moisture',
  'N': 'User Defined',
  'O': 'User Defined',
  'P': 'Pressure',
  'Q': 'Quantity/Event',
  'R': 'Radiation',
  'S': 'Speed/Frequency',
  'T': 'Temperature',
  'U': 'Multivariable',
  'V': 'Vibration',
  'W': 'Weight/Force',
  'X': 'Unclassified',
  'Y': 'Event/State',
  'Z': 'Position/Dimension'
};

function validateISATag(tag: string): { valid: boolean; variable?: string; issue?: string } {
  const match = tag.match(/^([A-Z]+)-?(\d+)$/i);
  if (!match) {
    return { valid: false, issue: 'Invalid tag format' };
  }
  
  const [, letters, number] = match;
  const firstLetter = letters[0].toUpperCase();
  const variable = ISA_5_1_FIRST_LETTERS[firstLetter];
  
  if (!variable) {
    return { valid: false, issue: `Unrecognized ISA-5.1 symbol: ${firstLetter}` };
  }
  
  return { valid: true, variable };
}

// Enhanced component validation with ISA-5.1 compliance
function enhanceComponentsWithValidation(components: DetectedComponent[]): DetectedComponent[] {
  return components.map(comp => {
    if (comp.id) {
      const validation = validateISATag(comp.id);
      if (!validation.valid && validation.issue) {
        console.warn(`ISA-5.1 Warning: ${comp.id} - ${validation.issue}`);
      } else if (validation.valid && validation.variable) {
        console.log(`ISA-5.1 Valid: ${comp.id} (${validation.variable})`);
      }
    }
    return comp;
  });
}

/**
 * STAGE 1: Forensic Component Extraction
 * High-precision identification and technical profiling of assets.
 * Enhanced with semantic caching and ISA-5.1 validation.
 */
export const stage1Extraction = async (
  base64Image: string, 
  mimeType: string
): Promise<ExtractionResult> => {
  // Generate cache key based on image data
  const cacheKey = `stage1:${base64Image.length}:${base64Image.substring(0, 100)}`;
  
  // Check cache first for cost optimization
  const cached = cache.get<ExtractionResult>(cacheKey);
  if (cached) {
    console.log('⚡ Instant result from cache (saved API cost)');
    return cached;
  }

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
    2. Extract the exact Tag ID following ISA-5.1 format (e.g. TT-101, PT-205).
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
  
  let components: DetectedComponent[] = result.detectedComponents?.map((c: any) => {
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

  // Apply ISA-5.1 validation to enhance component quality
  components = enhanceComponentsWithValidation(components);

  const extractionResult: ExtractionResult = { detectedComponents: components };
  
  // Cache the result for future requests (cost optimization)
  cache.set(cacheKey, extractionResult);
  console.log('💾 Result cached for future requests');

  return extractionResult;
};

/**
 * STAGE 2: Neural Interpretation & Forensic Report
 * Deep-dive analysis of system logic, flaws, and optimizations.
 * Enhanced with semantic caching for cost optimization.
 */
export const stage2Analysis = async (
  base64Image: string, 
  mimeType: string,
  detectedComponents: DetectedComponent[]
): Promise<AnalysisReportResult> => {
  // Generate cache key
  const componentIds = detectedComponents.map(c => c.id).sort().join(',');
  const cacheKey = `stage2:${base64Image.length}:${componentIds}`;
  
  // Check cache first
  const cached = cache.get<AnalysisReportResult>(cacheKey);
  if (cached) {
    console.log('⚡ Instant analysis from cache (saved API cost)');
    return cached;
  }

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

  const analysisResult: AnalysisReportResult = { 
    analysisReport: response.text || "Report generation failed." 
  };
  
  // Cache the result
  cache.set(cacheKey, analysisResult);
  console.log('💾 Analysis cached for future requests');

  return analysisResult;
};
