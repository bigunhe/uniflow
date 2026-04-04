import type { SupabaseClient } from "@supabase/supabase-js";
import { computeChecklistReadinessPercent } from "@/lib/projects/scoring";
import { readProjectStateMap, type ProjectStateMap } from "@/lib/projects/localState";

export const MAX_TOTAL_PROJECT_PULSE_POINTS = 35;
const MAX_RAW_PER_PROJECT = 10;

const LAST_AGGREGATE_KEY = "uniflow.projectsPulseLastAggregate";

function readLastSyncedAggregate(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(LAST_AGGREGATE_KEY);
    if (!raw) return 0;
    const n = Number(raw);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  } catch {
    return 0;
  }
}

function writeLastSyncedAggregate(value: number) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_AGGREGATE_KEY, String(Math.max(0, value)));
}

function diminishingWeight(index: number): number {
  const table = [1, 0.85, 0.7, 0.55, 0.45, 0.35, 0.28, 0.22];
  return table[index] ?? 0.18;
}

/**
 * Raw per-project cap MAX_RAW_PER_PROJECT, then diminishing sum across projects, total capped at MAX_TOTAL_PROJECT_PULSE_POINTS.
 */
export function computeTotalProjectPulsePoints(map: ProjectStateMap): number {
  const raws: number[] = [];
  for (const state of Object.values(map)) {
    const readiness = computeChecklistReadinessPercent(state.evidence, state.completed);
    const raw = (readiness / 100) * MAX_RAW_PER_PROJECT;
    raws.push(raw);
  }
  raws.sort((a, b) => b - a);
  let sum = 0;
  for (let i = 0; i < raws.length; i++) {
    sum += raws[i] * diminishingWeight(i);
  }
  return Math.min(MAX_TOTAL_PROJECT_PULSE_POINTS, Math.round(sum * 10) / 10);
}

export function projectsPulsePillarPercent(map: ProjectStateMap): number {
  const pts = computeTotalProjectPulsePoints(map);
  if (MAX_TOTAL_PROJECT_PULSE_POINTS <= 0) return 0;
  return Math.min(100, Math.round((pts / MAX_TOTAL_PROJECT_PULSE_POINTS) * 100));
}

/**
 * Adds incremental pulse points to user_data.pulse_score when aggregate project credits increase.
 * If aggregate drops (evidence unchecked), only updates local sync cursor—does not reduce pulse_score.
 */
export async function syncProjectsPulseCredits(
  supabase: SupabaseClient,
  userId: string
): Promise<{ appliedDelta: number; newPulse: number | null }> {
  if (typeof window === "undefined") {
    return { appliedDelta: 0, newPulse: null };
  }

  const map = readProjectStateMap();
  const target = computeTotalProjectPulsePoints(map);
  const last = readLastSyncedAggregate();

  if (target < last) {
    writeLastSyncedAggregate(target);
    return { appliedDelta: 0, newPulse: null };
  }

  const delta = target - last;
  if (delta <= 0) {
    return { appliedDelta: 0, newPulse: null };
  }

  const { data, error } = await supabase
    .from("user_data")
    .select("pulse_score")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.warn("[projects-pulse] could not read pulse_score", error.message);
    return { appliedDelta: 0, newPulse: null };
  }

  const current = typeof data?.pulse_score === "number" ? data.pulse_score : 0;
  const next = Math.min(100, Math.round((current + delta) * 10) / 10);

  if (next <= current) {
    writeLastSyncedAggregate(target);
    window.dispatchEvent(new Event("uniflow-projects-pulse-synced"));
    return { appliedDelta: 0, newPulse: current };
  }

  const { error: upErr } = await supabase
    .from("user_data")
    .update({ pulse_score: next })
    .eq("id", userId);

  if (upErr) {
    console.warn("[projects-pulse] could not update pulse_score", upErr.message);
    return { appliedDelta: 0, newPulse: null };
  }

  writeLastSyncedAggregate(target);
  window.dispatchEvent(new Event("uniflow-projects-pulse-synced"));
  return { appliedDelta: next - current, newPulse: next };
}
