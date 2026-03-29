"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardShell } from "@/components/shared/layout/DashboardShell";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import {
  acceptRequestAndCreateSession,
  listMentorVisibleRequests,
  subscribeToRequests,
  updateRequestStatus,
} from "@/services/requests";
import { getCurrentUserProfile } from "@/services/auth";

export default function MentorRequestsPage() {
  const router = useRouter();
  const [mentorId, setMentorId] = useState<string | null>(null);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    let isMounted = true;

    async function refresh(currentMentorId: string) {
      const rows = await listMentorVisibleRequests(currentMentorId);
      if (isMounted) setRequests(rows);
    }

    async function bootstrap() {
      const { user, profile } = await getCurrentUserProfile();
      if (!user || profile?.role !== "mentor") {
        router.push("/login");
        return;
      }

      setMentorId(user.id);
      await refresh(user.id);

      const channel = subscribeToRequests(supabase, () => refresh(user.id));

      return () => {
        void supabase.removeChannel(channel);
      };
    }

    let cleanup: (() => void) | undefined;
    void bootstrap().then((nextCleanup) => {
      cleanup = nextCleanup;
    });

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, [router]);

  async function onAccept(request: any) {
    if (!mentorId) return;
    const session = await acceptRequestAndCreateSession(request, mentorId);
    router.push(`/mentor/session/${session.id}`);
  }

  async function onReject(requestId: string) {
    await updateRequestStatus(requestId, "rejected");
    if (mentorId) {
      const rows = await listMentorVisibleRequests(mentorId);
      setRequests(rows);
    }
  }

  return (
    <DashboardShell
      role="mentor"
      title="Requests"
      subtitle="Review direct student requests and open queue requests."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        {requests.length === 0 ? <p className="text-sm text-slate-500">No requests available.</p> : null}
        <div className="space-y-3">
          {requests.map((request) => (
            <article key={request.id} className="rounded-lg border border-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-900">{request.topic}</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                  {request.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">{request.description}</p>
              <p className="mt-1 text-xs text-slate-500">Urgency: {request.urgency}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  disabled={request.status !== "open"}
                  onClick={() => onAccept(request)}
                >
                  Accept
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                  disabled={request.status !== "open"}
                  onClick={() => onReject(request.id)}
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
