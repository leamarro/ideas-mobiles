"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  subtitle?: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function Hero({
  subtitle = "Cartelería y comunicación visual profesional",
  text = "Diseño y producción de cartelería, señalética, vinilos y gráfica publicitaria. Convertimos tu idea en impacto visual.",
  buttonText = "Cotizar ahora",
  buttonLink = "/contacto",
}: HeroProps) {
  const phrases = (
    <div className="flex flex-col items-center gap-3">
      <span
        className="animate-slide-up inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-1.5 text-center text-[9px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-zinc-200 backdrop-blur-md sm:text-[10px]"
        style={{ animationDelay: "0ms" }}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red-500" />
        {subtitle}
      </span>

      <p
        className="animate-slide-up max-w-2xl text-xs leading-relaxed text-zinc-300 sm:text-sm"
        style={{ animationDelay: "80ms" }}
      >
        {text}
      </p>
    </div>
  );

  const buttons = (
    <div className="flex flex-col items-center gap-3 lg:items-start">
      <a
        href={buttonLink}
        className="animate-slide-up group inline-flex items-center justify-center gap-2 rounded-full bg-brand-red-500 px-6 py-3 text-xs font-semibold text-white shadow-glow-red transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-7 sm:py-3.5 sm:text-sm"
        style={{ animationDelay: "160ms" }}
      >
        {buttonText}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </a>
      <a
        href="/trabajos"
        className="animate-slide-up inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-6 py-3 text-xs font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-white/50 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-7 sm:py-3.5 sm:text-sm"
        style={{ animationDelay: "240ms" }}
      >
        Ver trabajos
      </a>
    </div>
  );

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <h1 className="sr-only">Tus ideas en movimiento</h1>

      <div className="relative aspect-[1280/699] w-full">
        <Image
          src="/images/imgagenpc.jpg"
          alt="Ideas Móviles - Sitio web en pantalla de escritorio"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover"
        />

        <div
          className="absolute inset-0 bg-[linear-gradient(to_top,#000_0%,rgba(0,0,0,0.72)_10%,rgba(0,0,0,0.46)_25%,rgba(0,0,0,0.2)_40%,rgba(0,0,0,0)_55%)]"
          aria-hidden="true"
        />

        <div className="absolute inset-0 hidden lg:block">
          <div className="absolute bottom-[12%] left-[13%]">{buttons}</div>
          <div className="absolute bottom-[9%] left-1/2 w-[38%] -translate-x-1/2">
            {phrases}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 px-5 pb-14 pt-8 lg:hidden">
        {phrases}
        {buttons}
      </div>
    </section>
  );
}
