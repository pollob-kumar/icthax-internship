import { useCallback, useEffect, useState } from "react";
import type { AnalysisResult } from "./types";
import { LEGIT_DOMAINS } from "./lists";

const KEYS = { history: "pg.history", allow: "pg.allow", block: "pg.block", quiz: "pg.quiz" };

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    setValue(read(key, fallback));
    const h = (e: StorageEvent) => e.key === key && setValue(read(key, fallback));
    window.addEventListener("storage", h);
    return () => window.removeEventListener("storage", h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const update = useCallback(
    (fn: (prev: T) => T) =>
      setValue((prev) => {
        const next = fn(prev);
        localStorage.setItem(key, JSON.stringify(next));
        return next;
      }),
    [key],
  );
  return [value, update] as const;
}

export const useHistory = () => usePersisted<AnalysisResult[]>(KEYS.history, []);
export const useAllowList = () => usePersisted<string[]>(KEYS.allow, ["pub.edu.bd"]);
export const useBlockList = () => usePersisted<string[]>(KEYS.block, ["bkash-verify.xyz"]);

export interface QuizAttempt { score: number; total: number; at: number }
export const useQuizHistory = () => usePersisted<QuizAttempt[]>(KEYS.quiz, []);

export function useLists() {
  const [allow] = useAllowList();
  const [block] = useBlockList();
  return { legit: LEGIT_DOMAINS, allow, block };
}
