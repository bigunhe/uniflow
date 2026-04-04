"use client";

import { useMemo, useState } from "react";
import MentorCard from "../_components/mentorCard";
import { MentorProfile, mentorProfiles } from "../_components/mentorData";
import RequestGuidanceButton from "../_components/RequestGuidanceButton";

export default function MentorDiscoveryPage() {
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("Subject");
  const [minRating, setMinRating] = useState("Rating (4.0+)");
  const [sortBy, setSortBy] = useState("Top Rated");
  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);

  const featuredMentor = mentorProfiles[0];

  const filteredMentors = useMemo(() => {
    const ratingThreshold = (() => {
      if (minRating === "Rating (4.8+)") return 4.8;
      if (minRating === "Rating (4.5+)") return 4.5;
      if (minRating === "Rating (4.0+)") return 4.0;
      return 0;
    })();

    const matchesSubject = (expertise: string) => {
      if (subject === "Subject") return true;
      return expertise.toLowerCase().includes(subject.toLowerCase());
    };

    const matchesQuery = (mentor: (typeof mentorProfiles)[number]) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        mentor.name.toLowerCase().includes(q) ||
        mentor.expertise.toLowerCase().includes(q) ||
        mentor.bio.toLowerCase().includes(q) ||
        mentor.languages.some((lang) => lang.toLowerCase().includes(q)) ||
        mentor.highlights.some((item) => item.toLowerCase().includes(q))
      );
    };

    const filtered = mentorProfiles.filter((mentor) => {
      const passesRating = mentor.rating >= ratingThreshold;
      return passesRating && matchesSubject(mentor.expertise) && matchesQuery(mentor);
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "Most Reviews":
          return b.reviews - a.reviews;
        case "Lowest Price":
          return a.ratePerHour - b.ratePerHour;
        case "Highest Price":
          return b.ratePerHour - a.ratePerHour;
        case "Name A-Z":
          return a.name.localeCompare(b.name);
        case "Top Rated":
        default:
          return b.rating - a.rating;
      }
    });

    return sorted;
  }, [minRating, search, sortBy, subject]);

  const handleReset = () => {
    setSearch("");
    setSubject("Subject");
    setMinRating("Rating (4.0+)");
    setSortBy("Top Rated");
  };

  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-6 shadow-sm sm:p-7">
        <h1 className="text-5xl font-black tracking-tight text-slate-50">Find your guide.</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Connect with industry experts and academic leaders for personalized 1-on-1 mentorship.
        </p>

        <div className="mt-5 grid grid-cols-12 gap-2 rounded-xl border border-slate-700 bg-slate-900/40 p-2">
          <input
            type="search"
            placeholder="Search by name, expertise or university"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="col-span-12 h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-4 text-sm text-slate-50 placeholder-slate-500 outline-none ring-teal-500/50 transition focus:border-teal-500 focus:ring-2 lg:col-span-4"
          />
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            className="col-span-6 h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 transition focus:border-teal-500 focus:ring-2 lg:col-span-2"
          >
            <option>Subject</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>UX Design</option>
            <option>Data Structures</option>
            <option>Product Design</option>
          </select>
          <select
            value={minRating}
            onChange={(event) => setMinRating(event.target.value)}
            className="col-span-6 h-11 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-teal-500/50 transition focus:border-teal-500 focus:ring-2 lg:col-span-2"
          >
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
            <option>Most Reviews</option>
            <option>Lowest Price</option>
            <option>Highest Price</option>
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
              Based on your recent interest in Neural Networks, we found your perfect mentor.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-blue-100/90">
              We analyzed your recent activity and identified the top expert to help you master deep learning architectures faster.
            </p>
          </div>

          <article className="rounded-2xl border border-white/25 bg-white/10 p-4 backdrop-blur">
            <div className="flex items-start gap-3">
              <img
                src={featuredMentor.image}
                alt={featuredMentor.name}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div>
                <h3 className="text-xl font-bold">{featuredMentor.name}</h3>
                <p className="text-xs text-blue-100">{featuredMentor.expertise}</p>
                <p className="mt-1 text-xs text-blue-100/90">★ {featuredMentor.rating.toFixed(1)} ({featuredMentor.reviews} reviews)</p>
              </div>
            </div>
            <button type="button" className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-emerald-300 text-sm font-semibold text-slate-900 transition hover:bg-emerald-200">
              Book Instant Session
            </button>
          </article>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tight text-slate-50">Top Mentors for You</h2>
          <div className="flex items-center gap-2">
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-teal-500/20 text-teal-300">▦</button>
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 text-slate-400">☰</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMentors.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center text-sm text-slate-400">
              No mentors match these filters yet. Try adjusting the search or filters.
            </div>
          ) : (
            filteredMentors.map((mentor, index) => (
              <MentorCard key={`${mentor.slug}-${index}`} mentor={mentor} onProfileClick={setSelectedMentor} />
            ))
          )}
        </div>
      </section>

      {selectedMentor ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 px-4 py-6">
          <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedMentor(null)}
              className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 text-slate-400 transition hover:bg-slate-700"
              aria-label="Close"
            >
              ×
            </button>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <div className="flex items-start gap-4">
                  <img
                    src={selectedMentor.image}
                    alt={selectedMentor.name}
                    className="h-20 w-20 rounded-2xl object-cover ring-2 ring-slate-700"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Profile</p>
                    <h3 className="text-2xl font-black text-slate-50">{selectedMentor.name}</h3>
                    <p className="text-sm text-slate-400">{selectedMentor.expertise}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/20 px-2 py-1 text-teal-300">
                        ★ {selectedMentor.rating.toFixed(1)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/50 px-2 py-1">
                        {selectedMentor.reviews} reviews
                      </span>
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-300">{selectedMentor.about}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {selectedMentor.highlights.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-teal-500/20 px-3 py-1 text-[11px] font-semibold text-teal-300"
                    >
                      #{tag.replace(/\s+/g, "")}
                    </span>
                  ))}
                  {selectedMentor.languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-full bg-slate-800/50 px-3 py-1 text-[11px] font-semibold text-slate-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-between rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Availability</p>
                  <p className="text-sm font-semibold text-slate-50">{selectedMentor.availability}</p>
                  <p className="text-xs text-slate-400">Book directly or ask a question first.</p>
                </div>

                <div className="space-y-2">
                  <RequestGuidanceButton
                    mentorSlug={selectedMentor.slug}
                    mentorName={selectedMentor.name}
                    initialLabel="Book a Session"
                  />
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
