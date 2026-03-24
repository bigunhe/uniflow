import Link from "next/link";

const specializations = [
  { id: "se", slug: "software-engineering", label: "Software Engineering", subtitle: "Design and build scalable, robust software systems and applications.", color: "from-[#EEF2FF] to-[#F8F9FF]", icon: "💻" },
  { id: "im", slug: "information-management", label: "Information Management", subtitle: "Master the art of organizing and leveraging data for business intelligence.", color: "from-[#F4F0FF] to-[#FAF7FF]", icon: "🗄️" },
  { id: "ds", slug: "data-science", label: "Data Science", subtitle: "Extract meaningful insights from complex data sets using ML & AI.", color: "from-[#F6F4FF] to-[#FBF9FF]", icon: "📊" },
  { id: "cs", label: "Computer Science", subtitle: "Deep dive into computing theory, algorithms, and complex logic.", color: "from-[#F4F7FF] to-[#FAFBFF]", icon: "🧠" },
  { id: "csn", label: "CS & Networking", subtitle: "Architect and maintain the infrastructure that connects the world.", color: "from-[#FDF6FF] to-[#FEFBFF]", icon: "🌐" },
  { id: "it", label: "Info Technology", subtitle: "Support and implement technology solutions for enterprise success.", color: "from-[#FFF5F9] to-[#FFFBFE]", icon: "🛠️" },
  { id: "ise", label: "Systems Engineering", subtitle: "Integrate complex hardware and software systems seamlessly.", color: "from-[#F5F7FF] to-[#FBFCFF]", icon: "⚙️" },
  { id: "cyber", label: "Cyber Security", subtitle: "Protect critical assets and data from modern digital threats.", color: "from-[#F1F8FF] to-[#F8FBFF]", icon: "🛡️" },
];

export default function SpecializationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F9FAFF] via-[#F3F5FF] to-[#EEF2FF] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        <header className="mb-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#4747EB] text-white font-bold">U</div>
              <div className="text-xl font-extrabold text-slate-900">FuturePath Hub</div>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
              <Link href="/specialization" className="text-[#4F46E5]">Specializations</Link>
              <Link href="/mentors">Mentors</Link>
              <Link href="/roadmaps">Roadmaps</Link>
              <Link href="/community">Community</Link>
            </nav>
            <div className="flex items-center gap-3">
              <input type="text" placeholder="Search roles..." className="hidden md:block w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#4F46E5] focus:outline-none" />
              <button className="rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338ca]">Sign In</button>
              <div className="rounded-full border border-slate-300 p-2">👤</div>
            </div>
          </div>
        </header>

        <section className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            Shape Your Future: <span className="text-[#4747EB]">Choose a Specialization</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-slate-600">
            Selecting a specialization allows FuturePath Hub to tailor your learning resources, connect you with specialized mentors, and highlight the most relevant career opportunities in the tech industry.
          </p>
        </section>

        <div className="border-t border-slate-200 pt-6 mb-8">
          <div className="flex justify-center flex-wrap gap-3 text-xs md:text-sm font-semibold text-slate-500">
            <button className="px-3 py-2 rounded-sm bg-[#4747EB] text-white">SE</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">IM</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">DS</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">CS</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">CSNE</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">IT</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">ISE</button>
            <button className="px-3 py-2 rounded-sm bg-white text-slate-500 border border-slate-300">CYBER</button>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
          {specializations.map((item, index) => (
            <Link
              key={item.id}
              href={`/specializations/${item.slug}`}
              className={`rounded-3xl border border-slate-100 bg-white shadow-md hover:shadow-xl transition-all duration-200 p-6 ${index === 0 ? "ring-2 ring-[#4747EB]" : ""}`}
            >
              <div className="mb-3">
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-[#EEF2FF] text-[#4747EB] text-xl">{item.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{item.label}</h3>
              <p className="text-sm text-slate-600">{item.subtitle}</p>
            </Link>
          ))}
        </section>

        <section className="rounded-3xl border border-[#D8DBFF] bg-[#F4F6FF] p-6 md:p-8">
          <p className="text-slate-700 text-sm md:text-base">
            Picking the right specialization is the first step in mapping your unique journey. Our mentors are ready to guide you through these industry-standard paths to ensure you reach your career goals. Your curriculum and networking opportunities will adapt based on this choice.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="#" className="rounded-full bg-gradient-to-r from-[#4747EB] to-[#7B67D1] px-6 py-2 text-white font-semibold">Confirm Selection</Link>
            <Link href="#" className="rounded-full border border-slate-300 bg-white px-6 py-2 text-slate-700 font-semibold">Explore Paths First</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
