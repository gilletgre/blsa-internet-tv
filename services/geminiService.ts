import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const refineText = async (text: string, type: 'notes' | 'quote'): Promise<string> => {
  if (!text || text.trim().length === 0) return "";

  const prompt = type === 'notes' 
    ? `Rewrite the following technical installation notes to be concise, professional, and clear for a field technician. Remove any ambiguity. Notes: "${text}"`
    : `Write a short, polite, and professional email body to request a quote for the following order summary. Keep it brief. Summary context: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return text; // Return original text on failure
  }
};