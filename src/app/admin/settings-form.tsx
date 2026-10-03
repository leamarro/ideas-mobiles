"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/useToast";

export interface SettingsField {
  name: string;
  label: string;
  type?: "text" | "textarea";
  placeholder?: string;
}

interface SettingsFormProps {
  initial: Record<string, string>;
  fields: SettingsField[];
  title?: string;
}

const inputClass =
  "w-full bg-brand-grey-50 border-2 border-brand-grey-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-brand-red-500";
const labelClass =
  "block text-sm font-display font-semibold text-brand-black mb-1 uppercase";

export function SettingsForm({ initial, fields, title }: SettingsFormProps) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload: Record<string, string> = {};
      for (const field of fields) {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-2 border-brand-grey-200 rounded-lg p-6 space-y-4"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div
            key={field.name}
            className={field.type === "textarea" ? "md:col-span-2" : undefined}
          >
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
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
              />
            ) : (
              <input
                id={field.name}
                type="text"
                className={inputClass}
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) => setValues({ ...values, [field.name]: e.target.value })}
              />
            )}
          </div>
        ))}
      </div>

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
