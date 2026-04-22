"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  MessageCircle,
  Search,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MentorCard from "./mentorCard";

type MentorRow = Record<string, unknown>;

const DUMMY_MENTORS: MentorRow[] = [
  {
    id: "alex-rivers",
    name: "Alex Rivers",
    title: "Senior Software Engineer at Google",
    company: "Google",
    rating: 4.9,
    years_experience: 8,
    sessions: 124,
    available_this_week: true,
    tags: ["DISTRIBUTED SYSTEMS", "GO", "KUBERNETES"],
  },
  {
    id: "elena-vance",
    name: "Elena Vance",
    title: "Staff Engineer at Stripe",
    company: "Stripe",
    rating: 5.0,
    years_experience: 12,
    sessions: 256,
    available_this_week: false,
    tags: ["RUBY ON RAILS", "ARCHITECTURE", "TEAM LEAD"],
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    title: "Software Engineer II at Microsoft",
    company: "Microsoft",
    rating: 4.8,
    years_experience: 4,
    sessions: 42,
    available_this_week: false,
    tags: ["REACT", "AZURE", "TESTING"],
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    title: "Engineering Manager at Meta",
    company: "Meta",
    rating: 4.9,
    years_experience: 15,
    sessions: 312,
    available_this_week: true,
    tags: ["LEADERSHIP", "CAREER STRATEGY", "SYSTEM DESIGN"],
  },
] as const;

const EXPERIENCE_BUCKETS = [
  { id: "entry" as const, label: "Entry Level (0-2)", min: 0, max: 2 },
  { id: "senior" as const, label: "Senior (5-10)", min: 5, max: 10 },
  { id: "lead" as const, label: "Lead (10+)", min: 10, max: Infinity },
] as const;

type ExperienceBucket = (typeof EXPERIENCE_BUCKETS)[number]["id"] | "all";

const TOP_COMPANIES = ["Google", "Microsoft", "Meta"] as const;

function parseNumber(value: unknown, fallback: number) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function safeString(value: unknown, fallback = "") {
  if (typeof value === "string") return value;
  return fallback;
}

function parseBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return fallback;
}

function mentorYears(mentor: MentorRow) {
  // Return NaN when missing so bucket filtering can exclude unknowns.
  return parseNumber(
    mentor.years_experience ??
      mentor.yearsExp ??
      mentor.experience_years ??
      mentor.experience,
    NaN
  );
}

function mentorCompany(mentor: MentorRow) {
  return safeString(
    mentor.company ?? mentor.top_company ?? mentor.employer ?? mentor.current_company,
    ""
  );
}

function mentorTags(mentor: MentorRow) {
  const raw =
    mentor.tags ??
    mentor.skills ??
    mentor.expertise ??
    mentor.specializations ??
    mentor.areas;
  if (Array.isArray(raw)) return raw.map((t) => safeString(t)).filter(Boolean);
  if (typeof raw === "string")
    return raw.split(/[,\|]/g).map((s) => s.trim()).filter(Boolean);
  return [];
}

function mentorAvailable(mentor: MentorRow) {
  return (
    parseBoolean(
      mentor.available_this_week ?? mentor.availability_this_week,
      false
    ) ||
    parseBoolean(mentor.available, false) ||
    parseBoolean(mentor.is_available, false)
  );
}

function mentorRating(mentor: MentorRow) {
  return parseNumber(mentor.rating ?? mentor.score, NaN);
}

function mentorSessions(mentor: MentorRow) {
  return parseNumber(mentor.sessions ?? mentor.session_count, NaN);
}

function bucketFromYears(years: number): ExperienceBucket {
  if (!Number.isFinite(years)) return "all";
  const entry = years <= 2;
  if (entry) return "entry";
  if (years >= 10) return "lead";
  if (years >= 5 && years <= 10) return "senior";
  // For the 3-4 range, treat as entry-level in this UI.
  return "entry";
}

function bucketLabel(bucket: Exclude<ExperienceBucket, "all">) {
  return EXPERIENCE_BUCKETS.find((b) => b.id === bucket)?.label ?? bucket;
}

export default function FindMentorsClient({ mentors }: { mentors: MentorRow[] }) {
  const router = useRouter();
  
  const [localMentors, setLocalMentors] = useState<MentorRow[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem('registeredMentors');
    if (stored) {
      try {
        setLocalMentors(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const effectiveMentors = useMemo(() => {
    return [...localMentors, ...(mentors.length ? mentors : DUMMY_MENTORS)];
  }, [localMentors, mentors]);

  const [query, setQuery] = useState("");
  const [experience, setExperience] = useState<ExperienceBucket>("all");
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [onlyAvailableThisWeek, setOnlyAvailableThisWeek] = useState(false);
  const [sortBy, setSortBy] = useState<"relevance" | "rating" | "sessions">(
    "relevance"
  );

  const [visibleCount, setVisibleCount] = useState(4);
  const mentorIdToSlug = useMemo(() => {
    // Maps mentor IDs (or names) to a stable string for messages routes.
    // If your Supabase row has an `id`, we prefer it; otherwise we fallback to the name.
    const map = new Map<string, string>();
    for (const m of effectiveMentors) {
      const id = String(m.id ?? m.mentor_id ?? m.name ?? "");
      const slug = String(m.name ?? m.id ?? "mentor")
        .replace(/\s+/g, "-")
        .replace(/[^a-zA-Z0-9\-]/g, "")
        .toLowerCase();
      if (id) map.set(id, slug);
    }
    return map;
  }, [effectiveMentors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const matchesExperience = (m: MentorRow) => {
      if (experience === "all") return true;
      const years = mentorYears(m);
      if (!Number.isFinite(years)) return false;
      return bucketFromYears(years) === experience;
    };

    const matchesCompanies = (m: MentorRow) => {
      if (selectedCompanies.length === 0) return true;
      const c = mentorCompany(m);
      if (!c) return false;
      return selectedCompanies.some((s) => c.toLowerCase().includes(s.toLowerCase()));
    };

    const matchesAvailability = (m: MentorRow) => {
      if (!onlyAvailableThisWeek) return true;
      // If we can't determine availability from the row, exclude it.
      return mentorAvailable(m);
    };

    const matchesQuery = (m: MentorRow) => {
      if (!q) return true;
      const name = safeString(m.name, "").toLowerCase();
      const company = mentorCompany(m).toLowerCase();
      const tags = mentorTags(m).join(" ").toLowerCase();
      return (
        name.includes(q) ||
        company.includes(q) ||
        tags.includes(q)
      );
    };

    const list = effectiveMentors
      .filter(matchesExperience)
      .filter(matchesCompanies)
      .filter(matchesAvailability)
      .filter(matchesQuery);

    const sorted = [...list].sort((a, b) => {
      const ratingA = mentorRating(a);
      const ratingB = mentorRating(b);
      const sessionsA = mentorSessions(a);
      const sessionsB = mentorSessions(b);

      if (sortBy === "rating") {
        const ratingAOr = Number.isFinite(ratingA) ? ratingA : -Infinity;
        const ratingBOr = Number.isFinite(ratingB) ? ratingB : -Infinity;
        return ratingBOr - ratingAOr;
      }
      if (sortBy === "sessions") {
        const sessionsAOr = Number.isFinite(sessionsA) ? sessionsA : -Infinity;
        const sessionsBOr = Number.isFinite(sessionsB) ? sessionsB : -Infinity;
        return sessionsBOr - sessionsAOr;
      }

      // relevance
      if (Number.isFinite(ratingA) || Number.isFinite(ratingB)) {
        const ratingAOr = Number.isFinite(ratingA) ? ratingA : -Infinity;
        const ratingBOr = Number.isFinite(ratingB) ? ratingB : -Infinity;
        const r = ratingBOr - ratingAOr;
        if (Math.abs(r) > 1e-9) return r;
      }
      if (Number.isFinite(sessionsA) || Number.isFinite(sessionsB)) {
        const sessionsAOr = Number.isFinite(sessionsA) ? sessionsA : -Infinity;
        const sessionsBOr = Number.isFinite(sessionsB) ? sessionsB : -Infinity;
        return sessionsBOr - sessionsAOr;
      }
      return 0;
    });

    return sorted;
  }, [
    effectiveMentors,
    query,
    experience,
    selectedCompanies,
    onlyAvailableThisWeek,
    sortBy,
  ]);

  useEffect(() => {
    setVisibleCount(4);
  }, [query, experience, selectedCompanies, onlyAvailableThisWeek]);

  const activeChips = useMemo(() => {
    const chips: string[] = [];
    if (experience !== "all") chips.push(bucketLabel(experience));
    if (selectedCompanies.length) chips.push(...selectedCompanies);
    if (onlyAvailableThisWeek) chips.push("Available this week");
    if (query.trim()) chips.push(query.trim());
    return chips;
  }, [experience, selectedCompanies, onlyAvailableThisWeek, query]);

  const displayed = filtered.slice(0, visibleCount);

  const title = "Expert Software Engineers";
  const subtitle = `Showing ${filtered.length} mentors ready to guide your career path.`;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/75 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-indigo-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-white/20">
              <span className="text-[14px]">FP</span>
            </span>
            <span className="text-lg sm:text-xl">uniflow</span>
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center">
            <div className="w-full max-w-xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search mentors, skills, or companies..."
                className="w-full rounded-full border border-slate-200 bg-white/70 py-2.5 pl-11 pr-4 text-sm text-slate-800 outline-none ring-indigo-500/0 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/networking/mentors" className="hover:text-indigo-700">Mentors</Link>
            <Link href="/networking" className="hover:text-indigo-700">Resources</Link>
            <Link href="/specialization" className="hover:text-indigo-700">My Path</Link>
            <Link href="/messages" className="hover:text-indigo-700">Messages</Link>
          </nav>

          <div className="flex items-center gap-2">
            <button type="button" className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/70 shadow-sm hover:bg-white">
              <Bell className="h-4 w-4 text-slate-700" />
            </button>
            <div className="h-10 w-10 rounded-full bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
              <Star className="h-4 w-4 text-indigo-700 fill-indigo-600/10" />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6 lg:px-8">
        <div className="text-sm text-slate-500 mb-4">
          <span className="font-semibold text-slate-700">Home</span>
          <span className="px-2">›</span>
          <span className="font-semibold text-slate-700">Mentors</span>
          <span className="px-2">›</span>
          <span className="font-semibold text-indigo-700">Software Engineer</span>
        </div>

        <h1 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
          {subtitle}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {activeChips.length > 0 ? (
            <>
              {activeChips.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                >
                  {c}
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setExperience("all");
                  setSelectedCompanies([]);
                  setOnlyAvailableThisWeek(false);
                }}
                className="ml-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800"
              >
                Clear all
              </button>
            </>
          ) : (
            <div className="text-xs text-slate-500">
              Use filters to refine your mentor matches.
            </div>
          )}
        </div>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6">
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-[20px] bg-white ring-1 ring-slate-200/80 overflow-hidden">
              <div className="p-5">
                <h2 className="text-sm font-extrabold text-slate-900">Filters</h2>

                <div className="mt-6 space-y-6">
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Years of Experience
                    </div>
                    <div className="mt-3 space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="experience"
                          checked={experience === "entry"}
                          onChange={() => setExperience("entry")}
                          className="h-4 w-4"
                        />
                        <span className="text-sm text-slate-700">Entry Level (0-2)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="experience"
                          checked={experience === "senior"}
                          onChange={() => setExperience("senior")}
                          className="h-4 w-4"
                        />
                        <span className="text-sm text-slate-700">Senior (5-10)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="experience"
                          checked={experience === "lead"}
                          onChange={() => setExperience("lead")}
                          className="h-4 w-4"
                        />
                        <span className="text-sm text-slate-700">Lead (10+)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setExperience("all")}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Top Companies
                    </div>
                    <div className="mt-3 space-y-3">
                      {TOP_COMPANIES.map((c) => {
                        const checked = selectedCompanies.includes(c);
                        return (
                          <label key={c} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                setSelectedCompanies((prev) =>
                                  prev.includes(c)
                                    ? prev.filter((x) => x !== c)
                                    : [...prev, c]
                                );
                              }}
                              className="h-4 w-4 accent-indigo-600"
                            />
                            <span className="text-sm text-slate-700">{c}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      Availability
                    </div>
                    <label className="mt-3 flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={onlyAvailableThisWeek}
                        onChange={(e) => setOnlyAvailableThisWeek(e.target.checked)}
                        className="h-4 w-4 accent-emerald-600"
                      />
                      <span className="text-sm text-slate-700">Available this week</span>
                      {onlyAvailableThisWeek && (
                        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                          <Check className="h-3 w-3" />
                          On
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="text-sm font-semibold text-slate-700">
                Showing <span className="font-extrabold text-slate-900">{displayed.length}</span> of{" "}
                <span className="font-extrabold text-slate-900">{filtered.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={cn(
                    "rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700",
                    "outline-none focus:ring-2 focus:ring-indigo-500/20"
                  )}
                >
                  <option value="relevance">Relevance</option>
                  <option value="rating">Rating</option>
                  <option value="sessions">Sessions</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-[20px] bg-white ring-1 ring-slate-200 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 ring-1 ring-indigo-100">
                  <MessageCircle className="h-5 w-5 text-indigo-700" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">
                  No mentors found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Try clearing filters or searching for a different keyword.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayed.map((m) => (
                  <MentorCard
                    key={String(m.id ?? m.name)}
                    mentor={m}
                    onChat={(id) => {
                      const slug = mentorIdToSlug.get(id) ?? String(id).replace(/\s+/g, "-").toLowerCase();
                      router.push(`/messages/${slug}`);
                    }}
                  />
                ))}
              </div>
            )}

            {filtered.length > displayed.length && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((v) => v + 4)}
                  className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-indigo-700 ring-1 ring-indigo-200 hover:bg-indigo-50"
                >
                  View more mentors
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white/60 py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 text-center text-xs text-slate-500 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <div>© 2024 uniflow. Empowering the next generation of tech leaders.</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <Link href="#" className="hover:text-indigo-700">Privacy Policy</Link>
            <Link href="#" className="hover:text-indigo-700">Terms of Service</Link>
            <Link href="#" className="hover:text-indigo-700">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

