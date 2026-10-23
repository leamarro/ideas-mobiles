import { Metadata } from "next";
import { getAllPortfolioCategories, getAllPortfolioItems } from "@/lib/data";
import { AdminTrabajos } from "./AdminTrabajos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trabajos",
  description: "Gestionar trabajos del portfolio desde el panel de administración.",
};

export default async function AdminTrabajosPage() {
  const [items, categories] = await Promise.all([
    getAllPortfolioItems(),
    getAllPortfolioCategories(),
  ]);

  return (
    <div>
      <AdminTrabajos initialItems={items} categories={categories} />
    </div>
  );
}
