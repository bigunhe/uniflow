"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  Briefcase,
  ChevronDown,
  Clock,
  Lock,
  Mail,
  Rocket,
  Star,
  User,
  UserCircle2,
} from "lucide-react";

const SPECIALTIES = [
  "Software Engineering",
  "Data Science & AI",
  "Cybersecurity",
  "Product Management",
  "Cloud & Infrastructure",
  "Design & UX",
  "Business & Strategy",
] as const;

export function MentorRegisterForm() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // After submitting registration, send user to specialization selection.
    router.push("/specialization");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <section className="order-2 lg:order-1">
          <div
            className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-violet-800 ring-1 ring-violet-200/80"
            role="note"
          >
            <Rocket className="h-3.5 w-3.5" strokeWidth={2.25} />
            Shape the future
          </div>

          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
            Empower{" "}
            <span className="text-gray-900">Aspiration</span>.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Ignite Impact.
            </span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-600">
            Join an elite network of industry leaders. Share your journey, guide
            the next generation, and leave a lasting professional legacy.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:max-w-md">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_-12px_rgba(79,70,229,0.2)] ring-1 ring-gray-100">
              <p className="text-2xl font-bold text-indigo-600 sm:text-3xl">
                500+
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Active mentors
              </p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_8px_30px_-12px_rgba(147,51,234,0.15)] ring-1 ring-gray-100">
              <p className="text-2xl font-bold text-violet-600 sm:text-3xl">
                12k
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Lives impacted
              </p>
            </div>
          </div>
        </section>

        <section className="order-1 lg:order-2">
          <div className="rounded-[1.35rem] border border-gray-100 bg-white p-6 shadow-[0_25px_60px_-15px_rgba(79,70,229,0.12)] ring-1 ring-gray-200/60 sm:p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-gray-900">
              Mentor Registration
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Tell us about your professional journey.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div
                className="flex rounded-full bg-gray-100 p-1 ring-1 ring-gray-200/90"
                role="group"
                aria-label="Registration path"
              >
                <button
                  type="button"
                  onClick={() => router.push("/register")}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full py-2.5 text-sm font-semibold text-gray-500 transition-all hover:text-gray-700"
                >
                  <User className="h-4 w-4" />
                  Mentee
                </button>
                <button
                  type="button"
                  aria-current="true"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-gray-200/80"
                >
                  <UserCircle2 className="h-4 w-4" />
                  Mentor
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-5">
                <label className="block sm:col-span-1">
                  <span className="text-sm font-medium text-gray-800">
                    Full Name
                  </span>
                  <div className="relative mt-1.5">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <input
                      name="fullName"
                      type="text"
                      autoComplete="name"
                      placeholder="John Doe"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-[#F3F4F6] py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-1">
                  <span className="text-sm font-medium text-gray-800">
                    Email Address
                  </span>
                  <div className="relative mt-1.5">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="john@example.com"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-[#F3F4F6] py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-1">
                  <span className="text-sm font-medium text-gray-800">
                    Company/Organization
                  </span>
                  <div className="relative mt-1.5">
                    <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <input
                      name="company"
                      type="text"
                      autoComplete="organization"
                      placeholder="FutureTech Inc."
                      required
                      className="w-full rounded-xl border border-gray-200 bg-[#F3F4F6] py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-1">
                  <span className="text-sm font-medium text-gray-800">
                    Job Title
                  </span>
                  <div className="relative mt-1.5">
                    <Briefcase className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <input
                      name="jobTitle"
                      type="text"
                      autoComplete="organization-title"
                      placeholder="Senior Product Lead"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-[#F3F4F6] py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-1">
                  <span className="text-sm font-medium text-gray-800">
                    Years of Experience
                  </span>
                  <div className="relative mt-1.5">
                    <Clock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <input
                      name="yearsExperience"
                      type="number"
                      min={0}
                      max={60}
                      placeholder="8"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-[#F3F4F6] py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-1">
                  <span className="text-sm font-medium text-gray-800">
                    Primary Area of Expertise
                  </span>
                  <div className="relative mt-1.5">
                    <Star className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <select
                      name="expertise"
                      defaultValue=""
                      required
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-[#F3F4F6] py-3 pl-11 pr-10 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 [&:invalid]:text-gray-400"
                    >
                      <option value="" disabled>
                        Select Specialty
                      </option>
                      {SPECIALTIES.map((s) => (
                        <option key={s} value={s} className="text-gray-900">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                </label>

                <label className="block sm:col-span-1">
                  <span className="text-sm font-medium text-gray-800">
                    Password
                  </span>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-[#F3F4F6] py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-1">
                  <span className="text-sm font-medium text-gray-800">
                    Confirm Password
                  </span>
                  <div className="relative mt-1.5">
                    <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                    <input
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-[#F3F4F6] py-3 pl-11 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-700 hover:to-violet-700"
              >
                Become a Mentor
                <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
              </button>

              <p className="text-center text-xs leading-relaxed text-gray-500">
                By joining, you agree to our{" "}
                <Link
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Mentor Guidelines
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Terms of Service
                </Link>
                .
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
