import { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { SettingsForm, type SettingsField } from "../settings-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Datos de Contacto",
  description: "Gestionar datos de contacto desde el panel de administración.",
};

const fields: SettingsField[] = [
  {
    name: "whatsapp",
    label: "WhatsApp",
    placeholder: "+54 291 454 3333",
    hint: "Con código de país y sin signos. Se usa en el botón flotante y en los enlaces de WhatsApp.",
  },
  {
    name: "phone",
    label: "Teléfono",
    placeholder: "+54 291 454 3333",
    hint: "Fijo o celular que se muestra como enlace de llamada en la sección de contacto.",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "ideasmoviles@gmail.com",
    hint: "Recibe las consultas del formulario de mensaje y aparece como enlace de correo.",
  },
  {
    name: "instagram",
    label: "Instagram",
    placeholder: "@IDEASMOVILES",
    hint: "Usuario (@) o link completo del perfil. Dejalo vacío para no mostrarlo.",
  },
  {
    name: "facebook",
    label: "Facebook",
    placeholder: "IDEASMOVILES",
    hint: "Usuario o link de la página de Facebook. Dejalo vacío para no mostrarlo.",
  },
  {
    name: "address",
    label: "Dirección",
    placeholder: "Dirección pendiente de confirmar",
    hint: "Dirección del local. Dejala vacía para no mostrarla.",
  },
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
        Estos datos se muestran en la sección de contacto del sitio, en el footer y en el botón
        flotante de WhatsApp.
      </p>
    </div>
  );
}
