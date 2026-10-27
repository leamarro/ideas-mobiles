import { Metadata } from "next";
import { TrabajosView } from "./TrabajosView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trabajos",
  description: "Conocé algunos de nuestros trabajos más recientes en cartelería, vinilos, corpóreas y más.",
};

export default function TrabajosPage() {
  return <TrabajosView />;
}
