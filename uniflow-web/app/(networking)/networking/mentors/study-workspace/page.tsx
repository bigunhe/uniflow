"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, PencilLine, Trash2, X } from "lucide-react";
import StressTips from "@/components/learning/ai/StressTips";
import MusicEmbed from "@/components/learning/ai/MusicEmbed";

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

function StudyWorkspacePanel() {
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
    <section className="space-y-6 rounded-3xl border border-slate-700 bg-slate-900/40 p-6 shadow-sm sm:p-8">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Study Workspace</p>
        <h2 className="text-2xl font-bold text-slate-50 sm:text-3xl">Focus Tools and Learning Tasks</h2>
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

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-700 bg-slate-950/40 px-4 py-3 text-sm text-slate-400">
        <span>Need a faster reset? Use Focus Tools before adding your next task.</span>
        <Link
          href="/networking/mentors/home"
          className="inline-flex items-center rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 font-semibold text-slate-200 transition hover:border-teal-400/30 hover:text-white"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
}

export default function StudyWorkspacePage() {
  return (
    <div className="min-h-screen bg-[#080c14] px-4 py-6 text-[#f0f4fb] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        <div className="rounded-[2rem] border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur xl:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7df1e1]">Study Workspace</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white sm:text-5xl">Focus Tools and Learning Tasks</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[rgba(220,228,240,0.82)] sm:text-base">
            Use this page to reset quickly and keep your action items organized without leaving the mentor hub.
          </p>
        </div>

        <StudyWorkspacePanel />
      </div>
    </div>
  );
}
