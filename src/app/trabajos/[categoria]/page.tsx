import { Metadata } from "next";
import { TrabajosView } from "../TrabajosView";

export const dynamic = "force-dynamic";

interface TrabajosCategoriaPageProps {
  params: Promise<{ categoria: string }>;
}

// El slug puede llegar codificado (p. ej. "corp%C3%B3reas").
function decodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export const metadata: Metadata = {
  title: "Trabajos",
  description: "Conocé algunos de nuestros trabajos más recientes en cartelería, vinilos, corpóreas y más.",
};

export default async function TrabajosCategoriaPage({ params }: TrabajosCategoriaPageProps) {
  const { categoria } = await params;
  return <TrabajosView category={decodeSlug(categoria)} />;
}
