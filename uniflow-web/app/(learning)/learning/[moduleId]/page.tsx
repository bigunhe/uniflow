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
import {
  alignChecksToLength,
  moduleGapSelfCheckPercent,
  readGapChecksMap,
  setModuleGapChecks,
} from "@/lib/learning/gapCheckProgress";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { FeatureTopbar } from "@/components/layout/FeatureTopbar";
import { Inter } from "next/font/google";
import { toast } from "sonner";

const inter = Inter({ subsets: ["latin"], weight: ["600", "700", "800"] });

/** Real synced module with no saved insights yet — no fake AI cards. */
function emptyInsightForModule(
  moduleRow: LearningModuleRow,
  fileRows: LearningFileRow[]
): ModuleInsight {
  return {
    moduleId: moduleRow.module_code,
    moduleName: moduleRow.module_name,
    resourceCount: moduleRow.resource_count,
    coreModels: [],
    searchVectors: [],
    knowledgeGaps: [],
    files: fileRows.map((file) => ({
      id: file.id,
      fileName: file.original_name,
      isDense: true,
      summary: formatLearningFileSummary(file),
    })),
  };
}

function emptyShellForCode(moduleCode: string, fileRows: LearningFileRow[]): ModuleInsight {
  return {
    moduleId: moduleCode,
    moduleName: moduleCode,
    resourceCount: fileRows.length,
    coreModels: [],
    searchVectors: [],
    knowledgeGaps: [],
    files: fileRows.map((file) => ({
      id: file.id,
      fileName: file.original_name,
      isDense: true,
      summary: formatLearningFileSummary(file),
    })),
  };
}

function EmptySectionCard({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-6 text-sm leading-relaxed text-white/45">
      {children}
    </div>
  );
}

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
  const [userId, setUserId] = useState<string | null>(null);
  const [gapChecks, setGapChecks] = useState<boolean[]>([]);

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
        if (!active) return;
        setUserId(user.id);

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
    if (moduleRow && !storedAi) {
      return emptyInsightForModule(moduleRow, fileRows);
    }
    const demo = mockModuleInsights[moduleCode];
    if (demo && !moduleRow) {
      return demo;
    }
    return emptyShellForCode(moduleCode, fileRows);
  }, [moduleRow, storedAi, fileRows, moduleCode]);

  const hasSavedInsights = Boolean(moduleRow && storedAi);
  const showEmptyInsightSections = Boolean(moduleRow && !storedAi);
  const gapCount = insight.knowledgeGaps.length;

  useEffect(() => {
    if (!userId || !moduleCode) {
      setGapChecks([]);
      return;
    }
    const map = readGapChecksMap(userId);
    setGapChecks(alignChecksToLength(map[moduleCode], gapCount));
  }, [userId, moduleCode, gapCount]);

  const gapSelfCheckPct = moduleGapSelfCheckPercent(gapChecks);

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
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        stored?: StoredModuleInsights;
        error?: string;
        code?: string;
        retryAfterSec?: number;
        digestDetails?: { file: string; reason: string }[];
      };
      if (!res.ok) {
        if (data.code === "GEMINI_QUOTA") {
          const wait =
            typeof data.retryAfterSec === "number" && data.retryAfterSec > 0
              ? ` Try again in ~${data.retryAfterSec}s.`
              : "";
          throw new Error(
            `Gemini quota or rate limit.${wait} Check Google AI Studio usage or set GEMINI_MODEL in .env.`
          );
        }
        if (data.digestDetails?.length) {
          console.warn("[learning] Digest extraction details:", data.digestDetails);
        }
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
  }, [moduleRow]);

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

  if (loading) {
    return (
      <div className="brand-dark-shell flex min-h-screen items-center justify-center bg-[#080c14] text-sm text-white/45">
        Loading module…
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
            {hasSavedInsights
              ? `Insights from synced files · ${headerResourceCount} resources in module`
              : moduleRow
                ? `No AI insights yet · ${headerResourceCount} resource${headerResourceCount === 1 ? "" : "s"} synced — generate below from PDF/PPTX text`
                : `Demo or loading · ${headerResourceCount} resource${headerResourceCount === 1 ? "" : "s"}`}
          </p>
          {storedAi && moduleRow && (
            <p className="mt-2 text-xs text-white/40">
              Saved insights from{" "}
              {new Date(storedAi.generatedAt).toLocaleString()}
              {storedAi.model ? ` · ${storedAi.model}` : ""}
              {storedAi.digestTruncated
                ? " · digest truncated (character budget; add key lectures first)"
                : ""}
            </p>
          )}
          {loadError && (
            <p className="mt-2 text-xs text-amber-300/80">{loadError}</p>
          )}

          {moduleRow && (
            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="mb-3 text-xs text-white/40">
                Builds study hooks from your synced PDF and PPTX files (text extraction). Not a chat box.
              </p>
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
            {insight.coreModels.length === 0 && showEmptyInsightSections ? (
              <EmptySectionCard>
                Not generated yet. After you click <strong className="text-white/60">Generate AI insights</strong>,
                mental models from your lecture text will appear here.
              </EmptySectionCard>
            ) : (
              insight.coreModels.map((model) => (
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
              ))
            )}
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
            {insight.searchVectors.length === 0 && showEmptyInsightSections ? (
              <EmptySectionCard>
                Not generated yet. You will get concrete, module-specific search strings to paste elsewhere — not generic study tips.
              </EmptySectionCard>
            ) : (
              insight.searchVectors.map((item, i) => (
                <SearchVectorItem
                  key={i}
                  query={item.query}
                  sourceFiles={item.sourceFiles}
                />
              ))
            )}
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1">
            <Target className="h-4 w-4 shrink-0 text-amber-400" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Knowledge Gap Check
            </h2>
            <span className="text-xs text-white/25">— can you answer these without notes?</span>
            {gapSelfCheckPct !== null && userId ? (
              <span className="text-xs font-medium text-amber-400/90">
                · Self-check: {gapSelfCheckPct}% ({gapChecks.filter(Boolean).length}/{gapChecks.length})
              </span>
            ) : gapCount === 0 ? (
              <span className="text-xs text-white/25">· No prompts yet</span>
            ) : null}
          </div>
          <div className="flex flex-col gap-3">
            {insight.knowledgeGaps.length === 0 && showEmptyInsightSections ? (
              <EmptySectionCard>
                Not generated yet. Self-check prompts tied to your slides will show here after generation.
              </EmptySectionCard>
            ) : (
              insight.knowledgeGaps.map((gap, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Checkbox
                    checked={gapChecks[i] === true}
                    onCheckedChange={(v) => {
                      const on = v === true;
                      const next = gapChecks.slice();
                      if (next.length !== gapCount) return;
                      next[i] = on;
                      setGapChecks(next);
                      if (userId) setModuleGapChecks(userId, moduleCode, next);
                    }}
                    disabled={!userId || gapChecks.length !== gapCount}
                    className="mt-0.5 shrink-0 border-amber-400/30 data-[state=checked]:border-amber-400 data-[state=checked]:bg-amber-400 data-[state=checked]:text-[#080c14]"
                  />
                  <p className="text-sm leading-relaxed text-white/60">{gap}</p>
                </div>
              ))
            )}
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
