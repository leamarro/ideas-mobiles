import path from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { put } from "@vercel/blob";
import { getContentTypeFor, getUploadsDir, toUploadUrl } from "@/lib/uploads";

// En Vercel hay Blob (OIDC vía BLOB_STORE_ID, o token estático
// BLOB_READ_WRITE_TOKEN); sin esas variables se guarda en disco local.
export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

// Guarda un archivo y devuelve su URL pública.
export async function storeUpload(name: string, buffer: Buffer): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (hasBlobStorage()) {
    const blob = await put(name, buffer, {
      access: "public",
      ...(token ? { token } : {}),
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
