import Link from "next/link";
import { LibraryBig, Clock, BookOpen, ArrowRight, Zap } from "lucide-react";
import { mockSyncedModules } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LearningHubPage() {
  const modules = mockSyncedModules;
  const isEmpty = modules.length === 0;

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
      <div className="pointer-events-none fixed left-[-200px] top-[-200px] h-[500px] w-[500px] rounded-full bg-[#00d2b4]/8 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-[-150px] right-[-150px] h-[400px] w-[400px] rounded-full bg-indigo-500/6 blur-[120px]" />

      <div className="relative mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#00d2b4]/25 bg-[#00d2b4]/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[#00d2b4]">
              <Zap className="h-3 w-3" />
              Learning Hub
            </div>
            <h1 className="font-[Syne,sans-serif] text-3xl font-bold tracking-tight text-white">
              Your Modules
            </h1>
            <p className="mt-1.5 text-sm text-white/40">
              {isEmpty
                ? "Sync your first module to unlock AI insights."
                : `${modules.length} module${modules.length > 1 ? "s" : ""} synced — select one to dive in.`}
            </p>
          </div>
          <Link href="/sync">
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 text-white/60 hover:border-[#00d2b4]/40 hover:bg-[#00d2b4]/10 hover:text-[#00d2b4]"
            >
              + Sync New Module
            </Button>
          </Link>
        </div>

        {/* Empty state */}
        {isEmpty && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-24 text-center">
            <LibraryBig className="mb-5 h-14 w-14 text-white/15" strokeWidth={1} />
            <h2 className="mb-2 text-lg font-semibold text-white/60">
              No modules synced yet
            </h2>
            <p className="mb-8 max-w-sm text-sm text-white/30">
              Upload your CourseWeb or Moodle ZIP files to generate your AI
              learning radar.
            </p>
            <Link href="/sync">
              <Button className="bg-[#00d2b4] text-[#080c14] hover:bg-[#00d2b4]/85 font-semibold">
                Go to Sync Dropzone
              </Button>
            </Link>
          </div>
        )}

        {/* Module cards grid */}
        {!isEmpty && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((mod) => (
              <Link
                key={mod.moduleId}
                href={`/learning/${mod.moduleId}`}
                className="group block"
              >
                <Card className="h-full cursor-pointer transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-[#00d2b4]/40 group-hover:bg-[#00d2b4]/5 group-hover:shadow-[0_0_24px_rgba(0,210,180,0.08)]">
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="rounded-md bg-[#00d2b4]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#00d2b4]">
                        {mod.moduleId}
                      </span>
                      <ArrowRight className="h-4 w-4 text-white/20 transition-colors group-hover:text-[#00d2b4]/60" />
                    </div>
                    <CardTitle className="text-base leading-snug">
                      {mod.moduleName}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pb-4">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-white/35">
                        <BookOpen className="h-3.5 w-3.5" />
                        <span>{mod.resourceCount} resources synced</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-white/25">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Last synced: {mod.lastSynced}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <span className="text-xs font-medium text-[#00d2b4]/60 transition-colors group-hover:text-[#00d2b4]">
                      View Insights →
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
