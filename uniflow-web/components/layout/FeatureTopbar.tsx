"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, ArrowLeft, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { UniFlowBrandLink } from "@/components/shared/UniFlowBrandLink";

type NavItem = {
  label: string;
  href: string;
};

const FEATURE_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Learning Hub", href: "/learning" },
  { label: "Projects", href: "/projects" },
  { label: "Sync Files", href: "/sync" },
  { label: "Community", href: "/networking" },
  { label: "Submit Evidence", href: "/evidance" },
  { label: "Profile", href: "/profile-setup" },
];

type FeatureTopbarProps = {
  backHref: string;
  backLabel?: string;
  title?: string;
  rightSlot?: ReactNode;
};

export function FeatureTopbar({
  backHref,
  backLabel = "Back",
  title,
  rightSlot,
}: FeatureTopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBack = () => {
    // Always honor explicit back destination to keep section navigation predictable.
    router.replace(backHref);
  };

  const navigateTo = (href: string) => {
    setMenuOpen(false);
    if (href === pathname) return;
    router.push(href);
  };

  return (
    <div className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <UniFlowBrandLink variant="dark" size="sm" className="mr-1" />
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1.5 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{backLabel}</span>
        </button>

        {title && (
          <span className="ml-1 text-sm font-medium text-white/70">{title}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {rightSlot}

        <Dialog open={menuOpen} onOpenChange={setMenuOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Open navigation menu"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/65 transition-colors hover:border-white/25 hover:text-white"
            >
              <Menu className="h-4 w-4" />
            </button>
          </DialogTrigger>
          <DialogContent
            className="left-0 top-0 h-screen w-[84vw] max-w-[320px] translate-x-0 translate-y-0 rounded-none border-r border-white/10 bg-[#0b111b] p-0 sm:rounded-none"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="text-xs uppercase tracking-widest text-white/45">
                  UniFlow Menu
                </div>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/50 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <nav className="flex-1 px-3 py-3">
                <div className="space-y-1">
                  {FEATURE_NAV_ITEMS.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <button
                        key={item.href}
                        type="button"
                        onClick={() => navigateTo(item.href)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          active
                            ? "bg-[#00d2b4]/12 text-[#00d2b4]"
                            : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </nav>

              <div className="border-t border-white/10 px-4 py-3">
                <Link
                  href="/"
                  className="text-xs text-white/35 transition-colors hover:text-white/65"
                >
                  Go to public hub
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
