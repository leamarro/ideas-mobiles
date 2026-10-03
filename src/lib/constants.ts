export const SITE_NAME = "Ideas Móviles";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const DEFAULT_IMAGE = "/images/placeholder.svg";

export const CONTACT_PLACEHOLDERS = {
  whatsapp: "+54 291 454 3333",
  phone: "+54 291 454 3333",
  email: "ideasmoviles@gmail.com",
  instagram: "@IDEASMOVILES",
  facebook: "IDEAS MOVILES",
  address: "Dirección pendiente de confirmar",
} as const;

export const WHATSAPP_MESSAGE_TEMPLATES = {
  default: "Hola, quisiera consultar sobre nuestros servicios.",
  carteleria: "Hola, quisiera consultar por un trabajo de cartelería comercial.",
  corpóreas: "Hola, quisiera consultar por letras corpóreas o carteles.",
  vinilos: "Hola, quisiera consultar por trabajos de vinilos o esmerilados.",
  vehicular: "Hola, quisiera consultar por gráfica vehicular publicitaria.",
  imprenta: "Hola, quisiera consultar por servicios de imprenta digital.",
  senalizacion: "Hola, quisiera consultar por señalética.",
} as const;
