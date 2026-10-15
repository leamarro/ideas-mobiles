import { Fragment } from "react";

interface RichTextProps {
  text: string;
  /** Clase aplicada a la parte marcada con llaves. */
  accentClassName?: string;
  /** Clase aplicada a la parte marcada con doble asterisco. */
  boldClassName?: string;
}

const TOKEN_REGEX = /(\{[^}]*\}|\*\*[^*]+\*\*)/g;
const ACCENT_REGEX = /^\{[\s\S]*\}$/;
const BOLD_REGEX = /^\*\*[\s\S]+\*\*$/;

/**
 * Renderiza texto enriquecido con dos convenciones simples:
 * - `{palabra}` se pinta con el color de acento.
 * - `**palabra**` se muestra en negrita.
 *
 * Ej.: "Nuestros {Servicios}" -> "Servicios" en acento.
 *      "Esto es **importante**" -> "importante" en negrita.
 */
export function RichText({
  text,
  accentClassName = "text-brand-red-500",
  boldClassName = "font-bold",
}: RichTextProps) {
  const parts = text.split(TOKEN_REGEX).filter((part) => part.length > 0);

  return (
    <>
      {parts.map((part, index) => {
        if (ACCENT_REGEX.test(part)) {
          return (
            <span key={index} className={accentClassName}>
              {part.slice(1, -1)}
            </span>
          );
        }
        if (BOLD_REGEX.test(part)) {
          return (
            <strong key={index} className={boldClassName}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}

/**
 * Alias de compatibilidad: mismo render que `RichText` conservando el color de
 * acento por defecto. Se mantiene el nombre por los usos existentes en títulos.
 */
export function AccentText({ text, accentClassName }: { text: string; accentClassName?: string }) {
  return <RichText text={text} accentClassName={accentClassName} />;
}
