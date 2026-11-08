const STEPS = [
  { n: "I", title: "Paste or upload", text: "A link, a full email with headers (or .eml file), or an SMS." },
  { n: "II", title: "We dissect it", text: "Rule checks and the classifier run locally. Links are never opened." },
  { n: "III", title: "You get the verdict", text: "A 0–100 score, a Low / Medium / High level, and every reason listed." },
];

export function HowItWorks() {
  return (
    <section className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <span className="label-mono text-accent">How it works</span>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="border-t border-ink-foreground/20 pt-6">
              <span className="font-display text-5xl italic text-accent">{s.n}</span>
              <h3 className="mt-4 text-2xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm opacity-70">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
