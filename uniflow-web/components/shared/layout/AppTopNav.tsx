"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRole } from "@/models/user";
import { signOut } from "@/services/auth";

type AppTopNavProps = {
  role: UserRole;
};

export function AppTopNav({ role }: AppTopNavProps) {
  const router = useRouter();

  const links =
    role === "mentor"
      ? [
          { href: "/mentor/dashboard", label: "Dashboard" },
          { href: "/mentor/requests", label: "Requests" },
          { href: "/mentor/history", label: "History" },
          { href: "/mentor/analytics", label: "Analytics" },
        ]
      : [
          { href: "/student/dashboard", label: "Dashboard" },
          { href: "/student/ask-ai", label: "Ask AI" },
          { href: "/student/request", label: "Request" },
          { href: "/student/history", label: "History" },
        ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="text-sm font-black uppercase tracking-wide text-teal-500">
          UniFlow
        </Link>
        <nav className="hidden items-center gap-4 md:flex">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-slate-400 hover:text-slate-200"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="rounded-lg border border-slate-700 text-slate-300 px-3 py-1.5 text-sm font-semibold hover:bg-slate-800"
          onClick={async () => {
            await signOut();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
