"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { mentorButtonClassName, MentorButton } from "./MentorButton";
import {
  type UserRoleProfile,
  getUserRoleProfile,
  clearUserRoleProfile,
} from "./userRoleProfile";

const studentNavItems = [
  { label: "Home", href: "/networking/mentors/home" },
  { label: "Mentors", href: "/networking/mentors/mentor-discovery" },
  { label: "AI Assistant", href: "/networking/mentors/ai-assistant" },
  { label: "Messages", href: "/networking/mentors/messages" },
];

const mentorNavItems = [
  { label: "Dashboard", href: "/networking/mentors/home" },
  { label: "Requests", href: "/networking/mentors/request-management" },
  { label: "Sessions", href: "/networking/mentors/live-session" },
  { label: "Feedback", href: "/networking/mentors/tutor-analytics" },
  { label: "Messages", href: "/networking/mentors/messages" },
];

const commonNavItems = [
  { label: "Home", href: "/networking/mentors" },
  { label: "For Students", href: "/networking/mentors#students" },
  { label: "For Mentors", href: "/networking/mentors#mentors" },
  { label: "Pricing", href: "/networking/mentors#pricing" },
];

const guestNavItems = [
  { label: "Home", href: "/networking/mentors" },
  { label: "Get Started", href: "/networking/mentors/start" },
];

export function MentorHeader() {
  const router = useRouter();
  const pathname = usePathname();
  // Defer reading localStorage until after hydration to avoid SSR/client mismatch.
  const [profile, setProfile] = useState<UserRoleProfile | null>(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const syncProfile = () => {
      const userProfile = getUserRoleProfile();
      setProfile(userProfile);
      setFullName(userProfile?.fullName ?? "");
    };

    syncProfile();
    window.addEventListener("storage", syncProfile);
    window.addEventListener("uniflow-role-profile-updated", syncProfile);

    return () => {
      window.removeEventListener("storage", syncProfile);
      window.removeEventListener("uniflow-role-profile-updated", syncProfile);
    };
  }, [pathname]);

  const handleLogout = () => {
    clearUserRoleProfile();
    router.push("/networking/mentors");
  };

  const navItems = profile
    ? profile.role === "student"
      ? studentNavItems
      : mentorNavItems
    : guestNavItems;

  const isCommonLanding =
    pathname === "/networking/mentors" || pathname === "/networking/mentors/start";
  const isMentorView = !isCommonLanding && profile?.role === "mentor";
  const isStudentView = !isCommonLanding && profile?.role === "student";

  const activeNavItems = isCommonLanding ? commonNavItems : navItems;

  const subLabel = isCommonLanding
    ? "Mentor Marketplace"
    : isMentorView
      ? "Mentor Hub"
      : "Student Learning Hub";

  const brandHref = isCommonLanding ? "/networking/mentors" : "/networking/mentors/home";

  const headerClass = "sticky top-0 z-40 border-b border-white/8 bg-[rgba(10,14,22,0.92)] backdrop-blur-xl";

  const logoClass = isMentorView
    ? "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-sm font-black text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)]"
    : "flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 text-sm font-black text-white shadow-[0_8px_20px_rgba(79,70,229,0.35)]";

  const navLinkClass = "text-sm font-medium text-[rgba(232,238,248,0.78)] transition-colors hover:text-[#00d2b4]";
  const navLinkActiveClass = "text-sm font-semibold text-[#00d2b4]";

  const nameChipClass = isMentorView
    ? "rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-[var(--brand-dark-text)]"
    : "rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-sm text-[var(--brand-dark-text)]";

  const titleClass = "text-sm font-semibold tracking-tight text-[#f0f4fb]";
  const subtitleClass = isMentorView
    ? "text-xs text-[rgba(168,184,208,0.85)]"
    : "text-xs text-[rgba(168,184,208,0.85)]";

  if (isCommonLanding) {
    return (
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(10,14,22,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/networking/mentors" className="inline-flex items-center gap-2.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#00d2b4] to-[#6366f1] text-[10px] font-black text-white">✦</span>
            <span className="text-sm font-bold tracking-tight text-white">UniFlow</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {[
              { label: "Explore", href: "/networking/mentors" },
              { label: "Pathways", href: "/networking/mentors#students" },
              { label: "Community", href: "/networking/mentors#mentors" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-[rgba(232,238,248,0.78)] transition-colors hover:text-[#00d2b4]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/networking/mentors/start"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[rgba(232,238,248,0.82)] transition hover:text-white"
            >
              Find a Mentor
            </Link>
            <Link
              href="/networking/mentors/start"
              className="inline-flex h-8 items-center rounded-lg bg-gradient-to-r from-[#00d2b4] to-[#6366f1] px-3.5 text-xs font-semibold text-white transition hover:opacity-90"
            >
              Join as Mentor
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const isNavActive = (href: string) => {
    if (href === "/networking/mentors/home") {
      return pathname === "/networking/mentors/home";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={brandHref} className="flex items-center gap-3">
          <div className={logoClass}>
            {isMentorView ? "MC" : "UF"}
          </div>
          <div>
            <p className={titleClass}>UniFlow Mentors</p>
            <p className={subtitleClass}>
              {subLabel}
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {activeNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={isNavActive(item.href) ? navLinkActiveClass : navLinkClass}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isStudentView ? (
            <>
              <Link
                href="/networking/mentors/mentor-discovery"
                className={mentorButtonClassName({ size: "sm" })}
              >
                Request Guidance
              </Link>
            </>
          ) : null}

          {isMentorView ? (
            <>
              <Link
                href="/networking/mentors/live-session"
                className={mentorButtonClassName({ size: "sm" })}
              >
                New Session
              </Link>
              <Link
                href="/networking/mentors/request-management"
                className={mentorButtonClassName({ variant: "secondary", size: "sm" })}
              >
                Request Queue
              </Link>
            </>
          ) : null}

          {profile ? (
            <>
              {fullName ? <span className={nameChipClass}>{fullName}</span> : null}
              <MentorButton
                onClick={handleLogout}
                variant="secondary"
                size="sm"
              >
                Logout
              </MentorButton>
            </>
          ) : (
            <Link
              href="/networking/mentors/start"
              className={mentorButtonClassName({ size: "sm" })}
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
