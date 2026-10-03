import { prisma } from "@/lib/prisma";
import {
  FALLBACK_PORTFOLIO,
  FALLBACK_SERVICES,
  FALLBACK_SETTINGS,
} from "@/lib/fallback-data";
import type { Service } from "@/types/service";
import type { PortfolioItem } from "@/types/portfolio";
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

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSettings.findFirst({ where: { id: "default" } });
    return settings ?? FALLBACK_SETTINGS;
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
