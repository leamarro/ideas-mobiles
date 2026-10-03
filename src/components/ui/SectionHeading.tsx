import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  dark = false,
  className,
}: SectionHeadingProps) {
  const isCenter = align === "center";

  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        isCenter && "text-center",
        className
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] mb-5",
          dark
            ? "border-white/15 bg-white/5 text-zinc-300"
            : "border-zinc-200 bg-zinc-50 text-zinc-500"
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-brand-red-500" />
        {eyebrow}
      </span>
      <h2
        className={cn(
          "font-display font-bold text-3xl md:text-4xl lg:text-5xl uppercase leading-[1.05] tracking-tight",
          dark ? "text-white" : "text-zinc-950"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base md:text-lg max-w-2xl",
            isCenter && "mx-auto",
            dark ? "text-zinc-400" : "text-zinc-500"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
