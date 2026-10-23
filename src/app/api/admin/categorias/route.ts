import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { ALL_CATEGORY_SLUG, ensureDefaultCategories, getAllPortfolioCategories } from "@/lib/data";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const categories = await getAllPortfolioCategories();
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  if (name.length < 2 || name.length > 40) {
    return NextResponse.json(
      { error: "El nombre de la categoría debe tener entre 2 y 40 caracteres" },
      { status: 400 }
    );
  }

  const slug = slugify(name);
  if (!slug || slug === ALL_CATEGORY_SLUG) {
    return NextResponse.json({ error: "Nombre de categoría inválido" }, { status: 400 });
  }

  // Si ya existe (mismo nombre o mismo slug) se reutiliza en vez de duplicarla.
  const existing = await prisma.category.findFirst({
    where: { OR: [{ slug }, { name }] },
    select: { slug: true, name: true },
  });
  if (existing) return NextResponse.json(existing);

  await ensureDefaultCategories();

  const last = await prisma.category.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const category = await prisma.category.create({
    data: { name, slug, order: (last?.order ?? 0) + 1, published: true },
    select: { slug: true, name: true },
  });

  revalidatePath("/", "layout");
  return NextResponse.json(category, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const slug = body && typeof body.slug === "string" ? body.slug : "";
  if (!slug || slug === ALL_CATEGORY_SLUG) {
    return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });
  }

  // Se cuentan también los trabajos ocultos: al publicarlos quedarían sin categoría.
  const itemsCount = await prisma.portfolioItem.count({ where: { category: slug } });
  if (itemsCount > 0) {
    return NextResponse.json(
      {
        error: `No se puede borrar: tiene ${itemsCount} ${itemsCount === 1 ? "trabajo" : "trabajos"}. Pasalos a otra categoría primero.`,
      },
      { status: 409 }
    );
  }

  await ensureDefaultCategories();

  const { count } = await prisma.category.deleteMany({ where: { slug } });
  if (count === 0) {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
