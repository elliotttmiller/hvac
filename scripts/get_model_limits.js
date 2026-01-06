import { GoogleGenAI } from "@google/genai";

async function main() {
  try {
    const apiKey = process.env.VITE_AI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.AI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('No API key found in environment. Set VITE_AI_API_KEY or VITE_GEMINI_API_KEY.');
      process.exit(2);
    }

  const client = new GoogleGenAI({ apiKey });
    console.log('Using model: gemini-2.5-flash');
    const info = await client.models.get({ model: 'gemini-2.5-flash' });

    console.log('Model info keys:', Object.keys(info));
    console.log('input_token_limit:', info.input_token_limit ?? info.inputTokenLimit ?? info.inputToken_limit ?? 'N/A');
    console.log('output_token_limit:', info.output_token_limit ?? info.outputTokenLimit ?? info.output_token_limit ?? 'N/A');
    console.log('Raw model info:', JSON.stringify(info, null, 2));
  } catch (err) {
    console.error('Failed to fetch model info:', err);
    process.exit(1);
  }
}

main();
