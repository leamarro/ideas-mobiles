import path from "node:path";
import { randomUUID } from "node:crypto";

export {
  UPLOADS_URL_PREFIX,
  isUploadUrl,
  toUploadUrl,
  uploadImageProps,
} from "@/lib/upload-urls";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const SAFE_FILE_NAME = /^[a-z0-9][a-z0-9._-]*$/i;

export function getUploadsDir(): string {
  return process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads");
}

export function getExtensionFor(mimeType: string): string | null {
  return EXTENSIONS[mimeType] ?? null;
}

export function isSafeFileName(name: string): boolean {
  return name.length <= 128 && SAFE_FILE_NAME.test(name) && !name.includes("..");
}

export function getContentTypeFor(name: string): string {
  return CONTENT_TYPES[path.extname(name).toLowerCase()] ?? "application/octet-stream";
}

export function buildUploadName(mimeType: string): string | null {
  const extension = getExtensionFor(mimeType);
  if (!extension) return null;
  return `${randomUUID()}${extension}`;
}

export function resolveUploadPath(name: string): string | null {
  if (!isSafeFileName(name)) return null;

  const uploadsDir = path.resolve(getUploadsDir());
  const filePath = path.join(uploadsDir, name);

  if (path.dirname(filePath) !== uploadsDir) return null;

  return filePath;
}
