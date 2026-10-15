import { Metadata } from "next";
import { Contacto } from "@/components/home/Contacto";
import { getSiteSettings } from "@/lib/data";
import { getContent } from "@/lib/content";
import { RichText } from "@/components/ui/AccentText";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contactá con Ideas Móviles para tu próximo proyecto de cartelería.",
};

export default async function ContactoPage() {
  const settings = await getSiteSettings();
  const content = getContent(settings.content);

  return (
    <main className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-heading uppercase">
          <RichText text={content.pageContactoTitle} />
        </h1>
        <p className="text-body text-lg max-w-2xl"><RichText text={content.pageContactoSubtitle} /></p>
      </div>
      <Contacto
        content={content}
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
