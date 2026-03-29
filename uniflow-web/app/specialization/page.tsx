<<<<<<< HEAD
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
import {
  getSpecializationSlugForKey,
  type SpecializationKey,
} from "@/lib/specializationRolesContent";

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
            <span className="text-lg sm:text-xl">UniFlow</span>
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
          Selecting a specialization allows UniFlow to tailor your learning
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
              <Link
                key={s.key}
                href={`/specializations/${getSpecializationSlugForKey(s.key)}`}
                onClick={() => setSelected(s.key)}
                className={cn(
                  "group block text-left rounded-[18px] border p-6 shadow-sm transition",
                  borderClass,
                  itemBg
                )}
                aria-current={active ? "true" : undefined}
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
              </Link>
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
                router.push(
                  `/specializations/${getSpecializationSlugForKey(selected)}`
                );
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
          <div>© 2024 UniFlow. Empowering the next generation of tech leaders.</div>
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

=======
import Link from "next/link";

const specializations = [
  { id: "se", slug: "software-engineering", label: "Software Engineering", subtitle: "Design and build scalable, robust software systems and applications.", color: "from-[#EEF2FF] to-[#F8F9FF]", icon: "💻" },
  { id: "im", slug: "information-management", label: "Information Management", subtitle: "Master the art of organizing and leveraging data for business intelligence.", color: "from-[#F4F0FF] to-[#FAF7FF]", icon: "🗄️" },
  { id: "ds", slug: "data-science", label: "Data Science", subtitle: "Extract meaningful insights from complex data sets using ML & AI.", color: "from-[#F6F4FF] to-[#FBF9FF]", icon: "📊" },
  { id: "cs", label: "Computer Science", subtitle: "Deep dive into computing theory, algorithms, and complex logic.", color: "from-[#F4F7FF] to-[#FAFBFF]", icon: "🧠" },
  { id: "csn", label: "CS & Networking", subtitle: "Architect and maintain the infrastructure that connects the world.", color: "from-[#FDF6FF] to-[#FEFBFF]", icon: "🌐" },
  { id: "it", label: "Info Technology", subtitle: "Support and implement technology solutions for enterprise success.", color: "from-[#FFF5F9] to-[#FFFBFE]", icon: "🛠️" },
  { id: "ise", label: "Systems Engineering", subtitle: "Integrate complex hardware and software systems seamlessly.", color: "from-[#F5F7FF] to-[#FBFCFF]", icon: "⚙️" },
  { id: "cyber", label: "Cyber Security", subtitle: "Protect critical assets and data from modern digital threats.", color: "from-[#F1F8FF] to-[#F8FBFF]", icon: "🛡️" },
];

export default function SpecializationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F9FAFF] via-[#F3F5FF] to-[#EEF2FF] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <header className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#4747EB] text-white font-bold">U</div>
              <div className="text-xl font-extrabold text-slate-900">FuturePath Hub</div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
              <Link href="/specialization" className="text-[#4F46E5]">Specializations</Link>
              <Link href="/mentors">Mentors</Link>
              <Link href="/roadmaps">Roadmaps</Link>
              <Link href="/community">Community</Link>
            </nav>
            <div className="flex items-center gap-3">
              <input type="text" placeholder="Search roles..." className="hidden md:block w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#4F46E5] focus:outline-none" />
              <button className="rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338ca]">Sign In</button>
              <div className="rounded-full border border-slate-300 p-2">👤</div>
            </div>
          </div>
        </header>

        <section className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Shape Your Future: <span className="text-[#4747EB]">Choose a Specialization</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-slate-600">
            Selecting a specialization allows FuturePath Hub to tailor your learning resources, connect you with specialized mentors, and highlight the most relevant career opportunities in the tech industry.
          </p>
        </section>

        <div className="border-t border-slate-200 pt-6 mb-8">
          <div className="flex justify-center flex-wrap gap-3 text-xs md:text-sm font-semibold text-slate-500">
            <button className="px-3 py-2 rounded-sm bg-[#4747EB] text-white">SE</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">IM</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">DS</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">CS</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">CSNE</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">IT</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">ISE</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">CYBER</button>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
          {specializations.map((item, index) => (
            <Link
              key={item.id}
              href={`/specializations/${item.slug}`}
              className={`rounded-3xl border border-slate-100 bg-white shadow-md hover:shadow-xl transition-all duration-200 p-6 ${index === 0 ? "ring-2 ring-[#4747EB]" : ""}`}
            >
              <div className="mb-3">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#EEF2FF] text-[#4747EB] text-xl">{item.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{item.label}</h3>
              <p className="text-sm text-slate-600">{item.subtitle}</p>
            </Link>
          ))}
        </section>

        <section className="rounded-3xl border border-[#D8DBFF] bg-[#F4F6FF] p-6 md:p-8">
          <p className="text-slate-700 text-sm md:text-base">
            Picking the right specialization is the first step in mapping your unique journey. Our mentors are ready to guide you through these industry-standard paths to ensure you reach your career goals. Your curriculum and networking opportunities will adapt based on this choice.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#" className="rounded-full bg-gradient-to-r from-[#4747EB] to-[#7B67D1] px-6 py-2 text-white font-semibold">Confirm Selection</Link>
            <Link href="#" className="rounded-full border border-slate-300 bg-white px-6 py-2 text-slate-700 font-semibold">Explore Paths First</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
>>>>>>> 081a5c79fc96e95a9a2b2fafb298c85dc27a80b3
