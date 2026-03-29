"use server";

import { redirect } from "next/navigation";
import { getSupabaseIfConfigured } from "@/lib/supabase";

export type CreateProfileState = { error?: string };

export async function createProfile(
  _prevState: CreateProfileState,
  formData: FormData
): Promise<CreateProfileState> {
  const display_name = (formData.get("display_name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const username = (formData.get("username") as string)?.trim();

  if (!display_name || !username) {
    return { error: "Display name and username are required." };
  }

  const supabase = getSupabaseIfConfigured();
  if (!supabase) {
    return {
      error:
        "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in uniflow-web/.env.local.",
    };
  }
  const { error } = await supabase.from("profiles").insert({
    display_name,
    email,
    username,
  });

  if (error) return { error: error.message };

  redirect("/pulse/" + encodeURIComponent(username));
}

export async function getProfileByUsername(username: string) {
  const supabase = getSupabaseIfConfigured();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
}
