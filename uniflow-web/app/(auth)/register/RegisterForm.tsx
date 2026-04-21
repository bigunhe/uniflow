"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Gem,
  Lock,
  Mail,
  RefreshCw,
  Rocket,
  User,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const YEAR_SEMESTER = [
  "Year 1 · Semester 1",
  "Year 1 · Semester 2",
  "Year 2 · Semester 1",
  "Year 2 · Semester 2",
  "Year 3 · Semester 1",
  "Year 3 · Semester 2",
  "Year 4 · Semester 1",
  "Year 4 · Semester 2",
  "Graduate / Other",
] as const;

const MENTOR_FOCUS = [
  "Software Engineering",
  "Data Science & AI",
  "Cybersecurity",
  "Networking & Cloud",
  "Game Development",
  "Business IT",
] as const;

const SPECIALIZATIONS = MENTOR_FOCUS;

export function RegisterForm() {
  const router = useRouter();
  const [role, setRole] = useState<"student" | "mentor">("student");
  const [agreed, setAgreed] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) return;
    // Demo behavior: send user to specialization selection.
    router.push("/specialization");
  }

  return (
    <div className="w-full max-w-4xl rounded-[1.35rem] bg-white shadow-[0_25px_60px_-15px_rgba(79,70,229,0.18)] ring-1 ring-gray-200/80 overflow-hidden grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div
        className="relative bg-gradient-to-br from-blue-600 to-blue-700 px-8 py-10 md:py-12 text-white flex flex-col justify-between gap-10 min-h-[280px] md:min-h-0
          rounded-t-[1.35rem] md:rounded-t-none md:rounded-l-[1.35rem] md:rounded-r-none"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight">
            Start your IT journey today.
          </h2>
          <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-blue-100/95 max-w-sm">
            Join over 10,000+ students and mentors in the most advanced IT
            career guidance ecosystem.
          </p>
        </div>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25">
              <Check className="h-4 w-4" strokeWidth={2.5} />
            </span>
            <span className="font-medium pt-1">Industry Certified Mentors</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/25">
              <Rocket className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-medium pt-1">Personalized Career Roadmaps</span>
          </li>
        </ul>
      </div>

      <div className="px-6 sm:px-10 py-10 md:py-12 bg-white">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Create an account
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in your details to get started with uniflow.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div
            className="flex rounded-full bg-gray-100 p-1 ring-1 ring-gray-200/80"
            role="group"
            aria-label="Account type"
          >
            <button
              type="button"
              onClick={() => setRole("student")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all",
                role === "student"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200/80"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <User className="h-4 w-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("mentor")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold transition-all",
                role === "mentor"
                  ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200/80"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <UserCircle2 className="h-4 w-4" />
              Mentor
            </button>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Full Name</span>
              <div className="relative mt-1.5">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                <input
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Email Address
              </span>
              <div className="relative mt-1.5">
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

            {role === "student" ? (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Year and Semester
                  </span>
                  <div className="relative mt-1.5">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 pointer-events-none" />
                    <select
                      name="yearSemester"
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 [&:invalid]:text-gray-400"
                      required
                    >
                      <option value="" disabled>
                        Select year and semester
                      </option>
                      {YEAR_SEMESTER.map((y) => (
                        <option key={y} value={y} className="text-gray-900">
                          {y}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Specialization
                  </span>
                  <div className="relative mt-1.5">
                    <Gem className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 pointer-events-none" />
                    <select
                      name="specialization"
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 [&:invalid]:text-gray-400"
                      required
                    >
                      <option value="" disabled>
                        Select your specialization
                      </option>
                      {SPECIALIZATIONS.map((s) => (
                        <option key={s} value={s} className="text-gray-900">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </label>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Years of experience
                  </span>
                  <div className="relative mt-1.5">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 pointer-events-none" />
                    <input
                      name="mentorExperience"
                      type="number"
                      min={0}
                      max={60}
                      placeholder="8"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                      required
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">
                    Primary expertise
                  </span>
                  <div className="relative mt-1.5">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 pointer-events-none" />
                    <select
                      name="mentorFocus"
                      defaultValue=""
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 [&:invalid]:text-gray-400"
                      required
                    >
                      <option value="" disabled>
                        Select your focus area
                      </option>
                      {MENTOR_FOCUS.map((s) => (
                        <option key={s} value={s} className="text-gray-900">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm font-medium text-gray-700">
                  Password
                </span>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                  <input
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Confirm</span>
                <div className="relative mt-1.5">
                  <RefreshCw className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400" />
                  <input
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              </label>
            </div>
          </div>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600 leading-snug">
              I agree to the{" "}
              <a
                href="#"
                className="font-medium text-blue-700 hover:text-blue-800 underline-offset-2 hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="font-medium text-blue-700 hover:text-blue-800 underline-offset-2 hover:underline"
              >
                Privacy Policy
              </a>
              .
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 via-violet-500 to-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-violet-600 hover:to-blue-700 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
          >
            Register Now
            <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
