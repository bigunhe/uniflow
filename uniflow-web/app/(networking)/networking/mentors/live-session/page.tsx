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
    <div className="min-h-screen bg-[#080c14] p-3 lg:p-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.03)] backdrop-blur-sm shadow-xl">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_5%_10%,rgba(20,184,166,0.06),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(94,234,212,0.06),transparent_30%)]"
          aria-hidden
        />

        {/* Top status bar */}
        <header className="relative flex items-center gap-3 border-b border-white/8 bg-[rgba(10,14,22,0.92)] px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-[rgba(232,238,248,0.88)]">
            <Link
              href="/networking/mentors/messages"
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-[rgba(232,238,248,0.78)] hover:bg-white/8"
            >
              ← Back to Messages
            </Link>
            <span className="rounded-full bg-teal-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-teal-300">
              Academic Session
            </span>
            <span className="text-[#f0f4fb]">{activeContext.name} — {activeContext.course}</span>
          </div>

          <div className="ml-auto flex items-center gap-3 text-sm font-semibold text-[rgba(168,184,208,0.85)]">
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
              <div className="relative h-2 w-20 rounded-full bg-white/10">
                <div className="absolute inset-y-0 left-0 w-1/2 rounded-full bg-[#00d2b4]" />
              </div>
              <span className="font-mono text-xs text-[rgba(168,184,208,0.85)]">45:00</span>
            </div>
            <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-[rgba(232,238,248,0.78)] hover:bg-white/8">
              Settings
            </button>
            <button className="rounded-full bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-4 py-2 text-xs font-semibold text-white shadow hover:opacity-90">
              Mark Session Complete
            </button>
          </div>
        </header>

        <div className="relative grid h-[calc(100vh-170px)] grid-cols-1 lg:grid-cols-12">
          {/* Chat */}
          <section className="relative flex flex-col border-r border-white/8 bg-[rgba(10,14,22,0.92)] lg:col-span-4">
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 text-sm font-semibold text-[rgba(232,238,248,0.78)]">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#00d2b4]" />
                <span>Session Chat</span>
              </div>
              <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-teal-300">
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
                        <span className="h-6 w-6 rounded-full bg-slate-700 text-center text-[11px] font-bold text-slate-400">
                          TJ
                        </span>
                      ) : null}
                      <span className="text-[11px] font-semibold text-slate-500">{msg.time}</span>
                      {isYou ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-[11px] font-semibold text-white">
                          You
                        </span>
                      ) : null}
                    </div>

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm shadow ${
                              isYou ? "bg-gradient-to-r from-[#00d2b4] to-[#6366f1] text-white" : "bg-white/5 text-[rgba(232,238,248,0.88)]"
                            }`}
                    >
                      {msg.text}
                    </div>

                    {msg.code ? (
                      <div className="overflow-hidden rounded-2xl border border-white/8 bg-[#091413] text-[12px] text-[#00d2b4] shadow">
                        <pre className="whitespace-pre-wrap px-4 py-3 font-mono">{msg.code}</pre>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>

            <div className="border-t border-white/8 px-4 py-3">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 shadow-sm">
                <button className="text-xs font-semibold text-[rgba(232,238,248,0.78)]" aria-label="Attach">
                  Attach
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Type a message..."
                  className="h-9 flex-1 bg-transparent text-sm text-[#f0f4fb] outline-none placeholder:text-[rgba(168,184,208,0.6)]"
                />
                <button className="rounded-full bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-3 py-2 text-xs font-semibold text-white hover:opacity-90">
                  Send
                </button>
              </div>
            </div>
          </section>

          {/* Whiteboard */}
          <section className="relative flex flex-col bg-[rgba(255,255,255,0.02)] lg:col-span-8">
            {/* Floating tools */}
            <div className="pointer-events-none absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/8 bg-[rgba(10,14,22,0.92)] px-4 py-2 shadow-md">
              {["Pen", "Marker", "Shape", "Text", "Undo", "Redo", "Clear", "Search"].map((label, index) => (
                <div
                  key={label}
                  className={`h-8 w-8 rounded-full ${index === 0 ? "bg-gradient-to-br from-[#00d2b4] to-[#6366f1]" : "bg-white/10"}`}
                  title={label}
                />
              ))}
            </div>

            <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 bg-white/5 px-12 py-12 text-center shadow-inner">
                <div className="mb-6 flex items-center justify-center gap-6 text-[rgba(168,184,208,0.85)]">
                  <div className="h-16 w-16 rounded-full border-2 border-white/10" />
                  <div className="h-2 w-24 rounded-full bg-white/10" />
                  <div className="h-16 w-24 rounded-lg border-2 border-white/10" />
                </div>
                <p className="text-sm font-semibold text-[#f0f4fb]">Collaborative Whiteboard Canvas</p>
                <p className="mt-2 text-xs text-[rgba(168,184,208,0.85)]">Use the tools above to draw diagrams or explain logic.</p>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-[rgba(168,184,208,0.85)]">
                <span className="h-2 w-2 rounded-full bg-[#00d2b4]" />
                Tutor Jane is drawing
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-white/8 bg-[rgba(10,14,22,0.92)] px-4 py-3 text-xs text-[rgba(168,184,208,0.85)]">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">A</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">B</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">C</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}