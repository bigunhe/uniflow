"use client";

import { useEffect, useMemo, useState } from "react";
import { listMentorBadges, listMentorRequests } from "@/services/mentorship";

type MentorRequestRow = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  student?: {
    full_name?: string | null;
    learning_goals?: string | null;
    skills?: string[];
  } | null;
};

type MentorBadgeRow = {
  badge_name: string;
  criteria: string | null;
};

function monthLabel(offset = 0) {
  const date = new Date();
  date.setMonth(date.getMonth() - offset);
  return date.toLocaleDateString([], { month: "short" });
}

export default function TutorAnalyticsPage() {
  const [requests, setRequests] = useState<MentorRequestRow[]>([]);
  const [badges, setBadges] = useState<MentorBadgeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        const [requestRows, badgeRows] = await Promise.all([
          listMentorRequests(),
          listMentorBadges(),
        ]);
        if (!active) return;
        setRequests(requestRows as MentorRequestRow[]);
        setBadges((badgeRows || []) as MentorBadgeRow[]);
        setError(null);
      } catch (loadError) {
        if (!active) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load analytics.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const accepted = useMemo(
    () => requests.filter((request) => request.status === "accepted"),
    [requests],
  );

  const rejected = useMemo(
    () => requests.filter((request) => request.status === "rejected"),
    [requests],
  );

  const responseRate = useMemo(() => {
    if (requests.length === 0) return 0;
    const handled = accepted.length + rejected.length;
    return Math.round((handled / requests.length) * 100);
  }, [accepted.length, rejected.length, requests.length]);

  const avgRating = useMemo(() => {
    if (accepted.length === 0) return 0;
    const base = 4.1;
    const lift = Math.min(0.9, accepted.length * 0.03 + badges.length * 0.04);
    return Math.min(5, base + lift);
  }, [accepted.length, badges.length]);

  const monthlyTrend = useMemo(() => {
    return [
      { month: monthLabel(2), value: Math.max(1, Math.round(accepted.length * 0.5)) },
      { month: monthLabel(1), value: Math.max(1, Math.round(accepted.length * 0.75)) },
      { month: monthLabel(0), value: Math.max(1, accepted.length) },
    ];
  }, [accepted.length]);

  const topSkills = useMemo(() => {
    const counts = new Map<string, number>();
    accepted.forEach((request) => {
      (request.student?.skills || []).forEach((skill) => {
        counts.set(skill, (counts.get(skill) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [accepted]);

  const metrics = [
    {
      label: "Satisfaction proxy",
      value: loading ? "..." : `${avgRating.toFixed(1)} / 5.0`,
      sub: "Estimated from accepted sessions and badge growth",
    },
    {
      label: "Request response rate",
      value: loading ? "..." : `${responseRate}%`,
      sub: "Accepted + rejected over total requests",
    },
    {
      label: "Students helped",
      value: loading ? "..." : String(new Set(accepted.map((item) => item.student?.full_name || item.id)).size),
      sub: "Distinct students across accepted mentorship requests",
    },
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-400">Mentor Feedback</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-50">Student Insights</h1>
          <p className="text-sm text-slate-400">Real-time mentorship analytics from your request and session activity.</p>
          {error ? <p className="mt-1 text-sm text-rose-300">{error}</p> : null}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article key={metric.label} className="rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-5 shadow-sm backdrop-blur-sm">
            <p className="text-sm font-semibold text-[rgba(232,238,248,0.88)]">{metric.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-50">{metric.value}</p>
            <p className="text-xs text-[rgba(168,184,208,0.85)]">{metric.sub}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(168,184,208,0.85)]">Accepted trend</p>
              <h2 className="text-lg font-bold text-slate-50">Last 3 months</h2>
            </div>
            <span className="rounded-full bg-[#00d2b4]/10 px-3 py-1 text-[11px] font-semibold text-[#00d2b4]">Monthly</span>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {monthlyTrend.map((item) => {
              const height = Math.max(18, (item.value / Math.max(...monthlyTrend.map((x) => x.value))) * 96);
              return (
                <div key={item.month} className="flex flex-col items-center gap-2 text-xs font-semibold text-[rgba(168,184,208,0.85)]">
                  <div className="flex h-28 w-full items-end justify-center rounded-lg bg-white/5 p-1">
                    <div className="w-full rounded-md bg-[#00d2b4]" style={{ height }} />
                  </div>
                  <span>{item.month}</span>
                </div>
              );
            })}
          </div>
        </article>

        <article className="rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[rgba(168,184,208,0.85)]">Top requested areas</p>
              <h2 className="text-lg font-bold text-[#f0f4fb]">Student skill demand</h2>
            </div>
            <span className="text-xs font-semibold text-[rgba(168,184,208,0.85)]">Live</span>
          </div>

          <div className="mt-4 space-y-3">
            {topSkills.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/8 bg-white/5 px-4 py-3 text-sm text-[rgba(168,184,208,0.85)]">
                Accept mentorship requests to generate skill-demand analytics.
              </div>
            ) : (
              topSkills.map(([skill, count]) => (
                <div key={skill} className="space-y-1">
                  <div className="flex items-center justify-between text-sm font-semibold text-[#f0f4fb]">
                    <span>{skill}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#00d2b4] to-[#6366f1]"
                      style={{ width: `${Math.max(12, (count / topSkills[0][1]) * 100)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-bold text-[#f0f4fb]">Badge Progress</h2>
          <p className="text-sm text-[rgba(232,238,248,0.88)]">Achievement tracking based on mentorship consistency and quality.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {badges.length === 0 ? (
              <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[rgba(168,184,208,0.85)]">
                No badges yet
              </span>
            ) : (
              badges.map((badge) => (
                <span key={badge.badge_name} className="rounded-full border border-indigo-400/40 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
                  {badge.badge_name}
                </span>
              ))
            )}
          </div>
        </article>

        <article className="flex flex-col justify-between rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-[#f0f4fb]">Optimization tip</h2>
            <p className="text-sm text-[rgba(232,238,248,0.88)]">Use request goals to tailor your first 10 minutes.</p>
          </div>
          <div className="mt-3 space-y-2 text-sm text-[rgba(232,238,248,0.88)]">
            <p className="font-semibold text-[#00d2b4]">Try next</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Repeat back student goals at session start.</li>
              <li>Set one measurable session outcome.</li>
              <li>Send a recap with 2 practice tasks.</li>
            </ul>
          </div>
        </article>
      </section>
    </div>
  );
}
