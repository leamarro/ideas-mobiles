import { Metadata } from "next";
import { getAllServices } from "@/lib/data";
import { AdminServicios } from "./AdminServicios";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Servicios | Ideas Móviles Admin",
  description: "Gestionar servicios desde el panel de administración.",
};

export default async function AdminServiciosPage() {
  const services = await getAllServices();

  return (
    <div>
      <AdminServicios initialServices={services} />
    </div>
  );
}
