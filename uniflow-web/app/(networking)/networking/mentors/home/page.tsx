"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MentorCard from "../_components/mentorCard";
import { mentorButtonClassName } from "../_components/MentorButton";
import { mentorProfiles } from "../_components/mentorData";
import { getUserRoleProfile } from "../_components/userRoleProfile";
import {
  GuidanceRequest,
  getGuidanceRequests,
  updateGuidanceRequestStatus,
} from "../_components/guidanceRequests";

const mentorStats = [
  { label: "Active Mentors", value: "120+" },
  { label: "Avg Mentor Rating", value: "4.8" },
  { label: "Completed Sessions", value: "3.2k" },
];

const studentStats = [
  { label: "Completed Sessions", value: "24" },
  { label: "Upcoming Sessions", value: "128" },
  { label: "Semester Goals", value: "72%" },
];

const mentorHubStats = [
  { label: "Total Students", value: "1,284", badge: "+12%" },
  { label: "Hours Mentored", value: "142.5", badge: "Weekly" },
  { label: "Impact Score", value: "98/100", highlight: true },
  { label: "Avg. Rating", value: "4.9", badge: "Top 1% Mentor" },
];

const mentorHubSessions = [
  {
    date: "OCT 24",
    title: "Advanced Tailwind Layouts",
    time: "02:00 PM - 03:30 PM",
    status: "Live Now",
  },
  {
    date: "OCT 25",
    title: "Backend Scaling Strategies",
    time: "10:00 AM - 11:00 AM",
    status: "Upcoming",
  },
  {
    date: "OCT 25",
    title: "Portfolio Review: Fintech",
    time: "04:30 PM - 05:30 PM",
    status: "Upcoming",
  },
];

export default function MentorsHomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(getUserRoleProfile());
  const [mentorRequests, setMentorRequests] = useState<GuidanceRequest[]>([]);

  useEffect(() => {
    const userProfile = getUserRoleProfile();
    setProfile(userProfile);

    const syncRequests = () => {
      setMentorRequests(getGuidanceRequests());
    };

    syncRequests();
    window.addEventListener("guidance-requests-updated", syncRequests);

    return () => {
      window.removeEventListener("guidance-requests-updated", syncRequests);
    };
  }, []);

  // Show student home page
  if (profile?.role === "student") {
    return (
      <div className="space-y-12">
        <section className="grid grid-cols-12 gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="col-span-12 space-y-5 lg:col-span-7">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Hello, {profile.fullName}!
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600">
              Ready for your next learning session? Browse available mentors, join study groups,
              or continue with your learning modules.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/networking/mentors/mentor-discovery"
                className={mentorButtonClassName({ size: "lg" })}
              >
                Find a Mentor
              </Link>
              <Link
                href="/learning/modules"
                className={mentorButtonClassName({ variant: "secondary", size: "lg" })}
              >
                Learning Modules
              </Link>
              <Link
                href="/student/feedback"
                className={mentorButtonClassName({ variant: "ghost", size: "lg" })}
              >
                Add Feedback
              </Link>
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
            {studentStats.map((item) => (
              <div key={item.label} className="rounded-2xl bg-slate-50 p-5">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Mentors</h2>
              <p className="mt-1 text-sm text-slate-600">
                Connect with experienced mentors in your field of study.
              </p>
            </div>
            <Link
              href="/networking/mentors/mentor-discovery"
              className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
            >
              View all mentors
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mentorProfiles.slice(0, 3).map((mentor) => (
              <MentorCard key={mentor.slug} mentor={mentor} />
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Start here</p>
            <h2 className="text-2xl font-bold text-slate-900">Support Hub</h2>
            <p className="text-sm text-slate-600">
              Ask AI first to get instant answers. If you still need help, jump into a session with a mentor.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#4f46e5_0%,#6366f1_45%,#22c1c3_100%)] p-6 text-white shadow-[0_18px_40px_rgba(99,102,241,0.35)] lg:col-span-2">
              <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3 md:max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    AI assistant ready
                  </span>
                  <h3 className="text-3xl font-black leading-tight">Ask AI First</h3>
                  <p className="text-sm text-indigo-100/90">
                    Get instant answers to academic and career questions in seconds. Great for quick clarity before booking a live mentor.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-indigo-50/90">
                    <span className="rounded-full bg-white/10 px-3 py-1">Study guidance</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">Project help</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">Career advice</span>
                  </div>
                </div>

                <Link
                  href="/networking/mentors/ai-assistant"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Start AI Chat
                </Link>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Need a human?</p>
                <h3 className="text-xl font-bold text-slate-900">Still need help?</h3>
                <p className="text-sm text-slate-600">
                  If AI did not fully solve it, connect with a mentor for 1-on-1 support.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <Link
                  href="/networking/mentors/mentor-discovery"
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Book a Mentor
                </Link>

                <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                  <Link
                    href="/networking/mentors/messages"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-100"
                  >
                    My Messages
                  </Link>
                  <Link
                    href="/learning/modules"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-100"
                  >
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Show mentor home page
  if (profile?.role === "mentor") {
    const pendingRequests = mentorRequests
      .filter((request) => request.status === "pending")
      .slice(0, 2);

    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950">Mentor Hub</h1>
              <p className="mt-1 text-base text-slate-500">
                Welcome back. You have {pendingRequests.length || 0} pending mentorship requests.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">A</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">B</span>
              <span className="inline-flex h-8 items-center justify-center rounded-full bg-indigo-100 px-2 text-xs font-semibold text-indigo-700">+8</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {mentorHubStats.map((item) => (
              <div
                key={item.label}
                className={item.highlight
                  ? "rounded-2xl bg-[linear-gradient(135deg,#4f46e5_0%,#4338ca_100%)] p-5 text-white"
                  : "rounded-2xl border border-slate-200 bg-slate-50 p-5"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <p className={item.highlight ? "text-xs uppercase tracking-wide text-indigo-100" : "text-xs uppercase tracking-wide text-slate-500"}>{item.label}</p>
                  {item.badge ? (
                    <span className={item.highlight
                      ? "rounded-full bg-indigo-300/30 px-2 py-0.5 text-[10px] font-semibold text-white"
                      : "rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700"
                    }>
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className={item.highlight ? "mt-4 text-4xl font-black tracking-tight" : "mt-4 text-4xl font-black tracking-tight text-slate-900"}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Incoming Requests</h2>
              <span className="rounded-full bg-indigo-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-700">
                {pendingRequests.length} New
              </span>
            </div>

            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No pending requests right now.
                </div>
              ) : (
                pendingRequests.map((request, index) => (
                  <article
                    key={request.id}
                    className={index === 0
                      ? "rounded-xl border border-rose-200 bg-rose-50/40 p-4"
                      : "rounded-xl border border-indigo-200 bg-indigo-50/30 p-4"
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{request.studentName}</p>
                        <p className="text-xs text-slate-500">{request.mentorName}</p>
                      </div>
                      <span className={index === 0
                        ? "rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-rose-700"
                        : "rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-600"
                      }>
                        {index === 0 ? "Urgent" : "Normal"}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{request.topic}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => updateGuidanceRequestStatus(request.id, "accepted")}
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => updateGuidanceRequestStatus(request.id, "rejected")}
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600 transition hover:bg-slate-200"
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <Link href="/networking/mentors/request-management" className="mt-4 inline-flex text-sm font-semibold text-indigo-700 hover:text-indigo-800">
              View all requests
            </Link>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Active Sessions</h2>
                <Link href="/networking/mentors/live-session" className="text-sm font-semibold text-indigo-700 hover:text-indigo-800">
                  View Calendar
                </Link>
              </div>

              <div className="space-y-2.5">
                {mentorHubSessions.map((session, index) => (
                  <article key={session.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-11 w-11 flex-col items-center justify-center rounded-lg bg-indigo-100 text-[10px] font-bold leading-tight text-indigo-700">
                          {session.date.split(" ")[0]}
                          <span className="text-xs">{session.date.split(" ")[1]}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{session.title}</p>
                          <p className="text-xs text-slate-500">{session.time}</p>
                        </div>
                      </div>

                      {index === 0 ? (
                        <button
                          type="button"
                          className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white transition hover:bg-indigo-700"
                        >
                          Join Room
                        </button>
                      ) : (
                        <span className={session.status === "Live Now" ? "text-xs font-semibold text-emerald-600" : "text-xs font-semibold text-slate-500"}>
                          {session.status}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-900">Growth Insight</p>
              <p className="mt-1 text-sm text-slate-500">Your session bookings increased by 12% this week.</p>
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Quick Actions</h2>
            <div className="flex gap-2">
              <Link href="/networking/mentors/messages" className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200">Messages</Link>
              <Link href="/networking/mentors/tutor-analytics" className="inline-flex h-10 items-center rounded-lg border border-slate-300 bg-slate-100 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-200">Feedback</Link>
              <Link href="/networking/mentors/live-session" className="inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">New Session</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Default view if not logged in
  return (
    <div className="space-y-12">
      <section className="grid grid-cols-12 gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
        <div className="col-span-12 space-y-5 lg:col-span-7">
          <p className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-800">
            Mentor Marketplace
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Build skills faster with focused, real-world mentors.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-600">
            Explore verified mentors, compare expertise, and request guidance based on your goals.
            The flow is designed for clear discovery, profile review, and support requests.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/networking/mentors/mentor-discovery"
              className={mentorButtonClassName({ size: "lg" })}
            >
              Browse Mentors
            </Link>
            <Link
              href="/networking/mentors/mentor-dashboard"
              className={mentorButtonClassName({ variant: "secondary", size: "lg" })}
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
          {mentorStats.map((item) => (
            <div key={item.label} className="rounded-2xl bg-slate-50 p-5">
              <p className="text-sm text-slate-500">{item.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Featured Mentors</h2>
            <p className="mt-1 text-sm text-slate-600">
              Start with top-rated mentors and move to full listing for more options.
            </p>
          </div>
          <Link
            href="/networking/mentors/mentor-discovery"
            className="text-sm font-semibold text-indigo-700 hover:text-indigo-800"
          >
            View all mentors
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mentorProfiles.slice(0, 3).map((mentor) => (
            <MentorCard key={mentor.slug} mentor={mentor} />
          ))}
        </div>
      </section>
    </div>
  );
}
