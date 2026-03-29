"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseIfConfigured } from "@/lib/supabase";

export async function getAlumni() {
  const supabase = getSupabaseIfConfigured();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("alumni")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createAlumni(formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string) || null;
  if (!name?.trim()) return;

  const supabase = getSupabaseIfConfigured();
  if (!supabase) return;
  await supabase.from("alumni").insert({ name: name.trim(), email: email?.trim() || null });
  revalidatePath("/networking/alumni");
}

export async function deleteAlumni(id: string) {
  const supabase = getSupabaseIfConfigured();
  if (!supabase) return;
  await supabase.from("alumni").delete().eq("id", id);
  revalidatePath("/networking/alumni");
}
