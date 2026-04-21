"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", match: "home" as const },
  { href: "/networking/mentors", label: "Mentors", match: "mentors" as const },
  { href: "/#about", label: "About", match: "about" as const },
] as const;

type AuthHeaderProps = {
  cta: { href: string; label: string };
  ctaVariant?: "primary" | "muted";
};

function useHash() {
  const [hash, setHash] = useState("");

  useEffect(() => {
    const read = () =>
      setHash(typeof window !== "undefined" ? window.location.hash : "");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  return hash;
}

function navLinkActive(
  match: "home" | "mentors" | "about",
  pathname: string,
  hash: string
) {
  if (match === "mentors") {
    return pathname.startsWith("/networking/mentors");
  }
  if (match === "about") {
    return pathname === "/" && hash === "#about";
  }
  return pathname === "/" && hash !== "#about";
}

export function AuthHeader({ cta, ctaVariant = "primary" }: AuthHeaderProps) {
  const pathname = usePathname();
  const hash = useHash();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, hash]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-100/80 bg-white/80 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] backdrop-blur-xl supports-[backdrop-filter]:bg-white/65">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 shrink-0 group rounded-xl py-1 pr-2 -ml-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20 transition group-hover:shadow-lg group-hover:shadow-indigo-500/30">
            <GraduationCap className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <div className="min-w-0 leading-tight">
            <span className="block text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              uniflow
            </span>
            <span className="hidden text-[11px] font-medium uppercase tracking-wider text-indigo-500/90 sm:block">
              Career & mentorship
            </span>
          </div>
        </Link>

        <nav
          className="hidden md:flex items-center gap-1 rounded-full bg-gray-50/90 px-1.5 py-1.5 ring-1 ring-gray-200/80 shadow-inner"
          aria-label="Primary"
        >
          {NAV_LINKS.map(({ href, label, match }) => {
            const active = navLinkActive(match, pathname, hash);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-white text-indigo-700 shadow-sm ring-1 ring-gray-200/90"
                    : "text-gray-600 hover:bg-white/80 hover:text-gray-900"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href={cta.href}
            className={cn(
              "hidden sm:inline-flex rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
              ctaVariant === "muted"
                ? "bg-violet-100 text-violet-900 shadow-sm ring-1 ring-violet-200/90 hover:bg-violet-200/80"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/25 ring-1 ring-white/20 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg"
            )}
          >
            {cta.label}
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200/90 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 md:hidden"
            aria-expanded={open}
            aria-controls="auth-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="auth-mobile-menu"
        className={cn(
          "md:hidden border-t border-indigo-100/80 bg-white/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 ease-out overflow-hidden",
          open ? "max-h-[320px] opacity-100 shadow-lg" : "max-h-0 opacity-0"
        )}
        aria-hidden={!open}
      >
        <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-xl px-4 py-3 text-base font-semibold text-gray-800 hover:bg-indigo-50 hover:text-indigo-800"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link
            href={cta.href}
            className={cn(
              "mt-2 flex items-center justify-center rounded-xl px-4 py-3.5 text-base font-semibold shadow-md",
              ctaVariant === "muted"
                ? "bg-violet-100 text-violet-900 ring-1 ring-violet-200/90"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
            )}
            onClick={() => setOpen(false)}
          >
            {cta.label}
          </Link>
        </nav>
      </div>
    </header>
  );
}
