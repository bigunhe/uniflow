import Link from "next/link";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import { getProfileByUsername } from "@/app/(auth)/actions";

export const dynamic = "force-dynamic";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

type PulseProfile = {
  username: string;
  display_name: string;
  email?: string | null;
  avatar_url?: string | null;
  job_role?: string | null;
};

export default async function PulsePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = (await getProfileByUsername(username)) as PulseProfile | null;

  const initials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "UF";

  if (!profile) {
    return (
      <main className={`${bodyFont.className} relative min-h-screen overflow-hidden`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,#fef3c7_0%,transparent_38%),radial-gradient(circle_at_85%_100%,#bfdbfe_0%,transparent_40%),linear-gradient(135deg,#fff7ed_0%,#f8fafc_45%,#eef2ff_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center p-6">
          <section className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/80 p-8 backdrop-blur-sm sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Pulse Profile
            </p>
            <h1
              className={`${displayFont.className} mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl`}
            >
              Profile not found
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              We could not find a profile for @{username}. Ask the user to complete
              profile setup, then open this page again.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Go to Home
              </Link>
              <Link
                href="/networking"
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
              >
                Open Networking
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={`${bodyFont.className} relative min-h-screen overflow-hidden`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,#fde68a_0%,transparent_36%),radial-gradient(circle_at_90%_88%,#c4b5fd_0%,transparent_42%),linear-gradient(130deg,#fff7ed_0%,#f8fafc_45%,#eef2ff_100%)]" />

      <div className="pointer-events-none absolute -left-20 top-24 h-56 w-56 animate-pulse rounded-full bg-amber-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-12 top-60 h-64 w-64 animate-pulse rounded-full bg-sky-300/30 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-5xl p-6 sm:p-10">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/"
            className="rounded-full border border-slate-300/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm transition hover:border-slate-400 hover:text-slate-900"
          >
            Back to Home
          </Link>
          <Link
            href="/networking"
            className="rounded-full border border-slate-300/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 backdrop-blur-sm transition hover:border-slate-400 hover:text-slate-900"
          >
            Explore Networking
          </Link>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_12px_50px_-18px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:p-8">
          <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-start">
            <div className="flex items-center justify-center">
              {profile.avatar_url ? (
                // Use the plain img tag here since avatar URLs can be remote and dynamic.
                <img
                  src={profile.avatar_url}
                  alt={`${profile.display_name} avatar`}
                  className="h-28 w-28 rounded-3xl border border-slate-200 object-cover shadow-sm"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-200 via-rose-200 to-sky-200 text-3xl font-bold text-slate-800 shadow-sm">
                  {initials}
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                UniFlow Pulse
              </p>
              <h1
                className={`${displayFont.className} mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl`}
              >
                {profile.display_name}
              </h1>
              <p className="mt-1 text-base font-medium text-slate-600">@{profile.username}</p>

              {profile.job_role && (
                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-700 sm:text-base">
                  {profile.job_role}
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                  Student Portfolio
                </span>
                <span className="rounded-full border border-sky-300 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                  Public Pulse
                </span>
                {profile.email && (
                  <span className="rounded-full border border-indigo-300 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {profile.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white/75 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Visibility
            </p>
            <p className={`${displayFont.className} mt-2 text-2xl font-bold text-slate-900`}>
              Live
            </p>
            <p className="mt-2 text-sm text-slate-600">
              This profile is publicly visible in Pulse details.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white/75 p-5 backdrop-blur-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Username
            </p>
            <p className={`${displayFont.className} mt-2 text-2xl font-bold text-slate-900`}>
              @{profile.username}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Use this handle to share and discover peer profiles.
            </p>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white/75 p-5 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Next Action
            </p>
            <p className={`${displayFont.className} mt-2 text-2xl font-bold text-slate-900`}>
              Build Network
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Connect with mentors and alumni to strengthen your path.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
