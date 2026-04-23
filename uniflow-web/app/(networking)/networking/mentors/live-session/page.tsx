"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getMentorshipRequestById } from "@/services/mentorship";
import { MentorshipRequest } from "@/models/mentorship";

type SessionState = {
  loading: boolean;
  error: string | null;
  request: MentorshipRequest | null;
};

function getRoomFromLink(link: string) {
  const trimmed = link.trim();
  if (!trimmed) return "";
  const parts = trimmed.split("/").filter(Boolean);
  return parts[parts.length - 1] || "";
}

export default function MentorLiveSessionPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("requestId") || "";

  const [state, setState] = useState<SessionState>({
    loading: true,
    error: null,
    request: null,
  });

  useEffect(() => {
    const load = async () => {
      if (!requestId) {
        setState({
          loading: false,
          error: "Missing requestId. Open a session from an accepted mentorship chat.",
          request: null,
        });
        return;
      }

      try {
        setState({ loading: true, error: null, request: null });
        const request = await getMentorshipRequestById(requestId);

        if (request.status !== "accepted") {
          setState({
            loading: false,
            error: "This mentorship request is not accepted yet. Session links are available only after acceptance.",
            request: null,
          });
          return;
        }

        setState({ loading: false, error: null, request });
      } catch (loadError) {
        setState({
          loading: false,
          error: loadError instanceof Error ? loadError.message : "Failed to load session.",
          request: null,
        });
      }
    };

    void load();
  }, [requestId]);

  const meetingLink = state.request?.meeting_link || "";

  const iframeSrc = useMemo(() => {
    if (!meetingLink) return "";
    const room = getRoomFromLink(meetingLink);
    if (!room) return "";
    return `https://meet.jit.si/${room}#config.prejoinPageEnabled=false`;
  }, [meetingLink]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-700 bg-slate-900/40 p-6 backdrop-blur-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Live Mentorship Session</h1>
        <p className="mt-2 text-sm text-slate-400">
          Jitsi room is generated when a mentorship request is accepted. Both student and mentor can join through this page.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/networking/mentors/messages"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-4 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
          >
            Back to Messages
          </Link>
          {meetingLink ? (
            <a
              href={meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Open Jitsi in New Tab
            </a>
          ) : null}
        </div>
      </section>

      {state.loading ? (
        <section className="rounded-2xl border border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400">
          Loading live session...
        </section>
      ) : state.error ? (
        <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-200">
          {state.error}
        </section>
      ) : iframeSrc ? (
        <section className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/40">
          <iframe
            title="Jitsi Mentorship Session"
            src={iframeSrc}
            allow="camera; microphone; fullscreen; display-capture"
            className="h-[70vh] w-full"
          />
        </section>
      ) : (
        <section className="rounded-2xl border border-slate-700 bg-slate-900/40 p-6 text-sm text-slate-400">
          No session link available for this request.
        </section>
      )}
    </div>
  );
}
