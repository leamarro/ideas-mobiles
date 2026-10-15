import { Metadata } from "next";
import { Portfolio } from "@/components/home/Portfolio";
import { getPortfolioItems, getSiteSettings } from "@/lib/data";
import { getContent } from "@/lib/content";
import { RichText } from "@/components/ui/AccentText";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trabajos",
  description: "Conocé algunos de nuestros trabajos más recientes en cartelería, vinilos, corpóreas y más.",
};

export default async function TrabajosPage() {
  const [portfolioItems, settings] = await Promise.all([
    getPortfolioItems(),
    getSiteSettings(),
  ]);
  const content = getContent(settings.content);

  return (
    <main className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-heading uppercase">
          <RichText text={content.pageTrabajosTitle} />
        </h1>
        <p className="text-body text-lg max-w-2xl"><RichText text={content.pageTrabajosSubtitle} /></p>
      </div>
      <Portfolio items={portfolioItems} content={content} showHeading={false} />
    </main>
  );
}
