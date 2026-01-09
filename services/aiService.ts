import { GoogleGenAI, Type, Chat } from "@google/genai";

const MODEL_NAME = 'gemini-3-flash-preview';
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  createCoachChat: (): Chat => {
    return ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: "You are 'Confi', a personal growth AI coach. Your tone is supportive, sharp, and encouraging. You help the user with productivity, confidence, mental habits, and goal setting. Keep responses concise (under 60 words) and conversational. Ask follow-up questions to dig deeper into the user's progress.",
      }
    });
  },

  getDashboardInsights: async (): Promise<string[]> => {
    const prompt = `Generate 3 short, punchy, personalized insights for a user of a self-improvement app called "Confi". Assume the user is a young professional. Return ONLY a JSON array of strings.`;
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    } catch (error) {
      return ["Focus on consistency.", "Celebrate small wins.", "Stay curious."];
    }
  },

  generateChallengePlan: async (userGoal: string): Promise<{ title: string; description: string; subTasks: string[] }> => {
    const prompt = `The user wants to: "${userGoal}". Create a structured plan with a Title, a motivational description, and exactly 5 actionable sub-tasks.`;
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              subTasks: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "description", "subTasks"]
          }
        }
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("AI Plan Error:", error);
      throw error;
    }
  },

  getReflectionPrompt: async (): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: "Generate a deep, single-sentence introspective question for a young professional about their growth.",
      });
      return response.text || "What is one thing you learned about yourself today?";
    } catch (error) {
      return "What was your biggest win today?";
    }
  },

  getTopicSummary: async (topic: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Provide a high-level summary of "${topic}". Limit to 100 words.`,
      });
      return response.text || "Summary unavailable.";
    } catch (error) {
      return "Could not generate summary.";
    }
  },

  generateAffirmation: async (): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: "Generate a powerful affirmation for confidence. Max 12 words.",
      });
      return response.text?.trim() || "I am capable of achieving greatness.";
    } catch (error) {
      return "I am becoming the best version of myself.";
    }
  }
};