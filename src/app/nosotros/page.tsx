import { Metadata } from "next";
import { Nosotros } from "@/components/home/Nosotros";
import { getSiteSettings } from "@/lib/data";
import { getContent } from "@/lib/content";
import { RichText } from "@/components/ui/AccentText";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Nosotros",
  description: "Conocé más sobre Ideas Móviles y nuestra filosofía de trabajo.",
};

export default async function NosotrosPage() {
  const settings = await getSiteSettings();
  const content = getContent(settings.content);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-heading uppercase">
          <RichText text={content.pageNosotrosTitle} />
        </h1>
        <p className="text-body text-lg max-w-2xl"><RichText text={content.pageNosotrosSubtitle} /></p>
      </div>
      <Nosotros
        content={content}
        showHeading={false}
        logo={settings.logo || "/images/logo.png"}
      />
    </main>
  );
}
