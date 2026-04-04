"use server";

import { redirect } from "next/navigation";
import { getSupabase, getSupabaseIfConfigured } from "@/lib/supabase";

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
    .from("user_data")
    .select("*")
    .eq("username", username)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export type ProjectShowcaseProfile = {
  id: string;
  display_name: string;
  username: string;
  avatar_url: string | null;
  job_role: string | null;
  pulse_score: number | null;
};

export type ProjectShowcaseSubmission = {
  id?: string;
  github_url: string | null;
  live_url: string | null;
  screenshot_url: string | null;
  reflection: string | null;
  challenges: string | null;
  learned: string | null;
};

/**
 * Public studio showcase: `user_project_submission.module_id` stores the mock studio project id (e.g. proj-y1-1).
 */
export async function getProjectShowcaseByUsernameAndProjectId(
  username: string,
  projectId: string
): Promise<{ profile: ProjectShowcaseProfile; submission: ProjectShowcaseSubmission | null } | null> {
  const supabase = getSupabase();
  const { data: profile, error: profileError } = await supabase
    .from("user_data")
    .select("id, display_name, username, avatar_url, job_role, pulse_score")
    .eq("username", username)
    .maybeSingle();

  if (profileError || !profile) return null;

  const { data: rows, error: subError } = await supabase
    .from("user_project_submission")
    .select("id, github_url, live_url, screenshot_url, reflection, challenges, learned")
    .eq("user_id", profile.id)
    .eq("module_id", projectId)
    .limit(1);

  if (subError) {
    return {
      profile: profile as ProjectShowcaseProfile,
      submission: null,
    };
  }

  const row = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
  return {
    profile: profile as ProjectShowcaseProfile,
    submission: row as ProjectShowcaseSubmission | null,
  };
}

export type PortfolioSubmissionRow = ProjectShowcaseSubmission & {
  module_id: string;
};

/**
 * All studio submissions for a public portfolio index (`/p/{username}/portfolio`).
 */
export async function getPublicProjectSubmissionsForUsername(
  username: string
): Promise<{ profile: ProjectShowcaseProfile; submissions: PortfolioSubmissionRow[] } | null> {
  const supabase = getSupabase();
  const { data: profile, error: profileError } = await supabase
    .from("user_data")
    .select("id, display_name, username, avatar_url, job_role, pulse_score")
    .eq("username", username)
    .maybeSingle();

  if (profileError || !profile) return null;

  const { data: rows, error: subError } = await supabase
    .from("user_project_submission")
    .select("id, module_id, github_url, live_url, screenshot_url, reflection, challenges, learned")
    .eq("user_id", profile.id);

  if (subError) {
    return {
      profile: profile as ProjectShowcaseProfile,
      submissions: [],
    };
  }

  const list = (Array.isArray(rows) ? rows : []) as PortfolioSubmissionRow[];
  return {
    profile: profile as ProjectShowcaseProfile,
    submissions: list,
  };
}
