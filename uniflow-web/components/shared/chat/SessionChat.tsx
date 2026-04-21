"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { SessionMessage } from "@/models/message";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { listSessionMessages, sendMessage, subscribeToSessionMessages } from "@/services/realtime";

type SessionChatProps = {
  sessionId: string;
  userId: string;
};

export function SessionChat({ sessionId, userId }: SessionChatProps) {
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabase();

    async function loadMessages() {
      try {
        const data = await listSessionMessages(sessionId);
        setMessages(data);
      } finally {
        setLoading(false);
      }
    }

    void loadMessages();

    const channel = subscribeToSessionMessages(supabase, sessionId, loadMessages);

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [sessionId]);

  const canSend = useMemo(() => content.trim().length > 0, [content]);

  async function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;

    const next = content.trim();
    setContent("");
    await sendMessage(sessionId, userId, next);
  }

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-4 shadow-sm">
      <h3 className="text-base font-bold text-slate-50">Session Chat</h3>
      <div className="mt-3 h-72 space-y-2 overflow-y-auto rounded-lg border border-slate-700 bg-slate-950/50 p-3">
        {loading ? <p className="text-sm text-slate-400">Loading messages...</p> : null}
        {!loading && messages.length === 0 ? (
          <p className="text-sm text-slate-400">No messages yet. Start the discussion.</p>
        ) : null}
        {messages.map((message) => {
          const isCurrentUser = message.sender_id === userId;
          return (
            <article
              key={message.id}
              className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                isCurrentUser
                  ? "ml-auto bg-teal-600 text-white"
                  : "bg-slate-800/50 text-slate-200 border border-slate-700"
              }`}
            >
              {message.content}
            </article>
          );
        })}
      </div>
      <form onSubmit={handleSend} className="mt-3 flex gap-2">
        <input
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Type your message"
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:border-teal-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!canSend}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Send
        </button>
      </form>
    </section>
  );
}
