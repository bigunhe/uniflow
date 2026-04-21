"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { UniFlowBrandLink } from "@/components/shared/UniFlowBrandLink";

type UserRow = {
  display_name: string | null;
  username: string | null;
  job_role: string | null;
  avatar_url?: string | null;
};

function profileInitials(displayName: string | undefined | null, username: string | undefined | null) {
  const n = (displayName || "").trim();
  if (n.length >= 2) return n.slice(0, 2).toUpperCase();
  if (n.length === 1) return n.toUpperCase();
  const u = (username || "").replace(/[^a-z0-9]/gi, "");
  return u.slice(0, 2).toUpperCase() || "?";
}

function resolveActiveNavId(pathname: string): string {
  if (pathname === "/dashboard") return "dashboard";
  if (pathname.startsWith("/learning") || pathname === "/sync") return "sync";
  if (pathname.startsWith("/projects/completed")) return "evidence";
  if (pathname.startsWith("/projects")) return "projects";
  if (pathname.startsWith("/networking")) return "networking";
  if (pathname.startsWith("/portfolio")) return "portfolio";
  if (pathname.startsWith("/pulse-details")) return "pulse";
  if (pathname.startsWith("/p")) return "profile";
  return "dashboard";
}

const NAV_ITEMS = [
  { id: "dashboard", icon: "⚡", label: "Dashboard", href: "/dashboard", hasChildren: false as const },
  { id: "sync", icon: "📚", label: "Learning", href: "/learning", hasChildren: true as const },
  { id: "projects", icon: "🛠️", label: "Projects", href: "/projects", hasChildren: false as const },
  { id: "networking", icon: "🌐", label: "Community", href: "/networking", hasChildren: false as const },
  { id: "portfolio", icon: "🔗", label: "My portfolio", href: "/portfolio", hasChildren: false as const },
  { id: "evidence", icon: "📁", label: "Project verification", href: "/projects/completed", hasChildren: false as const },
  { id: "pulse", icon: "📊", label: "Pulse Details", href: "/pulse-details", hasChildren: false as const },
  { id: "profile", icon: "👤", label: "Profile", href: "/p", hasChildren: false as const },
];

const LEARNING_SUB = [
  { id: "module-insights", label: "Module Insights", href: "/learning" },
  { id: "sync-files", label: "Sync Files", href: "/sync" },
];

/**
 * Same shell navigation as the main dashboard (app/(bewan dashboard)/dashboard/page.tsx),
 * for routes that need the global sidebar without duplicating markup.
 */
export function AppShellSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const activeNav = resolveActiveNavId(pathname);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedNav, setExpandedNav] = useState<string | null>(() =>
    activeNav === "sync" ? "sync" : null
  );
  const [profile, setProfile] = useState<UserRow | null>(null);

  useEffect(() => {
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("user_data")
        .select("display_name,username,job_role,avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (data) setProfile(data as UserRow);
    })();
  }, [supabase]);

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
  }, [router, supabase]);

  const navigate = useCallback(
    (href: string) => {
      setSidebarOpen(false);
      if (pathname === href) return;
      router.replace(href);
    },
    [pathname, router]
  );

  return (
    <>
      <style>{`
        .app-shell-sidebar .nav-item-row{display:flex;align-items:center;border-radius:10px;margin-bottom:2px;overflow:hidden;}
        .app-shell-sidebar .nav-chevron{width:24px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,.25);font-size:10px;flex-shrink:0;transition:color .18s,transform .18s;border-left:1px solid rgba(255,255,255,.06);}
        .app-shell-sidebar .nav-chevron:hover{color:rgba(255,255,255,.6);}
        .app-shell-sidebar .nav-chevron.open{transform:rotate(90deg);color:rgba(0,210,180,.6);}
        .app-shell-sidebar .nav-sub{overflow:hidden;max-height:0;transition:max-height .25s ease;}
        .app-shell-sidebar .nav-sub.open{max-height:200px;}
        .app-shell-sidebar .nav-sub-item{display:flex;align-items:center;gap:10px;padding:7px 12px 7px 44px;font-size:13px;color:rgba(255,255,255,.35);cursor:pointer;border-radius:8px;transition:all .15s;margin-bottom:1px;border:none;background:transparent;width:100%;text-align:left;font-family:inherit;}
        .app-shell-sidebar .nav-sub-item:hover{background:rgba(255,255,255,.04);color:rgba(255,255,255,.65);}
        .app-shell-sidebar .nav-sub-item.active{color:#00d2b4;background:rgba(0,210,180,.07);}
        .app-shell-sidebar .nav-sub-dot{width:5px;height:5px;border-radius:50%;background:currentColor;flex-shrink:0;opacity:.6;}
      `}</style>

      {sidebarOpen ? (
        <button
          type="button"
          className="app-shell-sidebar-overlay fixed inset-0 z-[9] bg-[rgba(9,18,39,0.22)] md:hidden"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <button
        type="button"
        className="fixed left-4 top-4 z-[20] flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/12 bg-white/8 text-lg text-[#e8eef8] md:hidden"
        aria-label="Open menu"
        onClick={() => setSidebarOpen((o) => !o)}
      >
        ☰
      </button>

      <aside
        className={cn(
          "app-shell-sidebar fixed left-0 top-0 z-10 flex h-screen w-[240px] shrink-0 flex-col border-r border-white/8 bg-[rgba(10,14,22,0.92)] px-4 py-7 backdrop-blur-[12px] transition-transform duration-300 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <UniFlowBrandLink variant="dark" size="md" className="mb-10 px-2" />

        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/38">Menu</div>

        <nav className="flex flex-1 flex-col overflow-y-auto">
          {NAV_ITEMS.map((n) => (
            <div key={n.id}>
              <div className="nav-item-row">
                <button
                  type="button"
                  className={cn(
                    "flex flex-1 items-center gap-3 rounded-l-[10px] border border-transparent px-3 py-2.5 text-left text-sm transition-all",
                    n.hasChildren ? "rounded-r-none" : "rounded-[10px]",
                    activeNav === n.id
                      ? "border-[rgba(0,210,180,0.2)] bg-[rgba(0,210,180,0.1)] text-[#00d2b4]"
                      : "text-white/62 hover:bg-white/6 hover:text-white"
                  )}
                  onClick={() => navigate(n.href)}
                >
                  <span className="w-5 text-center text-[15px]">{n.icon}</span>
                  <span>{n.label}</span>
                </button>
                {n.hasChildren ? (
                  <button
                    type="button"
                    className={cn(
                      "nav-chevron rounded-r-[10px] border-l border-white/6",
                      expandedNav === n.id ? "open" : "",
                      activeNav === n.id ? "bg-[rgba(0,210,180,0.1)]" : ""
                    )}
                    aria-label="Toggle Learning submenu"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedNav((prev) => (prev === n.id ? null : n.id));
                    }}
                  >
                    ›
                  </button>
                ) : null}
              </div>

              {n.hasChildren ? (
                <div className={cn("nav-sub", expandedNav === n.id ? "open" : "")}>
                  {LEARNING_SUB.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      className={cn("nav-sub-item", pathname === sub.href ? "active" : "")}
                      onClick={() => navigate(sub.href)}
                    >
                      <span className="nav-sub-dot" />
                      {sub.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/8 pt-4">
          <Link
            href="/p"
            onClick={() => setSidebarOpen(false)}
            className="mb-2 flex w-full items-center gap-2.5 rounded-lg border border-white/8 bg-transparent p-2.5 text-left transition hover:border-[rgba(0,210,180,0.2)] hover:bg-[rgba(0,210,180,0.08)]"
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1a2030] text-[11px] font-bold text-white/72">
              {profile?.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              ) : (
                profileInitials(profile?.display_name, profile?.username)
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13px] font-semibold text-[#e8eef8]">
                {profile?.display_name || "Profile"}
              </div>
              <div className="truncate text-[11px] text-[rgba(168,184,208,0.85)]">{profile?.job_role || "Student"}</div>
            </div>
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-[10px] border-none bg-transparent py-2.5 pl-3 text-left text-[13px] text-white/55 transition hover:bg-[rgba(239,68,68,0.08)] hover:text-red-400"
            onClick={() => void handleSignOut()}
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
