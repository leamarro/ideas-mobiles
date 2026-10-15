import { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { getContent, CONTENT_GROUPS } from "@/lib/content";
import { getTheme, THEME_FIELDS } from "@/lib/theme";
import { SettingsForm, type SettingsSection } from "../settings-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Configuración",
  description: "Configuración general del sitio desde el panel de administración.",
};

const sections: SettingsSection[] = [
  {
    title: "Portada",
    description: "Imagen y textos de la primera pantalla de la página de inicio.",
    fields: [
      {
        name: "heroImages",
        label: "Imágenes de portada",
        type: "image-list",
        placeholder: "/images/imagen-fondo2.png",
        recommended: "1920×770 px (panorámica)",
        hint: "Imágenes de fondo de la primera pantalla. Si subís más de una, se muestran como carrusel automático (con flechas y puntitos). Si las quitás todas, la portada queda con fondo oscuro y solo los textos.",
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
      {
        name: "heroSecondary",
        label: "Texto del botón secundario",
        hint: "Botón claro que acompaña al botón principal de la portada.",
      },
    ],
  },
  {
    title: "Colores",
    description:
      "Colores globales del sitio. Se aplican a botones, enlaces, títulos y fondo.",
    fields: THEME_FIELDS.map((field) => ({
      name: field.key,
      label: field.label,
      type: "color" as const,
      hint: field.hint,
    })),
  },
  ...CONTENT_GROUPS.map((group) => ({
    title: group.title,
    description: group.description,
    fields: group.fields.map((field) => ({
      name: field.key,
      label: field.label,
      type: field.type,
      placeholder: field.placeholder,
      hint: field.hint,
    })),
  })),
  {
    title: "Logo y favicon",
    description:
      "Imágenes de la marca. Si dejás un campo vacío se mantiene la imagen por defecto del sitio.",
    fields: [
      {
        name: "logo",
        label: "Logo",
        type: "image",
        placeholder: "/images/logo.png",
        recommended: "600×200 px (horizontal, PNG con fondo transparente)",
        hint: "Logo completo. Se muestra en el encabezado y en el pie de página. Recomendado en formato horizontal.",
      },
      {
        name: "favicon",
        label: "Ícono del navegador (favicon)",
        type: "image",
        placeholder: "/images/logo.png",
        recommended: "512×512 px (cuadrada)",
        hint: "Imagen cuadrada que aparece en la pestaña del navegador y al guardar el sitio como favorito.",
      },
    ],
  },
  {
    title: "Buscadores y redes",
    description:
      "Lo que ven los buscadores y las redes cuando comparten el link del sitio.",
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
      {
        name: "ogImage",
        label: "Imagen para compartir",
        type: "image",
        placeholder: "/images/og.png",
        recommended: "1200×630 px",
        hint: "Imagen que se ve al compartir el sitio en WhatsApp, Facebook o Twitter. Si está vacía se usa el logo.",
      },
    ],
  },
];

export default async function AdminConfigPage() {
  const settings = await getSiteSettings();
  const content = getContent(settings.content);
  const theme = getTheme(settings.theme);

  const initial: Record<string, string | string[]> = {
    ...content,
    ...theme,
    logo: settings.logo ?? "",
    favicon: settings.favicon ?? "",
    title: settings.title,
    description: settings.description,
    heroSubtitle: settings.heroSubtitle,
    heroText: settings.heroText,
    heroButtonText: settings.heroButtonText,
    heroButtonLink: settings.heroButtonLink,
    heroImages: settings.heroImages,
  };

  return (
    <div>
      <h1 className="font-display font-bold text-2xl mb-6 text-brand-black uppercase">
        Configuración
      </h1>
      <SettingsForm initial={initial} sections={sections} />
      <p className="text-brand-dark text-xs mt-4">
        Los datos de contacto (WhatsApp, teléfono, email y redes sociales) se configuran en la
        sección <strong>Datos de contacto</strong>. En los títulos con dos o tres casillas, la{" "}
        <strong>palabra en color</strong> se pinta automáticamente con el color de acento. Para
        poner una palabra o frase en <strong>negrita</strong>, seleccionala en el campo y tocá el
        botón <strong>Negrita</strong>.
      </p>
    </div>
  );
}
