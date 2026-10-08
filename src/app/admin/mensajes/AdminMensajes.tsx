"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, MailOpen, Paperclip, Trash2 } from "lucide-react";
import type { Mensaje } from "@/types/message";
import { useToast } from "@/hooks/useToast";
import { uploadImageProps } from "@/lib/upload-urls";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminMensajes({ initialMessages }: { initialMessages: Mensaje[] }) {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleToggleRead(item: Mensaje) {
    setBusyId(item.id);
    const response = await fetch(`/api/admin/mensajes/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !item.read }),
    });

    if (response.ok) {
      showToast(item.read ? "Mensaje marcado como no leído" : "Mensaje marcado como leído", "success");
      router.refresh();
    } else {
      showToast("No se pudo cambiar el estado", "error");
    }
    setBusyId(null);
  }

  async function handleDelete(item: Mensaje) {
    if (!confirm(`¿Eliminar el mensaje de "${item.name}"? Esta acción no se puede deshacer.`)) return;

    setBusyId(item.id);
    const response = await fetch(`/api/admin/mensajes/${item.id}`, { method: "DELETE" });

    if (response.ok) {
      showToast("Mensaje eliminado", "success");
      router.refresh();
    } else {
      showToast("No se pudo eliminar el mensaje", "error");
    }
    setBusyId(null);
  }

  const unread = initialMessages.filter((m) => !m.read).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold uppercase text-brand-black">Mensajes</h1>
        {unread > 0 && (
          <span className="rounded-full bg-brand-red-500 px-3 py-1 text-xs font-display font-semibold uppercase text-white">
            {unread} sin leer
          </span>
        )}
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

      <div className="overflow-hidden rounded-lg border-2 border-brand-grey-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-grey-50 text-xs uppercase text-brand-dark">
            <tr>
              <th className="px-4 py-3 font-display font-semibold">Fecha</th>
              <th className="px-4 py-3 font-display font-semibold">Nombre</th>
              <th className="px-4 py-3 font-display font-semibold">Empresa</th>
              <th className="px-4 py-3 font-display font-semibold">Servicio</th>
              <th className="px-4 py-3 font-display font-semibold">Mensaje</th>
              <th className="px-4 py-3 font-display font-semibold">Estado</th>
              <th className="px-4 py-3 text-right font-display font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-grey-200">
            {initialMessages.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-brand-dark">
                  No hay mensajes todavía. Los envíos del formulario aparecen acá.
                </td>
              </tr>
            )}
            {initialMessages.map((item) => (
              <tr
                key={item.id}
                className={item.read ? "hover:bg-brand-grey-50" : "bg-brand-red-500/5 hover:bg-brand-grey-50"}
              >
                <td className="whitespace-nowrap px-4 py-3 text-brand-dark">{formatDate(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`block font-medium text-brand-black ${item.read ? "" : "font-semibold"}`}
                  >
                    {item.name}
                  </span>
                  {item.whatsapp && (
                    <a
                      href={`https://wa.me/${item.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-brand-red-500 underline"
                    >
                      {item.whatsapp}
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 text-brand-dark">{item.empresa || "—"}</td>
                <td className="px-4 py-3 text-brand-dark">{item.service || "—"}</td>
                <td className="max-w-md px-4 py-3">
                  <span className="line-clamp-3 text-brand-dark" title={item.message}>
                    {item.message}
                  </span>
                  {item.image && (
                    <a
                      href={item.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs text-brand-red-500 underline"
                      {...(item.image.startsWith("/api/uploads/")
                        ? uploadImageProps(item.image)
                        : {})}
                    >
                      <Paperclip className="h-3 w-3" />
                      ver adjunto
                    </a>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      item.read
                        ? "bg-green-100 text-green-700"
                        : "bg-brand-red-500 text-white"
                    }`}
                  >
                    {item.read ? <Check className="h-3 w-3" /> : <MailOpen className="h-3 w-3" />}
                    {item.read ? "Leído" : "Nuevo"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => handleToggleRead(item)}
                      className="rounded border border-brand-grey-200 px-2 py-2 text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500 disabled:opacity-60"
                      aria-label={item.read ? `Marcar como no leído` : `Marcar como leído`}
                    >
                      <MailOpen className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item.id}
                      onClick={() => handleDelete(item)}
                      className="rounded border border-brand-grey-200 p-2 text-brand-dark transition-colors hover:border-brand-red-500 hover:text-brand-red-500 disabled:opacity-60"
                      aria-label={`Eliminar mensaje de ${item.name}`}
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
