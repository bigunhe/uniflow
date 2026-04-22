import Link from "next/link";
import { getAlumniNetworkProfileForSession } from "../network-actions";

export default async function AlumniNetworkAlumniWorkspacePage() {
  const profile = await getAlumniNetworkProfileForSession("alumni");
  const editHref = profile?.id
    ? `/networking/alumni/register?role=alumni&profileId=${encodeURIComponent(profile.id)}`
    : "/networking/alumni/register?role=alumni";

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
          Alumni workspace
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Your mentoring hub
        </h1>
        <p className="mt-3 text-base text-[rgba(168,184,208,0.92)]">
          Profile summary, incoming student interest, and conversations. Stub layout—Ridmi will connect
          Supabase and messaging.
        </p>
      </header>

      <div className="space-y-6">
        <section className="rounded-2xl border border-[rgba(0,210,180,0.28)] bg-[rgba(255,255,255,0.04)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">Profile summary</h2>
          <p className="mt-2 text-sm text-[rgba(212,221,232,0.9)]">
            Placeholder. Next: load the signed-in user&apos;s row from{" "}
            <code className="rounded bg-white/10 px-1 text-xs">alumni_network_profiles</code> (or match by{" "}
            <code className="rounded bg-white/10 px-1 text-xs">user_id</code> once linked to auth).
          </p>
          <Link
            href={editHref}
            className="mt-4 inline-block text-sm font-medium text-[#00d2b4] hover:underline"
          >
            Update profile details →
          </Link>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">Incoming student interest</h2>
          <p className="mt-2 text-sm text-[rgba(212,221,232,0.9)]">
            Empty state. Next: requests table or status on a junction between students and alumni.
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-[rgba(255,255,255,0.03)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white">Conversations</h2>
          <p className="mt-2 text-sm text-[rgba(212,221,232,0.9)]">
            Continue threads in the shared messaging experience.
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
