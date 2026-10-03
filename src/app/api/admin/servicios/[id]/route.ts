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

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const data: Record<string, string | number | boolean | null> = {};

  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (!title) return NextResponse.json({ error: "El título no puede estar vacío" }, { status: 400 });
    data.title = title;
  }
  if (typeof body.description === "string") {
    const description = body.description.trim();
    if (!description) return NextResponse.json({ error: "La descripción no puede estar vacía" }, { status: 400 });
    data.description = description;
  }
  if (typeof body.image === "string") data.image = body.image.trim() || null;
  if (typeof body.category === "string") data.category = body.category.trim() || null;
  if (body.order !== undefined && Number.isFinite(Number(body.order))) {
    data.order = Math.trunc(Number(body.order));
  }
  if (typeof body.published === "boolean") data.published = body.published;

  const service = await prisma.service.update({ where: { id }, data });

  revalidatePath("/", "layout");
  return NextResponse.json(service);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Servicio no encontrado" }, { status: 404 });
  }

  await prisma.service.delete({ where: { id } });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
