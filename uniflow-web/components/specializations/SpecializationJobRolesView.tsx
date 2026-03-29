"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  MessageCircle,
  Search,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { JOB_ROLE_ICONS } from "@/lib/jobRoleIcons";
import type {
  JobRoleDef,
  RoleLevel,
  SpecializationRolesPageDef,
} from "@/lib/specializationRolesContent";

type SortOption = "popular" | "title" | "level";

const LEVEL_ORDER: Record<RoleLevel, number> = {
  "Entry Level": 0,
  Intermediate: 1,
  Senior: 2,
};

function RoleCard({ role }: { role: JobRoleDef }) {
  const Icon = JOB_ROLE_ICONS[role.iconKey];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-xl",
          role.iconBg,
          role.iconFg
        )}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <h3 className="mt-4 text-[15px] font-bold leading-snug text-slate-900">
        {role.title}
      </h3>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-slate-600">
        {role.description}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2">
        <span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-violet-900">
          {role.level}
        </span>
        <Link
          href="/networking/mentors"
          className="inline-flex items-center gap-0.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
        >
          View Mentors
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
        </Link>
      </div>
    </article>
  );
}

type Props = {
  data: SpecializationRolesPageDef;
};

export function SpecializationJobRolesView({ data }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("popular");
  const [levelFilter, setLevelFilter] = useState<RoleLevel | "all">("all");

  const filteredRoles = useMemo(() => {
    let list = [...data.roles];

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q)
      );
    }

    if (levelFilter !== "all") {
      list = list.filter((r) => r.level === levelFilter);
    }

    if (sort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "level") {
      list.sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
    }

    return list;
  }, [data.roles, query, sort, levelFilter]);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 font-extrabold text-indigo-950"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-sm text-white shadow-sm">
              FP
            </span>
            <span className="hidden text-lg sm:inline">FuturePath Hub</span>
          </Link>

          <nav
            className="mx-auto hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex"
            aria-label="Primary"
          >
            <Link
              href="/specialization"
              className="relative text-indigo-700 after:absolute after:left-0 after:top-[1.35rem] after:h-0.5 after:w-full after:rounded-full after:bg-indigo-600"
            >
              Specializations
            </Link>
            <Link href="/networking/mentors" className="hover:text-indigo-700">
              Mentors
            </Link>
            <Link href="/networking" className="hover:text-indigo-700">
              Roadmaps
            </Link>
            <Link href="/networking" className="hover:text-indigo-700">
              Community
            </Link>
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
            <div className="relative hidden max-w-[220px] flex-1 md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Search roles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 outline-none ring-indigo-500/20 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2"
              />
            </div>
            <Link
              href="/login"
              className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 sm:px-5 sm:text-sm"
            >
              Sign In
            </Link>
            <button
              type="button"
              aria-label="Profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm"
            >
              <UserRound className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <nav className="text-xs font-semibold text-slate-500">
          <Link href="/specialization" className="hover:text-indigo-600">
            Specializations
          </Link>
          <span className="mx-1.5 text-slate-400">&gt;</span>
          <span className="text-slate-800">{data.breadcrumbLabel}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              {data.pageTitle}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              {data.subtitle}
            </p>
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center gap-3">
            <label className="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="pl-1 text-xs font-semibold text-slate-500">
                Level:
              </span>
              <select
                value={levelFilter}
                onChange={(e) =>
                  setLevelFilter(e.target.value as RoleLevel | "all")
                }
                className="appearance-none bg-transparent py-1 pr-7 text-sm font-semibold text-slate-800 outline-none"
              >
                <option value="all">All</option>
                <option value="Entry Level">Entry</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Senior">Senior</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>

            <label className="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <span className="sr-only">Sort</span>
              <span className="pl-1 text-xs font-semibold text-slate-500">
                Sort:
              </span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="appearance-none bg-transparent py-1 pr-7 text-sm font-semibold text-slate-800 outline-none"
              >
                <option value="popular">Popular</option>
                <option value="title">Title (A–Z)</option>
                <option value="level">Level</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </label>
          </div>
        </div>

        <div className="relative mt-6 md:hidden">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search roles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {filteredRoles.map((role) => (
            <RoleCard key={role.title} role={role} />
          ))}
        </section>

        {filteredRoles.length === 0 && (
          <p className="mt-12 text-center text-sm text-slate-500">
            No roles match your search. Try a different keyword or filter.
          </p>
        )}

        <div className="mt-14 rounded-2xl border border-violet-100 bg-violet-50/60 px-6 py-10 text-center sm:px-10">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Didn&apos;t find what you were looking for?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">
            Picking the right role helps us recommend mentors, projects, and
            learning modules that match how you want to grow. You can change this
            later as your interests evolve.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/networking/mentors")}
              className="w-full rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 hover:bg-indigo-700 sm:w-auto"
            >
              Request New Role
            </button>
            <button
              type="button"
              onClick={() => router.push("/specialization")}
              className="w-full rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 sm:w-auto"
            >
              Explore Other Specializations
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        © 2024 FuturePath Hub. Empowering the next generation of tech leaders.
      </footer>

      <button
        type="button"
        aria-label="Open chat"
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-500/35 transition hover:bg-indigo-700"
      >
        <MessageCircle className="h-7 w-7" strokeWidth={2} />
      </button>
    </div>
  );
}
