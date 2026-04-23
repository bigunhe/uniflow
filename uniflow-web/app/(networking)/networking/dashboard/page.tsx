import Link from "next/link";
import { LayoutDashboard, Compass, Users, Briefcase } from "lucide-react";

export default function StudentDashboardPage() {
  return (
    <div className="brand-dark-shell min-h-[calc(100vh-4rem)] bg-[#080c14] text-[#d4dde8]">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <header className="mb-12">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#00d2b4]">
            Student Workspace
          </p>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Networking Dashboard
          </h1>
          <p className="mt-4 text-base text-[rgba(168,184,208,0.9)] max-w-2xl">
            Welcome to your networking hub. Explore career paths, find mentors based on your specialization, and connect with industry professionals to accelerate your growth.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Card 1: Specializations (Primary) */}
          <Link href="/networking/specializations" className="group">
            <div className="flex h-full flex-col rounded-3xl border border-[rgba(99,102,241,0.2)] bg-[rgba(99,102,241,0.03)] p-8 shadow-sm transition hover:-translate-y-1 hover:bg-[rgba(99,102,241,0.06)] hover:shadow-lg hover:ring-1 hover:ring-[rgba(99,102,241,0.4)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366f1] text-white shadow-md">
                <Compass className="h-7 w-7" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white">Specializations</h2>
              <p className="flex-1 text-sm text-[rgba(168,184,208,0.85)] leading-relaxed">
                Explore different computing and IT disciplines to find your ideal career path and relevant mentors.
              </p>
              <div className="mt-6 flex items-center font-semibold text-[#818cf8] group-hover:text-[#a5b4fc]">
                Explore Specializations <span className="ml-2">&rarr;</span>
              </div>
            </div>
          </Link>

          {/* Card 2: Find Mentor */}
          <Link href="/networking/specializations" className="group">
            <div className="flex h-full flex-col rounded-3xl border border-[rgba(34,197,94,0.15)] bg-[rgba(255,255,255,0.02)] p-8 shadow-sm transition hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.05)] hover:shadow-lg hover:ring-1 hover:ring-[rgba(34,197,94,0.3)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(34,197,94,0.1)] text-[#22c55e] shadow-sm ring-1 ring-[rgba(34,197,94,0.2)] group-hover:bg-[rgba(34,197,94,0.2)]">
                <Users className="h-7 w-7" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white">Find Mentor</h2>
              <p className="flex-1 text-sm text-[rgba(168,184,208,0.85)] leading-relaxed">
                Connect with industry alumni and peer mentors to get advice, resume reviews, and career guidance.
              </p>
              <div className="mt-6 flex items-center font-semibold text-[#22c55e] group-hover:text-[#4ade80]">
                Search Mentors <span className="ml-2">&rarr;</span>
              </div>
            </div>
          </Link>

          {/* Card 3: Job Roles */}
          <Link href="/networking/specializations" className="group">
            <div className="flex h-full flex-col rounded-3xl border border-[rgba(245,158,11,0.15)] bg-[rgba(255,255,255,0.02)] p-8 shadow-sm transition hover:-translate-y-1 hover:bg-[rgba(255,255,255,0.05)] hover:shadow-lg hover:ring-1 hover:ring-[rgba(245,158,11,0.3)]">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(245,158,11,0.1)] text-[#f59e0b] shadow-sm ring-1 ring-[rgba(245,158,11,0.2)] group-hover:bg-[rgba(245,158,11,0.2)]">
                <Briefcase className="h-7 w-7" />
              </div>
              <h2 className="mb-3 text-2xl font-bold text-white">Job Roles</h2>
              <p className="flex-1 text-sm text-[rgba(168,184,208,0.85)] leading-relaxed">
                Discover various job roles within your chosen specialization and learn what it takes to land them.
              </p>
              <div className="mt-6 flex items-center font-semibold text-[#f59e0b] group-hover:text-[#fbbf24]">
                View Roles <span className="ml-2">&rarr;</span>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
