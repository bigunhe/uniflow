"use client";

import { RealtimeChannel } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import {
  MentorBadge,
  MentorProfile,
  MentorshipMessage,
  MentorshipRequest,
  MentorshipRequestStatus,
  StudentProfile,
} from "@/models/mentorship";

export type UpsertStudentProfileInput = {
  fullName: string;
  phone: string;
  university: string;
  program: string;
  yearLevel: number;
  learningGoals: string;
  skills: string[];
};

export type UpsertMentorProfileInput = {
  fullName: string;
  phone: string;
  expertise: string[];
  yearsExperience: number;
  role: string;
  company: string;
  mentoringTopics: string[];
  bio: string;
  availability: Record<string, unknown>;
  sessionMode: string;
};

export type MentorFilter = {
  expertise?: string;
  availability?: string;
  sessionMode?: string;
};

export type MentorRecommendation = MentorProfile & {
  matchScore: number;
  matchReasons: string[];
};

function normalizeList(input: string[]) {
  return input
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.findIndex((item) => item.toLowerCase() === value.toLowerCase()) === index);
}

function normalizeText(input: string) {
  return input.trim().toLowerCase();
}

function scoreOverlap(source: string[], target: string[]) {
  const targetSet = new Set(target.map((item) => normalizeText(item)));
  return source.reduce((count, item) => {
    return targetSet.has(normalizeText(item)) ? count + 1 : count;
  }, 0);
}

function extractAvailabilityText(availability: Record<string, unknown>) {
  const values = Object.values(availability ?? {});
  const joined = values
    .map((value) => String(value ?? "").trim())
    .filter(Boolean)
    .join(" ");
  return joined.toLowerCase();
}

function generateJitsiLink(requestId: string) {
  return `https://meet.jit.si/uniflow-mentorship-${requestId}`;
}

function isSessionMissingError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { name?: unknown; message?: unknown };
  const message =
    typeof maybeError.message === "string" ? maybeError.message.toLowerCase() : "";

  return (
    maybeError.name === "AuthSessionMissingError" ||
    message.includes("auth session missing") ||
    message.includes("session missing")
  );
}

function toMentorshipAuthError(error: unknown) {
  if (isSessionMissingError(error)) {
    return new Error(
      "Your magic-link login is not active on this page yet. Open the latest login link again, then continue profile setup."
    );
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Could not verify your login session. Please sign in again.");
}

async function restoreSessionFromMagicLink() {
  if (typeof window === "undefined") {
    return;
  }

  const supabase = createBrowserSupabase();
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.session) {
        url.searchParams.delete("code");
        window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
        return;
      }
    } catch {
      // Ignore here and continue with other session sources.
    }
  }

  const hash = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;

  if (!hash) {
    return;
  }

  const hashParams = new URLSearchParams(hash);
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return;
  }

  try {
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch {
    return;
  }

  window.history.replaceState({}, "", window.location.pathname + window.location.search);
}

async function getCurrentUserId() {
  try {
    const supabase = createBrowserSupabase();

    // Supabase magic-link sign-in can arrive with a URL code/hash token on first load.
    // Restore session from URL first so the mentoring pages can continue without manual re-login.
    await restoreSessionFromMagicLink();

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (!userError && userData.user?.id) {
      return userData.user.id;
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    if (sessionData.session?.user?.id) {
      return sessionData.session.user.id;
    }

    const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
    if (refreshError) {
      throw refreshError;
    }

    const userId = refreshed.session?.user?.id;
    if (!userId) throw new Error("You must be logged in to use mentorship features.");
    return userId;
  } catch (error) {
    throw toMentorshipAuthError(error);
  }
}

export async function getMyRoleProfile() {
  const supabase = createBrowserSupabase();
  const userId = await getCurrentUserId();

  const [studentResult, mentorResult] = await Promise.all([
    supabase.from("student_profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("mentor_profiles").select("*").eq("id", userId).maybeSingle(),
  ]);

  if (studentResult.error) throw studentResult.error;
  if (mentorResult.error) throw mentorResult.error;

  return {
    student: (studentResult.data as StudentProfile | null) ?? null,
    mentor: (mentorResult.data as MentorProfile | null) ?? null,
  };
}

export async function upsertStudentProfile(input: UpsertStudentProfileInput) {
  const supabase = createBrowserSupabase();
  const userId = await getCurrentUserId();

  const payload = {
    id: userId,
    full_name: input.fullName.trim(),
    phone: input.phone.trim() || null,
    university: input.university.trim() || null,
    program: input.program.trim() || null,
    year_level: Number.isFinite(input.yearLevel) ? input.yearLevel : null,
    learning_goals: input.learningGoals.trim() || null,
    skills: normalizeList(input.skills),
  };

  const { data, error } = await supabase
    .from("student_profiles")
    .upsert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data as StudentProfile;
}

export async function upsertMentorProfile(input: UpsertMentorProfileInput) {
  const supabase = createBrowserSupabase();
  const userId = await getCurrentUserId();

  const payload = {
    id: userId,
    full_name: input.fullName.trim(),
    phone: input.phone.trim() || null,
    expertise: normalizeList(input.expertise),
    years_experience: Number.isFinite(input.yearsExperience) ? input.yearsExperience : null,
    current_role: input.role.trim() || null,
    company: input.company.trim() || null,
    mentoring_topics: normalizeList(input.mentoringTopics),
    bio: input.bio.trim() || null,
    availability: input.availability ?? {},
    session_mode: input.sessionMode.trim() || null,
  };

  const { data, error } = await supabase
    .from("mentor_profiles")
    .upsert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data as MentorProfile;
}

export async function listMentorProfiles(filters?: MentorFilter) {
  const supabase = createBrowserSupabase();
  let query = supabase
    .from("mentor_profiles")
    .select("*")
    .order("rating", { ascending: false });

  if (filters?.sessionMode) {
    query = query.eq("session_mode", filters.sessionMode);
  }

  if (filters?.expertise) {
    query = query.contains("expertise", [filters.expertise]);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data || []) as MentorProfile[];
  if (!filters?.availability) {
    return rows;
  }

  const availabilityFilter = normalizeText(filters.availability);
  return rows.filter((mentor) =>
    extractAvailabilityText(mentor.availability).includes(availabilityFilter),
  );
}

export function recommendMentors(args: {
  studentSkills: string[];
  learningGoals: string;
  mentors: MentorProfile[];
}) {
  const studentSkills = normalizeList(args.studentSkills);
  const goalTokens = normalizeList(args.learningGoals.split(/[,.\n]/));

  const ranked = args.mentors
    .map((mentor) => {
      const expertiseHit = scoreOverlap(studentSkills, mentor.expertise);
      const topicHit = scoreOverlap(goalTokens, mentor.mentoring_topics);
      const ratingBoost = mentor.rating * 1.5;
      const sessionBoost = Math.min(mentor.total_sessions / 25, 5);
      const score = expertiseHit * 8 + topicHit * 5 + ratingBoost + sessionBoost;

      const reasons: string[] = [];
      if (expertiseHit > 0) reasons.push(`Matched ${expertiseHit} skill(s)`);
      if (topicHit > 0) reasons.push(`Aligned to ${topicHit} learning goal area(s)`);
      if (mentor.rating >= 4.5) reasons.push("Highly rated by students");

      return {
        ...mentor,
        matchScore: score,
        matchReasons: reasons.length > 0 ? reasons : ["General profile relevance"],
      } as MentorRecommendation;
    })
    .sort((left, right) => right.matchScore - left.matchScore);

  return ranked;
}

export async function createMentorshipRequest(mentorId: string) {
  const supabase = createBrowserSupabase();
  const studentId = await getCurrentUserId();

  const { data: existing, error: existingError } = await supabase
    .from("mentorship_requests")
    .select("*")
    .eq("student_id", studentId)
    .eq("mentor_id", mentorId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) return existing as MentorshipRequest;

  const { data, error } = await supabase
    .from("mentorship_requests")
    .insert({
      student_id: studentId,
      mentor_id: mentorId,
      status: "pending",
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as MentorshipRequest;
}

export async function listMyStudentRequests() {
  const supabase = createBrowserSupabase();
  const studentId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("mentorship_requests")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data || []) as MentorshipRequest[];
  const mentorIds = Array.from(new Set(rows.map((row) => row.mentor_id).filter(Boolean)));

  if (mentorIds.length === 0) {
    return rows;
  }

  const { data: mentors, error: mentorError } = await supabase
    .from("mentor_profiles")
    .select("*")
    .in("id", mentorIds);

  if (mentorError) throw mentorError;

  const mentorMap = new Map((mentors || []).map((mentor) => [mentor.id, mentor]));
  return rows.map((row) => ({
    ...row,
    mentor: mentorMap.get(row.mentor_id) || null,
  }));
}

export async function listMentorRequests() {
  const supabase = createBrowserSupabase();
  const mentorId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("mentorship_requests")
    .select("*")
    .eq("mentor_id", mentorId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const rows = (data || []) as MentorshipRequest[];
  const studentIds = Array.from(new Set(rows.map((row) => row.student_id).filter(Boolean)));

  if (studentIds.length === 0) {
    return rows;
  }

  const { data: students, error: studentError } = await supabase
    .from("student_profiles")
    .select("*")
    .in("id", studentIds);

  if (studentError) throw studentError;

  const studentMap = new Map((students || []).map((student) => [student.id, student]));
  return rows.map((row) => ({
    ...row,
    student: studentMap.get(row.student_id) || null,
  }));
}

export async function updateMentorshipRequestStatus(
  requestId: string,
  status: MentorshipRequestStatus,
) {
  const supabase = createBrowserSupabase();

  let meetingLink: string | null = null;
  let acceptedAt: string | null = null;
  if (status === "accepted") {
    meetingLink = generateJitsiLink(requestId);
    acceptedAt = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("mentorship_requests")
    .update({
      status,
      accepted_at: acceptedAt,
      meeting_link: meetingLink,
    })
    .eq("id", requestId)
    .select("*")
    .single();

  if (error) throw error;

  if (status === "accepted") {
    const request = data as MentorshipRequest;
    await incrementMentorSessionCount(request.mentor_id);
    await refreshMentorBadges(request.mentor_id);
  }

  return data as MentorshipRequest;
}

async function incrementMentorSessionCount(mentorId: string) {
  const supabase = createBrowserSupabase();
  const { data: mentor, error: mentorError } = await supabase
    .from("mentor_profiles")
    .select("total_sessions")
    .eq("id", mentorId)
    .single();

  if (mentorError) throw mentorError;

  const nextValue = ((mentor?.total_sessions as number) || 0) + 1;
  const { error } = await supabase
    .from("mentor_profiles")
    .update({ total_sessions: nextValue })
    .eq("id", mentorId);

  if (error) throw error;
}

export async function getMentorshipRequestById(requestId: string) {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("mentorship_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (error) throw error;
  return data as MentorshipRequest;
}

async function ensureAcceptedRequestForCurrentUser(requestId: string) {
  const supabase = createBrowserSupabase();
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from("mentorship_requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (error) throw error;

  const request = data as MentorshipRequest;
  const isParticipant = request.student_id === userId || request.mentor_id === userId;

  if (!isParticipant) {
    throw new Error("You are not part of this mentorship request.");
  }

  if (request.status !== "accepted") {
    throw new Error("Messaging is enabled only after request acceptance.");
  }

  return { request, userId };
}

export async function listRequestMessages(requestId: string) {
  await ensureAcceptedRequestForCurrentUser(requestId);

  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []) as MentorshipMessage[];
}

export async function sendRequestMessage(requestId: string, text: string) {
  const { request, userId } = await ensureAcceptedRequestForCurrentUser(requestId);
  const supabase = createBrowserSupabase();

  const receiverId = request.student_id === userId ? request.mentor_id : request.student_id;

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: userId,
      receiver_id: receiverId,
      request_id: requestId,
      message: text.trim(),
    })
    .select("*")
    .single();

  if (error) throw error;
  return data as MentorshipMessage;
}

export function subscribeToRequestMessages(
  requestId: string,
  onChanged: () => void | Promise<void>,
) {
  const supabase = createBrowserSupabase();
  return supabase
    .channel(`mentorship-messages-${requestId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages", filter: `request_id=eq.${requestId}` },
      () => {
        void onChanged();
      },
    )
    .subscribe();
}

export function subscribeToMyRequests(
  userId: string,
  onChanged: () => void | Promise<void>,
): RealtimeChannel {
  const supabase = createBrowserSupabase();

  return supabase
    .channel(`mentorship-requests-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "mentorship_requests",
        filter: `student_id=eq.${userId}`,
      },
      () => {
        void onChanged();
      },
    )
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "mentorship_requests",
        filter: `mentor_id=eq.${userId}`,
      },
      () => {
        void onChanged();
      },
    )
    .subscribe();
}

export async function listMentorBadges(mentorId?: string) {
  const supabase = createBrowserSupabase();
  const targetMentorId = mentorId ?? (await getCurrentUserId());
  const { data, error } = await supabase
    .from("mentor_badges")
    .select("*")
    .eq("mentor_id", targetMentorId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as MentorBadge[];
}

export async function refreshMentorBadges(mentorId?: string) {
  const supabase = createBrowserSupabase();
  const targetMentorId = mentorId ?? (await getCurrentUserId());

  const [{ data: mentor, error: mentorError }, { data: acceptedRequests, error: requestError }] =
    await Promise.all([
      supabase
        .from("mentor_profiles")
        .select("rating, total_sessions")
        .eq("id", targetMentorId)
        .single(),
      supabase
        .from("mentorship_requests")
        .select("student_id")
        .eq("mentor_id", targetMentorId)
        .eq("status", "accepted"),
    ]);

  if (mentorError) throw mentorError;
  if (requestError) throw requestError;

  const totalSessions = (mentor?.total_sessions as number) || 0;
  const rating = (mentor?.rating as number) || 0;
  const helpedStudents = new Set((acceptedRequests || []).map((row) => String(row.student_id))).size;

  const badges: Array<{ badge_name: string; criteria: string }> = [];

  if (totalSessions >= 20 && rating >= 4.7) {
    badges.push({
      badge_name: "Top Mentor",
      criteria: "20+ sessions and rating at least 4.7",
    });
  }

  if (totalSessions >= 8 && rating >= 4.2) {
    badges.push({
      badge_name: "Rising Star",
      criteria: "8+ sessions and rating at least 4.2",
    });
  }

  if (helpedStudents >= 15) {
    badges.push({
      badge_name: "Expert Guide",
      criteria: "Helped at least 15 distinct students",
    });
  }

  await supabase.from("mentor_badges").delete().eq("mentor_id", targetMentorId);

  if (badges.length > 0) {
    const { error } = await supabase.from("mentor_badges").insert(
      badges.map((badge) => ({ mentor_id: targetMentorId, ...badge })),
    );

    if (error) throw error;
  }

  return listMentorBadges(targetMentorId);
}

export async function getCurrentUserIdSafe() {
  return getCurrentUserId();
}

export function unsubscribeChannel(channel: RealtimeChannel | null) {
  if (!channel) return;
  const supabase = createBrowserSupabase();
  void supabase.removeChannel(channel);
}
