import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const NAV = [
  { to: "/analyze", label: "Analyze" },
  { to: "/awareness", label: "Awareness" },
  { to: "/admin", label: "Admin" },
  { to: "/model", label: "Model" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="label-mono rounded-sm px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground underline decoration-accent decoration-2 underline-offset-8" }}
            >
              {n.label}
            </Link>
          ))}
          <Link to="/analyze" className="ml-3 rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
            Scan something
          </Link>
        </nav>
        <button aria-label="Toggle menu" className="md:hidden" onClick={() => setOpen((o) => !o)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col border-t border-border px-5 py-3 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="label-mono py-3 text-foreground">
              {n.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
