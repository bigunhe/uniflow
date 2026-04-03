"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type SuggestedMentor = {
  id?: string;
  full_name?: string;
  rating?: number;
  subject_tags?: string[];
};

const starterPrompts = [
  "Explain this concept like I'm new to it",
  "Give me 3 practice questions with answers",
  "Help me debug this code step-by-step",
  "Create a quick study plan for this topic",
];

export default function MentorAiAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI tutor. Ask anything about your coursework, projects, or career prep. I'll answer and let you know when a live mentor can help more.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedMentors, setSuggestedMentors] = useState<SuggestedMentor[]>([]);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const prefill = searchParams.get("prefill")?.trim();
    if (!prefill) return;

    setInput(prefill);
    const timer = setTimeout(() => {
      setInput((current) => {
        if (current.trim() !== prefill) return current;
        handleSend();
        return current;
      });
    }, 50);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!response.ok) {
        const detail = await response.json().catch(() => ({}));
        throw new Error(detail.error || "Could not reach AI right now");
      }

      const data = await response.json();
      const reply = (data?.reply as string) || "I could not generate a response.";
      const mentors = (data?.suggestions as SuggestedMentor[]) || [];

      setMessages([...nextMessages, { role: "assistant", content: reply }]);
      setSuggestedMentors(mentors.slice(0, 3));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setMessages((prev) => [...prev, { role: "assistant", content: "I hit an issue reaching the AI. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:py-8">
      <section className="relative overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_15%_20%,#c7d2fe_0,rgba(199,210,254,0)_35%),radial-gradient(circle_at_80%_10%,#a5f3fc_0,rgba(165,243,252,0)_30%),linear-gradient(135deg,#0f172a,#111827_45%,#1d4ed8_100%)] px-6 py-8 text-white shadow-[0_18px_60px_rgba(37,99,235,0.25)] sm:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3 lg:max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
              <span className="h-2 w-2 rounded-full bg-emerald-300" />
              Live AI Tutor
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl">AI Study Assistant</h1>
            <p className="max-w-2xl text-sm text-indigo-100/90">
              Instant answers, project help, and interview prep. If AI is not enough, we will route you to a mentor.
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] text-indigo-50/80">
              <span className="rounded-full bg-white/10 px-3 py-1">Homework clarity</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Debugging steps</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Study plans</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Career tips</span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs text-indigo-50">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-100">Escalation path</p>
            <p>Try AI first → book mentor if you still need guidance.</p>
            <Link
              href="/networking/mentors/mentor-discovery"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 underline-offset-4 hover:text-white"
            >
              Book a Mentor
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <section className="lg:col-span-8">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Conversation</p>
                <p className="text-sm font-semibold text-slate-900">Ask anything, get a focused reply</p>
              </div>
              {loading ? (
                <span className="text-xs font-medium text-indigo-600">Thinking…</span>
              ) : null}
            </div>

            <div className="flex flex-col gap-4 px-5 py-4">
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <article
                    key={`${message.role}-${index}-${message.content.slice(0, 12)}`}
                    className={
                      message.role === "assistant"
                        ? "ml-0 mr-8 rounded-2xl border border-indigo-50 bg-indigo-50 px-4 py-3 text-slate-800"
                        : "ml-auto mr-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm"
                    }
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {message.role === "assistant" ? "AI" : "You"}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed">{message.content}</p>
                  </article>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {error ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSend} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ask your question</label>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={3}
                  placeholder="Explain dynamic programming with a simple example, or paste code to debug..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none ring-2 ring-transparent transition focus:border-indigo-300 focus:ring-indigo-100"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[11px] text-slate-500">AI answers fast. We'll suggest mentors if you need deeper help.</p>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {loading ? "Generating..." : "Get AI Help"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-4">
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">How it works</p>
              <ol className="mt-3 space-y-2 text-sm text-slate-700">
                <li>1) Ask anything about your class, project, or interview prep.</li>
                <li>2) AI replies with steps, examples, and quick resources.</li>
                <li>3) If it is still unclear, book a mentor for a live walkthrough.</li>
              </ol>
            </div>

            <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Need a human?</p>
                <Link
                  href="/networking/mentors/mentor-discovery"
                  className="text-xs font-semibold text-indigo-700 hover:text-indigo-900"
                >
                  Browse mentors
                </Link>
              </div>
              <p className="mt-2 text-sm text-indigo-900">
                Still stuck after the AI reply? Book a mentor to pair on your solution.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">Suggested Mentors</p>
                <Link href="/networking/mentors/mentor-discovery" className="text-xs font-semibold text-indigo-700">
                  View all
                </Link>
              </div>
              {suggestedMentors.length === 0 ? (
                <p className="text-sm text-slate-500">Ask something specific to see tailored mentor matches.</p>
              ) : (
                <div className="space-y-3">
                  {suggestedMentors.map((mentor) => (
                    <article
                      key={mentor.id || mentor.full_name}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{mentor.full_name || "Mentor"}</p>
                        <p className="text-xs text-slate-500">
                          {(mentor.subject_tags || []).join(", ") || "Expert mentor"}
                        </p>
                        {mentor.rating ? (
                          <p className="text-xs text-emerald-700">Rating {mentor.rating.toFixed(1)}</p>
                        ) : null}
                      </div>
                      <Link
                        href="/networking/mentors/mentor-discovery"
                        className="rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        Book
                      </Link>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
