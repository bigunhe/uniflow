import Link from "next/link";
import { DM_Sans, Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

/**
 * Alumni entry: hub after Community → Explore alumni network; primary handoff to `/messages`.
 */
export default function AlumniHubPage() {
  return (
    <div
      className={`brand-dark-shell relative min-h-screen overflow-hidden bg-[#080c14] text-[#d4dde8] ${dmSans.className}`}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(0,210,180,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,210,180,0.03)_1px,transparent_1px)] bg-[length:48px_48px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -left-32 -top-48 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(0,210,180,0.1)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -bottom-40 -right-24 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] blur-3xl"
        aria-hidden
      />

      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <div className="mb-10">
          <Link
            href="/networking"
            className="text-sm font-medium text-[#00d2b4] hover:text-[#33ddc4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d2b4]"
          >
            ← Community
          </Link>
        </div>

        <header className="mb-10">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#00d2b4]">
            Alumni mentors
          </p>
          <h1
            className={`mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl ${inter.className}`}
          >
            Plan your path with people who have already done it
          </h1>
          <p className="text-base leading-relaxed text-[rgba(168,184,208,0.92)] sm:text-lg">
            Graduates and alumni mentors bring workplace context, role clarity, and longer-term
            career             perspective. Message threads for this path live in the alumni messaging workspace—open
            it below when you are ready to continue a conversation.
          </p>
        </header>

        <section
          className="mb-10 rounded-2xl border border-[rgba(0,210,180,0.28)] bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:p-8"
          aria-labelledby="alumni-path-heading"
        >
          <h2
            id="alumni-path-heading"
            className={`mb-4 text-lg font-bold text-white sm:text-xl ${inter.className}`}
          >
            Your path in UniFlow
          </h2>
          <ol className="list-decimal space-y-4 pl-5 text-sm leading-relaxed text-[rgba(212,221,232,0.92)] sm:text-[15px]">
            <li>
              <strong className="font-semibold text-[#e8eef8]">Stay aligned with your courses.</strong>{" "}
              Use Learning to keep modules and deadlines in view before you ask mentors for targeted
              help.
            </li>
            <li>
              <strong className="font-semibold text-[#e8eef8]">Connect with alumni mentors.</strong>{" "}
              Open Messages to pick a mentor thread, send updates, and share files when Supabase is
              configured (otherwise you still see the demo conversation).
            </li>
            <li>
              <strong className="font-semibold text-[#e8eef8]">Need peer help instead?</strong>{" "}
              Use the separate peer mentoring area—different from this alumni messaging flow.
            </li>
          </ol>
        </section>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/messages"
            className={`inline-flex flex-1 items-center justify-center rounded-xl bg-[rgba(0,210,180,0.22)] px-5 py-3.5 text-center text-sm font-semibold text-[#080c14] transition hover:bg-[rgba(0,210,180,0.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d2b4] ${inter.className}`}
          >
            Open alumni messages
          </Link>
          <Link
            href="/learning/modules"
            className={`inline-flex flex-1 items-center justify-center rounded-xl bg-[rgba(0,210,180,0.14)] px-5 py-3.5 text-center text-sm font-semibold text-[#00d2b4] ring-1 ring-[rgba(0,210,180,0.4)] transition hover:bg-[rgba(0,210,180,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d2b4] ${inter.className}`}
          >
            Open learning & modules
          </Link>
          <Link
            href="/networking/mentors"
            className={`inline-flex flex-1 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[rgba(255,255,255,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d2b4] ${inter.className}`}
          >
            Peer mentoring (separate)
          </Link>
        </div>
      </main>
    </div>
  );
}
