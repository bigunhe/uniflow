"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { DashboardShell } from "@/components/shared/layout/DashboardShell";

type ChatItem = {
  role: "user" | "assistant";
  content: string;
};

export default function StudentAskAIPage() {
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ id: string; full_name: string }>>([]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = prompt.trim();
    if (!text) return;

    setLoading(true);

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);
    setPrompt("");

    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify({ messages: nextMessages }),
    });

    const data = await response.json();

    if (response.ok) {
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
      setSuggestions(data.suggestions || []);
    } else {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.error || "AI request failed. Please try again." },
      ]);
    }

    setLoading(false);
  }

  return (
    <DashboardShell
      role="student"
      title="Ask AI"
      subtitle="Use AI first, then escalate to mentor support when needed."
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-96 space-y-2 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">Ask a question to start your AI tutoring chat.</p>
          ) : null}
          {messages.map((message, index) => (
            <article
              key={`${message.role}-${index}`}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                message.role === "user"
                  ? "ml-auto bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {message.content}
            </article>
          ))}
        </div>

        <form onSubmit={onSubmit} className="mt-3 flex gap-2">
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="e.g. Explain quicksort with an example"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Link
            href="/student/request"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Still need help? Request a mentor
          </Link>
          <Link
            href="/student/urgent"
            className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
          >
            Urgent help
          </Link>
        </div>
      </section>

      {suggestions.length > 0 ? (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">Suggested Mentors</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {suggestions.map((mentor) => (
              <article key={mentor.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                <p className="font-semibold text-slate-900">{mentor.full_name || "Mentor"}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </DashboardShell>
  );
}
