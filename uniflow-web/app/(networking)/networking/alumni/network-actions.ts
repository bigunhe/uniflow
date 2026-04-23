"use server";

import { revalidatePath } from "next/cache";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";

export type AlumniNetworkRole = "alumni" | "student";

export type AlumniNetworkProfileFormData = {
  id: string;
  role: AlumniNetworkRole;
  full_name: string;
  email: string;
  phone: string | null;
  programme: string | null;
  graduation_year: string | null;
  current_role: string | null;
  company: string | null;
  expertise: string | null;
  bio: string | null;
  topics_help: string | null;
  year_level: string | null;
  focus_areas: string | null;
};

export type SubmitAlumniNetworkResult =
  | { ok: true; nextPath: string }
  | { ok: false; error: string };

function mapRow(row: Record<string, unknown>): AlumniNetworkProfileFormData {
  const role = row.role === "student" ? "student" : "alumni";
  return {
    id: String(row.id ?? ""),
    role,
    full_name: String(row.full_name ?? ""),
    email: String(row.email ?? ""),
    phone: row.phone != null ? String(row.phone) : null,
    programme: row.programme != null ? String(row.programme) : null,
    graduation_year: row.graduation_year != null ? String(row.graduation_year) : null,
    current_role: row.current_role != null ? String(row.current_role) : null,
    company: row.company != null ? String(row.company) : null,
    expertise: row.expertise != null ? String(row.expertise) : null,
    bio: row.bio != null ? String(row.bio) : null,
    topics_help: row.topics_help != null ? String(row.topics_help) : null,
    year_level: row.year_level != null ? String(row.year_level) : null,
    focus_areas: row.focus_areas != null ? String(row.focus_areas) : null,
  };
}

/** Load existing profile for the signed-in user (by user_id, then by auth email). */
export async function getAlumniNetworkProfileForSession(
  role: AlumniNetworkRole
): Promise<AlumniNetworkProfileFormData | null> {
  try {
    const supabase = await createRouteHandlerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: byUserId } = await supabase
      .from("alumni_network_profiles")
      .select("*")
      .eq("user_id", user.id)
      .eq("role", role)
      .maybeSingle();

    if (byUserId && typeof byUserId === "object") {
      return mapRow(byUserId as Record<string, unknown>);
    }

    const email = user.email?.trim().toLowerCase();
    if (!email) return null;

    const { data: byEmail } = await supabase
      .from("alumni_network_profiles")
      .select("*")
      .eq("email", email)
      .eq("role", role)
      .maybeSingle();

    if (byEmail && typeof byEmail === "object") {
      return mapRow(byEmail as Record<string, unknown>);
    }
    return null;
  } catch {
    return null;
  }
}

/** Load a specific profile by id (used by explicit edit links). */
export async function getAlumniNetworkProfileById(
  profileId: string
): Promise<AlumniNetworkProfileFormData | null> {
  const id = profileId.trim();
  if (!id) return null;
  try {
    const supabase = await createRouteHandlerSupabase();
    const { data } = await supabase
      .from("alumni_network_profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (data && typeof data === "object") {
      return mapRow(data as Record<string, unknown>);
    }
    return null;
  } catch {
    return null;
  }
}

export async function submitAlumniNetworkProfile(formData: FormData): Promise<SubmitAlumniNetworkResult> {
  const roleRaw = (formData.get("role") as string) || "alumni";
  const role: AlumniNetworkRole = roleRaw === "student" ? "student" : "alumni";

  const fullName = (formData.get("fullName") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim().toLowerCase() ?? "";
  const phone = (formData.get("phone") as string)?.trim().replace(/\D/g, "") ?? "";
  const programme = (formData.get("programme") as string)?.trim() || null;

  if (!fullName) return { ok: false, error: "Full name is required." };
  if (!email) return { ok: false, error: "Email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Enter a valid email." };
  if (!phone || phone.length !== 10) return { ok: false, error: "Phone must be exactly 10 digits." };

  const graduationYear =
    role === "alumni" ? (formData.get("graduationYear") as string)?.trim() || null : null;
  const currentRole =
    role === "alumni" ? (formData.get("currentRole") as string)?.trim() || null : null;
  const company = role === "alumni" ? (formData.get("company") as string)?.trim() || null : null;
  const expertise = role === "alumni" ? (formData.get("expertise") as string)?.trim() || null : null;
  const bio = role === "alumni" ? (formData.get("bio") as string)?.trim() || null : null;
  const topicsHelp = role === "alumni" ? (formData.get("topicsHelp") as string)?.trim() || null : null;

  const yearLevel = role === "student" ? (formData.get("yearLevel") as string)?.trim() || null : null;
  const focusAreas = role === "student" ? (formData.get("focusAreas") as string)?.trim() || null : null;

  if (role === "alumni") {
    if (!graduationYear) return { ok: false, error: "Graduation year is required for alumni." };
    if (!programme) return { ok: false, error: "Programme / degree is required for alumni." };
    if (!currentRole) return { ok: false, error: "Current role is required for alumni." };
  } else {
    if (!programme) return { ok: false, error: "Programme is required." };
    if (!yearLevel) return { ok: false, error: "Year level is required." };
  }

  let supabase;
  try {
    supabase = await createRouteHandlerSupabase();
  } catch {
    return {
      ok: false,
      error: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const row: Record<string, unknown> = {
    role,
    full_name: fullName,
    email,
    phone,
    programme,
    graduation_year: graduationYear,
    current_role: currentRole,
    company,
    expertise,
    bio,
    topics_help: topicsHelp,
    year_level: yearLevel,
    focus_areas: focusAreas,
    updated_at: new Date().toISOString(),
  };

  if (user?.id) {
    row.user_id = user.id;
  }

  const existingId = ((formData.get("profileId") as string) || "").trim();

  let error: { message: string } | null = null;

  if (existingId) {
    const { error: updateErr } = await supabase
      .from("alumni_network_profiles")
      .update({
        full_name: fullName,
        email,
        phone,
        programme,
        graduation_year: graduationYear,
        current_role: currentRole,
        company,
        expertise,
        bio,
        topics_help: topicsHelp,
        year_level: yearLevel,
        focus_areas: focusAreas,
        updated_at: row.updated_at,
        ...(user?.id ? { user_id: user.id } : {}),
      })
      .eq("id", existingId);
    error = updateErr;
  } else {
    const { error: upsertErr } = await supabase.from("alumni_network_profiles").upsert(row, {
      onConflict: "role,email",
    });
    error = upsertErr;
  }

  if (error) {
    return { ok: false, error: error.message || "Could not save profile." };
  }

  revalidatePath("/networking/alumni/register");
  revalidatePath("/networking/alumni/for-alumni");
  revalidatePath("/networking/alumni/for-students");

  const nextPath =
    role === "alumni" ? "/networking/alumni/for-alumni" : "/networking/alumni/for-students";
  return { ok: true, nextPath };
}

export async function getAlumniNetworkProfilesByRole(role: AlumniNetworkRole): Promise<AlumniNetworkProfileFormData[]> {
  try {
    const supabase = await createRouteHandlerSupabase();
    const { data } = await supabase
      .from("alumni_network_profiles")
      .select("*")
      .eq("role", role);
      
    if (data && Array.isArray(data)) {
      return data.map(row => mapRow(row as Record<string, unknown>));
    }
    return [];
  } catch {
    return [];
  }
}
