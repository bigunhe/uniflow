"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import { MentoringSession } from "@/models/session";

export async function listSessionHistory(userId: string, role: "student" | "mentor") {
  const supabase = createBrowserSupabase();
  const key = role === "mentor" ? "mentor_id" : "student_id";

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq(key, userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as MentoringSession[];
}

export async function getSessionById(sessionId: string) {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase.from("sessions").select("*").eq("id", sessionId).single();
  if (error) throw error;
  return data as MentoringSession;
}

export function calculateDurationMinutes(startTime: string, endTime: string) {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.max(1, Math.round((end - start) / 60000));
}

export async function completeSession(session: MentoringSession, notes: string | null) {
  const supabase = createBrowserSupabase();
  const endTime = new Date().toISOString();
  const durationMinutes = calculateDurationMinutes(session.start_time, endTime);

  const { data, error } = await supabase
    .from("sessions")
    .update({
      end_time: endTime,
      duration_minutes: durationMinutes,
      notes,
      status: "completed",
      updated_at: endTime,
    })
    .eq("id", session.id)
    .select("*")
    .single();

  if (error) throw error;

  await supabase
    .from("guidance_requests")
    .update({ status: "completed", updated_at: endTime })
    .eq("id", session.request_id);

  return data as MentoringSession;
}
