"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MentorCard from "../_components/mentorCard";
import { mentorButtonClassName } from "../_components/MentorButton";
import { mentorProfiles } from "../_components/mentorData";
import { getUserRoleProfile } from "../_components/userRoleProfile";

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

export default function MentorsHomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(getUserRoleProfile());

  useEffect(() => {
    const userProfile = getUserRoleProfile();
    setProfile(userProfile);
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
              className="text-sm font-semibold text-sky-700 hover:text-sky-800"
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

        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/networking/mentors/messages"
              className="rounded-xl border border-slate-300 p-4 text-center hover:bg-slate-50"
            >
              <p className="font-semibold text-slate-900">My Messages</p>
              <p className="text-sm text-slate-600 mt-1">View your conversations</p>
            </Link>
            <Link
              href="/networking/mentors/ai-assistant"
              className="rounded-xl border border-slate-300 p-4 text-center hover:bg-slate-50"
            >
              <p className="font-semibold text-slate-900">Ask AI Assistant</p>
              <p className="text-sm text-slate-600 mt-1">Get instant help anytime</p>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  // Show mentor home page
  if (profile?.role === "mentor") {
    return (
      <div className="space-y-12">
        <section className="grid grid-cols-12 gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm lg:p-10">
          <div className="col-span-12 space-y-5 lg:col-span-7">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Welcome back, {profile.fullName}!
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600">
              You have <span className="font-semibold">4 new help requests waiting</span> for your review.
              Check your dashboard to manage sessions and view your mentoring analytics.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/networking/mentors/request-management"
                className={mentorButtonClassName({ size: "lg" })}
              >
                Review Requests
              </Link>
              <Link
                href="/networking/mentors/mentor-dashboard"
                className={mentorButtonClassName({ variant: "secondary", size: "lg" })}
              >
                View Dashboard
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

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 space-y-5 lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Incoming Requests</h2>
              <p className="mt-1 text-sm text-slate-600">Students waiting for your guidance</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Data Structures Guidance</p>
                  <p className="text-sm text-slate-600 mt-1">From John - 2 hours ago</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Algorithm Review</p>
                  <p className="text-sm text-slate-600 mt-1">From Sarah - 4 hours ago</p>
                </div>
              </div>
              <Link
                href="/networking/mentors/request-management"
                className="mt-4 block text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                View all requests →
              </Link>
            </div>
          </div>

          <div className="col-span-12 space-y-5 lg:col-span-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">Today's Sessions</h2>
              <p className="mt-1 text-sm text-slate-600">Scheduled mentoring sessions</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Advanced Calculus Review</p>
                  <p className="text-sm text-slate-600 mt-1">Today, 10:30 AM</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Thesis Discussion</p>
                  <p className="text-sm text-slate-600 mt-1">Today, 3:00 PM</p>
                </div>
              </div>
              <Link
                href="/networking/mentors/live-session"
                className="mt-4 block text-sm font-semibold text-sky-700 hover:text-sky-800"
              >
                Start session →
              </Link>
            </div>
          </div>
        </section>

        <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Link
              href="/networking/mentors/messages"
              className="rounded-xl border border-slate-300 p-4 text-center hover:bg-slate-50"
            >
              <p className="font-semibold text-slate-900">Messages</p>
              <p className="text-sm text-slate-600 mt-1">Chat with students</p>
            </Link>
            <Link
              href="/networking/mentors/tutor-analytics"
              className="rounded-xl border border-slate-300 p-4 text-center hover:bg-slate-50"
            >
              <p className="font-semibold text-slate-900">Analytics</p>
              <p className="text-sm text-slate-600 mt-1">View your stats</p>
            </Link>
            <Link
              href="/networking/mentors/ai-assistant"
              className="rounded-xl border border-slate-300 p-4 text-center hover:bg-slate-50"
            >
              <p className="font-semibold text-slate-900">AI Assistant</p>
              <p className="text-sm text-slate-600 mt-1">Get help planning</p>
            </Link>
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
          <p className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold tracking-wide text-sky-800">
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
            className="text-sm font-semibold text-sky-700 hover:text-sky-800"
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
