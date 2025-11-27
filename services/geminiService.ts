import { GoogleGenAI, Schema, Type } from "@google/genai";
import { AnalysisResult, FieldOfStudy } from "../types";

const SYSTEM_INSTRUCTION = `
You are an AI system embedded inside a student internship-matching platform.
Your job is to verify a student's technical skill-match percentage based on a CSV file containing their projects, achievements, competitions, certifications, or coursework.
Your output must follow strict formatting, contain transparent scoring, and produce a final skill match percentage between 0%–100%.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    extracted_skills: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of extracted core skills, tools, and frameworks."
    },
    domain_strength: {
      type: Type.STRING,
      description: "The dominant domain identified.",
      enum: ["Software Engineering", "Network", "Data", "Unknown"]
    },
    nlp_analysis_score: {
      type: Type.OBJECT,
      properties: {
        technical_depth: { type: Type.NUMBER, description: "Score out of 40" },
        technical_diversity: { type: Type.NUMBER, description: "Score out of 20" },
        domain_relevance: { type: Type.NUMBER, description: "Score out of 25" },
        achievements_impact: { type: Type.NUMBER, description: "Score out of 15" },
        total_percentage: { type: Type.NUMBER, description: "Sum of scores" }
      },
      required: ["technical_depth", "technical_diversity", "domain_relevance", "achievements_impact", "total_percentage"]
    },
    gemini_verification: {
      type: Type.OBJECT,
      properties: {
        adjusted_percentage: { type: Type.NUMBER, description: "The verified final score after reasoning." },
        reasoning: { type: Type.STRING, description: "Explanation for the score adjustment or validation." }
      },
      required: ["adjusted_percentage", "reasoning"]
    },
    final_skill_match_percentage: { type: Type.NUMBER, description: "The final VERIFIED score (0-100)." }
  },
  required: ["extracted_skills", "domain_strength", "nlp_analysis_score", "gemini_verification", "final_skill_match_percentage"]
};

export const analyzePortfolio = async (field: FieldOfStudy, csvContent: string): Promise<AnalysisResult> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Student Field of Study:
${field}

Uploaded CSV Content:
${csvContent}

Task:
1. Extract Important Skills (Core languages, tools, frameworks, technical specialties).
2. Score the Skill Match based on the rubric:
   - Technical Depth (40 pts)
   - Technical Diversity (20 pts)
   - Domain Relevance (25 pts)
   - Achievements & Impact (15 pts)
3. Use reasoning to verify and adjust the score (detect exaggeration, validate complexity).

Return the result in the specified JSON format.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2, // Low temperature for analytical consistency
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    
    const result = JSON.parse(text) as AnalysisResult;
    return result;
  } catch (error) {
    console.error("Error analyzing portfolio:", error);
    throw error;
  }
};
