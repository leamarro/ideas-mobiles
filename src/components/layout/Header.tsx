"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "INICIO", href: "/" },
  { label: "PORTFOLIO", href: "/trabajos" },
  { label: "NOSOTROS", href: "/nosotros" },
  { label: "SERVICIOS", href: "/servicios" },
  { label: "CONTACTO", href: "/contacto" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/75 backdrop-blur-xl transition-all duration-300",
        scrolled
          ? "border-black/5 shadow-soft"
          : "border-transparent"
      )}
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between md:h-24">
          <Link href="/" className="flex items-center" aria-label="Ideas Móviles - Inicio">
            <div className="relative h-16 w-52 md:h-20 lg:w-72">
              <Image
                src="/images/logo.png"
                alt="Ideas Móviles"
                fill
                sizes="(max-width: 1023px) 208px, 288px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          <span className="hidden max-w-[280px] text-center text-[11px] font-medium uppercase leading-relaxed tracking-wider text-zinc-500 xl:block">
            Cartelería integral para empresas, comercios y particulares.
          </span>

          <nav className="hidden items-center gap-6 xl:gap-7 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative inline-flex py-2 text-[13px] font-semibold uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-950"
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 h-0.5 bg-brand-red-500 transition-all duration-300 group-hover:w-full",
                      isActive ? "w-full" : "w-0"
                    )}
                  />
                </Link>
              );
            })}
            <Link
              href="/contacto"
              className="rounded-full bg-brand-red-500 px-5 py-2.5 text-[13px] font-semibold text-white shadow-glow-red transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-500 focus-visible:ring-offset-2"
            >
              Cotizar
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-full text-zinc-900 transition-colors hover:bg-zinc-100 md:hidden"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="animate-slide-up border-t border-black/5 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex animate-slide-up items-center justify-between rounded-xl px-4 py-3.5 text-sm font-semibold uppercase tracking-wider text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {link.label}
                <ChevronRight className="h-4 w-4 text-zinc-500" />
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setMenuOpen(false)}
              className="mt-3 block rounded-xl bg-brand-red-500 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-glow-red transition-colors hover:bg-brand-red-600"
            >
              Cotizar ahora
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
