"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { uploadImageProps } from "@/lib/upload-urls";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 5 * 1024 * 1024;

const inputClass =
  "w-full bg-brand-grey-50 border-2 border-brand-grey-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-brand-red-500";
const labelClass =
  "block text-sm font-display font-semibold text-brand-black mb-1 uppercase";

interface ImageFieldProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
}

export function ImageField({
  value,
  onChange,
  label = "Imagen",
  placeholder = "/images/portfolio/portfolio-referencia-01.webp",
}: ImageFieldProps) {
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

      onChange(data.url);
      showToast("Imagen subida", "success");
    } catch {
      showToast("Error de conexión al subir", "error");
    } finally {
      setUploading(false);
    }
  }

  const showPreview = value.startsWith("/");

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <input
            type="text"
            className={inputClass}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-2">
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
                  Subir imagen
                </>
              )}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1.5 rounded border-2 border-brand-grey-200 bg-white px-3 py-2 text-xs font-display font-semibold uppercase text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500"
              >
                <X className="h-3.5 w-3.5" />
                Quitar
              </button>
            )}
          </div>
        </div>

        {value && showPreview && (
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 border-brand-grey-200 bg-brand-grey-50">
            <Image
              src={value}
              alt="Vista previa"
              fill
              sizes="96px"
              className="object-cover"
              {...uploadImageProps(value)}
            />
          </div>
        )}
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
