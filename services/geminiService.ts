import { GoogleGenAI } from "@google/genai";

// Safely access API key. In Vite/Netlify, process.env might be replaced by a string, 
// or available via import.meta.env. This check prevents "process is not defined" crashes.
const getApiKey = () => {
  try {
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (e) {
    // Ignore error if process is not defined
  }
  // Fallback or empty string (which will cause API calls to fail but not the app to crash)
  return "";
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey });

export const refineText = async (text: string, type: 'notes' | 'quote'): Promise<string> => {
  if (!text || text.trim().length === 0) return "";
  if (!apiKey) {
    console.warn("API Key is missing. Skipping AI refinement.");
    return text;
  }

  const prompt = type === 'notes' 
    ? `Rewrite the following technical installation notes to be concise, professional, and clear for a field technician. Remove any ambiguity. Notes: "${text}"`
    : `Write a short, polite, and professional email body to request a quote for the following order summary. Keep it brief. Summary context: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Return original text on failure
  }
};