"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getGuidanceRequests,
  GuidanceRequest,
  updateGuidanceRequestStatus,
} from "../_components/guidanceRequests";

function statusBadge(status: GuidanceRequest["status"]) {
  if (status === "accepted") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "rejected") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default function RequestManagementPage() {
  const [requests, setRequests] = useState<GuidanceRequest[]>([]);

  useEffect(() => {
    const sync = () => {
      setRequests(getGuidanceRequests());
    };

    sync();
    window.addEventListener("guidance-requests-updated", sync);
    return () => {
      window.removeEventListener("guidance-requests-updated", sync);
    };
  }, []);

  const pendingCount = useMemo(
    () => requests.filter((request) => request.status === "pending").length,
    [requests],
  );

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Request Management</h1>
        <p className="mt-2 text-sm text-slate-600">
          Accept or reject student guidance requests. Accepting a request activates Messages for both parties.
        </p>
        <p className="mt-4 inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
          {pendingCount} pending request{pendingCount === 1 ? "" : "s"}
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Incoming Requests</h2>

        {requests.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">
            No requests yet. Students can send requests from the mentor card using the Request Guidance button.
          </p>
        ) : (
          <div className="mt-4 grid gap-3">
            {requests.map((request) => (
              <article
                key={request.id}
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {request.studentName} requested {request.mentorName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{request.topic}</p>
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
                    onClick={() => updateGuidanceRequestStatus(request.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
                    disabled={request.status === "rejected"}
                    onClick={() => updateGuidanceRequestStatus(request.id, "rejected")}
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
