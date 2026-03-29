"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseIfConfigured } from "@/lib/supabase";

export async function getMentors() {
  const supabase = getSupabaseIfConfigured();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("mentors")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createMentor(formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || null;
  if (!name?.trim()) return;

  const supabase = getSupabaseIfConfigured();
  if (!supabase) return;
  await supabase.from("mentors").insert({ name: name.trim(), email: email?.trim() || null });
  revalidatePath("/networking/mentors");
}

export async function deleteMentor(id: string) {
  const supabase = getSupabaseIfConfigured();
  if (!supabase) return;
  await supabase.from("mentors").delete().eq("id", id);
  revalidatePath("/networking/mentors");
}
