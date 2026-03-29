"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  Code,
  Cpu,
  Database,
  Monitor,
  Network,
  Shield,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SpecializationKey =
  | "SE"
  | "IM"
  | "DS"
  | "CS"
  | "CSNE"
  | "IT"
  | "ISE"
  | "CYBER";

type Specialization = {
  key: SpecializationKey;
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconFg: string;
};

const SPECIALIZATIONS: Specialization[] = [
  {
    key: "SE",
    title: "Software Engineering",
    description:
      "Design and build scalable, robust software systems and applications.",
    icon: Code,
    iconBg: "bg-indigo-50",
    iconFg: "text-indigo-700",
  },
  {
    key: "IM",
    title: "Information Management",
    description:
      "Master the art of organizing and leveraging data for business intelligence.",
    icon: Database,
    iconBg: "bg-purple-50",
    iconFg: "text-purple-700",
  },
  {
    key: "DS",
    title: "Data Science",
    description:
      "Extract meaningful insights from complex data sets using ML & AI.",
    icon: Brain,
    iconBg: "bg-pink-50",
    iconFg: "text-pink-700",
  },
  {
    key: "CS",
    title: "Computer Science",
    description:
      "Deep dive into computing theory, algorithms, and complex logic.",
    icon: Cpu,
    iconBg: "bg-sky-50",
    iconFg: "text-sky-700",
  },
  {
    key: "CSNE",
    title: "CS & Networking",
    description:
      "Architect and maintain the infrastructure that connects the world.",
    icon: Network,
    iconBg: "bg-emerald-50",
    iconFg: "text-emerald-700",
  },
  {
    key: "IT",
    title: "Info Technology",
    description:
      "Support and implement technology solutions for enterprise success.",
    icon: Monitor,
    iconBg: "bg-teal-50",
    iconFg: "text-teal-700",
  },
  {
    key: "ISE",
    title: "Systems Engineering",
    description:
      "Integrate complex hardware and software systems seamlessly.",
    icon: Settings,
    iconBg: "bg-amber-50",
    iconFg: "text-amber-700",
  },
  {
    key: "CYBER",
    title: "Cyber Security",
    description:
      "Protect critical assets and data from modern digital threats.",
    icon: Shield,
    iconBg: "bg-violet-50",
    iconFg: "text-violet-700",
  },
];

const TAB_ORDER: { key: SpecializationKey; label: string }[] = [
  { key: "SE", label: "SE" },
  { key: "IM", label: "IM" },
  { key: "DS", label: "DS" },
  { key: "CS", label: "CS" },
  { key: "CSNE", label: "CSNE" },
  { key: "IT", label: "IT" },
  { key: "ISE", label: "ISE" },
  { key: "CYBER", label: "CYBER" },
];

export default function SpecializationPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<SpecializationKey>("SE");

  const selectedSpecialization = useMemo(
    () => SPECIALIZATIONS.find((s) => s.key === selected),
    [selected]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3 font-extrabold text-indigo-900"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
              <span className="text-[14px]">FP</span>
            </span>
            <span className="text-lg sm:text-xl">FuturePath Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <Link href="/" className="hover:text-indigo-700">
              Home
            </Link>
            <Link href="/networking/mentors" className="hover:text-indigo-700">
              Mentors
            </Link>
            <Link href="/networking" className="hover:text-indigo-700">
              Resources
            </Link>
            <Link href="/profile-setup" className="hover:text-indigo-700">
              Profile
            </Link>
          </nav>

          <div className="flex items-center">
            <Link
              href="/login"
              className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700"
            >
              Sign Out
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-10 sm:px-6 lg:px-8">
        <h1 className="text-center text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">
          Shape Your Future:{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            Choose a Specialization
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-slate-600 sm:text-base">
          Selecting a specialization allows FuturePath Hub to tailor your learning
          resources, connect you with specialized mentors, and highlight the most
          relevant career opportunities in the tech industry.
        </p>

        <div className="mt-10 flex items-center justify-center gap-6 text-xs font-bold text-slate-500">
          {TAB_ORDER.map((t) => {
            const active = t.key === selected;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelected(t.key)}
                className={cn(
                  "relative px-1 py-1 transition-colors",
                  active ? "text-slate-800" : "hover:text-slate-800"
                )}
                aria-pressed={active}
              >
                <span className="block">{t.label}</span>
                {active && (
                  <span className="absolute left-1/2 top-[26px] h-[3px] w-4 -translate-x-1/2 rounded-full bg-indigo-600" />
                )}
              </button>
            );
          })}
        </div>

        <section className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIALIZATIONS.map((s) => {
            const active = s.key === selected;
            const borderClass = active
              ? "border-indigo-500 ring-2 ring-indigo-500/20"
              : "border-slate-200 hover:border-slate-300";

            const itemBg = active ? "bg-white" : "bg-white";

            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setSelected(s.key)}
                className={cn(
                  "group text-left rounded-[18px] border p-6 shadow-sm transition",
                  borderClass,
                  itemBg
                )}
                aria-pressed={active}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-2xl",
                    s.iconBg,
                    s.iconFg
                  )}
                >
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                  {s.description}
                </p>
              </button>
            );
          })}
        </section>

        <div className="mt-12 rounded-2xl border border-slate-200/70 bg-white/60 p-6 shadow-sm sm:p-8">
          <div className="text-center text-sm text-slate-700">
            Picking the right specialization is the first step in mapping your unique
            journey. Our mentors are ready to guide you through these industry-standard
            paths to ensure you reach your career goals. Your curriculum and networking
            opportunities will adapt based on this choice.
          </div>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                // Continue to mentors selection after picking specialization.
                router.push("/networking/mentors");
              }}
              className="w-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-105 sm:w-auto"
            >
              Confirm Selection →
            </button>
            <button
              type="button"
              onClick={() => router.push("/networking")}
              className="w-full rounded-full bg-white/80 px-8 py-3 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200/80 transition hover:bg-white sm:w-auto"
            >
              Explore Paths First
            </button>
          </div>

          <div className="mt-3 text-center text-xs text-slate-500">
            Selected:{" "}
            <span className="font-semibold text-slate-700">
              {selectedSpecialization?.title}
            </span>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-200/70 bg-white/70 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div>© 2024 FuturePath Hub. Empowering the next generation of tech leaders.</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="#" className="hover:text-indigo-700">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-indigo-700">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-indigo-700">
              Mentor Guidelines
            </Link>
            <Link href="#" className="hover:text-indigo-700">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

