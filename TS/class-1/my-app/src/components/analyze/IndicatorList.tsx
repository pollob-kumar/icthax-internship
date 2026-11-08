import type { Indicator } from "@/lib/phish/types";

export function IndicatorList({ indicators }: { indicators: Indicator[] }) {
  if (!indicators.length)
    return <p className="text-sm text-muted-foreground">No phishing indicators found. Stay careful anyway — always verify through official channels.</p>;
  return (
    <ol className="divide-y divide-border border-y border-border">
      {indicators.map((i, idx) => (
        <li key={i.id + idx} className="grid grid-cols-[2rem_1fr_auto] items-start gap-3 py-3">
          <span className="label-mono pt-0.5 text-muted-foreground">{String(idx + 1).padStart(2, "0")}</span>
          <div>
            <p className="font-semibold">{i.label}</p>
            <p className="break-all text-sm text-muted-foreground">{i.detail}</p>
          </div>
          <span className={`label-mono ${i.weight < 0 ? "text-risk-low" : "text-accent"}`}>
            {i.category === "ml" ? "ML" : (i.weight > 0 ? "+" : "") + i.weight}
          </span>
        </li>
      ))}
    </ol>
  );
}
