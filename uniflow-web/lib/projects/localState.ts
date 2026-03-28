"use client";

export const COMPLETED_PROJECTS_STORAGE_KEY = "uniflow.completedProjects";

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

export function toggleCompletedProject(projectId: string): string[] {
  const current = readCompletedProjectIds();
  const exists = current.includes(projectId);
  const next = exists
    ? current.filter((id) => id !== projectId)
    : [...current, projectId];
  writeCompletedProjectIds(next);
  return next;
}
