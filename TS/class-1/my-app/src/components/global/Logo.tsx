export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <path d="M16 2 L28 7 V16 C28 23 22.5 28.5 16 30 C9.5 28.5 4 23 4 16 V7 Z" className="fill-primary" />
        <path d="M10 15 C13 11 19 11 22 15 C19 19 13 19 10 15 Z" className="fill-accent" />
        <circle cx="16" cy="15" r="2" className="fill-primary" />
      </svg>
      <span className="font-display text-xl font-semibold leading-none">
        Phish<span className="italic text-accent">Guard</span>
      </span>
    </span>
  );
}
