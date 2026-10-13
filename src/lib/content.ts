export type FieldType = "text" | "textarea" | "image" | "color" | "accent";

export interface ContentField {
  key: string;
  label: string;
  type?: FieldType;
  default: string;
  placeholder?: string;
  hint?: string;
}

export interface ContentGroup {
  title: string;
  description?: string;
  fields: ContentField[];
}

/**
 * Registro central de todos los textos editables del sitio.
 *
 * Para agregar un texto nuevo: agregá una entrada acá y consumila en el
 * componente correspondiente con `content[clave]`. No hace falta migración.
 *
 * Los campos de tipo "accent" permiten resaltar una palabra con el color de
 * acento. Se guardan como texto con la parte resaltada entre llaves
 * (ej.: "Nuestros {Servicios}") y el panel lo muestra con campos separados.
 */
export const CONTENT_GROUPS: ContentGroup[] = [
  {
    title: "Encabezado (menú superior)",
    description: "Textos del menú de navegación y de la barra superior del sitio.",
    fields: [
      {
        key: "headerTagline",
        label: "Frase del encabezado",
        default: "Cartelería integral para empresas, comercios y particulares.",
        hint: "Texto que aparece a la derecha del logo en pantallas grandes.",
      },
      { key: "navInicio", label: "Menú: Inicio", default: "INICIO" },
      { key: "navPortfolio", label: "Menú: Portfolio", default: "PORTFOLIO" },
      { key: "navNosotros", label: "Menú: Nosotros", default: "NOSOTROS" },
      { key: "navServicios", label: "Menú: Servicios", default: "SERVICIOS" },
      { key: "navContacto", label: "Menú: Contacto", default: "CONTACTO" },
      { key: "headerCta", label: "Botón superior", default: "Cotizar" },
      { key: "headerCtaMobile", label: "Botón superior (celular)", default: "Cotizar ahora" },
    ],
  },
  {
    title: "Sección Servicios",
    fields: [
      { key: "serviciosEyebrow", label: "Antetítulo", default: "Lo que hacemos" },
      { key: "serviciosTitle", label: "Título", type: "accent", default: "Nuestros {Servicios}" },
      {
        key: "serviciosSubtitle",
        label: "Subtítulo",
        type: "textarea",
        default:
          "Soluciones integrales de cartelería y comunicación visual para tu negocio",
      },
      { key: "serviciosCta", label: "Texto del enlace de cada tarjeta", default: "Ver más" },
      {
        key: "serviciosEmpty",
        label: "Mensaje sin servicios",
        type: "textarea",
        default:
          "Estamos preparando esta sección. Mientras tanto, contactanos y te contamos todo lo que hacemos.",
      },
    ],
  },
  {
    title: "Sección Portfolio",
    fields: [
      { key: "portfolioEyebrow", label: "Antetítulo", default: "Portfolio" },
      { key: "portfolioTitle", label: "Título", type: "accent", default: "Nuestro {Trabajo}" },
      {
        key: "portfolioSubtitle",
        label: "Subtítulo",
        type: "textarea",
        default: "Algunos de nuestros trabajos más recientes",
      },
      {
        key: "portfolioEmpty",
        label: "Mensaje sin trabajos",
        default: "No hay trabajos en esta categoría.",
      },
    ],
  },
  {
    title: "Sección Nosotros",
    fields: [
      { key: "nosotrosEyebrow", label: "Antetítulo", default: "Nosotros" },
      { key: "nosotrosTitle", label: "Título", type: "accent", default: "Quiénes {somos}" },
      {
        key: "nosotrosText",
        label: "Párrafo",
        type: "textarea",
        default:
          "Somos un equipo apasionado por la comunicación visual y la cartelería. Cada proyecto es una oportunidad para crear algo que impacte.",
      },
      {
        key: "nosotrosSlogan",
        label: "Frase destacada",
        type: "textarea",
        default:
          '"Nuestra propuesta, es ayudarte a alcanzar tu objetivo…\nNuestro objetivo, es ayudarte a alcanzar el tuyo…!"',
        hint: "Se muestra entre comillas dentro del recuadro destacado.",
      },
      {
        key: "nosotrosBadge",
        label: "Texto sobre la imagen",
        default: "Imagen y Comunicación",
      },
    ],
  },
  {
    title: "Sección Proceso",
    fields: [
      { key: "procesoEyebrow", label: "Antetítulo", default: "Cómo trabajamos" },
      { key: "procesoTitle", label: "Título", type: "accent", default: "Nuestro {Proceso}" },
      {
        key: "procesoSubtitle",
        label: "Subtítulo",
        type: "textarea",
        default: "Así trabajamos — paso a paso, de idea a realidad",
      },
      { key: "processStep1Title", label: "Paso 1 — título", default: "Consulta" },
      {
        key: "processStep1Text",
        label: "Paso 1 — descripción",
        default: "Primera comunicación para entender tu necesidad.",
      },
      { key: "processStep2Title", label: "Paso 2 — título", default: "Propuesta" },
      {
        key: "processStep2Text",
        label: "Paso 2 — descripción",
        default: "Presentamos un plan personalizado para tu proyecto.",
      },
      { key: "processStep3Title", label: "Paso 3 — título", default: "Producción" },
      {
        key: "processStep3Text",
        label: "Paso 3 — descripción",
        default: "Desarrollo y fabricación del trabajo.",
      },
      { key: "processStep4Title", label: "Paso 4 — título", default: "Entrega / Instalación" },
      {
        key: "processStep4Text",
        label: "Paso 4 — descripción",
        default: "Entregamos e instalamos tu nueva cartelería.",
      },
    ],
  },
  {
    title: "Sección final (CTA)",
    fields: [
      { key: "ctaBadge", label: "Texto del distintivo", default: "Empezá hoy" },
      {
        key: "ctaTitle",
        label: "Título",
        type: "accent",
        default: "¿Listo para tu {próximo proyecto}?",
      },
      {
        key: "ctaSubtitle",
        label: "Subtítulo",
        type: "textarea",
        default: "Hablemos. Cotizá sin compromiso y empezá a convertir tu idea en realidad.",
      },
      { key: "ctaButtonText", label: "Botón principal", default: "Contactar por WhatsApp" },
      { key: "ctaSecondary", label: "Botón secundario", default: "Ver servicios" },
    ],
  },
  {
    title: "Sección Contacto",
    description: "Títulos de la sección y textos del formulario de consulta.",
    fields: [
      { key: "contactoEyebrow", label: "Antetítulo", default: "Hablemos" },
      { key: "contactoTitle", label: "Título", type: "accent", default: "Nuestro {Contacto}" },
      {
        key: "contactoSubtitle",
        label: "Subtítulo",
        type: "textarea",
        default: "Hacé tu consulta y nos ponemos en contacto",
      },
      {
        key: "contactoMethodsHeading",
        label: "Título de la columna de datos",
        default: "Contactanos",
      },
      { key: "formName", label: "Formulario: Nombre", default: "Nombre" },
      { key: "formNamePlaceholder", label: "Formulario: ayuda del nombre", default: "Tu nombre" },
      { key: "formEmpresa", label: "Formulario: Empresa", default: "Empresa (opcional)" },
      {
        key: "formEmpresaPlaceholder",
        label: "Formulario: ayuda de empresa",
        default: "Nombre de tu empresa",
      },
      { key: "formWhatsapp", label: "Formulario: WhatsApp", default: "WhatsApp" },
      {
        key: "formWhatsappPlaceholder",
        label: "Formulario: ayuda de WhatsApp",
        default: "+54 291 454 3333",
      },
      { key: "formServicio", label: "Formulario: Servicio", default: "Servicio" },
      {
        key: "formServicioPlaceholder",
        label: "Formulario: ayuda de servicio",
        default: "Seleccioná un servicio",
      },
      { key: "formMensaje", label: "Formulario: Mensaje", default: "Mensaje" },
      {
        key: "formMensajePlaceholder",
        label: "Formulario: ayuda del mensaje",
        default: "Contanos tu proyecto...",
      },
      {
        key: "formImage",
        label: "Formulario: Adjuntar imagen",
        default: "Adjuntar imagen (opcional)",
      },
      {
        key: "formImageHint",
        label: "Formulario: ayuda de imagen",
        default: "Máx. 5MB — JPG, PNG, WebP o GIF",
      },
      { key: "formSubmit", label: "Formulario: botón enviar", default: "Enviar mensaje" },
      { key: "formSubmitting", label: "Formulario: botón enviando", default: "Enviando..." },
      { key: "formSuccessTitle", label: "Formulario: título de agradecimiento", default: "¡Gracias!" },
      {
        key: "formSuccessText",
        label: "Formulario: texto de agradecimiento",
        type: "textarea",
        default: "Tu mensaje fue enviado. Nos contactaremos a la brevedad.",
      },
      {
        key: "formSuccessLink",
        label: "Formulario: enlace para enviar otro mensaje",
        default: "Enviar otro mensaje",
      },
    ],
  },
  {
    title: "Pie de página",
    fields: [
      {
        key: "footerDescription",
        label: "Descripción del pie",
        type: "textarea",
        default: "Cartelería y comunicación visual profesional. Cotizá tu proyecto.",
      },
      { key: "footerNavHeading", label: "Título columna Navegación", default: "Navegación" },
      { key: "footerServicesHeading", label: "Título columna Servicios", default: "Servicios" },
      { key: "footerContactHeading", label: "Título columna Contacto", default: "Contacto" },
      {
        key: "footerCopyright",
        label: "Texto de copyright",
        default: "© {year} Ideas Móviles. Todos los derechos reservados.",
        hint: "Podés usar {year} para que aparezca el año actual automáticamente.",
      },
      { key: "footerTagline", label: "Frase inferior", default: "Imagen y Comunicación" },
    ],
  },
  {
    title: "Páginas internas",
    description: "Encabezados de las páginas de Servicios, Trabajos, Nosotros, Proceso y Contacto.",
    fields: [
      { key: "pageServiciosTitle", label: "Servicios — título", default: "Nuestros Servicios" },
      {
        key: "pageServiciosSubtitle",
        label: "Servicios — subtítulo",
        type: "textarea",
        default:
          "Soluciones integrales de cartelería y comunicación visual. Cada proyecto se adapta a tus necesidades.",
      },
      { key: "pageTrabajosTitle", label: "Trabajos — título", default: "Nuestros Trabajos" },
      {
        key: "pageTrabajosSubtitle",
        label: "Trabajos — subtítulo",
        type: "textarea",
        default: "Algunos de nuestros trabajos más recientes.",
      },
      { key: "pageNosotrosTitle", label: "Nosotros — título", default: "Nosotros" },
      {
        key: "pageNosotrosSubtitle",
        label: "Nosotros — subtítulo",
        type: "textarea",
        default: "Somos un equipo apasionado por la comunicación visual y la cartelería.",
      },
      { key: "pageProcesoTitle", label: "Proceso — título", default: "Nuestro Proceso" },
      {
        key: "pageProcesoSubtitle",
        label: "Proceso — subtítulo",
        type: "textarea",
        default: "Así trabajamos — de la primera consulta a la instalación final.",
      },
      { key: "pageContactoTitle", label: "Contacto — título", default: "Contacto" },
      {
        key: "pageContactoSubtitle",
        label: "Contacto — subtítulo",
        type: "textarea",
        default: "Contanos tu proyecto y te respondemos a la brevedad.",
      },
    ],
  },
];

/**
 * Campos que se muestran junto a otros existentes en el panel (por ejemplo el
 * botón secundario de la portada o la imagen para redes) y por eso no se
 * listan como grupo propio.
 */
const EXTRA_CONTENT_FIELDS: ContentField[] = [
  {
    key: "heroSecondary",
    label: "Texto del botón secundario",
    default: "Ver trabajos",
    hint: "Botón claro que acompaña al botón principal de la portada.",
  },
  {
    key: "ogImage",
    label: "Imagen para redes (link compartido)",
    type: "image",
    default: "",
    placeholder: "/images/og.png",
    hint: "Imagen que se muestra cuando se comparte el sitio en WhatsApp, Facebook o Twitter. Recomendado 1200x630. Si está vacía se usa el logo.",
  },
];

export const CONTENT_FIELDS: ContentField[] = [
  ...CONTENT_GROUPS.flatMap((group) => group.fields),
  ...EXTRA_CONTENT_FIELDS,
];

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  CONTENT_FIELDS.map((field) => [field.key, field.default])
);

export const CONTENT_KEYS = new Set(CONTENT_FIELDS.map((field) => field.key));

function parseObject(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * Devuelve el contenido efectivo del sitio: valores guardados por encima de
 * los valores por defecto del registro.
 */
export function getContent(raw: string | null | undefined): Record<string, string> {
  const stored = parseObject(raw);
  const result: Record<string, string> = { ...CONTENT_DEFAULTS };
  for (const key of CONTENT_KEYS) {
    const value = stored[key];
    if (typeof value === "string") result[key] = value;
  }
  return result;
}

export function pickContentValues(
  values: Record<string, unknown>
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of CONTENT_KEYS) {
    const value = values[key];
    if (typeof value === "string") result[key] = value.trim();
  }
  return result;
}
