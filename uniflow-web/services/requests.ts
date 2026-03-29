"use client";

import { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { GuidanceRequest, RequestStatus, RequestUrgency } from "@/models/request";
import { UserProfile } from "@/models/user";
import { rankMentors } from "@/services/matching";

export type CreateRequestInput = {
  topic: string;
  description: string;
  urgency: RequestUrgency;
  preferredTime: string;
  subjectTags: string[];
  studentId: string;
};

export async function fetchRecommendedMentors(subjectTags: string[], urgency: RequestUrgency) {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("role", "mentor");

  if (error) throw error;

  const urgencyWeight = urgency === "urgent" ? 1.8 : urgency === "high" ? 1.3 : 1;
  return rankMentors((data || []) as UserProfile[], subjectTags, urgencyWeight);
}

export async function createGuidanceRequest(input: CreateRequestInput) {
  const supabase = createBrowserSupabase();
  const payload = {
    student_id: input.studentId,
    topic: input.topic,
    description: input.description,
    urgency: input.urgency,
    preferred_time: input.preferredTime,
    subject_tags: input.subjectTags,
    status: "open",
  };

  const { data, error } = await supabase
    .from("guidance_requests")
    .insert(payload)
    .select("*")
    .single();

  if (error) throw error;
  return data as GuidanceRequest;
}

export async function listStudentRequests(studentId: string) {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("guidance_requests")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as GuidanceRequest[];
}

export async function listMentorVisibleRequests(mentorId: string) {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("guidance_requests")
    .select("*")
    .or(`mentor_id.eq.${mentorId},status.eq.open`)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as GuidanceRequest[];
}

export async function updateRequestStatus(requestId: string, status: RequestStatus, mentorId?: string) {
  const supabase = createBrowserSupabase();
  const payload: { status: RequestStatus; mentor_id?: string } = { status };
  if (mentorId) payload.mentor_id = mentorId;

  const { data, error } = await supabase
    .from("guidance_requests")
    .update(payload)
    .eq("id", requestId)
    .select("*")
    .single();

  if (error) throw error;
  return data as GuidanceRequest;
}

export async function acceptRequestAndCreateSession(request: GuidanceRequest, mentorId: string) {
  const supabase = createBrowserSupabase();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      mentor_id: mentorId,
      student_id: request.student_id,
      request_id: request.id,
      start_time: new Date().toISOString(),
      status: "active",
    })
    .select("*")
    .single();

  if (sessionError) throw sessionError;

  const { error: requestError } = await supabase
    .from("guidance_requests")
    .update({
      status: "accepted",
      mentor_id: mentorId,
      session_id: session.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", request.id);

  if (requestError) throw requestError;

  return session;
}

export function subscribeToRequests(
  supabase: SupabaseClient,
  onChanged: () => Promise<void> | void,
) {
  return supabase
    .channel("requests-feed")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "guidance_requests" },
      () => {
        void onChanged();
      },
    )
    .subscribe();
}
