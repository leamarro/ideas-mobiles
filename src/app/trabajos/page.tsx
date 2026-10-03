import { Metadata } from "next";
import { Portfolio } from "@/components/home/Portfolio";
import { getPortfolioItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trabajos | Ideas Móviles",
  description: "Conocé algunos de nuestros trabajos más recientes en cartelería, vinilos, corpóreas y más.",
};

export default async function TrabajosPage() {
  const portfolioItems = await getPortfolioItems();

  return (
    <main className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-brand-black uppercase">
          Nuestros Trabajos
        </h1>
        <p className="text-brand-dark text-lg max-w-2xl">
          Algunos de nuestros trabajos más recientes.
        </p>
      </div>
      <Portfolio items={portfolioItems} showHeading={false} />
    </main>
  );
}
