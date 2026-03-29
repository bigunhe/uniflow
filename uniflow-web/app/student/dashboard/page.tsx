"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/shared/layout/DashboardShell";
import { StatCard } from "@/components/shared/cards/StatCard";
import { getCurrentUserProfile } from "@/services/auth";
import { listSessionHistory } from "@/services/sessions";
import { listStudentRequests } from "@/services/requests";

export default function StudentDashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    async function bootstrap() {
      const { user, profile } = await getCurrentUserProfile();
      if (!user || profile?.role !== "student") {
        location.assign("/login");
        return;
      }

      setUserId(user.id);

      const [sessionRows, requestRows] = await Promise.all([
        listSessionHistory(user.id, "student"),
        listStudentRequests(user.id),
      ]);

      setSessions(sessionRows);
      setRequests(requestRows);
    }

    void bootstrap();
  }, []);

  const totalHours = useMemo(() => {
    const minutes = sessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
    return (minutes / 60).toFixed(1);
  }, [sessions]);

  return (
    <DashboardShell
      role="student"
      title="Student Dashboard"
      subtitle="Track your sessions, ask AI, and request mentor guidance."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Sessions" value={String(sessions.length)} />
        <StatCard label="Mentor Hours" value={totalHours} helper="Total completed mentoring time" />
        <StatCard
          label="Open Requests"
          value={String(requests.filter((request) => request.status !== "completed").length)}
        />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/student/ask-ai" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Ask AI</h2>
          <p className="mt-1 text-sm text-slate-600">Get immediate help and follow-up mentor recommendations.</p>
        </Link>
        <Link href="/student/request" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Request Guidance</h2>
          <p className="mt-1 text-sm text-slate-600">Submit requests with topic, urgency, and preferred schedule.</p>
        </Link>
        <Link href="/student/urgent" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Urgent Help</h2>
          <p className="mt-1 text-sm text-slate-600">Broadcast urgent requests to active mentors in real-time.</p>
        </Link>
        <Link href="/student/history" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Session History</h2>
          <p className="mt-1 text-sm text-slate-600">Review completed sessions, duration, and mentor details.</p>
        </Link>
      </section>

      {userId ? (
        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Latest Requests</h2>
          <div className="mt-4 space-y-3">
            {requests.slice(0, 5).map((request) => (
              <article key={request.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{request.topic}</p>
                <p className="mt-1 text-xs text-slate-600">
                  {request.urgency.toUpperCase()} • {request.status.toUpperCase()}
                </p>
                {request.session_id ? (
                  <Link
                    href={`/student/session/${request.session_id}`}
                    className="mt-2 inline-block text-xs font-semibold text-amber-700 hover:text-amber-800"
                  >
                    Join session
                  </Link>
                ) : null}
              </article>
            ))}
            {requests.length === 0 ? <p className="text-sm text-slate-500">No requests yet.</p> : null}
          </div>
        </section>
      ) : null}
    </DashboardShell>
  );
}
