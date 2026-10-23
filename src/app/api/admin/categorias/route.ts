import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getAllPortfolioCategories } from "@/lib/data";
import { FALLBACK_PORTFOLIO_CATEGORIES } from "@/types/portfolio";
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
  if (!slug || slug === "todos") {
    return NextResponse.json({ error: "Nombre de categoría inválido" }, { status: 400 });
  }

  // Si ya existe (mismo nombre o mismo slug) se reutiliza en vez de duplicarla.
  const existing = await prisma.category.findFirst({
    where: { OR: [{ slug }, { name }] },
    select: { slug: true, name: true },
  });
  if (existing) return NextResponse.json(existing);

  // Con la tabla vacía el sitio muestra las categorías por defecto: se guardan
  // primero para que no desaparezcan del filtro al crear la nueva.
  if ((await prisma.category.count()) === 0) {
    await prisma.category.createMany({
      data: FALLBACK_PORTFOLIO_CATEGORIES.map((category, index) => ({
        ...category,
        order: index + 1,
      })),
    });
  }

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
