"use client";

export type GuidanceRequestStatus = "pending" | "accepted" | "rejected";

export type GuidanceRequest = {
  id: string;
  mentorSlug: string;
  mentorName: string;
  studentName: string;
  topic: string;
  status: GuidanceRequestStatus;
  createdAt: string;
};

const STORAGE_KEY = "uniflow-guidance-requests";

function safeParse(raw: string | null): GuidanceRequest[] {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as GuidanceRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getGuidanceRequests(): GuidanceRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function saveGuidanceRequests(requests: GuidanceRequest[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  window.dispatchEvent(new Event("guidance-requests-updated"));
}

export function getRequestByMentor(mentorSlug: string) {
  return getGuidanceRequests().find((request) => request.mentorSlug === mentorSlug);
}

export function createGuidanceRequest(input: {
  mentorSlug: string;
  mentorName: string;
  studentName?: string;
  topic?: string;
}) {
  const requests = getGuidanceRequests();
  const existing = requests.find((request) => request.mentorSlug === input.mentorSlug);

  if (existing && (existing.status === "pending" || existing.status === "accepted")) {
    return existing;
  }

  const next: GuidanceRequest = {
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    mentorSlug: input.mentorSlug,
    mentorName: input.mentorName,
    studentName: input.studentName ?? "Alex Johnson",
    topic: input.topic ?? "Need help with course topic and assignments",
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const filtered = requests.filter((request) => request.mentorSlug !== input.mentorSlug);
  saveGuidanceRequests([next, ...filtered]);
  return next;
}

export function updateGuidanceRequestStatus(requestId: string, status: GuidanceRequestStatus) {
  const requests = getGuidanceRequests();
  const updated = requests.map((request) =>
    request.id === requestId ? { ...request, status } : request,
  );

  saveGuidanceRequests(updated);
}

export function removeGuidanceRequestByMentor(mentorSlug: string) {
  const requests = getGuidanceRequests();
  const filtered = requests.filter((request) => request.mentorSlug !== mentorSlug);

  if (filtered.length !== requests.length) {
    saveGuidanceRequests(filtered);
  }
}

export function hasAcceptedGuidanceRequest() {
  return getGuidanceRequests().some((request) => request.status === "accepted");
}
