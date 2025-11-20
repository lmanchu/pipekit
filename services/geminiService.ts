import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedDealData } from "../types";

// NOTE: In a real production app, this should be a backend call.
// For this demo, we call directly from the client using the provided Env Key.

export const analyzeEmailWithGemini = async (
  emailBody: string,
  sender: string,
  subject: string
): Promise<ExtractedDealData> => {
  
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the following email to extract potential CRM deal information.
    Sender: ${sender}
    Subject: ${subject}
    Body: "${emailBody}"
    
    Extract the potential deal title, estimated value (if mentioned, otherwise estimate based on context or put 0), a short summary, a confidence score (0-100) that this is a sales opportunity, and 2-3 suggested next steps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dealTitle: { type: Type.STRING, description: "A concise title for the potential deal" },
            estimatedValue: { type: Type.NUMBER, description: "Estimated value in USD" },
            summary: { type: Type.STRING, description: "Brief summary of the email intent" },
            confidenceScore: { type: Type.NUMBER, description: "Confidence score between 0 and 100" },
            suggestedNextSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable next steps"
            }
          },
          required: ["dealTitle", "estimatedValue", "summary", "confidenceScore", "suggestedNextSteps"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as ExtractedDealData;

  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    // Fallback mock response if API fails or key is invalid
    return {
      dealTitle: `New Opportunity from ${sender}`,
      estimatedValue: 0,
      summary: "Could not analyze with AI. Please review manually.",
      confidenceScore: 0,
      suggestedNextSteps: ["Reply to email", "Schedule call"]
    };
  }
};
