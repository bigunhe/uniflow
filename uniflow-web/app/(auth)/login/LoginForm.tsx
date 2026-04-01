"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, Rocket, Shield } from "lucide-react";

export function LoginForm() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Demo behavior: send user to specialization selection.
    router.push("/specialization");
  }

  return (
    <div className="w-full max-w-4xl rounded-[1.35rem] bg-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.18)] ring-1 ring-gray-200/80 overflow-hidden grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 px-8 py-10 md:py-12 text-white flex flex-col justify-between gap-10 min-h-[240px] md:min-h-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
            Welcome back.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-blue-100/95 max-w-sm">
            Sign in to continue your path with mentors, roadmaps, and your UniFlow
            dashboard.
          </p>
        </div>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Shield className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-medium pt-1">Secure access to your profile</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
              <Rocket className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-medium pt-1">Pick up where you left off</span>
          </li>
        </ul>
      </div>

      <div className="px-6 sm:px-10 py-10 md:py-12 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter your credentials to access UniFlow.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="sr-only">Email</span>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
              <input
                name="email"
                type="email"
                autoComplete="email"
                placeholder="john@university.edu"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </label>

          <label className="block">
            <span className="sr-only">Password</span>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="Password"
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </label>

          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-violet-600 hover:to-indigo-700"
          >
            Sign in
            <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
