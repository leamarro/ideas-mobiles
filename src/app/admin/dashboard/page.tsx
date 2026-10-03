import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Ideas Móviles Admin",
  description: "Dashboard del panel de administración.",
};

export default async function DashboardPage() {
  const [servicesTotal, servicesPublished, itemsTotal, itemsPublished, categories] =
    await Promise.all([
      prisma.service.count(),
      prisma.service.count({ where: { published: true } }),
      prisma.portfolioItem.count(),
      prisma.portfolioItem.count({ where: { published: true } }),
      prisma.category.count({ where: { published: true } }),
    ]);

  const stats = [
    { label: "Servicios", value: servicesTotal, sub: `Publicados: ${servicesPublished}` },
    { label: "Trabajos", value: itemsTotal, sub: `Publicados: ${itemsPublished}` },
    { label: "Categorías", value: categories, sub: "Activas" },
  ];

  const quickLinks = [
    { href: "/admin/servicios", label: "Gestionar Servicios" },
    { href: "/admin/trabajos", label: "Gestionar Trabajos" },
    { href: "/admin/contacto", label: "Editar Contacto" },
    { href: "/admin/config", label: "Configuración" },
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-2xl md:text-3xl mb-6 text-brand-black uppercase">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border-2 border-brand-grey-200 rounded-lg p-6"
          >
            <p className="text-brand-dark text-sm mb-2 uppercase">{stat.label}</p>
            <p className="text-3xl font-display font-bold text-brand-black">{stat.value}</p>
            <p className="text-brand-grey-500 text-xs mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-display font-semibold mb-4 text-brand-black uppercase">
          Accesos Rápidos
        </h2>
        <div className="flex flex-wrap gap-4">
          {quickLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="bg-white hover:bg-brand-light border-2 border-brand-grey-200 hover:border-brand-red-500 text-brand-dark hover:text-brand-red-500 px-6 py-3 rounded-lg transition-all text-sm font-display font-semibold uppercase"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
