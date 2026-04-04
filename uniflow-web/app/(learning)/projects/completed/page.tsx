"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, ExternalLink, Github, ImageIcon } from "lucide-react";
import { FeatureTopbar } from "@/components/layout/FeatureTopbar";
import { mockProjectsById } from "@/lib/mockData";
import {
  getProjectProgressPercent,
  getProjectState,
  readCompletedProjectIds,
  setProjectScoreComponents,
  updateEvidenceChecklist,
} from "@/lib/projects/localState";
import { isValidGithubRepoUrl, isValidHttpOrHttpsUrl } from "@/lib/projects/verificationValidators";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { computeProjectScoreComponents } from "@/lib/projects/scoring";
import { syncProjectsPulseCredits } from "@/lib/projects/pulseContribution";
import { createClient } from "@/lib/supabase/client";

type CompletedProject = (typeof mockProjectsById)[string];
type FieldKey = "githubRepoUrl" | "screenshotLink" | "reflectionNotes";

function CompletedProjectVerificationCard({ project }: { project: CompletedProject }) {
  const [githubRepoUrl, setGithubRepoUrl] = useState("");
  const [screenshotLink, setScreenshotLink] = useState("");
  const [reflectionNotes, setReflectionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scorePreview, setScorePreview] = useState(0);
  const [errors, setErrors] = useState<Record<FieldKey, string>>({
    githubRepoUrl: "",
    screenshotLink: "",
    reflectionNotes: "",
  });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    githubRepoUrl: false,
    screenshotLink: false,
    reflectionNotes: false,
  });
  const [showcaseUrl, setShowcaseUrl] = useState<string | null>(null);
  const [showcaseError, setShowcaseError] = useState<string | null>(null);

  const validateGithubRepoUrl = (value: string): string => {
    if (!value.trim()) return "GitHub repository link is required.";
    if (!isValidGithubRepoUrl(value)) {
      return "Enter a valid GitHub repository URL (e.g. https://github.com/user/repo).";
    }
    return "";
  };

  const validateScreenshotLink = (value: string): string => {
    if (!value.trim()) return "Screenshot link is required.";
    if (!isValidHttpOrHttpsUrl(value)) {
      return "Enter a valid screenshot URL (http or https).";
    }
    return "";
  };

  const validateReflectionNotes = (value: string): string => {
    if (!value.trim()) return "Please add reflection notes before submitting.";
    return "";
  };

  const validateField = (field: FieldKey, value: string, showToast: boolean): string => {
    let nextError = "";
    if (field === "githubRepoUrl") nextError = validateGithubRepoUrl(value);
    if (field === "screenshotLink") nextError = validateScreenshotLink(value);
    if (field === "reflectionNotes") nextError = validateReflectionNotes(value);

    setErrors((prev) => ({ ...prev, [field]: nextError }));
    if (showToast && nextError) {
      toast.error(nextError, { id: `${project.id}-${field}-validation` });
    }
    return nextError;
  };

  const validateForm = (): boolean => {
    const githubError = validateGithubRepoUrl(githubRepoUrl);
    const screenshotError = validateScreenshotLink(screenshotLink);
    const reflectionError = validateReflectionNotes(reflectionNotes);

    const nextErrors: Record<FieldKey, string> = {
      githubRepoUrl: githubError,
      screenshotLink: screenshotError,
      reflectionNotes: reflectionError,
    };

    setTouched({
      githubRepoUrl: true,
      screenshotLink: true,
      reflectionNotes: true,
    });
    setErrors(nextErrors);

    const firstError = githubError || screenshotError || reflectionError;
    if (firstError) {
      toast.error(firstError);
      return false;
    }
    return true;
  };

  const handleFakeSubmit = async () => {
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);
    setShowcaseError(null);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const touched = updateEvidenceChecklist(project.id, {
      implementationProof: true,
      testingProof: true,
      reflectionNote: Boolean(reflectionNotes.trim()),
    });
    const state = getProjectState(project.id);
    const score = computeProjectScoreComponents({
      project,
      completed: state.completed,
      evidence: state.evidence,
      lastTouchedAt: touched.lastTouchedAt,
    });
    setProjectScoreComponents(project.id, score);
    setProgress(getProjectProgressPercent(project.id));
    setScorePreview(score.pulseContributionPreview);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await syncProjectsPulseCredits(supabase, user.id);

      const row = {
        github_url: githubRepoUrl.trim(),
        live_url: screenshotLink.trim(),
        screenshot_url: screenshotLink.trim(),
        reflection: reflectionNotes.trim(),
        challenges: "",
        learned: "",
      };

      const { data: existing } = await supabase
        .from("user_project_submission")
        .select("id")
        .eq("user_id", user.id)
        .eq("module_id", project.id)
        .maybeSingle();

      let dbErr: Error | null = null;
      if (existing?.id) {
        const { error } = await supabase
          .from("user_project_submission")
          .update(row)
          .eq("id", existing.id);
        if (error) dbErr = error;
      } else {
        const { error } = await supabase.from("user_project_submission").insert({
          user_id: user.id,
          module_id: project.id,
          ...row,
        });
        if (error) dbErr = error;
      }

      const { data: profileRow } = await supabase
        .from("user_data")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (dbErr) {
        const msg =
          /row-level security|violates row-level security/i.test(dbErr.message)
            ? "Could not save public showcase (database policy). Ask your admin to run docs/USER-PROJECT-SUBMISSION.sql."
            : dbErr.message.includes("foreign key") || dbErr.message.includes("fkey")
              ? "Could not link submission to your profile. Complete profile setup and try again."
              : dbErr.message;
        setShowcaseError(msg);
        toast.error("Saved locally; showcase sync failed.");
      } else if (profileRow?.username && typeof window !== "undefined") {
        const url = `${window.location.origin}/p/${profileRow.username}/projects/${project.id}`;
        setShowcaseUrl(url);
        toast.success("Verification saved. Copy your public showcase link below.");
      } else {
        toast.success("Verification captured. Evidence progress and score updated.");
      }
    } else {
      toast.success("Verification captured. Sign in to sync public showcase.");
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    const state = getProjectState(project.id);
    setProgress(getProjectProgressPercent(project.id));
    setScorePreview(
      state.scoreComponents?.pulseContributionPreview ??
        state.scoreComponents?.weightedScore ??
        0
    );
  }, [project.id]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
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
            value={githubRepoUrl}
            onChange={(event) => {
              const value = event.target.value;
              setGithubRepoUrl(value);
              if (touched.githubRepoUrl) {
                validateField("githubRepoUrl", value, false);
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, githubRepoUrl: true }));
              validateField("githubRepoUrl", githubRepoUrl, true);
            }}
            aria-invalid={Boolean(errors.githubRepoUrl)}
            placeholder="https://github.com/username/project-repo"
            className={`border-white/15 bg-[#0b111b] text-white placeholder:text-white/25 ${
              errors.githubRepoUrl ? "border-red-400/70 focus-visible:ring-red-400/40" : ""
            }`}
          />
          {errors.githubRepoUrl && touched.githubRepoUrl && (
            <p className="mt-1 text-xs text-red-300">{errors.githubRepoUrl}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/40">
            Screenshot Links
          </label>
          <Input
            value={screenshotLink}
            onChange={(event) => {
              const value = event.target.value;
              setScreenshotLink(value);
              if (touched.screenshotLink) {
                validateField("screenshotLink", value, false);
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, screenshotLink: true }));
              validateField("screenshotLink", screenshotLink, true);
            }}
            aria-invalid={Boolean(errors.screenshotLink)}
            placeholder="https://drive.google.com/... or image URL"
            className={`border-white/15 bg-[#0b111b] text-white placeholder:text-white/25 ${
              errors.screenshotLink ? "border-red-400/70 focus-visible:ring-red-400/40" : ""
            }`}
          />
          {errors.screenshotLink && touched.screenshotLink && (
            <p className="mt-1 text-xs text-red-300">{errors.screenshotLink}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-white/40">
            Reflection Notes
          </label>
          <textarea
            value={reflectionNotes}
            onChange={(event) => {
              const value = event.target.value;
              setReflectionNotes(value);
              if (touched.reflectionNotes) {
                validateField("reflectionNotes", value, false);
              }
            }}
            onBlur={() => {
              setTouched((prev) => ({ ...prev, reflectionNotes: true }));
              validateField("reflectionNotes", reflectionNotes, true);
            }}
            aria-invalid={Boolean(errors.reflectionNotes)}
            placeholder="What you built, key challenge, and what you learned."
            className={`min-h-[92px] w-full rounded-md border border-white/15 bg-[#0b111b] px-3 py-2 text-sm text-white placeholder:text-white/25 focus-visible:outline-none focus-visible:ring-2 ${
              errors.reflectionNotes
                ? "border-red-400/70 focus-visible:ring-red-400/40"
                : "focus-visible:ring-[#00d2b4]/40"
            }`}
          />
          {errors.reflectionNotes && touched.reflectionNotes && (
            <p className="mt-1 text-xs text-red-300">{errors.reflectionNotes}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          onClick={handleFakeSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-[#00d2b4] text-[#080c14] hover:bg-[#00d2b4]/85"
        >
          {isSubmitting ? "Submitting..." : "Submit Mock Verification"}
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
      <div className="mt-2 rounded-md border border-[#00d2b4]/20 bg-[#00d2b4]/10 px-3 py-2 text-xs text-[#7ae9d8]">
        Checklist progress: {progress}% · Pulse contribution: {scorePreview}/100
      </div>

      {showcaseError ? (
        <p className="mt-3 text-xs text-amber-300/90">{showcaseError}</p>
      ) : null}

      {showcaseUrl ? (
        <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
            Public showcase
          </p>
          <p className="mt-1 break-all text-xs text-[#7ae9d8]/90">{showcaseUrl}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="border-[#00d2b4]/35 text-[#7ae9d8] hover:bg-[#00d2b4]/10"
              onClick={() => {
                void navigator.clipboard.writeText(showcaseUrl);
                toast.success("Link copied");
              }}
            >
              <Copy className="mr-1 h-3.5 w-3.5" />
              Copy link
            </Button>
            <Button asChild size="sm" variant="outline" className="border-white/15 text-white/70">
              <a href={showcaseUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1 h-3.5 w-3.5" />
                Open
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

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
    <div className="brand-dark-shell min-h-screen bg-[#080c14] text-white">
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
            completed list and validates verification artifacts on the frontend in demo mode.
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
              <CompletedProjectVerificationCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
