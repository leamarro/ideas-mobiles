import { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { SettingsForm } from "../settings-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Gestionar datos de contacto desde el panel de administración.",
};

const fields = [
  { name: "whatsapp", label: "WhatsApp", placeholder: "+54 291 454 3333" },
  { name: "phone", label: "Teléfono", placeholder: "+54 291 454 3333" },
  { name: "email", label: "Email", placeholder: "ideasmoviles@gmail.com" },
  { name: "instagram", label: "Instagram", placeholder: "@IDEASMOVILES" },
  { name: "address", label: "Dirección", placeholder: "Dirección pendiente de confirmar" },
];

export default async function AdminContactoPage() {
  const settings = await getSiteSettings();

  const initial: Record<string, string> = {};
  for (const field of fields) {
    const value = settings[field.name as keyof typeof settings];
    initial[field.name] = typeof value === "string" ? value : "";
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-6 text-brand-black uppercase">
        Datos de Contacto
      </h1>
      <SettingsForm initial={initial} fields={fields} />
      <p className="text-brand-dark text-xs mt-4">
        Estos datos se muestran en el footer, el botón de WhatsApp y la sección de contacto del
        sitio.
      </p>
    </div>
  );
}
