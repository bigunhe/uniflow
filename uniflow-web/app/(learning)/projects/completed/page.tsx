"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ExternalLink, Github, ImageIcon } from "lucide-react";
import { FeatureTopbar } from "@/components/layout/FeatureTopbar";
import { mockProjectsById } from "@/lib/mockData";
import { readCompletedProjectIds } from "@/lib/projects/localState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CompletedProjectsPage() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    setCompletedIds(readCompletedProjectIds());
  }, []);

  const completedProjects = useMemo(
    () => completedIds.map((id) => mockProjectsById[id]).filter(Boolean),
    [completedIds]
  );

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

      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <FeatureTopbar backHref="/projects" backLabel="Projects" title="Completed Projects" />

        <div className="mb-8 rounded-2xl border border-[#00d2b4]/20 bg-[#00d2b4]/[0.06] p-5">
          <h1 className="text-xl font-semibold">Track External Project Work</h1>
          <p className="mt-1 text-sm text-white/55">
            Students build projects outside this platform. This page stores their
            completed list and collects verification artifacts with mock inputs.
          </p>
        </div>

        {completedProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center">
            <p className="text-sm text-white/45">
              No completed projects yet. Open a project and click{" "}
              <span className="text-white/70">Mark as Completed</span>.
            </p>
            <Button asChild className="mt-5">
              <Link href="/projects">Browse Projects</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {completedProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <Badge variant="outline">{project.year}</Badge>
                  <span className="inline-flex items-center gap-1 text-xs text-[#00d2b4]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Completed
                  </span>
                </div>
                <h2 className="text-lg font-semibold">{project.title}</h2>
                <p className="mt-2 text-sm text-white/50">{project.brief}</p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-white/40">
                      GitHub Repository
                    </label>
                    <Input
                      placeholder="https://github.com/username/project-repo"
                      className="border-white/15 bg-[#0b111b] text-white placeholder:text-white/25"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-white/40">
                      Screenshot Links
                    </label>
                    <Input
                      placeholder="Drive link / image URLs"
                      className="border-white/15 bg-[#0b111b] text-white placeholder:text-white/25"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs uppercase tracking-wider text-white/40">
                      Reflection Notes
                    </label>
                    <textarea
                      placeholder="What you built, key challenge, and what you learned."
                      className="min-h-[92px] w-full rounded-md border border-white/15 bg-[#0b111b] px-3 py-2 text-sm text-white placeholder:text-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00d2b4]/40"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button className="flex-1 bg-[#00d2b4] text-[#080c14] hover:bg-[#00d2b4]/85">
                    Submit Mock Verification
                  </Button>
                  <Button asChild variant="outline" className="border-white/15 bg-white/5 text-white/65 hover:border-white/30 hover:text-white">
                    <Link href={`/projects/${project.id}`}>
                      <ExternalLink className="mr-1 h-4 w-4" />
                      Open
                    </Link>
                  </Button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-white/35">
                  <span className="inline-flex items-center gap-1">
                    <Github className="h-3.5 w-3.5" />
                    Repo link
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5" />
                    Screenshot proof
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
