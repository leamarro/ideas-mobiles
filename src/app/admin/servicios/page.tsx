import { Metadata } from "next";
import { getAllPortfolioCategories, getAllServices } from "@/lib/data";
import { AdminServicios } from "./AdminServicios";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicios",
  description: "Gestionar servicios desde el panel de administración.",
};

export default async function AdminServiciosPage() {
  const [services, categories] = await Promise.all([
    getAllServices(),
    getAllPortfolioCategories(),
  ]);

  return (
    <div>
      <AdminServicios initialServices={services} categories={categories} />
    </div>
  );
}
