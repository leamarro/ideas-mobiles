"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { uploadImageProps } from "@/lib/upload-urls";

const DEFAULT_HERO_IMAGE = "/images/imagen-fondo2.png";

interface HeroProps {
  subtitle?: string;
  text?: string;
  buttonText?: string;
  buttonLink?: string;
  image?: string | null;
}

export function Hero({
  subtitle = "Cartelería y comunicación visual profesional",
  text = "Diseño y producción de cartelería, señalética, vinilos y gráfica publicitaria. Convertimos tu idea en impacto visual.",
  buttonText = "Cotizar ahora",
  buttonLink = "/contacto",
  image,
}: HeroProps) {
  const src = (image ?? DEFAULT_HERO_IMAGE).trim();
  const hasImage = src.length > 0;
  const imgProps = uploadImageProps(src);
  const isDefault = src === DEFAULT_HERO_IMAGE;

  return (
    <section className="relative flex min-h-[92svh] md:min-h-[65svh] w-full flex-col justify-center overflow-hidden bg-zinc-950">
      <h1 className="sr-only">Ideas Móviles — Imagen y Comunicación</h1>
      {hasImage && (
        <div className="absolute inset-0 hidden md:block" aria-hidden="true">
          <Image
            src={src}
            alt=""
            fill
            loading="eager"
            sizes="100vw"
            className="scale-110 object-cover blur-2xl opacity-70"
            {...imgProps}
          />
          <div className="absolute inset-0 bg-zinc-950/55" />
        </div>
      )}

      <div className="absolute inset-0 overflow-hidden md:relative md:aspect-[1743/786] md:w-full">
        {hasImage &&
          (isDefault ? (
            <Image
              src={src}
              alt=""
              width={1743}
              height={902}
              priority
              sizes="100vw"
              className="absolute inset-0 h-full w-full object-cover md:bottom-auto md:top-[-11.111%] md:h-[111.111%] md:object-fill"
              {...imgProps}
            />
          ) : (
            <Image
              src={src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              {...imgProps}
            />
          ))}
        <div
          className="absolute inset-0 bg-[linear-gradient(to_top_right,rgb(9_9_11/0.92)_0%,rgb(9_9_11/0.7)_28%,rgb(9_9_11/0.3)_55%,transparent_78%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-zinc-950/50 via-transparent to-zinc-950/20"
          aria-hidden="true"
        />

        <div className="absolute inset-0 z-10 flex flex-col justify-end px-4 pb-[9%] pt-32 sm:px-6 lg:px-10 lg:pb-[8%]">
          <span
            className="animate-slide-up mb-4 inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-1.5 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-zinc-200 backdrop-blur-md"
            style={{ animationDelay: "0ms" }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red-500" />
            {subtitle}
          </span>

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
