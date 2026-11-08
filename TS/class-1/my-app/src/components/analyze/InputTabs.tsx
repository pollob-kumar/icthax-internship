import type { InputKind } from "@/lib/phish/types";
import { cn } from "@/lib/utils";

const TABS: { kind: InputKind; label: string; hint: string }[] = [
  { kind: "url", label: "URL", hint: "Single link" },
  { kind: "email", label: "Email", hint: "Headers + body or .eml" },
  { kind: "sms", label: "SMS / Chat", hint: "Bangla or English" },
];

export function InputTabs({ value, onChange }: { value: InputKind; onChange: (k: InputKind) => void }) {
  return (
    <div role="tablist" className="grid grid-cols-3 border border-foreground">
      {TABS.map((t) => (
        <button
          key={t.kind}
          role="tab"
          aria-selected={value === t.kind}
          onClick={() => onChange(t.kind)}
          className={cn(
            "border-r border-foreground px-4 py-3 text-left transition-colors last:border-r-0",
            value === t.kind ? "bg-primary text-primary-foreground" : "hover:bg-muted",
          )}
        >
          <span className="block font-semibold">{t.label}</span>
          <span className="label-mono opacity-60">{t.hint}</span>
        </button>
      ))}
    </div>
  );
}
