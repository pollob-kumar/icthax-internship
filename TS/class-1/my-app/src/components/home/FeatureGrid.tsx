import { Link2, Mail, MessageSquareText, Fingerprint, Brain, GraduationCap } from "lucide-react";

const FEATURES = [
  { icon: Link2, title: "URL forensics", text: "IP hosts, '@' tricks, punycode, shorteners, risky TLDs and subdomain stacking." },
  { icon: Fingerprint, title: "Typosquat check", text: "Compares against the university, local banks and bKash, Nagad, Rocket." },
  { icon: Mail, title: "Email headers", text: "Reply-To mismatch, display-name spoofing, SPF / DKIM / DMARC and risky attachments." },
  { icon: MessageSquareText, title: "Bangla + English", text: "Scam vocabulary detected in both languages for SMS and chat messages." },
  { icon: Brain, title: "ML classifier", text: "Naive Bayes model blended with rules; accuracy, precision, recall and F1 reported." },
  { icon: GraduationCap, title: "Awareness quiz", text: "Spot the fake. Feedback after every answer and a running score history." },
];

export function FeatureGrid() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-md text-3xl font-semibold md:text-4xl">Six layers between you and a bad click.</h2>
        <span className="label-mono text-muted-foreground">What it checks</span>
      </div>
      <div className="mt-10 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => (
          <article key={f.title} className="group border-b border-r border-border p-7 transition-colors hover:bg-card">
            <div className="flex items-center justify-between">
              <f.icon className="size-6 text-accent" strokeWidth={1.6} />
              <span className="label-mono text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
