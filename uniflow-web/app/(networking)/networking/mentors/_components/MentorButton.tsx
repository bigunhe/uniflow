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
      "bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-500 shadow-sm",
    secondary:
      "bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 focus-visible:ring-slate-400",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",
  };

  const sizeStyles: Record<MentorButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return cn(
    "inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
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
