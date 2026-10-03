import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conocé más sobre Ideas Móviles y nuestra filosofía de trabajo.",
};

export default function NosotrosPage() {
  return (
    <main className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-brand-black uppercase">
          Nosotros
        </h1>
        <div className="mt-12 bg-brand-light rounded-lg p-8 border-2 border-brand-grey-300">
          <p className="text-brand-dark">
            Contenido provisional — editable desde el panel de administración.
          </p>
        </div>
      </div>
    </main>
  );
}
