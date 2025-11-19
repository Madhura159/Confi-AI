import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";

// Using the requested model alias
const MODEL_NAME = 'gemini-2.5-flash';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
  /**
   * Starts a chat session with the AI Coach.
   */
  createCoachChat: (): Chat => {
    return ai.chats.create({
      model: MODEL_NAME,
      config: {
        systemInstruction: "You are 'Confi', a personal growth AI coach. Your tone is supportive, sharp, and encouraging. You help the user with productivity, confidence, mental habits, and goal setting. Keep responses concise (under 60 words) and conversational. Ask follow-up questions to dig deeper into the user's progress.",
      }
    });
  },

  /**
   * Generates 3 short insights based on user activity.
   * (Legacy: Kept for reference if needed, but Dashboard now uses Chat)
   */
  getDashboardInsights: async (): Promise<string[]> => {
    const prompt = `
      Generate 3 short, punchy, personalized insights for a user of a self-improvement app called "Confi".
      Assume the user has been moderately active, completed 2 tasks recently, but missed a journal entry.
      Keep insights under 20 words each. 
      Return ONLY a JSON array of strings.
    `;

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
      
      const text = response.text;
      if (!text) return ["Keep going!", "Stay consistent.", "You got this."];
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Insight Error:", error);
      return ["Focus on your daily goals.", "Consistency is key.", "Review your recent progress."];
    }
  },

  /**
   * Generates a structured plan from a vague goal.
   */
  generateChallengePlan: async (userGoal: string): Promise<{ title: string; description: string; subTasks: string[] }> => {
    const prompt = `
      The user wants to: "${userGoal}".
      Create a structured plan.
      1. A catchy Title.
      2. A brief motivational description.
      3. Exactly 5 specific, measurable sub-tasks.
    `;

    const schema: Schema = {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        subTasks: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "List of 5 actionable steps"
        }
      },
      required: ["title", "description", "subTasks"]
    };

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema
        }
      });
      
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text);
    } catch (error) {
      console.error("AI Plan Error:", error);
      throw error;
    }
  },

  /**
   * Generates a reflection prompt.
   */
  getReflectionPrompt: async (): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: "Generate a deep, single-sentence introspective question for a young professional about their recent work or personal growth challenges.",
      });
      return response.text || "What is one thing you learned about yourself today?";
    } catch (error) {
      return "What was your biggest win this week?";
    }
  },

  /**
   * Generates a learning summary.
   */
  getTopicSummary: async (topic: string): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Provide a high-level summary of "${topic}". Limit to 150 words. Focus on practical application for a young professional.`,
      });
      return response.text || "Summary unavailable at the moment.";
    } catch (error) {
      return "Could not generate summary. Please try again.";
    }
  },

  /**
   * Generates a daily affirmation.
   */
  generateAffirmation: async (): Promise<string> => {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: "Generate a unique, powerful, positive affirmation for confidence and career growth. Max 15 words. Do not use quotes.",
      });
      return response.text?.trim() || "I am capable of overcoming any challenge.";
    } catch (error) {
      return "Today is a new opportunity for success.";
    }
  }
};