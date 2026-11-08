import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/global/PageHeader";
import { InputTabs } from "@/components/analyze/InputTabs";
import { InputForm } from "@/components/analyze/InputForm";
import { ResultPanel } from "@/components/analyze/ResultPanel";
import { analyze } from "@/lib/phish/engine";
import { useHistory, useLists } from "@/lib/phish/store";
import type { AnalysisResult, InputKind } from "@/lib/phish/types";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze a link, email or SMS — PhishGuard" },
      { name: "description", content: "Paste a suspicious URL, email or SMS and get a 0–100 phishing risk score with every reason explained." },
      { property: "og:title", content: "Analyze a link, email or SMS — PhishGuard" },
      { property: "og:description", content: "Get a phishing risk score with every reason explained." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  const [kind, setKind] = useState<InputKind>("url");
  const [values, setValues] = useState<Record<InputKind, string>>({ url: "", email: "", sms: "" });
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const lists = useLists();
  const [, setHistory] = useHistory();

  const run = () => {
    const r = analyze(kind, values[kind], lists);
    setResult(r);
    setHistory((h) => [r, ...h].slice(0, 200));
  };

  return (
    <>
      <PageHeader kicker="Analyzer" title={<>Paste it. We'll <em className="text-accent">dissect</em> it.</>}>
        Links are inspected as text only and never opened. Everything runs in your browser.
      </PageHeader>
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[1.3fr_1fr]">
        <section>
          <InputTabs value={kind} onChange={setKind} />
          <InputForm kind={kind} value={values[kind]} onChange={(v) => setValues((s) => ({ ...s, [kind]: v }))} onSubmit={run} />
        </section>
        <ResultPanel result={result} />
      </div>
    </>
  );
}
