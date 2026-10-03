import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";

  if (!title || !description) {
    return NextResponse.json(
      { error: "Título y descripción son obligatorios" },
      { status: 400 }
    );
  }

  const service = await prisma.service.create({
    data: {
      title,
      description,
      image: typeof body.image === "string" && body.image.trim() ? body.image.trim() : null,
      category: typeof body.category === "string" && body.category.trim() ? body.category.trim() : null,
      order: Number.isFinite(Number(body.order)) ? Math.trunc(Number(body.order)) : 0,
      published: body.published !== false,
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json(service, { status: 201 });
}
