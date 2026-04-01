import type { JobRoleIconKey } from "@/lib/jobRoleIconKeys";

export type SpecializationKey =
  | "SE"
  | "IM"
  | "DS"
  | "CS"
  | "CSNE"
  | "IT"
  | "ISE"
  | "CYBER";

export type RoleLevel = "Entry Level" | "Intermediate" | "Senior";

export type JobRoleDef = {
  title: string;
  level: RoleLevel;
  description: string;
  iconKey: JobRoleIconKey;
  iconBg: string;
  iconFg: string;
};

export type SpecializationRolesPageDef = {
  key: SpecializationKey;
  slug: string;
  breadcrumbLabel: string;
  pageTitle: string;
  subtitle: string;
  roles: JobRoleDef[];
};

export const SPECIALIZATION_ROLE_PAGES: SpecializationRolesPageDef[] = [
  {
    key: "SE",
    slug: "software-engineering",
    breadcrumbLabel: "Software Engineering",
    pageTitle: "Software Engineering Roles",
    subtitle:
      "Discover your perfect fit in the world of code. From building user interfaces to managing complex cloud infrastructure, explore the paths below.",
    roles: [
      {
        title: "Frontend Developer",
        level: "Entry Level",
        description:
          "Builds the visual elements users interact with across web and mobile experiences.",
        iconKey: "layoutDashboard",
        iconBg: "bg-indigo-100",
        iconFg: "text-indigo-700",
      },
      {
        title: "Backend Developer",
        level: "Intermediate",
        description:
          "Focuses on server-side logic, databases, and APIs that power applications.",
        iconKey: "server",
        iconBg: "bg-sky-100",
        iconFg: "text-sky-700",
      },
      {
        title: "QA Engineer",
        level: "Entry Level",
        description:
          "Ensures software quality through automated and manual testing before release.",
        iconKey: "testTube2",
        iconBg: "bg-emerald-100",
        iconFg: "text-emerald-700",
      },
      {
        title: "DevOps Engineer",
        level: "Senior",
        description:
          "Bridges development and operations with CI/CD, automation, and cloud tooling.",
        iconKey: "gitBranch",
        iconBg: "bg-orange-100",
        iconFg: "text-orange-800",
      },
      {
        title: "Full Stack Developer",
        level: "Intermediate",
        description:
          "Works across front-end and back-end systems to deliver end-to-end features.",
        iconKey: "code2",
        iconBg: "bg-violet-100",
        iconFg: "text-violet-800",
      },
      {
        title: "Mobile Developer",
        level: "Entry Level",
        description:
          "Builds native or cross-platform apps for phones and tablets.",
        iconKey: "smartphone",
        iconBg: "bg-pink-100",
        iconFg: "text-pink-800",
      },
      {
        title: "Security Engineer",
        level: "Senior",
        description:
          "Implements controls and reviews systems to protect against modern threats.",
        iconKey: "shieldCheck",
        iconBg: "bg-teal-100",
        iconFg: "text-teal-800",
      },
      {
        title: "SRE (Site Reliability Engineer)",
        level: "Senior",
        description:
          "Applies software engineering to reliability, uptime, and production operations.",
        iconKey: "activity",
        iconBg: "bg-amber-100",
        iconFg: "text-amber-900",
      },
    ],
  },
  {
    key: "IM",
    slug: "information-management",
    breadcrumbLabel: "Information Management",
    pageTitle: "Information Management Roles",
    subtitle:
      "Master the flow of data across organizations. Explore roles that keep businesses informed, compliant, and efficient.",
    roles: [
      {
        title: "Data Administrator",
        level: "Entry Level",
        description:
          "Maintains databases and ensures data availability, backups, and integrity.",
        iconKey: "database",
        iconBg: "bg-indigo-100",
        iconFg: "text-indigo-700",
      },
      {
        title: "Database Manager",
        level: "Intermediate",
        description:
          "Owns database strategy, performance tuning, and access policies.",
        iconKey: "serverCog",
        iconBg: "bg-slate-100",
        iconFg: "text-slate-800",
      },
      {
        title: "Information Architect",
        level: "Senior",
        description:
          "Designs structures and taxonomies so information is findable and scalable.",
        iconKey: "spline",
        iconBg: "bg-violet-100",
        iconFg: "text-violet-800",
      },
      {
        title: "Knowledge Manager",
        level: "Intermediate",
        description:
          "Captures and shares organizational knowledge across teams and tools.",
        iconKey: "bookOpenCheck",
        iconBg: "bg-amber-100",
        iconFg: "text-amber-900",
      },
      {
        title: "Records Manager",
        level: "Entry Level",
        description:
          "Manages retention, compliance, and lifecycle of business records.",
        iconKey: "folderKanban",
        iconBg: "bg-emerald-100",
        iconFg: "text-emerald-800",
      },
      {
        title: "BI Analyst",
        level: "Intermediate",
        description:
          "Transforms data into dashboards and reports that guide decisions.",
        iconKey: "barChart3",
        iconBg: "bg-sky-100",
        iconFg: "text-sky-800",
      },
      {
        title: "Content Strategist",
        level: "Entry Level",
        description:
          "Plans and governs content so messaging stays clear and consistent.",
        iconKey: "scrollText",
        iconBg: "bg-rose-100",
        iconFg: "text-rose-800",
      },
      {
        title: "Chief Information Officer (CIO)",
        level: "Senior",
        description:
          "Leads enterprise technology and information strategy at the executive level.",
        iconKey: "briefcase",
        iconBg: "bg-fuchsia-100",
        iconFg: "text-fuchsia-900",
      },
    ],
  },
  {
    key: "DS",
    slug: "data-science",
    breadcrumbLabel: "Data Science",
    pageTitle: "Data Science Roles",
    subtitle:
      "Extract powerful insights from complex datasets. Explore roles that blend statistics, programming, and business strategy.",
    roles: [
      {
        title: "Data Analyst",
        level: "Entry Level",
        description:
          "Cleans and visualizes data to answer day-to-day business questions.",
        iconKey: "lineChart",
        iconBg: "bg-indigo-100",
        iconFg: "text-indigo-700",
      },
      {
        title: "Data Scientist",
        level: "Intermediate",
        description:
          "Builds models and experiments to extract predictive insights.",
        iconKey: "brain",
        iconBg: "bg-purple-100",
        iconFg: "text-purple-800",
      },
      {
        title: "ML Engineer",
        level: "Intermediate",
        description:
          "Deploys and scales machine learning models in production systems.",
        iconKey: "cpu",
        iconBg: "bg-teal-100",
        iconFg: "text-teal-800",
      },
      {
        title: "AI Research Scientist",
        level: "Senior",
        description:
          "Advances novel algorithms and publishes cutting-edge AI research.",
        iconKey: "microscope",
        iconBg: "bg-pink-100",
        iconFg: "text-pink-800",
      },
      {
        title: "Data Engineer",
        level: "Intermediate",
        description:
          "Builds pipelines and warehouses that make data reliable and accessible.",
        iconKey: "route",
        iconBg: "bg-sky-100",
        iconFg: "text-sky-800",
      },
      {
        title: "NLP Engineer",
        level: "Senior",
        description:
          "Develops language models and text understanding systems.",
        iconKey: "messageSquare",
        iconBg: "bg-emerald-100",
        iconFg: "text-emerald-900",
      },
      {
        title: "Computer Vision Engineer",
        level: "Senior",
        description:
          "Builds systems that interpret images and video at scale.",
        iconKey: "camera",
        iconBg: "bg-orange-100",
        iconFg: "text-orange-900",
      },
      {
        title: "Analytics Manager",
        level: "Senior",
        description:
          "Leads analytics roadmaps and coaches teams on measurement strategy.",
        iconKey: "users",
        iconBg: "bg-amber-100",
        iconFg: "text-amber-900",
      },
    ],
  },
  {
    key: "CS",
    slug: "computer-science",
    breadcrumbLabel: "Computer Science",
    pageTitle: "Computer Science Roles",
    subtitle:
      "Dive deep into computing theory, algorithms, and logic. Explore roles at the foundation of modern technology.",
    roles: [
      {
        title: "Software Developer",
        level: "Entry Level",
        description:
          "Implements features across products using modern languages and frameworks.",
        iconKey: "code2",
        iconBg: "bg-indigo-100",
        iconFg: "text-indigo-700",
      },
      {
        title: "Algorithm Engineer",
        level: "Senior",
        description:
          "Designs efficient algorithms for large-scale or resource-constrained problems.",
        iconKey: "binary",
        iconBg: "bg-violet-100",
        iconFg: "text-violet-800",
      },
      {
        title: "Systems Programmer",
        level: "Intermediate",
        description:
          "Works close to the OS and hardware with low-level languages and APIs.",
        iconKey: "terminal",
        iconBg: "bg-slate-100",
        iconFg: "text-slate-800",
      },
      {
        title: "Compiler Engineer",
        level: "Senior",
        description:
          "Builds language tooling, compilers, and runtime optimizations.",
        iconKey: "fileSearch",
        iconBg: "bg-sky-100",
        iconFg: "text-sky-800",
      },
      {
        title: "Research Scientist",
        level: "Senior",
        description:
          "Explores new computing ideas and prototypes breakthrough technologies.",
        iconKey: "sparkles",
        iconBg: "bg-fuchsia-100",
        iconFg: "text-fuchsia-900",
      },
      {
        title: "Graphics Engineer",
        level: "Intermediate",
        description:
          "Renders immersive visuals from game engines to GPU pipelines.",
        iconKey: "brush",
        iconBg: "bg-pink-100",
        iconFg: "text-pink-800",
      },
      {
        title: "Embedded Systems Developer",
        level: "Intermediate",
        description:
          "Programs firmware and software for constrained devices.",
        iconKey: "circuitBoard",
        iconBg: "bg-emerald-100",
        iconFg: "text-emerald-900",
      },
      {
        title: "Game Developer",
        level: "Entry Level",
        description:
          "Creates gameplay, engines, or tools for interactive entertainment.",
        iconKey: "monitorPlay",
        iconBg: "bg-orange-100",
        iconFg: "text-orange-900",
      },
    ],
  },
  {
    key: "CSNE",
    slug: "cs-networking",
    breadcrumbLabel: "CS & Networking",
    pageTitle: "CS & Networking Roles",
    subtitle:
      "Architect and maintain the infrastructure that connects the world. Explore roles in networks, systems, and cloud.",
    roles: [
      {
        title: "Network Engineer",
        level: "Entry Level",
        description:
          "Designs and supports LAN/WAN connectivity and network hardware.",
        iconKey: "network",
        iconBg: "bg-sky-100",
        iconFg: "text-sky-800",
      },
      {
        title: "Network Administrator",
        level: "Entry Level",
        description:
          "Operates day-to-day network services, monitoring, and troubleshooting.",
        iconKey: "router",
        iconBg: "bg-indigo-100",
        iconFg: "text-indigo-700",
      },
      {
        title: "Cloud Architect",
        level: "Senior",
        description:
          "Defines secure, scalable cloud platforms and landing zones.",
        iconKey: "cloud",
        iconBg: "bg-violet-100",
        iconFg: "text-violet-800",
      },
      {
        title: "Systems Administrator",
        level: "Intermediate",
        description:
          "Manages servers, patching, identity, and core IT infrastructure.",
        iconKey: "server",
        iconBg: "bg-emerald-100",
        iconFg: "text-emerald-800",
      },
      {
        title: "Network Security Engineer",
        level: "Senior",
        description:
          "Hardens networks, detects intrusions, and prevents lateral movement.",
        iconKey: "shieldAlert",
        iconBg: "bg-rose-100",
        iconFg: "text-rose-900",
      },
      {
        title: "VoIP Engineer",
        level: "Intermediate",
        description:
          "Deploys and maintains voice and unified communications platforms.",
        iconKey: "phone",
        iconBg: "bg-teal-100",
        iconFg: "text-teal-900",
      },
      {
        title: "Wireless Network Engineer",
        level: "Intermediate",
        description:
          "Optimizes Wi-Fi coverage, capacity, and roaming experiences.",
        iconKey: "wifi",
        iconBg: "bg-amber-100",
        iconFg: "text-amber-900",
      },
      {
        title: "IT Infrastructure Manager",
        level: "Senior",
        description:
          "Leads teams owning data centers, cloud, and operational platforms.",
        iconKey: "building2",
        iconBg: "bg-orange-100",
        iconFg: "text-orange-900",
      },
    ],
  },
  {
    key: "IT",
    slug: "information-technology",
    breadcrumbLabel: "Information Technology",
    pageTitle: "Information Technology Roles",
    subtitle:
      "Support and implement technology solutions for enterprise success. Explore IT roles that keep organizations running.",
    roles: [
      {
        title: "IT Support Specialist",
        level: "Entry Level",
        description:
          "Resolves hardware, software, and access issues for end users.",
        iconKey: "headphones",
        iconBg: "bg-indigo-100",
        iconFg: "text-indigo-700",
      },
      {
        title: "IT Project Manager",
        level: "Intermediate",
        description:
          "Plans delivery of technology initiatives with stakeholders and vendors.",
        iconKey: "target",
        iconBg: "bg-sky-100",
        iconFg: "text-sky-800",
      },
      {
        title: "Systems Analyst",
        level: "Intermediate",
        description:
          "Translates business needs into requirements and system designs.",
        iconKey: "fileBarChart",
        iconBg: "bg-purple-100",
        iconFg: "text-purple-800",
      },
      {
        title: "Help Desk Technician",
        level: "Entry Level",
        description:
          "Provides first-line support and documents incidents for escalation.",
        iconKey: "laptop",
        iconBg: "bg-emerald-100",
        iconFg: "text-emerald-800",
      },
      {
        title: "IT Consultant",
        level: "Senior",
        description:
          "Advises organizations on technology strategy and transformation.",
        iconKey: "globe",
        iconBg: "bg-violet-100",
        iconFg: "text-violet-900",
      },
      {
        title: "ERP Specialist",
        level: "Intermediate",
        description:
          "Configures and integrates enterprise resource planning systems.",
        iconKey: "cog",
        iconBg: "bg-amber-100",
        iconFg: "text-amber-900",
      },
      {
        title: "IT Director",
        level: "Senior",
        description:
          "Owns IT service management, budgets, and alignment with business goals.",
        iconKey: "briefcase",
        iconBg: "bg-fuchsia-100",
        iconFg: "text-fuchsia-900",
      },
      {
        title: "Technical Support Engineer",
        level: "Entry Level",
        description:
          "Supports customers or internal teams on product and platform issues.",
        iconKey: "wrench",
        iconBg: "bg-teal-100",
        iconFg: "text-teal-900",
      },
    ],
  },
  {
    key: "ISE",
    slug: "systems-engineering",
    breadcrumbLabel: "Systems Engineering",
    pageTitle: "Systems Engineering Roles",
    subtitle:
      "Integrate complex hardware and software systems seamlessly. Explore roles that bridge engineering disciplines.",
    roles: [
      {
        title: "Systems Engineer",
        level: "Intermediate",
        description:
          "Defines requirements and validates complex multi-disciplinary systems.",
        iconKey: "gauge",
        iconBg: "bg-indigo-100",
        iconFg: "text-indigo-700",
      },
      {
        title: "Integration Engineer",
        level: "Intermediate",
        description:
          "Connects subsystems, APIs, and hardware into cohesive solutions.",
        iconKey: "gitBranch",
        iconBg: "bg-sky-100",
        iconFg: "text-sky-800",
      },
      {
        title: "Hardware Engineer",
        level: "Entry Level",
        description:
          "Designs, tests, and brings up physical product electronics.",
        iconKey: "hardDrive",
        iconBg: "bg-slate-100",
        iconFg: "text-slate-800",
      },
      {
        title: "Embedded Systems Engineer",
        level: "Intermediate",
        description:
          "Develops software that runs on custom boards and sensors.",
        iconKey: "cpu",
        iconBg: "bg-emerald-100",
        iconFg: "text-emerald-900",
      },
      {
        title: "Reliability Engineer",
        level: "Senior",
        description:
          "Analyzes failures, runs rigorous testing, and improves product lifetime.",
        iconKey: "heartPulse",
        iconBg: "bg-rose-100",
        iconFg: "text-rose-900",
      },
      {
        title: "Controls Engineer",
        level: "Senior",
        description:
          "Programs PLCs and control loops for automation and robotics.",
        iconKey: "radio",
        iconBg: "bg-orange-100",
        iconFg: "text-orange-900",
      },
      {
        title: "Systems Architect",
        level: "Senior",
        description:
          "Owns end-to-end architecture across safety, performance, and cost.",
        iconKey: "rocket",
        iconBg: "bg-violet-100",
        iconFg: "text-violet-900",
      },
      {
        title: "Test & Evaluation Engineer",
        level: "Entry Level",
        description:
          "Plans verification, validation, and test campaigns for new systems.",
        iconKey: "checkCircle",
        iconBg: "bg-amber-100",
        iconFg: "text-amber-900",
      },
    ],
  },
  {
    key: "CYBER",
    slug: "cyber-security",
    breadcrumbLabel: "Cyber Security",
    pageTitle: "Cyber Security Roles",
    subtitle:
      "Protect critical assets and data from modern digital threats. Explore roles in defense, analysis, and security operations.",
    roles: [
      {
        title: "Security Analyst",
        level: "Entry Level",
        description:
          "Monitors alerts, investigates events, and improves detection coverage.",
        iconKey: "eye",
        iconBg: "bg-indigo-100",
        iconFg: "text-indigo-700",
      },
      {
        title: "Penetration Tester",
        level: "Intermediate",
        description:
          "Simulates attackers to find exploitable weaknesses in systems.",
        iconKey: "bug",
        iconBg: "bg-rose-100",
        iconFg: "text-rose-800",
      },
      {
        title: "SOC Analyst",
        level: "Entry Level",
        description:
          "Works in the security operations center triaging and escalating incidents.",
        iconKey: "radar",
        iconBg: "bg-sky-100",
        iconFg: "text-sky-800",
      },
      {
        title: "Incident Responder",
        level: "Intermediate",
        description:
          "Leads containment, eradication, and recovery during breaches.",
        iconKey: "alertTriangle",
        iconBg: "bg-amber-100",
        iconFg: "text-amber-900",
      },
      {
        title: "Security Architect",
        level: "Senior",
        description:
          "Designs zero-trust patterns and security controls for new initiatives.",
        iconKey: "spline",
        iconBg: "bg-violet-100",
        iconFg: "text-violet-900",
      },
      {
        title: "Threat Intelligence Analyst",
        level: "Senior",
        description:
          "Tracks adversaries, campaigns, and emerging attack techniques.",
        iconKey: "shield",
        iconBg: "bg-teal-100",
        iconFg: "text-teal-900",
      },
      {
        title: "Compliance Officer",
        level: "Intermediate",
        description:
          "Maps controls to frameworks and prepares audit evidence.",
        iconKey: "scale",
        iconBg: "bg-emerald-100",
        iconFg: "text-emerald-900",
      },
      {
        title: "CISO",
        level: "Senior",
        description:
          "Sets enterprise security vision, budget, and risk appetite.",
        iconKey: "keyRound",
        iconBg: "bg-fuchsia-100",
        iconFg: "text-fuchsia-900",
      },
    ],
  },
];

const BY_SLUG = Object.fromEntries(
  SPECIALIZATION_ROLE_PAGES.map((p) => [p.slug, p])
) as Record<string, SpecializationRolesPageDef>;

const BY_KEY = Object.fromEntries(
  SPECIALIZATION_ROLE_PAGES.map((p) => [p.key, p])
) as Record<SpecializationKey, SpecializationRolesPageDef>;

export function getSpecializationRolesPage(
  slug: string
): SpecializationRolesPageDef | null {
  return BY_SLUG[slug] ?? null;
}

export function getSpecializationSlugForKey(
  key: SpecializationKey
): string {
  return BY_KEY[key].slug;
}

export const SPECIALIZATION_ROLE_SLUGS = SPECIALIZATION_ROLE_PAGES.map(
  (p) => p.slug
);
