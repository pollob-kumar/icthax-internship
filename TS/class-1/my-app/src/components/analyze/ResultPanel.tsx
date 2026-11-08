import type { AnalysisResult } from "@/lib/phish/types";
import { RiskBadge } from "@/components/global/RiskBadge";
import { RiskGauge } from "./RiskGauge";
import { IndicatorList } from "./IndicatorList";

const ADVICE = {
  Low: "Looks mostly fine. Still confirm unexpected requests through an official channel.",
  Medium: "Be cautious. Don't enter credentials; verify the sender independently.",
  High: "Very likely phishing. Do not click, reply or share any PIN, OTP or password. Report it.",
};

export function ResultPanel({ result }: { result: AnalysisResult | null }) {
  if (!result)
    return (
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center border border-dashed border-border p-8 text-center">
        <span className="font-display text-3xl italic text-muted-foreground">Awaiting specimen</span>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">Results appear here with every indicator that contributed to the score.</p>
      </div>
    );
  return (
    <div className="card-edge p-6 animate-rise" key={result.id}>
      <div className="flex items-center justify-between">
        <span className="label-mono text-muted-foreground">Verdict · {result.kind}</span>
        <RiskBadge level={result.level} />
      </div>
      <div className="mt-6">
        <RiskGauge score={result.score} level={result.level} />
      </div>
      <p className="mt-6 border-l-2 border-accent pl-3 text-sm">{ADVICE[result.level]}</p>
      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Why this score</h3>
        <span className="label-mono text-muted-foreground">ML p={result.mlProbability.toFixed(2)}</span>
      </div>
      <div className="mt-3">
        <IndicatorList indicators={result.indicators} />
      </div>
    </div>
  );
}
