"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/shared/layout/DashboardShell";
import { StatCard } from "@/components/shared/cards/StatCard";
import { getCurrentUserProfile } from "@/services/auth";
import { listSessionHistory } from "@/services/sessions";

export default function MentorAnalyticsPage() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { user, profile } = await getCurrentUserProfile();
      if (!user || profile?.role !== "mentor") {
        location.assign("/login");
        return;
      }

      const rows = await listSessionHistory(user.id, "mentor");
      setSessions(rows);
    }

    void load();
  }, []);

  const completedSessions = useMemo(
    () => sessions.filter((session) => session.status === "completed").length,
    [sessions],
  );

  const totalMinutes = useMemo(
    () => sessions.reduce((sum, session) => sum + (session.duration_minutes || 0), 0),
    [sessions],
  );

  const avgDuration = useMemo(() => {
    if (completedSessions === 0) return 0;
    return Math.round(totalMinutes / completedSessions);
  }, [completedSessions, totalMinutes]);

  return (
    <DashboardShell
      role="mentor"
      title="Analytics"
      subtitle="Performance overview based on completed mentoring sessions."
    >
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Hours Mentored" value={(totalMinutes / 60).toFixed(1)} />
        <StatCard label="Sessions Completed" value={String(completedSessions)} />
        <StatCard label="Avg Session Duration" value={`${avgDuration} mins`} />
      </section>
    </DashboardShell>
  );
}
