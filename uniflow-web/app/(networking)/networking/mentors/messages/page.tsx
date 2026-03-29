"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getGuidanceRequests,
  GuidanceRequest,
} from "../_components/guidanceRequests";
import {
  getUserRoleProfile,
  UserRoleProfile,
} from "../_components/userRoleProfile";

type Conversation = {
  id: string;
  name: string;
  course: string;
  subject: string;
  snippet: string;
  time: string;
  status?: "online" | "offline";
  unread?: boolean;
  issue: string;
  gpa: number;
  completion: number;
  tags: string[];
};

type Message = {
  sender: "student" | "mentor";
  text: string;
  time: string;
};

const conversations: Conversation[] = [
  {
    id: "alex-johnson",
    name: "Alex Johnson",
    course: "IT3040 Database Systems",
    subject: "SQL join logic for 1-to-many relationships",
    snippet: "Can we review the SQL query for the join issue?",
    time: "2m",
    status: "online",
    unread: true,
    issue: "Clarify LEFT vs INNER JOIN usage for customer/order relationship in assessment.",
    gpa: 3.8,
    completion: 65,
    tags: ["DB schema", "Queries", "Assessment"],
  },
  {
    id: "sarah-chen",
    name: "Sarah Chen",
    course: "CS2010 Software Design",
    subject: "Lab report feedback follow-up",
    snippet: "Thanks for the feedback on the lab report.",
    time: "1h",
    status: "online",
    issue: "Needs clarity on SOLID examples for the next submission.",
    gpa: 3.6,
    completion: 72,
    tags: ["Refactoring", "SOLID"],
  },
  {
    id: "david-kim",
    name: "David Kim",
    course: "MAT1001 Linear Algebra",
    subject: "Lecture notes uploaded",
    snippet: "I have uploaded the new lecture notes.",
    time: "4h",
    status: "offline",
    issue: "Wants a quick check on vector space proofs before quiz.",
    gpa: 3.4,
    completion: 58,
    tags: ["Proofs", "Vectors"],
  },
  {
    id: "emily-watson",
    name: "Emily Watson",
    course: "PH303 Quantum Systems",
    subject: "Live tutor slot confirmation",
    snippet: "Is the online tutor slot still at 3 PM?",
    time: "Yesterday",
    status: "online",
    issue: "Confirm time for problem-set discussion on operators.",
    gpa: 3.9,
    completion: 81,
    tags: ["Scheduling", "Problem Set"],
  },
];

const conversationMessages: Record<string, Message[]> = {
  "alex-johnson": [
    {
      sender: "student",
      text:
        "Hi Professor! I am struggling with the complex JOIN queries for the project. Could you clarify if we should use LEFT JOIN or INNER JOIN?",
      time: "10:42 AM",
    },
    {
      sender: "mentor",
      text:
        "For this requirement, use INNER JOIN because we only want matching records from both tables. Share your draft query and I will review it.",
      time: "10:45 AM",
    },
    {
      sender: "student",
      text:
        "That makes sense. I have drafted the query but it returns some duplicates. Can we review it quickly?",
      time: "10:48 AM",
    },
  ],
  "sarah-chen": [
    {
      sender: "student",
      text:
        "I applied your feedback to the lab report. Could you check the SOLID examples I added to section two?",
      time: "9:10 AM",
    },
    {
      sender: "mentor",
      text:
        "Nice revisions. Highlight the dependency inversion example with a short diagram and you are set.",
      time: "9:18 AM",
    },
  ],
  "david-kim": [
    {
      sender: "student",
      text: "I uploaded fresh notes. Are my vector space proofs valid for assignment three?",
      time: "Yesterday",
    },
    {
      sender: "mentor",
      text:
        "Add one more example showing closure under addition, and your argument will read more clearly.",
      time: "Yesterday",
    },
  ],
  "emily-watson": [
    {
      sender: "student",
      text: "Is our online tutor slot still at 3 PM for the operators problem set?",
      time: "Yesterday",
    },
    {
      sender: "mentor",
      text: "Yes, 3 PM is confirmed. Bring the list of questions on Hermitian operators.",
      time: "Yesterday",
    },
  ],
};

export default function MentorMessagesPage() {
  const [requests, setRequests] = useState<GuidanceRequest[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState(
    conversations[0].id,
  );
  const [search, setSearch] = useState("");
  const [roleProfile, setRoleProfile] = useState<UserRoleProfile | null>(null);

  useEffect(() => {
    const sync = () => setRequests(getGuidanceRequests());

    sync();
    window.addEventListener("guidance-requests-updated", sync);
    return () => {
      window.removeEventListener("guidance-requests-updated", sync);
    };
  }, []);

  useEffect(() => {
    const syncProfile = () => setRoleProfile(getUserRoleProfile());
    syncProfile();
    window.addEventListener("uniflow-role-profile-updated", syncProfile);
    return () => {
      window.removeEventListener("uniflow-role-profile-updated", syncProfile);
    };
  }, []);

  const acceptedRequest = useMemo(
    () => requests.find((request) => request.status === "accepted"),
    [requests],
  );

  const filteredConversations = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter((chat) =>
      [chat.name, chat.course, chat.subject, chat.snippet]
        .join(" ")
        .toLowerCase()
        .includes(term),
    );
  }, [search]);

  const selectedConversation = useMemo(() => {
    const fromSelection = conversations.find(
      (item) => item.id === selectedConversationId,
    );
    return fromSelection ?? conversations[0];
  }, [selectedConversationId]);

  const messages = useMemo(() => {
    return conversationMessages[selectedConversation.id] ?? [];
  }, [selectedConversation.id]);

  return (
    <section className="relative -mx-2 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 p-2">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.08),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.1),transparent_30%)]" aria-hidden />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 shadow-xl backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Direct Messages
            </p>
            <h1 className="text-2xl font-bold text-slate-900">
              Study Hub — Academic Guide
            </h1>
          </div>
          <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {roleProfile?.fullName ?? "Your Dashboard"}
              </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
              {acceptedRequest?.status === "accepted" ? "Active" : "Preview"}
            </span>
          </div>
        </div>

        <div className="grid min-h-[720px] grid-cols-1 lg:grid-cols-12">
          <aside className="border-r border-slate-200 lg:col-span-4">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Messages</h2>
                <p className="text-xs text-slate-500">Chat with students across courses</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                {conversations.length} active
              </span>
            </div>

            <div className="border-b border-slate-200 px-4 py-3">
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search chats, topics, courses"
                className="h-10 w-full rounded-full border border-slate-200 bg-slate-50 px-4 text-sm outline-none ring-indigo-500 transition focus:bg-white focus:ring-2"
              />
            </div>

            <ul className="divide-y divide-slate-100">
              {filteredConversations.map((chat) => {
                const isActive = chat.id === selectedConversation.id;
                return (
                  <li
                    key={chat.id}
                    onClick={() => setSelectedConversationId(chat.id)}
                    className={`cursor-pointer px-4 py-4 transition hover:bg-indigo-50 ${
                      isActive
                        ? "border-l-4 border-indigo-600 bg-indigo-50/80 shadow-inner"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${
                            chat.status === "online" ? "bg-emerald-500" : "bg-slate-300"
                          }`}
                        />
                        <p className="text-sm font-semibold text-slate-900">{chat.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-[11px]">
                        {chat.unread ? (
                          <span className="rounded-full bg-indigo-600 px-2 py-0.5 font-semibold text-white">
                            New
                          </span>
                        ) : null}
                        <span className="text-slate-400">{chat.time}</span>
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">
                      {chat.course}
                    </p>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">{chat.snippet}</p>
                  </li>
                );
              })}
            </ul>
          </aside>

          <main className="flex flex-col border-r border-slate-200 bg-gradient-to-b from-white to-slate-50 lg:col-span-6">
            <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">{selectedConversation.name}</p>
                <p className="text-xs text-slate-500">
                  Student — {selectedConversation.course}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                  Add Note
                </button>
                <Link
                  href={`/networking/mentors/live-session?conversation=${selectedConversation.id}`}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Start Live Session
                </Link>
              </div>
            </header>

            <div className="flex-1 space-y-3 overflow-y-auto px-6 py-6">
              {messages.map((message, index) => {
                const isMentor = message.sender === "mentor";
                return (
                  <div
                    key={`${message.time}-${index}`}
                    className={`flex ${isMentor ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                        isMentor
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                      <p
                        className={`mt-2 text-[10px] ${
                          isMentor ? "text-indigo-100" : "text-slate-500"
                        }`}
                      >
                        {message.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-200 px-6 py-4">
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
                <button className="text-sm font-semibold text-slate-500">Attach</button>
                <input
                  type="text"
                  placeholder="Type your response here..."
                  className="h-9 flex-1 text-sm outline-none placeholder:text-slate-400"
                />
                <button className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                  Send
                </button>
              </div>
            </div>
          </main>

          <aside className="bg-slate-50/80 px-4 py-6 lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Doubt Context
            </h2>

            <article className="mt-3 space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-800">Current Issue</p>
              <p className="text-sm font-semibold text-slate-900">
                {selectedConversation.subject}
              </p>
              <p className="text-xs leading-relaxed text-slate-600">
                {selectedConversation.issue}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedConversation.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-semibold text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>

            <article className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-800">Academic Profile</p>
              <div className="mt-3 space-y-3 text-sm text-slate-700">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>GPA</span>
                    <span>{selectedConversation.gpa.toFixed(1)} / 4.0</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width: `${(selectedConversation.gpa / 4) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Course Completion</span>
                    <span>{selectedConversation.completion}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${selectedConversation.completion}%` }}
                    />
                  </div>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </div>
    </section>
  );
}
