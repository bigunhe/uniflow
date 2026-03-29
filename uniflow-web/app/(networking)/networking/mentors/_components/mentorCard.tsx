"use client";

import { Briefcase, Clock3, MessageCircle, Star } from "lucide-react";

type MentorRow = Record<string, unknown>;

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function parseBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return null;
}

function safeString(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim()) return value;
  return fallback;
}

function initialsFromName(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + second).toUpperCase() || "M";
}

function normalizeTags(tagsRaw: unknown): string[] {
  if (Array.isArray(tagsRaw)) {
    return tagsRaw
      .map((t) => (typeof t === "string" ? t.trim() : ""))
      .filter(Boolean)
      .slice(0, 8);
  }
  if (typeof tagsRaw === "string") {
    return tagsRaw
      .split(/[,\|]/g)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 8);
  }
  return [];
}

function getCompany(mentor: MentorRow) {
  const raw =
    mentor.company ??
    mentor.top_company ??
    mentor.employer ??
    mentor.current_company;
  return typeof raw === "string" && raw.trim() ? raw : null;
}

function getYears(mentor: MentorRow) {
  return parseNumber(
    mentor.years_experience ?? mentor.yearsExp ?? mentor.experience_years,
  );
}

function getSessions(mentor: MentorRow) {
  return parseNumber(mentor.sessions ?? mentor.session_count ?? mentor.meetings);
}

function getRating(mentor: MentorRow) {
  return parseNumber(mentor.rating ?? mentor.score);
}

function getTitle(mentor: MentorRow) {
  const raw =
    mentor.title ??
    mentor.role ??
    mentor.position ??
    (mentor.experience_title ? String(mentor.experience_title) : "");
  return typeof raw === "string" && raw.trim() ? raw : null;
}

function getAvailabilityThisWeek(mentor: MentorRow) {
  const raw =
    mentor.available_this_week ??
    mentor.availability_this_week ??
    mentor.available ??
    mentor.is_available;

  // Prefer boolean-like fields. If they are missing, we treat as unknown.
  return parseBoolean(raw);
}

function getTags(mentor: MentorRow) {
  const candidates = [
    mentor.tags,
    mentor.skills,
    mentor.areas,
    mentor.expertise,
    mentor.specializations,
    mentor.specialty,
  ];
  const tags = normalizeTags(
    candidates.find((c) => Array.isArray(c) || typeof c === "string")
  );
  return tags;
}

export default function MentorCard({
  mentor,
  onChat,
}: {
  mentor: MentorRow;
  onChat: (mentorId: string) => void;
}) {
  const id = String(mentor.id ?? mentor.mentor_id ?? mentor.name ?? "mentor");
  const name = safeString(mentor.name ?? mentor.full_name, "Unnamed mentor");
  const company = getCompany(mentor);
  const years = getYears(mentor);
  const sessions = getSessions(mentor);
  const rating = getRating(mentor);
  const title = getTitle(mentor);
  const initials = initialsFromName(name);
  const tags = getTags(mentor);
  const available = getAvailabilityThisWeek(mentor);

  return (
    <article
      role="button"
      tabIndex={0}
      className="cursor-pointer rounded-[22px] border border-gray-100 bg-white p-6 shadow-[0_18px_50px_-25px_rgba(79,70,229,0.25)] hover:shadow-[0_25px_70px_-35px_rgba(79,70,229,0.35)] transition"
      onClick={() => onChat(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onChat(id);
      }}
      aria-label={`Open messages with ${name}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-600/90 to-violet-600/90 ring-1 ring-white/40 flex items-center justify-center">
            <span className="text-sm sm:text-base font-bold text-white">
              {initials}
            </span>
          </div>

          <div className="min-w-0">
            <h3 className="text-base font-semibold text-slate-900 truncate">
              {name}
            </h3>
            <p className="text-xs text-slate-500 truncate">{title}</p>
          </div>
        </div>

        {rating != null ? (
          <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 ring-1 ring-amber-100">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-amber-700">
              {rating.toFixed(1)}
            </span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {years != null ? (
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <Clock3 className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">{years}</span>
            <span>years</span>
          </div>
        ) : <div />}

        {sessions != null ? (
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            <span className="font-semibold text-slate-800">{sessions}</span>
            <span>sessions</span>
          </div>
        ) : <div />}

        {available != null ? (
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span
              className={[
                "inline-block h-2 w-2 rounded-full",
                available ? "bg-emerald-500" : "bg-slate-300",
              ].join(" ")}
            />
            <span>{available ? "Available" : "Busy"}</span>
          </div>
        ) : <div />}
      </div>

      {tags.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-100"
            >
              {t}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChat(id);
          }}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-violet-600 hover:to-indigo-700"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
          Chat Now
        </button>
      </div>

      {company ? (
        <div className="mt-3 text-[11px] text-slate-500">
          Based in{" "}
          <span className="font-semibold text-slate-700">{company}</span>
        </div>
      ) : null}
    </article>
  );
}