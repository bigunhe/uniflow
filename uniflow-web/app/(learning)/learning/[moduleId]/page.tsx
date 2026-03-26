import Link from "next/link";
import { ArrowLeft, Brain, Search, Target, FileText } from "lucide-react";
import { mockModuleInsights } from "@/lib/mockData";
import { SearchVectorItem } from "@/components/learning/SearchVectorItem";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Props {
  params: Promise<{ moduleId: string }>;
}

export default async function DeepDiveRadarPage({ params }: Props) {
  const { moduleId } = await params;
  const insight = mockModuleInsights[moduleId];

  if (!insight) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#080c14] text-white">
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

      <div className="relative mx-auto max-w-3xl px-6 py-12">

        {/* Back link */}
        <Link
          href="/learning"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-white/35 transition-colors hover:text-white/70"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Modules
        </Link>

        {/* Hero header */}
        <div className="mb-10">
          <div className="mb-2 font-mono text-sm font-semibold text-[#00d2b4]">
            {insight.moduleId}
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">
            {insight.moduleName}
          </h1>
          <p className="text-sm text-white/35">
            AI Discovery Active&nbsp;·&nbsp;{insight.resourceCount} Resources Analyzed
          </p>
        </div>

        {/* ── Section 1: Core Mental Models ─────────────────────────── */}
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

        {/* ── Section 2: Worth Searching ────────────────────────────── */}
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

        {/* ── Section 3: Knowledge Gap Check ───────────────────────── */}
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

        {/* ── Section 4: Lecture Files ──────────────────────────────── */}
        <section>
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-white/30" />
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/30">
              Lecture Files
            </h2>
          </div>
          <Accordion type="multiple" className="rounded-xl border border-white/8 bg-white/[0.02] px-4">
            {insight.files.map((file) => (
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
