"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type ChatMessage = {
  id: string;
  sender: "tutor" | "you";
  name: string;
  time: string;
  text: string;
  code?: string;
};

type SessionContext = {
  id: string;
  name: string;
  course: string;
};

const sessionContexts: SessionContext[] = [
  { id: "alex-johnson", name: "Alex Johnson", course: "IT3040 Database Systems" },
  { id: "sarah-chen", name: "Sarah Chen", course: "CS2010 Software Design" },
  { id: "david-kim", name: "David Kim", course: "MAT1001 Linear Algebra" },
  { id: "emily-watson", name: "Emily Watson", course: "PH303 Quantum Systems" },
];

const sampleMessages: ChatMessage[] = [
  {
    id: "m1",
    sender: "tutor",
    name: "Tutor Jane",
    time: "10:15 AM",
    text: "Hello! Let us dive into binary search. Can you explain how the midpoint calculation works?",
  },
  {
    id: "m2",
    sender: "you",
    name: "You",
    time: "10:17 AM",
    text: "Sure thing! Here is a Python snippet illustrating the midpoint logic:",
    code: `def binary_search(arr, target):\n    low = 0\n    high = len(arr) - 1\n    while low <= high:\n        midpoint = (low + high) // 2\n        mid = (low + high) // 2`,
  },
  {
    id: "m3",
    sender: "tutor",
    name: "Tutor Jane",
    time: "10:19 AM",
    text: "Perfect. Why do we use // instead of / ?",
  },
];

export default function MentorLiveSessionPage() {
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();

  const conversationId = searchParams.get("conversation") ?? "alex-johnson";

  const activeContext = useMemo(() => {
    return sessionContexts.find((context) => context.id === conversationId) ?? sessionContexts[0];
  }, [conversationId]);

  return (
    <div className="min-h-screen bg-slate-50/80 p-3 lg:p-6">
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_5%_10%,rgba(79,70,229,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(56,189,248,0.06),transparent_30%)]"
          aria-hidden
        />

        {/* Top status bar */}
        <header className="relative flex items-center gap-3 border-b border-slate-200 bg-slate-50/70 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-slate-800">
            <Link
              href="/networking/mentors/messages"
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
            >
              ← Back to Messages
            </Link>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-indigo-700">
              Academic Session
            </span>
            <span className="text-slate-900">{activeContext.name} — {activeContext.course}</span>
          </div>

          <div className="ml-auto flex items-center gap-3 text-sm font-semibold text-slate-700">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
              <div className="relative h-2 w-20 rounded-full bg-slate-200">
                <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-indigo-500" />
              </div>
              <span className="font-mono text-xs text-slate-600">45:00</span>
            </div>
            <button className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">
              Settings
            </button>
            <button className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow hover:bg-indigo-700">
              Mark Session Complete
            </button>
          </div>
        </header>

        <div className="relative grid h-[calc(100vh-170px)] grid-cols-1 lg:grid-cols-12">
          {/* Chat */}
          <section className="relative flex flex-col border-r border-slate-200 bg-white/95 lg:col-span-4">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Session Chat</span>
              </div>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">
                Live
              </span>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
              {sampleMessages.map((msg) => {
                const isYou = msg.sender === "you";
                return (
                  <div key={msg.id} className={isYou ? "ml-auto max-w-[90%] space-y-2" : "max-w-[90%] space-y-2"}>
                    <div className={`flex items-center gap-2 ${isYou ? "justify-end" : "justify-start"}`}>
                      {!isYou ? (
                        <span className="h-6 w-6 rounded-full bg-slate-200 text-center text-[11px] font-bold text-slate-700">
                          TJ
                        </span>
                      ) : null}
                      <span className="text-[11px] font-semibold text-slate-500">{msg.time}</span>
                      {isYou ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-semibold text-white">
                          You
                        </span>
                      ) : null}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm shadow ${
                        isYou ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {msg.text}
                    </div>

                    {msg.code ? (
                      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 text-[12px] text-emerald-200 shadow">
                        <pre className="whitespace-pre-wrap px-4 py-3 font-mono">{msg.code}</pre>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
                <button className="text-xs font-semibold text-slate-500" aria-label="Attach">
                  Attach
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Type a message..."
                  className="h-9 flex-1 bg-transparent text-sm text-slate-800 outline-none"
                />
                <button className="rounded-full bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700">
                  Send
                </button>
              </div>
            </div>
          </section>

          {/* Whiteboard */}
          <section className="relative flex flex-col bg-slate-50 lg:col-span-8">
            {/* Floating tools */}
            <div className="pointer-events-none absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-md">
              {["Pen", "Marker", "Shape", "Text", "Undo", "Redo", "Clear", "Search"].map((label, index) => (
                <div
                  key={label}
                  className={`h-8 w-8 rounded-full ${index === 0 ? "bg-indigo-600" : "bg-slate-200"}`}
                  title={label}
                />
              ))}
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/70 px-12 py-12 text-center shadow-inner">
                <div className="mb-6 flex items-center justify-center gap-6 text-slate-300">
                  <div className="h-16 w-16 rounded-full border-2 border-slate-300" />
                  <div className="h-2 w-24 rounded-full bg-slate-200" />
                  <div className="h-16 w-24 rounded-lg border-2 border-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-800">Collaborative Whiteboard Canvas</p>
                <p className="mt-2 text-xs text-slate-500">Use the tools above to draw diagrams or explain logic.</p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Tutor Jane is drawing
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200">A</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200">B</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200">C</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}