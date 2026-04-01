import Link from "next/link";

export default function UniFlowPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F4F5FF] via-[#EDF0FF] to-[#EFF2FF] text-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="flex items-center justify-between gap-6 py-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#4747EB] text-white font-bold text-lg">U</div>
            <span className="text-2xl font-extrabold tracking-tight">UniFlow</span>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-600">
            <Link href="/uniflow" className="text-[#4747EB]">Explore</Link>
            <Link href="/modules" className="hover:text-[#4747EB]">Modules</Link>
            <Link href="/projects" className="hover:text-[#4747EB]">Projects</Link>
            <Link href="/networking" className="hover:text-[#4747EB]">Networking</Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-[#4747EB] text-white text-sm font-semibold hover:bg-[#5d5cf4] transition">Sign Out</button>
            <div className="w-9 h-9 rounded-full border border-slate-300 bg-white flex items-center justify-center text-slate-700">👤</div>
          </div>
        </header>

        <section className="mb-9 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900">UniFlow</h1>
          <p className="mt-3 text-xl text-slate-600">Connecting mentors and students for collaborative learning</p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2 mb-8">
          <article className="rounded-2xl border border-white bg-white/90 shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Authentication</h2>
            <p className="text-slate-500 mb-5">Secure access for the UniFlow academic ecosystem. Choose your role to proceed to your personalized dashboard.</p>
            <div className="grid gap-3">
              <Link href="/student/login" className="rounded-xl bg-[#4747EB] text-white text-center py-3 font-semibold">Student Login</Link>
              <Link href="/student/register" className="rounded-xl bg-[#DFE1FF] text-[#4747EB] text-center py-3 font-semibold">Student Sign Up</Link>
              <Link href="/mentor/login" className="rounded-xl bg-[#7B67D1] text-white text-center py-3 font-semibold">Mentor Login</Link>
              <Link href="/mentor/register" className="rounded-xl bg-[#F3ECFF] text-[#7B67D1] text-center py-3 font-semibold">Mentor Sign Up</Link>
            </div>
          </article>

          <article className="rounded-2xl border border-white bg-white/90 shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Explore</h2>
            <p className="text-slate-500 mb-5">Browse other sections to continue your pathway.</p>
            <div className="grid gap-3">
              <Link href="/profile-setup" className="rounded-xl bg-[#F3ECFF] text-[#7B67D1] text-center py-3 font-semibold">Profile Setup</Link>
              <Link href="/networking" className="rounded-xl bg-[#F3ECFF] text-[#7B67D1] text-center py-3 font-semibold">Networking</Link>
              <Link href="/modules" className="rounded-xl bg-[#DDE5FF] text-[#4747EB] text-center py-3 font-semibold">Learning Modules</Link>
              <Link href="/projects" className="rounded-xl bg-[#DDE5FF] text-[#4747EB] text-center py-3 font-semibold">Projects</Link>
            </div>
          </article>
        </section>

        <section className="rounded-2xl border border-white bg-white/90 shadow-lg p-6">
          <h3 className="text-lg font-bold text-[#4747EB] mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <Link href="#" className="rounded-xl bg-white border border-slate-200 py-3 text-center font-medium text-slate-700 shadow-sm">Upcoming Events</Link>
            <Link href="#" className="rounded-xl bg-white border border-slate-200 py-3 text-center font-medium text-slate-700 shadow-sm">Community Forum</Link>
            <Link href="#" className="rounded-xl bg-white border border-slate-200 py-3 text-center font-medium text-slate-700 shadow-sm">Resource Library</Link>
            <Link href="#" className="rounded-xl bg-white border border-slate-200 py-3 text-center font-medium text-slate-700 shadow-sm">Support Center</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
