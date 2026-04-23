"use client";

import Link from "next/link";
import {
  BadgeCheck,
  BookOpen,
  ChevronDown,
  Clock3,
  Download,
  LayoutGrid,
  Layers3,
  Sparkles,
} from "lucide-react";
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

type ModuleQuestion = {
  id: string;
  question: string;
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

function buildQuestions(module: LearningModule): ModuleQuestion[] {
  return module.commonDoubts.slice(0, 3).map((question, index) => ({
    id: `${module.id}-question-${index + 1}`,
    question,
  }));
}

function ModuleCard({ module, featured = false }: { module: LearningModule; featured?: boolean }) {
  const questions = buildQuestions(module);

  return (
    <article
      className={`relative overflow-hidden rounded-[28px] border border-slate-600/80 bg-slate-900/65 shadow-[0_20px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
        featured ? "p-6 lg:p-7" : "p-5"
      }`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-teal-400/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 right-6 h-28 w-28 rounded-full bg-slate-100/5 blur-2xl" />

      <div className={`flex items-start gap-4 ${featured ? "pb-5" : "pb-4"}`}>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-teal-400/20 bg-slate-800/80 text-teal-200 shadow-inner shadow-black/10">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`${featured ? "text-2xl" : "text-lg"} font-semibold !text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)]`}>
              {module.title}
            </h3>
            <span className="rounded-full border border-teal-300/35 bg-teal-400/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] !text-white">
              In progress
            </span>
          </div>
          <p className={`mt-3 max-w-2xl text-sm leading-7 !text-white ${featured ? "sm:text-[15px]" : ""}`}>
            {module.summary}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {module.outcomes.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/25 bg-slate-950/55 px-3 py-1 text-[11px] font-semibold !text-white"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className={`mt-5 rounded-3xl border border-slate-600/80 bg-slate-950/60 ${featured ? "p-5" : "p-4"}`}>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] !text-white">Question deck</p>
            <p className="mt-1 text-sm !text-white">3 guided prompts with an Ask AI handoff</p>
          </div>
          <span className="rounded-full border border-teal-300/25 bg-teal-400/15 px-2.5 py-1 text-[11px] font-semibold !text-white">
            {module.commonDoubts.length} prompts
          </span>
        </div>

        <div className="space-y-2">
          {questions.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-600/80 bg-slate-900/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold leading-6 !text-teal-200">{item.question}</p>
              <Link
                href={`/networking/mentors/ai-assistant?prefill=${encodeURIComponent(item.question)}`}
                className="inline-flex shrink-0 items-center justify-center rounded-full border border-teal-300/30 bg-teal-400/15 px-3.5 py-2 text-xs font-semibold !text-white transition hover:border-teal-200/45 hover:bg-teal-400/22 hover:!text-white"
              >
                Ask AI
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 border-t border-slate-600/70 pt-4 text-xs !text-white">
        <div className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-teal-300" />
          <span className="!text-white">Estimated review time 12 - 20 min</span>
        </div>
        <div className="flex items-center gap-2 text-teal-200">
          <span className="!text-white">3 guided questions</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>
    </article>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-600/80 bg-slate-950/60 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-600 bg-slate-900 text-teal-200">
        {icon}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] !text-white">{label}</p>
        <p className="mt-1 text-sm font-semibold !text-white">{value}</p>
      </div>
    </div>
  );
}

export default function ModulesPage() {
  const featuredModule = modules[0];
  const secondaryModules = modules.slice(1);
  const totalQuestions = modules.length * 3;
  const totalOutcomes = modules.reduce((count, module) => count + module.outcomes.length, 0);

  return (
    <div className="relative min-h-screen bg-slate-950">
      <MentorHeader />

      <main className="relative z-10 mx-auto w-full max-w-7xl space-y-8 px-4 pb-10 pt-6 !text-white sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[32px] border border-slate-600/80 bg-slate-900/70 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl !text-white">
          <div className="grid gap-0 lg:grid-cols-12">
            <div className="relative lg:col-span-8 px-6 py-7 sm:px-7 lg:px-8 lg:py-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.1),transparent_30%)]" />
              <div className="relative">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] !text-white">
                  Curriculum &gt; Core Computer Science
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight !text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.45)] sm:text-4xl">
                  Learning Modules
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 !text-white sm:text-[15px]">
                  Master the foundational building blocks of software engineering with a curated sequence of high-performance learning tracks.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold !text-white">
                    {modules.length} modules
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold !text-white">
                    {totalQuestions} guided questions
                  </span>
                  <span className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold !text-white">
                    {totalOutcomes} outcomes mapped
                  </span>
                </div>
              </div>
            </div>

            <aside className="border-t border-slate-600/80 bg-slate-950/55 p-5 lg:col-span-4 lg:border-l lg:border-t-0 lg:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] !text-white">At a glance</p>
              <div className="mt-4 space-y-3">
                <StatCard icon={<Clock3 className="h-4 w-4" />} label="Total est. time" value={`${modules.length * 20} minutes`} />
                <StatCard icon={<BadgeCheck className="h-4 w-4" />} label="Completed modules" value={`${Math.min(4, modules.length)} / ${modules.length}`} />
                <StatCard icon={<Sparkles className="h-4 w-4" />} label="Guided prompts" value={`${totalQuestions} accordion questions`} />
              </div>

              <button
                type="button"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-500/80 bg-slate-900/90 px-4 py-3 text-sm font-semibold text-white transition hover:border-teal-400/40 hover:text-teal-50"
              >
                <Download className="h-4 w-4 text-teal-200" />
                Download Syllabus
              </button>
            </aside>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ModuleCard module={featuredModule} featured />
          </div>

          <aside className="lg:col-span-4 space-y-4">
            <div className="rounded-[28px] border border-slate-600/80 bg-slate-900/70 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl !text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] !text-white">Quick view</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-600/80 bg-slate-950/60 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] !text-white">Featured track</p>
                  <p className="mt-1 text-base font-semibold !text-white">{featuredModule.title}</p>
                  <p className="mt-2 text-sm leading-7 !text-white">{featuredModule.summary}</p>
                </div>
                <div className="rounded-2xl border border-slate-600/80 bg-slate-950/60 p-4">
                  <p className="text-[11px] uppercase tracking-[0.18em] !text-white">Question style</p>
                  <p className="mt-1 text-sm leading-7 !text-white">
                    Every module shows exactly three prompts with a direct Ask AI button for deeper help in the assistant page.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-600/80 bg-slate-900/70 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)] backdrop-blur-xl !text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] !text-white">Study flow</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-slate-600/80 bg-slate-950/60 p-4">
                  <p className="text-sm font-semibold !text-white">1. Review the module summary</p>
                  <p className="mt-1 text-sm leading-7 !text-white">Get the big picture before opening questions.</p>
                </div>
                <div className="rounded-2xl border border-slate-600/80 bg-slate-950/60 p-4">
                  <p className="text-sm font-semibold !text-white">2. Expand one question at a time</p>
                  <p className="mt-1 text-sm leading-7 !text-white">Use Ask AI to open the mentor assistant with that question prefilled.</p>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {secondaryModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </section>

        <section className="grid gap-5 lg:grid-cols-12">
          <div className="overflow-hidden rounded-[28px] border border-slate-600/80 bg-slate-900/70 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] !text-white lg:col-span-8">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-teal-300/25 bg-teal-400/15 text-teal-50">
                <BookOpen className="h-9 w-9" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] !text-white">Expert mentor</p>
                <h2 className="mt-2 text-2xl font-bold !text-white">Need deep-dive support?</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 !text-white">
                  Book a live mentor session when a module needs deeper explanation, extra practice, or a project-level walkthrough.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button type="button" className="rounded-full bg-teal-300 px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-teal-200">
                    Request Session
                  </button>
                  <button type="button" className="rounded-full border border-white/25 bg-slate-900/80 px-5 py-2.5 text-sm font-semibold !text-white transition hover:border-white/50 hover:!text-white">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:col-span-4">
            <div className="rounded-[28px] border border-slate-600/80 bg-slate-900/70 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)] !text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] !text-white">Prerequisites remaining</p>
              <div className="mt-4 space-y-3">
                {modules[0].commonDoubts.slice(0, 2).map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-600/80 bg-slate-950/60 p-3 text-sm !text-white">
                    <span className="mt-0.5 text-rose-300">×</span>
                    <span className="!text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-600/80 bg-slate-900/70 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.25)] !text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] !text-white">Suggested next steps</p>
              <div className="mt-4 space-y-3">
                {modules[1].tips.slice(0, 2).map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-600/80 bg-slate-950/60 p-3 text-sm !text-white">
                    <span className="mt-0.5 text-teal-300">•</span>
                    <span className="!text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
