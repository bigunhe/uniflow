import type { MockProject, ProjectYear } from "@/lib/mockData";

const TOPIC_ALIASES: Record<string, string[]> = {
  networking: ["network", "networking", "subnet", "routing", "tcp", "ip", "vlan"],
  frameworks: ["framework", "next.js", "react", "nestjs", "express", "flask"],
  database: ["database", "sql", "postgres", "sqlite", "prisma", "dbms"],
  python_ai: ["python", "ai", "ml", "llm", "pytorch", "rag", "openai"],
  automation: ["automation", "scheduler", "bot", "script", "ci", "pipeline"],
  devops_cloud: ["docker", "kubernetes", "aws", "terraform", "devops", "cloud", "cicd"],
  security: ["security", "secure", "scan", "vulnerability", "guardrail"],
  distributed: ["distributed", "queue", "worker", "resilience", "retry"],
  analytics: ["analytics", "pandas", "metrics", "monitoring", "latency", "cost"],
  systems: ["operating systems", "memory", "allocator", "daemon", "linux"],
};

export type ProjectRecommendation = {
  project: MockProject;
  score: number;
  matchedTopics: string[];
  matchedTopicLabels: string[];
};

type RecoInput = {
  projects: MockProject[];
  syncedModuleNames: string[];
  userAcademicYear?: string | null;
  limit?: number;
};

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9+.# ]+/g, " ").replace(/\s+/g, " ").trim();
}

function normalizeYear(raw?: string | null): ProjectYear | null {
  if (!raw) return null;
  const normalized = normalizeText(raw);
  if (normalized.includes("year 1") || normalized === "1" || normalized === "1st") return "Year 1";
  if (normalized.includes("year 2") || normalized === "2" || normalized === "2nd") return "Year 2";
  if (normalized.includes("year 3") || normalized === "3" || normalized === "3rd") return "Year 3";
  if (normalized.includes("year 4") || normalized === "4" || normalized === "4th") return "Year 4";
  return null;
}

function extractTopics(input: string): string[] {
  const normalized = normalizeText(input);
  const matches: string[] = [];
  for (const [topic, aliases] of Object.entries(TOPIC_ALIASES)) {
    if (aliases.some((alias) => normalized.includes(alias))) {
      matches.push(topic);
    }
  }
  return matches;
}

const TOPIC_LABELS: Record<string, string> = {
  networking: "Networking",
  frameworks: "App Frameworks",
  database: "Databases",
  python_ai: "Python + AI",
  automation: "Automation",
  devops_cloud: "DevOps/Cloud",
  security: "Security",
  distributed: "Distributed Systems",
  analytics: "Analytics",
  systems: "Systems",
};

function projectTopicSet(project: MockProject): Set<string> {
  const text = [project.title, project.brief, ...project.modules, ...project.stack].join(" ");
  return new Set(extractTopics(text));
}

function moduleTopicSet(moduleNames: string[]): Set<string> {
  return new Set(moduleNames.flatMap((name) => extractTopics(name)));
}

function countDirectModuleOverlap(project: MockProject, moduleNames: string[]): number {
  const normalizedModules = moduleNames.map(normalizeText);
  return project.modules.reduce((count, mod) => {
    const m = normalizeText(mod);
    return count + (normalizedModules.some((synced) => synced.includes(m) || m.includes(synced)) ? 1 : 0);
  }, 0);
}

export function recommendProjectsForSyncedModules({
  projects,
  syncedModuleNames,
  userAcademicYear,
  limit = 6,
}: RecoInput): ProjectRecommendation[] {
  const syncedTopics = moduleTopicSet(syncedModuleNames);
  const preferredYear = normalizeYear(userAcademicYear);

  const scored = projects.map((project) => {
    const pTopics = projectTopicSet(project);
    const matchedTopics = [...pTopics].filter((topic) => syncedTopics.has(topic));
    const directOverlapCount = countDirectModuleOverlap(project, syncedModuleNames);
    const yearMatch = preferredYear && project.year === preferredYear ? 1 : 0;

    const score = matchedTopics.length * 4 + directOverlapCount * 3 + yearMatch * 2;
    const matchedTopicLabels = matchedTopics.map(
      (topic) => TOPIC_LABELS[topic] ?? topic
    );
    return { project, score, matchedTopics, matchedTopicLabels };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
