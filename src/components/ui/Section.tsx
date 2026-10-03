import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
}

export function Section({ id, className, children, padding = "lg" }: SectionProps) {
  const paddingClasses = {
    sm: "py-12 md:py-16",
    md: "py-16 md:py-20",
    lg: "py-20 md:py-28 lg:py-32",
  };

  return (
    <section id={id} className={cn("w-full bg-white", paddingClasses[padding], className)}>
      {children}
    </section>
  );
}

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "md" | "lg" | "xl" | "full";
}

export function Container({ children, className, maxWidth = "lg" }: ContainerProps) {
  const maxWidthClasses = {
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-[1400px]",
  };

  return (
    <div className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", maxWidthClasses[maxWidth], className)}>
      {children}
    </div>
  );
}
