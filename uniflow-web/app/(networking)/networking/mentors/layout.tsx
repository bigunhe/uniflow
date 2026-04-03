"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MentorBreadcrumbs } from "./_components/MentorBreadcrumbs";
import { MentorFooter } from "./_components/MentorFooter";
import { MentorHeader } from "./_components/MentorHeader";
import { MentorRoleAccessBoundary } from "./_components/MentorRoleAccessBoundary";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function MentorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCommonLanding =
    pathname === "/networking/mentors" || pathname === "/networking/mentors/start";

  const wrapperClass = isCommonLanding
    ? "relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef4ff_0%,#f7fbff_40%,#f2f6fb_100%)] text-slate-900"
    : "relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f8faff_45%,#f3f6fb_100%)] text-slate-900";

  return (
    <div className={cn(jakarta.className, wrapperClass)}>
      {isCommonLanding ? (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-55 [background-image:radial-gradient(circle_at_22%_12%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_80%_18%,rgba(96,165,250,0.14),transparent_28%),radial-gradient(circle_at_50%_92%,rgba(34,197,94,0.1),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(15,23,42,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.25)_1px,transparent_1px)] [background-size:36px_36px]" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_18%_14%,rgba(79,70,229,0.16),transparent_30%),radial-gradient(circle_at_82%_22%,rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_52%_90%,rgba(148,163,184,0.18),transparent_32%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(30,41,59,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(30,41,59,0.2)_1px,transparent_1px)] [background-size:36px_36px]" />
        </>
      )}
      <MentorHeader />
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <MentorBreadcrumbs />
        <MentorRoleAccessBoundary>{children}</MentorRoleAccessBoundary>
      </main>
      <MentorFooter />
    </div>
  );
}
