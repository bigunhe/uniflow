import type { MockProject } from "@/lib/mockData";
import type { ProjectEvidenceChecklist } from "@/lib/projects/executionPacket";

export type ProjectScoreComponents = {
  /** Same as checklist progress: 50% evidence + 50% completion. */
  checklistReadinessPercent: number;
  completionRatio: number;
  difficultyBonus: number;
  recencyBonus: number;
  /** Checklist plus small bounded modifiers (recency, difficulty); never contradicts checklist by large margins. */
  pulseContributionPreview: number;
  /** @deprecated Use pulseContributionPreview; kept for stored state compatibility. */
  weightedScore: number;
  difficultyMultiplier: number;
  evidenceQuality: number;
  recencyActivity: number;
};

function evidenceRatio(evidence: ProjectEvidenceChecklist): number {
  const values = Object.values(evidence);
  if (values.length === 0) return 0;
  const done = values.filter(Boolean).length;
  return done / values.length;
}

/** Primary learner-facing progress: half evidence checklist, half project completion. */
export function computeChecklistReadinessPercent(
  evidence: ProjectEvidenceChecklist,
  completed: boolean
): number {
  const er = evidenceRatio(evidence);
  return Math.round((er * 0.5 + (completed ? 0.5 : 0)) * 100);
}

function difficultyBonusPoints(level?: string): number {
  const value = (level ?? "").toLowerCase();
  if (value.includes("advanced")) return 5;
  if (value.includes("intermediate")) return 3;
  return 0;
}

/** 0 until the learner has touched the project; small bonus for recent activity. */
function recencyBonusPoints(lastTouchedAt?: string | null): number {
  if (!lastTouchedAt) return 0;
  const stamp = new Date(lastTouchedAt);
  if (Number.isNaN(stamp.getTime())) return 0;
  const diffDays = (Date.now() - stamp.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 2) return 5;
  if (diffDays <= 7) return 3;
  if (diffDays <= 14) return 2;
  return 0;
}

function legacyDifficultyMultiplier(level?: string): number {
  const value = (level ?? "").toLowerCase();
  if (value.includes("advanced")) return 1.25;
  if (value.includes("intermediate")) return 1.1;
  return 1;
}

function legacyRecencyRatio(lastTouchedAt?: string | null): number {
  if (!lastTouchedAt) return 0;
  const stamp = new Date(lastTouchedAt);
  if (Number.isNaN(stamp.getTime())) return 0;
  const diffDays = (Date.now() - stamp.getTime()) / (1000 * 60 * 60 * 24);
  if (diffDays <= 2) return 1;
  if (diffDays <= 7) return 0.75;
  if (diffDays <= 14) return 0.45;
  return 0.2;
}

export function computeProjectScoreComponents(args: {
  project: MockProject;
  evidence: ProjectEvidenceChecklist;
  completed: boolean;
  lastTouchedAt?: string | null;
}): ProjectScoreComponents {
  const completionRatio = args.completed ? 1 : 0;
  const evidenceQuality = evidenceRatio(args.evidence);
  const checklistReadinessPercent = computeChecklistReadinessPercent(
    args.evidence,
    args.completed
  );
  const recencyBonus = recencyBonusPoints(args.lastTouchedAt);
  const difficultyBonus = difficultyBonusPoints(args.project.challengeLevel);
  const pulseContributionPreview = Math.min(
    100,
    checklistReadinessPercent + recencyBonus + difficultyBonus
  );

  const recencyActivity = legacyRecencyRatio(args.lastTouchedAt);
  const difficultyMultiplier = legacyDifficultyMultiplier(args.project.challengeLevel);

  return {
    checklistReadinessPercent,
    completionRatio,
    difficultyBonus,
    recencyBonus,
    pulseContributionPreview,
    weightedScore: pulseContributionPreview,
    difficultyMultiplier,
    evidenceQuality,
    recencyActivity,
  };
}
