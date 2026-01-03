import { GoogleGenAI } from "@google/genai";
import { GeminiModel } from '@/features/document-analysis/types';
import { 
  PID_ANALYSIS_SYSTEM_INSTRUCTION, 
  PID_ANALYSIS_SCHEMA,
  PID_USER_PROMPT 
} from '@/features/document-analysis/prompts/visual/detect-pid';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Specialized P&ID Analysis Engine.
 * 
 * Uses Gemini 3.0 Pro's Thinking capabilities to perform neuro-symbolic
 * extraction of HVAC components, combining visual recognition with
 * ISA-5.1 rule-based decoding.
 * 
 * @param base64Image - The raw base64 string of the blueprint.
 * @returns Structured JSON analysis result complying with PID_ANALYSIS_SCHEMA.
 */
export const analyzePID = async (base64Image: string) => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  // Normalize base64 string (remove data URI prefix if present)
  const imageBytes = base64Image.includes('base64,') 
    ? base64Image.split('base64,')[1] 
    : base64Image;

  try {
    const response = await ai.models.generateContent({
      model: GeminiModel.PRO,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: imageBytes
            }
          },
          {
            text: PID_USER_PROMPT
          }
        ]
      },
      config: {
        // High thinking budget allows the model to "trace" lines and "lookup" tables cognitively
        thinkingConfig: { thinkingBudget: 16000 },
        systemInstruction: PID_ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: PID_ANALYSIS_SCHEMA
      }
    });

    let jsonText = response.text || "{}";
    
    // Robust Markdown Stripping (Handle ```json ... ``` wrappers)
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      return JSON.parse(jsonText);
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text:", jsonText);
      // Fallback: Return raw text wrapped in structure if parsing fails
      return {
        executive_summary: "Parsing Error: Model output was not valid JSON.",
        design_validation: [{ severity: "CRITICAL", issue: "Output Malformed", recommendation: "Retry Analysis" }],
        entities: []
      };
    }

  } catch (error) {
    console.error("Gemini Prompt Engine Error:", error);
    throw error;
  }
};