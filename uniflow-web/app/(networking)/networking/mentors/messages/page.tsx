"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getGuidanceRequests,
  GuidanceRequest,
} from "../_components/guidanceRequests";

const conversationPreview = [
  { name: "Alex Johnson", code: "IT3040", text: "Can we review the SQL query for the join issue?", time: "2m" },
  { name: "Sarah Chen", code: "CS2010", text: "Thanks for the feedback on the lab report.", time: "1h" },
  { name: "David Kim", code: "MAT1001", text: "I have uploaded the new lecture notes.", time: "4h" },
  { name: "Emily Watson", code: "PH303", text: "Is the online tutor slot still at 3 PM?", time: "Yesterday" },
];

export default function MentorMessagesPage() {
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

  const acceptedRequest = useMemo(
    () => requests.find((request) => request.status === "accepted"),
    [requests],
  );

  if (!acceptedRequest) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Messages Locked</h1>
        <p className="mt-2 text-sm text-slate-600">
          Messages activate after a mentor accepts your guidance request.
          If rejected, request guidance from another mentor.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/networking/mentors/mentor-discovery"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            Request Another Mentor
          </Link>
          <Link
            href="/networking/mentors/request-management"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Check Request Status
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-3">
        <h1 className="text-xl font-bold text-slate-900">Direct Messages & Contact</h1>
      </div>

      <div className="grid min-h-[650px] grid-cols-1 lg:grid-cols-12">
        <aside className="border-r border-slate-200 bg-slate-50 p-4 lg:col-span-2">
          <div className="rounded-xl bg-white p-3">
            <p className="text-sm font-semibold text-slate-900">Study Hub</p>
            <p className="text-[11px] text-slate-500">Academic Guide</p>
          </div>

          <nav className="mt-5 space-y-1 text-sm">
            <p className="rounded-lg px-3 py-2 text-slate-600">Dashboard</p>
            <p className="rounded-lg px-3 py-2 text-slate-600">Requests</p>
            <p className="rounded-lg bg-indigo-100 px-3 py-2 font-semibold text-indigo-700">Messages</p>
            <p className="rounded-lg px-3 py-2 text-slate-600">Library</p>
            <p className="rounded-lg px-3 py-2 text-slate-600">Settings</p>
          </nav>

          <div className="mt-8 rounded-xl border border-slate-200 bg-white p-3">
            <p className="text-xs font-semibold text-slate-800">Mentor Connected</p>
            <p className="mt-1 text-xs text-slate-600">{acceptedRequest.mentorName}</p>
          </div>
        </aside>

        <aside className="border-r border-slate-200 lg:col-span-3">
          <div className="border-b border-slate-200 p-3">
            <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
            <input
              type="search"
              placeholder="Search chats..."
              className="mt-3 h-10 w-full rounded-full bg-slate-100 px-4 text-sm outline-none ring-indigo-500 focus:ring-2"
            />
          </div>

          <ul>
            {conversationPreview.map((chat, index) => (
              <li
                key={chat.name}
                className={`border-b border-slate-100 px-4 py-3 ${index === 0 ? "border-l-2 border-l-indigo-600 bg-indigo-50/60" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900">{chat.name}</p>
                  <span className="text-[11px] text-slate-400">{chat.time}</span>
                </div>
                <p className="text-[11px] font-semibold text-indigo-600">{chat.code}</p>
                <p className="mt-1 truncate text-xs text-slate-500">{chat.text}</p>
              </li>
            ))}
          </ul>
        </aside>

        <main className="border-r border-slate-200 lg:col-span-5">
          <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Alex Johnson</p>
              <p className="text-xs text-slate-500">Student - IT3040 Database Systems</p>
            </div>
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
              Start Live Session
            </button>
          </header>

          <div className="space-y-3 px-4 py-5">
            <div className="max-w-[85%] rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">
              Hi Professor! I am struggling with the complex JOIN queries for the project.
              Could you clarify if we should use LEFT JOIN or INNER JOIN?
              <p className="mt-1 text-[10px] text-slate-400">10:42 AM</p>
            </div>

            <div className="ml-auto max-w-[85%] rounded-2xl bg-indigo-600 p-3 text-sm text-white">
              For this requirement, use INNER JOIN because we only want matching records
              from both tables. Share your draft query and I will review it.
              <p className="mt-1 text-right text-[10px] text-indigo-200">10:45 AM</p>
            </div>

            <div className="max-w-[85%] rounded-2xl bg-slate-100 p-3 text-sm text-slate-700">
              That makes sense. I have drafted the query but it returns some duplicates.
              Can we review it quickly?
              <p className="mt-1 text-[10px] text-slate-400">10:48 AM</p>
            </div>
          </div>

          <div className="mt-auto border-t border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2">
              <button className="text-slate-400">paperclip</button>
              <input
                type="text"
                placeholder="Type your response here..."
                className="h-8 flex-1 text-sm outline-none"
              />
              <button className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">
                Send
              </button>
            </div>
          </div>
        </main>

        <aside className="bg-slate-50 p-4 lg:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Doubt Context</h2>

          <article className="mt-3 rounded-xl bg-white p-3">
            <p className="text-xs font-semibold text-slate-800">Current Issue</p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Student is stuck on JOIN types for IT3040 DB assessment. Specificly regarding
              1-to-many relationships between Customers and Orders.
            </p>
          </article>

          <article className="mt-3 rounded-xl bg-white p-3">
            <p className="text-xs font-semibold text-slate-800">Academic Profile</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
              <div className="h-full w-[95%] rounded-full bg-indigo-600" />
            </div>
            <p className="mt-2 text-xs text-slate-600">GPA: 3.8 / 4.0</p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
              <div className="h-full w-[65%] rounded-full bg-emerald-500" />
            </div>
            <p className="mt-2 text-xs text-slate-600">Completion: 65%</p>
          </article>
        </aside>
      </div>
    </section>
  );
}
