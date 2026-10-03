import { Metadata } from "next";
import { getAllPortfolioItems } from "@/lib/data";
import { AdminTrabajos } from "./AdminTrabajos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trabajos",
  description: "Gestionar trabajos del portfolio desde el panel de administración.",
};

export default async function AdminTrabajosPage() {
  const items = await getAllPortfolioItems();

  return (
    <div>
      <AdminTrabajos initialItems={items} />
    </div>
  );
}
