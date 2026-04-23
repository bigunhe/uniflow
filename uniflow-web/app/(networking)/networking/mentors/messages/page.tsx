"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getCurrentUserIdSafe,
  getMyRoleProfile,
  listMentorRequests,
  listMyStudentRequests,
  listRequestMessages,
  sendRequestMessage,
  subscribeToRequestMessages,
  unsubscribeChannel,
} from "@/services/mentorship";
import { MentorshipMessage } from "@/models/mentorship";

type AcceptedThread = {
  requestId: string;
  participantName: string;
  status: "accepted";
  meetingLink: string | null;
};

type StudentRequestRow = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  mentor_id: string;
  meeting_link: string | null;
  mentor?: {
    full_name?: string | null;
  } | null;
};

type MentorRequestRow = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  student_id: string;
  meeting_link: string | null;
  student?: {
    full_name?: string | null;
  } | null;
};

export default function MentorMessagesPage() {
  const searchParams = useSearchParams();
  const preferredRequestId = searchParams.get("requestId") || "";
  const [threads, setThreads] = useState<AcceptedThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [messages, setMessages] = useState<MentorshipMessage[]>([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewerId, setViewerId] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadThreads = async () => {
      try {
        setLoadingThreads(true);
        setError(null);

        const [profile, userId] = await Promise.all([
          getMyRoleProfile(),
          getCurrentUserIdSafe(),
        ]);

        if (!isActive) return;
        setViewerId(userId);

        if (profile.mentor) {
          const mentorRequests = (await listMentorRequests()) as MentorRequestRow[];
          const accepted = mentorRequests
            .filter((request) => request.status === "accepted")
            .map((request) => ({
              requestId: request.id,
              participantName: request.student?.full_name || "Student",
              status: "accepted" as const,
              meetingLink: request.meeting_link,
            }));
          if (!isActive) return;
          setThreads(accepted);
          if (accepted.length > 0) {
            const preferred = accepted.find((item) => item.requestId === preferredRequestId);
            setSelectedThreadId((current) => current || preferred?.requestId || accepted[0].requestId);
          }
          return;
        }

        const studentRequests = (await listMyStudentRequests()) as StudentRequestRow[];
        const accepted = studentRequests
          .filter((request) => request.status === "accepted")
          .map((request) => ({
            requestId: request.id,
            participantName: request.mentor?.full_name || "Mentor",
            status: "accepted" as const,
            meetingLink: request.meeting_link,
          }));

        if (!isActive) return;
        setThreads(accepted);
        if (accepted.length > 0) {
          const preferred = accepted.find((item) => item.requestId === preferredRequestId);
          setSelectedThreadId((current) => current || preferred?.requestId || accepted[0].requestId);
        }
      } catch (loadError) {
        if (!isActive) return;
        setError(loadError instanceof Error ? loadError.message : "Failed to load threads.");
      } finally {
        if (isActive) {
          setLoadingThreads(false);
        }
      }
    };

    void loadThreads();

    return () => {
      isActive = false;
    };
  }, [preferredRequestId]);

  useEffect(() => {
    if (!selectedThreadId) {
      setMessages([]);
      return;
    }

    let isActive = true;
    let channelCleanup = () => {};

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const rows = await listRequestMessages(selectedThreadId);
        if (isActive) {
          setMessages(rows);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load messages.");
        }
      } finally {
        if (isActive) {
          setLoadingMessages(false);
        }
      }
    };

    void loadMessages();

    const channel = subscribeToRequestMessages(selectedThreadId, loadMessages);
    channelCleanup = () => {
      unsubscribeChannel(channel);
    };

    return () => {
      isActive = false;
      channelCleanup();
    };
  }, [selectedThreadId]);

  const activeThread = useMemo(
    () => threads.find((thread) => thread.requestId === selectedThreadId) || null,
    [selectedThreadId, threads],
  );

  const handleSendMessage = async () => {
    const text = draftMessage.trim();
    if (!text || !selectedThreadId || sending) return;

    try {
      setSending(true);
      setError(null);
      await sendRequestMessage(selectedThreadId, text);
      setDraftMessage("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Failed to send message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid min-h-[calc(100vh-12rem)] grid-cols-12 gap-6">
      <aside className="col-span-12 rounded-2xl border border-slate-700 bg-slate-900/40 p-4 backdrop-blur-sm lg:col-span-4">
        <h1 className="text-xl font-bold text-slate-50">Mentorship Chats</h1>
        <p className="mt-1 text-xs text-slate-400">Messaging unlocks only after request acceptance.</p>

        {loadingThreads ? (
          <p className="mt-4 text-sm text-slate-400">Loading chats...</p>
        ) : threads.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-700 bg-slate-800/30 p-4 text-sm text-slate-400">
            No accepted requests yet. Once a request is accepted, the conversation appears here.
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {threads.map((thread) => (
              <button
                key={thread.requestId}
                type="button"
                onClick={() => setSelectedThreadId(thread.requestId)}
                className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                  selectedThreadId === thread.requestId
                    ? "border-teal-400/50 bg-teal-500/10"
                    : "border-slate-700 bg-slate-800/30 hover:bg-slate-800/50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-100">{thread.participantName}</p>
                <p className="mt-1 text-xs text-slate-400">Request #{thread.requestId.slice(0, 8)}</p>
              </button>
            ))}
          </div>
        )}
      </aside>

      <section className="col-span-12 flex min-h-[calc(100vh-12rem)] flex-col rounded-2xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm lg:col-span-8">
        <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-100">{activeThread?.participantName || "Select a chat"}</p>
            <p className="text-xs text-slate-400">Accepted mentorship conversation</p>
          </div>
          {activeThread?.meetingLink ? (
            <Link
              href={`/networking/mentors/live-session?requestId=${activeThread.requestId}`}
              className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
            >
              Join Session
            </Link>
          ) : null}
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          {loadingMessages ? (
            <p className="text-sm text-slate-400">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-slate-400">No messages yet. Start the conversation.</p>
          ) : (
            messages.map((message) => {
              const own = message.sender_id === viewerId;
              return (
                <div key={message.id} className={`flex ${own ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-2 text-sm ${
                      own
                        ? "bg-gradient-to-r from-[#00d2b4] to-[#6366f1] text-white"
                        : "bg-slate-800/70 text-slate-100"
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className={`mt-1 text-[10px] ${own ? "text-white/80" : "text-slate-400"}`}>
                      {new Date(message.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="border-t border-slate-700 px-5 py-4">
          <div className="flex items-center gap-2">
            <input
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              placeholder={selectedThreadId ? "Type a message" : "Select an accepted chat to start messaging"}
              disabled={!selectedThreadId || sending}
              className="h-11 flex-1 rounded-xl border border-slate-700 bg-slate-800/40 px-3 text-sm text-slate-50 outline-none ring-teal-500/40 transition focus:border-teal-500 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60"
            />
            <button
              type="button"
              onClick={() => void handleSendMessage()}
              disabled={!selectedThreadId || sending || !draftMessage.trim()}
              className="h-11 rounded-xl bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? "Sending" : "Send"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
