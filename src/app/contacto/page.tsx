import { Metadata } from "next";
import { Contacto } from "@/components/home/Contacto";
import { getSiteSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá con Ideas Móviles para tu próximo proyecto de cartelería.",
};

export default async function ContactoPage() {
  const settings = await getSiteSettings();

  return (
    <main className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-brand-black uppercase">
          Contacto
        </h1>
        <p className="text-brand-dark text-lg max-w-2xl">
          Contanos tu proyecto y te respondemos a la brevedad.
        </p>
      </div>
      <Contacto
        whatsapp={settings.whatsapp}
        phone={settings.phone}
        email={settings.email}
        instagram={settings.instagram}
        facebook={settings.facebook}
        address={settings.address}
        showHeading={false}
      />
    </main>
  );
}
