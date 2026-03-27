"use client";

import { Layers } from "lucide-react";
import { mockAppliedProjects } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectCard } from "@/components/learning/ProjectCard";
import { FeatureTopbar } from "@/components/layout/FeatureTopbar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["600", "700", "800"] });

const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4"] as const;

export default function AppliedProjectsPage() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white">
      {/* Ambient background */}
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

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        <FeatureTopbar backHref="/learning" backLabel="Modules" title="Projects" />

        {/* Header */}
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00d2b4]/25 bg-[#00d2b4]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#00d2b4]">
            <Layers className="h-3 w-3" />
            Applied Projects
          </div>
          <h1 className={`${inter.className} mb-2 text-3xl font-bold tracking-tight text-white`}>
            Applied Projects
          </h1>
          <p className="max-w-lg text-sm text-white/40">
            Cross-disciplinary weekend sprints. No tutorials. Read the docs and
            figure it out.
          </p>
        </div>

        {/* Year Tabs */}
        <Tabs defaultValue="Year 3">
          <TabsList className="mb-6 flex flex-wrap gap-1 h-auto">
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
                  <div className="grid gap-5 sm:grid-cols-2">
                    {projects.map((proj) => (
                      <ProjectCard
                        key={proj.id}
                        title={proj.title}
                        brief={proj.brief}
                        modules={proj.modules}
                        stack={proj.stack}
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
