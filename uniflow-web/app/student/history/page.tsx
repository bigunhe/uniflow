"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/shared/layout/DashboardShell";
import { getCurrentUserProfile } from "@/services/auth";
import { listSessionHistory } from "@/services/sessions";

export default function StudentHistoryPage() {
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { user, profile } = await getCurrentUserProfile();
      if (!user || profile?.role !== "student") {
        location.assign("/login");
        return;
      }

      const rows = await listSessionHistory(user.id, "student");
      setSessions(rows);
    }

    void load();
  }, []);

  return (
    <DashboardShell
      role="student"
      title="Session History"
      subtitle="Review your completed and active mentoring sessions."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {sessions.length === 0 ? <p className="text-sm text-slate-500">No session history yet.</p> : null}
        <div className="space-y-3">
          {sessions.map((session) => (
            <article key={session.id} className="rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">Session {session.id.slice(0, 8)}</p>
              <p className="mt-1 text-xs text-slate-600">Status: {session.status}</p>
              <p className="text-xs text-slate-600">Duration: {session.duration_minutes || 0} mins</p>
              <p className="text-xs text-slate-600">
                Date: {new Date(session.created_at).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
