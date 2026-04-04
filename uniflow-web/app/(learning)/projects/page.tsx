"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Layers, CheckCircle2, Sparkles } from "lucide-react";
import {
  mockAppliedProjects,
  mockSyncedModules,
  type ProjectYear,
  type MockProject,
} from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/learning/ProjectCard";
import { FeatureTopbar } from "@/components/layout/FeatureTopbar";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { listLearningModules } from "@/lib/learning/sync";
import { recommendProjectsForSyncedModules } from "@/lib/projects/recommend";
import { getProjectProgressPercent, readProjectStateMap } from "@/lib/projects/localState";

const inter = Inter({ subsets: ["latin"], weight: ["600", "700", "800"] });

const YEARS: ProjectYear[] = ["Year 1", "Year 2", "Year 3", "Year 4"];

export default function ProjectsPage() {
  const supabase = createClient();
  const [syncedModuleNames, setSyncedModuleNames] = useState<string[]>([]);
  const [academicYear, setAcademicYear] = useState<string | null>(null);
  const [recommendationReady, setRecommendationReady] = useState(false);
  const [progressByProject, setProgressByProject] = useState<Record<string, number>>({});

  useEffect(() => {
    let active = true;

    const loadContext = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!active) return;

        if (!user) {
          // Demo fallback for logged-out or stale session states.
          setSyncedModuleNames(mockSyncedModules.map((mod) => mod.moduleName));
          setRecommendationReady(true);
          return;
        }

        const [modules, profileResult] = await Promise.all([
          listLearningModules(supabase, user.id),
          supabase.from("profiles").select("academic_year").eq("id", user.id).maybeSingle(),
        ]);

        if (!active) return;

        const realModuleNames = modules.map((mod) => mod.module_name).filter(Boolean);
        setSyncedModuleNames(
          realModuleNames.length > 0
            ? realModuleNames
            : mockSyncedModules.map((mod) => mod.moduleName)
        );
        setAcademicYear(profileResult.data?.academic_year ?? null);
      } catch {
        if (!active) return;
        setSyncedModuleNames(mockSyncedModules.map((mod) => mod.moduleName));
      } finally {
        if (active) setRecommendationReady(true);
      }
    };

    loadContext();
    return () => {
      active = false;
    };
  }, [supabase]);

  const allProjects = useMemo<MockProject[]>(
    () => YEARS.flatMap((year) => mockAppliedProjects[year] ?? []),
    []
  );

  const recommendations = useMemo(
    () =>
      recommendProjectsForSyncedModules({
        projects: allProjects,
        syncedModuleNames,
        userAcademicYear: academicYear,
        limit: 8,
      }),
    [allProjects, syncedModuleNames, academicYear]
  );

  useEffect(() => {
    const hydrateProgress = () => {
      const map = readProjectStateMap();
      const rows: Record<string, number> = {};
      for (const projectId of Object.keys(map)) {
        rows[projectId] = getProjectProgressPercent(projectId);
      }
      setProgressByProject(rows);
    };
    hydrateProgress();
    window.addEventListener("storage", hydrateProgress);
    window.addEventListener("uniflow-project-state-changed", hydrateProgress);
    return () => {
      window.removeEventListener("storage", hydrateProgress);
      window.removeEventListener("uniflow-project-state-changed", hydrateProgress);
    };
  }, []);

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
      <div className="pointer-events-none fixed left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-[#00d2b4]/6 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <FeatureTopbar
          backHref="/dashboard"
          backLabel="Dashboard"
          title="Projects"
          rightSlot={
            <Link href="/projects/completed">
              <Button
                variant="outline"
                size="sm"
                className="border-white/15 bg-white/5 text-white/60 hover:border-[#00d2b4]/40 hover:bg-[#00d2b4]/10 hover:text-[#00d2b4]"
              >
                <CheckCircle2 className="mr-1 h-4 w-4" />
                Completed Projects
              </Button>
            </Link>
          }
        />

        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00d2b4]/25 bg-[#00d2b4]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#00d2b4]">
            <Layers className="h-3 w-3" />
            Weekend Project Studio
          </div>
          <h1 className={`${inter.className} mb-2 text-3xl font-bold tracking-tight text-white`}>
            Projects by Year
          </h1>
          <p className="max-w-3xl text-sm text-white/40">
            Most projects are one-weekend builds: not too easy, not too hard. We
            guide your direction with outcomes, tools, and technologies - you
            still explore and implement independently.
          </p>
        </div>

        <section className="mb-10 rounded-2xl border border-[#00d2b4]/20 bg-[#00d2b4]/[0.06] p-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00d2b4]/30 bg-[#00d2b4]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#00d2b4]">
            <Sparkles className="h-3 w-3" />
            Module-aware picks
          </div>
          <h2 className="text-lg font-semibold text-white">
            Recommended from your synced modules
          </h2>
          <p className="mt-1 text-sm text-white/55">
            {syncedModuleNames.length > 0
              ? `Using your synced modules: ${syncedModuleNames.slice(0, 5).join(", ")}${
                  syncedModuleNames.length > 5 ? "..." : ""
                }`
              : "Sync modules to unlock personalized recommendations."}
          </p>

          {!recommendationReady ? (
            <p className="mt-4 text-sm text-white/45">Building recommendations...</p>
          ) : recommendations.length === 0 ? (
            <p className="mt-4 text-sm text-white/45">
              No direct matches yet. Try syncing more modules and check all year tabs below.
            </p>
          ) : (
            <div className="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {recommendations.map(
                ({ project, matchedTopicLabels, gapTopicLabels, readinessLevel, whyMatched }) => (
                  <div
                    key={project.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4"
                  >
                    <div className="min-h-0 flex-1">
                      <ProjectCard
                        id={project.id}
                        title={project.title}
                        brief={project.brief}
                        modules={project.modules}
                        stack={project.stack}
                        weekendEstimate={project.weekendEstimate}
                        challengeLevel={project.challengeLevel}
                        readinessLevel={readinessLevel}
                        progressPercent={progressByProject[project.id] ?? 0}
                      />
                    </div>
                    <div className="space-y-2 border-t border-white/10 pt-3">
                      {matchedTopicLabels.length > 0 && (
                        <p className="text-xs leading-relaxed text-[#7ae9d8]">
                          <span className="font-semibold text-[#7ae9d8]/90">Match: </span>
                          {matchedTopicLabels.join(" · ")}
                        </p>
                      )}
                      {gapTopicLabels.length ? (
                        <p className="text-xs leading-relaxed text-amber-300/85">
                          <span className="font-semibold text-amber-200/90">Prep first: </span>
                          {gapTopicLabels.slice(0, 3).join(" · ")}
                        </p>
                      ) : null}
                      <details className="group text-[11px] text-white/40">
                        <summary className="cursor-pointer list-none text-white/50 underline-offset-2 transition hover:text-[#7ae9d8]/90 [&::-webkit-details-marker]:hidden">
                          <span className="underline decoration-white/20 group-open:decoration-[#00d2b4]/50">
                            Why this pick
                          </span>
                        </summary>
                        <p className="mt-2 leading-relaxed text-white/45">{whyMatched}</p>
                      </details>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>

        <Tabs defaultValue="Year 3">
          <TabsList className="mb-6 flex h-auto flex-wrap gap-1">
            {YEARS.map((year) => (
              <TabsTrigger key={year} value={year}>
                {year}
              </TabsTrigger>
            ))}
          </TabsList>

          {YEARS.map((year) => {
            const projects = mockAppliedProjects[year] ?? [];
            return (
              <TabsContent key={year} value={year}>
                {projects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-20 text-center">
                    <Layers className="mb-4 h-10 w-10 text-white/15" strokeWidth={1} />
                    <p className="text-sm text-white/30">
                      No projects available for {year} yet.
                    </p>
                    <p className="mt-1 text-xs text-white/20">
                      Check back next sprint.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {projects.map((proj) => (
                      <ProjectCard
                        key={proj.id}
                        id={proj.id}
                        title={proj.title}
                        brief={proj.brief}
                        modules={proj.modules}
                        stack={proj.stack}
                        weekendEstimate={proj.weekendEstimate}
                        challengeLevel={proj.challengeLevel}
                        progressPercent={progressByProject[proj.id] ?? 0}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
