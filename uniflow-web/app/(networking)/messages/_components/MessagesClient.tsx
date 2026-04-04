"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Download,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
} from "lucide-react";

type Mentor = {
  id: string;
  name: string;
  title: string;
  company: string;
  online: boolean;
};

type Attachment = {
  kind: "pdf";
  fileName: string;
  fileSize: string;
};

type ChatMessage = {
  id: string;
  sender: "mentor" | "user";
  text?: string;
  timeLabel: string;
  attachment?: Attachment;
  dateGroup: "yesterday" | "today";
};

type DbMessage = {
  id: string;
  sender: "mentor" | "user";
  text: string;
  created_at: string | null;
};

const MENTORS: Mentor[] = [
  {
    id: "alex-rivers",
    name: "Alex Rivers",
    title: "Senior Software Engineer at Google",
    company: "Google",
    online: true,
  },
  {
    id: "elena-vance",
    name: "Elena Vance",
    title: "Staff Engineer at Stripe",
    company: "Stripe",
    online: false,
  },
  {
    id: "marcus-chen",
    name: "Marcus Chen",
    title: "Software Engineer at Microsoft",
    company: "Microsoft",
    online: false,
  },
  {
    id: "sarah-jenkins",
    name: "Sarah Jenkins",
    title: "Engineering Manager at Meta",
    company: "Meta",
    online: false,
  },
];

function getMentorById(id: string | undefined | null): Mentor {
  return (
    MENTORS.find((m) => m.id === id) ??
    MENTORS[0]
  );
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (a + b).toUpperCase() || "U";
}

function fmtDateGroup(group: ChatMessage["dateGroup"]) {
  return group === "yesterday" ? "YESTERDAY" : "TODAY";
}

const CONVERSATIONS: Record<string, ChatMessage[]> = {
  "alex-rivers": [
    {
      id: "m1",
      sender: "mentor",
      text: "Hi there! I reviewed your proposed architecture for the cloud project. The use of S3 and CloudFront is a great start. Have you considered adding a WAF for security?",
      timeLabel: "10:24 AM",
      dateGroup: "yesterday",
    },
    {
      id: "m2",
      sender: "user",
      text: "Thanks Alex! I actually forgot about WAF. I’ll add that to the diagram tonight. Should I also look into AWS Shield for the basic DDoS protection or is the default enough?",
      timeLabel: "4:22 PM",
      dateGroup: "yesterday",
    },
    {
      id: "m3",
      sender: "mentor",
      text: "Default Shield is usually fine for most student projects. By the way, check out these AWS whitepapers on Serverless best practices. They’ll be very useful for your next module.",
      timeLabel: "10:24 AM",
      dateGroup: "today",
    },
    {
      id: "m4",
      sender: "mentor",
      attachment: { kind: "pdf", fileName: "AWS_Best_Practices_2024.pdf", fileSize: "24 MB" },
      timeLabel: "10:24 AM",
      dateGroup: "today",
    },
  ],
  "elena-vance": [
    {
      id: "e1",
      sender: "mentor",
      text: "Hi! I noticed your card layout and spacing. The hierarchy looks good—want me to review your empty states and loading skeleton next?",
      timeLabel: "Yesterday",
      dateGroup: "yesterday",
    },
  ],
  "marcus-chen": [
    {
      id: "m1",
      sender: "mentor",
      text: "Did you apply for the internship yet? If you want, share your DevOps resume bullets and I can help you tighten them.",
      timeLabel: "Tue",
      dateGroup: "today",
    },
  ],
  "sarah-jenkins": [
    {
      id: "s1",
      sender: "mentor",
      text: "Great progress on the SQL module. When you’re ready, share your query approach and I’ll help you optimize it for readability and performance.",
      timeLabel: "Oct 12",
      dateGroup: "today",
    },
  ],
};

function getLastPreview(messages: ChatMessage[] | undefined) {
  const msgs = messages ?? [];
  const last = msgs[msgs.length - 1];
  if (!last) return "";
  if (last.attachment?.kind === "pdf") return last.attachment.fileName;
  return last.text ?? "";
}

export default function MessagesClient({ selectedMentorId }: { selectedMentorId: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState("");
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>(
    CONVERSATIONS
  );
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [useDb, setUseDb] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const selectedMentor = useMemo(
    () => getMentorById(selectedMentorId),
    [selectedMentorId]
  );

  const selectedMessages = conversations[selectedMentor.id] ?? [];

  useEffect(() => {
    // Scroll to bottom whenever conversation changes.
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [selectedMentor.id, selectedMessages.length]);

  function computeTimeLabel(d: Date) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function computeDateGroup(d: Date): ChatMessage["dateGroup"] {
    const today = new Date();
    const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.round((t0.getTime() - d0.getTime()) / 86400000);
    if (diffDays === 1) return "yesterday";
    return "today";
  }

  function mapDbMessageToChat(m: DbMessage): ChatMessage {
    const created = m.created_at ? new Date(m.created_at) : new Date();
    return {
      id: m.id,
      sender: m.sender,
      text: m.text,
      timeLabel: computeTimeLabel(created),
      dateGroup: computeDateGroup(created),
    };
  }

  async function loadMessagesForMentor(mentorId: string) {
    try {
      const res = await fetch(`/api/messages/thread/${encodeURIComponent(mentorId)}`);
      if (!res.ok) return false;
      const payload = (await res.json()) as { messages: DbMessage[] };
      const mapped = (payload.messages ?? []).map(mapDbMessageToChat);
      setConversations((prev) => ({ ...prev, [mentorId]: mapped }));
      setUseDb(true);
      return true;
    } catch {
      return false;
    }
  }

  useEffect(() => {
    // Prefer Supabase when available; fall back to dummy conversations on error.
    void loadMessagesForMentor(selectedMentor.id);
  }, [selectedMentor.id]);

  const filteredMentors = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MENTORS;
    return MENTORS.filter((m) => {
      const preview = getLastPreview(conversations[m.id]);
      return (
        m.name.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        preview.toLowerCase().includes(q)
      );
    });
  }, [query, conversations]);

  async function sendMessage() {
    const text = composer.trim();
    if (!text) return;

    const optimistic: ChatMessage = {
      id: `u-${Math.random().toString(16).slice(2)}`,
      sender: "user",
      text,
      timeLabel: computeTimeLabel(new Date()),
      dateGroup: "today",
    };

    // Optimistic UI
    setConversations((prev) => ({
      ...prev,
      [selectedMentor.id]: [...(prev[selectedMentor.id] ?? []), optimistic],
    }));
    setComposer("");

    if (!useDb) return;

    try {
      const res = await fetch(
        `/api/messages/thread/${encodeURIComponent(selectedMentor.id)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );
      if (!res.ok) return;
      const payload = (await res.json()) as { message: DbMessage | null };
      const saved = payload.message;
      if (!saved) return;
      setConversations((prev) => {
        const list = prev[selectedMentor.id] ?? [];
        // Remove optimistic message and replace with DB-saved one.
        const withoutOptimistic = list.filter((m) => m.id !== optimistic.id);
        return {
          ...prev,
          [selectedMentor.id]: [...withoutOptimistic, mapDbMessageToChat(saved)],
        };
      });
    } catch {
      // If the request fails, optimistic message stays visible.
      return;
    }
  }

  async function updateMessage(messageId: string) {
    const text = editingText.trim();
    if (!text) return;

    // Optimistic update
    setConversations((prev) => {
      const list = prev[selectedMentor.id] ?? [];
      return {
        ...prev,
        [selectedMentor.id]: list.map((m) =>
          m.id === messageId ? { ...m, text } : m
        ),
      };
    });

    setEditingMessageId(null);
    setEditingText("");

    if (!useDb) return;
    try {
      const res = await fetch(`/api/messages/message/${encodeURIComponent(messageId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) return;
      const payload = (await res.json()) as { message: DbMessage | null };
      const updated = payload.message;
      if (!updated) return;

      setConversations((prev) => {
        const list = prev[selectedMentor.id] ?? [];
        return {
          ...prev,
          [selectedMentor.id]: list.map((m) =>
            m.id === messageId ? mapDbMessageToChat(updated) : m
          ),
        };
      });
    } catch {
      return;
    }
  }

  async function deleteMessage(messageId: string) {
    // Optimistic delete
    setConversations((prev) => {
      const list = prev[selectedMentor.id] ?? [];
      return {
        ...prev,
        [selectedMentor.id]: list.filter((m) => m.id !== messageId),
      };
    });

    if (!useDb) return;
    try {
      const res = await fetch(`/api/messages/message/${encodeURIComponent(messageId)}`, {
        method: "DELETE",
      });
      if (!res.ok) return;
      // No need to merge; optimistic delete already updated state.
    } catch {
      return;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-white/20">
              <span className="text-[14px] font-bold">U</span>
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold text-slate-900">UniFlow</div>
              <div className="truncate text-[11px] font-semibold uppercase tracking-wider text-indigo-500/90">
                Career & mentorship
              </div>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
            <Link className="hover:text-indigo-700" href="/dashboard">
              Dashboard
            </Link>
            <Link className="hover:text-indigo-700" href="/networking/mentors">
              Peer mentors
            </Link>
            <Link className="hover:text-indigo-700" href="/learning">
              Learning
            </Link>
            <Link className="hover:text-indigo-700" href="/networking">
              Community
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-[260px] rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div className="hidden md:flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200">
              <span className="text-xs text-slate-700">Bell</span>
            </div>
            <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-700">🙂</span>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="w-[320px] border-r border-slate-200 bg-white">
          <div className="px-5 py-4">
            <h2 className="text-base font-extrabold text-slate-900">Messages</h2>
          </div>

          <div className="px-5 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search mentors..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="overflow-auto px-2 pb-2" style={{ maxHeight: "calc(100vh - 140px)" }}>
            {filteredMentors.map((m) => {
              const msgs = conversations[m.id] ?? [];
              const preview = getLastPreview(msgs);
              const lastTime = msgs[msgs.length - 1]?.timeLabel ?? "";
              const active = m.id === selectedMentor.id;

              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => router.push(`/messages/${m.id}`)}
                  className={[
                    "w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition",
                    active ? "bg-indigo-50 ring-1 ring-indigo-100" : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="relative h-11 w-11 rounded-full bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-700">{initials(m.name)}</span>
                    <span
                      className={[
                        "absolute -right-0.5 bottom-0.5 h-3 w-3 rounded-full ring-2 ring-white",
                        m.online ? "bg-emerald-500" : "bg-slate-300",
                      ].join(" ")}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{m.name}</div>
                        <div className="truncate text-xs text-slate-500">{m.title}</div>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-400">{lastTime}</div>
                    </div>
                    <div className="mt-1 truncate text-xs text-slate-600">
                      {preview}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Chat */}
        <main className="flex-1 flex flex-col bg-white">
          <div className="border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative h-10 w-10 rounded-full bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
                  <span className="text-sm font-bold text-slate-700">{initials(selectedMentor.name)}</span>
                  <span
                    className={[
                      "absolute -right-0.5 bottom-0.5 h-3 w-3 rounded-full ring-2 ring-white",
                      selectedMentor.online ? "bg-emerald-500" : "bg-slate-300",
                    ].join(" ")}
                  />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold text-slate-900">
                    {selectedMentor.name}
                  </div>
                  <div className="truncate text-xs font-semibold text-slate-500">
                    {selectedMentor.title} • <span className="text-emerald-600">{selectedMentor.online ? "ONLINE" : "OFFLINE"}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  className="h-10 w-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center hover:bg-slate-50"
                  aria-label="More"
                >
                  <MoreHorizontal className="h-4 w-4 text-slate-700" />
                </button>
              </div>
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="flex-1 overflow-auto px-6 py-6"
            style={{ scrollBehavior: "smooth" }}
          >
            {selectedMessages.map((msg, idx) => {
              const prev = selectedMessages[idx - 1];
              const needsSeparator = !prev || prev.dateGroup !== msg.dateGroup;

              return (
                <div key={msg.id} className="mb-4">
                  {needsSeparator && (
                    <div className="flex justify-center mb-2">
                      <div className="rounded-full bg-slate-50 px-4 py-1 text-[11px] font-extrabold tracking-wider text-slate-400 ring-1 ring-slate-200">
                        {fmtDateGroup(msg.dateGroup)}
                      </div>
                    </div>
                  )}

                  <div
                    className={[
                      "flex",
                      msg.sender === "user" ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    {msg.attachment?.kind === "pdf" ? (
                      <div
                        className={[
                          "max-w-[520px] rounded-2xl px-4 py-3 ring-1",
                          msg.sender === "user"
                            ? "bg-indigo-600 text-white ring-indigo-600"
                            : "bg-slate-50 text-slate-900 ring-slate-200",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">
                              {msg.attachment.fileName}
                            </div>
                            <div className="text-[11px] opacity-80">{msg.attachment.fileSize} • PDF Document</div>
                          </div>
                          <button
                            type="button"
                            aria-label="Download"
                            className={[
                              "h-9 w-9 rounded-xl flex items-center justify-center ring-1",
                              msg.sender === "user"
                                ? "bg-white/15 ring-white/30"
                                : "bg-white ring-slate-200",
                            ].join(" ")}
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={[
                          "max-w-[520px] rounded-2xl px-4 py-3 text-sm ring-1",
                          msg.sender === "user"
                            ? "bg-indigo-600 text-white ring-indigo-600"
                            : "bg-white text-slate-900 ring-slate-200",
                        ].join(" ")}
                      >
                        {editingMessageId === msg.id ? (
                          <div className="flex flex-col gap-2">
                            <input
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm outline-none ring-1 ring-white/20"
                              autoFocus
                            />
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setEditingMessageId(null)}
                                className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-white/20 hover:bg-white/15"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => updateMessage(msg.id)}
                                className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                            <div className="mt-2 text-[11px] opacity-70 flex items-center justify-between gap-3">
                              <span>{msg.timeLabel}</span>
                              {msg.sender === "user" ? (
                                <span className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingMessageId(msg.id);
                                      setEditingText(msg.text ?? "");
                                    }}
                                    className="text-[11px] font-semibold underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const ok = window.confirm("Delete this message?");
                                      if (!ok) return;
                                      void deleteMessage(msg.id);
                                    }}
                                    className="text-[11px] font-semibold underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
                                  >
                                    Delete
                                  </button>
                                </span>
                              ) : null}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 ring-1 ring-slate-200 px-3 py-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="h-10 w-10 rounded-xl bg-white ring-1 ring-slate-200 flex items-center justify-center hover:bg-slate-50"
                  aria-label="Add"
                >
                  <Plus className="h-4 w-4 text-slate-700" />
                </button>
                <button
                  type="button"
                  className="h-10 w-10 rounded-xl bg-white ring-1 ring-slate-200 flex items-center justify-center hover:bg-slate-50"
                  aria-label="Emoji"
                >
                  <Smile className="h-4 w-4 text-slate-700" />
                </button>
                <button
                  type="button"
                  className="h-10 w-10 rounded-xl bg-white ring-1 ring-slate-200 flex items-center justify-center hover:bg-slate-50"
                  aria-label="Attachment"
                >
                  <Paperclip className="h-4 w-4 text-slate-700" />
                </button>
              </div>

              <input
                value={composer}
                onChange={(e) => setComposer(e.target.value)}
                placeholder={`Write a message to ${selectedMentor.name}...`}
                className="flex-1 bg-transparent px-2 py-1 text-sm outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />

              <button
                type="button"
                onClick={sendMessage}
                className="h-11 w-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm hover:bg-indigo-700 disabled:opacity-60 disabled:pointer-events-none"
                disabled={!composer.trim()}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

