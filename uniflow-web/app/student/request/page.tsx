"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardShell } from "@/components/shared/layout/DashboardShell";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { getCurrentUserProfile } from "@/services/auth";
import { createGuidanceRequest, fetchRecommendedMentors } from "@/services/requests";
import { RequestUrgency } from "@/models/request";

export default function StudentRequestPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState<RequestUrgency>("medium");
  const [preferredTime, setPreferredTime] = useState("");
  const [subjects, setSubjects] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [recommendedMentors, setRecommendedMentors] = useState<any[]>([]);

  useEffect(() => {
    const supabase = createBrowserSupabase();
    let mounted = true;

    async function setupSubscription() {
      const { user, profile } = await getCurrentUserProfile();
      if (!mounted || !user || profile?.role !== "student") return;

      const channel = supabase
        .channel(`student-request-flow-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "guidance_requests",
            filter: `student_id=eq.${user.id}`,
          },
          (payload) => {
            const updated = payload.new as { status?: string; session_id?: string | null };
            if (updated.status === "accepted" && updated.session_id) {
              router.push(`/student/session/${updated.session_id}`);
            }
          },
        )
        .subscribe();

      return () => {
        void supabase.removeChannel(channel);
      };
    }

    let cleanup: (() => void) | undefined;
    void setupSubscription().then((dispose) => {
      cleanup = dispose;
    });

    return () => {
      mounted = false;
      if (cleanup) cleanup();
    };
  }, [router]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const { user, profile } = await getCurrentUserProfile();
    if (!user || profile?.role !== "student") {
      location.assign("/login");
      return;
    }

    const subjectTags = subjects
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      await createGuidanceRequest({
        topic,
        description,
        urgency,
        preferredTime,
        subjectTags,
        studentId: user.id,
      });

      const mentors = await fetchRecommendedMentors(subjectTags, urgency);
      setRecommendedMentors(mentors);

      setMessage("Request submitted. Mentors can now see it in real-time.");
      setTopic("");
      setDescription("");
      setPreferredTime("");
      setSubjects("");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Failed to create request.";
      setMessage(text);
    }

    setSaving(false);
  }

  return (
    <DashboardShell
      role="student"
      title="Request Guidance"
      subtitle="Submit details and get smart mentor recommendations."
    >
      <section className="rounded-2xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-5 shadow-sm">
        <form onSubmit={onSubmit} className="grid gap-4">
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Topic"
            required
            className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-50 placeholder-slate-500"
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe your issue"
            required
            rows={4}
            className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-50 placeholder-slate-500"
          />
          <input
            value={subjects}
            onChange={(event) => setSubjects(event.target.value)}
            placeholder="Subject tags (comma separated)"
            required
            className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-50 placeholder-slate-500"
          />
          <div className="grid gap-3 md:grid-cols-2">
            <select
              value={urgency}
              onChange={(event) => setUrgency(event.target.value as RequestUrgency)}
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-50"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
            <input
              value={preferredTime}
              onChange={(event) => setPreferredTime(event.target.value)}
              placeholder="Preferred time (e.g. Today 7PM)"
              className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-50 placeholder-slate-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-fit rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-70"
          >
            {saving ? "Submitting..." : "Submit Request"}
          </button>
        </form>

        {message ? <p className="mt-3 rounded-lg bg-slate-800/50 p-2 text-sm text-slate-400">{message}</p> : null}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-50">Recommended Mentors</h2>
          <Link href="/student/urgent" className="text-sm font-semibold text-rose-400 hover:text-rose-300">
            Need immediate help?
          </Link>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {recommendedMentors.length === 0 ? (
            <p className="text-sm text-slate-400">Submit a request to see smart matches.</p>
          ) : (
            recommendedMentors.map((mentor) => (
              <article key={mentor.id} className="rounded-lg border border-slate-700 bg-slate-800/30 p-3">
                <p className="font-semibold text-slate-50">{mentor.full_name || "Mentor"}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Rating {mentor.rating} • Sessions {mentor.sessions_completed}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Tags: {(mentor.subject_tags || []).slice(0, 4).join(", ") || "N/A"}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </DashboardShell>
  );
}
