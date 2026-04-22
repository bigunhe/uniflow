"use client";

import { cn } from "@/lib/utils";
import { AppShellSidebar } from "@/components/shared/layout/AppShellSidebar";

export default function AlumniNetworkLayout({ children }: { children: React.ReactNode }) {
  const wrapperClass =
    "brand-dark-shell dash-root relative min-h-screen overflow-hidden bg-[#080c14] text-[var(--brand-dark-text)]";

  return (
    <div className={cn(wrapperClass)}>
      <div className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_18%_12%,rgba(0,210,180,0.11),transparent_28%),radial-gradient(circle_at_82%_20%,rgba(99,102,241,0.11),transparent_30%),radial-gradient(circle_at_48%_88%,rgba(0,210,180,0.06),transparent_32%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(0,210,180,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(0,210,180,0.35)_1px,transparent_1px)] [background-size:38px_38px]" />

      <div className="relative z-10 flex min-h-screen">
        <AppShellSidebar />
        <div className="flex min-h-screen flex-1 flex-col md:ml-[240px]">
          <main className="relative z-10 w-full flex-1 px-4 pb-8 pt-20 sm:px-6 md:px-8 md:pt-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
