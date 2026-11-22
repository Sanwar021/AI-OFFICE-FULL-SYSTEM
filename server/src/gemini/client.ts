import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../server/.env') });

let apiKey = process.env.GEMINI_API_KEY || '';
let defaultModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

export function getApiKey(): string {
  return apiKey;
}

export function setApiKey(newKey: string) {
  apiKey = newKey;
}

export function getModel(): string {
  return defaultModel;
}

export function setModel(model: string) {
  defaultModel = model;
}

export function getGeminiClient(): GoogleGenAI {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please enter your API key in Settings.');
  }
  return new GoogleGenAI({ apiKey });
}

// Exponential backoff wrapper for retryable Gemini errors (503 high demand, 429 rate limit)
export async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err: any) {
      attempt++;
      const isRetryable =
        err?.message?.includes('503') ||
        err?.message?.includes('429') ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('RESOURCE_EXHAUSTED');

      if (isRetryable && attempt <= maxRetries) {
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 500;
        console.log(`[Gemini Retry] Attempt ${attempt}/${maxRetries} failed with temporary error. Retrying in ${Math.round(delay)}ms...`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }
}

export async function testConnection(): Promise<{ success: boolean; message: string; model: string }> {
  try {
    const ai = getGeminiClient();
    const result = await withRetry(async () => {
      const response = await ai.models.generateContent({
        model: defaultModel,
        contents: 'Ping: Please respond with "AI Office Gemini Connection Verified".',
      });
      return response.text || '';
    }, 2);

    return {
      success: true,
      message: result.trim() || 'Connection verified successfully.',
      model: defaultModel,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Failed to connect to Google Gemini API.',
      model: defaultModel,
    };
  }
}
