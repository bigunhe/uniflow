"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { UserRole } from "@/models/user";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [defaultRole, setDefaultRole] = useState<UserRole>("student");

  useEffect(() => {
    const roleParam = new URLSearchParams(window.location.search).get("role");
    if (roleParam === "mentor" || roleParam === "student") {
      setDefaultRole(roleParam);
    }
  }, []);

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    const supabase = createBrowserSupabase();
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          selected_role: defaultRole,
        },
      },
    });

    if (signupError) {
      setLoading(false);
      setError(signupError.message);
      return;
    }

    localStorage.setItem("selectedRole", defaultRole);
    setLoading(false);
    router.push("/select-role");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-6 py-14">
      <Link href="/" className="text-sm text-amber-700 hover:text-amber-800">
        ← Home
      </Link>
      <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900">Create account</h1>
      <p className="mt-2 text-sm text-slate-600">
        Sign up as a student or mentor and complete your profile.
      </p>

      <form onSubmit={handleSignup} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              defaultRole === "student"
                ? "bg-slate-900 text-white"
                : "border border-slate-300 text-slate-700"
            }`}
            onClick={() => setDefaultRole("student")}
          >
            Student
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${
              defaultRole === "mentor"
                ? "bg-slate-900 text-white"
                : "border border-slate-300 text-slate-700"
            }`}
            onClick={() => setDefaultRole("mentor")}
          >
            Mentor
          </button>
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        {error ? <p className="rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-amber-700 hover:text-amber-800">
          Login
        </Link>
      </p>
    </main>
  );
}
