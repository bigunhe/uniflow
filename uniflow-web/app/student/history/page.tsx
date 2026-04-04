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
      <section className="rounded-2xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-5 shadow-sm">
        {sessions.length === 0 ? <p className="text-sm text-slate-400">No session history yet.</p> : null}
        <div className="space-y-3">
          {sessions.map((session) => (
            <article key={session.id} className="rounded-lg border border-slate-700 bg-slate-800/30 p-3">
              <p className="text-sm font-semibold text-slate-50">Session {session.id.slice(0, 8)}</p>
              <p className="mt-1 text-xs text-slate-400">Status: {session.status}</p>
              <p className="text-xs text-slate-400">Duration: {session.duration_minutes || 0} mins</p>
              <p className="text-xs text-slate-400">
                Date: {new Date(session.created_at).toLocaleString()}
              </p>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
