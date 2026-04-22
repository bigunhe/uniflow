"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCurrentUserIdSafe,
  listMentorRequests,
  subscribeToMyRequests,
  unsubscribeChannel,
  updateMentorshipRequestStatus,
} from "@/services/mentorship";

type MentorRequestRow = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  student?: {
    full_name?: string | null;
    learning_goals?: string | null;
    skills?: string[];
  } | null;
};

function statusBadge(status: MentorRequestRow["status"]) {
  if (status === "accepted") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "rejected") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-indigo-100 text-indigo-700";
}

export default function RequestManagementPage() {
  const [requests, setRequests] = useState<MentorRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      try {
        const rows = await listMentorRequests();
        if (isActive) {
          setRequests(rows as MentorRequestRow[]);
          setError(null);
        }
      } catch (loadError) {
        if (isActive) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load requests.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void load();

    let channelCleanup = () => {};
    void (async () => {
      try {
        const userId = await getCurrentUserIdSafe();
        const channel = subscribeToMyRequests(userId, load);
        channelCleanup = () => {
          unsubscribeChannel(channel);
        };
      } catch {
        channelCleanup = () => {};
      }
    })();

    return () => {
      isActive = false;
      channelCleanup();
    };
  }, []);

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === "pending").length,
    [requests],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-50">Request Management</h1>
        <p className="mt-2 text-sm text-slate-400">
          Accept or reject student mentorship requests. Accepting a request activates messaging and creates a Jitsi meeting link.
        </p>
        <p className="mt-4 inline-flex rounded-full bg-teal-500/20 px-3 py-1 text-xs font-semibold text-teal-300">
          {pendingCount} pending request{pendingCount === 1 ? "" : "s"}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-6">
        <h2 className="text-lg font-semibold text-slate-50">Incoming Requests</h2>
        {error ? <p className="mt-2 text-sm text-rose-300">{error}</p> : null}

        {loading ? (
          <p className="mt-4 text-sm text-slate-400">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            No requests yet. Students can send requests from the mentor listing page.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-xl border border-slate-700 bg-slate-800/30 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-50">
                      {request.student?.full_name || "Student"} requested mentorship
                    </p>
                    <p className="mt-1 text-sm text-slate-400">{request.student?.learning_goals || "Learning goals not provided"}</p>
                    <p className="mt-1 text-xs text-slate-500">{(request.student?.skills || []).join(", ") || "No skills listed"}</p>
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusBadge(request.status)}`}
                  >
                    {request.status}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                    disabled={request.status === "accepted"}
                    onClick={() => void updateMentorshipRequestStatus(request.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
                    disabled={request.status === "rejected"}
                    onClick={() => void updateMentorshipRequestStatus(request.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
