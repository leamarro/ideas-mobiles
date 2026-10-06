import { Metadata } from "next";
import { Proceso } from "@/components/home/Proceso";

export const metadata: Metadata = {
  title: "Proceso",
  description: "Conocé nuestro proceso de trabajo paso a paso.",
};

export default function ProcesoPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-brand-black uppercase">
          Nuestro Proceso
        </h1>
        <p className="text-brand-dark text-lg max-w-2xl">
          Así trabajamos — de la primera consulta a la instalación final.
        </p>
      </div>
      <Proceso showHeading={false} />
    </main>
  );
}
