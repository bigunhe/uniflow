"use client";

import type { ProjectExecutionPacket, ProjectEvidenceChecklist } from "@/lib/projects/executionPacket";
import { defaultProjectEvidenceChecklist } from "@/lib/projects/executionPacket";
import { computeChecklistReadinessPercent, type ProjectScoreComponents } from "@/lib/projects/scoring";

export const COMPLETED_PROJECTS_STORAGE_KEY = "uniflow.completedProjects";
export const PROJECT_STATE_STORAGE_KEY = "uniflow.projectState";

export type StoredExecutionPacket = {
  packet: ProjectExecutionPacket;
  provider: string;
  generatedAt: string;
};

export type ProjectState = {
  completed: boolean;
  completedAt: string | null;
  lastTouchedAt: string | null;
  executionPacket: StoredExecutionPacket | null;
  evidence: ProjectEvidenceChecklist;
  scoreComponents: ProjectScoreComponents | null;
};

export type ProjectStateMap = Record<string, ProjectState>;

function nowIso(): string {
  return new Date().toISOString();
}

export function defaultProjectState(): ProjectState {
  return {
    completed: false,
    completedAt: null,
    lastTouchedAt: null,
    executionPacket: null,
    evidence: defaultProjectEvidenceChecklist(),
    scoreComponents: null,
  };
}

function normalizeState(input: unknown): ProjectState {
  const source = (typeof input === "object" && input !== null ? input : {}) as Partial<ProjectState>;
  return {
    completed: Boolean(source.completed),
    completedAt: typeof source.completedAt === "string" ? source.completedAt : null,
    lastTouchedAt: typeof source.lastTouchedAt === "string" ? source.lastTouchedAt : null,
    executionPacket:
      source.executionPacket &&
      typeof source.executionPacket === "object" &&
      typeof source.executionPacket.generatedAt === "string" &&
      typeof source.executionPacket.provider === "string" &&
      source.executionPacket.packet
        ? (source.executionPacket as StoredExecutionPacket)
        : null,
    evidence: {
      ...defaultProjectEvidenceChecklist(),
      ...(source.evidence ?? {}),
    },
    scoreComponents:
      source.scoreComponents && typeof source.scoreComponents === "object"
        ? (source.scoreComponents as ProjectScoreComponents)
        : null,
  };
}

export function readCompletedProjectIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(COMPLETED_PROJECTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

export function writeCompletedProjectIds(ids: string[]) {
  if (typeof window === "undefined") return;
  const uniqueIds = Array.from(new Set(ids));
  window.localStorage.setItem(
    COMPLETED_PROJECTS_STORAGE_KEY,
    JSON.stringify(uniqueIds)
  );
}

export function readProjectStateMap(): ProjectStateMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROJECT_STATE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.entries(parsed as Record<string, unknown>).reduce<ProjectStateMap>(
      (acc, [projectId, state]) => {
        acc[projectId] = normalizeState(state);
        return acc;
      },
      {}
    );
  } catch {
    return {};
  }
}

export function writeProjectStateMap(map: ProjectStateMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROJECT_STATE_STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("uniflow-project-state-changed"));
}

export function getProjectState(projectId: string): ProjectState {
  const map = readProjectStateMap();
  return map[projectId] ?? defaultProjectState();
}

export function upsertProjectState(
  projectId: string,
  patch: Partial<Omit<ProjectState, "evidence">> & {
    evidence?: Partial<ProjectEvidenceChecklist>;
  }
): ProjectState {
  const map = readProjectStateMap();
  const current = map[projectId] ?? defaultProjectState();
  const next: ProjectState = {
    ...current,
    ...patch,
    evidence: {
      ...current.evidence,
      ...(patch.evidence ?? {}),
    },
  };
  map[projectId] = next;
  writeProjectStateMap(map);
  return next;
}

export function markProjectTouched(projectId: string): ProjectState {
  return upsertProjectState(projectId, { lastTouchedAt: nowIso() });
}

export function setExecutionPacket(
  projectId: string,
  packet: ProjectExecutionPacket,
  provider: string
): ProjectState {
  return upsertProjectState(projectId, {
    executionPacket: {
      packet,
      provider,
      generatedAt: nowIso(),
    },
    lastTouchedAt: nowIso(),
  });
}

export function updateEvidenceChecklist(
  projectId: string,
  evidence: Partial<ProjectEvidenceChecklist>
): ProjectState {
  return upsertProjectState(projectId, {
    evidence,
    lastTouchedAt: nowIso(),
  });
}

export function setProjectScoreComponents(
  projectId: string,
  scoreComponents: ProjectScoreComponents
): ProjectState {
  return upsertProjectState(projectId, {
    scoreComponents,
    lastTouchedAt: nowIso(),
  });
}

export function toggleCompletedProject(projectId: string): string[] {
  const current = readCompletedProjectIds();
  const exists = current.includes(projectId);
  const next = exists
    ? current.filter((id) => id !== projectId)
    : [...current, projectId];
  writeCompletedProjectIds(next);
  upsertProjectState(projectId, {
    completed: !exists,
    completedAt: exists ? null : nowIso(),
    lastTouchedAt: nowIso(),
  });
  return next;
}

export function getProjectProgressPercent(projectId: string): number {
  const state = getProjectState(projectId);
  return computeChecklistReadinessPercent(state.evidence, state.completed);
}
