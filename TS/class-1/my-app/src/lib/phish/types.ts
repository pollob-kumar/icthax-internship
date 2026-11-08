export type InputKind = "url" | "email" | "sms";
export type RiskLevel = "Low" | "Medium" | "High";

export interface Indicator {
  id: string;
  label: string;
  detail: string;
  weight: number; // contribution points
  category: "url" | "domain" | "email" | "content" | "ml" | "list";
}

export interface AnalysisResult {
  id: string;
  kind: InputKind;
  input: string;
  score: number;
  level: RiskLevel;
  indicators: Indicator[];
  mlProbability: number;
  createdAt: number;
}
