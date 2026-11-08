import type { RiskLevel } from "@/lib/phish/types";
import { cn } from "@/lib/utils";

const STYLE: Record<RiskLevel, string> = {
  Low: "bg-risk-low/15 text-risk-low border-risk-low/40",
  Medium: "bg-risk-medium/20 text-foreground border-risk-medium/60",
  High: "bg-risk-high/15 text-risk-high border-risk-high/40",
};

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  return <span className={cn("label-mono inline-flex rounded-sm border px-2 py-0.5", STYLE[level], className)}>{level}</span>;
}
