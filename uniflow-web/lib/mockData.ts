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

export const mockAppliedProjects: Record<string, { id: string; title: string; brief: string; modules: string[]; stack: string[] }[]> = {
  "Year 4": [],
  "Year 3": [
    {
      id: "proj-y3-1",
      title: "CLI Network Log Analyzer",
      brief:
        "Don't build another To-Do app. Build a command-line tool that ingests raw network traffic logs, parses the XML, and stores anomalies in a relational database. The output should tell an on-call engineer exactly which host is misbehaving.",
      modules: ["Network Design", "Database Systems"],
      stack: ["Go", "SQLite", "Prisma ORM"],
    },
    {
      id: "proj-y3-2",
      title: "Subnet Calculator Daemon",
      brief:
        "Write a background process that listens for IP addresses on a specific port and returns the broadcast address, network address, and usable host range instantly. No GUI. Make it fast enough to serve 1000 requests per second.",
      modules: ["Network Design", "Operating Systems"],
      stack: ["Python", "Socket Programming"],
    },
  ],
  "Year 2": [
    {
      id: "proj-y2-1",
      title: "Custom Memory Allocator",
      brief:
        "Override standard malloc/free in C to understand how the heap actually works before you rely on modern garbage-collected languages. Implement a simple free-list allocator and measure fragmentation under different allocation patterns.",
      modules: ["Data Structures", "Computer Architecture"],
      stack: ["C", "Valgrind", "Make"],
    },
    {
      id: "proj-y2-2",
      title: "Mini Relational Database Engine",
      brief:
        "Build a toy database that can parse and execute basic SQL (SELECT, INSERT, CREATE TABLE) against an in-memory store. The goal is to understand what a query planner actually does before you trust one blindly.",
      modules: ["Database Systems", "Data Structures"],
      stack: ["Python", "PLY (Parser)"],
    },
  ],
  "Year 1": [],
};
