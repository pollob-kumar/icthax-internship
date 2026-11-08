// @ts-nocheck -- index access guarded by loop bounds
/**
 * Lightweight multinomial Naive Bayes trained in-browser on a small public-style
 * synthetic corpus. Metrics are computed on a held-out split at load time.
 */
import { CORPUS } from "./corpus";

const tokenize = (s: string) =>
  s.toLowerCase().replace(/https?:\/\/\S+/g, " urltoken ").split(/[^\p{L}\p{N}]+/u).filter((t) => t.length > 1);

class NaiveBayes {
  private counts: Map<string, number>[] = [new Map<string, number>(), new Map<string, number>()];
  private totals: number[] = [0, 0];
  private docs: number[] = [0, 0];
  private vocab = new Set<string>();

  train(data: { text: string; label: 0 | 1 }[]) {
    for (const { text, label } of data) {
      this.docs[label]++;
      for (const t of tokenize(text)) {
        this.vocab.add(t);
        this.counts[label].set(t, (this.counts[label].get(t) ?? 0) + 1);
        this.totals[label]++;
      }
    }
  }

  predict(text: string): number {
    const V = this.vocab.size;
    const n = this.docs[0] + this.docs[1];
    const lp = [Math.log(this.docs[0] / n), Math.log(this.docs[1] / n)];
    for (const t of tokenize(text)) {
      if (!this.vocab.has(t)) continue;
      for (const c of [0, 1]) lp[c] += Math.log(((this.counts[c].get(t) ?? 0) + 1) / (this.totals[c] + V));
    }
    const m = Math.max(...lp);
    const e = lp.map((x) => Math.exp(x - m));
    return e[1] / (e[0] + e[1]);
  }
}

// deterministic split: every 4th sample goes to test
const train = CORPUS.filter((_, i) => i % 4 !== 0);
const test = CORPUS.filter((_, i) => i % 4 === 0);

export const model = new NaiveBayes();
model.train(train);

function evaluate() {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (const s of test) {
    const p = model.predict(s.text) >= 0.5 ? 1 : 0;
    if (p === 1 && s.label === 1) tp++;
    else if (p === 1) fp++;
    else if (s.label === 0) tn++;
    else fn++;
  }
  const precision = tp / (tp + fp || 1);
  const recall = tp / (tp + fn || 1);
  return {
    accuracy: (tp + tn) / test.length,
    precision,
    recall,
    f1: (2 * precision * recall) / (precision + recall || 1),
    trainSize: train.length,
    testSize: test.length,
    confusion: { tp, fp, tn, fn },
  };
}

export const metrics = evaluate();
