export type FieldOfStudy = "software engineering" | "network" | "data";

export interface NLPAnalysisScore {
  technical_depth: number; // 0-40
  technical_diversity: number; // 0-20
  domain_relevance: number; // 0-25
  achievements_impact: number; // 0-15
  total_percentage: number; // 0-100
}

export interface GeminiVerification {
  adjusted_percentage: number;
  reasoning: string;
}

export interface AnalysisResult {
  extracted_skills: string[];
  domain_strength: string;
  nlp_analysis_score: NLPAnalysisScore;
  gemini_verification: GeminiVerification;
  final_skill_match_percentage: number;
}

export interface ScoreCategory {
  name: string;
  score: number;
  max: number;
  fill: string;
}