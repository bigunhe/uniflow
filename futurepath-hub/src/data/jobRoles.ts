import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart3,
  Binary,
  Braces,
  BookOpen,
  Box,
  Brain,
  Bug,
  Cable,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileSearch,
  Gauge,
  Globe,
  Headset,
  HeartPulse,
  KeyRound,
  Laptop,
  LayoutTemplate,
  Layers,
  LineChart,
  Lock,
  Microscope,
  Network,
  Phone,
  Radar,
  Radio,
  Router,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Spline,
  TestTube2,
  UserCog,
  Users,
  Wifi,
  Workflow,
} from 'lucide-react'
import type { ExperienceLevel, SpecId } from '../types'

export interface JobRoleEntry {
  title: string
  description: string
  level: ExperienceLevel
  Icon: LucideIcon
  /** Tailwind classes for icon tile background and foreground */
  iconWrapClass: string
}

export const JOB_ROLES_BY_SPEC: Record<SpecId, JobRoleEntry[]> = {
  SE: [
    {
      title: 'Frontend Developer',
      description:
        'Builds the visual elements of a website that users interact with',
      level: 'Entry Level',
      Icon: LayoutTemplate,
      iconWrapClass: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Backend Developer',
      description:
        'Focuses on server-side logic, databases, and application',
      level: 'Intermediate',
      Icon: Server,
      iconWrapClass: 'bg-violet-100 text-violet-600',
    },
    {
      title: 'Full Stack Developer',
      description:
        'Comfortable working on both front and back-end systems',
      level: 'Intermediate',
      Icon: Layers,
      iconWrapClass: 'bg-fuchsia-100 text-fuchsia-600',
    },
    {
      title: 'Mobile Developer',
      description:
        'Specializes in creating applications for mobile devices',
      level: 'Entry Level',
      Icon: Smartphone,
      iconWrapClass: 'bg-sky-100 text-sky-600',
    },
    {
      title: 'QA Engineer',
      description:
        'Ensures software quality through automated and manual testing',
      level: 'Entry Level',
      Icon: TestTube2,
      iconWrapClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'DevOps Engineer',
      description:
        'Bridges the gap between development and operations',
      level: 'Senior',
      Icon: Workflow,
      iconWrapClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Security Engineer',
      description:
        'Protects systems from cyber threats by implementing security',
      level: 'Senior',
      Icon: ShieldCheck,
      iconWrapClass: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'SRE (Site Reliability Engineer)',
      description:
        'Applies software engineering practices to operations and reliability',
      level: 'Senior',
      Icon: Gauge,
      iconWrapClass: 'bg-orange-100 text-orange-600',
    },
  ],
  IM: [
    {
      title: 'Database Administrator',
      description:
        'Manages and maintains database systems for performance',
      level: 'Intermediate',
      Icon: Database,
      iconWrapClass: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Data Architect',
      description: 'Designs the structure and strategy of data systems',
      level: 'Senior',
      Icon: Spline,
      iconWrapClass: 'bg-violet-100 text-violet-600',
    },
    {
      title: 'Information Analyst',
      description:
        'Analyzes data to produce meaningful business reports',
      level: 'Entry Level',
      Icon: BarChart3,
      iconWrapClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Knowledge Manager',
      description:
        'Organizes and maintains company knowledge and documentation',
      level: 'Intermediate',
      Icon: BookOpen,
      iconWrapClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Records Manager',
      description:
        'Manages storage and compliance of organizational records',
      level: 'Entry Level',
      Icon: FileSearch,
      iconWrapClass: 'bg-sky-100 text-sky-600',
    },
    {
      title: 'Content Strategist',
      description:
        'Plans and manages content to support business objectives',
      level: 'Intermediate',
      Icon: LayoutTemplate,
      iconWrapClass: 'bg-fuchsia-100 text-fuchsia-600',
    },
    {
      title: 'Business Intelligence Analyst',
      description:
        'Transforms data into insights for decision making',
      level: 'Intermediate',
      Icon: LineChart,
      iconWrapClass: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Data Governance Specialist',
      description:
        'Ensures data quality, security, and compliance policies',
      level: 'Senior',
      Icon: Shield,
      iconWrapClass: 'bg-slate-200 text-slate-800',
    },
  ],
  DS: [
    {
      title: 'Data Scientist',
      description:
        'Builds models and algorithms to solve complex data problems',
      level: 'Senior',
      Icon: Brain,
      iconWrapClass: 'bg-violet-100 text-violet-600',
    },
    {
      title: 'Machine Learning Engineer',
      description:
        'Develops and deploys machine learning models at scale',
      level: 'Senior',
      Icon: Cpu,
      iconWrapClass: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Data Analyst',
      description:
        'Interprets data sets to identify trends and insights',
      level: 'Entry Level',
      Icon: BarChart3,
      iconWrapClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Data Engineer',
      description:
        'Builds pipelines that collect, store, and process data',
      level: 'Intermediate',
      Icon: Workflow,
      iconWrapClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'AI Research Scientist',
      description:
        'Conducts research to advance artificial intelligence capabilities',
      level: 'Senior',
      Icon: Microscope,
      iconWrapClass: 'bg-fuchsia-100 text-fuchsia-600',
    },
    {
      title: 'NLP Engineer',
      description:
        'Builds systems that understand and generate human language',
      level: 'Senior',
      Icon: BookOpen,
      iconWrapClass: 'bg-sky-100 text-sky-600',
    },
    {
      title: 'Computer Vision Engineer',
      description:
        'Develops systems that interpret and analyze visual data',
      level: 'Senior',
      Icon: Radar,
      iconWrapClass: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Business Intelligence Developer',
      description:
        'Creates dashboards and reports for business decisions',
      level: 'Intermediate',
      Icon: LineChart,
      iconWrapClass: 'bg-indigo-100 text-indigo-600',
    },
  ],
  CS: [
    {
      title: 'Software Developer',
      description: 'Designs and writes code for software applications',
      level: 'Entry Level',
      Icon: Code2,
      iconWrapClass: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Algorithm Engineer',
      description:
        'Designs efficient algorithms for complex computing problems',
      level: 'Senior',
      Icon: Binary,
      iconWrapClass: 'bg-violet-100 text-violet-600',
    },
    {
      title: 'Compiler Engineer',
      description:
        'Builds and maintains compilers and programming language tools',
      level: 'Senior',
      Icon: Cpu,
      iconWrapClass: 'bg-fuchsia-100 text-fuchsia-600',
    },
    {
      title: 'Operating Systems Engineer',
      description:
        'Develops and maintains core operating system components',
      level: 'Senior',
      Icon: Server,
      iconWrapClass: 'bg-slate-200 text-slate-800',
    },
    {
      title: 'Embedded Systems Developer',
      description: 'Programs software for embedded hardware devices',
      level: 'Intermediate',
      Icon: Cpu,
      iconWrapClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Research Scientist',
      description:
        'Conducts academic and applied computer science research',
      level: 'Senior',
      Icon: Microscope,
      iconWrapClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Computer Architecture Engineer',
      description:
        'Designs processor and hardware system architectures',
      level: 'Senior',
      Icon: Box,
      iconWrapClass: 'bg-orange-100 text-orange-600',
    },
    {
      title: 'Programming Language Designer',
      description:
        'Creates and evolves programming languages and runtimes',
      level: 'Senior',
      Icon: Braces,
      iconWrapClass: 'bg-indigo-100 text-indigo-600',
    },
  ],
  CSNE: [
    {
      title: 'Network Engineer',
      description:
        'Designs and implements computer network infrastructure',
      level: 'Intermediate',
      Icon: Network,
      iconWrapClass: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Network Administrator',
      description:
        'Maintains and troubleshoots organizational network systems',
      level: 'Entry Level',
      Icon: Router,
      iconWrapClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Cloud Network Engineer',
      description: 'Architects network solutions on cloud platforms',
      level: 'Senior',
      Icon: Cloud,
      iconWrapClass: 'bg-sky-100 text-sky-600',
    },
    {
      title: 'VoIP Engineer',
      description:
        'Implements and manages voice over IP communication systems',
      level: 'Intermediate',
      Icon: Phone,
      iconWrapClass: 'bg-violet-100 text-violet-600',
    },
    {
      title: 'Wireless Network Engineer',
      description:
        'Designs and deploys wireless networking solutions',
      level: 'Intermediate',
      Icon: Wifi,
      iconWrapClass: 'bg-fuchsia-100 text-fuchsia-600',
    },
    {
      title: 'Network Security Analyst',
      description:
        'Monitors and protects network systems from threats',
      level: 'Intermediate',
      Icon: ShieldAlert,
      iconWrapClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Network Architect',
      description:
        'Plans and designs the overall structure of network systems',
      level: 'Senior',
      Icon: Spline,
      iconWrapClass: 'bg-slate-200 text-slate-800',
    },
    {
      title: 'NOC Engineer',
      description:
        'Monitors network operations center for uptime and performance',
      level: 'Entry Level',
      Icon: Activity,
      iconWrapClass: 'bg-orange-100 text-orange-600',
    },
  ],
  IT: [
    {
      title: 'IT Support Specialist',
      description:
        'Provides technical support and resolves hardware and software issues',
      level: 'Entry Level',
      Icon: Headset,
      iconWrapClass: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Systems Administrator',
      description:
        'Manages and maintains servers and IT infrastructure',
      level: 'Intermediate',
      Icon: Server,
      iconWrapClass: 'bg-violet-100 text-violet-600',
    },
    {
      title: 'Cloud Engineer',
      description:
        'Deploys and manages cloud-based infrastructure and services',
      level: 'Intermediate',
      Icon: Cloud,
      iconWrapClass: 'bg-sky-100 text-sky-600',
    },
    {
      title: 'IT Project Manager',
      description:
        'Leads technology projects from planning to delivery',
      level: 'Senior',
      Icon: Users,
      iconWrapClass: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Help Desk Technician',
      description:
        'Assists end users with technical problems and queries',
      level: 'Entry Level',
      Icon: Laptop,
      iconWrapClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'IT Consultant',
      description:
        'Advises organizations on technology strategies and solutions',
      level: 'Senior',
      Icon: UserCog,
      iconWrapClass: 'bg-fuchsia-100 text-fuchsia-600',
    },
    {
      title: 'ERP Specialist',
      description:
        'Implements and manages enterprise resource planning systems',
      level: 'Intermediate',
      Icon: Box,
      iconWrapClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'IT Auditor',
      description:
        'Evaluates and ensures compliance of IT systems and controls',
      level: 'Senior',
      Icon: FileSearch,
      iconWrapClass: 'bg-slate-200 text-slate-800',
    },
  ],
  ISE: [
    {
      title: 'Systems Engineer',
      description:
        'Designs and oversees complex integrated systems development',
      level: 'Senior',
      Icon: Spline,
      iconWrapClass: 'bg-indigo-100 text-indigo-600',
    },
    {
      title: 'Embedded Systems Engineer',
      description:
        'Develops software for embedded hardware platforms',
      level: 'Intermediate',
      Icon: Cpu,
      iconWrapClass: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Hardware Engineer',
      description:
        'Designs and tests physical computing hardware components',
      level: 'Intermediate',
      Icon: Box,
      iconWrapClass: 'bg-violet-100 text-violet-600',
    },
    {
      title: 'Integration Engineer',
      description:
        'Connects and integrates different systems and components',
      level: 'Intermediate',
      Icon: Cable,
      iconWrapClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Reliability Engineer',
      description:
        'Ensures system performance, uptime, and fault tolerance',
      level: 'Senior',
      Icon: HeartPulse,
      iconWrapClass: 'bg-rose-100 text-rose-600',
    },
    {
      title: 'Control Systems Engineer',
      description:
        'Designs automated control systems for industrial use',
      level: 'Senior',
      Icon: Gauge,
      iconWrapClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Robotics Engineer',
      description:
        'Builds and programs robotic systems and automation solutions',
      level: 'Senior',
      Icon: Cpu,
      iconWrapClass: 'bg-fuchsia-100 text-fuchsia-600',
    },
    {
      title: 'IoT Engineer',
      description:
        'Develops connected devices and internet of things ecosystems',
      level: 'Intermediate',
      Icon: Radio,
      iconWrapClass: 'bg-orange-100 text-orange-600',
    },
  ],
  CYBER: [
    {
      title: 'Security Analyst',
      description:
        'Monitors systems and networks to detect and respond to threats',
      level: 'Entry Level',
      Icon: Shield,
      iconWrapClass: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Penetration Tester',
      description:
        'Simulates cyber attacks to identify system vulnerabilities',
      level: 'Intermediate',
      Icon: Bug,
      iconWrapClass: 'bg-violet-100 text-violet-600',
    },
    {
      title: 'SOC Analyst',
      description:
        'Works in security operations center to monitor threats in real time',
      level: 'Entry Level',
      Icon: Radar,
      iconWrapClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      title: 'Incident Responder',
      description:
        'Investigates and responds to cybersecurity breaches',
      level: 'Intermediate',
      Icon: ShieldAlert,
      iconWrapClass: 'bg-amber-100 text-amber-700',
    },
    {
      title: 'Malware Analyst',
      description:
        'Analyzes malicious software to understand and counter threats',
      level: 'Senior',
      Icon: Microscope,
      iconWrapClass: 'bg-fuchsia-100 text-fuchsia-600',
    },
    {
      title: 'Security Architect',
      description:
        'Designs comprehensive security frameworks for organizations',
      level: 'Senior',
      Icon: Lock,
      iconWrapClass: 'bg-slate-200 text-slate-800',
    },
    {
      title: 'Threat Intelligence Analyst',
      description:
        'Researches and tracks emerging cyber threat actors',
      level: 'Senior',
      Icon: Globe,
      iconWrapClass: 'bg-sky-100 text-sky-600',
    },
    {
      title: 'Cryptography Engineer',
      description:
        'Develops encryption systems and secure communication protocols',
      level: 'Senior',
      Icon: KeyRound,
      iconWrapClass: 'bg-indigo-100 text-indigo-600',
    },
  ],
}
