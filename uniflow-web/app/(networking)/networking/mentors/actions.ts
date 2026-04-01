"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseIfConfigured } from "@/lib/supabase";

export async function getMentors() {
  const supabase = getSupabaseIfConfigured();
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from("mentors")
      .select("*")
      .order("created_at", { ascending: false });

    // If Supabase auth is invalid (wrong API key), Supabase returns an error.
    // Don't crash the whole page; just show an empty mentor list.
    if (error) {
      console.error("[mentors] Failed to load mentors:", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("[mentors] Unexpected error loading mentors:", err);
    return [];
  }
}

export async function createMentor(formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || null;
  if (!name?.trim()) return;

  const supabase = getSupabaseIfConfigured();
  if (!supabase) return;
  await supabase.from("mentors").insert({
    name: name.trim(),
    email: email?.trim() || null,
  });
  revalidatePath("/networking/mentors");
}

export async function deleteMentor(id: string) {
  const supabase = getSupabaseIfConfigured();
  if (!supabase) return;
  await supabase.from("mentors").delete().eq("id", id);
  revalidatePath("/networking/mentors");
}
