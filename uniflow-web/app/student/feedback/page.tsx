"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MentorHeader } from "@/app/(networking)/networking/mentors/_components/MentorHeader";

const defaultSliders = {
  clarity: 60,
  pacing: 70,
  knowledge: 80,
  technical: 75,
};

const tagOptions = [
  "Metaphorical teaching",
  "Clear examples",
  "Thorough content",
  "Patient style",
  "Actionable next steps",
  "Great pace",
];

export default function StudentFeedbackPage() {
  const router = useRouter();
  const [rating, setRating] = useState(4);
  const [sliders, setSliders] = useState(defaultSliders);
  const [selectedTags, setSelectedTags] = useState<string[]>(["Metaphorical teaching", "Thorough content"]);
  const [comments, setComments] = useState("");
  const [highlight, setHighlight] = useState("");
  const [improve, setImprove] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ highlight?: string; improve?: string }>({});

  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const validate = () => {
    const nextErrors: { highlight?: string; improve?: string } = {};
    if (!highlight.trim()) {
      nextErrors.highlight = "Required";
    }
    if (!improve.trim()) {
      nextErrors.improve = "Required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    const ok = validate();
    if (!ok) {
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <MentorHeader />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm px-6 py-6 shadow-sm sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Session Feedback</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-50">How was your session?</h1>
              <p className="text-sm text-slate-400">Share quick feedback so mentors can improve future sessions.</p>
            </div>
            <div className="rounded-2xl bg-slate-800/50 px-4 py-3 text-sm font-semibold text-teal-400 ring-1 ring-teal-500/30">
              Takes ~1 minute • Helps your next session
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="lg:col-span-2 space-y-6 rounded-3xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-6 shadow-sm">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-slate-300">How was your overall experience?</p>
            <div className="flex items-center justify-center gap-3">
              {stars.map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                  onClick={() => setRating(star)}
                  className={
                    rating >= star
                      ? "h-10 w-10 rounded-full bg-teal-500/20 text-teal-400 text-xl"
                      : "h-10 w-10 rounded-full bg-slate-800/50 text-slate-600 text-xl"
                  }
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {["clarity", "pacing", "knowledge", "technical"].map((key) => {
              const labelMap: Record<string, string> = {
                clarity: "Clarity of explanation",
                pacing: "Pacing",
                knowledge: "Knowledge & expertise",
                technical: "Technical quality",
              };

              return (
                <div key={key} className="space-y-2 rounded-2xl border border-slate-700 bg-slate-800/30 px-4 py-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                    <span>{labelMap[key]}</span>
                    <span className="text-slate-500">{sliders[key as keyof typeof sliders]}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sliders[key as keyof typeof sliders]}
                    onChange={(event) =>
                      setSliders((prev) => ({ ...prev, [key]: Number(event.target.value) }))
                    }
                    className="w-full accent-teal-500"
                  />
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-300">What went well?</p>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={
                      active
                        ? "rounded-full bg-teal-500/20 px-3 py-1 text-[11px] font-semibold text-teal-400 ring-1 ring-teal-500/50"
                        : "rounded-full bg-slate-800/50 px-3 py-1 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-700"
                    }
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300" htmlFor="highlight">Top takeaway</label>
              <input
                id="highlight"
                value={highlight}
                onChange={(event) => {
                  setHighlight(event.target.value);
                  if (errors.highlight) {
                    setErrors((prev) => ({ ...prev, highlight: undefined }));
                  }
                }}
                placeholder="e.g., Loved the live coding demo"
                className={
                  errors.highlight
                    ? "h-11 w-full rounded-xl border border-rose-900/50 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-2 ring-rose-500/30"
                    : "h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                }
              />
              {errors.highlight ? (
                <p className="text-[11px] font-semibold text-rose-400">{errors.highlight}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300" htmlFor="improve">What to improve</label>
              <input
                id="improve"
                value={improve}
                onChange={(event) => {
                  setImprove(event.target.value);
                  if (errors.improve) {
                    setErrors((prev) => ({ ...prev, improve: undefined }));
                  }
                }}
                placeholder="e.g., More time on Q&A"
                className={
                  errors.improve
                    ? "h-11 w-full rounded-xl border border-rose-900/50 bg-slate-800/50 px-3 text-sm text-slate-50 outline-none ring-2 ring-rose-500/30"
                    : "h-11 w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-50 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
                }
              />
              {errors.improve ? (
                <p className="text-[11px] font-semibold text-rose-600">{errors.improve}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-300">Any additional comments?</p>
            <textarea
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              rows={3}
              placeholder="Share your thoughts on the session..."
              className="w-full rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30"
            />
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-800/30 px-4 py-3 text-sm font-semibold text-slate-300">
            <span>Make feedback anonymous</span>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(event) => setAnonymous(event.target.checked)}
              className="h-4 w-4 accent-teal-500"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-teal-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              onClick={handleSubmit}
            >
              Submit Feedback
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 px-5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
              onClick={() => {
                setSubmitted(false);
                router.push("/networking/mentors/home");
              }}
            >
              Skip for now
            </button>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/20 px-4 py-3 text-sm font-semibold text-emerald-400">
              Thanks! Your feedback was recorded.
            </div>
          ) : null}
        </article>

        <aside className="space-y-4 rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-900/40 via-slate-900/30 to-slate-950/50 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-sm font-semibold text-slate-200">Why feedback matters</p>
          <p className="text-sm text-slate-400">
            Mentors tune sessions to your learning style. Students who share feedback see faster clarity and better session outcomes.
          </p>
          <div className="rounded-2xl bg-slate-800/40 p-4 text-sm text-slate-300 shadow-inner border border-slate-700/50">
            <p className="font-semibold text-teal-400">Pro tip</p>
            <p className="text-slate-400">Be specific about what helped and what to change next time.</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800/30 px-4 py-3 text-sm text-slate-300">
            <p className="font-semibold text-teal-400">Need help?</p>
            <p>Use clear examples and note what you want changed next time.</p>
          </div>
        </aside>
      </section>
      </main>
    </div>
  );
}
