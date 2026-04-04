import Link from "next/link";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { getPublicProjectSubmissionsForUsername } from "@/app/(auth)/actions";
import { mockProjectsById } from "@/lib/mockData";
import { ExternalLink, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default async function PublicPortfolioIndexPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await getPublicProjectSubmissionsForUsername(username);
  if (!data) notFound();

  const { profile, submissions } = data;

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

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-white/45 transition hover:text-[#7ae9d8]"
          >
            UniFlow
          </Link>
          <span className="rounded-full border border-[#00d2b4]/25 bg-[#00d2b4]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#7ae9d8]">
            Public portfolio
          </span>
        </div>

        <header className="mb-10 rounded-2xl border border-white/10 bg-white/[0.04] p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
            Project showcases
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            {profile.display_name}
          </h1>
          <p className="mt-1 text-sm text-white/50">@{profile.username}</p>
          {profile.job_role ? (
            <p className="mt-3 text-sm text-white/55">{profile.job_role}</p>
          ) : null}
        </header>

        {submissions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-10 text-center text-sm text-white/45">
            No verified project showcases yet.
          </p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {submissions.map((row) => {
              const project = mockProjectsById[row.module_id];
              const title = project?.title ?? row.module_id;
              const brief = project?.brief ?? "Studio project submission.";
              const href = `/p/${profile.username}/projects/${row.module_id}`;
              return (
                <li
                  key={row.id ?? `${row.module_id}-${row.github_url}`}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#00d2b4]/25"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs text-[#7ae9d8]/90">
                    <Sparkles className="h-3.5 w-3.5" />
                    {project?.year ?? "Project"}
                  </div>
                  <h2 className="text-lg font-semibold leading-snug text-white">{title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/55">{brief}</p>
                  <Link
                    href={href}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#7ae9d8] hover:underline"
                  >
                    Open showcase
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
