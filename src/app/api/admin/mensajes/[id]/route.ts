import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body.read !== "boolean") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const item = await prisma.contactMessage.update({ where: { id }, data: { read: body.read } });

  revalidatePath("/admin/mensajes");
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Mensaje no encontrado" }, { status: 404 });

  await prisma.contactMessage.delete({ where: { id } });

  revalidatePath("/admin/mensajes");
  return NextResponse.json({ ok: true });
}
