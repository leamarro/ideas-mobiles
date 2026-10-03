import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import {
  MAX_UPLOAD_BYTES,
  buildUploadName,
  getUploadsDir,
  toUploadUrl,
} from "@/lib/uploads";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function allow(key: string): boolean {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);
  return true;
}

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allow(ip)) {
    return NextResponse.json(
      { error: "Demasiados envíos seguidos. Esperá unos minutos y volvé a intentar." },
      { status: 429 }
    );
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return bad("Formulario inválido");

  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot) return NextResponse.json({ ok: true }, { status: 201 });

  const name = String(formData.get("nombre") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const service = String(formData.get("servicio") ?? "").trim();
  const message = String(formData.get("mensaje") ?? "").trim();

  if (name.length < 2 || name.length > 80) return bad("Ingresá tu nombre (2 a 80 caracteres)");
  if (whatsapp.length > 30) return bad("El WhatsApp no puede superar los 30 caracteres");
  if (service.length > 40) return bad("El servicio no puede superar los 40 caracteres");
  if (message.length < 5 || message.length > 2000)
    return bad("El mensaje debe tener entre 5 y 2000 caracteres");

  let imageUrl: string | null = null;
  const file = formData.get("imagen");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_UPLOAD_BYTES) return bad("La imagen no puede superar los 5MB");

    const originalName = buildUploadName(file.type);
    if (!originalName) return bad("Formato de imagen no permitido. Usá JPG, PNG, WebP o GIF");

    const uploadsDir = getUploadsDir();
    await mkdir(uploadsDir, { recursive: true });

    let buffer: Buffer = Buffer.from(await file.arrayBuffer());
    let name0 = originalName;

    try {
      const sharp = (await import("sharp")).default;
      buffer = await sharp(buffer)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();
      name0 = buildUploadName("image/webp") ?? originalName;
    } catch {
      // sin sharp se guarda el original (solo formatos permitidos)
    }

    await writeFile(path.join(uploadsDir, name0), buffer);
    imageUrl = toUploadUrl(name0);
  }

  await prisma.contactMessage.create({
    data: {
      name,
      whatsapp: whatsapp || null,
      service: service || null,
      message,
      image: imageUrl,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
