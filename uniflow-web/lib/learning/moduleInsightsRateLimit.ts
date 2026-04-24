type Hit = {
  count: number;
  windowStartMs: number;
  blockedUntilMs: number;
};

const WINDOW_MS = 90_000;
const MAX_HITS_PER_WINDOW = 1;
const BLOCK_FOR_MS = 90_000;

const byKey = new Map<string, Hit>();

function now(): number {
  return Date.now();
}

function key(userId: string, moduleCode: string): string {
  return `${userId}:${moduleCode}`;
}

export function checkModuleInsightsRateLimit(userId: string, moduleCode: string): {
  ok: boolean;
  retryAfterSec?: number;
} {
  const t = now();
  const k = key(userId, moduleCode);
  const current = byKey.get(k);

  if (!current) {
    byKey.set(k, { count: 1, windowStartMs: t, blockedUntilMs: 0 });
    return { ok: true };
  }

  if (current.blockedUntilMs > t) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((current.blockedUntilMs - t) / 1000)) };
  }

  if (t - current.windowStartMs > WINDOW_MS) {
    byKey.set(k, { count: 1, windowStartMs: t, blockedUntilMs: 0 });
    return { ok: true };
  }

  if (current.count >= MAX_HITS_PER_WINDOW) {
    current.blockedUntilMs = t + BLOCK_FOR_MS;
    byKey.set(k, current);
    return { ok: false, retryAfterSec: Math.ceil(BLOCK_FOR_MS / 1000) };
  }

  current.count += 1;
  byKey.set(k, current);
  return { ok: true };
}
