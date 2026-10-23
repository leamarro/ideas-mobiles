"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { PortfolioCategoryOption, PortfolioItem } from "@/types/portfolio";
import { useToast } from "@/hooks/useToast";
import { ImageField } from "@/app/admin/image-field";
import { uploadImageProps } from "@/lib/upload-urls";

interface FormState {
  id?: string;
  title: string;
  description: string;
  image: string;
  category: string;
  newCategory: string;
  order: number;
  published: boolean;
}

const NEW_CATEGORY = "__nueva__";

const emptyForm = (order: number): FormState => ({
  title: "",
  description: "",
  image: "",
  category: "",
  newCategory: "",
  order,
  published: true,
});

const inputClass =
  "w-full bg-brand-grey-50 border-2 border-brand-grey-200 rounded-lg px-4 py-3 text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-red-500 focus:border-brand-red-500";
const labelClass =
  "block text-sm font-display font-semibold text-brand-black mb-1 uppercase";

interface AdminTrabajosProps {
  initialItems: PortfolioItem[];
  categories: PortfolioCategoryOption[];
}

export function AdminTrabajos({ initialItems, categories }: AdminTrabajosProps) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const categoryName = (slug: string) =>
    categories.find((cat) => cat.slug === slug)?.name ?? slug;

  // Un trabajo viejo puede tener una categoría que ya no está en la tabla:
  // se agrega igual para que el select no la pierda al editarlo.
  const editingCategory = form?.category;
  const hasEditingCategory =
    !editingCategory ||
    editingCategory === NEW_CATEGORY ||
    categories.some((cat) => cat.slug === editingCategory);
  const categoryOptions = hasEditingCategory
    ? categories
    : [...categories, { slug: editingCategory, name: editingCategory }];

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
      newCategory: "",
      order: item.order,
      published: item.published,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setFormError(null);

    let category = form.category;

    if (category === NEW_CATEGORY) {
      try {
        const response = await fetch("/api/admin/categorias", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.newCategory }),
        });
        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          setFormError(data.error || "No se pudo crear la categoría");
          setSaving(false);
          return;
        }

        category = data.slug;
        // Si falla el guardado del trabajo, el reintento usa la categoría ya creada.
        setForm({ ...form, category, newCategory: "" });
      } catch {
        setFormError("Error de conexión");
        setSaving(false);
        return;
      }
    }

    const payload = {
      title: form.title,
      description: form.description,
      image: form.image,
      category,
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

  async function handleDeleteCategory(category: PortfolioCategoryOption) {
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;

    const response = await fetch("/api/admin/categorias", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: category.slug }),
    });
    const data = await response.json().catch(() => ({}));

    if (response.ok) {
      showToast("Categoría eliminada", "success");
      router.refresh();
    } else {
      showToast(data.error || "No se pudo eliminar la categoría", "error");
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
                Título (opcional)
              </label>
              <input
                id="title"
                className={inputClass}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })
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
                  <option key={cat.slug} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
                <option value={NEW_CATEGORY}>+ Nueva categoría…</option>
              </select>

              {form.category === NEW_CATEGORY && (
                <div className="mt-3">
                  <label htmlFor="newCategory" className={labelClass}>
                    Nombre de la nueva categoría
                  </label>
                  <input
                    id="newCategory"
                    className={inputClass}
                    value={form.newCategory}
                    onChange={(e) => setForm({ ...form, newCategory: e.target.value })}
                    placeholder="Ej: Stands y exhibidores"
                    minLength={2}
                    maxLength={40}
                    required
                    autoFocus
                  />
                  <p className="mt-1 text-xs text-brand-dark">
                    Se agrega como filtro en la sección de trabajos del sitio.
                  </p>
                </div>
              )}
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
                <td className="px-4 py-3 text-brand-dark">{categoryName(item.category)}</td>
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

      <div className="mt-8 bg-white border-2 border-brand-grey-200 rounded-lg p-6">
        <h2 className="font-display font-semibold text-lg text-brand-black uppercase mb-1">
          Categorías
        </h2>
        <p className="text-sm text-brand-dark mb-4">
          En el sitio solo se muestran las que tienen trabajos publicados. Para borrar una
          categoría no tiene que tener ningún trabajo.
        </p>
        <ul className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const itemsCount = initialItems.filter((item) => item.category === category.slug).length;
            return (
              <li
                key={category.slug}
                className="inline-flex items-center gap-2 rounded-full border-2 border-brand-grey-200 bg-brand-grey-50 py-1 pl-4 pr-1 text-sm"
              >
                <span className="font-medium text-brand-black">{category.name}</span>
                <span className="text-xs text-brand-dark">({itemsCount})</span>
                <button
                  type="button"
                  onClick={() => handleDeleteCategory(category)}
                  disabled={itemsCount > 0}
                  title={
                    itemsCount > 0
                      ? "Tiene trabajos asociados: pasalos a otra categoría para poder borrarla"
                      : `Eliminar ${category.name}`
                  }
                  className="rounded-full p-1.5 text-brand-dark transition-colors hover:bg-white hover:text-brand-red-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-brand-dark"
                  aria-label={`Eliminar categoría ${category.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
