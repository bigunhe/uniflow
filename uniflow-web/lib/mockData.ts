// ─── Synced Modules (hub page grid) ─────────────────────────────────────────

export const mockSyncedModules = [
  {
    moduleId: "IT3010",
    moduleName: "Network Design",
    resourceCount: 11,
    lastSynced: "Just now",
  },
  {
    moduleId: "IT2050",
    moduleName: "Database Systems",
    resourceCount: 8,
    lastSynced: "3 days ago",
  },
];

// ─── Module Insights (Deep Dive Radar) ───────────────────────────────────────

export type CoreModel = {
  id: string;
  headline: string;
  analogy: string;
};

export type LectureFile = {
  id: string;
  fileName: string;
  isDense: boolean;
  summary: string;
};

export type ModuleInsight = {
  moduleId: string;
  moduleName: string;
  resourceCount: number;
  coreModels: CoreModel[];
  searchVectors: string[];
  knowledgeGaps: string[];
  files: LectureFile[];
};

export const mockModuleInsights: Record<string, ModuleInsight> = {
  IT3010: {
    moduleId: "IT3010",
    moduleName: "Network Design",
    resourceCount: 11,

    coreModels: [
      {
        id: "model-1",
        headline: "A Network is a Hierarchy of Local Decisions",
        analogy:
          "Think of IP addressing like a postal system designed by engineers who hate waste. The subnet mask is the zip code — it tells the router which neighbourhood a packet belongs to before it even looks for the specific house. The genius is that this decision is made locally, without consulting a central authority.",
      },
      {
        id: "model-2",
        headline: "Routing Tables are Confidence Scores, Not Maps",
        analogy:
          "A router doesn't know the whole network. It only knows its immediate neighbours and trusts they know theirs. When it forwards a packet it makes a best-guess bet using the longest prefix match — like a postal worker who doesn't know your exact house but knows exactly which van to put your parcel in.",
      },
    ],

    searchVectors: [
      "If NAT already solved the IPv4 address shortage in the 90s, why are cloud providers still spending billions on IPv6 migration — what does NAT fundamentally break that IPv6 actually fixes?",
      "Why do enterprises use VLANs instead of just physically separating networks with subnets — what can a VLAN do that subnetting alone cannot, and where does each approach break down?",
      "What stops a misconfigured or malicious host from claiming it belongs to a different subnet, and how does a router actually verify that claim?",
      "If you had to design an IP addressing scheme for a company that doubles in size every 18 months, how would CIDR let you plan for that without wasting the entire address space up front?",
      "Why is the broadcast address always the last address in a subnet — what physically happens when a packet is sent there, and why does that behaviour create a security risk?",
    ],

    knowledgeGaps: [
      "Given 192.168.1.50/26, identify the network address, broadcast address, and usable host range — no calculator.",
      "Explain why a subnet mask must be contiguous 1s. What breaks if you use a non-contiguous mask like 255.0.255.0?",
      "A router receives a packet for 10.0.0.130. It has two routes: 10.0.0.0/24 and 10.0.0.128/25. Which route wins and why?",
    ],

    files: [
      {
        id: "file-1",
        fileName: "Lecture 4: Subnetting & Routing.pdf",
        isDense: true,
        summary:
          "Covers IPv4 subnetting mechanics, CIDR notation, subnet mask calculation, and an introduction to static routing tables. The /26 and /27 subnet examples are exam-critical.",
      },
      {
        id: "file-2",
        fileName: "Lecture 3: IP Addressing Fundamentals.pdf",
        isDense: true,
        summary:
          "Introduces the IPv4 address structure, classes A/B/C, and private address ranges (RFC 1918). Builds the conceptual foundation for subnetting in Lecture 4.",
      },
      {
        id: "file-3",
        fileName: "Lecture 1: Intro & Syllabus.pdf",
        isDense: false,
        summary:
          "Administrative overview: 30% mid-term, 70% final. Required reading: Tanenbaum Ch. 4–6. No technical content.",
      },
    ],
  },

  IT2050: {
    moduleId: "IT2050",
    moduleName: "Database Systems",
    resourceCount: 8,

    coreModels: [
      {
        id: "model-1",
        headline: "Normalisation is About Removing Lies Your Data Tells Itself",
        analogy:
          "An un-normalised table is like a spreadsheet where the same fact is written in 50 rows. The moment that fact changes, you have to update all 50 — and miss one, and your database now contains two conflicting truths. Normalisation forces every fact to live in exactly one place, so the database can never contradict itself.",
      },
      {
        id: "model-2",
        headline: "A Transaction is a Promise With an Escape Hatch",
        analogy:
          "When you run a bank transfer, two things must happen or neither should: debit one account, credit another. A transaction wraps those two operations in a contract — if anything fails mid-way, the database rolls back to exactly where it started. ACID properties are just the legal terms of that contract.",
      },
    ],

    searchVectors: [
      "If 3NF removes most redundancy, why does BCNF exist — what edge case does 3NF miss, and does it actually matter in production databases?",
      "NoSQL databases deliberately violate normalisation rules — under what specific real-world conditions is a denormalised schema actually the correct engineering decision?",
      "The CAP theorem says you can only have two of Consistency, Availability, and Partition Tolerance — how do databases like PostgreSQL and MongoDB each make that trade-off, and what does it mean for your application?",
      "If transactions guarantee ACID properties, why do modern systems introduce concepts like eventual consistency and why would any engineer willingly give up consistency?",
      "An index speeds up reads but slows down writes — at what point does adding more indexes to a table become actively harmful, and how would you find that threshold?",
    ],

    knowledgeGaps: [
      "Convert this un-normalised order table to 3NF, identifying all functional dependencies first: Order(OrderID, CustomerName, CustomerCity, ProductID, ProductName, Quantity, Price).",
      "Write a SQL query that finds all customers who have placed more than 3 orders in the last 30 days, using only JOINs and GROUP BY — no subqueries.",
      "Explain what a deadlock is in transaction processing and describe one strategy a DBMS uses to detect and resolve it.",
    ],

    files: [
      {
        id: "file-1",
        fileName: "Lecture 5: Normalisation (1NF–3NF).pdf",
        isDense: true,
        summary:
          "Covers functional dependencies, 1NF, 2NF, and 3NF with worked examples. The step-by-step decomposition exercise on the customer-order schema is the most likely exam question format.",
      },
      {
        id: "file-2",
        fileName: "Lecture 7: Transactions & ACID.pdf",
        isDense: true,
        summary:
          "Defines atomicity, consistency, isolation, and durability. Introduces commit and rollback, concurrency issues (dirty reads, phantom reads), and isolation levels.",
      },
      {
        id: "file-3",
        fileName: "Lecture 1: Intro & Syllabus.pdf",
        isDense: false,
        summary:
          "Course overview: 40% coursework, 60% exam. Tools: PostgreSQL and pgAdmin. No technical content.",
      },
    ],
  },
};

// ─── Applied Projects ─────────────────────────────────────────────────────────

export type ProjectYear = "Year 1" | "Year 2" | "Year 3" | "Year 4";

export type MockProject = {
  id: string;
  year: ProjectYear;
  title: string;
  brief: string;
  weekendEstimate: string;
  challengeLevel: "Foundation" | "Intermediate" | "Advanced";
  modules: string[];
  stack: string[];
  learningGoals: string[];
  instructions: string[];
  deliverables: string[];
  aiGuideFocus: string[];
};

export const mockAppliedProjects: Record<ProjectYear, MockProject[]> = {
  "Year 4": [
    {
      id: "proj-y4-1",
      year: "Year 4",
      title: "Resilience Drill: Job Queue Failure Simulator",
      brief:
        "Build a small service that simulates delayed jobs and worker crashes. Students learn resilience patterns by introducing retries, dead-letter queues, and backoff.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Advanced",
      modules: ["Distributed Systems", "Cloud Computing"],
      stack: ["Node.js", "BullMQ", "Redis", "Docker"],
      learningGoals: [
        "Model partial failures in distributed workflows",
        "Implement retry and dead-letter handling",
        "Document failure scenarios and mitigation choices",
      ],
      instructions: [
        "Create a producer that pushes jobs with random failure probability.",
        "Run at least two workers and intentionally crash one worker process.",
        "Add exponential backoff and a dead-letter queue for repeated failures.",
        "Write a short incident-style report explaining what failed and why.",
        "Define job payload schema and idempotency keys so retries do not double-apply side effects.",
        "Expose health and queue depth metrics (e.g. Redis/BullMQ stats) and document how to read them during a drill.",
        "Containerize producer and workers; add a compose file with env samples for connection strings and concurrency limits.",
      ],
      deliverables: [
        "GitHub repository with README and run steps",
        "Sample logs showing retry and dead-letter flow",
        "Architecture diagram or sequence notes",
      ],
      aiGuideFocus: [
        "Failure injection strategy",
        "Queue design trade-offs",
        "Interpreting worker and retry logs",
      ],
    },
    {
      id: "proj-y4-2",
      year: "Year 4",
      title: "AI Ops Copilot for Service Alerts",
      brief:
        "Create an assistant that summarizes noisy service alerts and suggests triage actions. Use LLM prompts, runbooks, and confidence scoring to avoid blind automation.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Advanced",
      modules: ["AI Engineering", "Cloud Operations", "Software Quality"],
      stack: ["Python", "FastAPI", "OpenAI SDK", "PostgreSQL", "Docker"],
      learningGoals: [
        "Design safe AI-assisted ops workflows",
        "Create structured alert summaries from raw logs",
        "Establish guardrails for low-confidence responses",
      ],
      instructions: [
        "Ingest synthetic alert payloads and normalize them into a single schema.",
        "Implement prompt templates that output JSON summaries and next actions.",
        "Add confidence scoring and fallback behavior when confidence is low.",
        "Publish a short report comparing AI suggestions with manual triage.",
        "Persist alert history and model outputs in PostgreSQL with timestamps for audit replay.",
        "Add FastAPI routes for `/ingest`, `/summarize`, and `/runbook` with request validation (Pydantic).",
        "Ship a small evaluation notebook or script that scores precision/recall of triage labels on a fixed fixture set.",
      ],
      deliverables: [
        "Working API with sample alert dataset",
        "Prompt design notes and guardrail rules",
        "Before/after triage quality comparison",
      ],
      aiGuideFocus: [
        "Prompt design for noisy data",
        "Confidence calibration",
        "Safe fallback strategies",
      ],
    },
    {
      id: "proj-y4-3",
      year: "Year 4",
      title: "Portfolio-grade CI/CD Platform Starter",
      brief:
        "Build a production-style delivery pipeline for a microservice app with tests, image scanning, staged deploys, and rollback checks.",
      weekendEstimate: "2 weekends",
      challengeLevel: "Advanced",
      modules: ["DevOps", "Cloud Computing", "Secure Software Engineering"],
      stack: ["GitHub Actions", "Docker", "AWS ECS", "Terraform", "Trivy"],
      learningGoals: [
        "Implement secure CI/CD from commit to deployment",
        "Integrate quality and security gates",
        "Automate rollback verification paths",
      ],
      instructions: [
        "Define pipeline stages for test, build, scan, and deploy.",
        "Containerize an API service and push versioned images.",
        "Deploy to staging and production with approval controls.",
        "Document rollback strategy and run one simulated failure.",
        "Wire Trivy (or similar) into the image build stage and fail the build on critical CVE thresholds you document.",
        "Parameterize Terraform modules for staging vs prod (tags, desired count) and keep secrets out of git (SOPS or CI secrets).",
        "Add a smoke-test job post-deploy (HTTP health check) and capture artifacts in the Actions summary.",
      ],
      deliverables: [
        "IaC repo and CI/CD workflow files",
        "Pipeline run screenshots and logs",
        "Rollback demo notes",
      ],
      aiGuideFocus: [
        "Pipeline design trade-offs",
        "Security gate tuning",
        "Rollback validation",
      ],
    },
    {
      id: "proj-y4-4",
      year: "Year 4",
      title: "Hybrid Network + Cloud Cost Optimizer",
      brief:
        "Analyze traffic patterns across cloud and on-prem style environments, then propose route, autoscaling, and caching strategies to reduce latency and cost.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Advanced",
      modules: ["Network Design and Management", "Cloud Economics", "Data Analytics"],
      stack: ["Python", "Pandas", "Jupyter", "AWS Pricing API", "Docker"],
      learningGoals: [
        "Correlate traffic behavior with cloud spending",
        "Design optimization experiments with measurable impact",
        "Communicate engineering decisions with data",
      ],
      instructions: [
        "Generate or collect network and service usage traces.",
        "Model baseline cost and latency under current settings.",
        "Simulate at least three optimization options and compare impact.",
        "Present final recommendation with assumptions and risk notes.",
        "Document data sources, sampling windows, and any synthetic assumptions so a peer can rerun your notebook.",
        "Plot sensitivity analysis (e.g. traffic +20%, egress price +10%) and call out break-even points.",
        "Add an executive one-pager: problem, options table, recommendation, and top three risks.",
      ],
      deliverables: [
        "Notebook or scripts with reproducible analysis",
        "Decision summary with chosen strategy",
        "Charts for latency and cost comparison",
      ],
      aiGuideFocus: [
        "Experiment setup",
        "Cost model assumptions",
        "Decision narrative quality",
      ],
    },
  ],
  "Year 3": [
    {
      id: "proj-y3-1",
      year: "Year 3",
      title: "CLI Network Log Analyzer",
      brief:
        "Build a command-line tool that ingests network logs, parses records, and stores anomalies. Output should help an on-call engineer quickly identify misbehaving hosts.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Intermediate",
      modules: ["Network Design", "Database Systems"],
      stack: ["Go", "SQLite", "Prisma ORM"],
      learningGoals: [
        "Parse semi-structured log payloads reliably",
        "Design a compact anomaly storage model",
        "Produce meaningful terminal-level diagnostics",
      ],
      instructions: [
        "Define a parser contract and reject malformed rows with clear reasons.",
        "Design anomaly rules (spikes, repeated failures, suspicious hosts).",
        "Persist flagged records and expose summary queries via CLI commands.",
        "Add at least 10 sample logs and verify expected anomaly output.",
        "Version your SQLite schema with a migration note and index columns used in hot queries (e.g. host, timestamp).",
        "Add subcommands: `ingest`, `report`, `top-hosts` with `--since` filters and table-formatted output.",
        "Write a short test table in README mapping each sample log file to expected anomaly IDs or empty results.",
      ],
      deliverables: [
        "CLI tool with command reference in README",
        "Sample input logs and expected outputs",
        "Database schema and anomaly rule explanation",
      ],
      aiGuideFocus: [
        "Parser edge cases",
        "Anomaly threshold design",
        "CLI usability improvements",
      ],
    },
    {
      id: "proj-y3-2",
      year: "Year 3",
      title: "Subnet Calculator Daemon",
      brief:
        "Implement a background process that receives CIDR values and returns network, broadcast, and host ranges. No GUI required, focus on correctness and throughput.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Intermediate",
      modules: ["Network Design", "Operating Systems"],
      stack: ["Python", "Socket Programming"],
      learningGoals: [
        "Apply subnet reasoning without calculators",
        "Build a long-running process with clean request handling",
        "Measure throughput and latency under load",
      ],
      instructions: [
        "Open a TCP server and parse requests in CIDR format.",
        "Return structured responses with network and host range details.",
        "Add input validation for malformed and unsupported CIDR values.",
        "Run simple load tests and report requests per second.",
        "Use a line-oriented protocol (e.g. `CALC 192.168.1.0/24\\n`) and document max request size and timeout behavior.",
        "Include golden tests for edge CIDRs (/32, /31, IPv6 if you choose to support it—state clearly if not).",
        "Capture `perf` or `py-spy` (if Python) or equivalent notes explaining where CPU time goes under load.",
      ],
      deliverables: [
        "Daemon source with test payloads",
        "Load test script and baseline results",
        "Short note on bottlenecks and next optimizations",
      ],
      aiGuideFocus: [
        "CIDR math confidence checks",
        "Socket server structure",
        "Performance troubleshooting",
      ],
    },
    {
      id: "proj-y3-3",
      year: "Year 3",
      title: "Full-stack Project Tracker with AI Prioritization",
      brief:
        "Build a project tracking app with role-based dashboards and an AI helper that prioritizes backlog items using project context.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Advanced",
      modules: ["Programming Application Frameworks", "Database Systems"],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "OpenAI SDK"],
      learningGoals: [
        "Build multi-role workflows with clean app architecture",
        "Model relational task data for querying and reporting",
        "Integrate AI responsibly for recommendation use-cases",
      ],
      instructions: [
        "Create auth-aware dashboards for student and team-lead views.",
        "Design backlog/task schema with status history.",
        "Add AI endpoint that returns ranked tasks with short reasoning.",
        "Measure recommendation usefulness with 10 sample scenarios.",
        "Model `Task`, `User`, `Role`, and `StatusChange` tables; ensure Prisma migrations run from a clean DB.",
        "Add server-side authorization checks so students cannot PATCH tasks they do not own.",
        "Log model latency and token usage per ranking call and surface it in an admin-only debug panel.",
      ],
      deliverables: [
        "Working full-stack app and seed data",
        "AI prompt and scoring logic notes",
        "Short validation report for ranking quality",
      ],
      aiGuideFocus: [
        "Schema design for task history",
        "Prompt output validation",
        "Frontend state and data flow",
      ],
    },
    {
      id: "proj-y3-4",
      year: "Year 3",
      title: "Automated Lab Environment Provisioner",
      brief:
        "Develop a tool that provisions repeatable local lab environments for networking and backend tests using Docker Compose templates.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Intermediate",
      modules: ["Automation", "Network Design and Management", "Operating Systems"],
      stack: ["Python", "Docker Compose", "Bash", "YAML"],
      learningGoals: [
        "Automate reproducible developer environments",
        "Parameterize infrastructure templates",
        "Reduce setup friction across team members",
      ],
      instructions: [
        "Create template-based compose files for 2-3 lab setups.",
        "Add CLI commands to spin up and tear down environments.",
        "Generate environment summaries with open ports and services.",
        "Benchmark setup time before and after automation.",
        "Support a `--profile` or template flag so labs can differ by image tags and volume mounts without duplicating YAML.",
        "Add `down -v` safety prompts or `--force` flags documented in README to prevent accidental data loss.",
        "Include a troubleshooting section for common failures: port collisions, ARM vs x86 images, and DNS inside compose networks.",
      ],
      deliverables: [
        "Provisioning CLI with sample templates",
        "Usage docs and troubleshooting notes",
        "Environment setup benchmark results",
      ],
      aiGuideFocus: [
        "Template modularity",
        "CLI ergonomics",
        "Common Docker networking mistakes",
      ],
    },
    {
      id: "proj-y3-5",
      year: "Year 3",
      title: "MLOps Starter: Defect Classification Pipeline",
      brief:
        "Build a simple image defect classifier pipeline with dataset versioning, model training, evaluation, and a minimal serving endpoint.",
      weekendEstimate: "2 weekends",
      challengeLevel: "Advanced",
      modules: ["Python for AI", "Software Engineering", "Automation"],
      stack: ["Python", "PyTorch", "FastAPI", "DVC", "Docker"],
      learningGoals: [
        "Understand end-to-end ML workflow fundamentals",
        "Version data and models for reproducibility",
        "Serve predictions through an API interface",
      ],
      instructions: [
        "Prepare or generate a small labeled image dataset.",
        "Train a baseline model and capture evaluation metrics.",
        "Track dataset/model versions and training configs.",
        "Expose a prediction API and test with sample images.",
        "Split train/val/test explicitly in DVC or folder layout; document any augmentation you apply.",
        "Save checkpoints and final `metrics.json` (accuracy, macro-F1) next to the model artifact path.",
        "Add FastAPI `/predict` multipart upload with size limits and return top-k class probabilities.",
      ],
      deliverables: [
        "Training scripts and dataset notes",
        "Model metrics and confusion matrix output",
        "Inference API with example requests",
      ],
      aiGuideFocus: [
        "Model baseline choices",
        "Data leakage checks",
        "Evaluation metric interpretation",
      ],
    },
    {
      id: "proj-y3-6",
      year: "Year 3",
      title: "Cloud-ready Event Booking Platform",
      brief:
        "Design a scalable event booking backend with queue-based notifications, caching, and deployment-ready container setup.",
      weekendEstimate: "2 weekends",
      challengeLevel: "Advanced",
      modules: ["Programming Application Frameworks", "Cloud Computing", "Database Systems"],
      stack: ["NestJS", "PostgreSQL", "Redis", "Docker", "GitHub Actions"],
      learningGoals: [
        "Design scalable booking workflows",
        "Use queues and caches to handle traffic bursts",
        "Prepare deployment artifacts for portfolio demos",
      ],
      instructions: [
        "Implement booking lifecycle with concurrency-safe seat handling.",
        "Add notification workers using queued jobs.",
        "Cache high-traffic read endpoints and track cache hit ratios.",
        "Create a CI pipeline for tests and container image builds.",
        "Use DB transactions or row-level locking for seat decrements; include a stress test script that fires concurrent bookings.",
        "Define Redis keys and TTL strategy for cached event lists; log cache hits/misses per route.",
        "Document idempotency for payment webhooks (if stubbed) and how duplicate notifications are ignored.",
      ],
      deliverables: [
        "Service code and architecture notes",
        "Queue and cache behavior evidence",
        "CI pipeline run proof",
      ],
      aiGuideFocus: [
        "Concurrency and race condition handling",
        "Queue + cache patterns",
        "Deployment readiness checks",
      ],
    },
  ],
  "Year 2": [
    {
      id: "proj-y2-1",
      year: "Year 2",
      title: "Custom Memory Allocator",
      brief:
        "Override basic heap allocation in C with a free-list allocator. Compare fragmentation and allocation behavior under different usage patterns.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Intermediate",
      modules: ["Data Structures", "Computer Architecture"],
      stack: ["C", "Valgrind", "Make"],
      learningGoals: [
        "Understand heap layout and fragmentation trade-offs",
        "Implement a minimal allocator lifecycle",
        "Evaluate allocator behavior with repeatable experiments",
      ],
      instructions: [
        "Implement basic malloc/free behavior with a free-list strategy.",
        "Track block metadata and coalescing behavior.",
        "Run allocation workloads with varied block sizes.",
        "Measure fragmentation and explain observed trends.",
        "Run under Valgrind or AddressSanitizer builds and document any leaks or invalid frees you fixed.",
        "Implement `calloc`/`realloc` behavior or explicitly document unsupported cases with compile-time guards.",
        "Add micro-benchmark comparing your allocator vs system malloc on the same workload script.",
      ],
      deliverables: [
        "Allocator implementation and test harness",
        "Experiment report with fragmentation metrics",
        "README with constraints and known limitations",
      ],
      aiGuideFocus: [
        "Allocator correctness checks",
        "Coalescing and splitting logic",
        "Profiling memory behavior",
      ],
    },
    {
      id: "proj-y2-2",
      year: "Year 2",
      title: "Mini Relational Database Engine",
      brief:
        "Create a toy SQL engine that supports a small subset of queries in-memory. The aim is to understand parser, planner, and execution basics.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Foundation",
      modules: ["Database Systems", "Data Structures"],
      stack: ["Python", "PLY (Parser)"],
      learningGoals: [
        "Map SQL syntax into structured query representation",
        "Implement a tiny execution path for core commands",
        "Reason about planning and execution limitations",
      ],
      instructions: [
        "Support CREATE TABLE, INSERT, and SELECT with simple predicates.",
        "Build parser rules and map them to execution functions.",
        "Store rows in-memory and return deterministic query results.",
        "Document unsupported SQL features clearly.",
        "Add negative tests: malformed SQL, unknown tables, type mismatches on INSERT, with clear error messages.",
        "Support at least `WHERE` with `AND` and `=` comparisons on integer and string columns.",
        "Print an internal execution plan (even if naive nested-loop) for each SELECT to show how rows are scanned.",
      ],
      deliverables: [
        "Engine code with sample query scripts",
        "Parser grammar notes",
        "Known limitations and extension roadmap",
      ],
      aiGuideFocus: [
        "Grammar and token pitfalls",
        "Execution strategy for simple queries",
        "Testing parser and query behavior",
      ],
    },
    {
      id: "proj-y2-3",
      year: "Year 2",
      title: "Framework Fundamentals: Student Portal",
      brief:
        "Build a basic student portal with authentication, profile page, and module list to practice framework conventions and reusable components.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Foundation",
      modules: ["Programming Application Frameworks"],
      stack: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      learningGoals: [
        "Understand component-driven UI structure",
        "Implement route-level page organization",
        "Handle basic form state and validation",
      ],
      instructions: [
        "Create pages for login, profile, and module listing.",
        "Build reusable UI components for cards and forms.",
        "Add client-side validation and helpful errors.",
        "Document the component hierarchy and state choices.",
        "Use layout routes or shared shells so nav and footer stay consistent across pages.",
        "Stub auth state (e.g. context) with mock user; protect profile route behind a simple `requireAuth` guard.",
        "Meet basic responsive checks: readable at 375px width without horizontal scroll on core pages.",
      ],
      deliverables: [
        "Portal app with responsive pages",
        "Component usage guide",
        "Validation edge-case notes",
      ],
      aiGuideFocus: [
        "Component decomposition",
        "Form validation patterns",
        "Folder structure practices",
      ],
    },
    {
      id: "proj-y2-4",
      year: "Year 2",
      title: "Automation Bot: Timetable Reminder Engine",
      brief:
        "Create a bot that reads timetable data and sends reminders for upcoming sessions and assignment deadlines.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Intermediate",
      modules: ["Automation", "Programming Fundamentals"],
      stack: ["Python", "Schedule", "SMTP", "SQLite"],
      learningGoals: [
        "Automate recurring workflows reliably",
        "Work with date/time logic and scheduling",
        "Store and query reminder history",
      ],
      instructions: [
        "Define timetable schema and import sample records.",
        "Implement reminder scheduler with configurable frequency.",
        "Send email notifications and log delivery outcomes.",
        "Handle timezone assumptions in README.",
        "Store reminder history in SQLite with columns for status (`sent`, `failed`) and last error text.",
        "Add a config file for SMTP host, port, and TLS mode; never commit real credentials.",
        "Provide a dry-run mode that prints emails instead of sending when `DRY_RUN=1`.",
      ],
      deliverables: [
        "Automation script and scheduler config",
        "Sample reminder logs",
        "Timezone and deployment notes",
      ],
      aiGuideFocus: [
        "Scheduler reliability",
        "Date/time bugs",
        "Notification retry behavior",
      ],
    },
    {
      id: "proj-y2-5",
      year: "Year 2",
      title: "Network Monitoring Mini Dashboard",
      brief:
        "Build a lightweight dashboard that pings configured hosts and visualizes uptime trends for a small lab network.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Intermediate",
      modules: ["Network Design and Management", "Programming Application Frameworks"],
      stack: ["Python", "Flask", "SQLite", "Chart.js"],
      learningGoals: [
        "Collect and store simple telemetry",
        "Visualize operational metrics clearly",
        "Reason about false positives in monitoring",
      ],
      instructions: [
        "Implement periodic host checks and status recording.",
        "Store response times and success/failure status.",
        "Render uptime and latency charts in a basic UI.",
        "Add alerts for repeated failures.",
        "Model hosts in SQLite with last RTT, consecutive failures, and mute flags for maintenance windows.",
        "Expose a JSON `/api/status` for the UI and document polling interval vs chart aggregation buckets.",
        "Seed the DB with synthetic downtime bursts to prove alerts fire only after your documented threshold.",
      ],
      deliverables: [
        "Monitoring app with sample data",
        "Dashboards/screenshots",
        "Alert threshold rationale",
      ],
      aiGuideFocus: [
        "Monitoring signal quality",
        "Visualization clarity",
        "Threshold tuning",
      ],
    },
    {
      id: "proj-y2-6",
      year: "Year 2",
      title: "Python AI: Smart FAQ Assistant",
      brief:
        "Build a retrieval-based FAQ assistant for course policies and module notes that answers common questions with cited sources.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Intermediate",
      modules: ["Python for AI", "Database Systems"],
      stack: ["Python", "FastAPI", "FAISS", "OpenAI SDK"],
      learningGoals: [
        "Implement simple retrieval-augmented answering",
        "Attach source references to AI responses",
        "Measure answer quality on a small benchmark set",
      ],
      instructions: [
        "Prepare FAQ and policy documents for indexing.",
        "Build vector retrieval and answer generation pipeline.",
        "Return top sources with every answer.",
        "Evaluate answers using a fixed test question set.",
        "Version your FAISS index build script with chunk size, overlap, and embedding model name in README.",
        "Add a guardrail: if retrieval score is below a threshold, respond with “not enough context” instead of guessing.",
        "Log question, retrieved chunk IDs, and latency per request for debugging bad answers.",
      ],
      deliverables: [
        "Running API with retrieval module",
        "Evaluation sheet for 20 questions",
        "Prompt and chunking strategy notes",
      ],
      aiGuideFocus: [
        "Chunking and retrieval quality",
        "Prompt grounding",
        "Source citation consistency",
      ],
    },
  ],
  "Year 1": [
    {
      id: "proj-y1-1",
      year: "Year 1",
      title: "Campus Task API",
      brief:
        "Build a lightweight REST API for student task planning. Focus on clean routes, basic validation, and API fundamentals rather than advanced architecture.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Foundation",
      modules: ["Programming Fundamentals"],
      stack: ["Node.js", "Express", "Postman"],
      learningGoals: [
        "Design basic REST resources and routes",
        "Implement server-side validation and error responses",
        "Practice API testing workflows",
      ],
      instructions: [
        "Create CRUD routes for tasks with status and due date fields.",
        "Validate incoming payloads and return clear errors.",
        "Add a simple filter by status and due date.",
        "Test all endpoints with Postman collections.",
        "Define task fields explicitly (`title`, `status` enum, `dueDate` ISO-8601) and reject unknown JSON keys if you choose strict mode.",
        "Return consistent error JSON (`{ \"error\": string }`) with correct HTTP status codes for validation vs not-found.",
        "Add `GET /health` and a README section covering install, `PORT`, example `curl` calls, and common failure modes.",
      ],
      deliverables: [
        "API source with setup guide",
        "Postman collection export",
        "Sample request/response documentation",
      ],
      aiGuideFocus: [
        "Route design best practices",
        "Validation rule design",
        "Debugging API responses",
      ],
    },
    {
      id: "proj-y1-2",
      year: "Year 1",
      title: "Data Tracker CLI",
      brief:
        "Create a simple CLI application to manage personal study records with add, list, edit, and export commands.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Foundation",
      modules: ["Programming Fundamentals"],
      stack: ["Python", "argparse", "CSV"],
      learningGoals: [
        "Practice modular code design in a CLI app",
        "Handle file I/O safely",
        "Design simple command interfaces",
      ],
      instructions: [
        "Define data schema for study records.",
        "Implement command handlers for CRUD-style operations.",
        "Add export command to CSV.",
        "Write usage examples for every command.",
        "Persist records in a JSON or SQLite file under `./data/` and document the on-disk format.",
        "Handle corrupt files gracefully with a clear error and exit code (e.g. `2` for user error).",
        "Add `list --format=table` vs `json` output flags to practice structured CLI output.",
      ],
      deliverables: [
        "CLI source code and sample dataset",
        "Command usage guide",
        "Basic test checklist",
      ],
      aiGuideFocus: [
        "CLI UX clarity",
        "Input validation",
        "Code organization",
      ],
    },
    {
      id: "proj-y1-3",
      year: "Year 1",
      title: "Intro Database CRUD App",
      brief:
        "Build a beginner-friendly CRUD web app to understand relational data basics and database-backed pages.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Foundation",
      modules: ["Database Systems", "Programming Application Frameworks"],
      stack: ["Node.js", "Express", "SQLite", "EJS"],
      learningGoals: [
        "Connect UI actions to database operations",
        "Use SQL safely for insert/update/delete workflows",
        "Understand schema constraints and validation",
      ],
      instructions: [
        "Create a database schema for a simple inventory or notes app.",
        "Implement pages to create, view, update, and delete entries.",
        "Add validation for required fields.",
        "Handle common DB errors with clear messages.",
        "Use parameterized queries everywhere; add a short note in README explaining why SQL injection matters here.",
        "Add server-side checks for string length limits and numeric ranges before hitting the database.",
        "Include seed data script or SQL file so a reviewer can run the app in one command.",
      ],
      deliverables: [
        "Running CRUD app",
        "SQL schema file",
        "Demo screenshots",
      ],
      aiGuideFocus: [
        "Schema design basics",
        "SQL query debugging",
        "Validation and user feedback",
      ],
    },
    {
      id: "proj-y1-4",
      year: "Year 1",
      title: "Automation Starter: File Organizer",
      brief:
        "Write an automation script that organizes downloaded files into folders by type and date with configurable rules.",
      weekendEstimate: "1 weekend",
      challengeLevel: "Foundation",
      modules: ["Automation", "Operating Systems"],
      stack: ["Python", "pathlib", "watchdog"],
      learningGoals: [
        "Understand filesystem operations safely",
        "Automate repetitive manual tasks",
        "Create configurable rule-driven behavior",
      ],
      instructions: [
        "Scan a target directory and classify file types.",
        "Move files into organized folder structures.",
        "Add a dry-run mode before actual moves.",
        "Support custom rules via a small config file.",
        "Default to `--dry-run` in docs until the user passes `--apply`; log every planned move with source → destination.",
        "Handle filename collisions by appending a counter or timestamp and document the strategy.",
        "Watch mode: use `watchdog` to react to new files; debounce bursts so partial downloads are not moved mid-write.",
      ],
      deliverables: [
        "Organizer script with config examples",
        "Before/after sample outputs",
        "Safety notes for file operations",
      ],
      aiGuideFocus: [
        "Filesystem safety checks",
        "Rule parsing",
        "Cross-platform path handling",
      ],
    },
  ],
};

export const mockProjectsById: Record<string, MockProject> = Object.values(
  mockAppliedProjects
)
  .flat()
  .reduce<Record<string, MockProject>>((acc, project) => {
    acc[project.id] = project;
    return acc;
  }, {});
