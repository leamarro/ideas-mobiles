import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { put } from "@vercel/blob";
import { getContentTypeFor, getUploadsDir, toUploadUrl } from "@/lib/uploads";

export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// Guarda un archivo y devuelve su URL pública.
// - Con BLOB_READ_WRITE_TOKEN (Vercel): sube a Vercel Blob y devuelve URL absoluta.
// - Sin token (local / VPS): escribe en uploads/ y devuelve /api/uploads/<nombre>.
export async function storeUpload(name: string, buffer: Buffer): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (token) {
    const blob = await put(name, buffer, {
      access: "public",
      token,
      contentType: getContentTypeFor(name),
      allowOverwrite: true,
    });
    return blob.url;
  }

  const uploadsDir = getUploadsDir();
  await mkdir(uploadsDir, { recursive: true });
  await writeFile(path.join(uploadsDir, name), buffer);
  return toUploadUrl(name);
}
