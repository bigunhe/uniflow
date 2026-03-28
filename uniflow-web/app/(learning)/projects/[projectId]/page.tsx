"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Circle,
  Clock3,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FeatureTopbar } from "@/components/layout/FeatureTopbar";
import { mockProjectsById } from "@/lib/mockData";
import {
  readCompletedProjectIds,
  toggleCompletedProject,
} from "@/lib/projects/localState";

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = params?.projectId ?? "";
  const project = useMemo(() => mockProjectsById[projectId], [projectId]);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    setCompleted(readCompletedProjectIds().includes(projectId));
  }, [projectId]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#080c14] px-6 py-14 text-white">
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
    <div className="min-h-screen bg-[#080c14] text-white">
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,210,180,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,210,180,.03) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <FeatureTopbar
          backHref="/projects"
          backLabel="Projects"
          title={project.title}
          rightSlot={
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 text-white/70 hover:border-[#00d2b4]/40 hover:bg-[#00d2b4]/10 hover:text-[#00d2b4]"
              onClick={() => setCompleted(toggleCompletedProject(project.id).includes(project.id))}
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

        <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
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

          <aside className="rounded-2xl border border-[#00d2b4]/20 bg-[#00d2b4]/[0.05] p-6">
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

            <Button asChild className="mt-6 w-full bg-[#00d2b4] text-[#080c14] hover:bg-[#00d2b4]/85">
              <Link href="/projects/completed">Open Completed Projects</Link>
            </Button>
          </aside>
        </div>
      </div>
    </div>
  );
}
