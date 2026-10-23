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
const ALL_CATEGORY_SLUG = "todos";

export async function getPortfolioCategories(): Promise<PortfolioCategoryOption[]> {
  try {
    const categories = await prisma.category.findMany({
      where: { published: true, slug: { not: ALL_CATEGORY_SLUG } },
      orderBy: { order: "asc" },
      select: { slug: true, name: true },
    });
    return categories.length ? categories : FALLBACK_PORTFOLIO_CATEGORIES;
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
  const categories = await prisma.category.findMany({
    where: { slug: { not: ALL_CATEGORY_SLUG } },
    orderBy: { order: "asc" },
    select: { slug: true, name: true },
  });
  return categories.length ? categories : FALLBACK_PORTFOLIO_CATEGORIES;
}
