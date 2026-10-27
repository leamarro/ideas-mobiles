import { notFound } from "next/navigation";
import { Portfolio } from "@/components/home/Portfolio";
import { ALL_CATEGORY_SLUG, getPortfolioCategories, getPortfolioItems, getSiteSettings } from "@/lib/data";
import { getContent } from "@/lib/content";
import { RichText } from "@/components/ui/AccentText";

export async function TrabajosView({ category }: { category?: string }) {
  const [portfolioItems, portfolioCategories, settings] = await Promise.all([
    getPortfolioItems(),
    getPortfolioCategories(),
    getSiteSettings(),
  ]);
  const content = getContent(settings.content);

  if (
    category &&
    category !== ALL_CATEGORY_SLUG &&
    !portfolioCategories.some((cat) => cat.slug === category)
  ) {
    notFound();
  }

  return (
    <main className="bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28">
        <h1 className="font-display font-bold text-3xl md:text-5xl mb-4 text-heading uppercase">
          <RichText text={content.pageTrabajosTitle} />
        </h1>
        <p className="text-body text-lg max-w-2xl"><RichText text={content.pageTrabajosSubtitle} /></p>
      </div>
      <Portfolio
        items={portfolioItems}
        categories={portfolioCategories}
        content={content}
        showHeading={false}
        initialCategory={category}
      />
    </main>
  );
}
