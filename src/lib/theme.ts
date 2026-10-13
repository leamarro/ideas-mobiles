export interface ThemeField {
  key: string;
  label: string;
  default: string;
  hint?: string;
}

/**
 * Colores globales del sitio. Se inyectan como variables CSS en el layout,
 * sobreescribiendo los tokens de marca definidos en globals.css.
 */
export const THEME_FIELDS: ThemeField[] = [
  {
    key: "accent",
    label: "Color principal (acento)",
    default: "#e30613",
    hint: "Botones, enlaces y palabras destacadas. Es el color rojo de la marca.",
  },
  {
    key: "accentDark",
    label: "Color de acento (al pasar el mouse)",
    default: "#c70410",
    hint: "Versión más oscura del color principal, para los botones al pasar el mouse.",
  },
  {
    key: "heading",
    label: "Color de títulos",
    default: "#09090b",
    hint: "Color de los títulos de sección sobre fondo claro.",
  },
  {
    key: "body",
    label: "Color de texto general",
    default: "#18181b",
    hint: "Color base del texto del sitio.",
  },
  {
    key: "taglineColor",
    label: "Color de la frase del encabezado",
    default: "#71717a",
    hint: "Color del texto que aparece al lado del logo, en la barra superior.",
  },
  {
    key: "background",
    label: "Color de fondo",
    default: "#ffffff",
    hint: "Fondo general del sitio.",
  },
];

export const THEME_DEFAULTS: Record<string, string> = Object.fromEntries(
  THEME_FIELDS.map((field) => [field.key, field.default])
);

export const THEME_KEYS = new Set(THEME_FIELDS.map((field) => field.key));

const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function normalizeHex(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!HEX_PATTERN.test(trimmed)) return null;
  if (trimmed.length === 4) {
    return `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`.toLowerCase();
  }
  return trimmed.toLowerCase();
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = normalizeHex(hex) ?? "#000000";
  return [
    parseInt(normalized.slice(1, 3), 16),
    parseInt(normalized.slice(3, 5), 16),
    parseInt(normalized.slice(5, 7), 16),
  ];
}

/** Mezcla `hex` con `target` (0 = todo hex, 1 = todo target). */
function mix(hex: string, target: string, weight: number): string {
  const [r1, g1, b1] = hexToRgb(hex);
  const [r2, g2, b2] = hexToRgb(target);
  const blend = (a: number, b: number) => Math.round(a * (1 - weight) + b * weight);
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(blend(r1, r2))}${toHex(blend(g1, g2))}${toHex(blend(b1, b2))}`;
}

function parseTheme(raw: string | null | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function getTheme(raw: string | null | undefined): Record<string, string> {
  const stored = parseTheme(raw);
  const result: Record<string, string> = { ...THEME_DEFAULTS };
  for (const key of THEME_KEYS) {
    const value = normalizeHex(stored[key]);
    if (value) result[key] = value;
  }
  return result;
}

export function pickThemeValues(values: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of THEME_KEYS) {
    const value = normalizeHex(values[key]);
    if (value) result[key] = value;
  }
  return result;
}

/** Variables CSS que se inyectan en el layout a partir del tema elegido. */
export function themeCssVariables(theme: Record<string, string>): Record<string, string> {
  const accent = normalizeHex(theme.accent) ?? THEME_DEFAULTS.accent;
  const accentDark = normalizeHex(theme.accentDark) ?? THEME_DEFAULTS.accentDark;
  const heading = normalizeHex(theme.heading) ?? THEME_DEFAULTS.heading;
  const body = normalizeHex(theme.body) ?? THEME_DEFAULTS.body;
  const background = normalizeHex(theme.background) ?? THEME_DEFAULTS.background;
  const tagline = normalizeHex(theme.taglineColor) ?? THEME_DEFAULTS.taglineColor;

  return {
    "--color-brand-red-50": mix(accent, "#ffffff", 0.92),
    "--color-brand-red-100": mix(accent, "#ffffff", 0.85),
    "--color-brand-red-500": accent,
    "--color-brand-red-600": accentDark,
    "--color-heading": heading,
    "--color-body": body,
    "--color-background": background,
    "--color-tagline": tagline,
  };
}

export function themeCssText(theme: Record<string, string>): string {
  const vars = themeCssVariables(theme);
  const body = Object.entries(vars)
    .map(([key, value]) => `${key}:${value};`)
    .join("");
  // `:root:root` tiene mayor especificidad que el `:root` generado por
  // Tailwind, así el tema del admin gana sin depender del orden del CSS.
  return `:root:root{${body}}`;
}
