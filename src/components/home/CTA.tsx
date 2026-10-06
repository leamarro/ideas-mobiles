import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { CONTACT_PLACEHOLDERS } from "@/lib/constants";
import { Reveal } from "@/components/ui/Reveal";

interface CTAProps {
  title?: ReactNode;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function CTA({
  title = (
    <>
      ¿Listo para tu <span className="text-brand-red-500">próximo proyecto</span>?
    </>
  ),
  subtitle = "Hablemos. Cotizá sin compromiso y empezá a convertir tu idea en realidad.",
  buttonText = "Contactar por WhatsApp",
  buttonLink = `https://wa.me/${CONTACT_PLACEHOLDERS.whatsapp.replace(/\D/g, "")}`,
}: CTAProps) {
  return (
    <section id="cta" className="relative overflow-hidden bg-zinc-950 py-20 md:py-28">
      <div
        className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-brand-red-500/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-brand-red-600/15 blur-[100px]"
        aria-hidden="true"
      />

      <Container maxWidth="full">
        <Reveal>
          <div className="relative mx-auto max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-300 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red-500" />
            Empezá hoy
          </span>
          <h2 className="font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white md:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-base text-zinc-400 md:text-lg">{subtitle}</p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-red-500 px-7 py-3.5 text-sm font-semibold text-white shadow-glow-red transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              {buttonText}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="/contacto"
              className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              Ver servicios
            </a>
          </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
