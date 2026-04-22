"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Download,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
} from "lucide-react";

type Student = {
  id: string;
  name: string;
  email: string;
  yearAndSemester: string;
  online?: boolean;
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

const STUDENTS: Student[] = [
  { id: "s1", name: "Emma Wilson", email: "emma@example.com", yearAndSemester: "3rd Year 1st Semester", online: true },
  { id: "s2", name: "James Carter", email: "james@example.com", yearAndSemester: "4th Year 2nd Semester", online: false },
  { id: "s3", name: "Sophia Lee", email: "sophia@example.com", yearAndSemester: "2nd Year 1st Semester", online: false },
];

function getDummyStudentById(id: string | undefined | null): Student {
  return STUDENTS.find((s) => s.id === id) ?? STUDENTS[0];
}

function initials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (a + b).toUpperCase() || "S";
}

function fmtDateGroup(group: ChatMessage["dateGroup"]) {
  return group === "yesterday" ? "YESTERDAY" : "TODAY";
}

function getLastPreview(messages: ChatMessage[] | undefined) {
  const msgs = messages ?? [];
  const last = msgs[msgs.length - 1];
  if (!last) return "";
  if (last.attachment?.kind === "pdf") return last.attachment.fileName;
  return last.text ?? "";
}

function computeTimeLabel(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MentorMessagesPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState("");
  const [mentorId, setMentorId] = useState<string>("demo-mentor");
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({});
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const [localStudents, setLocalStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  useEffect(() => {
    // Load student ID
    const storedStudents = localStorage.getItem('registeredStudents');
    let loadedStudents: Student[] = [];
    if (storedStudents) {
      try {
        loadedStudents = JSON.parse(storedStudents);
      } catch(e){}
    }
    setLocalStudents(loadedStudents);
    if (loadedStudents.length > 0) {
      setSelectedStudentId(loadedStudents[loadedStudents.length - 1].id);
    } else {
      setSelectedStudentId(STUDENTS[0].id);
    }

    // Load mentor ID
    const storedMentors = localStorage.getItem('registeredMentors');
    if (storedMentors) {
      try {
        const parsed = JSON.parse(storedMentors);
        if (parsed.length > 0) setMentorId(parsed[parsed.length - 1].id);
      } catch (e) {}
    }

    // Load global conversations
    const storedChats = localStorage.getItem('uniflow_chats');
    if (storedChats) {
      try {
        setConversations(JSON.parse(storedChats));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (Object.keys(conversations).length > 0) {
      localStorage.setItem('uniflow_chats', JSON.stringify(conversations));
    }
  }, [conversations]);

  const allStudents = useMemo(() => {
    // avoid duplicates if demo student is used
    const localIds = new Set(localStudents.map(s => s.id));
    const merged = [...localStudents, ...STUDENTS.filter(s => !localIds.has(s.id))];
    
    // Dynamically include any student who has sent a message to this mentor
    const knownIds = new Set(merged.map(s => s.id));
    const dynamicStudents: Student[] = [];

    for (const key of Object.keys(conversations)) {
      if (key.startsWith(mentorId + "_")) {
        const sId = key.split("_")[1];
        if (sId && !knownIds.has(sId)) {
          dynamicStudents.push({
            id: sId,
            name: sId === "demo-student" ? "Demo Student" : "Student " + sId,
            email: "student@example.com",
            yearAndSemester: "3rd Year 1st Semester",
            online: true,
          });
          knownIds.add(sId);
        }
      }
    }

    return [...merged, ...dynamicStudents];
  }, [localStudents, conversations, mentorId]);

  const selectedStudent = useMemo(
    () => allStudents.find((s) => s.id === selectedStudentId) ?? allStudents[0] ?? getDummyStudentById(selectedStudentId),
    [selectedStudentId, allStudents]
  );

  const selectedMessages = conversations[`${mentorId}_${selectedStudent.id}`] ?? [];

  useEffect(() => {
    // Scroll to bottom whenever conversation changes.
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [selectedStudent.id, selectedMessages.length]);

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allStudents;
    return allStudents.filter((s) => {
      const preview = getLastPreview(conversations[`${mentorId}_${s.id}`]);
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.yearAndSemester.toLowerCase().includes(q) ||
        preview.toLowerCase().includes(q)
      );
    });
  }, [query, conversations, allStudents, mentorId]);

  function sendMessage() {
    const text = composer.trim();
    if (!text) return;

    const optimistic: ChatMessage = {
      id: `m-${Math.random().toString(16).slice(2)}`,
      sender: "mentor", // Mentor sending
      text,
      timeLabel: computeTimeLabel(new Date()),
      dateGroup: "today",
    };

    setConversations((prev) => {
      const threadKey = `${mentorId}_${selectedStudent.id}`;
      return {
        ...prev,
        [threadKey]: [...(prev[threadKey] ?? []), optimistic],
      };
    });
    setComposer("");
  }

  function updateMessage(messageId: string) {
    const text = editingText.trim();
    if (!text) return;

    setConversations((prev) => {
      const threadKey = `${mentorId}_${selectedStudent.id}`;
      const list = prev[threadKey] ?? [];
      return {
        ...prev,
        [threadKey]: list.map((m) =>
          m.id === messageId ? { ...m, text } : m
        ),
      };
    });

    setEditingMessageId(null);
    setEditingText("");
  }

  function deleteMessage(messageId: string) {
    setConversations((prev) => {
      const threadKey = `${mentorId}_${selectedStudent.id}`;
      const list = prev[threadKey] ?? [];
      return {
        ...prev,
        [threadKey]: list.filter((m) => m.id !== messageId),
      };
    });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/mentor-dashboard" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm ring-1 ring-white/20">
                <span className="text-[14px] font-bold">FP</span>
              </div>
              <div className="min-w-0 hidden sm:block">
                <div className="truncate text-sm font-extrabold text-slate-900">uniflow</div>
                <div className="truncate text-[11px] font-semibold uppercase tracking-wider text-indigo-500/90">
                  Mentor Portal
                </div>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
            <Link className="hover:text-indigo-700" href="/mentor-dashboard">
              Dashboard
            </Link>
            <Link className="text-indigo-700" href="#">
              Inbox
            </Link>
            <Link className="hover:text-indigo-700" href="#">
              Mentees
            </Link>
            <Link className="hover:text-indigo-700" href="#">
              Community
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
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
            <h2 className="text-base font-extrabold text-slate-900">Student Inbox</h2>
          </div>

          <div className="px-5 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="overflow-auto px-2 pb-2" style={{ maxHeight: "calc(100vh - 140px)" }}>
            {filteredStudents.map((s) => {
              const msgs = conversations[`${mentorId}_${s.id}`] ?? [];
              const preview = getLastPreview(msgs);
              const lastTime = msgs[msgs.length - 1]?.timeLabel ?? "";
              const active = s.id === selectedStudent.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedStudentId(s.id)}
                  className={[
                    "w-full text-left px-3 py-3 rounded-xl flex items-center gap-3 transition",
                    active ? "bg-indigo-50 ring-1 ring-indigo-100" : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <div className="relative h-11 w-11 rounded-full bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center">
                    <span className="text-sm font-bold text-slate-700">{initials(s.name)}</span>
                    <span
                      className={[
                        "absolute -right-0.5 bottom-0.5 h-3 w-3 rounded-full ring-2 ring-white",
                        s.online ? "bg-emerald-500" : "bg-slate-300",
                      ].join(" ")}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{s.name}</div>
                        <div className="truncate text-xs text-slate-500">{s.yearAndSemester || "Student"}</div>
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
                  <span className="text-sm font-bold text-slate-700">{initials(selectedStudent.name)}</span>
                  <span
                    className={[
                      "absolute -right-0.5 bottom-0.5 h-3 w-3 rounded-full ring-2 ring-white",
                      selectedStudent.online ? "bg-emerald-500" : "bg-slate-300",
                    ].join(" ")}
                  />
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold text-slate-900">
                    {selectedStudent.name}
                  </div>
                  <div className="truncate text-xs font-semibold text-slate-500">
                    {selectedStudent.yearAndSemester || "Student"} • <span className="text-emerald-600">{selectedStudent.online ? "ONLINE" : "OFFLINE"}</span>
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
                      msg.sender === "mentor" ? "justify-end" : "justify-start",
                    ].join(" ")}
                  >
                    {msg.attachment?.kind === "pdf" ? (
                      <div
                        className={[
                          "max-w-[520px] rounded-2xl px-4 py-3 ring-1",
                          msg.sender === "mentor"
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
                              msg.sender === "mentor"
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
                          msg.sender === "mentor"
                            ? "bg-indigo-600 text-white ring-indigo-600"
                            : "bg-white text-slate-900 ring-slate-200",
                        ].join(" ")}
                      >
                        {editingMessageId === msg.id ? (
                          <div className="flex flex-col gap-2">
                            <input
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm outline-none ring-1 ring-white/20 text-white"
                              autoFocus
                            />
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setEditingMessageId(null)}
                                className="rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold ring-1 ring-white/20 hover:bg-white/15 text-white"
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
                            <div className={`mt-2 text-[10px] flex items-center justify-between gap-3 ${msg.sender === 'mentor' ? 'text-indigo-200' : 'text-slate-400'}`}>
                              <span>{msg.timeLabel}</span>
                              {msg.sender === "mentor" ? (
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
                placeholder={`Message ${selectedStudent.name}...`}
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
