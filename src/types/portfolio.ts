export interface PortfolioItem {
  id: string;
  title: string;
  description: string | null;
  image: string;
  category: string;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PortfolioFormData {
  title: string;
  description: string | null;
  image: string | null;
  category: string;
  order: number;
  published: boolean;
}

export type PortfolioCategory =
  | "todos"
  | "carteleria"
  | "corpóreas"
  | "vinilos"
  | "vehicular"
  | "imprenta"
  | "senalizacion";

export const PORTFOLIO_CATEGORIES: PortfolioCategory[] = [
  "todos",
  "carteleria",
  "corpóreas",
  "vinilos",
  "vehicular",
  "imprenta",
  "senalizacion",
];

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  carteleria: "Cartelería",
  "corpóreas": "Corpóreas",
  vinilos: "Vinilos",
  vehicular: "Vehicular",
  imprenta: "Imprenta",
  senalizacion: "Señalética",
  todos: "Todos"
};

export interface PortfolioCategoryOption {
  slug: string;
  name: string;
}

// Categorías por defecto cuando la tabla `categories` está vacía o no responde.
export const FALLBACK_PORTFOLIO_CATEGORIES: PortfolioCategoryOption[] = PORTFOLIO_CATEGORIES
  .filter((cat) => cat !== "todos")
  .map((cat) => ({ slug: cat, name: PORTFOLIO_CATEGORY_LABELS[cat] }));

// Los servicios cargados antes de unificar categorías usan slugs propios;
// se traducen a la categoría de trabajos equivalente.
const LEGACY_SERVICE_CATEGORIES: Record<string, string> = {
  "carteles-letras": "corpóreas",
  "carteleria-comercial": "carteleria",
  "vinilos-esmerilados": "vinilos",
  "grafica-vehicular": "vehicular",
  "imprenta-digital": "imprenta",
};

export function serviceCategoryToPortfolio(category: string | null): string | null {
  if (!category) return null;
  return LEGACY_SERVICE_CATEGORIES[category] ?? category;
}

export function trabajosCategoryHref(category: string | null): string {
  const slug = serviceCategoryToPortfolio(category);
  return slug ? `/trabajos/${encodeURIComponent(slug)}` : "/trabajos";
}
