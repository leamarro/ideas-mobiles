import { Metadata } from "next";
import { Nosotros } from "@/components/home/Nosotros";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conocé más sobre Ideas Móviles y nuestra filosofía de trabajo.",
};

export default async function NosotrosPage() {
  const settings = await getSiteSettings();

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-brand-black uppercase">
          Nosotros
        </h1>
        <p className="text-brand-dark text-lg max-w-2xl">
          Somos un equipo apasionado por la comunicación visual y la cartelería.
        </p>
      </div>
      <Nosotros showHeading={false} logo={settings.logo || "/images/logo.png"} />
    </main>
  );
}
