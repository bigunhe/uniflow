import Link from "next/link";
import {
  Bot,
  Compass,
  Rocket,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { AnimatedGlobe } from "./_components/AnimatedGlobe";

const quickStats = [
  { value: "500+", label: "Expert Mentors" },
  { value: "12k+", label: "Sessions" },
  { value: "98%", label: "Success Rate" },
  { value: "45", label: "Countries" },
];

const miniFlow = [
  { number: "1", label: "Share your goal" },
  { number: "2", label: "Match with mentor" },
  { number: "3", label: "Start live support" },
];

const detailedFlow = [
  {
    title: "Get Fast AI Clarity",
    description:
      "Ask quick questions first and get immediate guidance before booking a session.",
    icon: Sparkles,
  },
  {
    title: "Learn Web Skills",
    description:
      "Move from theory to implementation with practical mentor-supported sessions.",
    icon: Bot,
  },
  {
    title: "Get Matched Mentors",
    description:
      "Connect with curated mentors who fit your topic, pace, and learning target.",
    icon: Rocket,
  },
  {
    title: "Start Smart Sessions",
    description:
      "Bring your blockers, projects, and interview prep into focused 1-on-1 calls.",
    icon: Compass,
  },
  {
    title: "Track Progress",
    description:
      "Keep momentum with clear action items, follow-ups, and milestone reviews.",
    icon: UserCheck,
  },
  {
    title: "Graduate Strong",
    description:
      "Turn each mentoring cycle into measurable outcomes for academics and career.",
    icon: ShieldCheck,
  },
];

const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/networking/mentors", label: "Product" },
      { href: "/networking/mentors/start", label: "UniFlow" },
      { href: "/networking/mentors/messages", label: "Community" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/networking/mentors", label: "How It Works" },
      { href: "/networking/mentors/start", label: "Pricing" },
      { href: "/networking/mentors/messages", label: "Contact Us" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/networking/mentors/mentor-discovery", label: "About" },
      { href: "/terms-of-service", label: "Terms of Use" },
      { href: "/privacy-policy", label: "Privacy Policy" },
    ],
  },
];

export default function MentorsEntryPage() {
  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[radial-gradient(circle_at_24%_20%,rgba(0,210,180,0.22),transparent_42%),linear-gradient(118deg,#09101d_8%,#070e1c_36%,#060c19_82%)]">
      <section className="overflow-hidden">
        <div className="px-5 pb-6 pt-3 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h1 className="text-4xl font-black leading-[0.98] tracking-tight text-[#f2f6ff] sm:text-6xl">
                The Global Network
                <br />
                for Expert Growth
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Bridge the gap with AI-assisted human expertise. Master complex skills through curated 1-on-1 sessions.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/networking/mentors/start"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-5 text-sm font-semibold text-slate-100 shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:bg-white/10"
                >
                  Join as Student
                </Link>
                <Link
                  href="/networking/mentors/start"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-transparent px-5 text-sm font-semibold text-slate-200 transition hover:bg-white/8 hover:text-white"
                >
                  Join as Mentor
                </Link>
              </div>
            </div>

            <AnimatedGlobe />
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-white/10 bg-white/4 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <p className="text-3xl font-black tracking-tight text-slate-100 lg:text-4xl">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-slate-400">{item.label}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="text-center text-4xl font-black tracking-tight text-[#f2f6ff]">How it Works</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {miniFlow.map((item) => (
              <article
                key={item.number}
                className="rounded-xl border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-3"
              >
                <div className="inline-flex h-8 min-w-8 items-center justify-center rounded-lg border border-white/10 bg-white/6 px-2 text-base font-black text-slate-100">
                  {item.number}
                </div>
                <p className="mt-2 text-sm font-medium text-slate-200">{item.label}</p>
              </article>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {detailedFlow.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-4"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/6 text-slate-200">
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-100">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-300">{item.description}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-[radial-gradient(circle_at_50%_0%,rgba(0,210,180,0.2),transparent_55%)] py-6 text-center">
            <h3 className="text-4xl font-black tracking-tight text-transparent bg-gradient-to-r from-[#84a2ff] via-[#67c8dd] to-[#4de8ce] bg-clip-text sm:text-5xl">
              Ready to accelerate your future?
            </h3>
            <Link
              href="/networking/mentors/start"
              className="mt-5 inline-flex h-11 items-center justify-center rounded-full border border-white/12 bg-white/6 px-6 text-sm font-semibold text-slate-100 shadow-[0_8px_18px_rgba(0,0,0,0.18)] transition hover:bg-white/10"
            >
              Join the Network
            </Link>
          </div>

          <footer className="mt-7 border-t border-white/12 pt-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {footerGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-sm font-semibold text-slate-100">{group.title}</p>
                  <ul className="mt-2 space-y-1.5 text-xs text-slate-400">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link href={link.href} className="transition hover:text-slate-200">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <p className="text-sm font-semibold text-slate-100">Legal</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[11px] text-slate-300">
                    f
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[11px] text-slate-300">
                    in
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[11px] text-slate-300">
                    yt
                  </span>
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[11px] text-slate-300">
                    ig
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/8 pt-3 text-[11px] text-slate-500">
              <p>Unified by UniFlow</p>
              <p>&copy; 2026 Rights reserved.</p>
            </div>
          </footer>
        </div>
      </section>
    </div>
  );
}
