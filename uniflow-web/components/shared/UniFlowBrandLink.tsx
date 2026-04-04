"use client";

import Link from "next/link";
import { Infinity as InfinityIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "dark" | "light";

type Props = {
  className?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
};

const layout = {
  sm: { box: "h-7 w-7 rounded-md", icon: 15, text: "text-[15px]" },
  md: { box: "h-8 w-8 rounded-lg", icon: 17, text: "text-[17px]" },
  lg: { box: "h-[30px] w-[30px] rounded-lg", icon: 17, text: "text-base" },
} as const;

export function UniFlowBrandLink({
  className,
  variant = "dark",
  size = "md",
  showWordmark = true,
}: Props) {
  const s = layout[size];
  const isDark = variant === "dark";

  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 items-center gap-2.5 no-underline", className)}
      aria-label="UniFlow home"
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center bg-gradient-to-br from-[#00d2b4] to-[#6366f1]",
          s.box
        )}
      >
        <InfinityIcon
          className="text-white"
          size={s.icon}
          strokeWidth={2.35}
          aria-hidden
        />
      </span>
      {showWordmark ? (
        <span
          className={cn(
            "font-semibold tracking-tight",
            s.text,
            isDark ? "text-white" : "text-slate-900"
          )}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Uni<span className="text-[#00d2b4]">Flow</span>
        </span>
      ) : null}
    </Link>
  );
}
