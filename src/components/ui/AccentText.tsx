import { Fragment } from "react";

interface AccentTextProps {
  text: string;
  /** Clase aplicada a la parte marcada con llaves. */
  accentClassName?: string;
}

/**
 * Renderiza un texto donde la parte entre llaves se pinta con el color de
 * acento. Ej.: "Nuestros {Servicios}" -> "Nuestros " + "Servicios" en acento.
 */
export function AccentText({ text, accentClassName = "text-brand-red-500" }: AccentTextProps) {
  const parts = text.split(/(\{[^}]*\})/g).filter((part) => part.length > 0);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("{") && part.endsWith("}")) {
          return (
            <span key={index} className={accentClassName}>
              {part.slice(1, -1)}
            </span>
          );
        }
        return <Fragment key={index}>{part}</Fragment>;
      })}
    </>
  );
}
