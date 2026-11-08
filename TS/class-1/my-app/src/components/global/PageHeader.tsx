import type { ReactNode } from "react";

export function PageHeader({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="grid-paper border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 animate-rise">
        <span className="label-mono text-accent">{kicker}</span>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold md:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-2xl text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}
