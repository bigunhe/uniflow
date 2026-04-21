import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type MentorButtonVariant = "primary" | "secondary" | "ghost";
type MentorButtonSize = "sm" | "md" | "lg";

type MentorButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: MentorButtonVariant;
  size?: MentorButtonSize;
};

export function mentorButtonClassName({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: MentorButtonVariant;
  size?: MentorButtonSize;
  className?: string;
}) {
  const variantStyles: Record<MentorButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-[#00d2b4] to-[#6366f1] text-white hover:opacity-90 focus-visible:ring-[#00d2b4]/50 shadow-[0_8px_24px_rgba(0,210,180,0.25)]",
    secondary:
      "bg-white/5 text-[var(--brand-dark-text)] border border-white/10 hover:bg-white/8 focus-visible:ring-[#00d2b4]/40",
    ghost:
      "bg-transparent text-[rgba(232,238,248,0.8)] hover:bg-white/5 hover:text-[#00d2b4] focus-visible:ring-[#00d2b4]/40",
  };

  const sizeStyles: Record<MentorButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return cn(
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080c14]",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );
}

export function MentorButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: MentorButtonProps) {
  return (
    <button
      className={mentorButtonClassName({ variant, size, className })}
      {...props}
    />
  );
}
