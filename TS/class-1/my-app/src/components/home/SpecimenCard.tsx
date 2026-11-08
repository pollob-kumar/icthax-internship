export function SpecimenCard() {
  const marks = [
    { text: "bkash-verify.xyz", note: "look-alike domain" },
    { text: "PIN", note: "credential request" },
    { text: "24 ঘণ্টা", note: "time pressure" },
  ];
  return (
    <div className="card-edge relative rotate-1 p-6 animate-rise" style={{ animationDelay: "120ms" }}>
      <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
        <span className="label-mono text-muted-foreground">Specimen · SMS</span>
        <span className="label-mono rounded-sm bg-risk-high px-2 py-0.5 text-destructive-foreground">87 / High</span>
      </div>
      <p className="mt-4 font-mono text-sm leading-relaxed">
        প্রিয় গ্রাহক, আপনার অ্যাকাউন্ট <mark className="bg-accent/25 px-0.5">24 ঘণ্টা</mark> এর মধ্যে বন্ধ হবে। <mark className="bg-accent/25 px-0.5">PIN</mark> দিয়ে যাচাই করুন:{" "}
        <mark className="bg-accent/25 px-0.5">http://bkash-verify.xyz</mark>
      </p>
      <ul className="mt-5 space-y-2">
        {marks.map((m, i) => (
          <li key={m.text} className="flex items-baseline gap-3 text-sm">
            <span className="label-mono text-accent">0{i + 1}</span>
            <span className="font-mono">{m.text}</span>
            <span className="flex-1 border-b border-dotted border-border" />
            <span className="text-muted-foreground">{m.note}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
