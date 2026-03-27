/**
 * Returns a same-origin relative path safe to redirect to after auth, or null.
 */
export function getSafeNextPath(next: string | null | undefined): string | null {
  if (next == null || typeof next !== "string") return null;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/")) return null;
  if (trimmed.startsWith("//")) return null;
  if (trimmed.includes(":")) return null;
  return trimmed;
}

export function callbackUrlWithNext(origin: string, nextPath: string | null): string {
  const base = `${origin.replace(/\/$/, "")}/callback`;
  const safe = getSafeNextPath(nextPath);
  if (!safe) return base;
  return `${base}?next=${encodeURIComponent(safe)}`;
}
