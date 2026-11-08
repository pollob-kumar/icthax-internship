import type { RiskLevel } from "@/lib/phish/types";

const COLOR: Record<RiskLevel, string> = { Low: "stroke-risk-low", Medium: "stroke-risk-medium", High: "stroke-risk-high" };

export function RiskGauge({ score, level }: { score: number; level: RiskLevel }) {
  const r = 80;
  const c = Math.PI * r;
  return (
    <div className="relative mx-auto w-full max-w-[260px]">
      <svg viewBox="0 0 200 115" className="w-full">
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" className="stroke-muted" strokeWidth="14" />
        <path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          className={COLOR[level]}
          strokeWidth="14"
          strokeDasharray={c}
          strokeDashoffset={c - (score / 100) * c}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <div className="font-display text-6xl font-semibold leading-none">{score}</div>
        <div className="label-mono mt-1 text-muted-foreground">of 100 · {level} risk</div>
      </div>
    </div>
  );
}
