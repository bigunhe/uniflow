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
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50">
      <MentorHeader />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-6 shadow-sm sm:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Session Feedback</p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">How was your session?</h1>
              <p className="text-sm text-slate-600">Share quick feedback so mentors can improve future sessions.</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-800 ring-1 ring-indigo-100">
              Takes ~1 minute • Helps your next session
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <article className="lg:col-span-2 space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="text-center space-y-3">
            <p className="text-sm font-semibold text-slate-700">How was your overall experience?</p>
            <div className="flex items-center justify-center gap-3">
              {stars.map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                  onClick={() => setRating(star)}
                  className={
                    rating >= star
                      ? "h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 text-xl"
                      : "h-10 w-10 rounded-full bg-slate-100 text-slate-400 text-xl"
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
                <div key={key} className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
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
                    className="w-full accent-indigo-600"
                  />
                </div>
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">What went well?</p>
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
                        ? "rounded-full bg-indigo-100 px-3 py-1 text-[11px] font-semibold text-indigo-700 ring-1 ring-indigo-200"
                        : "rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200"
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
              <label className="text-sm font-semibold text-slate-700" htmlFor="highlight">Top takeaway</label>
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
                    ? "h-11 w-full rounded-xl border border-rose-300 bg-white px-3 text-sm text-slate-900 outline-none ring-2 ring-rose-100"
                    : "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                }
              />
              {errors.highlight ? (
                <p className="text-[11px] font-semibold text-rose-600">{errors.highlight}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="improve">What to improve</label>
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
                    ? "h-11 w-full rounded-xl border border-rose-300 bg-white px-3 text-sm text-slate-900 outline-none ring-2 ring-rose-100"
                    : "h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                }
              />
              {errors.improve ? (
                <p className="text-[11px] font-semibold text-rose-600">{errors.improve}</p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-slate-700">Any additional comments?</p>
            <textarea
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              rows={3}
              placeholder="Share your thoughts on the session..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
            <span>Make feedback anonymous</span>
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(event) => setAnonymous(event.target.checked)}
              className="h-4 w-4 accent-indigo-600"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              onClick={handleSubmit}
            >
              Submit Feedback
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => {
                setSubmitted(false);
                router.push("/networking/mentors/home");
              }}
            >
              Skip for now
            </button>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
              Thanks! Your feedback was recorded.
            </div>
          ) : null}
        </article>

        <aside className="space-y-4 rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Why feedback matters</p>
          <p className="text-sm text-slate-600">
            Mentors tune sessions to your learning style. Students who share feedback see faster clarity and better session outcomes.
          </p>
          <div className="rounded-2xl bg-white/80 p-4 text-sm text-slate-700 shadow-inner">
            <p className="font-semibold text-indigo-800">Pro tip</p>
            <p className="text-slate-600">Be specific about what helped and what to change next time.</p>
          </div>
          <div className="rounded-2xl border border-indigo-100 bg-white px-4 py-3 text-sm text-slate-700">
            <p className="font-semibold text-indigo-800">Need help?</p>
            <p>Use clear examples and note what you want changed next time.</p>
          </div>
        </aside>
      </section>
      </main>
    </div>
  );
}
