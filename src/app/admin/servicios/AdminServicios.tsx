"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { Service } from "@/types/service";
import { useToast } from "@/hooks/useToast";
import { ImageField } from "@/app/admin/image-field";
import { uploadImageProps } from "@/lib/upload-urls";

interface FormState {
  id?: string;
  title: string;
  description: string;
  image: string;
  category: string;
  order: number;
  published: boolean;
}

const emptyForm = (order: number): FormState => ({
  title: "",
  description: "",
  image: "",
  category: "",
  order,
  published: true,
});

const inputClass =
  "w-full bg-brand-grey-50 border-2 border-brand-grey-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-brand-red-500";
const labelClass =
  "block text-sm font-display font-semibold text-brand-black mb-1 uppercase";

export function AdminServicios({ initialServices }: { initialServices: Service[] }) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openCreate() {
    setFormError(null);
    setForm(
      emptyForm(initialServices.length ? Math.max(...initialServices.map((s) => s.order)) + 1 : 1)
    );
  }

  function openEdit(service: Service) {
    setFormError(null);
    setForm({
      id: service.id,
      title: service.title,
      description: service.description,
      image: service.image ?? "",
      category: service.category ?? "",
      order: service.order,
      published: service.published,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setFormError(null);

    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      category: form.category,
      order: form.order,
      published: form.published,
    };

    try {
      const response = await fetch(
        form.id ? `/api/admin/servicios/${form.id}` : "/api/admin/servicios",
        {
          method: form.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFormError(data.error || "No se pudo guardar el servicio");
        setSaving(false);
        return;
      }

      showToast(form.id ? "Servicio actualizado" : "Servicio creado", "success");
      setForm(null);
      router.refresh();
    } catch {
      setFormError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(service: Service) {
    const response = await fetch(`/api/admin/servicios/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !service.published }),
    });

    if (response.ok) {
      showToast(service.published ? "Servicio despublicado" : "Servicio publicado", "success");
      router.refresh();
    } else {
      showToast("No se pudo cambiar el estado", "error");
    }
  }

  async function handleDelete(service: Service) {
    if (!confirm(`¿Eliminar "${service.title}"? Esta acción no se puede deshacer.`)) return;

    const response = await fetch(`/api/admin/servicios/${service.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showToast("Servicio eliminado", "success");
      router.refresh();
    } else {
      showToast("No se pudo eliminar el servicio", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-brand-black uppercase">
          Servicios
        </h1>
        <button
          type="button"
          onClick={form ? () => setForm(null) : openCreate}
          className="bg-brand-black hover:bg-brand-dark text-white font-display font-semibold px-4 py-2 rounded text-sm transition-colors uppercase"
        >
          {form ? "Cancelar" : (
            <span className="inline-flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Nuevo Servicio
            </span>
          )}
        </button>
      </div>

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

      {form && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white border-2 border-brand-grey-200 rounded-lg p-6 space-y-4"
        >
          <h2 className="font-display font-semibold text-lg text-brand-black uppercase">
            {form.id ? "Editar Servicio" : "Nuevo Servicio"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className={labelClass}>
                Título
              </label>
              <input
                id="title"
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Descripción
              </label>
              <textarea
                id="description"
                rows={3}
                className={inputClass}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <ImageField
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
            />

            <div>
              <label htmlFor="category" className={labelClass}>
                Categoría
              </label>
              <input
                id="category"
                className={inputClass}
                placeholder="carteleria-comercial"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="order" className={labelClass}>
                Orden
              </label>
              <input
                id="order"
                type="number"
                className={inputClass}
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </div>

            <div className="flex items-end gap-2 pb-1">
              <input
                id="published"
                type="checkbox"
                className="h-5 w-5 accent-brand-red-500"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              <label htmlFor="published" className="text-sm font-medium text-brand-dark">
                Publicado
              </label>
            </div>
          </div>

          {formError && (
            <p className="text-brand-red-500 text-sm font-medium" role="alert">
              {formError}
            </p>
          )}

          <div className="flex gap-3">
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
              ) : form.id ? (
                "Guardar cambios"
              ) : (
                "Crear servicio"
              )}
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="bg-white border-2 border-brand-grey-200 hover:border-brand-grey-300 text-brand-dark font-display font-semibold px-6 py-3 rounded-lg text-sm transition-colors uppercase"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border-2 border-brand-grey-200 rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-grey-50 text-brand-dark uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-display font-semibold">Imagen</th>
              <th className="px-4 py-3 font-display font-semibold">Título</th>
              <th className="px-4 py-3 font-display font-semibold">Categoría</th>
              <th className="px-4 py-3 font-display font-semibold">Orden</th>
              <th className="px-4 py-3 font-display font-semibold">Estado</th>
              <th className="px-4 py-3 font-display font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-grey-200">
            {initialServices.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-dark">
                  No hay servicios. Creá el primero con «Nuevo Servicio».
                </td>
              </tr>
            )}
            {initialServices.map((service) => (
              <tr key={service.id} className="hover:bg-brand-grey-50">
                <td className="px-4 py-3">
                  {service.image?.startsWith("/") ? (
                    <div className="relative h-10 w-16 overflow-hidden rounded border border-brand-grey-200">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                        {...uploadImageProps(service.image)}
                      />
                    </div>
                  ) : service.image ? (
                    <a
                      href={service.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-red-500 underline"
                    >
                      ver imagen
                    </a>
                  ) : (
                    <span className="text-brand-grey-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-brand-black">{service.title}</td>
                <td className="px-4 py-3 text-brand-dark">{service.category || "—"}</td>
                <td className="px-4 py-3 text-brand-dark">{service.order}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(service)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors ${
                      service.published
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-brand-grey-200 text-brand-dark hover:bg-brand-grey-300"
                    }`}
                  >
                    {service.published ? "Publicado" : "Oculto"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(service)}
                      className="rounded border border-brand-grey-200 p-2 text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500"
                      aria-label={`Editar ${service.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(service)}
                      className="rounded border border-brand-grey-200 p-2 text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500"
                      aria-label={`Eliminar ${service.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
