import type { AnalysisResult, Indicator, InputKind, RiskLevel } from "./types";
import { analyzeEmail, analyzeSms, analyzeUrl, type ListConfig } from "./analyzers";
import { model } from "./classifier";

export function levelFor(score: number): RiskLevel {
  if (score >= 60) return "High";
  if (score >= 30) return "Medium";
  return "Low";
}

/** Combine rule weights with ML probability into a 0–100 score. */
export function combineScore(indicators: Indicator[], mlProbability: number): number {
  const rules = indicators.reduce((s, i) => s + i.weight, 0);
  const ruleScore = 100 * (1 - Math.exp(-Math.max(0, rules) / 45));
  const raw = 0.7 * ruleScore + 0.3 * mlProbability * 100 + Math.min(0, rules);
  return Math.round(Math.max(0, Math.min(100, raw)));
}

export function analyze(kind: InputKind, input: string, lists: ListConfig): AnalysisResult {
  const indicators =
    kind === "url" ? analyzeUrl(input, lists) : kind === "email" ? analyzeEmail(input, lists) : analyzeSms(input, lists);
  const mlProbability = kind === "url" ? Math.min(1, indicators.filter((i) => i.weight > 0).length / 6) : model.predict(input);
  if (kind !== "url" && mlProbability >= 0.5)
    indicators.push({ id: "ml", label: "ML classifier flags as phishing", detail: `Model confidence ${(mlProbability * 100).toFixed(0)}%.`, weight: 0, category: "ml" });
  const score = combineScore(indicators, mlProbability);
  return {
    id: crypto.randomUUID(),
    kind,
    input,
    score,
    level: levelFor(score),
    indicators: indicators.sort((a, b) => b.weight - a.weight),
    mlProbability,
    createdAt: Date.now(),
  };
}
