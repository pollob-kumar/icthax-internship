import { useRef, type FormEvent } from "react";
import { Upload } from "lucide-react";
import type { InputKind } from "@/lib/phish/types";
import { SAMPLES } from "./samples";

interface Props {
  kind: InputKind;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

export function InputForm({ kind, value, onChange, onSubmit }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit();
  };
  const loadFile = async (f?: File) => f && onChange(await f.text());

  return (
    <form onSubmit={submit} className="mt-5 space-y-4">
      {kind === "url" ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/login"
          className="w-full border border-input bg-card px-4 py-4 font-mono text-sm outline-none focus:border-accent"
        />
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={kind === "email" ? 12 : 6}
          placeholder={kind === "email" ? "From: ...\nReply-To: ...\nSubject: ...\n\nMessage body" : "Paste the SMS or chat message"}
          className="w-full resize-y border border-input bg-card px-4 py-4 font-mono text-sm outline-none focus:border-accent"
        />
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="rounded-sm bg-accent px-6 py-3 font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-40" disabled={!value.trim()}>
          Run analysis
        </button>
        {kind === "email" && (
          <>
            <input ref={fileRef} type="file" accept=".eml,.txt" hidden onChange={(e) => loadFile(e.target.files?.[0])} />
            <button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-sm border border-foreground px-4 py-3 text-sm font-semibold">
              <Upload className="size-4" /> Upload .eml
            </button>
          </>
        )}
        <span className="label-mono ml-auto text-muted-foreground">Try:</span>
        {SAMPLES[kind].map((s) => (
          <button key={s.label} type="button" onClick={() => onChange(s.value)} className="label-mono underline decoration-dotted underline-offset-4 hover:text-accent">
            {s.label}
          </button>
        ))}
      </div>
    </form>
  );
}
