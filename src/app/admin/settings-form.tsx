"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { Bold, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { AccentText, RichText } from "@/components/ui/AccentText";
import { ImageField } from "./image-field";
import { ImageListField } from "./image-list-field";

export interface SettingsField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "image" | "image-list" | "color" | "accent";
  placeholder?: string;
  hint?: string;
  recommended?: string;
}

export interface SettingsSection {
  title: string;
  description?: string;
  fields: SettingsField[];
}

interface SettingsFormProps {
  initial: Record<string, string | string[]>;
  fields?: SettingsField[];
  sections?: SettingsSection[];
  title?: string;
}

const inputClass =
  "w-full bg-brand-grey-50 border-2 border-brand-grey-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-brand-red-500";
const labelClass =
  "block text-sm font-display font-semibold text-brand-black mb-1 uppercase";
const hintClass = "mt-1 text-xs leading-relaxed text-brand-grey-500";

function RecommendedBadge({ size }: { size: string }) {
  return (
    <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-brand-grey-200 bg-brand-grey-50 px-3 py-1 text-xs font-medium text-brand-dark">
      <ImageIcon className="h-3.5 w-3.5 text-brand-red-500" />
      Tamaño recomendado: <strong className="font-semibold">{size}</strong>
    </p>
  );
}

interface AccentParts {
  before: string;
  accent: string;
  after: string;
}

function splitAccent(value: string): AccentParts {
  const match = value.match(/^([\s\S]*?)\{([^}]*)\}([\s\S]*)$/);
  if (match) {
    return { before: match[1], accent: match[2], after: match[3] };
  }
  return { before: value, accent: "", after: "" };
}

function joinAccent(parts: AccentParts): string {
  if (!parts.accent) return `${parts.before}${parts.after}`;
  return `${parts.before}{${parts.accent}}${parts.after}`;
}

function asString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value : "";
}

interface BoldTextFieldProps {
  id: string;
  multiline?: boolean;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

function BoldTextField({ id, multiline, value, placeholder, onChange }: BoldTextFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function applyBold() {
    const el = multiline ? textareaRef.current : inputRef.current;
    if (!el) return;

    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);
    const next = selected
      ? `${before}**${selected}**${after}`
      : `${before}****${after}`;

    onChange(next);

    const caret = start + 2;
    const caretEnd = end + 2;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(caret, caretEnd);
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={applyBold}
          className="inline-flex items-center gap-1.5 rounded border-2 border-brand-grey-200 bg-white px-3 py-1.5 text-xs font-display font-semibold uppercase text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500"
          title="Poner en negrita lo seleccionado"
        >
          <Bold className="h-3.5 w-3.5" />
          Negrita
        </button>
        <span className="text-[11px] leading-relaxed text-brand-grey-500">
          Seleccioná una palabra o frase y tocá Negrita.
        </span>
      </div>

      {multiline ? (
        <textarea
          ref={textareaRef}
          id={id}
          rows={3}
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          ref={inputRef}
          id={id}
          type="text"
          className={inputClass}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {value.trim().length > 0 && (
        <p className="text-xs leading-relaxed text-brand-grey-600">
          Vista previa:{" "}
          <span className="font-display font-semibold text-brand-black">
            <RichText text={value} />
          </span>
        </p>
      )}
    </div>
  );
}

export function SettingsForm({ initial, fields, sections, title }: SettingsFormProps) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [values, setValues] = useState<Record<string, string | string[]>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groups: SettingsSection[] = useMemo(
    () =>
      sections ??
      (fields?.length ? [{ title: "", description: undefined, fields }] : []),
    [sections, fields]
  );
  const showTabs = groups.length > 1;

  const [activeTab, setActiveTab] = useState(0);
  const safeTab = Math.min(activeTab, Math.max(groups.length - 1, 0));
  const visibleGroups = showTabs ? [groups[safeTab]] : groups;

  const allFields = useMemo(() => groups.flatMap((group) => group.fields), [groups]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: Record<string, string | string[]> = {};
      for (const field of allFields) {
        payload[field.name] = values[field.name] ?? "";
      }

      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || "No se pudieron guardar los cambios");
        setSaving(false);
        return;
      }

      showToast("Cambios guardados", "success");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  function setValue(name: string, value: string | string[]) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function renderAccent(field: SettingsField) {
    const value = asString(values[field.name]);
    const parts = splitAccent(value);

    const update = (patch: Partial<AccentParts>) =>
      setValue(field.name, joinAccent({ ...parts, ...patch }));

    return (
      <>
        <label className={labelClass}>{field.label}</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            type="text"
            className={inputClass}
            placeholder="Texto"
            aria-label={`${field.label} — texto`}
            value={parts.before}
            onChange={(e) => update({ before: e.target.value })}
          />
          <input
            type="text"
            className={inputClass}
            placeholder="Palabra en color"
            aria-label={`${field.label} — palabra en color`}
            value={parts.accent}
            onChange={(e) => update({ accent: e.target.value })}
          />
          <input
            type="text"
            className={inputClass}
            placeholder="Texto después (opcional)"
            aria-label={`${field.label} — texto después`}
            value={parts.after}
            onChange={(e) => update({ after: e.target.value })}
          />
        </div>
        <p className={hintClass}>
          La <strong>palabra en color</strong> se pinta con el color de acento.
          Vista previa:{" "}
          <span className="font-display font-semibold text-brand-black">
            <AccentText text={value} />
          </span>
        </p>
      </>
    );
  }

  function renderField(field: SettingsField) {
    const wide =
      field.type === "textarea" ||
      field.type === "image" ||
      field.type === "image-list" ||
      field.type === "accent";

    return (
      <div key={field.name} className={wide ? "md:col-span-2" : undefined}>
        {field.type === "accent" ? (
          renderAccent(field)
        ) : field.type === "image-list" ? (
          <>
            <ImageListField
              label={field.label}
              value={Array.isArray(values[field.name]) ? (values[field.name] as string[]) : []}
              onChange={(value) => setValue(field.name, value)}
            />
            {field.recommended && <RecommendedBadge size={field.recommended} />}
            {field.hint && <p className={hintClass}>{field.hint}</p>}
          </>
        ) : field.type === "image" ? (
          <>
            <ImageField
              label={field.label}
              value={asString(values[field.name])}
              onChange={(value) => setValue(field.name, value)}
              placeholder={field.placeholder}
            />
            {field.recommended && <RecommendedBadge size={field.recommended} />}
            {field.hint && <p className={hintClass}>{field.hint}</p>}
          </>
        ) : field.type === "color" ? (
          <>
            <label htmlFor={field.name} className={labelClass}>
              {field.label}
            </label>
            <div className="flex items-center gap-3">
              <input
                id={field.name}
                type="color"
                className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border-2 border-brand-grey-200 bg-white p-1"
                value={asString(values[field.name]) || "#000000"}
                onChange={(e) => setValue(field.name, e.target.value)}
              />
              <input
                type="text"
                className={inputClass}
                placeholder={field.placeholder ?? "#000000"}
                value={asString(values[field.name])}
                onChange={(e) => setValue(field.name, e.target.value)}
              />
            </div>
            {field.hint && <p className={hintClass}>{field.hint}</p>}
          </>
        ) : (
          <>
            <label htmlFor={field.name} className={labelClass}>
              {field.label}
            </label>
            <BoldTextField
              id={field.name}
              multiline={field.type === "textarea"}
              value={asString(values[field.name])}
              placeholder={field.placeholder}
              onChange={(value) => setValue(field.name, value)}
            />
            {field.hint && <p className={hintClass}>{field.hint}</p>}
          </>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-brand-grey-200 rounded-lg p-6"
    >
      {title && (
        <h2 className="mb-4 font-display font-semibold text-lg text-brand-black uppercase">
          {title}
        </h2>
      )}

      {toast && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium text-white ${
            toast.type === "error" ? "bg-brand-red-500" : "bg-green-600"
          }`}
          role="alert"
        >
          {toast.message}
        </div>
      )}

      {showTabs && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 border-b-2 border-brand-grey-100 pb-3">
            {groups.map((group, index) => (
              <button
                key={group.title || index}
                type="button"
                onClick={() => setActiveTab(index)}
                className={`rounded-full px-3.5 py-2 text-xs font-display font-semibold uppercase tracking-wide transition-colors ${
                  index === safeTab
                    ? "bg-brand-red-500 text-white"
                    : "bg-brand-grey-100 text-brand-grey-600 hover:bg-brand-grey-200"
                }`}
              >
                {group.title}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs leading-relaxed text-brand-grey-500">
            Navegá entre las pestañas y editá solo lo que necesites. Todos los
            cambios se guardan juntos con el botón <strong>Guardar cambios</strong>.
          </p>
        </div>
      )}

      {visibleGroups.map((group, index) => (
        <div key={group.title || index}>
          {group.title && !showTabs && (
            <div className="mb-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-brand-black">
                {group.title}
              </h3>
            </div>
          )}
          {showTabs && group.description && (
            <p className="mb-4 text-sm leading-relaxed text-brand-grey-600">
              {group.description}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {group.fields.map((field) => renderField(field))}
          </div>
        </div>
      ))}

      {error && (
        <p className="mt-4 text-sm font-medium text-brand-red-500" role="alert">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 z-10 -mx-6 mt-6 border-t-2 border-brand-grey-100 bg-white px-6 pt-4 pb-2">
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-brand-black hover:bg-brand-dark text-white font-display font-semibold px-6 py-3 rounded-lg text-sm transition-colors uppercase disabled:opacity-60 sm:w-auto"
        >
          {saving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Guardando...
            </span>
          ) : (
            "Guardar cambios"
          )}
        </button>
      </div>
    </form>
  );
}
