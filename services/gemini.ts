
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeSecurityThreat = async (input: string, type: 'link' | 'description' | 'apk') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Input: ${input}
    Task: Identify security threats (phishing, malware, scams).
    Context: You are Rifat Ahmed R@j, an Elite Cyber Security Expert.
    Language: Bengali.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are a cybersecurity expert. Provide analysis in Bengali. Return ONLY valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            threatLevel: { 
              type: Type.STRING,
              description: "Values: Low, Medium, High, Critical" 
            },
            message: { type: Type.STRING },
            details: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["isSafe", "threatLevel", "message", "details"]
        }
      },
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response");
    
    return JSON.parse(resultText);
    
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      isSafe: false,
      threatLevel: "High",
      message: "সার্ভার এরর! এই লিঙ্ক বা ডাটাটি ঝুঁকিপূর্ণ হতে পারে।",
      details: [
        "ইন্টারনেট কানেকশন চেক করুন",
        "অপরিচিত লিঙ্কে ক্লিক করবেন না",
        "সন্দেহজনক ফাইল ডাউনলোড থেকে বিরত থাকুন"
      ]
    };
  }
};
