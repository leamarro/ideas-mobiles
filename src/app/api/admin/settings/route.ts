import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const EDITABLE_FIELDS = [
  "logo",
  "favicon",
  "title",
  "description",
  "whatsapp",
  "phone",
  "email",
  "instagram",
  "facebook",
  "address",
  "heroTitle",
  "heroSubtitle",
  "heroText",
  "heroButtonText",
  "heroButtonLink",
  "heroImage",
  "heroImages",
] as const;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const settings = await prisma.siteSettings.findFirst({ where: { id: "default" } });
  if (!settings) {
    return NextResponse.json({ error: "Configuración no encontrada" }, { status: 404 });
  }
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const data: Record<string, string | null> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field === "heroImages") {
      if (Array.isArray(body[field])) {
        const list = body[field]
          .map((v: unknown) => (typeof v === "string" ? v.trim() : ""))
          .filter(Boolean);
        data[field] = JSON.stringify(list);
      }
      continue;
    }
    const value = body[field];
    if (typeof value === "string") {
      data[field] = value.trim();
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
  }

  const existing = await prisma.siteSettings.findFirst({ where: { id: "default" } });

  const settings = existing
    ? await prisma.siteSettings.update({ where: { id: existing.id }, data })
    : await prisma.siteSettings.create({
        data: {
          id: "default",
          title: "Ideas Móviles",
          description: "",
          whatsapp: "",
          phone: "",
          email: "",
          instagram: "",
          facebook: "",
          address: "",
          heroTitle: "",
          heroSubtitle: "",
          heroText: "",
          heroButtonText: "",
          heroButtonLink: "",
          heroImage: "/images/imagen-fondo2.png",
          heroImages: '["/images/imagen-fondo2.png"]',
          ...data,
        },
      });

  revalidatePath("/", "layout");
  return NextResponse.json(settings);
}
