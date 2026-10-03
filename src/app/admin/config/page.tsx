import { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { SettingsForm } from "../settings-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Configuración | Ideas Móviles Admin",
  description: "Configuración general del sitio desde el panel de administración.",
};

const fields = [
  { name: "title", label: "Título del sitio" },
  { name: "description", label: "Descripción SEO", type: "textarea" as const },
  { name: "heroSubtitle", label: "Hero — Subtítulo (eyebrow)" },
  { name: "heroText", label: "Hero — Texto", type: "textarea" as const },
  { name: "heroButtonText", label: "Hero — Texto del botón" },
  { name: "heroButtonLink", label: "Hero — Enlace del botón", placeholder: "/contacto" },
];

export default async function AdminConfigPage() {
  const settings = await getSiteSettings();

  const initial: Record<string, string> = {};
  for (const field of fields) {
    const value = settings[field.name as keyof typeof settings];
    initial[field.name] = typeof value === "string" ? value : "";
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-6 text-brand-black uppercase">
        Configuración
      </h1>
      <SettingsForm initial={initial} fields={fields} />
      <p className="text-brand-dark text-xs mt-4">
        El título y la descripción se usan en el SEO; los campos del hero se muestran en la
        portada.
      </p>
    </div>
  );
}
