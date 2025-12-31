import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from '../types';
import { COPILOT_SYSTEM_INSTRUCTION } from '../lib/prompt-engine/pid-analyst';
import { analyzePID } from './gemini-prompt-engine/pid-analysis';

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateThinkingResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  if (!apiKey) throw new Error("API Key is missing");

  try {
    const context = history.map(h => `${h.role}: ${h.parts[0].text}`).join('\n');
    const fullPrompt = `${context}\nuser: ${prompt}\nmodel:`;

    const response = await ai.models.generateContent({
      model: GeminiModel.PRO,
      contents: fullPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        systemInstruction: COPILOT_SYSTEM_INSTRUCTION
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Thinking Error:", error);
    throw error;
  }
};

/**
 * Delegates to the specialized PID Analysis Engine in services/gemini-prompt-engine.
 * Returns stringified JSON to maintain compatibility with the frontend components.
 */
export const analyzeBlueprintImage = async (base64Image: string): Promise<string> => {
  try {
    const result = await analyzePID(base64Image);
    return JSON.stringify(result);
  } catch (error) {
    console.error("Analysis Error:", error);
    return JSON.stringify({ error: "Analysis failed", details: error instanceof Error ? error.message : error });
  }
};

export const generateInventoryFromAnalysis = async (analysisText: string): Promise<string> => {
   // Legacy support: if the analysisText is already JSON (from new method), just return it formatted
   try {
      const data = JSON.parse(analysisText);
      if (data.entities) {
          // Transform strict schema to inventory format if needed
          const inventory = data.entities.reduce((acc: any[], curr: any) => {
              const existing = acc.find(i => i.name === curr.description);
              if (existing) { existing.count++; } 
              else { acc.push({ name: curr.description || curr.label, count: 1 }); }
              return acc;
          }, []);
          return JSON.stringify(inventory);
      }
   } catch (e) {
       // Fallback for plain text
   }

   if (!apiKey) return "[]";
   
   try {
     const response = await ai.models.generateContent({
       model: GeminiModel.FLASH,
       contents: `Extract inventory from: "${analysisText}". Format: [{"name": "Name", "count": 1}]`,
       config: { responseMimeType: 'application/json' }
     });
     return response.text || "[]";
   } catch (e) {
     return "[]";
   }
}
