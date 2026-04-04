"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Circle,
  Clock3,
  Loader2,
  Sparkles,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureTopbar } from "@/components/layout/FeatureTopbar";
import { mockProjectsById } from "@/lib/mockData";
import {
  getProjectProgressPercent,
  getProjectState,
  markProjectTouched,
  readCompletedProjectIds,
  setExecutionPacket,
  setProjectScoreComponents,
  toggleCompletedProject,
  updateEvidenceChecklist,
} from "@/lib/projects/localState";
import {
  defaultProjectEvidenceChecklist,
  PROJECT_EVIDENCE_KEYS,
  type ProjectEvidenceChecklist,
  type ProjectExecutionPacket,
} from "@/lib/projects/executionPacket";
import { computeProjectScoreComponents } from "@/lib/projects/scoring";
import { syncProjectsPulseCredits } from "@/lib/projects/pulseContribution";
import { createClient } from "@/lib/supabase/client";

function daysSince(dateIso?: string | null): number | null {
  if (!dateIso) return null;
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return null;
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId ?? "";
  const project = useMemo(() => mockProjectsById[projectId], [projectId]);
  const [completed, setCompleted] = useState(false);
  const [studentFocus, setStudentFocus] = useState("");
  const [packetLoading, setPacketLoading] = useState(false);
  const [packetProvider, setPacketProvider] = useState<string | null>(null);
  const [packet, setPacket] = useState<ProjectExecutionPacket | null>(null);
  const [evidence, setEvidence] = useState<ProjectEvidenceChecklist>(
    defaultProjectEvidenceChecklist()
  );
  const [progress, setProgress] = useState(0);
  const [lastTouchedAt, setLastTouchedAt] = useState<string | null>(null);
  const supabase = useMemo(() => createClient(), []);
  const pulseSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const schedulePulseSync = useCallback(() => {
    if (pulseSyncTimer.current) clearTimeout(pulseSyncTimer.current);
    pulseSyncTimer.current = setTimeout(async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) await syncProjectsPulseCredits(supabase, user.id);
    }, 500);
  }, [supabase]);

  useEffect(() => {
    return () => {
      if (pulseSyncTimer.current) clearTimeout(pulseSyncTimer.current);
    };
  }, []);

  const scoreComponents = useMemo(() => {
    if (!project) return null;
    return computeProjectScoreComponents({
      project,
      completed,
      evidence,
      lastTouchedAt,
    });
  }, [project, completed, evidence, lastTouchedAt]);

  useEffect(() => {
    if (!projectId) return;
    const persisted = getProjectState(projectId);
    const completedIds = readCompletedProjectIds();
    const completedState = persisted.completed || completedIds.includes(projectId);
    setCompleted(completedState);
    setPacket(persisted.executionPacket?.packet ?? null);
    setPacketProvider(persisted.executionPacket?.provider ?? null);
    setEvidence(persisted.evidence ?? defaultProjectEvidenceChecklist());
    setProgress(getProjectProgressPercent(projectId));
    setLastTouchedAt(persisted.lastTouchedAt);
    if (project) {
      const score = computeProjectScoreComponents({
        project,
        completed: completedState,
        evidence: persisted.evidence ?? defaultProjectEvidenceChecklist(),
        lastTouchedAt: persisted.lastTouchedAt,
      });
      setProjectScoreComponents(projectId, score);
    }
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) await syncProjectsPulseCredits(supabase, user.id);
    })();
  }, [projectId, project, supabase]);

  const refreshDerived = (
    completedValue: boolean,
    evidenceValue: ProjectEvidenceChecklist,
    touchedAt?: string | null
  ) => {
    if (!project) return;
    const score = computeProjectScoreComponents({
      project,
      completed: completedValue,
      evidence: evidenceValue,
      lastTouchedAt: touchedAt ?? getProjectState(projectId).lastTouchedAt,
    });
    setProjectScoreComponents(projectId, score);
    setProgress(getProjectProgressPercent(projectId));
    schedulePulseSync();
  };

  if (!project) {
    return (
      <div className="brand-dark-shell min-h-screen bg-[#080c14] px-6 py-14 text-white">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-white/[0.03] p-8">
          <h1 className="text-xl font-semibold">Project not found</h1>
          <p className="mt-2 text-sm text-white/40">
            The selected project is not available in mock data.
          </p>
          <Button asChild className="mt-5">
            <Link href="/projects">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Projects
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="brand-dark-shell min-h-screen bg-[#080c14] text-white">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,210,180,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.03) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-[90rem] px-6 py-12">
        <FeatureTopbar
          backHref="/projects"
          backLabel="Projects"
          title={project.title}
          rightSlot={
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 text-white/70 hover:border-[#00d2b4]/40 hover:bg-[#00d2b4]/10 hover:text-[#00d2b4]"
              onClick={() => {
                const ids = toggleCompletedProject(project.id);
                const nextCompleted = ids.includes(project.id);
                setCompleted(nextCompleted);
                const nextTouched = markProjectTouched(project.id).lastTouchedAt;
                setLastTouchedAt(nextTouched);
                refreshDerived(nextCompleted, evidence, nextTouched);
              }}
            >
              {completed ? (
                <>
                  <CheckCircle2 className="mr-1 h-4 w-4 text-[#00d2b4]" />
                  Marked Completed
                </>
              ) : (
                <>
                  <Circle className="mr-1 h-4 w-4" />
                  Mark as Completed
                </>
              )}
            </Button>
          }
        />

        <div className="grid gap-8 lg:grid-cols-[1.4fr_minmax(280px,0.9fr)]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge className="text-[11px]">{project.year}</Badge>
              <Badge variant="outline" className="text-[11px]">
                <Clock3 className="mr-1 h-3 w-3" />
                {project.weekendEstimate}
              </Badge>
              <Badge variant="outline" className="text-[11px]">
                {project.challengeLevel}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
            <p className="mt-3 text-sm leading-relaxed text-white/50">{project.brief}</p>

            <div className="mt-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/65">
                Overview
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                {project.learningGoals.map((goal) => (
                  <li key={goal} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00d2b4]" />
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/65">
                Instructions
              </h2>
              <ol className="mt-3 space-y-3 text-sm text-white/60">
                {project.instructions.map((step, idx) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/15 text-xs text-white/60">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/65">
                Execution Packet
              </h2>
              <p className="mt-2 text-sm text-white/50">
                This is an <span className="text-white/70">optional AI-assisted plan</span>—it does not replace the
                instructions above. Use it when you want a tighter MVP → stretch path, timeline, risks, and
                demo checklist tailored to your focus.
              </p>
              <p className="mt-1 text-sm text-white/45">
                Generate a practical MVP / better / excellent path with timeline, risks, and demo-ready outputs.
              </p>
              <div className="mt-3 rounded-xl border border-white/10 bg-[#0c111a] p-4">
                <label className="text-xs uppercase tracking-wider text-white/35">
                  Optional focus
                </label>
                <textarea
                  value={studentFocus}
                  onChange={(event) => setStudentFocus(event.target.value)}
                  className="mt-2 min-h-[70px] w-full rounded-md border border-white/10 bg-[#080c14] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2b4]/40"
                  placeholder="e.g. Must finish in 2 days, focus on API testing and resilient error handling."
                />
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    disabled={packetLoading}
                    className="bg-[#00d2b4] text-[#080c14] hover:bg-[#00d2b4]/85"
                    onClick={async () => {
                      try {
                        setPacketLoading(true);
                        const response = await fetch("/api/projects/execution-packet", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            projectId: project.id,
                            studentFocus: studentFocus.trim() || undefined,
                            syncedModuleNames: project.modules,
                          }),
                        });
                        const data = (await response.json()) as {
                          error?: string;
                          provider?: string;
                          packet?: ProjectExecutionPacket;
                        };
                        if (!response.ok || !data.packet) {
                          throw new Error(data.error ?? "Could not generate execution packet.");
                        }
                        setPacket(data.packet);
                        setPacketProvider(data.provider ?? "unknown");
                        const touched = setExecutionPacket(
                          project.id,
                          data.packet,
                          data.provider ?? "unknown"
                        ).lastTouchedAt;
                        setLastTouchedAt(touched);
                        refreshDerived(completed, evidence, touched);
                      } catch (error) {
                        alert(
                          error instanceof Error
                            ? error.message
                            : "Could not generate execution packet."
                        );
                      } finally {
                        setPacketLoading(false);
                      }
                    }}
                  >
                    {packetLoading ? (
                      <>
                        <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-1 h-4 w-4" />
                        Generate Packet
                      </>
                    )}
                  </Button>
                  {packetProvider ? (
                    <span className="text-xs text-white/40">Provider: {packetProvider}</span>
                  ) : null}
                </div>
                {packet ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    {[
                      { title: "MVP", items: packet.mvp },
                      { title: "Better", items: packet.better },
                      { title: "Excellent", items: packet.excellent },
                      { title: "Timeline", items: packet.timeline },
                      { title: "Risks", items: packet.risks },
                      { title: "Deliverables", items: packet.deliverables },
                    ].map((section) => (
                      <div key={section.title} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
                          {section.title}
                        </p>
                        <ul className="mt-2 space-y-1.5 text-sm text-white/65">
                          {section.items.map((item) => (
                            <li key={item} className="flex gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00d2b4]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-white/35">
                    No execution packet yet. Generate one to get project-specific scope and timeline.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white/65">
                Suggested Deliverables
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-white/60">
                {project.deliverables.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#00d2b4]/80" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-xl border border-white/10 bg-[#0c111a] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/65">
                  Evidence Progress
                </h2>
                <span className="rounded-md border border-[#00d2b4]/30 bg-[#00d2b4]/10 px-2 py-0.5 text-xs font-semibold text-[#7ae9d8]">
                  {progress}% complete
                </span>
              </div>
              <div className="mt-4 space-y-2">
                {PROJECT_EVIDENCE_KEYS.map((key) => {
                  const labelMap: Record<(typeof PROJECT_EVIDENCE_KEYS)[number], string> = {
                    architectureNote: "Architecture / design note",
                    implementationProof: "Implementation proof (repo/screens)",
                    testingProof: "Testing proof",
                    reflectionNote: "Reflection note",
                  };
                  return (
                    <label
                      key={key}
                      className="flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/70"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[#00d2b4]"
                        checked={evidence[key]}
                        onChange={(event) => {
                          const nextEvidence = {
                            ...evidence,
                            [key]: event.target.checked,
                          };
                          setEvidence(nextEvidence);
                          const nextTouched = updateEvidenceChecklist(project.id, {
                            [key]: event.target.checked,
                          }).lastTouchedAt;
                          setLastTouchedAt(nextTouched);
                          refreshDerived(completed, nextEvidence, nextTouched);
                        }}
                      />
                      {labelMap[key]}
                    </label>
                  );
                })}
              </div>
              <div className="mt-4 space-y-2 text-xs text-white/40">
                <p>
                  <span className="text-white/55">Pulse contribution (projects): </span>
                  <span className="font-semibold text-[#7ae9d8]/90">
                    {scoreComponents?.pulseContributionPreview ?? 0}
                  </span>
                  <span className="text-white/35"> / 100</span>
                  <span className="block pt-1 text-[11px] text-white/35">
                    Starts from checklist progress, then adds small bonuses for recent activity and project
                    difficulty (capped at 100). Your dashboard Pulse ring updates from verified project
                    progress (aggregated across projects, capped).
                  </span>
                </p>
                {scoreComponents ? (
                  <details className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-[11px]">
                    <summary className="cursor-pointer text-white/45">Score breakdown</summary>
                    <ul className="mt-2 space-y-1 text-white/40">
                      <li>Checklist progress: {scoreComponents.checklistReadinessPercent}%</li>
                      <li>Recency bonus: +{scoreComponents.recencyBonus}</li>
                      <li>Difficulty bonus: +{scoreComponents.difficultyBonus}</li>
                    </ul>
                  </details>
                ) : null}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {project.modules.map((module) => (
                <Badge key={module} variant="default">
                  {module}
                </Badge>
              ))}
              {project.stack.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>
          </section>

          <aside className="rounded-2xl border border-[#00d2b4]/20 bg-[#00d2b4]/[0.05] p-6 lg:sticky lg:top-8 lg:self-start">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00d2b4]/30 bg-[#00d2b4]/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-[#00d2b4]">
              <Bot className="h-3.5 w-3.5" />
              Ask AI Guide
            </div>
            <h2 className="mt-4 text-lg font-semibold">Guided Self-Learning</h2>
            <p className="mt-2 text-sm text-white/55">
              This panel mimics an AI teaching assistant trained to coach students
              through project decisions without giving full copy-paste solutions.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-[#0c111a] p-4">
              <p className="text-xs uppercase tracking-wider text-white/35">
                What this AI should guide
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/65">
                {project.aiGuideFocus.map((focus) => (
                  <li key={focus} className="flex gap-2">
                    <Wrench className="mt-0.5 h-4 w-4 text-[#00d2b4]/70" />
                    <span>{focus}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-[#0c111a] p-4">
              <p className="text-xs uppercase tracking-wider text-white/35">
                Prompt ideas for students
              </p>
              <div className="mt-3 space-y-2 text-sm text-white/60">
                <p>"Help me break this project into milestone checkpoints."</p>
                <p>"What should I test first before writing more features?"</p>
                <p>"I am stuck on one part - give me hints, not full code."</p>
              </div>
            </div>

            {(() => {
              const idleDays = daysSince(lastTouchedAt);
              if (idleDays === null || idleDays < 3) return null;
              return (
                <div className="mt-4 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <p className="text-xs uppercase tracking-wider text-amber-200/70">
                    Resume nudge
                  </p>
                  <p className="mt-1 text-sm text-amber-100/90">
                    No updates for {idleDays} days. Next smallest step: finish one unchecked evidence item, then rerun packet with a narrowed focus.
                  </p>
                </div>
              );
            })()}

            <Button asChild className="mt-6 w-full bg-[#00d2b4] text-[#080c14] hover:bg-[#00d2b4]/85">
              <Link href="/projects/completed">Open Completed Projects</Link>
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
