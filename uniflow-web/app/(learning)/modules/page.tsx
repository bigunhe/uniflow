"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MentorHeader } from "@/app/(networking)/networking/mentors/_components/MentorHeader";

type LearningModule = {
  id: string;
  title: string;
  summary: string;
  outcomes: string[];
  commonDoubts: string[];
  tips: string[];
  resources: string[];
};

const modules: LearningModule[] = [
  {
    id: "data-structures",
    title: "Data Structures",
    summary: "Core collections, access patterns, and when to choose each structure.",
    outcomes: ["Pick the right DS", "Analyze time/space", "Implement from scratch"],
    commonDoubts: [
      "When to use a heap vs priority queue",
      "Why does a hash map collision happen",
      "Array vs linked list for inserts",
      "When to choose a trie vs hashmap",
      "How to design an LRU cache",
    ],
    tips: [
      "Map the dominant operation (lookup vs insert vs range query) to a structure",
      "Favor immutability for easier reasoning in functional flows",
      "Benchmark with real input sizes; big-O is not the whole story",
    ],
    resources: [
      "MIT 6.006 Lecture on Hashing",
      "UCSD Coursera: Data Structures performance cheatsheet",
      "NeetCode patterns: Sliding window & stacks",
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms",
    summary: "Sorting, searching, and problem-solving patterns with complexity tradeoffs.",
    outcomes: ["Trace code paths", "Big-O tradeoffs", "Pattern matching"],
    commonDoubts: [
      "Why binary search midpoint uses //",
      "When quicksort degrades to O(n^2)",
      "Greedy vs DP boundary cases",
      "How to pick the right graph traversal",
      "Detecting cycles and topological order",
    ],
    tips: [
      "Identify constraints first (n, edges, memory); that picks your approach",
      "Turn recursive into iterative with your own stack for clarity",
      "Prove correctness with invariants and base cases before coding",
    ],
    resources: [
      "CLRS chapters on Divide & Conquer",
      "CP Handbook: Graph patterns quick chart",
      "AlgoExpert patterns: Greedy vs DP decision tree",
    ],
  },
  {
    id: "databases",
    title: "Databases",
    summary: "Queries, joins, indexing, and schema design for reliable data access.",
    outcomes: ["Write optimized joins", "Design schemas", "Use indexes effectively"],
    commonDoubts: [
      "LEFT JOIN vs INNER JOIN for reports",
      "Why an index is not used",
      "How to avoid N+1 queries",
      "Choosing primary vs surrogate keys",
      "When to denormalize for analytics",
    ],
    tips: [
      "Read the EXPLAIN plan; don’t guess",
      "Covering indexes for hot read paths",
      "Batch writes and use transactions for consistency",
    ],
    resources: [
      "UseTheIndexLuke: Practical indexing",
      "Postgres EXPLAIN visualizer guide",
      "Fivetran: Normalization vs denormalization primer",
    ],
  },
  {
    id: "systems",
    title: "Systems & Networking",
    summary: "Concurrency, protocols, and scaling patterns for production systems.",
    outcomes: ["Reason about latency", "Identify bottlenecks", "Debug race conditions"],
    commonDoubts: [
      "When to use a queue vs pub/sub",
      "How TCP handles packet loss",
      "Why locks can deadlock",
      "CAP tradeoffs for reads vs writes",
      "Backpressure vs buffering design",
    ],
    tips: [
      "Draw sequence diagrams; they surface race conditions",
      "Measure tail latency (p95/p99), not just averages",
      "Add idempotency to all external calls",
    ],
    resources: [
      "Grokking Systems Design: queues & caches",
      "High Scalability blog: Backpressure patterns",
      "Julia Evans zines on networking",
    ],
  },
  {
    id: "frontend",
    title: "Frontend Engineering",
    summary: "UI architecture, state management, performance, and accessibility.",
    outcomes: ["Design state models", "Ship fast UIs", "Accessibility built-in"],
    commonDoubts: [
      "When to lift state vs context",
      "Why a React list re-renders",
      "How to memoize expensive components",
      "Managing forms with validation",
    ],
    tips: [
      "Co-locate state; promote only when multiple owners exist",
      "Use memoization for pure components with stable props",
      "Measure with React Profiler and Lighthouse",
    ],
    resources: [
      "Epic React: State management patterns",
      "Web.dev: Core Web Vitals guide",
      "A11y Project checklist",
    ],
  },
  {
    id: "backend",
    title: "Backend & APIs",
    summary: "Service design, API contracts, observability, and reliability.",
    outcomes: ["Design clean APIs", "Add observability", "Harden reliability"],
    commonDoubts: [
      "REST vs GraphQL for this use case",
      "How to design idempotent endpoints",
      "Zero-downtime deploy patterns",
      "Timeouts vs retries vs circuit breakers",
    ],
    tips: [
      "Document contracts first; code second",
      "Emit structured logs with correlation IDs",
      "Set sane timeouts and backoff defaults",
    ],
    resources: [
      "API Design book by Arnaud Lauret",
      "Honeycomb observability primers",
      "Release It! stability patterns",
    ],
  },
  {
    id: "ml",
    title: "Machine Learning Basics",
    summary: "Data prep, model selection, and evaluation without overfitting.",
    outcomes: ["Prep data", "Pick models", "Evaluate fairly"],
    commonDoubts: [
      "Train/val/test splits and leakage",
      "Choosing metrics for imbalance",
      "Regularization vs dropout",
      "Hyperparameter tuning basics",
    ],
    tips: [
      "Stratify splits when classes are imbalanced",
      "Baseline with simple models before deep nets",
      "Track experiments and seeds for reproducibility",
    ],
    resources: [
      "Andrew Ng ML notes",
      "Fast.ai practical tips",
      "Sklearn model evaluation guide",
    ],
  },
];

const askAiHref = (query: string) => `/networking/mentors/ai-assistant?prefill=${encodeURIComponent(query)}`;

export default function ModulesPage() {
  const [selectedId, setSelectedId] = useState(modules[0].id);
  const [studentDoubt, setStudentDoubt] = useState("");

  const selectedModule = useMemo(
    () => modules.find((mod) => mod.id === selectedId) ?? modules[0],
    [selectedId],
  );

  const matchedDoubt = useMemo(() => {
    const doubt = studentDoubt.trim().toLowerCase();
    if (!doubt) return null;
    return selectedModule.commonDoubts.find((item) => doubt.includes(item.toLowerCase()));
  }, [selectedModule, studentDoubt]);

  return (
    <div className="brand-dark-shell relative min-h-screen bg-slate-950">
      <MentorHeader />

      <main className="relative z-10 mx-auto w-full max-w-7xl space-y-8 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 rounded-3xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-500">Learning Modules</p>
          <h1 className="text-2xl font-bold text-slate-50">Plan your next session</h1>
          <p className="mt-1 text-sm text-slate-400">
            Browse modules, see common student doubts, and jump into Ask AI when a question matches.
          </p>
        </div>
        <Link
          href={askAiHref("Help me pick a module to start")}
          className="rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-teal-700"
        >
          Ask AI to Guide Me
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        <section className="lg:col-span-4 space-y-3">
          {modules.map((mod) => {
            const isActive = mod.id === selectedModule.id;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedId(mod.id)}
                className={`w-full rounded-2xl border px-4 py-4 text-left shadow-sm transition ${
                  isActive
                    ? "border-teal-400/70 bg-teal-500/15 shadow-[0_10px_24px_rgba(20,184,166,0.18)]"
                    : "border-slate-700 bg-slate-800/30 hover:border-teal-500/30 hover:bg-slate-800/50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-50">{mod.title}</p>
                <p className="mt-1 text-xs text-slate-400">{mod.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mod.outcomes.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-800/50 px-2.5 py-1 text-[11px] font-semibold text-teal-400 ring-1 ring-teal-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </section>

        <section className="lg:col-span-8 space-y-6 rounded-3xl border border-slate-700 bg-slate-900/40 backdrop-blur-sm p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">{selectedModule.title}</h2>
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
              Focused overview
            </span>
            <span className="rounded-full border border-slate-600 bg-slate-800/80 px-3 py-1 text-xs font-semibold text-slate-300">
              {selectedModule.commonDoubts.length} common doubts
            </span>
          </div>
          <p className="text-sm leading-relaxed text-slate-300">{selectedModule.summary}</p>

          <div className="space-y-2 rounded-2xl border border-slate-700/80 bg-slate-900/70 p-4">
            <h3 className="text-sm font-semibold text-slate-100">What you will learn</h3>
            <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
              {selectedModule.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-slate-100">Practical tips</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                {selectedModule.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
              <p className="text-sm font-semibold text-slate-100">Starter resources</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                {selectedModule.resources.map((res) => (
                  <li key={res}>{res}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100">Common student doubts</h3>
              <span className="rounded-full border border-slate-600 bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-300">
                Ask AI is fastest for these
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {selectedModule.commonDoubts.map((doubt) => (
                <div key={doubt} className="rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 shadow-sm">
                  <p className="text-sm font-semibold text-slate-100">{doubt}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-300">
                    <span>AI can draft a quick explanation</span>
                    <Link
                      href={askAiHref(doubt)}
                      className="rounded-full bg-indigo-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-indigo-500"
                    >
                      Ask AI
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-indigo-400/30 bg-indigo-500/10 px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-indigo-100">Your doubt</p>
              {matchedDoubt ? (
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  Matches a common doubt — launch Ask AI
                </span>
              ) : null}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={studentDoubt}
                onChange={(event) => setStudentDoubt(event.target.value)}
                placeholder="Describe your question"
                className="h-11 flex-1 rounded-xl border border-indigo-300/30 bg-slate-950/70 px-3 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200/30"
              />
              <Link
                href={askAiHref(studentDoubt || `Help me with ${selectedModule.title}`)}
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700"
              >
                Ask AI now
              </Link>
            </div>
            <p className="text-xs text-indigo-100/90">
              If your typed doubt matches a common one, we route you to Ask AI first to save time.
            </p>
          </div>
        </section>
      </div>
      </main>
    </div>
  );
}
