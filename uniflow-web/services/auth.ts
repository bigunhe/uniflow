"use client";

import { createBrowserSupabase } from "@/lib/supabase/browser";
import { UserRole } from "@/models/user";

export async function getCurrentUserProfile() {
  const supabase = createBrowserSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
}

export async function signOut() {
  const supabase = createBrowserSupabase();
  await supabase.auth.signOut();
}

export function resolveHomeRoute(role: UserRole | null | undefined) {
  if (role === "mentor") return "/mentor/dashboard";
  if (role === "student") return "/student/dashboard";
  return "/select-role";
}
