import Link from "next/link";

const specializationCards = [
  { slug: "software-engineering", name: "Software Engineering", icon: "💻" },
  { slug: "information-management", name: "Information Management", icon: "🗄️" },
  { slug: "data-science", name: "Data Science", icon: "📊" },
  { slug: "computer-science", name: "Computer Science", icon: "🧠" },
  { slug: "cs-networking", name: "CS & Networking", icon: "🌐" },
  { slug: "information-technology", name: "Information Technology", icon: "🛠️" },
  { slug: "systems-engineering", name: "Systems Engineering", icon: "⚙️" },
  { slug: "cyber-security", name: "Cyber Security", icon: "🛡️" },
];

export default function SpecializationsSelectionPage() {
  return (
    <main className="min-h-screen bg-[#F3F4F6] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="text-xl font-extrabold text-[#4F46E5]">FuturePath Hub</div>
            <span className="text-sm text-slate-500">Specializations</span>
          </div>
          <nav className="flex items-center gap-4 text-sm font-semibold text-slate-600">
            <Link href="/specializations" className="text-[#4F46E5]">Specializations</Link>
            <Link href="/mentors">Mentors</Link>
            <Link href="/roadmaps">Roadmaps</Link>
            <Link href="/community">Community</Link>
          </nav>
        </header>

        <section className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Choose a Specialization</h1>
          <p className="text-slate-500">Select one of the pathways below to explore relevant roles, mentorship, and career tracks.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {specializationCards.map((spec) => (
            <Link
              key={spec.slug}
              href={`/specializations/${spec.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
            >
              <div className="text-4xl mb-4">{spec.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#4F46E5]">{spec.name}</h3>
              <p className="mt-2 text-sm text-slate-500">Explore {spec.name} roles and mentor guidance.</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
