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

export default function CommunityHubPage() {
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

      <main className="relative z-10 mx-auto max-w-5xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
        <header className="mb-12 max-w-3xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#00d2b4]">
            UniFlow
          </p>
          <h1
            className={`mb-4 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl ${inter.className}`}
          >
            Community
          </h1>
          <p className="text-base leading-relaxed text-[rgba(168,184,208,0.92)] sm:text-lg">
            Two kinds of support live here: learn from{" "}
            <strong className="font-semibold text-[#e8eef8]">alumni</strong> who have been where you
            are going, or pair with{" "}
            <strong className="font-semibold text-[#e8eef8]">peer student mentors</strong> who are
            deep in the same courses, projects, and deadlines as you. Pick the path that fits your goal.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          {/* Alumni / Ridmi */}
          <article
            className="flex flex-col rounded-2xl border border-[rgba(0,210,180,0.28)] bg-[rgba(255,255,255,0.04)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:p-8"
            aria-labelledby="community-alumni-heading"
          >
            <div className="mb-4 inline-flex w-fit rounded-full border border-[rgba(0,210,180,0.35)] bg-[rgba(0,210,180,0.08)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#00d2b4]">
              Alumni &amp; graduates
            </div>
            <h2
              id="community-alumni-heading"
              className={`mb-3 text-xl font-bold text-white sm:text-2xl ${inter.className}`}
            >
              Learn from alumni mentors
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-[rgba(168,184,208,0.9)]">
              Connect with people who have already finished your programme and entered industry. They
              bring real workplace context, interview and portfolio feedback, and longer-term career
              perspective.
            </p>
            <ul className="mb-6 flex-1 space-y-2.5 text-sm text-[rgba(212,221,232,0.92)]">
              <li className="flex gap-2">
                <span className="mt-0.5 text-[#00d2b4]" aria-hidden>
                  ●
                </span>
                <span>Career-focused guidance and how your degree maps to roles</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-[#00d2b4]" aria-hidden>
                  ●
                </span>
                <span>Industry stories, CV and interview prep from people who’ve hired</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-[#00d2b4]" aria-hidden>
                  ●
                </span>
                <span>Best when you want depth and a graduate lens on your next step</span>
              </li>
            </ul>
            <Link
              href="/networking/alumni"
              className={`inline-flex items-center justify-center rounded-xl bg-[rgba(0,210,180,0.18)] px-5 py-3 text-center text-sm font-semibold text-[#00d2b4] ring-1 ring-[rgba(0,210,180,0.4)] transition hover:bg-[rgba(0,210,180,0.26)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d2b4] ${inter.className}`}
            >
              Explore alumni network
            </Link>
          </article>

          {/* Peer / Shyni */}
          <article
            className="flex flex-col rounded-2xl border border-[rgba(99,102,241,0.32)] bg-[rgba(255,255,255,0.035)] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.25)] sm:p-8"
            aria-labelledby="community-peer-heading"
          >
            <div className="mb-4 inline-flex w-fit rounded-full border border-[rgba(99,102,241,0.35)] bg-[rgba(99,102,241,0.1)] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#a5b4fc]">
              Peer mentors
            </div>
            <h2
              id="community-peer-heading"
              className={`mb-3 text-xl font-bold text-white sm:text-2xl ${inter.className}`}
            >
              Learn with peer student mentors
            </h2>
            <p className="mb-5 text-sm leading-relaxed text-[rgba(168,184,208,0.9)]">
              Work with students who are actively taking modules, sitting exams, and shipping
              projects. They remember the exact module briefs, deadlines, and study tricks that help
              right now.
            </p>
            <ul className="mb-6 flex-1 space-y-2.5 text-sm text-[rgba(212,221,232,0.92)]">
              <li className="flex gap-2">
                <span className="mt-0.5 text-[#a5b4fc]" aria-hidden>
                  ●
                </span>
                <span>Module prep, labs, and coursework explained in student terms</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-[#a5b4fc]" aria-hidden>
                  ●
                </span>
                <span>Project feedback, study plans, and faster answers between classes</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 text-[#a5b4fc]" aria-hidden>
                  ●
                </span>
                <span>Best when you want someone walking the same timetable as you</span>
              </li>
            </ul>
            <Link
              href="/networking/mentors"
              className={`inline-flex items-center justify-center rounded-xl bg-[rgba(99,102,241,0.22)] px-5 py-3 text-center text-sm font-semibold text-[#c7d2fe] ring-1 ring-[rgba(99,102,241,0.45)] transition hover:bg-[rgba(99,102,241,0.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5b4fc] ${inter.className}`}
            >
              Connect with peer mentors
            </Link>
          </article>
        </div>
      </main>
    </div>
  );
}
