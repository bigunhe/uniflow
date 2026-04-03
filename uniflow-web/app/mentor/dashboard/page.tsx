"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/shared/layout/DashboardShell";
import { StatCard } from "@/components/shared/cards/StatCard";
import { getCurrentUserProfile } from "@/services/auth";
import { listMentorVisibleRequests } from "@/services/requests";
import { listSessionHistory } from "@/services/sessions";

export default function MentorDashboardPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { user, profile } = await getCurrentUserProfile();
      if (!user || profile?.role !== "mentor") {
        location.assign("/login");
        return;
      }

      const [requestRows, sessionRows] = await Promise.all([
        listMentorVisibleRequests(user.id),
        listSessionHistory(user.id, "mentor"),
      ]);

      setRequests(requestRows);
      setSessions(sessionRows);
    }

    void load();
  }, []);

  const totalMinutes = useMemo(() => {
    return sessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0);
  }, [sessions]);

  return (
    <DashboardShell
      role="mentor"
      title="Mentor Dashboard"
      subtitle="Track requests, sessions, and performance metrics."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Incoming Requests" value={String(requests.filter((request) => request.status === "open").length)} />
        <StatCard label="Sessions Completed" value={String(sessions.filter((session) => session.status === "completed").length)} />
        <StatCard label="Hours Mentored" value={(totalMinutes / 60).toFixed(1)} />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <Link href="/mentor/requests" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Manage Requests</h2>
          <p className="mt-1 text-sm text-slate-600">Accept or reject direct and open requests in real-time.</p>
        </Link>
        <Link href="/mentor/analytics" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Analytics</h2>
          <p className="mt-1 text-sm text-slate-600">Measure mentoring performance and response speed.</p>
        </Link>
      </section>
    </DashboardShell>
  );
}
