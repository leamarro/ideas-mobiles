import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-brand-red-500 text-white shadow-glow-red hover:bg-brand-red-600 hover:-translate-y-0.5",
    secondary:
      "border border-zinc-300 bg-white text-zinc-900 hover:border-zinc-400 hover:shadow-soft",
    ghost: "text-zinc-600 hover:text-brand-red-500 hover:bg-zinc-100",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-3.5 text-base",
  };

  if (asChild) {
    const child = children as React.ReactElement;
    return (
      <div className={cn(baseStyles, variants[variant], sizes[size], className)}>
        {child}
      </div>
    );
  }

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
