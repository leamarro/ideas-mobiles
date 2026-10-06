"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { PortfolioItem } from "@/types/portfolio";
import { PORTFOLIO_CATEGORIES, PORTFOLIO_CATEGORY_LABELS } from "@/types/portfolio";
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

const categoryOptions = PORTFOLIO_CATEGORIES.filter((cat) => cat !== "todos");

export function AdminTrabajos({ initialItems }: { initialItems: PortfolioItem[] }) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function openCreate() {
    setFormError(null);
    setForm(
      emptyForm(initialItems.length ? Math.max(...initialItems.map((i) => i.order)) + 1 : 1)
    );
  }

  function openEdit(item: PortfolioItem) {
    setFormError(null);
    setForm({
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      image: item.image,
      category: item.category,
      order: item.order,
      published: item.published,
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
        form.id ? `/api/admin/trabajos/${form.id}` : "/api/admin/trabajos",
        {
          method: form.id ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFormError(data.error || "No se pudo guardar el trabajo");
        setSaving(false);
        return;
      }

      showToast(form.id ? "Trabajo actualizado" : "Trabajo creado", "success");
      setForm(null);
      router.refresh();
    } catch {
      setFormError("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(item: PortfolioItem) {
    const response = await fetch(`/api/admin/trabajos/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });

    if (response.ok) {
      showToast(item.published ? "Trabajo despublicado" : "Trabajo publicado", "success");
      router.refresh();
    } else {
      showToast("No se pudo cambiar el estado", "error");
    }
  }

  async function handleDelete(item: PortfolioItem) {
    if (!confirm(`¿Eliminar "${item.title}"? Esta acción no se puede deshacer.`)) return;

    const response = await fetch(`/api/admin/trabajos/${item.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      showToast("Trabajo eliminado", "success");
      router.refresh();
    } else {
      showToast("No se pudo eliminar el trabajo", "error");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl text-brand-black uppercase">Trabajos</h1>
        <button
          type="button"
          onClick={form ? () => setForm(null) : openCreate}
          className="bg-brand-black hover:bg-brand-dark text-white font-display font-semibold px-4 py-2 rounded text-sm transition-colors uppercase"
        >
          {form ? "Cancelar" : (
            <span className="inline-flex items-center gap-1.5">
              <Plus className="h-4 w-4" />
              Nuevo Trabajo
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
            {form.id ? "Editar Trabajo" : "Nuevo Trabajo"}
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

            <ImageField
              value={form.image}
              onChange={(url) => setForm({ ...form, image: url })}
            />

            <div>
              <label htmlFor="category" className={labelClass}>
                Categoría
              </label>
              <select
                id="category"
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Seleccioná una categoría</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {PORTFOLIO_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className={labelClass}>
                Descripción (opcional)
              </label>
              <textarea
                id="description"
                rows={2}
                className={inputClass}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                "Crear trabajo"
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
            {initialItems.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-brand-dark">
                  No hay trabajos. Creá el primero con «Nuevo Trabajo».
                </td>
              </tr>
            )}
            {initialItems.map((item) => (
              <tr key={item.id} className="hover:bg-brand-grey-50">
                <td className="px-4 py-3">
                  {item.image.startsWith("/") ? (
                    <div className="relative h-10 w-16 overflow-hidden rounded border border-brand-grey-200">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-cover"
                        {...uploadImageProps(item.image)}
                      />
                    </div>
                  ) : (
                    <a
                      href={item.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-red-500 underline"
                    >
                      ver imagen
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-brand-black">{item.title}</td>
                <td className="px-4 py-3 text-brand-dark">{item.category}</td>
                <td className="px-4 py-3 text-brand-dark">{item.order}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleToggle(item)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase transition-colors ${
                      item.published
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-brand-grey-200 text-brand-dark hover:bg-brand-grey-300"
                    }`}
                  >
                    {item.published ? "Publicado" : "Oculto"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded border border-brand-grey-200 p-2 text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500"
                      aria-label={`Editar ${item.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="rounded border border-brand-grey-200 p-2 text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500"
                      aria-label={`Eliminar ${item.title}`}
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
