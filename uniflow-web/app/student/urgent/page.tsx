"use client";

import { FormEvent, useState } from "react";
import { DashboardShell } from "@/components/shared/layout/DashboardShell";
import { getCurrentUserProfile } from "@/services/auth";
import { createGuidanceRequest } from "@/services/requests";

export default function StudentUrgentPage() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitUrgent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const { user, profile } = await getCurrentUserProfile();
    if (!user || profile?.role !== "student") {
      location.assign("/login");
      return;
    }

    try {
      await createGuidanceRequest({
        topic,
        description,
        urgency: "urgent",
        preferredTime: "ASAP",
        subjectTags: topic.split(" ").slice(0, 4),
        studentId: user.id,
      });

      setStatus("Urgent request broadcasted to mentors in real-time.");
      setTopic("");
      setDescription("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to send urgent request.");
    }

    setLoading(false);
  }

  return (
    <DashboardShell
      role="student"
      title="Urgent Help"
      subtitle="Trigger immediate mentor attention for high-priority doubts."
    >
      <section className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm">
        <form onSubmit={submitUrgent} className="grid gap-4">
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Urgent topic"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What do you need right now?"
            required
            rows={4}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-fit rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-70"
          >
            {loading ? "Broadcasting..." : "Send Urgent Request"}
          </button>
        </form>

        {status ? <p className="mt-3 rounded-lg bg-rose-50 p-2 text-sm text-rose-700">{status}</p> : null}
      </section>
    </DashboardShell>
  );
}
