import Link from "next/link";
import { GraduationCap } from "lucide-react";

const NAV_LINKS = [
  { href: "/networking/mentors", label: "Expertise" },
  { href: "/", label: "Process" },
  { href: "/networking", label: "Network" },
  { href: "/", label: "Support" },
] as const;

const FOOTER_LINKS = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Mentor Guidelines" },
  { href: "#", label: "Help Center" },
] as const;

type MentorRegisterLayoutProps = {
  children: React.ReactNode;
};

export function MentorRegisterLayout({ children }: MentorRegisterLayoutProps) {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-violet-50/70">
      <header className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold text-blue-900 tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm">
              <GraduationCap className="h-5 w-5" strokeWidth={2.25} />
            </span>
            <span className="text-lg sm:text-xl">UniFlow</span>
          </Link>

          <nav
            className="hidden md:flex items-center gap-1 lg:gap-2"
            aria-label="Mentor registration"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href + label}
                href={href}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/login"
            className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20 transition hover:from-indigo-700 hover:to-violet-700 sm:px-5"
          >
            Sign In
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full">{children}</main>

      <footer className="border-t border-gray-200/80 bg-white/60 py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
              <GraduationCap className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <p className="text-sm text-gray-600">
              © {year} UniFlow. Empowering the next generation of industry
              leaders.
            </p>
          </div>
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
            aria-label="Footer"
          >
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="font-medium text-gray-600 underline decoration-gray-300 underline-offset-4 transition hover:text-indigo-700 hover:decoration-indigo-300"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
