import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SpecimenCard } from "./SpecimenCard";

export function Hero() {
  return (
    <section className="grid-paper border-b border-border">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-[1.2fr_1fr] md:py-28">
        <div className="animate-rise">
          <span className="label-mono text-accent">Track A · Blockchain & Cybersecurity</span>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] md:text-7xl">
            Read the message <em className="font-medium text-accent">before</em> it reads you.
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground">
            Fake scholarships, bKash rewards, look-alike login pages. PhishGuard scores any link, email or SMS from 0 to 100 and shows exactly why.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/analyze" className="inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
              Analyze a message <ArrowRight className="size-4" />
            </Link>
            <Link to="/awareness" className="rounded-sm border border-foreground px-6 py-3 font-semibold transition-colors hover:bg-foreground hover:text-background">
              Test yourself
            </Link>
          </div>
        </div>
        <SpecimenCard />
      </div>
    </section>
  );
}
