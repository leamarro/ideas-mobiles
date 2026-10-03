import Image from "next/image";
import { Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

interface NosotrosProps {
  slogan?: string;
}

export function Nosotros({ slogan }: NosotrosProps) {
  return (
    <section id="nosotros" className="bg-white py-20 md:py-28">
      <Container maxWidth="full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Nosotros"
              title="Quiénes somos"
              align="left"
            />
            <Reveal>
              <p className="mb-6 text-lg leading-relaxed text-zinc-600">
                Somos un equipo apasionado por la comunicación visual y la cartelería.
                Cada proyecto es una oportunidad para crear algo que impacte.
              </p>
              <blockquote className="relative rounded-2xl border-l-4 border-brand-red-500 bg-zinc-50 px-7 py-6">
                <p className="font-display text-xl font-medium leading-snug text-zinc-800 md:text-2xl">
                  {slogan || '"Nuestra propuesta, es ayudarte a alcanzar tu objetivo…\nNuestro objetivo, es ayudarte a alcanzar el tuyo…!"'}
                </p>
              </blockquote>
              <p className="mt-6 text-xs text-zinc-400">
                Este contenido es provisional. Puede actualizarse desde el panel de administración.
              </p>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-zinc-950 shadow-pop">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-red-500/25 blur-3xl" />
              <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-brand-red-600/15 blur-3xl" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
                aria-hidden="true"
              />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="animate-float-y rounded-2xl bg-white p-6 shadow-pop">
                  <div className="relative h-12 w-44 md:w-48">
                    <Image
                      src="/images/logo.webp"
                      alt="Ideas Móviles"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                </div>
              </div>
              <span className="absolute bottom-5 left-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">
                Imagen y Comunicación
              </span>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
