import { Metadata } from "next";
import { Servicios } from "@/components/home/Servicios";
import { getServices, getSiteSettings } from "@/lib/data";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Descubrí todos los servicios de cartelería y comunicación visual de Ideas Móviles.",
};

export default async function ServiciosPage() {
  const [services, settings] = await Promise.all([getServices(), getSiteSettings()]);
  const content = getContent(settings.content);

  return (
    <main className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-heading uppercase">
          {content.pageServiciosTitle}
        </h1>
        <p className="text-body text-lg max-w-2xl">{content.pageServiciosSubtitle}</p>
      </div>
      <Servicios services={services} content={content} showHeading={false} />
    </main>
  );
}
