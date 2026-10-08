import { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { SettingsForm, type SettingsSection } from "../settings-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Configuración",
  description: "Configuración general del sitio desde el panel de administración.",
};

const FIELD_DEFAULTS: Record<string, string> = {
  heroImage: "/images/imagen-fondo2.png",
};

const sections: SettingsSection[] = [
  {
    title: "Identidad visual",
    description:
      "Imágenes de la marca. Si dejás un campo vacío se mantiene la imagen por defecto del sitio.",
    fields: [
      {
        name: "logo",
        label: "Logo",
        type: "image",
        placeholder: "/images/logo.png",
        hint: "Logo completo. Se muestra en el pie de página y en la sección Nosotros. Recomendado en formato horizontal.",
      },
      {
        name: "favicon",
        label: "Ícono del navegador (favicon)",
        type: "image",
        placeholder: "/images/logo-icon.png",
        hint: "Imagen cuadrada que aparece en la pestaña del navegador y al guardar el sitio como favorito.",
      },
    ],
  },
  {
    title: "Apariencia en buscadores (SEO)",
    description:
      "Es lo que ven los buscadores y las redes cuando comparten el link: título, descripción e imagen de vista previa.",
    fields: [
      {
        name: "title",
        label: "Título del sitio",
        hint: "Aparece en la pestaña del navegador y en los resultados de Google. Ej.: Ideas Móviles",
      },
      {
        name: "description",
        label: "Descripción SEO",
        type: "textarea",
        hint: "Frase de 1 o 2 líneas que se muestra debajo del título en Google y al compartir el link en WhatsApp o Instagram.",
      },
    ],
  },
  {
    title: "Portada (Hero)",
    description:
      "Imagen y textos de la primera pantalla de la página de inicio.",
    fields: [
      {
        name: "heroImage",
        label: "Imagen de portada",
        type: "image",
        placeholder: "/images/imagen-fondo2.png",
        hint: "Imagen de fondo de la primera pantalla. Podés subir una imagen nueva o pegar la URL de una existente. Si la quitás, la portada queda con fondo oscuro y solo los textos.",
      },
      {
        name: "heroSubtitle",
        label: "Texto destacado (eyebrow)",
        hint: "Frase corta con borde que se muestra arriba del párrafo de la portada.",
      },
      {
        name: "heroText",
        label: "Texto de la portada",
        type: "textarea",
        hint: "Párrafo explicativo que acompaña a los botones sobre la imagen de la portada.",
      },
      {
        name: "heroButtonText",
        label: "Texto del botón principal",
        hint: "Etiqueta del botón rojo de la portada. Ej.: Cotizar ahora",
      },
      {
        name: "heroButtonLink",
        label: "Enlace del botón principal",
        placeholder: "/contacto",
        hint: "Hacia dónde lleva el botón: una página del sitio (/contacto) o un link externo (https://...).",
      },
    ],
  },
];

export default async function AdminConfigPage() {
  const settings = await getSiteSettings();

  const initial: Record<string, string> = {};
  for (const section of sections) {
    for (const field of section.fields) {
      const value = settings[field.name as keyof typeof settings];
      initial[field.name] = typeof value === "string" ? value : (FIELD_DEFAULTS[field.name] ?? "");
    }
  }

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-6 text-brand-black uppercase">
        Configuración
      </h1>
      <SettingsForm initial={initial} sections={sections} />
      <p className="text-brand-dark text-xs mt-4">
        Los datos de contacto (WhatsApp, teléfono, email y redes sociales) se configuran en la
        sección <strong>Datos de contacto</strong>.
      </p>
    </div>
  );
}
