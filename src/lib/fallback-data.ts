import { CONTACT_PLACEHOLDERS } from "@/lib/constants";
import type { Service } from "@/types/service";
import type { PortfolioItem } from "@/types/portfolio";
import type { SiteSettings } from "@/types/site";

const now = new Date();

export const FALLBACK_SERVICES: Service[] = [
  { id: "1", title: "Carteles y Letras Corpóreas", description: "Diseños personalizados en Polifan o PVC espumado para comercios, eventos y decoración.", image: "/images/portfolio/portfolio-referencia-01.webp", category: "carteles-letras", order: 1, published: true, createdAt: now, updatedAt: now },
  { id: "2", title: "Cartelería Comercial", description: "Marquesinas, carteles con lona frontal, gigantografías y banners.", image: "/images/portfolio/portfolio-referencia-07.webp", category: "carteleria-comercial", order: 2, published: true, createdAt: now, updatedAt: now },
  { id: "3", title: "Ploteados en Vinilos y Esmerilados", description: "Vinilos de corte e impresión para vidrieras, paredes y automóviles.", image: "/images/portfolio/portfolio-referencia-09.webp", category: "vinilos-esmerilados", order: 3, published: true, createdAt: now, updatedAt: now },
  { id: "4", title: "Gráfica Vehicular Publicitaria", description: "Trabajos para convertir vehículos en soportes de publicidad móvil.", image: "/images/portfolio/portfolio-referencia-10.webp", category: "grafica-vehicular", order: 4, published: true, createdAt: now, updatedAt: now },
  { id: "5", title: "Servicio de Imprenta Digital", description: "Stickers troquelados, tarjetas, folletos, carteles y cortes láser.", image: "/images/portfolio/portfolio-referencia-08.webp", category: "imprenta-digital", order: 5, published: true, createdAt: now, updatedAt: now },
  { id: "6", title: "Señalética", description: "Señalización de seguridad e información para plantas, hospitales y espacios públicos.", image: "/images/portfolio/portfolio-referencia-11.webp", category: "senalizacion", order: 6, published: true, createdAt: now, updatedAt: now },
];

export const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  { id: "1", title: "Cartelería Comercial", description: null, image: "/images/portfolio/portfolio-referencia-01.webp", category: "carteleria", order: 1, published: true, createdAt: now, updatedAt: now },
  { id: "2", title: "Letras Corpóreas", description: null, image: "/images/portfolio/portfolio-referencia-02.webp", category: "corpóreas", order: 2, published: true, createdAt: now, updatedAt: now },
  { id: "3", title: "Vinilos y Esmerilados", description: null, image: "/images/portfolio/portfolio-referencia-03.webp", category: "vinilos", order: 3, published: true, createdAt: now, updatedAt: now },
  { id: "4", title: "Gráfica Vehicular", description: null, image: "/images/portfolio/portfolio-referencia-04.webp", category: "vehicular", order: 4, published: true, createdAt: now, updatedAt: now },
  { id: "5", title: "Imprenta Digital", description: null, image: "/images/portfolio/portfolio-referencia-05.webp", category: "imprenta", order: 5, published: true, createdAt: now, updatedAt: now },
  { id: "6", title: "Señalética", description: null, image: "/images/portfolio/portfolio-referencia-06.webp", category: "senalizacion", order: 6, published: true, createdAt: now, updatedAt: now },
  { id: "7", title: "Marquesinas", description: null, image: "/images/portfolio/portfolio-referencia-07.webp", category: "carteleria", order: 7, published: true, createdAt: now, updatedAt: now },
  { id: "8", title: "Diseño Editorial", description: null, image: "/images/portfolio/portfolio-referencia-08.webp", category: "imprenta", order: 8, published: true, createdAt: now, updatedAt: now },
  { id: "9", title: "Banners", description: null, image: "/images/portfolio/portfolio-referencia-09.webp", category: "carteleria", order: 9, published: true, createdAt: now, updatedAt: now },
  { id: "10", title: "Vinilo Automotriz", description: null, image: "/images/portfolio/portfolio-referencia-10.webp", category: "vinilos", order: 10, published: true, createdAt: now, updatedAt: now },
  { id: "11", title: "Seguridad Industrial", description: null, image: "/images/portfolio/portfolio-referencia-11.webp", category: "senalizacion", order: 11, published: true, createdAt: now, updatedAt: now },
  { id: "12", title: "Eventos", description: null, image: "/images/portfolio/portfolio-referencia-12.webp", category: "corpóreas", order: 12, published: true, createdAt: now, updatedAt: now },
];

export const FALLBACK_SETTINGS: SiteSettings = {
  id: "default",
  logo: null,
  favicon: null,
  title: "Ideas Móviles",
  description: "Cartelería y comunicación visual profesional.",
  whatsapp: CONTACT_PLACEHOLDERS.whatsapp,
  phone: CONTACT_PLACEHOLDERS.phone,
  email: CONTACT_PLACEHOLDERS.email,
  instagram: CONTACT_PLACEHOLDERS.instagram,
  address: CONTACT_PLACEHOLDERS.address,
  heroTitle: "IDEASMÓVILES",
  heroSubtitle: "Cartelería y comunicación visual profesional",
  heroText:
    "Diseño y producción de cartelería, señalética, vinilos y gráfica publicitaria. Convertimos tu idea en impacto visual.",
  heroButtonText: "Cotizar ahora",
  heroButtonLink: "/contacto",
  updatedAt: now,
};
