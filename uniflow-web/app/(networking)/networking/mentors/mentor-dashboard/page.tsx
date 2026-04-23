"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { mentorButtonClassName } from "../_components/MentorButton";
import {
  listMentorBadges,
  listMentorRequests,
  refreshMentorBadges,
  updateMentorshipRequestStatus,
} from "@/services/mentorship";

type MentorRequestRow = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  meeting_link: string | null;
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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

export default function MentorDashboardPage() {
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
          refreshMentorBadges(),
        ]);

        if (!active) return;
        setRequests(requestRows as MentorRequestRow[]);
        setBadges((badgeRows || []) as MentorBadgeRow[]);
        setError(null);
      } catch (loadError) {
        if (!active) return;
        const fallbackBadges = await listMentorBadges();
        const fallbackRequests = await listMentorRequests();
        setRequests(fallbackRequests as MentorRequestRow[]);
        setBadges((fallbackBadges || []) as MentorBadgeRow[]);
        setError(loadError instanceof Error ? loadError.message : "Could not load mentor dashboard.");
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

  const pendingRequests = useMemo(
    () => requests.filter((request) => request.status === "pending"),
    [requests],
  );

  const acceptedRequests = useMemo(
    () => requests.filter((request) => request.status === "accepted"),
    [requests],
  );

  const studentsHelped = useMemo(() => {
    return new Set(acceptedRequests.map((request) => request.student?.full_name || request.id)).size;
  }, [acceptedRequests]);

  const summaryCards = [
    { label: "Active Sessions", value: String(acceptedRequests.length) },
    { label: "Incoming Requests", value: String(pendingRequests.length) },
    { label: "Students Helped", value: String(studentsHelped) },
    { label: "Badges", value: String(badges.length) },
  ];

  const handleDecision = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      setError(null);
      await updateMentorshipRequestStatus(requestId, status);
      setRequests((prev) =>
        prev.map((request) =>
          request.id === requestId ? { ...request, status } : request,
        ),
      );
      if (status === "accepted") {
        const refreshed = await listMentorBadges();
        setBadges(refreshed as MentorBadgeRow[]);
      }
    } catch (decisionError) {
      setError(decisionError instanceof Error ? decisionError.message : "Could not update request.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-700 bg-slate-900/40 p-8 shadow-sm backdrop-blur-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Mentor Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Track active sessions, incoming requests, and your mentorship impact in one place.
        </p>
        {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {summaryCards.map((card) => (
            <article key={card.label} className="rounded-2xl border border-slate-700 bg-slate-800/40 p-5">
              <p className="text-sm text-slate-400">{card.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-50">{loading ? "..." : card.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-12 gap-6">
        <div className="col-span-12 rounded-2xl border border-slate-700 bg-slate-900/40 p-6 backdrop-blur-sm lg:col-span-7">
          <h2 className="text-lg font-semibold text-slate-50">Incoming Requests</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {pendingRequests.length === 0 ? (
              <li className="rounded-lg border border-dashed border-slate-600 bg-slate-800/30 p-3">
                No pending requests right now.
              </li>
            ) : (
              pendingRequests.slice(0, 2).map((request) => (
                <li key={request.id} className="rounded-lg border border-slate-700 bg-slate-800/30 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-100">{request.student?.full_name || "Student"}</p>
                      <p className="mt-1 text-xs text-slate-400">{request.student?.learning_goals || "Learning goals not provided"}</p>
                      <p className="mt-1 text-[11px] text-slate-500">Received {formatDate(request.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => void handleDecision(request.id, "accepted")}
                        className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDecision(request.id, "rejected")}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
          <Link
            href="/networking/mentors/request-management"
            className="mt-4 inline-flex text-sm font-semibold text-teal-400 hover:text-teal-300"
          >
            View all requests
          </Link>
        </div>

        <aside className="col-span-12 rounded-2xl border border-slate-700 bg-slate-900/40 p-6 backdrop-blur-sm lg:col-span-5">
          <h2 className="text-lg font-semibold text-slate-50">Quick Actions</h2>
          <div className="mt-4 grid gap-3">
            <Link href="/networking/mentors/request-management" className={mentorButtonClassName({ variant: "secondary" })}>
              Review Requests
            </Link>
            <Link href="/networking/mentors/messages" className={mentorButtonClassName({ variant: "secondary" })}>
              Open Messages
            </Link>
            <Link href="/networking/mentors/live-session" className={mentorButtonClassName({ variant: "secondary" })}>
              Start Session
            </Link>
            <Link href="/networking/mentors/tutor-analytics" className={mentorButtonClassName({ variant: "secondary" })}>
              View Analytics
            </Link>
          </div>

          <div className="mt-5 space-y-2 rounded-xl border border-slate-700 bg-slate-800/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Mentor Badges</p>
            {badges.length === 0 ? (
              <p className="text-sm text-slate-400">No badges yet. Keep mentoring to unlock achievements.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {badges.map((badge) => (
                  <span key={badge.badge_name} className="rounded-full border border-indigo-400/40 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
                    {badge.badge_name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
