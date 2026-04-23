"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, PencilLine, Trash2, X } from "lucide-react";
import MentorCard from "../_components/mentorCard";
import { mentorButtonClassName } from "../_components/MentorButton";
import { mentorProfiles } from "../_components/mentorData";
import { getUserRoleProfile } from "../_components/userRoleProfile";
import StressTips from "@/components/learning/ai/StressTips";
import MusicEmbed from "@/components/learning/ai/MusicEmbed";
import {
  listMentorBadges,
  listMentorRequests,
  refreshMentorBadges,
  updateMentorshipRequestStatus,
} from "@/services/mentorship";

const mentorStats = [
  { label: "Active Mentors", value: "120+" },
  { label: "Avg Mentor Rating", value: "4.8" },
  { label: "Completed Sessions", value: "3.2k" },
];

const studentStats = [
  { label: "Completed Sessions", value: "24" },
  { label: "Upcoming Sessions", value: "128" },
  { label: "Semester Goals", value: "72%" },
];

type MentorRequestRow = {
  id: string;
  status: "pending" | "accepted" | "rejected";
  meeting_link: string | null;
  student?: {
    full_name?: string | null;
    learning_goals?: string | null;
  } | null;
};

type MentorBadgeRow = {
  badge_name: string;
  criteria: string | null;
};

type Task = {
  id: string;
  text: string;
  status: "todo" | "in-progress" | "complete";
};

const taskStatusOptions: Array<{ value: Task["status"]; label: string; className: string }> = [
  { value: "todo", label: "Todo", className: "bg-slate-500/15 text-slate-200 border-slate-400/20" },
  { value: "in-progress", label: "In Progress", className: "bg-amber-400/15 text-amber-200 border-amber-300/20" },
  { value: "complete", label: "Complete", className: "bg-emerald-400/15 text-emerald-200 border-emerald-300/20" },
];

function StudyWorkspaceSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  const addTask = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        text: trimmed,
        status: "todo",
      },
    ]);
    setInput("");
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskText(task.text);
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  const saveEditedTask = (taskId: string) => {
    const trimmed = editingTaskText.trim();
    if (!trimmed) return;

    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, text: trimmed } : task)),
    );
    cancelEditingTask();
  };

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
    if (editingTaskId === taskId) {
      cancelEditingTask();
    }
  };

  return (
    <section id="study-workspace" className="space-y-6 rounded-3xl border border-slate-700 bg-slate-900/40 p-8 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Study Workspace</p>
        <h2 className="text-2xl font-bold text-slate-50">Focus Tools and Learning Tasks</h2>
        <p className="text-sm text-slate-400">
          Keep your study flow organized with a quick reset and a local task list.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
          <div>
            <p className="text-sm font-semibold text-slate-50">Focus Tools</p>
            <p className="mt-1 text-sm text-slate-400">
              Use these when you want a faster reset before asking the next question.
            </p>
          </div>

          <StressTips className="border-rose-900/25 bg-rose-950/15" />
          <MusicEmbed
            title="Lo-fi Study Mix"
            href="https://music.youtube.com/search?q=lofi+study+beats"
            description="Open a low-distraction mix while you work through the assistant prompts."
          />
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
          <div>
            <p className="text-sm font-semibold text-slate-50">Learning Tasks (CRUD)</p>
            <p className="mt-1 text-sm text-slate-400">Track action items</p>
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addTask();
                }
              }}
              placeholder="Add task"
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-teal-400/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={addTask}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Add
            </button>
          </div>

          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 px-4 py-5 text-sm text-slate-400">
                Add a task to start tracking your next steps.
              </div>
            ) : (
              tasks.map((task) => {
                const statusMeta = taskStatusOptions.find((option) => option.value === task.status) || taskStatusOptions[0];
                const isEditing = editingTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl border border-slate-700 bg-slate-950/50 p-4 ${task.status === "complete" ? "opacity-70" : "opacity-100"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        {isEditing ? (
                          <input
                            value={editingTaskText}
                            onChange={(event) => setEditingTaskText(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                saveEditedTask(task.id);
                              }
                              if (event.key === "Escape") {
                                cancelEditingTask();
                              }
                            }}
                            autoFocus
                            className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 focus:border-teal-400/40 focus:outline-none"
                          />
                        ) : (
                          <p className={`text-sm font-medium leading-6 text-slate-100 ${task.status === "complete" ? "line-through opacity-70" : ""}`}>
                            {task.text}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusMeta.className}`}>
                            {statusMeta.label}
                          </span>
                          <select
                            value={task.status}
                            onChange={(event) => updateTaskStatus(task.id, event.target.value as Task["status"])}
                            className="rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1.5 text-[11px] font-semibold text-slate-100 outline-none focus:border-teal-400/40"
                          >
                            {taskStatusOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => saveEditedTask(task.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/25 bg-emerald-400/10 text-emerald-200 transition hover:bg-emerald-400/15"
                              aria-label="Save task"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditingTask}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 text-slate-100 transition hover:bg-slate-800"
                              aria-label="Cancel edit"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEditingTask(task)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/60 text-slate-100 transition hover:border-teal-400/25 hover:bg-teal-400/10"
                            aria-label="Edit task"
                          >
                            <PencilLine className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => deleteTask(task.id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-400/20 bg-rose-500/10 text-rose-200 transition hover:bg-rose-500/15"
                          aria-label="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MentorsHomePage() {
  const [profile, setProfile] = useState(getUserRoleProfile());
  const [mentorRequests, setMentorRequests] = useState<MentorRequestRow[]>([]);
  const [mentorBadges, setMentorBadges] = useState<MentorBadgeRow[]>([]);

  useEffect(() => {
    const userProfile = getUserRoleProfile();
    setProfile(userProfile);

    if (userProfile?.role !== "mentor") {
      return;
    }

    const syncMentorData = async () => {
      try {
        const [requests, badges] = await Promise.all([
          listMentorRequests(),
          refreshMentorBadges(),
        ]);
        setMentorRequests(requests as MentorRequestRow[]);
        setMentorBadges((badges || []) as MentorBadgeRow[]);
      } catch {
        const requests = await listMentorRequests();
        const badges = await listMentorBadges();
        setMentorRequests(requests as MentorRequestRow[]);
        setMentorBadges((badges || []) as MentorBadgeRow[]);
      }
    };

    void syncMentorData();
  }, []);

  // Show student home page
  if (profile?.role === "student") {
    return (
      <div className="space-y-12">
        <section className="grid grid-cols-12 gap-6 rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-[0_20px_45px_rgba(0,0,0,0.32)] lg:p-10">
          <div className="col-span-12 space-y-5 lg:col-span-7">
            <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
              Hello, {profile.fullName}!
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-400">
              Ready for your next learning session? Browse available mentors, join study groups,
              or continue with your learning modules.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/networking/mentors/mentor-discovery"
                className={mentorButtonClassName({ size: "lg" })}
              >
                Find a Mentor
              </Link>
              <Link
                href="/learning/modules"
                className={mentorButtonClassName({ variant: "secondary", size: "lg" })}
              >
                Learning Modules
              </Link>
              <Link
                href="/networking/mentors/study-workspace"
                className={mentorButtonClassName({ variant: "ghost", size: "lg" })}
              >
                Focus Corner
              </Link>
            </div>
          </div>

          <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
            {studentStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-50">{item.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-50">Featured Mentors</h2>
              <p className="mt-1 text-sm text-slate-400">
                Connect with experienced mentors in your field of study.
              </p>
            </div>
            <Link
              href="/networking/mentors/mentor-discovery"
              className="text-sm font-semibold text-teal-400 hover:text-teal-300"
            >
              View all mentors
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {mentorProfiles.slice(0, 3).map((mentor) => (
              <MentorCard key={mentor.slug} mentor={mentor} />
            ))}
          </div>
        </section>

        <section className="space-y-6 rounded-3xl border border-slate-700 bg-slate-900/40 p-8 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Start here</p>
            <h2 className="text-2xl font-bold text-slate-50">Support Hub</h2>
            <p className="text-sm text-slate-400">
              Ask AI first to get instant answers. If you still need help, jump into a session with a mentor.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#4f46e5_0%,#6366f1_45%,#22c1c3_100%)] p-6 text-white shadow-[0_18px_40px_rgba(99,102,241,0.35)] lg:col-span-2">
              <div className="pointer-events-none absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute bottom-4 right-4 h-24 w-24 rounded-full bg-white/10 blur-xl" />

              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3 md:max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-indigo-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                    AI assistant ready
                  </span>
                  <h3 className="text-3xl font-black leading-tight">Ask AI First</h3>
                  <p className="text-sm text-indigo-100/90">
                    Get instant answers to academic and career questions in seconds. Great for quick clarity before booking a live mentor.
                  </p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-indigo-50/90">
                    <span className="rounded-full bg-white/10 px-3 py-1">Study guidance</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">Project help</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">Career advice</span>
                  </div>
                </div>

                <Link
                  href="/networking/mentors/ai-assistant"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Start AI Chat
                </Link>
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-700 bg-slate-900/70 p-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Need a human?</p>
                <h3 className="text-xl font-bold text-slate-50">Still need help?</h3>
                <p className="text-sm text-slate-400">
                  If AI did not fully solve it, connect with a mentor for 1-on-1 support.
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <Link
                  href="/networking/mentors/mentor-discovery"
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Book a Mentor
                </Link>

                <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
                  <Link
                    href="/networking/mentors/messages"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-slate-300 transition hover:bg-slate-800"
                  >
                    My Messages
                  </Link>
                  <Link
                    href="/learning/modules"
                    className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-slate-300 transition hover:bg-slate-800"
                  >
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Show mentor home page
  if (profile?.role === "mentor") {
    const pendingRequests = mentorRequests
      .filter((request) => request.status === "pending")
      .slice(0, 2);
    const acceptedRequests = mentorRequests.filter((request) => request.status === "accepted");
    const studentsHelped = new Set(
      acceptedRequests.map((request) => request.student?.full_name || request.id),
    ).size;

    const mentorHubStats = [
      { label: "Active Sessions", value: String(acceptedRequests.length), badge: "Accepted" },
      { label: "Incoming Requests", value: String(pendingRequests.length), badge: "Pending" },
      { label: "Students Helped", value: String(studentsHelped), highlight: true },
      {
        label: "Badge Count",
        value: String(mentorBadges.length),
        badge: mentorBadges[0]?.badge_name || "Mentor",
      },
    ];

    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.35)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-50">Mentor Hub</h1>
              <p className="mt-1 text-base text-slate-400">
                Welcome back. You have {pendingRequests.length || 0} pending mentorship requests.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-300">A</span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-300">B</span>
              <span className="inline-flex h-8 items-center justify-center rounded-full bg-teal-600/20 px-2 text-xs font-semibold text-teal-400">+8</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {mentorHubStats.map((item) => (
              <div
                key={item.label}
                className={item.highlight
                  ? "rounded-2xl bg-[linear-gradient(135deg,#4f46e5_0%,#4338ca_100%)] p-5 text-white"
                  : "rounded-2xl border border-slate-700 bg-slate-900/70 p-5"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <p className={item.highlight ? "text-xs uppercase tracking-wide text-indigo-100" : "text-xs uppercase tracking-wide text-slate-400"}>{item.label}</p>
                  {item.badge ? (
                    <span className={item.highlight
                      ? "rounded-full bg-indigo-300/30 px-2 py-0.5 text-[10px] font-semibold text-white"
                      : "rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300"
                    }>
                      {item.badge}
                    </span>
                  ) : null}
                </div>
                <p className={item.highlight ? "mt-4 text-4xl font-black tracking-tight" : "mt-4 text-4xl font-black tracking-tight text-slate-50"}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-slate-50">Incoming Requests</h2>
              <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-indigo-200">
                {pendingRequests.length} New
              </span>
            </div>

            <div className="space-y-3">
              {pendingRequests.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-600 p-4 text-sm text-slate-400">
                  No pending requests right now.
                </div>
              ) : (
                pendingRequests.map((request, index) => (
                  <article
                    key={request.id}
                    className={index === 0
                      ? "rounded-xl border border-rose-400/30 bg-rose-500/10 p-4"
                      : "rounded-xl border border-indigo-400/30 bg-indigo-500/10 p-4"
                    }
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-100">{request.student?.full_name || "Student"}</p>
                        <p className="text-xs text-slate-400">Mentorship request</p>
                      </div>
                      <span className={index === 0
                        ? "rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-rose-300"
                        : "rounded-full bg-slate-700 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-300"
                      }>
                        {index === 0 ? "Urgent" : "Normal"}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-300">{request.student?.learning_goals || "Learning goals not provided."}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => void updateMentorshipRequestStatus(request.id, "accepted")}
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 text-xs font-semibold text-white transition hover:bg-indigo-700"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() => void updateMentorshipRequestStatus(request.id, "rejected")}
                        className="inline-flex h-9 items-center justify-center rounded-lg bg-slate-800/70 text-xs font-semibold text-slate-300 transition hover:bg-slate-800"
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <Link href="/networking/mentors/request-management" className="mt-4 inline-flex text-sm font-semibold text-teal-400 hover:text-teal-300">
              View all requests
            </Link>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight text-slate-50">Active Sessions</h2>
                <Link href="/networking/mentors/live-session" className="text-sm font-semibold text-teal-400 hover:text-teal-300">
                  View Calendar
                </Link>
              </div>

              <div className="space-y-2.5">
                {acceptedRequests.slice(0, 3).map((session, index) => (
                  <article key={session.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-11 w-11 flex-col items-center justify-center rounded-lg bg-indigo-500/20 text-[10px] font-bold leading-tight text-indigo-200">
                          ACC
                          <span className="text-xs">EPT</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-100">Session with {session.student?.full_name || "Student"}</p>
                          <p className="text-xs text-slate-400">Accepted mentorship</p>
                        </div>
                      </div>

                      {index === 0 ? (
                        <Link href={`/networking/mentors/live-session?requestId=${session.id}`} className="inline-flex h-9 items-center justify-center rounded-lg bg-indigo-600 px-3 text-xs font-semibold text-white transition hover:bg-indigo-700">Join Room</Link>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-300">
                          Ready
                        </span>
                      )}
                    </div>
                  </article>
                ))}
                {acceptedRequests.length === 0 ? (
                  <article className="rounded-xl border border-dashed border-slate-600 p-3.5 text-sm text-slate-400">
                    No active sessions yet. Accept requests to start mentorship sessions.
                  </article>
                ) : null}
              </div>
            </div>

            <article className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-sm">
              <p className="text-lg font-semibold text-slate-100">Mentor Badges</p>
              {mentorBadges.length === 0 ? (
                <p className="mt-1 text-sm text-slate-400">Complete more sessions to unlock badges.</p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {mentorBadges.map((badge) => (
                    <span key={badge.badge_name} className="rounded-full border border-indigo-400/40 bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-200">
                      {badge.badge_name}
                    </span>
                  ))}
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-50">Quick Actions</h2>
            <div className="flex gap-2">
              <Link href="/networking/mentors/messages" className="inline-flex h-10 items-center rounded-lg border border-slate-700 bg-slate-800/70 px-4 text-sm font-semibold text-slate-300 hover:bg-slate-800">Messages</Link>
              <Link href="/networking/mentors/study-workspace" className="inline-flex h-10 items-center rounded-lg border border-slate-700 bg-slate-800/70 px-4 text-sm font-semibold text-slate-300 hover:bg-slate-800">Study Workspace</Link>
              <Link href="/networking/mentors/live-session" className="inline-flex h-10 items-center rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700">New Session</Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Default view if not logged in
  return (
    <div className="space-y-12">
      <section className="grid grid-cols-12 gap-6 rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-sm lg:p-10">
        <div className="col-span-12 space-y-5 lg:col-span-7">
          <p className="inline-flex rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-200">
            Mentor Marketplace
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-50 sm:text-5xl">
            Build skills faster with focused, real-world mentors.
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-400">
            Explore verified mentors, compare expertise, and request guidance based on your goals.
            The flow is designed for clear discovery, profile review, and support requests.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/networking/mentors/mentor-discovery"
              className={mentorButtonClassName({ size: "lg" })}
            >
              Browse Mentors
            </Link>
            <Link
              href="/networking/mentors/mentor-dashboard"
              className={mentorButtonClassName({ variant: "secondary", size: "lg" })}
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
          {mentorStats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
              <p className="text-sm text-slate-400">{item.label}</p>
              <p className="mt-1 text-3xl font-bold text-slate-50">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-50">Featured Mentors</h2>
            <p className="mt-1 text-sm text-slate-400">
              Start with top-rated mentors and move to full listing for more options.
            </p>
          </div>
          <Link
            href="/networking/mentors/mentor-discovery"
            className="text-sm font-semibold text-teal-400 hover:text-teal-300"
          >
            View all mentors
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {mentorProfiles.slice(0, 3).map((mentor) => (
            <MentorCard key={mentor.slug} mentor={mentor} />
          ))}
        </div>
      </section>
    </div>
  );
}
