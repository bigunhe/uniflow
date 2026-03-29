"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { UserRole } from "@/models/user";

export default function SelectRolePage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("student");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const preferredRole = localStorage.getItem("selectedRole") as UserRole | null;
    if (preferredRole === "student" || preferredRole === "mentor") {
      setRole(preferredRole);
    }
  }, []);

  async function saveRole() {
    setSaving(true);
    setError(null);

    const supabase = createBrowserSupabase();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSaving(false);
      router.push("/login");
      return;
    }

    const { error: upsertError } = await supabase.from("user_profiles").upsert({
      id: user.id,
      email: user.email,
      role,
      full_name: user.user_metadata.full_name || "",
      headline: null,
      subject_tags: [],
      goals: null,
      availability: null,
    });

    if (upsertError) {
      setSaving(false);
      setError(upsertError.message);
      return;
    }

    localStorage.setItem("selectedRole", role);
    setSaving(false);
    router.push("/profile-setup");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-6 py-14">
      <h1 className="text-3xl font-black tracking-tight text-slate-900">Select your role</h1>
      <p className="mt-2 text-sm text-slate-600">
        Your role controls dashboard tools and recommendations.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          className={`rounded-xl border px-4 py-4 text-left ${
            role === "student"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-slate-900"
          }`}
          onClick={() => setRole("student")}
        >
          <p className="text-sm font-bold">Student</p>
          <p className={`mt-1 text-xs ${role === "student" ? "text-slate-200" : "text-slate-600"}`}>
            Ask AI, request mentors, track sessions.
          </p>
        </button>

        <button
          type="button"
          className={`rounded-xl border px-4 py-4 text-left ${
            role === "mentor"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 bg-white text-slate-900"
          }`}
          onClick={() => setRole("mentor")}
        >
          <p className="text-sm font-bold">Mentor</p>
          <p className={`mt-1 text-xs ${role === "mentor" ? "text-slate-200" : "text-slate-600"}`}>
            Accept requests, host sessions, view analytics.
          </p>
        </button>
      </div>

      {error ? <p className="mt-4 rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}

      <button
        type="button"
        disabled={saving}
        className="mt-6 w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-70"
        onClick={saveRole}
      >
        {saving ? "Saving role..." : "Continue to profile setup"}
      </button>
    </main>
  );
}
