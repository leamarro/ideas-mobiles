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

  const existing = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Trabajo no encontrado" }, { status: 404 });
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
  if (typeof body.image === "string") {
    const image = body.image.trim();
    if (!image) return NextResponse.json({ error: "La imagen no puede estar vacía" }, { status: 400 });
    data.image = image;
  }
  if (typeof body.category === "string") {
    const category = body.category.trim();
    if (!category) return NextResponse.json({ error: "La categoría no puede estar vacía" }, { status: 400 });
    data.category = category;
  }
  if (typeof body.description === "string") data.description = body.description.trim() || null;
  if (body.order !== undefined && Number.isFinite(Number(body.order))) {
    data.order = Math.trunc(Number(body.order));
  }
  if (typeof body.published === "boolean") data.published = body.published;

  const item = await prisma.portfolioItem.update({ where: { id }, data });

  revalidatePath("/", "layout");
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  const existing = await prisma.portfolioItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Trabajo no encontrado" }, { status: 404 });
  }

  await prisma.portfolioItem.delete({ where: { id } });

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
