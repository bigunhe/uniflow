"use client";

/** Dispatched after gap checkbox state is persisted (same tab). */
export const LEARNING_GAPS_CHANGED_EVENT = "uniflow-learning-gaps-changed";

export function learningGapChecksStorageKey(userId: string): string {
  return `uniflow.learningGapChecks.v1:${userId}`;
}

export function alignChecksToLength(prev: boolean[] | undefined, n: number): boolean[] {
  if (n <= 0) return [];
  if (!prev?.length) return Array.from({ length: n }, () => false);
  const next = prev.slice(0, n);
  while (next.length < n) next.push(false);
  return next;
}

function parseMap(raw: string | null): Record<string, boolean[]> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object" || Array.isArray(v)) return {};
    const out: Record<string, boolean[]> = {};
    for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
      if (Array.isArray(val) && val.every((x) => typeof x === "boolean")) {
        out[k] = val;
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function readGapChecksMap(userId: string | null): Record<string, boolean[]> {
  if (typeof window === "undefined" || !userId) return {};
  try {
    return parseMap(window.localStorage.getItem(learningGapChecksStorageKey(userId)));
  } catch {
    return {};
  }
}

export function setModuleGapChecks(
  userId: string,
  moduleCode: string,
  checks: boolean[]
): void {
  if (typeof window === "undefined") return;
  try {
    const key = learningGapChecksStorageKey(userId);
    const map = parseMap(window.localStorage.getItem(key));
    map[moduleCode] = checks;
    window.localStorage.setItem(key, JSON.stringify(map));
  } catch {
    /* ignore quota / private mode */
  }
  window.dispatchEvent(new Event(LEARNING_GAPS_CHANGED_EVENT));
}

export function aggregateLearningPercent(userId: string | null): number {
  const map = readGapChecksMap(userId);
  let total = 0;
  let checked = 0;
  for (const arr of Object.values(map)) {
    if (!arr.length) continue;
    total += arr.length;
    checked += arr.filter(Boolean).length;
  }
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((checked / total) * 100)));
}

export function fakeCommunityPercent(learningAgg: number): number {
  return Math.min(40, 10 + Math.round(learningAgg * 0.35));
}

export function displayPulseRingScore(learningAgg: number, projectsPillar: number): number {
  const community = fakeCommunityPercent(learningAgg);
  const raw =
    0.35 * learningAgg + 0.25 * community + 0.4 * Math.min(100, Math.max(0, projectsPillar));
  return Math.min(100, Math.max(0, Math.round(raw)));
}

export function moduleGapSelfCheckPercent(checks: boolean[]): number | null {
  const n = checks.length;
  if (n <= 0) return null;
  const c = checks.filter(Boolean).length;
  return Math.min(100, Math.max(0, Math.round((c / n) * 100)));
}
