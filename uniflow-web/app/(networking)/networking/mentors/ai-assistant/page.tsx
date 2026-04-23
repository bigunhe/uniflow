"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { CheckCheck, Send, Sparkles } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

type SuggestedMentor = {
  id?: string;
  full_name?: string;
  rating?: number;
  subject_tags?: string[];
};

type LocalQaItem = {
  question: string;
  answer: string;
  keywords: string[];
  mentors: SuggestedMentor[];
};

const starterPrompts = [
  "Explain this concept like I'm new to it",
  "Give me 3 practice questions with answers",
  "Help me debug this code step-by-step",
  "Create a quick study plan for this topic",
];

const defaultMentors: SuggestedMentor[] = [
  {
    id: "mentor-ds-1",
    full_name: "Noah Khan",
    rating: 4.8,
    subject_tags: ["Data Structures", "Algorithms"],
  },
  {
    id: "mentor-sys-1",
    full_name: "Liam Garcia",
    rating: 4.7,
    subject_tags: ["Systems", "Backend"],
  },
  {
    id: "mentor-fe-1",
    full_name: "Ava Thompson",
    rating: 4.9,
    subject_tags: ["Frontend", "Projects"],
  },
];

const localQa: LocalQaItem[] = [
  {
    question: "When to use a heap vs priority queue",
    answer:
      "Use a priority queue when you need an abstract interface (push, pop best). A heap is the most common implementation of that interface. In interviews and most codebases, you typically say priority queue as the feature and heap as the underlying structure.",
    keywords: ["heap", "priority queue", "pq"],
    mentors: [defaultMentors[0]],
  },
  {
    question: "Why does a hash map collision happen",
    answer:
      "Collisions happen because multiple keys can map to the same bucket index after hashing. Good hash functions and resizing reduce collisions, but cannot remove them entirely. Collision handling is done with chaining or open addressing.",
    keywords: ["hash map", "hashmap", "collision", "bucket"],
    mentors: [defaultMentors[0]],
  },
  {
    question: "Array vs linked list for inserts",
    answer:
      "If you insert mostly at known node positions with a node reference, linked lists can be O(1). Arrays are better for indexed access and cache locality, but middle inserts are O(n) due to shifting. In practice, arrays often win unless frequent middle insert/delete dominates.",
    keywords: ["array", "linked list", "insert", "inserts"],
    mentors: [defaultMentors[0]],
  },
  {
    question: "When to choose a trie vs hashmap",
    answer:
      "Choose trie for prefix queries, autocomplete, and dictionary-like prefix traversal. Choose hashmap for exact key lookup with simpler implementation. Trie uses more memory but gives efficient prefix operations.",
    keywords: ["trie", "hashmap", "hash map", "prefix", "autocomplete"],
    mentors: [defaultMentors[0]],
  },
  {
    question: "How to design an LRU cache",
    answer:
      "Classic LRU uses a hashmap + doubly linked list. Hashmap gives O(1) key lookup, list tracks recency. On get/put move node to head; evict from tail when capacity is exceeded.",
    keywords: ["lru", "cache", "evict", "doubly linked list"],
    mentors: [defaultMentors[0], defaultMentors[1]],
  },
  {
    question: "Why binary search midpoint uses //",
    answer:
      "Indices must stay integers, so midpoint uses integer division. Prefer mid = left + Math.floor((right - left) / 2) to avoid overflow patterns and keep intent clear.",
    keywords: ["binary search", "midpoint", "//", "floor"],
    mentors: [defaultMentors[0]],
  },
  {
    question: "When quicksort degrades to O(n^2)",
    answer:
      "Quicksort degrades when pivot choices are consistently poor, creating highly unbalanced partitions (like already sorted arrays with naive pivot). Randomized pivot or median-of-three reduces this risk.",
    keywords: ["quicksort", "o(n^2)", "pivot", "partition"],
    mentors: [defaultMentors[0]],
  },
  {
    question: "Greedy vs DP boundary cases",
    answer:
      "Use greedy when local optimal choices can be proven to lead to global optimum. Use DP when overlapping subproblems and optimal substructure exist but greedy can fail on edge combinations. Test small counterexamples to validate greedy.",
    keywords: ["greedy", "dp", "dynamic programming", "boundary"],
    mentors: [defaultMentors[0]],
  },
  {
    question: "How to pick the right graph traversal",
    answer:
      "Use BFS for shortest path in unweighted graphs and level-order problems. Use DFS for path existence, cycle checks, and structural exploration. For weighted shortest path, use Dijkstra instead.",
    keywords: ["graph", "traversal", "bfs", "dfs", "dijkstra"],
    mentors: [defaultMentors[0], defaultMentors[1]],
  },
  {
    question: "Detecting cycles and topological order",
    answer:
      "For directed graphs, detect cycles using DFS color states or Kahn's algorithm. Topological ordering exists only in DAGs. If Kahn cannot process all nodes, a cycle exists.",
    keywords: ["cycle", "topological", "dag", "kahn"],
    mentors: [defaultMentors[0], defaultMentors[1]],
  },
  {
    question: "LEFT JOIN vs INNER JOIN for reports",
    answer:
      "Use INNER JOIN when you only want matching rows from both tables. Use LEFT JOIN when you must keep all rows from the left table even if right-side data is missing, which is common in reporting.",
    keywords: ["left join", "inner join", "join", "report"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "Why an index is not used",
    answer:
      "The planner may skip an index if selectivity is poor, stats are stale, or the query shape prevents index use (functions on indexed columns, type mismatch, leading wildcard). Check EXPLAIN ANALYZE and update stats.",
    keywords: ["index", "not used", "explain", "planner"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "How to avoid N+1 queries",
    answer:
      "Use eager loading / joins to fetch related entities in batches. Aggregate IDs and fetch once rather than per-row. In APIs, consider data loader patterns to batch per request.",
    keywords: ["n+1", "query", "eager loading", "batch"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "Choosing primary vs surrogate keys",
    answer:
      "Natural keys encode business meaning but can change. Surrogate keys are stable and simpler for references. A common pattern is surrogate PK + unique constraint on natural business fields.",
    keywords: ["primary key", "surrogate", "natural key", "keys"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "When to denormalize for analytics",
    answer:
      "Denormalize for read-heavy analytics where fewer joins improve performance and simpler querying matters. Keep normalized source-of-truth for writes, then create reporting models/materialized views.",
    keywords: ["denormalize", "analytics", "normalization", "materialized"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "When to use a queue vs pub/sub",
    answer:
      "Use queues for work distribution where one consumer processes each message. Use pub/sub when multiple consumers should receive the same event. Queue = task dispatch, pub/sub = event broadcast.",
    keywords: ["queue", "pub/sub", "pubsub", "event"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "How TCP handles packet loss",
    answer:
      "TCP detects loss via timeouts or duplicate ACKs and retransmits missing segments. Congestion control then adjusts sending rate (slow start, congestion avoidance) to stabilize the network.",
    keywords: ["tcp", "packet loss", "ack", "retransmit", "congestion"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "Why locks can deadlock",
    answer:
      "Deadlocks happen when threads wait on each other in a circular dependency. Prevent with consistent lock order, timeouts, smaller critical sections, or lock-free/concurrent structures where possible.",
    keywords: ["lock", "deadlock", "threads", "critical section"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "CAP tradeoffs for reads vs writes",
    answer:
      "Under partition, you choose consistency or availability. Favor consistency for correctness-critical writes; favor availability for low-risk reads with eventual consistency. Select by business tolerance for stale data.",
    keywords: ["cap", "consistency", "availability", "partition"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "Backpressure vs buffering design",
    answer:
      "Buffering absorbs short spikes; backpressure slows producers when consumers lag. Good systems use bounded buffers and explicit backpressure to avoid memory blowups under sustained overload.",
    keywords: ["backpressure", "buffer", "buffering", "throughput"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "When to lift state vs context",
    answer:
      "Lift state to the nearest common owner when a few components share it. Use context for cross-tree state consumed in many places. Avoid global context for local concerns.",
    keywords: ["lift state", "context", "react state"],
    mentors: [defaultMentors[2]],
  },
  {
    question: "Why a React list re-renders",
    answer:
      "Lists re-render when parent state changes, keys are unstable, or props references change each render. Use stable keys and memoized child components/handlers where it matters.",
    keywords: ["react list", "re-render", "rerender", "keys", "memo"],
    mentors: [defaultMentors[2]],
  },
  {
    question: "How to memoize expensive components",
    answer:
      "Use React.memo for pure children, useMemo for expensive computed values, and useCallback for stable function props. Profile first; memoization helps only when re-render cost is significant.",
    keywords: ["memoize", "react.memo", "usememo", "usecallback"],
    mentors: [defaultMentors[2]],
  },
  {
    question: "Managing forms with validation",
    answer:
      "Track touched + errors separately, validate on blur/submit, and provide clear field-level messages. Consider schema validation to keep client/server checks aligned.",
    keywords: ["forms", "validation", "errors", "schema"],
    mentors: [defaultMentors[2]],
  },
  {
    question: "REST vs GraphQL for this use case",
    answer:
      "REST is simpler and cache-friendly for stable resources. GraphQL is powerful when clients need flexible data shapes and want to avoid over/under-fetching. Team familiarity and tooling should guide the choice.",
    keywords: ["rest", "graphql", "api"],
    mentors: [defaultMentors[1], defaultMentors[2]],
  },
  {
    question: "How to design idempotent endpoints",
    answer:
      "Use idempotency keys for create/payment-like requests, store request outcomes, and return the same result for retries. PUT is naturally idempotent; POST can be made idempotent with keys.",
    keywords: ["idempotent", "endpoint", "retry", "idempotency key"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "Zero-downtime deploy patterns",
    answer:
      "Common patterns: blue-green, rolling updates, and canary releases. Ensure backward-compatible DB migrations and health checks before shifting traffic.",
    keywords: ["zero downtime", "deploy", "blue-green", "rolling", "canary"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "Timeouts vs retries vs circuit breakers",
    answer:
      "Set timeouts to bound latency, retries with backoff for transient failures, and circuit breakers to stop cascading failures. Apply retries only to idempotent operations.",
    keywords: ["timeout", "retries", "circuit breaker", "backoff"],
    mentors: [defaultMentors[1]],
  },
  {
    question: "Train/val/test splits and leakage",
    answer:
      "Keep train/validation/test sets strictly separated in time and features. Leakage occurs when future or target-derived information enters training. Build preprocessing pipelines using train data only.",
    keywords: ["train", "validation", "test", "leakage", "split"],
    mentors: [
      {
        id: "mentor-ml-1",
        full_name: "Mia Patel",
        rating: 4.8,
        subject_tags: ["Machine Learning", "Data"],
      },
    ],
  },
  {
    question: "Choosing metrics for imbalance",
    answer:
      "Accuracy can mislead on imbalanced data. Use precision, recall, F1, PR-AUC, and confusion matrix. Choose metric based on business cost of false positives vs false negatives.",
    keywords: ["metrics", "imbalance", "precision", "recall", "f1"],
    mentors: [
      {
        id: "mentor-ml-1",
        full_name: "Mia Patel",
        rating: 4.8,
        subject_tags: ["Machine Learning", "Data"],
      },
    ],
  },
  {
    question: "Regularization vs dropout",
    answer:
      "Regularization (L1/L2) penalizes large weights directly; dropout randomly disables neurons during training to reduce co-adaptation. Both reduce overfitting and can be combined.",
    keywords: ["regularization", "dropout", "overfitting", "l1", "l2"],
    mentors: [
      {
        id: "mentor-ml-1",
        full_name: "Mia Patel",
        rating: 4.8,
        subject_tags: ["Machine Learning", "Data"],
      },
    ],
  },
  {
    question: "Hyperparameter tuning basics",
    answer:
      "Start with a strong baseline, tune high-impact parameters first, and use validation metrics with fixed random seeds. Random search often outperforms manual grid on limited budgets.",
    keywords: ["hyperparameter", "tuning", "random search", "grid"],
    mentors: [
      {
        id: "mentor-ml-1",
        full_name: "Mia Patel",
        rating: 4.8,
        subject_tags: ["Machine Learning", "Data"],
      },
    ],
  },
];

function normalizeText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function buildFallbackReply(question: string) {
  const q = normalizeText(question);

  if (q.includes("pick") && q.includes("module")) {
    return {
      reply:
        "Good first picks:\n1) Data Structures for coding interview foundations.\n2) Algorithms for problem-solving speed.\n3) Databases if you are building apps this semester.\n\nTell me your goal (interviews, project, exam), and I will suggest a focused 1-week plan.",
      mentors: [defaultMentors[0], defaultMentors[2]],
    };
  }

  if (q.includes("study plan") || q.includes("quick plan")) {
    return {
      reply:
        "Quick 5-day study plan:\nDay 1: Learn core concept + 3 examples\nDay 2: Solve 5 easy questions\nDay 3: Solve 3 medium questions\nDay 4: Review mistakes + summarize patterns\nDay 5: Timed practice and recap notes\n\nIf you name your exact topic, I can customize this in detail.",
      mentors: [defaultMentors[0]],
    };
  }

  if (q.includes("debug") || q.includes("error") || q.includes("bug")) {
    return {
      reply:
        "Debug checklist:\n1) Reproduce consistently\n2) Read full error + stack trace\n3) Isolate smallest failing input\n4) Check assumptions with logs\n5) Patch and add one regression test\n\nPaste the exact error and code snippet, and I will walk step-by-step.",
      mentors: [defaultMentors[2], defaultMentors[1]],
    };
  }

  if (q.includes("practice question") || q.includes("practice questions")) {
    return {
      reply:
        "Sure. Here are 3 practice prompts:\n1) Design an LRU cache with O(1) get/put.\n2) Compare BFS vs DFS with a real use case.\n3) Optimize a JOIN query with EXPLAIN output.\n\nAsk for solutions and I will provide model answers.",
      mentors: [defaultMentors[0], defaultMentors[1]],
    };
  }

  return {
    reply:
      "I can answer many common learning questions right now. Try asking short specific queries like: 'heap vs priority queue', 'why N+1', 'deadlock', 'React list rerender', or 'train val test leakage'.",
    mentors: defaultMentors,
  };
}

function resolveLocalQa(question: string) {
  const normalizedQuestion = normalizeText(question);

  let best: LocalQaItem | null = null;
  let bestScore = 0;

  for (const item of localQa) {
    const normalizedItemQuestion = normalizeText(item.question);
    let score = 0;

    if (normalizedQuestion.includes(normalizedItemQuestion)) {
      score += 10;
    }

    for (const keyword of item.keywords) {
      if (normalizedQuestion.includes(normalizeText(keyword))) {
        score += 2;
      }
    }

    if (score > bestScore) {
      best = item;
      bestScore = score;
    }
  }

  if (!best || bestScore < 2) {
    return null;
  }

  return {
    reply: best.answer,
    mentors: best.mentors.length > 0 ? best.mentors : defaultMentors,
  };
}

export default function MentorAiAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm your AI tutor. Ask about coursework, projects, debugging, or career prep and I’ll help you move forward.",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestedMentors, setSuggestedMentors] = useState<SuggestedMentor[]>([]);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    const prefill = searchParams.get("prefill")?.trim();
    if (!prefill) return;
    setInput(prefill);
  }, [searchParams]);

  const canSend = useMemo(() => !loading && input.trim().length > 0, [input, loading]);

  const sendMessage = async (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: trimmed, createdAt: new Date().toISOString() },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError(null);

    const localMatch = resolveLocalQa(trimmed);
    if (localMatch) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: localMatch.reply, createdAt: new Date().toISOString() },
      ]);
      setSuggestedMentors(localMatch.mentors.slice(0, 3));
      setLoading(false);
      return;
    }

    const localFallback = buildFallbackReply(trimmed);
    if (localFallback) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: localFallback.reply, createdAt: new Date().toISOString() },
      ]);
      setSuggestedMentors(localFallback.mentors.slice(0, 3));
      setLoading(false);
      return;
    }

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

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, createdAt: new Date().toISOString() },
      ]);
      setSuggestedMentors(mentors.slice(0, 3));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I hit an issue reaching the AI. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-[#f0f4fb]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-10%] top-[-8%] h-72 w-72 rounded-full bg-[#00d2b4]/14 blur-3xl" />
        <div className="absolute right-[-8%] top-16 h-72 w-72 rounded-full bg-[#6366f1]/14 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/8 bg-[rgba(255,255,255,0.03)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur xl:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#00d2b4]/20 bg-[#00d2b4]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7df1e1]">
                <Sparkles className="h-3.5 w-3.5" />
                Live AI Tutor
              </span>
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">AI Study Assistant</h1>
              <p className="max-w-2xl text-sm leading-6 text-[rgba(220,228,240,0.82)] sm:text-base">
                Get instant help for coursework, project debugging, and interview prep. If the AI answer is not enough,
                the mentor handoff is one click away.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-white/8 bg-[rgba(255,255,255,0.04)] p-4 text-sm text-[rgba(220,228,240,0.82)]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fb1d9]">Need a human?</p>
              <p>Move from AI to a mentor when you want deeper feedback or live guidance.</p>
              <Link
                href="/networking/mentors/mentor-discovery"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Browse mentors
              </Link>
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.9fr)]">
          <section className="rounded-[2rem] border border-white/8 bg-[rgba(255,255,255,0.03)] shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur">
            <div className="border-b border-white/8 px-5 py-4 sm:px-6">
              <p className="text-sm font-semibold text-white">Conversation</p>
              <p className="mt-1 text-xs text-[rgba(168,184,208,0.85)]">Dark shell chat with mentor escalation and quick prompts.</p>
            </div>

            <div className="max-h-[calc(100vh-310px)] space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
              {messages.map((message, index) => {
                const isUser = message.role === "user";

                return (
                  <div key={`${message.role}-${index}-${message.createdAt}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[90%] rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[80%] ${
                        isUser
                          ? "rounded-br-md border border-[#00d2b4]/20 bg-gradient-to-r from-[#00d2b4] to-[#6366f1] text-white"
                          : "rounded-bl-md border border-white/8 bg-[rgba(255,255,255,0.05)] text-[rgba(240,244,251,0.96)]"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <div className={`mt-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] ${isUser ? "text-white/75" : "text-[rgba(168,184,208,0.85)]"}`}>
                        <span>{isUser ? "You" : "AI Tutor"}</span>
                        {isUser ? <CheckCheck className="h-3.5 w-3.5" /> : null}
                      </div>
                    </div>
                  </div>
                );
              })}

              {loading ? (
                <div className="flex justify-start">
                  <div className="rounded-3xl rounded-bl-md border border-white/8 bg-[rgba(255,255,255,0.05)] px-4 py-3 text-sm text-[rgba(168,184,208,0.85)]">
                    Thinking...
                  </div>
                </div>
              ) : null}

              <div ref={bottomRef} />
            </div>

            <form onSubmit={sendMessage} className="space-y-4 border-t border-white/8 px-4 py-4 sm:px-6">
              <div className="flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setInput(prompt)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-[rgba(232,238,248,0.9)] transition hover:border-[#00d2b4]/30 hover:bg-[#00d2b4]/10 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="rounded-[1.35rem] border border-white/10 bg-[#090f1b] p-3 shadow-inner shadow-black/20">
                <label className="sr-only" htmlFor="ai-assistant-input">
                  Ask the AI tutor
                </label>
                <textarea
                  id="ai-assistant-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={4}
                  placeholder="Ask a question, paste code, or describe the problem you're stuck on..."
                  className="w-full resize-none bg-transparent text-sm leading-6 text-white placeholder:text-[rgba(168,184,208,0.65)] focus:outline-none"
                />
              </div>

              {error ? <p className="text-sm text-[#fca5a5]">{error}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-[rgba(168,184,208,0.85)]">
                  The AI reply can surface mentor matches when extra help is useful.
                </p>
                <button
                  type="submit"
                  disabled={!canSend}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}
