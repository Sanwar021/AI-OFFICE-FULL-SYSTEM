import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey: key });

const candidates = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash-exp',
];

async function run() {
  console.log('Testing candidates with key:', key.slice(0, 6) + '...');
  for (const model of candidates) {
    try {
      console.log(`Checking model: ${model}...`);
      const res = await ai.models.generateContent({
        model,
        contents: 'Hello! Respond with: "Gemini Ready".',
      });
      console.log(`>>> MODEL ${model} SUCCEEDED! Response:`, res.text?.trim());
      process.exit(0);
    } catch (e: any) {
      console.log(`Model ${model} error:`, e.message);
    }
  }
}

run();
