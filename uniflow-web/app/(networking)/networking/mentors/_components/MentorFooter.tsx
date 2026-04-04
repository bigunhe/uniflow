"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const footerLinks = [
  { label: "Mentor Directory", href: "/networking/mentors/mentor-discovery" },
  { label: "Dashboard", href: "/networking/mentors/mentor-dashboard" },
  { label: "Messages", href: "/networking/mentors/messages" },
];

export function MentorFooter() {
  const pathname = usePathname();
  const isCommonLanding =
    pathname === "/networking/mentors" || pathname === "/networking/mentors/start";

  if (isCommonLanding) {
    return (
      <footer className="rounded-b-[2rem] border border-t-0 border-white/8 bg-[rgba(10,14,22,0.92)]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-10 sm:px-10 lg:grid-cols-4 lg:px-12">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#00d2b4] to-[#6366f1] text-[10px] font-black text-white">✦</span>
              <span className="text-lg font-bold tracking-tight text-white">UniFlow</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[rgba(232,238,248,0.9)]">
              Curating the future of learning through high-fidelity human mentorship and advanced AI.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-white/5 text-xs text-[rgba(232,238,248,0.72)]">x</span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-white/5 text-xs text-[rgba(232,238,248,0.72)]">o</span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[rgba(168,184,208,0.85)]">Platform</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/networking/mentors" className="text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]">Explore</Link></li>
              <li><Link href="/networking/mentors#students" className="text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]">Pathways</Link></li>
              <li><Link href="/networking/mentors" className="text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]">Safety</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[rgba(168,184,208,0.85)]">Resources</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/networking/mentors" className="text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]">Blog</Link></li>
              <li><Link href="/networking/mentors/ai-assistant" className="text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]">AI</Link></li>
              <li><Link href="/networking/mentors" className="text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-[rgba(168,184,208,0.85)]">Company</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/networking/mentors" className="text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]">Safety</Link></li>
              <li><Link href="/networking/mentors" className="text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]">Careers</Link></li>
              <li><Link href="/networking/mentors" className="text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 px-6 py-4 sm:px-10 lg:px-12">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between text-[10px] font-medium uppercase tracking-wide text-[rgba(168,184,208,0.85)]">
            <span>© {new Date().getFullYear()} Aether Mentor AI. Curating the future of learning.</span>
            <span className="text-[#00d2b4]">System Operational</span>
          </div>
        </div>
      </footer>
    );
  }

  const footerClass = "border-t border-white/8 bg-[rgba(10,14,22,0.92)] backdrop-blur-xl";

  const headingClass = "text-base font-semibold text-white";
  const paragraphClass = "mt-2 text-sm leading-relaxed text-[rgba(232,238,248,0.86)]";
  const sectionHeadingClass = "text-sm font-semibold text-white";
  const linkClass = "text-sm text-[rgba(232,238,248,0.78)] hover:text-[#00d2b4]";
  const infoClass = "mt-3 text-sm text-[rgba(232,238,248,0.78)]";
  const bottomClass = "border-t border-white/8 py-4 text-center text-xs text-[rgba(168,184,208,0.85)]";

  return (
    <footer className={footerClass}>
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <h3 className={headingClass}>UniFlow Mentors</h3>
          <p className={paragraphClass}>
            A practical mentorship experience for students looking for focused guidance,
            structured sessions, and measurable learning outcomes.
          </p>
        </div>

        <div>
          <h4 className={sectionHeadingClass}>Explore</h4>
          <ul className="mt-3 space-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className={sectionHeadingClass}>Contact</h4>
          <p className={infoClass}>support@uniflow.app</p>
          <p className="mt-1 text-sm text-slate-600">
            Mon-Fri, 9:00 AM - 6:00 PM
          </p>
        </div>
      </div>
      <div className={bottomClass}>
        © {new Date().getFullYear()} UniFlow. All rights reserved.
      </div>
    </footer>
  );
}
