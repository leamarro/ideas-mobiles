export const UPLOADS_URL_PREFIX = "/api/uploads";

export function toUploadUrl(name: string): string {
  return `${UPLOADS_URL_PREFIX}/${name}`;
}

export function isUploadUrl(src: string): boolean {
  return src.startsWith(`${UPLOADS_URL_PREFIX}/`);
}

function isExternalUrl(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

// next/image solo optimiza archivos locales de /public. Las URLs subidas a
// Vercel Blob (u otro dominio externo) se sirven tal cual, sin /_next/image.
export function uploadImageProps(src: string): { unoptimized?: boolean } {
  if (!src) return {};
  return isUploadUrl(src) || isExternalUrl(src) ? { unoptimized: true } : {};
}
