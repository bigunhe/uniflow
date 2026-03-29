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
      "bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-500 hover:to-blue-500 focus-visible:ring-indigo-400 shadow-[0_8px_24px_rgba(79,70,229,0.35)]",
    secondary:
      "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 focus-visible:ring-indigo-300",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-indigo-600 focus-visible:ring-indigo-300",
  };

  const sizeStyles: Record<MentorButtonSize, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 text-sm",
    lg: "h-12 px-5 text-base",
  };

  return cn(
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
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
