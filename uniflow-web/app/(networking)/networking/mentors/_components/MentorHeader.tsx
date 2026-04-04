"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UniFlowBrandLink } from "@/components/shared/UniFlowBrandLink";
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

  const headerClass = isMentorView
    ? "sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur-xl"
    : "sticky top-0 z-40 border-b border-slate-200 bg-white/92 backdrop-blur-xl";

const navLinkClass = "text-sm font-medium text-slate-600 transition-colors hover:text-indigo-600";
  const navLinkActiveClass = "text-sm font-semibold text-indigo-700";

  const nameChipClass = isMentorView
    ? "rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-sm text-indigo-700"
    : "rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-sm text-indigo-700";

  const titleClass = "text-sm font-semibold tracking-tight text-slate-900";
  const subtitleClass = isMentorView
    ? "text-xs text-slate-500"
    : "text-xs text-slate-500";

  if (isCommonLanding) {
    return (
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <UniFlowBrandLink variant="light" size="sm" />

          <nav className="hidden items-center gap-6 md:flex">
            {[
              { label: "Explore", href: "/networking/mentors" },
              { label: "Pathways", href: "/networking/mentors#students" },
              { label: "Community", href: "/networking/mentors#mentors" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              href="/networking/mentors/start"
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:text-slate-950"
            >
              Find a Mentor
            </Link>
            <Link
              href="/networking/mentors/start"
              className="inline-flex h-8 items-center rounded-lg bg-indigo-600 px-3.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
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
        <div className="flex items-center gap-3">
          <UniFlowBrandLink variant="light" size="sm" />
          <div>
            <p className={titleClass}>UniFlow Mentors</p>
            <p className={subtitleClass}>
              {subLabel}
            </p>
          </div>
        </div>

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
