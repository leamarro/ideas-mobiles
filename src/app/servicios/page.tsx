import { Metadata } from "next";
import { Servicios } from "@/components/home/Servicios";
import { getServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Descubrí todos los servicios de cartelería y comunicación visual de Ideas Móviles.",
};

export default async function ServiciosPage() {
  const services = await getServices();

  return (
    <main className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-brand-black uppercase">
          Nuestros Servicios
        </h1>
        <p className="text-brand-dark text-lg max-w-2xl">
          Soluciones integrales de cartelería y comunicación visual.
          Cada proyecto se adapta a tus necesidades.
        </p>
      </div>
      <Servicios services={services} showHeading={false} />
    </main>
  );
}
