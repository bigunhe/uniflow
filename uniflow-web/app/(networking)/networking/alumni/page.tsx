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
 * Alumni network entry: Community → Explore alumni network.
 * Layout supplies AppShellSidebar; this page is hub content only.
 */
export default function AlumniHubPage() {
  return (
    <div className={`mx-auto max-w-3xl ${dmSans.className}`}>
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
          Graduates and alumni mentors bring workplace context, role clarity, and longer-term career
          perspective. Register a profile for this network, then use your workspace to browse or
          respond to students.
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
            <strong className="font-semibold text-[#e8eef8]">Create your alumni network profile.</strong>{" "}
            Alumni (graduates) and students each have a short registration form—this is not your main
            site login; it stores details for this mentoring flow only.
          </li>
          <li>
            <strong className="font-semibold text-[#e8eef8]">Open your workspace.</strong> Students
            browse alumni and send requests (coming next). Alumni see interest and conversations.
          </li>
          <li>
            <strong className="font-semibold text-[#e8eef8]">Messages.</strong> Use the existing
            messaging area to continue threads when you are ready.
          </li>
        </ol>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap">
        <Link
          href="/networking/alumni/register?role=alumni"
          className={`inline-flex flex-1 items-center justify-center rounded-xl bg-[rgba(0,210,180,0.22)] px-5 py-3.5 text-center text-sm font-semibold text-[#080c14] transition hover:bg-[rgba(0,210,180,0.32)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d2b4] ${inter.className}`}
        >
          Register as alumni
        </Link>
        <Link
          href="/networking/alumni/register?role=student"
          className={`inline-flex flex-1 items-center justify-center rounded-xl bg-[rgba(0,210,180,0.14)] px-5 py-3.5 text-center text-sm font-semibold text-[#00d2b4] ring-1 ring-[rgba(0,210,180,0.4)] transition hover:bg-[rgba(0,210,180,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d2b4] ${inter.className}`}
        >
          Register as student
        </Link>
        <Link
          href="/networking/alumni/for-students"
          className={`inline-flex flex-1 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[rgba(255,255,255,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d2b4] ${inter.className}`}
        >
          Student workspace
        </Link>
        <Link
          href="/networking/alumni/for-alumni"
          className={`inline-flex flex-1 items-center justify-center rounded-xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[rgba(255,255,255,0.09)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00d2b4] ${inter.className}`}
        >
          Alumni workspace
        </Link>
      </div>

      <p className="mt-8 text-center text-sm text-[rgba(168,184,208,0.85)]">
        <Link
          href="/messages"
          className="font-medium text-[#00d2b4] underline-offset-2 hover:underline"
        >
          Open messages
        </Link>
        {" · "}
        <Link
          href="/networking/mentors"
          className="font-medium text-[rgba(168,184,208,0.92)] underline-offset-2 hover:text-white hover:underline"
        >
          Peer mentoring (separate)
        </Link>
      </p>
    </div>
  );
}
