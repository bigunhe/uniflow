export const REALTIME_CHANNELS = {
  REQUESTS: "requests-feed",
  URGENT: "urgent-feed",
  SESSION_PREFIX: "session-",
} as const;

export function getSessionChannel(sessionId: string) {
  return `${REALTIME_CHANNELS.SESSION_PREFIX}${sessionId}`;
}
