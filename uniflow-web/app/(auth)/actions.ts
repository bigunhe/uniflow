"use server";

import { getSupabase } from "@/lib/supabase";

/** Public profile by username (e.g. pulse page). Uses service-role-less server client. */
export async function getProfileByUsername(username: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("user_data")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
}
