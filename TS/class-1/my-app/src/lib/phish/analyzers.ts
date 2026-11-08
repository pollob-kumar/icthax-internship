import type { Indicator } from "./types";
import { KEYWORDS_BN, KEYWORDS_EN, SHORTENERS, SUSPICIOUS_TLDS } from "./lists";
import { findTyposquat } from "./typosquat";

export interface ListConfig {
  legit: string[];
  allow: string[];
  block: string[];
}

const URL_RE = /\b((?:https?:\/\/|www\.)[^\s<>"')]+|[a-z0-9-]+(?:\.[a-z0-9-]+)+\/[^\s<>"')]*)/gi;

export function extractUrls(text: string): string[] {
  return Array.from(new Set(text.match(URL_RE) ?? []));
}

function parseHost(raw: string): { host: string; full: string } | null {
  try {
    const u = new URL(/^https?:\/\//i.test(raw) ? raw : "http://" + raw);
    return { host: u.hostname, full: u.href };
  } catch {
    return null;
  }
}

export function analyzeUrl(raw: string, lists: ListConfig): Indicator[] {
  const out: Indicator[] = [];
  const parsed = parseHost(raw.trim());
  if (!parsed) return [{ id: "url-invalid", label: "Malformed URL", detail: "The link could not be parsed.", weight: 10, category: "url" }];
  const { host, full } = parsed;
  const bare = host.replace(/^www\./, "");

  if (lists.allow.some((d) => bare === d || bare.endsWith("." + d)))
    return [{ id: "allow", label: "Allow-listed domain", detail: `${bare} is on the administrator allow-list.`, weight: -40, category: "list" }];
  if (lists.block.some((d) => bare === d || bare.endsWith("." + d)))
    out.push({ id: "block", label: "Block-listed domain", detail: `${bare} is on the administrator block-list.`, weight: 60, category: "list" });

  if (full.length > 75) out.push({ id: "url-long", label: "Unusually long URL", detail: `${full.length} characters; long links often hide the real destination.`, weight: 8, category: "url" });
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) out.push({ id: "url-ip", label: "IP address as host", detail: `Uses ${host} instead of a domain name.`, weight: 22, category: "url" });
  if (raw.replace(/^https?:\/\//, "").includes("@")) out.push({ id: "url-at", label: "'@' symbol in URL", detail: "Everything before '@' is ignored by the browser — a classic disguise.", weight: 18, category: "url" });
  const subs = host.split(".").length - 2;
  if (subs >= 3) out.push({ id: "url-subs", label: "Many subdomains", detail: `${subs} subdomain levels in ${host}.`, weight: 10, category: "url" });
  if (host.includes("xn--") || /[^\x00-\x7F]/.test(host)) out.push({ id: "url-puny", label: "Punycode / non-ASCII host", detail: "Characters that may look like Latin letters but are not.", weight: 20, category: "domain" });
  const tld = host.split(".").pop() ?? "";
  if (SUSPICIOUS_TLDS.includes(tld)) out.push({ id: "url-tld", label: "Suspicious top-level domain", detail: `.${tld} is frequently abused for phishing.`, weight: 12, category: "domain" });
  if (SHORTENERS.includes(bare)) out.push({ id: "url-short", label: "URL shortener", detail: `${bare} hides the final destination.`, weight: 12, category: "url" });
  if (!/^https:/i.test(full)) out.push({ id: "url-http", label: "No HTTPS", detail: "Connection is not encrypted.", weight: 5, category: "url" });
  if (/(login|verify|secure|account|update|bank|signin|wallet)/i.test(full) && !lists.legit.some((d) => bare.endsWith(d)))
    out.push({ id: "url-bait", label: "Credential bait words in link", detail: "Words like login / verify / secure on an unknown domain.", weight: 10, category: "url" });
  if ((host.match(/-/g) ?? []).length >= 2) out.push({ id: "url-hyphen", label: "Multiple hyphens in host", detail: host, weight: 6, category: "domain" });

  const squat = findTyposquat(host, lists.legit);
  if (squat) out.push({ id: "typo", label: "Look-alike of a trusted domain", detail: `${bare} imitates ${squat}.`, weight: 30, category: "domain" });
  return out;
}

export function analyzeText(text: string): Indicator[] {
  const out: Indicator[] = [];
  const lower = text.toLowerCase();
  const en = KEYWORDS_EN.filter((k) => lower.includes(k));
  const bn = KEYWORDS_BN.filter((k) => text.includes(k));
  if (en.length) out.push({ id: "kw-en", label: "Scam keywords (English)", detail: en.slice(0, 6).join(", "), weight: Math.min(24, en.length * 5), category: "content" });
  if (bn.length) out.push({ id: "kw-bn", label: "Scam keywords (Bangla)", detail: bn.slice(0, 6).join(", "), weight: Math.min(24, bn.length * 6), category: "content" });
  if (/(password|pin|otp|cvv|পিন|ওটিপি|পাসওয়ার্ড)/i.test(text) && /(send|share|enter|reply|দিন|পাঠান)/i.test(text))
    out.push({ id: "cred-req", label: "Requests credentials", detail: "Asks you to share a PIN, OTP or password.", weight: 25, category: "content" });
  if (/(\d[\d,]*\s?(tk|taka|bdt|টাকা|৳))|৳\s?\d/i.test(text)) out.push({ id: "money", label: "Money amount mentioned", detail: "Promised or requested payment.", weight: 6, category: "content" });
  if (/(24 hours|within \d+|today only|immediately|আজই|২৪ ঘণ্টা)/i.test(text)) out.push({ id: "urgency", label: "Time pressure", detail: "Deadlines push you to act before thinking.", weight: 10, category: "content" });
  if ((text.match(/!/g) ?? []).length >= 3) out.push({ id: "exclaim", label: "Excessive exclamation", detail: "Emotional, sensational tone.", weight: 4, category: "content" });
  return out;
}

export function analyzeEmail(raw: string, lists: ListConfig): Indicator[] {
  const out: Indicator[] = [];
  const [headerBlock = "", ...bodyParts] = raw.split(/\r?\n\r?\n/);
  const body = bodyParts.join("\n\n") || raw;
  const header = (name: string) => headerBlock.match(new RegExp(`^${name}:\\s*(.+)$`, "im"))?.[1]?.trim() ?? "";

  const from = header("From");
  const reply = header("Reply-To");
  const addr = (s: string) => s.match(/<([^>]+)>/)?.[1] ?? s.match(/[\w.+-]+@[\w.-]+/)?.[0] ?? "";
  const domainOf = (a: string) => a.split("@")[1]?.toLowerCase() ?? "";
  const fromAddr = addr(from);
  const fromDomain = domainOf(fromAddr);

  if (reply && domainOf(addr(reply)) && domainOf(addr(reply)) !== fromDomain)
    out.push({ id: "em-reply", label: "Reply-To mismatch", detail: `Replies go to ${addr(reply)}, not ${fromAddr}.`, weight: 18, category: "email" });

  const display = from.replace(/<[^>]+>/, "").replace(/"/g, "").trim().toLowerCase();
  const brand = lists.legit.find((d) => display.includes(d.split(".")[0] ?? d));
  if (brand && fromDomain && !fromDomain.endsWith(brand))
    out.push({ id: "em-display", label: "Display-name spoofing", detail: `Name claims "${display}" but sender is ${fromDomain}.`, weight: 22, category: "email" });
  if (fromDomain) {
    const sq = findTyposquat(fromDomain, lists.legit);
    if (sq) out.push({ id: "em-typo", label: "Sender domain look-alike", detail: `${fromDomain} imitates ${sq}.`, weight: 25, category: "domain" });
  }

  const auth = headerBlock.match(/^Authentication-Results:[\s\S]*?(?=^\S|\Z)/im)?.[0] ?? headerBlock ?? "";
  for (const m of ["spf", "dkim", "dmarc"]) {
    const r = auth.match(new RegExp(`${m}=(\\w+)`, "i"))?.[1]?.toLowerCase();
    if (r && r !== "pass") out.push({ id: `em-${m}`, label: `${m.toUpperCase()} ${r}`, detail: `Sender authentication check returned "${r}".`, weight: m === "dmarc" ? 16 : 12, category: "email" });
  }

  const att = [...headerBlock.matchAll(/filename="?([^";\n]+)/gi), ...body.matchAll(/filename="?([^";\n]+)/gi)].map((m) => m[1] ?? "");
  for (const f of att) {
    if (/\.\w+\.(exe|scr|js|vbs|bat|cmd)$/i.test(f)) out.push({ id: "att-double", label: "Double-extension attachment", detail: f, weight: 28, category: "email" });
    else if (/\.(docm|xlsm|pptm|xlam)$/i.test(f)) out.push({ id: "att-macro", label: "Macro-enabled attachment", detail: f, weight: 20, category: "email" });
    else if (/\.(exe|scr|js|vbs|iso|html?)$/i.test(f)) out.push({ id: "att-risky", label: "Risky attachment type", detail: f, weight: 18, category: "email" });
  }

  out.push(...analyzeText(header("Subject") + "\n" + body));
  for (const u of extractUrls(body).slice(0, 5)) {
    for (const i of analyzeUrl(u, lists)) out.push({ ...i, id: `${i.id}:${u}`, detail: `${i.detail} (${u})` });
  }
  return out;
}

export function analyzeSms(text: string, lists: ListConfig): Indicator[] {
  const out = analyzeText(text);
  for (const u of extractUrls(text).slice(0, 5)) {
    for (const i of analyzeUrl(u, lists)) out.push({ ...i, id: `${i.id}:${u}`, detail: `${i.detail} (${u})` });
  }
  if (/\b01[3-9]\d{8}\b/.test(text) && /(call|send|কল|পাঠান)/i.test(text))
    out.push({ id: "sms-number", label: "Asks to contact a personal number", detail: "Official services don't ask you to call personal mobile numbers.", weight: 10, category: "content" });
  return out;
}
