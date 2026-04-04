import Link from "next/link";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { getProjectShowcaseByUsernameAndProjectId } from "@/app/(auth)/actions";
import { mockProjectsById } from "@/lib/mockData";
import { ExternalLink, Github, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

function isImageUrl(url: string): boolean {
  const u = url.toLowerCase();
  return /^https?:\/\//.test(url) && /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(u);
}

export default async function PublicProjectShowcasePage({
  params,
}: {
  params: Promise<{ username: string; projectId: string }>;
}) {
  const { username, projectId } = await params;
  const studio = await getProjectShowcaseByUsernameAndProjectId(username, projectId);
  if (!studio?.submission) notFound();

  const project = mockProjectsById[projectId];
  if (!project) notFound();

  const { profile, submission } = studio;
  const gh = submission.github_url?.trim() ?? "";
  const shot = submission.screenshot_url?.trim() || submission.live_url?.trim() || "";
  const reflection = submission.reflection?.trim() ?? "";

  const initials = profile.display_name
    ? profile.display_name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : profile.username.slice(0, 2).toUpperCase();

  return (
    <div className={`${inter.className} brand-dark-shell min-h-screen bg-[#080c14] text-white`}>
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

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-white/45 transition hover:text-[#7ae9d8]"
          >
            UniFlow
          </Link>
          <span className="rounded-full border border-[#00d2b4]/25 bg-[#00d2b4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#7ae9d8]">
            Project showcase
          </span>
        </div>

        <header className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm">
          <div className="flex flex-wrap items-start gap-6">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt=""
                className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-[#00d2b4]/15 text-lg font-bold text-[#7ae9d8]">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
                {profile.display_name}
              </p>
              <p className="mt-1 text-sm text-white/50">@{profile.username}</p>
              {profile.job_role ? (
                <p className="mt-2 text-sm text-white/55">{profile.job_role}</p>
              ) : null}
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {project.title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{project.brief}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/60">
                  {project.year}
                </span>
                <span className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/60">
                  {project.challengeLevel}
                </span>
                <span className="rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/60">
                  {project.weekendEstimate}
                </span>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-8 rounded-2xl border border-[#00d2b4]/20 bg-[#00d2b4]/[0.06] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#7ae9d8]">
            Evidence
          </h2>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {gh ? (
              <a
                href={gh}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0c111a] px-4 py-3 text-sm font-medium text-[#7ae9d8] transition hover:border-[#00d2b4]/40"
              >
                <Github className="h-4 w-4 shrink-0" />
                View repository
                <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </a>
            ) : null}
            {shot && !isImageUrl(shot) ? (
              <a
                href={shot}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0c111a] px-4 py-3 text-sm font-medium text-white/70 transition hover:border-[#00d2b4]/40"
              >
                Screenshot / demo link
                <ExternalLink className="h-3.5 w-3.5 opacity-60" />
              </a>
            ) : null}
          </div>
          {shot && isImageUrl(shot) ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-black/20">
              <img src={shot} alt="Project screenshot" className="max-h-[420px] w-full object-contain" />
            </div>
          ) : null}
        </section>

        {reflection ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Reflection
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-white/65">
              {reflection}
            </p>
          </section>
        ) : null}

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Learning goals
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {project.learningGoals.map((g) => (
              <li key={g} className="flex gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#00d2b4]/70" />
                {g}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Suggested deliverables
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-white/60">
            {project.deliverables.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00d2b4]" />
                {d}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-2">
          {project.modules.map((m) => (
            <span
              key={m}
              className="rounded-full border border-[#00d2b4]/30 bg-[#00d2b4]/10 px-3 py-1 text-xs font-medium text-[#7ae9d8]"
            >
              {m}
            </span>
          ))}
          {project.stack.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/55"
            >
              {t}
            </span>
          ))}
        </div>

        <p className="mt-12 text-center text-xs text-white/30">
          Verified on UniFlow · Pulse {typeof profile.pulse_score === "number" ? profile.pulse_score : "—"}
        </p>
      </div>
    </div>
  );
}
