import Link from "next/link";
import { getAlumniNetworkProfileForSession } from "../network-actions";
import { User, Bell, MessageCircle, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { createRouteHandlerSupabase } from "@/lib/supabase/route-handler";

export default async function AlumniNetworkAlumniWorkspacePage() {
  const profile = await getAlumniNetworkProfileForSession("alumni");
  
  let displayName = profile?.full_name;
  if (!displayName) {
    try {
      const supabase = await createRouteHandlerSupabase();
      const { data: { user } } = await supabase.auth.getUser();
      displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0];
    } catch {
      // Ignore
    }
  }
  displayName = displayName || "Alumni";
  const editHref = profile?.id
    ? `/networking/alumni/register?role=alumni&profileId=${encodeURIComponent(profile.id)}`
    : "/networking/alumni/register?role=alumni";

  // Mock student requests
  const pendingRequests = [
    { id: 1, name: "Liam Johnson", program: "BSc Computer Science", focus: "Interview prep for SWE roles", date: "2 hours ago" },
    { id: 2, name: "Sophia Martinez", program: "BSc Information Technology", focus: "Resume review and career path advice", date: "1 day ago" },
  ];

  return (
    <div className="brand-dark-shell min-h-[calc(100vh-4rem)] bg-[#080c14] text-[#d4dde8]">
      <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <div className="mb-8">
          <Link
            href="/networking/alumni"
            className="text-sm font-medium text-[#00d2b4] hover:text-[#33ddc4] hover:underline transition"
          >
            ← Alumni network hub
          </Link>
        </div>

        <header className="mb-12">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#00d2b4]">
            Alumni Workspace
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Welcome, {displayName}
          </h1>
          <p className="mt-4 text-base text-[rgba(168,184,208,0.92)] max-w-2xl">
            Manage your profile, respond to incoming student requests, and continue your conversations. 
            Thank you for giving back to the UniFlow community.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-12">
          
          {/* Profile Summary - Left Column */}
          <div className="md:col-span-5 space-y-6">
            <section className="flex flex-col rounded-3xl border border-[rgba(0,210,180,0.28)] bg-[rgba(255,255,255,0.03)] p-6 sm:p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[rgba(0,210,180,0.1)] text-[#00d2b4] ring-1 ring-[rgba(0,210,180,0.3)]">
                  <User className="h-6 w-6" />
                </div>
                <Link
                  href={editHref}
                  className="rounded-full bg-white/5 px-4 py-1.5 text-xs font-semibold text-[#00d2b4] hover:bg-white/10 transition"
                >
                  Edit Profile
                </Link>
              </div>

              <h2 className="text-xl font-bold text-white mb-4">Profile Summary</h2>
              
              <div className="space-y-4 flex-1">
                {profile ? (
                  <>
                    <div>
                      <p className="text-xs text-[rgba(168,184,208,0.6)] uppercase tracking-wider font-semibold mb-1">Name</p>
                      <p className="text-sm font-medium text-[#f0f4fb]">{profile.full_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[rgba(168,184,208,0.6)] uppercase tracking-wider font-semibold mb-1">Current Role</p>
                      <p className="text-sm font-medium text-[#f0f4fb]">{profile.current_role} {profile.company ? `at ${profile.company}` : ""}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[rgba(168,184,208,0.6)] uppercase tracking-wider font-semibold mb-1">Degree</p>
                      <p className="text-sm font-medium text-[#f0f4fb]">{profile.programme} (Class of {profile.graduation_year})</p>
                    </div>
                  </>
                ) : (
                  <div className="rounded-xl border border-dashed border-white/20 p-6 text-center">
                    <p className="text-sm text-[rgba(168,184,208,0.8)] mb-3">Your profile is incomplete.</p>
                    <Link href={editHref} className="text-[#00d2b4] text-sm font-semibold hover:underline">Complete Profile Now</Link>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(99,102,241,0.1)] text-[#818cf8] ring-1 ring-[rgba(99,102,241,0.3)]">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-bold text-white">Active Chats</h2>
              </div>
              <p className="mb-6 text-sm text-[rgba(212,221,232,0.8)]">
                You have active conversations with students. 
              </p>
              <Link
                href="/messages"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/15 hover:bg-white/10 transition"
              >
                Open Messages <ArrowRight className="h-4 w-4" />
              </Link>
            </section>
          </div>

          {/* Incoming Requests - Right Column */}
          <div className="md:col-span-7">
            <section className="h-full rounded-3xl border border-white/10 bg-[rgba(255,255,255,0.02)] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[rgba(245,158,11,0.1)] text-[#f59e0b] ring-1 ring-[rgba(245,158,11,0.3)]">
                  <Bell className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-white">Incoming Requests</h2>
                <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#f59e0b] text-xs font-bold text-[#080c14]">
                  {pendingRequests.length}
                </span>
              </div>
              
              <div className="space-y-4">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="rounded-2xl border border-white/5 bg-[rgba(255,255,255,0.03)] p-5 transition hover:bg-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-[#f0f4fb]">{req.name}</h3>
                        <p className="text-xs text-[rgba(168,184,208,0.7)]">{req.program}</p>
                      </div>
                      <span className="text-[10px] font-medium text-[rgba(168,184,208,0.5)]">{req.date}</span>
                    </div>
                    <div className="mt-3 mb-4 rounded-xl bg-[#080c14]/50 p-3 text-sm text-[rgba(212,221,232,0.9)] border border-white/5">
                      <span className="font-semibold text-[rgba(168,184,208,0.6)] text-xs uppercase tracking-wider block mb-1">Focus Area</span>
                      {req.focus}
                    </div>
                    <div className="flex gap-3">
                      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[rgba(0,210,180,0.15)] px-4 py-2 text-sm font-semibold text-[#00d2b4] hover:bg-[rgba(0,210,180,0.25)] transition">
                        <CheckCircle2 className="h-4 w-4" /> Accept
                      </button>
                      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[rgba(244,63,94,0.1)] px-4 py-2 text-sm font-semibold text-[#fb7185] hover:bg-[rgba(244,63,94,0.2)] transition">
                        <XCircle className="h-4 w-4" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}

