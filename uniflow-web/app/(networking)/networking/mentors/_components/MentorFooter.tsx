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
      <footer className="rounded-b-[2rem] border border-t-0 border-slate-200 bg-[#f2f4f8]">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-6 py-10 sm:px-10 lg:grid-cols-4 lg:px-12">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-black text-white">✦</span>
              <span className="text-lg font-bold tracking-tight text-slate-950">UniFlow</span>
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-600">
              Curating the future of learning through high-fidelity human mentorship and advanced AI.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-slate-200 text-xs text-slate-500">x</span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-slate-200 text-xs text-slate-500">o</span>
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Platform</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/networking/mentors" className="text-sm text-slate-600 hover:text-slate-900">Explore</Link></li>
              <li><Link href="/networking/mentors#students" className="text-sm text-slate-600 hover:text-slate-900">Pathways</Link></li>
              <li><Link href="/networking/mentors" className="text-sm text-slate-600 hover:text-slate-900">Safety</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Resources</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/networking/mentors" className="text-sm text-slate-600 hover:text-slate-900">Blog</Link></li>
              <li><Link href="/networking/mentors/ai-assistant" className="text-sm text-slate-600 hover:text-slate-900">AI</Link></li>
              <li><Link href="/networking/mentors" className="text-sm text-slate-600 hover:text-slate-900">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">Company</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/networking/mentors" className="text-sm text-slate-600 hover:text-slate-900">Safety</Link></li>
              <li><Link href="/networking/mentors" className="text-sm text-slate-600 hover:text-slate-900">Careers</Link></li>
              <li><Link href="/networking/mentors" className="text-sm text-slate-600 hover:text-slate-900">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 px-6 py-4 sm:px-10 lg:px-12">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between text-[10px] font-medium uppercase tracking-wide text-slate-500">
            <span>© {new Date().getFullYear()} Aether Mentor AI. Curating the future of learning.</span>
            <span className="text-indigo-600">System Operational</span>
          </div>
        </div>
      </footer>
    );
  }

  const footerClass = "border-t border-slate-200 bg-white/90 backdrop-blur";

  const headingClass = "text-base font-semibold text-slate-900";
  const paragraphClass = "mt-2 text-sm leading-relaxed text-slate-600";
  const sectionHeadingClass = "text-sm font-semibold text-slate-900";
  const linkClass = "text-sm text-slate-600 hover:text-indigo-600";
  const infoClass = "mt-3 text-sm text-slate-600";
  const bottomClass = "border-t border-slate-200 py-4 text-center text-xs text-slate-500";

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
