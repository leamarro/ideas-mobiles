import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Service } from "@/types/service";
import { uploadImageProps } from "@/lib/upload-urls";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AccentText } from "@/components/ui/AccentText";
import { Container } from "@/components/ui/Section";

interface ServiciosProps {
  services: Service[];
  content: Record<string, string>;
  showHeading?: boolean;
}

const categoryLabels: Record<string, string> = {
  "carteles-letras": "Cartelería",
  "carteleria-comercial": "Cartelería comercial",
  "vinilos-esmerilados": "Vinilos y esmerilados",
  "grafica-vehicular": "Gráfica vehicular",
  "imprenta-digital": "Imprenta digital",
  "senalizacion": "Señalética",
};

export function Servicios({ services, content, showHeading = true }: ServiciosProps) {
  const publishedServices = services.filter((s) => s.published);

  if (publishedServices.length === 0) {
    return (
      <section id="servicios" className="bg-white py-20 md:py-28">
        <Container maxWidth="full">
          {showHeading && (
            <SectionHeading
              eyebrow={content.serviciosEyebrow}
              title={<AccentText text={content.serviciosTitle} />}
            />
          )}
          <p className="mx-auto max-w-xl text-center text-zinc-500">{content.serviciosEmpty}</p>
        </Container>
      </section>
    );
  }

  return (
    <section id="servicios" className="bg-white py-20 md:py-28">
      <Container maxWidth="full">
        {showHeading && (
          <SectionHeading
            eyebrow={content.serviciosEyebrow}
            title={<AccentText text={content.serviciosTitle} />}
            subtitle={content.serviciosSubtitle}
          />
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publishedServices.map((service, index) => (
            <Reveal key={service.id} delay={index * 60} className="h-full">
              <Link href="/servicios" className="block h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-card">
                  {service.image && (
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        {...uploadImageProps(service.image)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur-md">
                        {categoryLabels[service.category || ""] || service.category || "Servicio"}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-semibold uppercase leading-tight text-heading transition-colors duration-200 group-hover:text-brand-red-500">
                      {service.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-500">
                      {service.description}
                    </p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm font-semibold text-zinc-900">{content.serviciosCta}</span>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition-all duration-200 group-hover:border-brand-red-500 group-hover:bg-brand-red-500 group-hover:text-white">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
