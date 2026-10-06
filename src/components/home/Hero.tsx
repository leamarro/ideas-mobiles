"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  text?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function Hero({
  text = "Diseño y producción de cartelería, señalética, vinilos y gráfica publicitaria. Convertimos tu idea en impacto visual.",
  buttonText = "Cotizar ahora",
  buttonLink = "/contacto",
}: HeroProps) {
  return (
    <section className="relative flex min-h-[92svh] md:min-h-[65svh] w-full flex-col justify-center overflow-hidden bg-zinc-950">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/imagen-fondo2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover blur-2xl opacity-70"
        />
        <div className="absolute inset-0 bg-zinc-950/55" />
      </div>

      <div className="absolute inset-0 md:relative md:aspect-[1743/760] md:w-full">
        <Image
          src="/images/imagen-fondo2.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_100%]"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_top_right,rgb(9_9_11/0.92)_0%,rgb(9_9_11/0.7)_28%,rgb(9_9_11/0.3)_55%,transparent_78%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-zinc-950/20"
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 pb-[9%] pt-32 sm:px-6 lg:px-10 lg:pb-[8%]">
          <p
            className="animate-slide-up max-w-md text-sm leading-relaxed text-zinc-300 sm:max-w-lg sm:text-base md:text-lg"
            style={{ animationDelay: "80ms" }}
          >
            {text}
          </p>

          <div
            className="animate-slide-up mt-6 flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{ animationDelay: "160ms" }}
          >
            <a
              href={buttonLink}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-red-500 px-7 py-3.5 text-sm font-semibold text-white shadow-glow-red transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              {buttonText}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="/trabajos"
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-zinc-950/40 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-white/50 hover:bg-zinc-950/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Ver trabajos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
