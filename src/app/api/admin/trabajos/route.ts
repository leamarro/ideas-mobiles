import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const items = await prisma.portfolioItem.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";

  if (!title || !image || !category) {
    return NextResponse.json(
      { error: "Título, imagen y categoría son obligatorios" },
      { status: 400 }
    );
  }

  const item = await prisma.portfolioItem.create({
    data: {
      title,
      image,
      category,
      description:
        typeof body.description === "string" && body.description.trim()
          ? body.description.trim()
          : null,
      order: Number.isFinite(Number(body.order)) ? Math.trunc(Number(body.order)) : 0,
      published: body.published !== false,
    },
  });

  revalidatePath("/", "layout");
  return NextResponse.json(item, { status: 201 });
}
