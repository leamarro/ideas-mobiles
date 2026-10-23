import { prisma } from "@/lib/prisma";
import {
  FALLBACK_PORTFOLIO,
  FALLBACK_SERVICES,
  FALLBACK_SETTINGS,
} from "@/lib/fallback-data";
import type { Service } from "@/types/service";
import {
  FALLBACK_PORTFOLIO_CATEGORIES,
  type PortfolioCategoryOption,
  type PortfolioItem,
} from "@/types/portfolio";
import type { SiteSettings } from "@/types/site";

export { FALLBACK_SETTINGS };

export async function getServices(): Promise<Service[]> {
  try {
    return await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return FALLBACK_SERVICES;
  }
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    return await prisma.portfolioItem.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
  } catch {
    return FALLBACK_PORTFOLIO;
  }
}

// "todos" está en la tabla por el seed, pero es el filtro general, no una categoría real.
export const ALL_CATEGORY_SLUG = "todos";

// Las categorías por defecto se usan solo si la tabla nunca se cargó: si el
// admin borró todas, no tienen que volver a aparecer.
async function findCategories(onlyPublished: boolean): Promise<PortfolioCategoryOption[]> {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    select: { slug: true, name: true, published: true },
  });
  if (categories.length === 0) return FALLBACK_PORTFOLIO_CATEGORIES;

  return categories
    .filter((cat) => cat.slug !== ALL_CATEGORY_SLUG && (!onlyPublished || cat.published))
    .map(({ slug, name }) => ({ slug, name }));
}

export async function getPortfolioCategories(): Promise<PortfolioCategoryOption[]> {
  try {
    return await findCategories(true);
  } catch {
    return FALLBACK_PORTFOLIO_CATEGORIES;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSettings.findFirst({ where: { id: "default" } });
    if (!settings) return FALLBACK_SETTINGS;

    let images: string[] = [];
    try {
      const parsed = JSON.parse(settings.heroImages ?? "[]");
      if (Array.isArray(parsed)) images = parsed.filter((x) => typeof x === "string");
    } catch {
      images = [];
    }
    return { ...settings, heroImages: images };
  } catch {
    return FALLBACK_SETTINGS;
  }
}

export async function getAllServices(): Promise<Service[]> {
  return prisma.service.findMany({ orderBy: { order: "asc" } });
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  return prisma.portfolioItem.findMany({ orderBy: { order: "asc" } });
}

export async function getAllPortfolioCategories(): Promise<PortfolioCategoryOption[]> {
  return findCategories(false);
}

// Con la tabla vacía el sitio muestra las categorías por defecto: antes de
// crear o borrar una se guardan, para que el resto no desaparezca del filtro.
export async function ensureDefaultCategories(): Promise<void> {
  if ((await prisma.category.count()) > 0) return;

  await prisma.category.createMany({
    data: FALLBACK_PORTFOLIO_CATEGORIES.map((category, index) => ({
      ...category,
      order: index + 1,
    })),
  });
}
