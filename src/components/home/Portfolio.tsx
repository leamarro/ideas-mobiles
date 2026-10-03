"use client";

import { useState } from "react";
import { PortfolioItem } from "@/components/portfolio/PortfolioItem";
import { Lightbox } from "@/components/portfolio/Lightbox";
import { Container } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PORTFOLIO_CATEGORIES, PortfolioItem as PortfolioItemData } from "@/types/portfolio";
import { FALLBACK_PORTFOLIO } from "@/lib/fallback-data";
import { cn } from "@/lib/utils";

interface PortfolioProps {
  items?: PortfolioItemData[];
  showHeading?: boolean;
}

export function Portfolio({ items = FALLBACK_PORTFOLIO, showHeading = true }: PortfolioProps) {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems =
    selectedCategory === "todos"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleItemClick = (item: PortfolioItemData) => {
    const images = items.map((i) => i.image);
    const imageIndex = items.indexOf(item);
    setLightboxImages(images);
    setLightboxIndex(imageIndex);
    setLightboxOpen(true);
  };

  return (
    <section id="trabajos" className="bg-zinc-50 py-20 md:py-28">
      <Container maxWidth="full">
        {showHeading && (
          <SectionHeading
            eyebrow="Portfolio"
            title={
              <>
                Nuestro <span className="text-brand-red-500">Trabajo</span>
              </>
            }
            subtitle="Algunos de nuestros trabajos más recientes"
          />
        )}

        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {PORTFOLIO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red-500 focus-visible:ring-offset-2",
                selectedCategory === cat
                  ? "bg-zinc-950 text-white shadow-soft"
                  : "border border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-950"
              )}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-zinc-500">No hay trabajos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {filteredItems.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index, 6) * 40}>
                <PortfolioItem
                  title={item.title}
                  image={item.image}
                  category={item.category}
                  onClick={() => handleItemClick(item)}
                  index={index}
                />
              </Reveal>
            ))}
          </div>
        )}

        {lightboxOpen && (
          <Lightbox
            images={lightboxImages}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </Container>
    </section>
  );
}
