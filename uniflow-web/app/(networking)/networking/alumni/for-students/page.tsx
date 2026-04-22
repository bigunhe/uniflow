import Link from "next/link";

export default function AlumniNetworkStudentWorkspacePage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <Link
          href="/networking/alumni"
          className="text-sm font-medium text-[#00d2b4] hover:text-[#33ddc4] hover:underline"
        >
          ← Alumni network hub
        </Link>
      </div>

      <header className="mb-10">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#00d2b4]">
          Student workspace
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Alumni mentoring
        </h1>
        <p className="mt-3 text-base text-[rgba(168,184,208,0.92)]">
          Browse registered alumni, send requests, and open conversations. Stub layout—Ridmi will wire
          data and workflows.
        </p>
      </header>

      <div className="space-y-6">
        <section className="rounded-2xl border border-[rgba(0,210,180,0.28)] bg-[rgba(255,255,255,0.04)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">Browse alumni</h2>
          <p className="mt-2 text-sm text-[rgba(212,221,232,0.9)]">
            No listings yet. Next: query <code className="rounded bg-white/10 px-1 text-xs">alumni_network_profiles</code>{" "}
            where <code className="rounded bg-white/10 px-1 text-xs">role = &apos;alumni&apos;</code>.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">My requests</h2>
          <p className="mt-2 text-sm text-[rgba(212,221,232,0.9)]">
            Empty state. Next: request / accept model and link to alumni + student profiles.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">Active chats</h2>
          <p className="mt-2 text-sm text-[rgba(212,221,232,0.9)]">
            Use the main messaging area for now.
          </p>
          <Link
            href="/messages"
            className="mt-4 inline-flex rounded-xl bg-[rgba(0,210,180,0.2)] px-4 py-2.5 text-sm font-semibold text-[#00d2b4] ring-1 ring-[rgba(0,210,180,0.4)] hover:bg-[rgba(0,210,180,0.28)]"
          >
            Open messages
          </Link>
        </section>
      </div>
    </div>
  );
}
