"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AppShellSidebar } from "@/components/shared/layout/AppShellSidebar";
import { MentorBreadcrumbs } from "./_components/MentorBreadcrumbs";
import { MentorHeader } from "./_components/MentorHeader";
import { MentorRoleAccessBoundary } from "./_components/MentorRoleAccessBoundary";

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMentorsLanding = pathname === "/networking/mentors";
  const isMentorsStart = pathname === "/networking/mentors/start";

  const wrapperClass =
    "brand-dark-shell dash-root relative min-h-screen overflow-hidden bg-[#080c14] text-[var(--brand-dark-text)]";

  return (
    <div className={cn(wrapperClass)}>
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_12%,rgba(0,210,180,0.11),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(99,102,241,0.11),transparent_30%),radial-gradient(circle_at_48%_88%,rgba(0,210,180,0.06),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(0,210,180,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(0,210,180,0.35)_1px,transparent_1px)] [background-size:38px_38px]" />

      {isMentorsLanding ? (
        <div className="relative z-10 min-h-screen">
          <AppShellSidebar />
          <div className="relative flex min-h-screen flex-col md:ml-[240px] md:w-[calc(100vw-240px)]">
            <main className="relative z-10 w-full flex-1 overflow-y-auto px-0 pb-0 pt-0">
              <MentorBreadcrumbs />
              <MentorRoleAccessBoundary>{children}</MentorRoleAccessBoundary>
            </main>
          </div>
        </div>
      ) : isMentorsStart ? (
        <>
          <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-8 sm:px-6 lg:px-8">
            <MentorBreadcrumbs />
            <MentorRoleAccessBoundary>{children}</MentorRoleAccessBoundary>
          </main>
        </>
      ) : (
        <>
          <MentorHeader />
          <main
            className={cn(
              "relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
            )}
          >
            <MentorBreadcrumbs />
            <MentorRoleAccessBoundary>{children}</MentorRoleAccessBoundary>
          </main>
        </>
      )}
    </div>
  );
}
