"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  CheckCheck,
  CirclePlus,
  MoreVertical,
  Pencil,
  Paperclip,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react";
import {
  getGuidanceRequests,
  GuidanceRequest,
} from "../_components/guidanceRequests";
import {
  getUserRoleProfile,
  UserRoleProfile,
} from "../_components/userRoleProfile";

type ChatThread = {
  id: string;
  title: string;
  participantName: string;
  course: string;
  subject: string;
  status: "active" | "preview";
  createdAt: string;
  updatedAt: string;
};

type ChatMessage = {
  id: string;
  sender: "student" | "mentor";
  senderName?: string;
  text: string;
  createdAt: string;
  editedAt?: string;
  status: "sent" | "delivered" | "seen";
  attachment?: MessageAttachment | null;
};

type MessageAttachment = {
  name: string;
  type: string;
  size: number;
  dataUrl: string;
};

type LearningTask = {
  id: string;
  threadId: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  createdAt: string;
};

const THREADS_STORAGE_KEY = "uniflow-chat-threads-v2";
const MESSAGES_STORAGE_KEY = "uniflow-chat-messages-v2";
const TASKS_STORAGE_KEY = "uniflow-chat-learning-tasks-v2";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
  return `${Math.round(bytes / 104857.6) / 10} MB`;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.readAsDataURL(file);
  });
}

function getConversationIdFromRequest(request: GuidanceRequest) {
  return `${request.mentorSlug}::${request.studentName.toLowerCase().replace(/\s+/g, "-")}`;
}

function buildSeedThreads(
  requests: GuidanceRequest[],
  roleProfile: UserRoleProfile | null,
): ChatThread[] {
  const accepted = requests.filter((request) => request.status === "accepted");

  if (accepted.length > 0) {
    return accepted.map((request) => {
      const isMentor = roleProfile?.role === "mentor";
      return {
        id: getConversationIdFromRequest(request),
        title: request.topic,
        participantName: isMentor ? request.studentName : request.mentorName,
        course: "Mentor Program",
        subject: request.topic,
        status: "active",
        createdAt: request.createdAt,
        updatedAt: request.createdAt,
      };
    });
  }

  const now = new Date().toISOString();
  const fallbackParticipant =
    roleProfile?.role === "mentor" ? "Alex Johnson" : "Ava Thompson";

  return [
    {
      id: "preview-conversation",
      title: "Guidance Preview",
      participantName: fallbackParticipant,
      course: "Guidance Preview",
      subject: "Accept a guidance request to start live mentor-student chat",
      status: "preview",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function getStoredThreads() {
  if (typeof window === "undefined") return [] as ChatThread[];
  return safeParse<ChatThread[]>(window.localStorage.getItem(THREADS_STORAGE_KEY), []);
}

function saveStoredThreads(next: ChatThread[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THREADS_STORAGE_KEY, JSON.stringify(next));
}

function getStoredMessages() {
  if (typeof window === "undefined") return {} as Record<string, ChatMessage[]>;
  return safeParse<Record<string, ChatMessage[]>>(
    window.localStorage.getItem(MESSAGES_STORAGE_KEY),
    {},
  );
}

function saveStoredMessages(next: Record<string, ChatMessage[]>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(next));
}

function getStoredTasks() {
  if (typeof window === "undefined") return [] as LearningTask[];
  return safeParse<LearningTask[]>(window.localStorage.getItem(TASKS_STORAGE_KEY), []);
}

function saveStoredTasks(next: LearningTask[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(next));
}

export default function MentorMessagesPage() {
  const [requests, setRequests] = useState<GuidanceRequest[]>([]);
  const [roleProfile, setRoleProfile] = useState<UserRoleProfile | null>(null);

  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [messagesByThread, setMessagesByThread] = useState<Record<string, ChatMessage[]>>({});
  const [tasks, setTasks] = useState<LearningTask[]>([]);

  const [search, setSearch] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [pendingAttachment, setPendingAttachment] = useState<MessageAttachment | null>(null);

  const [newThreadTitle, setNewThreadTitle] = useState("");

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageText, setEditingMessageText] = useState("");
  const [openMessageMenuId, setOpenMessageMenuId] = useState<string | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  const messagePaneRef = useRef<HTMLDivElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const syncRequests = () => setRequests(getGuidanceRequests());
    syncRequests();
    window.addEventListener("guidance-requests-updated", syncRequests);
    return () => {
      window.removeEventListener("guidance-requests-updated", syncRequests);
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

  useEffect(() => {
    const storedThreads = getStoredThreads();
    const storedMessages = getStoredMessages();
    const storedTasks = getStoredTasks();

    const seeds = buildSeedThreads(getGuidanceRequests(), getUserRoleProfile());
    const nextThreads = storedThreads.length > 0 ? storedThreads : seeds;

    setThreads(nextThreads);
    setSelectedThreadId(nextThreads[0]?.id ?? "");
    setMessagesByThread(storedMessages);
    setTasks(storedTasks);
  }, []);

  useEffect(() => {
    const seeded = buildSeedThreads(requests, roleProfile).filter(
      (thread) => thread.status === "active",
    );

    if (seeded.length === 0) {
      return;
    }

    setThreads((prev) => {
      const existingIds = new Set(prev.map((thread) => thread.id));
      const missing = seeded.filter((thread) => !existingIds.has(thread.id));
      if (missing.length === 0) {
        return prev;
      }
      const next = [...missing, ...prev];
      saveStoredThreads(next);
      return next;
    });
  }, [requests, roleProfile]);

  useEffect(() => {
    if (!selectedThreadId && threads.length > 0) {
      setSelectedThreadId(threads[0].id);
      return;
    }

    if (selectedThreadId && !threads.some((thread) => thread.id === selectedThreadId)) {
      setSelectedThreadId(threads[0]?.id ?? "");
    }
  }, [threads, selectedThreadId]);

  useEffect(() => {
    const pane = messagePaneRef.current;
    if (!pane) return;
    pane.scrollTop = pane.scrollHeight;
  }, [selectedThreadId, messagesByThread]);

  useEffect(() => {
    const syncFromStorage = () => {
      setThreads(getStoredThreads());
      setMessagesByThread(getStoredMessages());
      setTasks(getStoredTasks());
    };

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("uniflow-chat-updated", syncFromStorage as EventListener);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("uniflow-chat-updated", syncFromStorage as EventListener);
    };
  }, []);

  useEffect(() => {
    const activeThread = threads.find((thread) => thread.id === selectedThreadId) ?? null;
    if (!activeThread) {
      return;
    }

    const senderRole: ChatMessage["sender"] = roleProfile?.role === "mentor" ? "mentor" : "student";

    updateMessages((prev) => {
      const next = { ...prev };
      const threadMessages = next[activeThread.id] ?? [];
      let changed = false;

      next[activeThread.id] = threadMessages.map((message) => {
        if (message.sender === senderRole) {
          return message;
        }

        const nextStatus = activeThread.id === selectedThreadId ? "seen" : "delivered";
        if (message.status === nextStatus) {
          return message;
        }

        changed = true;
        return { ...message, status: nextStatus };
      });

      return changed ? next : prev;
    });
  }, [selectedThreadId, threads, roleProfile]);

  const acceptedRequest = useMemo(
    () => requests.find((request) => request.status === "accepted"),
    [requests],
  );

  const filteredThreads = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return threads;

    return threads.filter((thread) => {
      const messages = messagesByThread[thread.id] ?? [];
      const lastText = messages[messages.length - 1]?.text ?? "";
      return [thread.title, thread.participantName, thread.subject, thread.course, lastText]
        .join(" ")
        .toLowerCase()
        .includes(term);
    });
  }, [search, threads, messagesByThread]);

  const selectedThread = useMemo(() => {
    return threads.find((thread) => thread.id === selectedThreadId) ?? null;
  }, [threads, selectedThreadId]);

  const selectedMessages = useMemo(() => {
    if (!selectedThread) return [];

    const existing = messagesByThread[selectedThread.id];
    if (existing && existing.length > 0) {
      return existing;
    }

    const now = new Date().toISOString();
    return [
      {
        id: `${selectedThread.id}-seed-1`,
        sender: "student",
        text: `Hi, I need help with ${selectedThread.subject.toLowerCase()}.`,
        createdAt: now,
        status: "seen",
      },
      {
        id: `${selectedThread.id}-seed-2`,
        sender: "mentor",
        text: "Great. Share your current attempt and I will guide you step by step.",
        createdAt: now,
        status: "seen",
      },
    ] as ChatMessage[];
  }, [selectedThread, messagesByThread]);

  const selectedTasks = useMemo(() => {
    if (!selectedThread) return [];
    return tasks.filter((task) => task.threadId === selectedThread.id);
  }, [tasks, selectedThread]);

  const currentSender: ChatMessage["sender"] =
    roleProfile?.role === "mentor" ? "mentor" : "student";

  const currentUserName =
    roleProfile?.fullName?.trim() ||
    (currentSender === "mentor" ? "Mentor" : "Student");

  const otherUserName =
    selectedThread?.participantName?.trim() ||
    (currentSender === "mentor" ? "Student" : "Mentor");

  const getFallbackSenderName = (sender: ChatMessage["sender"]) =>
    sender === currentSender ? currentUserName : otherUserName;

  const canMessage = Boolean(acceptedRequest || selectedThread?.status === "preview");

  const updateThreads = (updater: (prev: ChatThread[]) => ChatThread[]) => {
    setThreads((prev) => {
      const next = updater(prev);
      saveStoredThreads(next);
      return next;
    });
  };

  const updateMessages = (
    updater: (prev: Record<string, ChatMessage[]>) => Record<string, ChatMessage[]>,
  ) => {
    setMessagesByThread((prev) => {
      const next = updater(prev);
      saveStoredMessages(next);
      return next;
    });
  };

  const updateTasks = (updater: (prev: LearningTask[]) => LearningTask[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      saveStoredTasks(next);
      return next;
    });
  };

  const handleCreateThread = () => {
    const trimmed = newThreadTitle.trim();
    if (!trimmed) return;

    const now = new Date().toISOString();
    const threadId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const nextThread: ChatThread = {
      id: threadId,
      title: trimmed,
      participantName: roleProfile?.role === "mentor" ? "New Student" : "New Mentor",
      course: "Custom Thread",
      subject: trimmed,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    updateThreads((prev) => [nextThread, ...prev]);
    setSelectedThreadId(threadId);
    setNewThreadTitle("");
  };

  const handleDeleteThread = (threadId: string) => {
    updateThreads((prev) => prev.filter((thread) => thread.id !== threadId));

    updateMessages((prev) => {
      const next = { ...prev };
      delete next[threadId];
      return next;
    });

    updateTasks((prev) => prev.filter((task) => task.threadId !== threadId));

    if (selectedThreadId === threadId) {
      const fallback = threads.find((thread) => thread.id !== threadId);
      setSelectedThreadId(fallback?.id ?? "");
    }
  };

  const handleSendMessage = () => {
    if (!selectedThread || (!draftMessage.trim() && !pendingAttachment)) return;

    const now = new Date().toISOString();
    const nextMessage: ChatMessage = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      sender: currentSender,
      senderName: currentUserName,
      text: draftMessage.trim(),
      createdAt: now,
      status: "sent",
      attachment: pendingAttachment,
    };

    updateMessages((prev) => ({
      ...prev,
      [selectedThread.id]: [...(prev[selectedThread.id] ?? []), nextMessage],
    }));

    updateThreads((prev) =>
      prev.map((thread) =>
        thread.id === selectedThread.id ? { ...thread, updatedAt: now } : thread,
      ),
    );

    setDraftMessage("");
    setPendingAttachment(null);
  };

  const handleAttachmentSelect = async (file: File | null) => {
    if (!file) return;

    const dataUrl = await readFileAsDataUrl(file);
    setPendingAttachment({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      dataUrl,
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!selectedThread) return;

    updateMessages((prev) => ({
      ...prev,
      [selectedThread.id]: (prev[selectedThread.id] ?? []).filter(
        (message) => message.id !== messageId,
      ),
    }));
  };

  const handleStartEditMessage = (message: ChatMessage) => {
    setEditingMessageId(message.id);
    setEditingMessageText(message.text);
    setOpenMessageMenuId(null);
  };

  const handleSaveMessageEdit = () => {
    if (!selectedThread || !editingMessageId || !editingMessageText.trim()) return;

    const now = new Date().toISOString();
    updateMessages((prev) => ({
      ...prev,
      [selectedThread.id]: (prev[selectedThread.id] ?? []).map((message) =>
        message.id === editingMessageId
          ? {
              ...message,
              text: editingMessageText.trim(),
              editedAt: now,
            }
          : message,
      ),
    }));

    setEditingMessageId(null);
    setEditingMessageText("");
  };

  useEffect(() => {
    if (!openMessageMenuId) {
      return;
    }

    const closeMenu = () => setOpenMessageMenuId(null);
    window.addEventListener("click", closeMenu);

    return () => {
      window.removeEventListener("click", closeMenu);
    };
  }, [openMessageMenuId]);

  const handleCreateTask = () => {
    if (!selectedThread || !newTaskTitle.trim()) return;

    const nextTask: LearningTask = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      threadId: selectedThread.id,
      title: newTaskTitle.trim(),
      status: "todo",
      createdAt: new Date().toISOString(),
    };

    updateTasks((prev) => [nextTask, ...prev]);
    setNewTaskTitle("");
  };

  const handleCycleTaskStatus = (taskId: string) => {
    const order: LearningTask["status"][] = ["todo", "in_progress", "done"];

    updateTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) return task;
        const nextIndex = (order.indexOf(task.status) + 1) % order.length;
        return { ...task, status: order[nextIndex] };
      }),
    );
  };

  const handleStartEditTask = (task: LearningTask) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const handleSaveTaskEdit = () => {
    if (!editingTaskId || !editingTaskTitle.trim()) return;

    updateTasks((prev) =>
      prev.map((task) =>
        task.id === editingTaskId ? { ...task, title: editingTaskTitle.trim() } : task,
      ),
    );

    setEditingTaskId(null);
    setEditingTaskTitle("");
  };

  const handleDeleteTask = (taskId: string) => {
    updateTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  return (
    <section className="relative -mx-2 h-[calc(100vh-7.5rem)] min-h-[680px] overflow-hidden rounded-3xl bg-[#080c14] p-3">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(0,210,180,0.12),transparent_35%),radial-gradient(circle_at_90%_5%,rgba(99,102,241,0.12),transparent_28%)]" aria-hidden />

      <div className="relative grid h-full min-h-0 grid-cols-1 gap-3 lg:grid-cols-[260px_minmax(0,1fr)_320px]">
        <aside className="hidden min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-[#02071b] lg:flex">
          <div className="border-b border-slate-800 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Chats
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Pick a conversation or start a new one
                </p>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                {threads.length}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-2.5 py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
              <input
                value={newThreadTitle}
                onChange={(event) => setNewThreadTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleCreateThread();
                  }
                }}
                placeholder="Start a new chat"
                className="h-9 flex-1 bg-transparent px-1 text-sm text-slate-100 outline-none placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={handleCreateThread}
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-500"
              >
                <CirclePlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3">
            <ul className="space-y-2">
              {filteredThreads.map((thread) => {
                const isActive = selectedThread?.id === thread.id;
                const lastMessage = (messagesByThread[thread.id] ?? []).slice(-1)[0];

                return (
                  <li
                    key={thread.id}
                    className={`rounded-2xl border p-3 transition ${
                      isActive
                        ? "border-indigo-400/70 bg-indigo-500/15 shadow-[0_10px_26px_rgba(99,102,241,0.12)]"
                        : "border-slate-800/80 bg-slate-950/45 hover:border-slate-600 hover:bg-slate-950/60"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedThreadId(thread.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-100">
                            {thread.participantName}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-slate-400">
                            {thread.title}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            isActive
                              ? "bg-indigo-500/20 text-indigo-200"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {isActive ? "Active" : "Chat"}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                        {lastMessage?.text ?? thread.subject}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteThread(thread.id)}
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20 hover:text-white"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-t border-slate-800 p-4">
            <p className="text-[11px] text-slate-400">Welcome back</p>
            <p className="text-sm font-semibold text-slate-100">
              {roleProfile?.fullName ?? "User"}
            </p>
          </div>
        </aside>

        <main className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)]">
          <header className="border-b border-white/8 px-4 py-3 sm:px-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#f0f4fb]">
                  {selectedThread?.participantName ?? "No chat selected"}
                </p>
                <p className="text-xs text-[rgba(168,184,208,0.85)]">
                  {selectedThread
                    ? `${roleProfile?.role === "mentor" ? "Mentor" : "Student"} view • ${selectedThread.course} • ${selectedThread.subject}`
                    : "Choose a conversation to continue the shared thread"}
                </p>
              </div>

              <div className="flex w-full max-w-[260px] items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                <Search className="h-4 w-4 text-[rgba(168,184,208,0.85)]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search"
                  className="h-5 w-full bg-transparent text-sm text-[#f0f4fb] outline-none placeholder:text-[rgba(168,184,208,0.6)]"
                />
              </div>
            </div>

          </header>

          <div ref={messagePaneRef} className="flex-1 space-y-4 overflow-y-auto bg-[rgba(8,12,20,0.72)] px-4 py-5 sm:px-7">
            {selectedMessages.map((message) => {
              const isOwn = message.sender === currentSender;
              const isEditing = editingMessageId === message.id;
              const senderName =
                message.senderName?.trim() || getFallbackSenderName(message.sender);

              return (
                <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className={`relative max-w-[82%] rounded-2xl border px-4 py-3 shadow-sm ${isOwn ? "border-[#00d2b4]/30 bg-black/90 text-white" : "border-white/15 bg-black/80 text-white"}`}>
                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingMessageText}
                          onChange={(event) => setEditingMessageText(event.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-sm text-white outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSaveMessageEdit}
                            className="rounded bg-emerald-600 px-2 py-1 text-xs font-semibold text-white"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMessageId(null);
                              setEditingMessageText("");
                            }}
                            className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/70">
                            {senderName}
                          </p>
                          <p className="text-sm leading-relaxed">{message.text}</p>

                          {message.attachment ? (
                            <a
                              href={message.attachment.dataUrl}
                              download={message.attachment.name}
                              target="_blank"
                              rel="noreferrer"
                              className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-left text-xs transition ${isOwn ? "border-white/20 bg-white/10 text-white" : "border-white/15 bg-black/45 text-white hover:bg-black/60"}`}
                            >
                              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-current">
                                <Paperclip className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate font-semibold">{message.attachment.name}</span>
                                <span className="text-white/80">
                                  {formatFileSize(message.attachment.size)}
                                </span>
                              </span>
                            </a>
                          ) : null}
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-white/80">
                          <span>{formatTime(message.createdAt)}</span>
                          <span className="inline-flex items-center gap-1">
                            {message.editedAt ? <span>edited</span> : null}
                            {isOwn ? (
                              <span className="inline-flex items-center gap-1 uppercase tracking-wide">
                                {message.status === "sent" ? <Check className="h-3 w-3" /> : null}
                                {message.status === "delivered" ? <CheckCheck className="h-3 w-3" /> : null}
                                {message.status === "seen" ? <CheckCheck className="h-3 w-3 text-emerald-300" /> : null}
                                {message.status}
                              </span>
                            ) : null}
                          </span>
                        </div>

                        {isOwn ? (
                          <div className="absolute right-2 top-2">
                            <div className="relative">
                              <button
                                type="button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setOpenMessageMenuId((current) =>
                                    current === message.id ? null : message.id,
                                  );
                                }}
                                className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${isOwn ? "border-white/20 bg-white/10 text-white" : "border-white/10 bg-white/5 text-[rgba(232,238,248,0.78)]"}`}
                                aria-label="Message options"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>

                              {openMessageMenuId === message.id ? (
                                <div
                                  className="absolute right-0 top-9 z-20 w-32 overflow-hidden rounded-xl border border-white/8 bg-[rgba(10,14,22,0.96)] shadow-lg"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleStartEditMessage(message)}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-[rgba(232,238,248,0.88)] hover:bg-white/5"
                                  >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-white/8 bg-[rgba(10,14,22,0.92)] px-4 py-3 sm:px-6 sm:py-4">
            {pendingAttachment ? (
              <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-xs text-[rgba(232,238,248,0.86)]">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#f0f4fb]">{pendingAttachment.name}</p>
                  <p>{formatFileSize(pendingAttachment.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingAttachment(null)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-[rgba(232,238,248,0.78)] hover:bg-white/12"
                  aria-label="Remove attachment"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : null}

            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <input
                ref={attachmentInputRef}
                type="file"
                className="hidden"
                onChange={async (event) => {
                  await handleAttachmentSelect(event.target.files?.[0] ?? null);
                  event.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => attachmentInputRef.current?.click()}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[rgba(232,238,248,0.78)] transition hover:bg-white/8"
                aria-label="Attach file"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <input
                type="text"
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write a clear message to your mentor or student"
                className="h-10 flex-1 bg-transparent text-sm text-[#f0f4fb] outline-none placeholder:text-[rgba(168,184,208,0.6)]"
                disabled={!canMessage}
              />
              <button
                type="button"
                onClick={handleSendMessage}
                disabled={!canMessage || (!draftMessage.trim() && !pendingAttachment)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#00d2b4] to-[#6366f1] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:bg-white/10"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            {!acceptedRequest ? (
              <p className="mt-2 text-xs text-[rgba(168,184,208,0.85)]">
                Shared chat preview is active. Accept a guidance request to switch this thread into live mentor-student messaging.
              </p>
            ) : null}
          </div>
        </main>

        <aside className="hidden min-h-0 flex-col overflow-y-auto rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.03)] p-4 lg:flex">
          <h2 className="text-sm font-semibold text-[#f0f4fb]">Learning Tasks (CRUD)</h2>
          <p className="mt-1 text-xs text-[rgba(168,184,208,0.85)]">
            Track action items for {selectedThread?.participantName ?? "this chat"}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <input
              value={newTaskTitle}
              onChange={(event) => setNewTaskTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleCreateTask();
                }
              }}
              placeholder="Add task"
              className="h-9 flex-1 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-[#f0f4fb] outline-none ring-[#00d2b4] focus:ring-2"
            />
            <button
              type="button"
              onClick={handleCreateTask}
              className="rounded-lg bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-3 py-2 text-xs font-semibold text-white"
            >
              Add
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {selectedTasks.map((task) => {
              const isEditing = editingTaskId === task.id;
              return (
                <li key={task.id} className="rounded-xl border border-white/8 bg-white/5 p-3">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        value={editingTaskTitle}
                        onChange={(event) => setEditingTaskTitle(event.target.value)}
                        className="h-8 w-full rounded border border-white/10 bg-white/5 px-2 text-sm text-[#f0f4fb] outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleSaveTaskEdit}
                          className="rounded bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTaskId(null);
                            setEditingTaskTitle("");
                          }}
                          className="rounded bg-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-[#f0f4fb]">{task.title}</p>
                      <p className="mt-1 text-[11px] text-[rgba(168,184,208,0.85)]">{formatDateShort(task.createdAt)}</p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCycleTaskStatus(task.id)}
                          className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-[rgba(232,238,248,0.9)]"
                        >
                          {task.status === "todo"
                            ? "To Do"
                            : task.status === "in_progress"
                              ? "In Progress"
                              : "Done"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEditTask(task)}
                          className="rounded border border-indigo-400/30 bg-indigo-500/20 px-2 py-1 text-[11px] font-semibold text-indigo-200"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="rounded border border-rose-400/30 bg-rose-500/20 px-2 py-1 text-[11px] font-semibold text-rose-200"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </section>
  );
}
