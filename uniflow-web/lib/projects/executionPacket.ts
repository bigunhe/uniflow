import { z } from "zod";
import type { MockProject } from "@/lib/mockData";

export const projectExecutionPacketSchema = z.object({
  mvp: z.array(z.string()).min(2).max(8),
  better: z.array(z.string()).min(2).max(8),
  excellent: z.array(z.string()).min(2).max(8),
  timeline: z.array(z.string()).min(3).max(10),
  risks: z.array(z.string()).min(2).max(8),
  deliverables: z.array(z.string()).min(3).max(10),
});

export type ProjectExecutionPacket = z.infer<typeof projectExecutionPacketSchema>;

export const PROJECT_EVIDENCE_KEYS = [
  "architectureNote",
  "implementationProof",
  "testingProof",
  "reflectionNote",
] as const;

export type ProjectEvidenceKey = (typeof PROJECT_EVIDENCE_KEYS)[number];
export type ProjectEvidenceChecklist = Record<ProjectEvidenceKey, boolean>;

export const defaultProjectEvidenceChecklist = (): ProjectEvidenceChecklist => ({
  architectureNote: false,
  implementationProof: false,
  testingProof: false,
  reflectionNote: false,
});

export function createFallbackExecutionPacket(
  project: MockProject,
  studentFocus?: string
): ProjectExecutionPacket {
  const focusText = studentFocus?.trim();
  const focusSuffix = focusText ? `(${focusText})` : "(from module goals)";
  return {
    mvp: [
      `Define a minimal scope and data model ${focusSuffix}.`,
      `Build one end-to-end flow using ${project.stack.slice(0, 2).join(" + ")}.`,
      "Add basic validation and error states for the core flow.",
    ],
    better: [
      "Add one meaningful UX improvement and one refactor for clarity.",
      "Introduce logging/metrics for key actions.",
      "Cover high-risk paths with reproducible test cases.",
    ],
    excellent: [
      "Ship one advanced feature with measurable impact.",
      "Document architecture trade-offs and future extension points.",
      "Polish deployment/demo flow and performance bottlenecks.",
    ],
    timeline: [
      "Day 1: Scope + data/contracts + setup repo structure.",
      "Day 2: Core implementation and manual validation.",
      "Day 3: Testing, evidence capture, and reflection notes.",
    ],
    risks: [
      "Scope creep beyond weekend limits.",
      "Low test coverage for failure paths.",
      "Integration mismatch across modules/tools.",
    ],
    deliverables: [
      "Working repository with clear README and run steps.",
      "Evidence bundle (screenshots/video, test results).",
      "Reflection note: what failed, what changed, what improved.",
    ],
  };
}

export function parseExecutionPacketJson(raw: string): ProjectExecutionPacket | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const validated = projectExecutionPacketSchema.safeParse(parsed);
    return validated.success ? validated.data : null;
  } catch {
    return null;
  }
}
