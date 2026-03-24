import Link from "next/link";

const specializationData = {
  "software-engineering": {
    title: "Software Engineering Roles",
    subtitle:
      "Discover your perfect fit in the world of code. From building user interfaces to managing complex cloud infrastructure, explore the paths below.",
    roles: [
      { title: "Frontend Developer", level: "Entry Level", description: "Build user-facing websites and web applications." },
      { title: "Backend Developer", level: "Intermediate", description: "Develop APIs, server logic, and database systems." },
      { title: "QA Engineer", level: "Entry Level", description: "Ensure software quality with automated and manual tests." },
      { title: "DevOps Engineer", level: "Senior", description: "Optimize deployment pipelines and cloud infrastructure." },
      { title: "Full Stack Developer", level: "Intermediate", description: "Work across frontend and backend in end-to-end features." },
      { title: "Mobile Developer", level: "Entry Level", description: "Create native and cross-platform mobile applications." },
      { title: "Security Engineer", level: "Senior", description: "Protect software systems from vulnerabilities and threats." },
      { title: "SRE (Site Reliability Engineer)", level: "Senior", description: "Ensure reliability and performance of production services." },
    ],
  },
  "information-management": {
    title: "Information Management Roles",
    subtitle:
      "Master the flow of data across organizations. Explore roles that keep businesses informed, compliant, and efficient.",
    roles: [
      { title: "Data Administrator", level: "Entry Level", description: "Maintain and organize data assets for dependable access." },
      { title: "Database Manager", level: "Intermediate", description: "Design and optimize database systems for applications." },
      { title: "Information Architect", level: "Senior", description: "Structure information and taxonomies for enterprise systems." },
      { title: "Knowledge Manager", level: "Intermediate", description: "Enable teams to find and share organizational knowledge." },
      { title: "Records Manager", level: "Entry Level", description: "Control retention and access of corporate records." },
      { title: "BI Analyst", level: "Intermediate", description: "Translate data into insights for business decisions." },
      { title: "Content Strategist", level: "Entry Level", description: "Plan content workflows and metadata for digital teams." },
      { title: "Chief Information Officer (CIO)", level: "Senior", description: "Lead information strategy across organization." },
    ],
  },
  "data-science": {
    title: "Data Science Roles",
    subtitle:
      "Extract powerful insights from complex datasets. Explore roles that blend statistics, programming, and business strategy.",
    roles: [
      { title: "Data Analyst", level: "Entry Level", description: "Analyze data and build reports for stakeholders." },
      { title: "Data Scientist", level: "Intermediate", description: "Create models to solve business problems with data." },
      { title: "ML Engineer", level: "Intermediate", description: "Deploy and scale machine learning systems." },
      { title: "AI Research Scientist", level: "Senior", description: "Invent new AI methods and publish research." },
      { title: "Data Engineer", level: "Intermediate", description: "Build data pipelines and infrastructure at scale." },
      { title: "NLP Engineer", level: "Senior", description: "Develop natural language processing solutions." },
      { title: "Computer Vision Engineer", level: "Senior", description: "Apply vision models to real-world applications." },
      { title: "Analytics Manager", level: "Senior", description: "Lead analytics teams to deliver data strategy." },
    ],
  },
  "computer-science": {
    title: "Computer Science Roles",
    subtitle:
      "Dive deep into computing theory, algorithms, and logic. Explore roles at the foundation of modern technology.",
    roles: [
      { title: "Software Developer", level: "Entry Level", description: "Build software with strong algorithmic foundations." },
      { title: "Algorithm Engineer", level: "Senior", description: "Design high-performance algorithms for products." },
      { title: "Systems Programmer", level: "Intermediate", description: "Work on operating systems and core infrastructure." },
      { title: "Compiler Engineer", level: "Senior", description: "Optimize language compilers and toolchains." },
      { title: "Research Scientist", level: "Senior", description: "Advance computing science with new discoveries." },
      { title: "Graphics Engineer", level: "Intermediate", description: "Develop 3D rendering and visualization systems." },
      { title: "Embedded Systems Developer", level: "Intermediate", description: "Build software for hardware-constrained devices." },
      { title: "Game Developer", level: "Entry Level", description: "Create engaging gameplay experiences and mechanics." },
    ],
  },
  "cs-networking": {
    title: "CS & Networking Roles",
    subtitle:
      "Architect and maintain the infrastructure that connects the world. Explore roles in networks, systems, and cloud.",
    roles: [
      { title: "Network Engineer", level: "Entry Level", description: "Design and troubleshoot network infrastructure." },
      { title: "Network Administrator", level: "Entry Level", description: "Maintain network uptime and user access controls." },
      { title: "Cloud Architect", level: "Senior", description: "Design cloud infrastructure and governance." },
      { title: "Systems Administrator", level: "Intermediate", description: "Manage servers, systems, and virtual infrastructure." },
      { title: "Network Security Engineer", level: "Senior", description: "Secure networks against attacks and vulnerabilities." },
      { title: "VoIP Engineer", level: "Intermediate", description: "Deploy reliable voice-over-IP communication networks." },
      { title: "Wireless Network Engineer", level: "Intermediate", description: "Optimize wireless connectivity across environments." },
      { title: "IT Infrastructure Manager", level: "Senior", description: "Lead teams supporting core IT operations." },
    ],
  },
  "information-technology": {
    title: "Information Technology Roles",
    subtitle:
      "Support and implement technology solutions for enterprise success. Explore IT roles that keep organizations running.",
    roles: [
      { title: "IT Support Specialist", level: "Entry Level", description: "Help users solve everyday technical issues." },
      { title: "IT Project Manager", level: "Intermediate", description: "Coordinate IT projects and delivery timelines." },
      { title: "Systems Analyst", level: "Intermediate", description: "Translate business needs into technical specs." },
      { title: "Help Desk Technician", level: "Entry Level", description: "Resolve incoming user tickets quickly." },
      { title: "IT Consultant", level: "Senior", description: "Advise organizations on technology strategy." },
      { title: "ERP Specialist", level: "Intermediate", description: "Implement enterprise resource planning systems." },
      { title: "IT Director", level: "Senior", description: "Lead IT strategy and organizational technology." },
      { title: "Technical Support Engineer", level: "Entry Level", description: "Provide technical support for products and tools." },
    ],
  },
  "systems-engineering": {
    title: "Systems Engineering Roles",
    subtitle:
      "Integrate complex hardware and software systems seamlessly. Explore roles that bridge engineering disciplines.",
    roles: [
      { title: "Systems Engineer", level: "Intermediate", description: "Coordinate cross-functional engineering systems." },
      { title: "Integration Engineer", level: "Intermediate", description: "Ensure system components work together well." },
      { title: "Hardware Engineer", level: "Entry Level", description: "Design and validate electronic hardware." },
      { title: "Embedded Systems Engineer", level: "Intermediate", description: "Embed software in specialized devices." },
      { title: "Reliability Engineer", level: "Senior", description: "Improve system uptime and performance stability." },
      { title: "Controls Engineer", level: "Senior", description: "Design control systems for automation and robotics." },
      { title: "Systems Architect", level: "Senior", description: "Define large-scale systems architecture and standards." },
      { title: "Test & Evaluation Engineer", level: "Entry Level", description: "Validate system performance against requirements." },
    ],
  },
  "cyber-security": {
    title: "Cyber Security Roles",
    subtitle:
      "Protect critical assets and data from modern digital threats. Explore roles in defense, analysis, and security operations.",
    roles: [
      { title: "Security Analyst", level: "Entry Level", description: "Monitor threats and respond to suspicious activity." },
      { title: "Penetration Tester", level: "Intermediate", description: "Simulate attacks to identify security holes." },
      { title: "SOC Analyst", level: "Entry Level", description: "Work in security operations center for incident handling." },
      { title: "Incident Responder", level: "Intermediate", description: "Manage and resolve security incidents effectively." },
      { title: "Security Architect", level: "Senior", description: "Design secure infrastructure and policies." },
      { title: "Threat Intelligence Analyst", level: "Senior", description: "Analyze threat trends and adversary tactics." },
      { title: "Compliance Officer", level: "Intermediate", description: "Ensure cyber policies meet regulatory standards." },
      { title: "CISO", level: "Senior", description: "Lead company-wide security strategy and governance." },
    ],
  },
};

const topNavItems = [
  { href: "/specializations", label: "Specializations" },
  { href: "/mentors", label: "Mentors" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/community", label: "Community" },
];

const roleIcon = "🧩";

type SpecializationSlug = keyof typeof specializationData;

export default function SpecializationRolePage({ params }: { params: { slug: string } }) {
  const slug = params.slug as SpecializationSlug;
  const specialization = specializationData[slug];

  if (!specialization) {
    return (
      <main className="min-h-screen bg-[#F3F4F6] p-6">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow">
          <h2 className="text-2xl font-bold">Specialization not found</h2>
          <p className="mt-2 text-slate-600">Please choose an available specialization from the list.</p>
          <Link href="/specializations" className="mt-4 inline-block text-[#4F46E5] font-semibold">
            Back to Specializations
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F6] text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black text-[#4F46E5]">FuturePath Hub</div>
            <nav className="flex gap-4 text-sm text-slate-600 font-semibold">
              {topNavItems.map((item) => (
                <Link key={item.href} href={item.href} className={item.href === "/specializations" ? "text-[#4F46E5]" : "hover:text-[#4F46E5]"}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Search roles..." className="w-52 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#4F46E5] focus:outline-none" />
            <button className="rounded-lg bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338ca]">Sign In</button>
            <div className="rounded-full border border-slate-300 px-3 py-2 text-sm">👤</div>
          </div>
        </header>

        <div className="mb-4 text-sm text-slate-500">
          <span className="font-semibold text-slate-600">Specializations</span> &gt; {specialization.title.replace(" Roles", "")}
        </div>

        <section className="mb-6">
          <h1 className="text-4xl font-bold text-slate-900">{specialization.title}</h1>
          <p className="mt-2 text-slate-600 max-w-3xl">{specialization.subtitle}</p>
        </section>

        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white">Filters</button>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Sort:</span>
            <select className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700" defaultValue="popular">
              <option value="popular">Popular</option>
              <option value="entry">Entry Level</option>
              <option value="intermediate">Intermediate</option>
              <option value="senior">Senior</option>
            </select>
          </div>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          {specialization.roles.map((role) => (
            <article key={role.title} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200 hover:shadow-md transition">
              <div className="mb-3 text-3xl">{roleIcon}</div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{role.title}</h2>
              <p className="text-sm text-slate-500 mb-4">{role.description}</p>
              <div className="mb-4">
                <span className="rounded-full bg-[#E0E7FF] px-2.5 py-1 text-xs font-semibold text-[#3730A3]">{role.level}</span>
              </div>
              <Link href="#" className="text-sm font-semibold text-[#4F46E5] hover:text-[#4338ca]">
                View Mentors →
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-2xl bg-white p-6 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 mb-3">Didn't find what you were looking for?</h3>
          <p className="text-slate-600 mb-4">Request a new role or explore other specializations to find the perfect path for your goals.</p>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-full bg-[#4F46E5] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4338ca]">Request New Role</button>
            <Link href="/specializations" className="rounded-full px-5 py-2 text-sm font-semibold text-[#4F46E5] hover:text-[#4338ca]">Explore Other Specializations</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
