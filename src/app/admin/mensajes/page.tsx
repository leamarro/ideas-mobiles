import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { AdminMensajes } from "./AdminMensajes";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mensajes | Ideas Móviles Admin",
  description: "Bandeja de mensajes del formulario de contacto.",
};

export default async function AdminMensajesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminMensajes
      initialMessages={messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
    />
  );
}
