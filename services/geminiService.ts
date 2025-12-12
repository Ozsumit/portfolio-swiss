import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize Gemini AI Client
// The API key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the personal AI assistant for a portfolio website. The owner is a Senior Product Designer and Frontend Engineer named "Alex".
Alex specializes in React, TypeScript, and Swiss Design principles.
Your tone should be professional yet expressive, concise, and helpful.
Answer questions about Alex's skills, availability (currently open for freelance), and design philosophy.
If asked about contact info, provide "alex@example.com".
Keep responses short (under 100 words) unless asked for elaboration.
`;

export const sendMessageToGemini = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result: GenerateContentResponse = await chat.sendMessage({
        message: message 
    });
    
    return result.text || "I'm having trouble thinking right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't connect to the AI service at the moment.";
  }
};