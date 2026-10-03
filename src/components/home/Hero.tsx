"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
}

const collage = [
  { src: "/images/portfolio/portfolio-referencia-01.webp", rotate: "-rotate-2" },
  { src: "/images/portfolio/portfolio-referencia-04.webp", rotate: "rotate-2" },
  { src: "/images/portfolio/portfolio-referencia-10.webp", rotate: "rotate-1" },
  { src: "/images/portfolio/portfolio-referencia-11.webp", rotate: "-rotate-1" },
];

export function Hero({
  subtitle = "Cartelería y comunicación visual profesional",
  text = "Diseño y producción de cartelería, señalética, vinilos y gráfica publicitaria. Convertimos tu idea en impacto visual.",
  buttonText = "Cotizar ahora",
  buttonLink = "/contacto",
}: HeroProps) {
  return (
    <section className="relative flex min-h-[92svh] w-full items-center overflow-hidden bg-zinc-950">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero.webp"
          alt=""
          fill
          priority
          className="scale-125 object-cover opacity-70 blur-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/75 via-zinc-950/60 to-zinc-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgb(9_9_11/0.75)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <span
              className="animate-slide-up inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-200 backdrop-blur-md"
              style={{ animationDelay: "0ms" }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-red-500" />
              {subtitle}
            </span>

            <h1
              className="animate-slide-up mt-6 font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[5.5rem]"
              style={{ animationDelay: "80ms" }}
            >
              Tu imagen en
              <br />
              <span className="text-brand-red-500">movimiento.</span>
            </h1>

            <p
              className="animate-slide-up mt-6 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              {text}
            </p>

            <div
              className="animate-slide-up mt-9 flex flex-col gap-4 sm:flex-row"
              style={{ animationDelay: "240ms" }}
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
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Ver trabajos
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div
              className="animate-slide-up grid grid-cols-2 gap-3 md:gap-4"
              style={{ animationDelay: "320ms" }}
            >
              {collage.map((item, i) => (
                <div key={item.src} className={item.rotate}>
                  <div
                    className={`relative aspect-[3/2] overflow-hidden rounded-2xl border border-white/10 shadow-pop ${
                      i % 2 === 0 ? "animate-float-y" : ""
                    }`}
                    style={{ animationDelay: `${i * 600}ms` }}
                  >
                    <Image
                      src={item.src}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 45vw, 22vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
        aria-hidden="true"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
          <span className="h-2 w-1 animate-bounce rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}
