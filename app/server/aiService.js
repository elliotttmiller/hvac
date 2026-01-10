import { GoogleGenAI, Type } from '@google/genai';
import { HVAC_KNOWLEDGE_BASE } from '../data/hvacKnowledgeBase.js';
import { getComponentPricing } from '../services/pricingService.js';

// Simple in-memory cache
class SemanticCache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 3600000;
    this.maxSize = 50;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    entry.hits++;
    return entry.data;
  }
  set(key, data) {
    if (this.cache.size >= this.maxSize) {
      const oldest = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      this.cache.delete(oldest[0]);
    }
    this.cache.set(key, { data, timestamp: Date.now(), hits: 0 });
  }
}

const cache = new SemanticCache();

function getEffectiveApiKey() {
  return process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
}

function validateISATag(tag) {
  const map = {
    'A': 'Analysis','B':'Burner/Combustion','C':'Conductivity','D':'Density/Specific Gravity','E':'Voltage','F':'Flow','G':'Gauging/Position','H':'Hand','I':'Current','J':'Power','K':'Time/Schedule','L':'Level','M':'Moisture','N':'User Defined','O':'User Defined','P':'Pressure','Q':'Quantity/Event','R':'Radiation','S':'Speed/Frequency','T':'Temperature','U':'Multivariable','V':'Vibration','W':'Weight/Force','X':'Unclassified','Y':'Event/State','Z':'Position/Dimension'
  };
  const m = tag.match(/^([A-Z]+)-?(\d+)$/i);
  if (!m) return { valid: false, issue: 'Invalid tag format' };
  const first = m[1][0].toUpperCase();
  const variable = map[first];
  if (!variable) return { valid: false, issue: `Unrecognized ISA-5.1 symbol: ${first}` };
  return { valid: true, variable };
}

function enhanceComponentsWithValidation(components) {
  return components.map(comp => {
    if (comp.id) {
      const validation = validateISATag(comp.id);
      if (!validation.valid) console.warn(`ISA-5.1 Warning: ${comp.id} - ${validation.issue}`);
    }
    return comp;
  });
}

export async function stage1Extraction(base64Image, mimeType) {
  const cacheKey = `stage1:${base64Image.length}:${base64Image.substring(0,100)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const apiKey = getEffectiveApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `ROLE: Senior Instrumentation & Controls Engineer\nKNOWLEDGE_BASE: ${HVAC_KNOWLEDGE_BASE}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [ { inlineData: { mimeType, data: base64Image } }, { text: prompt } ] },
    config: {
      thinkingConfig: { thinkingBudget: 4096 },
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: { detectedComponents: { type: Type.ARRAY } },
        required: ['detectedComponents']
      }
    }
  });

  const result = JSON.parse(response.text || '{}');
  let components = result.detectedComponents || [];

  components = components.map(c => {
    const pricing = getComponentPricing(c);
    return { ...c, cost: pricing.matched_sku !== 'N/A' ? pricing.estimated_cost : c.cost, sku: pricing.matched_sku !== 'N/A' ? pricing.matched_sku : c.sku };
  });

  components = enhanceComponentsWithValidation(components);
  const extractionResult = { detectedComponents: components };
  cache.set(cacheKey, extractionResult);
  return extractionResult;
}

export async function stage2Analysis(base64Image, mimeType, detectedComponents) {
  const componentIds = (detectedComponents || []).map(c => c.id).sort().join(',');
  const cacheKey = `stage2:${base64Image.length}:${componentIds}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const apiKey = getEffectiveApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const context = `Extracted Components List: ${JSON.stringify((detectedComponents || []).map(c=>({id:c.id,name:c.name,type:c.type})) )}`;
  const prompt = `Professional Forensic HVAC Engineer. CONTEXT: ${context}`;

  const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: { parts: [ { inlineData: { mimeType, data: base64Image } }, { text: prompt } ] }, config: { thinkingConfig: { thinkingBudget: 4096 }, maxOutputTokens: 20000 } });

  const analysisResult = { analysisReport: response.text || 'Report generation failed.' };
  cache.set(cacheKey, analysisResult);
  return analysisResult;
}
