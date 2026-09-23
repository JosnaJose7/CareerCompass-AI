import { GoogleGenAI } from '@google/genai';

// Initialize GoogleGenAI SDK lazily/safely
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY || '';
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Helper to track temporary model demand spikes and circuit-break to fast lite models
export const modelCoolDownMap: Record<string, number> = {};

// Helper to call Gemini with robust model fallback order & backoff resilience
export async function generateGeminiContentWithFallback(
  ai: GoogleGenAI,
  params: { contents: string; config?: any }
): Promise<string> {
  const now = Date.now();
  const allModels = ['gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-2.5-flash'];
  
  // Sort models putting those not currently in high-demand cooldown first
  const modelsToTry = [...allModels].sort((a, b) => {
    const aCool = (modelCoolDownMap[a] && (now - modelCoolDownMap[a] < 60000)) ? 1 : 0;
    const bCool = (modelCoolDownMap[b] && (now - modelCoolDownMap[b] < 60000)) ? 1 : 0;
    return aCool - bCool;
  });

  let lastError: any = null;

  const mergedConfig = {
    maxOutputTokens: 8192,
    ...(params.config || {})
  };

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: mergedConfig,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || '';
      const errMsg = err?.message || '';
      const is503 = status === 503 || String(status) === '503' || errMsg.includes('503') || errMsg.includes('high demand');
      const is429 = status === 429 || String(status) === '429' || errMsg.includes('429') || errMsg.includes('quota');

      if (is503) {
        modelCoolDownMap[model] = Date.now();
        console.log(`[Gemini Resiliency] Model ${model} is experiencing temporary demand spike. Instant failover to next model...`);
      } else if (is429) {
        modelCoolDownMap[model] = Date.now();
        console.log(`[Gemini Resiliency] Model ${model} reached rate limit. Instant failover to next model...`);
      } else {
        console.log(`[Gemini Resiliency] Model ${model} returned error (${status || 'unknown'}). Trying next available model...`);
      }
      
      // Immediately proceed to the next fallback model without retrying the congested endpoint
      continue;
    }
  }

  throw lastError || new Error('All Gemini model calls failed');
}
