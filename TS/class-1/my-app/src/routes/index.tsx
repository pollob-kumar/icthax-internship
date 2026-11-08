import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { HowItWorks } from "@/components/home/HowItWorks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PUB PhishGuard — Spot phishing before you click" },
      { name: "description", content: "Score suspicious links, emails and SMS from 0 to 100 with clear explanations. Built for PUB students and staff." },
      { property: "og:title", content: "PUB PhishGuard — Spot phishing before you click" },
      { property: "og:description", content: "Score suspicious links, emails and SMS with clear explanations." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <HowItWorks />
    </>
  );
}
