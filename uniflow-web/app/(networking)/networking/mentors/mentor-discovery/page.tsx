"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createMentorshipRequest,
  getMyRoleProfile,
  listMentorProfiles,
  listMyStudentRequests,
  recommendMentors,
} from "@/services/mentorship";
import { MentorProfile } from "@/models/mentorship";

type StudentRequestWithMentor = {
  id: string;
  mentor_id: string;
  status: "pending" | "accepted" | "rejected";
};

function getAvailabilityText(availability: Record<string, unknown>) {
  return Object.values(availability || {}).join(" ") || "Flexible";
}

function getMentorRoleLabel(mentor: MentorProfile) {
  const withLegacyRole = mentor as MentorProfile & { role?: string | null };
  return mentor.current_role || withLegacyRole.role || "Mentor";
}

export default function MentorDiscoveryPage() {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [studentSkills, setStudentSkills] = useState<string[]>([]);
  const [learningGoals, setLearningGoals] = useState("");
  const [studentRequests, setStudentRequests] = useState<StudentRequestWithMentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All Expertise");
  const [availability, setAvailability] = useState("Any Availability");
  const [sessionMode, setSessionMode] = useState("Any Mode");
  const [minRating, setMinRating] = useState("Any Rating");
  const [sortBy, setSortBy] = useState("Top Rated");
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [mentorRows, profileResult, requestRowsResult] = await Promise.all([
          listMentorProfiles(),
          getMyRoleProfile().catch(() => null),
          listMyStudentRequests().catch(() => []),
        ]);

        setMentors(mentorRows);
        setStudentSkills(profileResult?.student?.skills || []);
        setLearningGoals(profileResult?.student?.learning_goals || "");
        setStudentRequests(
          (requestRowsResult as StudentRequestWithMentor[]).map((request) => ({
            id: request.id,
            mentor_id: request.mentor_id,
            status: request.status,
          })),
        );
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Could not load mentors right now.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const featuredMentor = useMemo(() => {
    if (mentors.length === 0) return null;
    const ranked = recommendMentors({
      studentSkills,
      learningGoals,
      mentors,
    });
    return ranked[0] || null;
  }, [learningGoals, mentors, studentSkills]);

  const availableExpertise = useMemo(() => {
    const unique = new Set<string>();
    mentors.forEach((mentor) => {
      mentor.expertise.forEach((item) => unique.add(item));
    });
    return ["All Expertise", ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    const ratingThreshold = (() => {
      if (minRating === "Any Rating") return 0;
      if (minRating === "Rating (4.8+)") return 4.8;
      if (minRating === "Rating (4.5+)") return 4.5;
      if (minRating === "Rating (4.0+)") return 4.0;
      return 0;
    })();

    const matchesSubject = (mentor: MentorProfile) => {
      if (subject === "All Expertise") return true;
      return mentor.expertise.some((item) => item.toLowerCase() === subject.toLowerCase());
    };

    const matchesAvailability = (mentor: MentorProfile) => {
      if (availability === "Any Availability") return true;
      return getAvailabilityText(mentor.availability)
        .toLowerCase()
        .includes(availability.toLowerCase());
    };

    const matchesSessionMode = (mentor: MentorProfile) => {
      if (sessionMode === "Any Mode") return true;
      return (mentor.session_mode || "").toLowerCase() === sessionMode.toLowerCase();
    };

    const matchesQuery = (mentor: MentorProfile) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        mentor.full_name.toLowerCase().includes(q) ||
        mentor.expertise.join(" ").toLowerCase().includes(q) ||
        (mentor.bio || "").toLowerCase().includes(q) ||
        mentor.mentoring_topics.join(" ").toLowerCase().includes(q) ||
        getAvailabilityText(mentor.availability).toLowerCase().includes(q)
      );
    };

    const filtered = mentors.filter((mentor) => {
      // New mentors usually start with rating 0 and no sessions.
      // Keep them discoverable in the card grid so students can still book them.
      const isNewMentor = mentor.total_sessions === 0;
      const passesRating = isNewMentor || mentor.rating >= ratingThreshold;
      return (
        passesRating &&
        matchesSubject(mentor) &&
        matchesAvailability(mentor) &&
        matchesSessionMode(mentor) &&
        matchesQuery(mentor)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Name A-Z":
          return a.full_name.localeCompare(b.full_name);
        case "Most Sessions":
          return b.total_sessions - a.total_sessions;
        case "Top Rated":
        default:
          return b.rating - a.rating;
      }
    });

    return sorted;
  }, [availability, mentors, minRating, search, sessionMode, sortBy, subject]);

  const handleReset = () => {
    setSearch("");
    setSubject("All Expertise");
    setAvailability("Any Availability");
    setSessionMode("Any Mode");
    setMinRating("Any Rating");
    setSortBy("Top Rated");
  };

  const requestByMentor = useMemo(() => {
    const map = new Map<string, StudentRequestWithMentor>();
    studentRequests.forEach((request) => {
      map.set(request.mentor_id, request);
    });
    return map;
  }, [studentRequests]);

  const handleRequestMentor = async (mentorId: string) => {
    try {
      const created = await createMentorshipRequest(mentorId);
      setStudentRequests((prev) => {
        const next = prev.filter((request) => request.mentor_id !== mentorId);
        next.unshift({
          id: created.id,
          mentor_id: created.mentor_id,
          status: created.status,
        });
        return next;
      });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Could not send mentorship request.";
      setError(message);
    }
  };

  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-slate-700 bg-slate-900/40 p-6 shadow-sm backdrop-blur-sm sm:p-7">
        <h1 className="text-5xl font-black tracking-tight text-slate-50">Find your guide.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Connect with industry experts and academic leaders for personalized 1-on-1 mentorship.
        </p>

        <div className="mt-5 grid grid-cols-12 gap-2 rounded-xl border border-slate-700 bg-slate-900/40 p-2">
          <input
            type="search"
            placeholder="Search by name, expertise, topics or availability"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="col-span-12 h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-4 text-sm text-slate-50 placeholder-slate-500 outline-none ring-teal-500/50 transition focus:border-teal-500 focus:ring-2 lg:col-span-4"
          />
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="col-span-6 h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 transition focus:border-teal-500 focus:ring-2 lg:col-span-2"
          >
            {availableExpertise.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select
            value={availability}
            onChange={(event) => setAvailability(event.target.value)}
            className="col-span-6 h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 transition focus:border-teal-500 focus:ring-2 lg:col-span-2"
          >
            <option>Any Availability</option>
            <option>Weekdays</option>
            <option>Weekends</option>
            <option>Evenings</option>
            <option>Mornings</option>
          </select>
          <select
            value={sessionMode}
            onChange={(event) => setSessionMode(event.target.value)}
            className="col-span-6 h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 transition focus:border-teal-500 focus:ring-2 lg:col-span-2"
          >
            <option>Any Mode</option>
            <option>online</option>
            <option>in-person</option>
            <option>hybrid</option>
          </select>
          <select
            value={minRating}
            onChange={(event) => setMinRating(event.target.value)}
            className="col-span-6 h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 transition focus:border-teal-500 focus:ring-2 lg:col-span-2"
          >
            <option>Any Rating</option>
            <option>Rating (4.0+)</option>
            <option>Rating (4.5+)</option>
            <option>Rating (4.8+)</option>
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="col-span-6 h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 transition focus:border-teal-500 focus:ring-2 lg:col-span-2"
          >
            <option>Top Rated</option>
            <option>Most Sessions</option>
            <option>Name A-Z</option>
          </select>
          <button
            type="button"
            onClick={handleReset}
            className="col-span-6 h-11 rounded-lg bg-teal-700 text-sm font-semibold text-white transition hover:bg-teal-800 lg:col-span-2"
          >
            Reset Filters
          </button>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(130deg,#1d4ed8_0%,#2563eb_45%,#3b82f6_100%)] p-6 text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)]">
        <div className="pointer-events-none absolute right-10 top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="inline-flex rounded-full bg-blue-400/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100">
              Smart Match AI
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight">
              We ranked mentors based on your skills and learning goals.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-blue-100/90">
              This lightweight matching score combines your declared student skills, learning goals, mentor expertise, and mentoring topics.
            </p>
          </div>

          <article className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/15 text-xs font-semibold">
                MATCH
              </div>
              <div>
                <h3 className="text-xl font-bold">{featuredMentor?.full_name || "Awaiting profile setup"}</h3>
                <p className="text-xs text-blue-100">{featuredMentor?.expertise.join(", ") || "Complete your student profile for stronger matches"}</p>
                <p className="mt-1 text-xs text-blue-100/90">* {featuredMentor ? featuredMentor.rating.toFixed(1) : "-"}</p>
              </div>
            </div>
            {featuredMentor ? (
              <button
                type="button"
                onClick={() => void handleRequestMentor(featuredMentor.id)}
                className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-emerald-300 text-sm font-semibold text-slate-900 transition hover:bg-emerald-200"
              >
                Request Mentorship
              </button>
            ) : null}
          </article>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight text-slate-50">Top Mentors for You</h2>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center text-sm text-slate-400">
              Loading mentors...
            </div>
          ) : filteredMentors.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center text-sm text-slate-400">
              No mentors match these filters yet. Try adjusting the search or filters.
            </div>
          ) : (
            filteredMentors.map((mentor) => {
              const request = requestByMentor.get(mentor.id);
              return (
                <article key={mentor.id} className="group relative overflow-hidden rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#00d2b4]/20 hover:shadow-[0_12px_28px_rgba(0,210,180,0.12)]">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold leading-tight text-[#f0f4fb]">{mentor.full_name}</h3>
                      <p className="mt-1 text-xs text-[rgba(168,184,208,0.85)]">{getMentorRoleLabel(mentor)}{mentor.company ? `, ${mentor.company}` : ""}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#00d2b4]">* {mentor.rating.toFixed(1)}</p>
                      <p className="text-[11px] font-medium text-[rgba(168,184,208,0.85)]">{mentor.total_sessions} sessions</p>
                    </div>
                  </div>

                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-[rgba(232,238,248,0.88)]">{mentor.bio || "Experienced mentor ready to support your learning goals."}</p>

                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {mentor.expertise.slice(0, 3).map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded bg-white/5 px-2 py-1 text-[10px] font-semibold text-[#00d2b4]"
                      >
                        #{highlight.replace(/\s+/g, "")}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedMentor(mentor)}
                      className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm font-semibold text-[var(--brand-dark-text)] transition hover:bg-white/8"
                    >
                      Profile
                    </button>
                    <button
                      type="button"
                      disabled={Boolean(request && request.status !== "rejected")}
                      onClick={() => void handleRequestMentor(mentor.id)}
                      className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {!request
                        ? "Request Mentorship"
                        : request.status === "pending"
                          ? "Pending"
                          : request.status === "accepted"
                            ? "Accepted"
                            : "Request Again"}
                    </button>
                  </div>

                  <p className="mt-3 text-xs text-[rgba(168,184,208,0.85)]">{getAvailabilityText(mentor.availability)} {mentor.session_mode ? `| ${mentor.session_mode}` : ""}</p>
                </article>
              );
            })
          )}
        </div>
      </section>

      {selectedMentor ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 px-4 py-6">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900/40 shadow-2xl backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setSelectedMentor(null)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 transition hover:bg-slate-700"
              aria-label="Close"
            >
              x
            </button>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800/70 text-xs font-semibold ring-2 ring-slate-700">
                    MENTOR
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile</p>
                    <h3 className="text-2xl font-black text-slate-50">{selectedMentor.full_name}</h3>
                    <p className="text-sm text-slate-400">{getMentorRoleLabel(selectedMentor)}{selectedMentor.company ? `, ${selectedMentor.company}` : ""}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-2 py-1 text-teal-300">
                        * {selectedMentor.rating.toFixed(1)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/50 px-2 py-1">
                        {selectedMentor.total_sessions} sessions
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-300">{selectedMentor.bio || "No bio provided yet."}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedMentor.mentoring_topics.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-teal-500/20 px-3 py-1 text-[11px] font-semibold text-teal-300"
                    >
                      #{tag.replace(/\s+/g, "")}
                    </span>
                  ))}
                  {selectedMentor.expertise.map((item) => (
                    <span
                      key={item}
                      className="rounded-full bg-slate-800/50 px-3 py-1 text-[11px] font-semibold text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</p>
                  <p className="text-sm font-semibold text-slate-50">{getAvailabilityText(selectedMentor.availability)}</p>
                  <p className="text-xs text-slate-400">Mode: {selectedMentor.session_mode || "Not specified"}</p>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => void handleRequestMentor(selectedMentor.id)}
                    disabled={Boolean(requestByMentor.get(selectedMentor.id) && requestByMentor.get(selectedMentor.id)?.status !== "rejected")}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                  >
                    {(() => {
                      const request = requestByMentor.get(selectedMentor.id);
                      if (!request) return "Request Mentorship";
                      if (request.status === "pending") return "Request Pending";
                      if (request.status === "accepted") return "Accepted";
                      return "Request Again";
                    })()}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMentor(null)}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
