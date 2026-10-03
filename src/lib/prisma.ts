import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Prisma CLI resuelve las rutas relativas de `file:` contra la carpeta del
// schema (prisma/), pero el adapter las resolvería contra process.cwd().
// Traducimos para que ambas formas apunten siempre al mismo archivo.
export function localDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL || "file:./dev.db";
  if (!raw.startsWith("file:")) return raw;

  const filePath = raw.slice("file:".length);
  if (path.isAbsolute(filePath)) return `file:${filePath}`;

  const resolved = path.resolve(process.cwd(), "prisma", filePath);
  return `file:${resolved.split(path.sep).join("/")}`;
}

function createClient(): PrismaClient {
  const tursoUrl = process.env.TURSO_DATABASE_URL;
  const adapterConfig = tursoUrl
    ? { url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN ?? "" }
    : { url: localDatabaseUrl() };
  const adapter = new PrismaLibSQL(adapterConfig);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
