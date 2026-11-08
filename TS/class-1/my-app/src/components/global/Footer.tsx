import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm opacity-70">
            Phishing detection and awareness for the PUB community. Paste it, scan it, learn from it.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="label-mono opacity-50">Product</span>
          <Link to="/analyze" className="opacity-80 hover:opacity-100">Analyzer</Link>
          <Link to="/awareness" className="opacity-80 hover:opacity-100">Awareness quiz</Link>
          <Link to="/model" className="opacity-80 hover:opacity-100">Model report</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <span className="label-mono opacity-50">Safety</span>
          <p className="opacity-70">Links are never opened. Nothing leaves your browser. Synthetic data only.</p>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <p className="label-mono mx-auto max-w-6xl px-5 py-5 opacity-50">PUB CSE Fest-26 · Track A · A3</p>
      </div>
    </footer>
  );
}
