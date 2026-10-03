import { Metadata } from "next";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Proceso | Ideas Móviles",
  description: "Conocé nuestro proceso de trabajo paso a paso.",
};

export default function ProcesoPage() {
  return (
    <main className="bg-brand-light">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-brand-black uppercase">
          Nuestro Proceso
        </h1>
        <div className="mt-12 bg-white rounded-lg p-8 border-2 border-brand-grey-300">
          <p className="text-brand-dark">
            Contenido provisional — editable desde el panel de administración.
          </p>
        </div>
      </div>
    </main>
  );
}
