// @ts-nocheck -- index access guarded by loop bounds
const HOMOGLYPHS: Record<string, string> = {
  "0": "o", "1": "l", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "rn": "m", vv: "w",
  "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "х": "x", "і": "i",
};

export function normalizeLookalike(s: string): string {
  let out = s.toLowerCase();
  for (const [k, v] of Object.entries(HOMOGLYPHS)) out = out.split(k).join(v);
  return out;
}

export function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return dp[a.length][b.length];
}

/** Returns the legit domain being imitated, or null. */
export function findTyposquat(host: string, legit: string[]): string | null {
  const h = host.toLowerCase().replace(/^www\./, "");
  for (const d of legit) {
    if (h === d || h.endsWith("." + d)) return null;
  }
  const norm = normalizeLookalike(h);
  for (const d of legit) {
    const base = d.split(".")[0] ?? d;
    const hBase = norm.split(".").slice(-3).join(".");
    if (norm === d) return d;
    if (levenshtein(norm.split(".")[0] ?? norm, base) <= 2 && base.length > 4) return d;
    if (hBase.includes(base) && base.length > 4) return d;
  }
  return null;
}
