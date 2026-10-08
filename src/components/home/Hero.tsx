"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";

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
    <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
      <span
        className="animate-slide-up inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-1.5 text-center text-[9px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-zinc-200 backdrop-blur-md sm:text-[10px]"
        style={{ animationDelay: "0ms" }}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red-500" />
        {subtitle}
      </span>

      <p
        className="animate-slide-up max-w-xl text-xs leading-relaxed text-zinc-300 sm:text-sm lg:max-w-md"
        style={{ animationDelay: "80ms" }}
      >
        {text}
      </p>
    </div>
  );

  const buttons = (
    <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-4 lg:w-64 lg:flex-col lg:gap-3">
      <a
        href={buttonLink}
        className="animate-slide-up group inline-flex items-center justify-center gap-2 rounded-full bg-brand-red-500 px-6 py-3.5 text-sm font-semibold text-white shadow-glow-red transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-8"
        style={{ animationDelay: "160ms" }}
      >
        {buttonText}
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
      </a>
      <a
        href="/trabajos"
        className="animate-slide-up group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:px-8"
        style={{ animationDelay: "240ms" }}
      >
        Ver trabajos
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
          className="absolute inset-0 bg-[linear-gradient(to_top,#000_0%,rgba(0,0,0,0.82)_12%,rgba(0,0,0,0.55)_30%,rgba(0,0,0,0.28)_45%,rgba(0,0,0,0)_65%)]"
          aria-hidden="true"
        />

        <div className="absolute bottom-[10%] left-[8%] hidden w-[min(46%,560px)] flex-col items-start gap-5 lg:flex">
          {phrases}
          {buttons}
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-7 px-5 pb-14 pt-8 lg:hidden">
        {phrases}
        {buttons}
      </div>
    </section>
  );
}
