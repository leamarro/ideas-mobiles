import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/auth";
import {
  MAX_UPLOAD_BYTES,
  buildUploadName,
  getUploadsDir,
  toUploadUrl,
} from "@/lib/uploads";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Formulario inválido" }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Falta el archivo" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "La imagen no puede superar los 5MB" }, { status: 400 });
  }

  const originalName = buildUploadName(file.type);
  if (!originalName) {
    return NextResponse.json(
      { error: "Formato no permitido. Usá JPG, PNG, WebP o GIF" },
      { status: 400 }
    );
  }

  const uploadsDir = getUploadsDir();
  await mkdir(uploadsDir, { recursive: true });

  let buffer: Buffer = Buffer.from(await file.arrayBuffer());
  let name = originalName;

  try {
    const sharp = (await import("sharp")).default;
    buffer = await sharp(buffer)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    name = buildUploadName("image/webp") ?? originalName;
  } catch {
    // si sharp no está disponible se guarda el original (solo formatos permitidos)
  }

  await writeFile(path.join(uploadsDir, name), buffer);

  return NextResponse.json({ url: toUploadUrl(name), name }, { status: 201 });
}
