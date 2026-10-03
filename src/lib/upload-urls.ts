export const UPLOADS_URL_PREFIX = "/api/uploads";

export function toUploadUrl(name: string): string {
  return `${UPLOADS_URL_PREFIX}/${name}`;
}

export function isUploadUrl(src: string): boolean {
  return src.startsWith(`${UPLOADS_URL_PREFIX}/`);
}

export function uploadImageProps(src: string): { unoptimized?: boolean } {
  return isUploadUrl(src) ? { unoptimized: true } : {};
}
