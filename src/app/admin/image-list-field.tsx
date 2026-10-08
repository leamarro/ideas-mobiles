"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, ImagePlus, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { uploadImageProps } from "@/lib/upload-urls";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

const inputClass =
  "w-full bg-brand-grey-50 border-2 border-brand-grey-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-brand-red-500";
const labelClass =
  "block text-sm font-display font-semibold text-brand-black mb-1 uppercase";

interface ImageListFieldProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export function ImageListField({ value, onChange, label = "Imágenes" }: ImageListFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { toast, showToast } = useToast();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (file.size > MAX_BYTES) {
      showToast("La imagen no puede superar los 5MB", "error");
      return;
    }

    if (!ACCEPTED_TYPES.includes(file.type)) {
      showToast("Formato no permitido. Usá JPG, PNG, WebP o GIF", "error");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        showToast(data.error || "No se pudo subir la imagen", "error");
        return;
      }

      onChange([...value, data.url]);
      showToast("Imagen subida", "success");
    } catch {
      showToast("Error de conexión al subir", "error");
    } finally {
      setUploading(false);
    }
  }

  function updateAt(index: number, url: string) {
    onChange(value.map((item, i) => (i === index ? url : item)));
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function moveAt(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="space-y-2">
        {value.length === 0 && (
          <p className="rounded-lg border-2 border-dashed border-brand-grey-200 px-4 py-6 text-center text-sm text-brand-grey-500">
            Todavía no hay imágenes. Subí una o pegá la URL de una imagen existente.
          </p>
        )}

        {value.map((url, index) => (
          <div
            key={`${index}-${url.slice(-12)}`}
            className="flex items-start gap-2 rounded-lg border-2 border-brand-grey-100 bg-brand-grey-50/60 p-2"
          >
            {url && (
              <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 border-brand-grey-200 bg-brand-grey-50">
                <Image
                  src={url}
                  alt="Vista previa"
                  fill
                  sizes="80px"
                  className="object-cover"
                  {...uploadImageProps(url)}
                />
              </div>
            )}
            <input
              type="text"
              className={`${inputClass} !py-2 text-sm`}
              value={url}
              placeholder="/images/imagen-fondo2.png"
              onChange={(e) => updateAt(index, e.target.value)}
            />
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => moveAt(index, -1)}
                disabled={index === 0}
                className="rounded border-2 border-brand-grey-200 bg-white p-1 text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500 disabled:opacity-40"
                aria-label="Subir imagen en el orden"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => moveAt(index, 1)}
                disabled={index === value.length - 1}
                className="rounded border-2 border-brand-grey-200 bg-white p-1 text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500 disabled:opacity-40"
                aria-label="Bajar imagen en el orden"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => removeAt(index)}
              className="shrink-0 rounded border-2 border-brand-grey-200 bg-white p-2 text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500"
              aria-label="Quitar imagen"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(",")}
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-1.5 rounded border-2 border-brand-grey-200 bg-white px-3 py-2 text-xs font-display font-semibold uppercase text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500 disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <ImagePlus className="h-3.5 w-3.5" />
                Agregar imagen
              </>
            )}
          </button>
        </div>
      </div>

      {toast && (
        <p
          className={`mt-2 text-xs font-medium ${
            toast.type === "error" ? "text-brand-red-500" : "text-green-600"
          }`}
          role="alert"
        >
          {toast.message}
        </p>
      )}
    </div>
  );
}
