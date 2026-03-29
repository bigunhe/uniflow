"use client";

import { SupabaseClient } from "@supabase/supabase-js";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { SessionMessage } from "@/models/message";

export async function listSessionMessages(sessionId: string) {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []) as SessionMessage[];
}

export async function sendMessage(sessionId: string, senderId: string, content: string) {
  const supabase = createBrowserSupabase();
  const { error } = await supabase.from("messages").insert({
    session_id: sessionId,
    sender_id: senderId,
    content,
  });

  if (error) throw error;
}

export function subscribeToSessionMessages(
  supabase: SupabaseClient,
  sessionId: string,
  onChanged: () => Promise<void> | void,
) {
  return supabase
    .channel(`session-${sessionId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "messages", filter: `session_id=eq.${sessionId}` },
      () => {
        void onChanged();
      },
    )
    .subscribe();
}
