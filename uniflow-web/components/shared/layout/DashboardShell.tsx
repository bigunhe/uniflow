import { ReactNode } from "react";
import { UserRole } from "@/models/user";
import { AppTopNav } from "@/components/shared/layout/AppTopNav";

type DashboardShellProps = {
  role: UserRole;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export function DashboardShell({ role, title, subtitle, children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AppTopNav role={role} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
        </section>
        {children}
      </main>
    </div>
  );
}
