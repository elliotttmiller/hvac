import { GoogleGenAI, Type } from '@google/genai';
import { HVAC_KNOWLEDGE_BASE } from '../data/hvacKnowledgeBase.js';
import { getComponentPricing } from '../services/pricingService.js';

// Production-grade in-memory cache with statistics
class SemanticCache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 3600000; // 1 hour TTL
    this.maxSize = 100; // Increased capacity
    this.stats = {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalSaved: 0 // Estimated cost savings
    };
  }
  
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }
    
    entry.hits++;
    this.stats.hits++;
    this.stats.totalSaved += 0.03; // Approximate cost per request
    console.log(`[Cache HIT] Key: ${key.substring(0, 30)}... (${entry.hits} hits, $${this.stats.totalSaved.toFixed(2)} saved)`);
    return entry.data;
  }
  
  set(key, data) {
    if (this.cache.size >= this.maxSize) {
      const oldest = Array.from(this.cache.entries()).sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      this.cache.delete(oldest[0]);
      this.stats.evictions++;
      console.log(`[Cache] Evicted oldest entry (total evictions: ${this.stats.evictions})`);
    }
    this.cache.set(key, { data, timestamp: Date.now(), hits: 0 });
  }
  
  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0 
      ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(1)
      : 0;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: `${hitRate}%`,
      evictions: this.stats.evictions,
      estimatedSavings: `$${this.stats.totalSaved.toFixed(2)}`
    };
  }
  
  clear() {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0, evictions: 0, totalSaved: 0 };
  }
}

const cache = new SemanticCache();

function getEffectiveApiKey() {
  const key = process.env.AI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || '';
  if (!key) {
    throw new Error('AI API key not configured. Please set AI_API_KEY environment variable.');
  }
  return key;
}

// Exponential backoff retry logic
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on certain errors
      if (error.message.includes('API key') || error.message.includes('invalid')) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        console.warn(`[Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw new Error(`Failed after ${maxRetries} retries: ${lastError.message}`);
}

// Request timeout wrapper
function withTimeout(promise, timeoutMs = 180000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
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

  const prompt = `# ROLE
Senior Instrumentation & Controls Engineer. Expert in ISA-5.1 standards.

# OBJECTIVE
Perform a rigorous, pixel-level forensic extraction of EVERY single component in the P&ID. 
It is critical to detect ALL assets, not just a sample. High recall is the priority.

# STRATEGY - CRITICAL
1. **Systematic Grid Scan**: Visually traverse the drawing from Top-Left to Bottom-Right, section by section.
2. **Exhaustive Listing**: Do NOT group similar items (e.g., do not say "3x VAVs"). You must return a distinct JSON object for EACH individual component found.
3. **Symbol Sensitivity**: deeply analyze small circles (sensors), distinct valve geometries, damper blades, and equipment tags.
4. **Implicit Detection**: If a line interacts with a device, check for associated actuators or sensors that might be unlabeled but visually present.

# KNOWLEDGE BASE
${HVAC_KNOWLEDGE_BASE}

# REQUIREMENTS
1. Identify every tag/instrument (VAV, TT, PT, TIC, Valve, Actuator, Dampers, Thermostats, Pumps, Fans, etc.).
2. Extract the exact Tag ID (e.g., VAV-101). If ID is illegible or missing, generate a logical unique ID (e.g., VAV-001, VAV-002).
3. Determine the Manufacturer if visible or common for this symbol type.
4. Estimate installation man-hours based on standard MCAA/NECA labor units.
5. Provide specific technical specifications (Voltage, Signal Type, Range).`;

  // Wrap API call with retry and timeout
  const result = await retryWithBackoff(async () => {
    return await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { 
          parts: [ 
            { inlineData: { mimeType, data: base64Image } }, 
            { text: prompt } 
          ] 
        },
        config: {
          thinkingConfig: { thinkingBudget: 16000 },
          responseMimeType: 'application/json',
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
            required: ['detectedComponents']
          }
        }
      })
    );
  });

  const parsed = JSON.parse(result.text || '{}');
  let components = parsed.detectedComponents || [];

  // Enhance with pricing catalog
  components = components.map(c => {
    const specsMap = {};
    if (Array.isArray(c.technicalSpecs)) {
      c.technicalSpecs.forEach(spec => {
        if (spec.key && spec.value) {
          specsMap[spec.key] = spec.value;
        }
      });
    }
    
    const componentToMatch = { ...c, technicalSpecs: specsMap };
    const pricing = getComponentPricing(componentToMatch);
    
    return {
      ...componentToMatch,
      cost: pricing.matched_sku !== 'N/A' ? pricing.estimated_cost : c.cost,
      sku: pricing.matched_sku !== 'N/A' ? pricing.matched_sku : c.sku,
      name: pricing.matched_sku !== 'N/A' ? `${c.name} [${pricing.matched_sku}]` : c.name,
      description: pricing.description || c.description
    };
  });

  // Validate ISA-5.1 compliance
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

  const context = `Extracted Components List: ${JSON.stringify((detectedComponents || []).map(c=>({id:c.id,name:c.name,type:c.type})))}`;
  const prompt = `# ROLE
Professional Forensic HVAC Engineer (PE).

# CONTEXT
Components already extracted: ${context}

# OBJECTIVE
Generate a high-density, professionally formatted forensic report.

# OUTPUT STRUCTURE RULES
1. **Start with a Blockquote**: Use ">" to create an Executive Summary at the very top. Summarize the system type, overall health, and critical actions in 3-4 sentences.
2. **Section Headers**: Use "##" for major sections (System Topology, Critical Findings, Recommendations).
3. **Bulleted Lists**: Use lists for findings to ensure readability.
4. **Tables**: If comparing data (e.g., flow rates, schedules), use Markdown tables.

# CONTENT TASKS
1. **System Topology**: Define the sequence of operations logic.
2. **Critical Flaw Detection**: Identify safety gaps (Missing freeze-stats, static high limits, flow switches).
3. **Engineering Observations**: Logic check on control loops.
4. **Optimization Recommendations**: Energy recovery, VFD integration.

# FORMATTING CONSTRAINT
* Do NOT include standard memo headers (To, From, Date).
* Start directly with the Executive Summary blockquote.
* Use technical but accessible language.`;

  // Wrap API call with retry and timeout
  const result = await retryWithBackoff(async () => {
    return await withTimeout(
      ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: { 
          parts: [ 
            { inlineData: { mimeType, data: base64Image } }, 
            { text: prompt } 
          ] 
        }, 
        config: { 
          thinkingConfig: { thinkingBudget: 12000 }, 
          maxOutputTokens: 20000 
        } 
      })
    );
  });

  const analysisResult = { analysisReport: result.text || 'Report generation failed.' };
  cache.set(cacheKey, analysisResult);
  return analysisResult;
}

// Export cache stats for monitoring
export function getCacheStats() {
  return cache.getStats();
}
