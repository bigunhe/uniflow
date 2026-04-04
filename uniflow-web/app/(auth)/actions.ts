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
