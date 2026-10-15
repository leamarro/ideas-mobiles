import { Metadata } from "next";
import { Proceso } from "@/components/home/Proceso";
import { getSiteSettings } from "@/lib/data";
import { getContent } from "@/lib/content";
import { RichText } from "@/components/ui/AccentText";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proceso",
  description: "Conocé nuestro proceso de trabajo paso a paso.",
};

export default async function ProcesoPage() {
  const settings = await getSiteSettings();
  const content = getContent(settings.content);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-heading uppercase">
          <RichText text={content.pageProcesoTitle} />
        </h1>
        <p className="text-body text-lg max-w-2xl"><RichText text={content.pageProcesoSubtitle} /></p>
      </div>
      <Proceso content={content} showHeading={false} />
    </main>
  );
}
