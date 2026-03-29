"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardShell } from "@/components/shared/layout/DashboardShell";
import { SessionChat } from "@/components/shared/chat/SessionChat";
import { WhiteboardCanvas } from "@/components/shared/whiteboard/WhiteboardCanvas";
import { getCurrentUserProfile } from "@/services/auth";
import { completeSession, getSessionById } from "@/services/sessions";

export default function MentorSessionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const sessionId = params.id;

  const [userId, setUserId] = useState<string | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const { user, profile } = await getCurrentUserProfile();
      if (!user || profile?.role !== "mentor") {
        router.push("/login");
        return;
      }

      const row = await getSessionById(sessionId);
      setUserId(user.id);
      setSession(row);
    }

    void load();
  }, [router, sessionId]);

  const elapsed = useMemo(() => {
    if (!session?.start_time) return "0m";
    const start = new Date(session.start_time).getTime();
    const now = Date.now();
    const mins = Math.max(1, Math.round((now - start) / 60000));
    return `${mins}m`;
  }, [session]);

  async function finishSession() {
    if (!session) return;
    setSaving(true);
    await completeSession(session, notes || null);
    setSaving(false);
    router.push("/mentor/history");
  }

  return (
    <DashboardShell
      role="mentor"
      title="Mentor Session Workspace"
      subtitle="Run real-time session with chat and whiteboard collaboration."
    >
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-600">Session timer: {elapsed}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            type="file"
            className="rounded-lg border border-slate-300 px-2 py-1 text-xs"
            aria-label="Optional file sharing"
          />
          <input
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Session summary or action items"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="button"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-70"
            onClick={finishSession}
          >
            {saving ? "Completing..." : "Complete Session"}
          </button>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        {userId ? <SessionChat sessionId={sessionId} userId={userId} /> : null}
        <WhiteboardCanvas />
      </div>
    </DashboardShell>
  );
}
