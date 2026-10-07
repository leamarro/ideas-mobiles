"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { ImageField } from "./image-field";

export interface SettingsField {
  name: string;
  label: string;
  type?: "text" | "textarea" | "image";
  placeholder?: string;
  hint?: string;
}

export interface SettingsSection {
  title: string;
  description?: string;
  fields: SettingsField[];
}

interface SettingsFormProps {
  initial: Record<string, string>;
  fields?: SettingsField[];
  sections?: SettingsSection[];
  title?: string;
}

const inputClass =
  "w-full bg-brand-grey-50 border-2 border-brand-grey-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-brand-red-500";
const labelClass =
  "block text-sm font-display font-semibold text-brand-black mb-1 uppercase";
const hintClass = "mt-1 text-xs leading-relaxed text-brand-grey-500";

export function SettingsForm({ initial, fields, sections, title }: SettingsFormProps) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const groups: SettingsSection[] =
    sections ??
    (fields?.length ? [{ title: "", description: undefined, fields }] : []);
  const allFields = groups.flatMap((group) => group.fields);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: Record<string, string> = {};
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

  function setValue(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-brand-grey-200 rounded-lg p-6 space-y-6"
    >
      {title && (
        <h2 className="font-display font-semibold text-lg text-brand-black uppercase">
          {title}
        </h2>
      )}

      {toast && (
        <div
          className={`rounded-lg px-4 py-3 text-sm font-medium text-white ${
            toast.type === "error" ? "bg-brand-red-500" : "bg-green-600"
          }`}
          role="alert"
        >
          {toast.message}
        </div>
      )}

      {groups.map((group, index) => (
        <div
          key={group.title || index}
          className={index > 0 ? "border-t-2 border-brand-grey-100 pt-6" : undefined}
        >
          {group.title && (
            <div className="mb-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-brand-black">
                {group.title}
              </h3>
              {group.description && (
                <p className="mt-1 text-xs leading-relaxed text-brand-grey-600">
                  {group.description}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {group.fields.map((field) => (
              <div
                key={field.name}
                className={
                  field.type === "textarea" || field.type === "image"
                    ? "md:col-span-2"
                    : undefined
                }
              >
                {field.type === "image" ? (
                  <>
                    <ImageField
                      label={field.label}
                      value={values[field.name] ?? ""}
                      onChange={(value) => setValue(field.name, value)}
                      placeholder={field.placeholder}
                    />
                    {field.hint && <p className={hintClass}>{field.hint}</p>}
                  </>
                ) : (
                  <>
                    <label htmlFor={field.name} className={labelClass}>
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        rows={3}
                        className={inputClass}
                        placeholder={field.placeholder}
                        value={values[field.name] ?? ""}
                        onChange={(e) => setValue(field.name, e.target.value)}
                      />
                    ) : (
                      <input
                        id={field.name}
                        type="text"
                        className={inputClass}
                        placeholder={field.placeholder}
                        value={values[field.name] ?? ""}
                        onChange={(e) => setValue(field.name, e.target.value)}
                      />
                    )}
                    {field.hint && <p className={hintClass}>{field.hint}</p>}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {error && (
        <p className="text-brand-red-500 text-sm font-medium" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="bg-brand-black hover:bg-brand-dark text-white font-display font-semibold px-6 py-3 rounded-lg text-sm transition-colors uppercase disabled:opacity-60"
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
    </form>
  );
}
