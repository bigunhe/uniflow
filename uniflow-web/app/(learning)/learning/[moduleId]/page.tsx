"use client";

import Link from "next/link";
import { Brain, Search, Target, FileText, Sparkles, Loader2 } from "lucide-react";
import { mockModuleInsights, type ModuleInsight } from "@/lib/mockData";
import { SearchVectorItem } from "@/components/learning/SearchVectorItem";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  getLearningModuleByCode,
  listLearningFiles,
  normalizeModuleCode,
  type LearningFileRow,
  type LearningModuleRow,
} from "@/lib/learning/sync";
import {
  downloadStoredModuleInsights,
  type StoredModuleInsights,
} from "@/lib/learning/insights";
import {
  formatLearningFileSummary,
  storedInsightsToModuleInsight,
} from "@/lib/learning/moduleInsightDisplay";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FeatureTopbar } from "@/components/layout/FeatureTopbar";
import { Inter } from "next/font/google";
import { toast } from "sonner";

const inter = Inter({ subsets: ["latin"], weight: ["600", "700", "800"] });

const placeholderInsight = (moduleCode: string): ModuleInsight => ({
  moduleId: moduleCode,
  moduleName: "Custom Synced Module",
  resourceCount: 0,
  coreModels: [
    {
      id: "model-custom-1",
      headline: "Start with one big idea from this module",
      analogy:
        "Treat this as a blank whiteboard. Pick one concept from your uploaded files and explain it in your own words before checking notes.",
    },
  ],
  searchVectors: [
    "What is the single concept from this module that appears easy in class but fails in real systems, and why?",
    "If I had to teach this topic to a junior in 10 minutes, what examples would I use and what misconceptions must I prevent?",
  ],
  knowledgeGaps: [
    "Can I explain the main concept from this module without opening slides?",
    "Can I solve one practical problem from this module end-to-end with no hints?",
  ],
  files: [],
});

export default function DeepDiveRadarPage() {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams<{ moduleId: string }>();
  const moduleCode = normalizeModuleCode(params.moduleId ?? "");
  const [loading, setLoading] = useState(true);
  const [moduleRow, setModuleRow] = useState<LearningModuleRow | null>(null);
  const [fileRows, setFileRows] = useState<LearningFileRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [storedAi, setStoredAi] = useState<StoredModuleInsights | null>(null);
  const [generating, setGenerating] = useState(false);
  const [studentFocus, setStudentFocus] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!moduleCode) return;
      try {
        setLoadError(null);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.replace("/login");
          return;
        }

        const moduleData = await getLearningModuleByCode(
          supabase,
          user.id,
          moduleCode
        );
        const files = moduleData
          ? await listLearningFiles(supabase, user.id, moduleData.id)
          : [];

        let cached: StoredModuleInsights | null = null;
        if (moduleData) {
          cached = await downloadStoredModuleInsights(
            supabase,
            user.id,
            moduleCode
          );
        }

        if (!active) return;
        setModuleRow(moduleData);
        setFileRows(files);
        setStoredAi(cached);
      } catch (error) {
        if (!active) return;
        setLoadError(
          error instanceof Error
            ? error.message
            : "Could not load module data."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [moduleCode, router, supabase]);

  const insight = useMemo((): ModuleInsight => {
    if (moduleRow && storedAi) {
      return storedInsightsToModuleInsight(storedAi, moduleRow, fileRows);
    }
    const base = mockModuleInsights[moduleCode] ?? placeholderInsight(moduleCode);
    if (fileRows.length > 0) {
      return {
        ...base,
        moduleId: moduleRow?.module_code ?? base.moduleId,
        moduleName: moduleRow?.module_name ?? base.moduleName,
        resourceCount: moduleRow?.resource_count ?? fileRows.length,
        files: fileRows.map((file) => ({
          id: file.id,
          fileName: file.original_name,
          isDense: true,
          summary: formatLearningFileSummary(file),
        })),
      };
    }
    return base;
  }, [moduleRow, storedAi, fileRows, moduleCode]);

  const headerModuleCode = moduleRow?.module_code ?? insight.moduleId;
  const headerModuleName = moduleRow?.module_name ?? insight.moduleName;
  const headerResourceCount =
    moduleRow?.resource_count ?? Math.max(insight.resourceCount, fileRows.length);

  const displayFiles = insight.files;

  const runGenerate = useCallback(async () => {
    if (!moduleRow) {
      toast.error("Module data is not loaded yet.");
      return;
    }
    setGenerating(true);
    try {
      const res = await fetch("/api/learning/module-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moduleCode: moduleRow.module_code,
          studentFocus: studentFocus.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        stored?: StoredModuleInsights;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }
      if (data.stored) {
        setStoredAi(data.stored);
        toast.success("AI insights generated and saved.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not generate insights.");
    } finally {
      setGenerating(false);
    }
  }, [moduleRow, studentFocus]);

  if (!loading && !moduleRow && !mockModuleInsights[moduleCode]) {
    return (
      <div className="brand-dark-shell flex min-h-screen flex-col items-center justify-center bg-[#080c14] text-white">
        <p className="mb-4 text-lg text-white/40">Module not found.</p>
        <Link
          href="/learning"
          className="text-sm text-[#00d2b4] hover:underline"
        >
          ← Back to Modules
        </Link>
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
      <div className="pointer-events-none fixed left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-[#00d2b4]/6 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <FeatureTopbar backHref="/learning" backLabel="Modules" title="Module Radar" />

        <div className="mb-10">
          <div className="mb-2 font-mono text-sm font-semibold text-[#00d2b4]">
            {headerModuleCode}
          </div>
          <h1 className={`${inter.className} mb-2 text-3xl font-bold tracking-tight text-white`}>
            {headerModuleName}
          </h1>
          <p className="text-sm text-white/35">
            AI Discovery Active&nbsp;·&nbsp;{headerResourceCount} Resources Analyzed
          </p>
          {storedAi && moduleRow && (
            <p className="mt-2 text-xs text-white/40">
              Saved insights from{" "}
              {new Date(storedAi.generatedAt).toLocaleString()}
              {storedAi.model ? ` · ${storedAi.model}` : ""}
            </p>
          )}
          {loadError && (
            <p className="mt-2 text-xs text-amber-300/80">{loadError}</p>
          )}

          {moduleRow && (
            <div className="mt-6 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <label className="block text-xs font-medium uppercase tracking-wider text-white/45">
                Optional focus for AI (exam date, weak topics, …)
              </label>
              <textarea
                value={studentFocus}
                onChange={(e) => setStudentFocus(e.target.value)}
                rows={2}
                placeholder="e.g. Mid-term in 2 weeks — emphasize subnetting and routing tables"
                className="w-full resize-y rounded-lg border border-white/10 bg-[#080c14] px-3 py-2 text-sm text-white/90 placeholder:text-white/25 focus:border-[#00d2b4]/50 focus:outline-none"
              />
              <Button
                type="button"
                onClick={() => void runGenerate()}
                disabled={generating}
                className="w-full gap-2 bg-[#00d2b4] text-[#080c14] hover:bg-[#00d2b4]/90 sm:w-auto"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {generating ? "Generating…" : "Generate AI insights"}
              </Button>
            </div>
          )}
        </div>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-4 w-4 text-[#00d2b4]" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Core Mental Models
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            {insight.coreModels.map((model) => (
              <div
                key={model.id}
                className="rounded-r-xl border-l-[3px] border-[#00d2b4] bg-[#00d2b4]/5 px-5 py-4"
              >
                <p className="mb-2 text-sm font-semibold text-white/90">
                  {model.headline}
                </p>
                <p className="text-sm leading-relaxed text-white/55">
                  {model.analogy}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Search className="h-4 w-4 text-indigo-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Worth Searching
            </h2>
            <span className="text-xs text-white/25">— paste into Google or ChatGPT</span>
          </div>
          <div className="flex flex-col gap-2">
            {insight.searchVectors.map((question, i) => (
              <SearchVectorItem key={i} question={question} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-4 w-4 text-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Knowledge Gap Check
            </h2>
            <span className="text-xs text-white/25">— can you answer these without notes?</span>
          </div>
          <div className="flex flex-col gap-3">
            {insight.knowledgeGaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-3">
                <Checkbox
                  disabled
                  className="mt-0.5 shrink-0 cursor-default opacity-60"
                />
                <p className="text-sm leading-relaxed text-white/60">{gap}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-white/30" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Lecture Files
            </h2>
          </div>
          <Accordion type="multiple" className="rounded-xl border border-white/8 bg-white/[0.02] px-4">
            {displayFiles.map((file) => (
              <AccordionItem key={file.id} value={file.id}>
                <AccordionTrigger className="text-left text-sm">
                  <span className="flex items-center gap-2">
                    {file.fileName}
                    {!file.isDense && (
                      <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/30">
                        summary only
                      </span>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm leading-relaxed text-white/50">
                    {file.summary}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

      </div>
    </div>
  );
}
