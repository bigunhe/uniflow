"use server";

import { redirect } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

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

  const supabase = getSupabase();
  const { error } = await supabase.from("user_data").insert({
    display_name,
    email,
    username,
  });

  if (error) return { error: error.message };

  redirect("/pulse/" + encodeURIComponent(username));
}

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
