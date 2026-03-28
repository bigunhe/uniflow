export const START_FEATURE_IDS = [
  "sync",
  "learning",
  "projects",
  "networking",
  "evidence",
  "dashboard",
] as const;

export const EXTENSION_LINKS = {
  downloadZip:
    "https://github.com/bigunhe/UniFlow-Chrome-Extension/archive/refs/heads/main.zip",
  repo: "https://github.com/bigunhe/UniFlow-Chrome-Extension",
};

export type StartFeatureId = (typeof START_FEATURE_IDS)[number];

export function isStartFeatureId(s: string): s is StartFeatureId {
  return (START_FEATURE_IDS as readonly string[]).includes(s);
}

export const START_FEATURE_COPY: Record<
  StartFeatureId,
  {
    title: string;
    shortLabel: string;
    description: string;
    dest: string;
    intro: string;
    bullets: string[];
  }
> = {
  sync: {
    title: "Sync lecture files",
    shortLabel: "Sync files",
    description: "Upload ZIPs from the extension into your private library",
    dest: "/sync",
    intro:
      "Drop a ZIP from the UniFlow browser extension. We store files in your private Supabase bucket and attach them to a module so you can open them from the learning hub.",
    bullets: [
      "Per-user storage — only you can see your uploads",
      "Creates or updates a module card from the archive",
      "You land on the module page when sync completes",
    ],
  },
  learning: {
    title: "Learning hub",
    shortLabel: "Learning",
    description: "Module insights, deep dives, and synced learning files",
    dest: "/learning",
    intro:
      "Browse synced modules and open deep-dive pages for mental models and search prompts based on your own lecture content.",
    bullets: [
      "Module cards from your real syncs (plus safe fallbacks when empty)",
      "Per-module “radar” for how to learn beyond the lecture",
      "Structured prompts to push understanding past memorization",
    ],
  },
  projects: {
    title: "Projects studio",
    shortLabel: "Projects",
    description: "Weekend projects grouped by year with AI guidance",
    dest: "/projects",
    intro:
      "Pick weekend projects based on your year level. Each brief gives broad direction, tools, and outcomes while the AI guide helps you make your own implementation decisions.",
    bullets: [
      "Year-wise project buckets from foundation to advanced",
      "Detailed project page with overview and step-by-step instructions",
      "Track completed projects and attach verification artifacts",
    ],
  },
  networking: {
    title: "Networking",
    shortLabel: "Networking",
    description: "Connect with mentors, alumni, and peers",
    dest: "/networking",
    intro:
      "Meet people around your cohort and beyond. Use this when you’re ready to show your Pulse and portfolio, not just your transcript.",
    bullets: [
      "Relationship-building around skills and evidence",
      "Optional mentor modes depending on your profile",
      "Keeps career visibility consistent with what you’ve proven",
    ],
  },
  evidence: {
    title: "Evidence",
    shortLabel: "Evidence",
    description: "Submit proof and grow your Pulse score",
    dest: "/evidance",
    intro:
      "Capture what you built. Evidence backs your public story and keeps your employability metrics honest.",
    bullets: [
      "Tie submissions to projects and outcomes",
      "Feed your verified portfolio narrative",
      "Complements learning sync and dashboard KPIs",
    ],
  },
  dashboard: {
    title: "Dashboard",
    shortLabel: "Dashboard",
    description: "Private overview of progress and profile",
    dest: "/dashboard",
    intro:
      "Your signed-in home base: profile, Pulse, navigation to every UniFlow area, and quick access to learning sub-pages.",
    bullets: [
      "Central place after login",
      "Sidebar navigation without cluttering public pages",
      "Optional profile setup from here",
    ],
  },
};
