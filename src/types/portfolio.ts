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
  todos: "Todos",
  carteleria: "Cartelería",
  "corpóreas": "Corpóreas",
  vinilos: "Vinilos",
  vehicular: "Vehicular",
  imprenta: "Imprenta",
  senalizacion: "Señalética",
};
