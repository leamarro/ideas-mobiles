import "dotenv/config";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { prisma as local } from "../src/lib/prisma";

// Migra esquema + datos desde SQLite local hacia Turso.
// Uso (desde la raíz del proyecto):
//   $env:TURSO_DATABASE_URL="libsql://..."; $env:TURSO_AUTH_TOKEN="..."; npm run db:migrate-turso
// o pasando los valores por argumento:
//   npx tsx scripts/setup-turso.ts "libsql://..." "token"
// Idempotente: se puede re-ejecutar (skipDuplicates).

const url = process.argv[2] || process.env.TURSO_DATABASE_URL;
const authToken = process.argv[3] || process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Faltan TURSO_DATABASE_URL y TURSO_AUTH_TOKEN (por env o argumentos).");
  process.exit(1);
}

async function main() {
  console.log("1/3 Generando DDL desde prisma/schema.prisma...");
  const ddl = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    { encoding: "utf8" }
  );

  const remote = new PrismaClient({
    adapter: new PrismaLibSQL({ url, authToken }),
  });

  console.log("2/3 Creando tablas en Turso...");
  const statements = ddl
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    await remote.$executeRawUnsafe(`${statement};`);
  }
  console.log(`    ${statements.length} sentencias ejecutadas.`);

  console.log("3/3 Copiando datos de la BD local...");
  const [users, categories, services, items, settings, messages] = await Promise.all([
    local.user.findMany(),
    local.category.findMany(),
    local.service.findMany(),
    local.portfolioItem.findMany(),
    local.siteSettings.findMany(),
    local.contactMessage.findMany(),
  ]);

  await remote.user.createMany({ data: users, skipDuplicates: true });
  await remote.category.createMany({ data: categories, skipDuplicates: true });
  await remote.service.createMany({ data: services, skipDuplicates: true });
  await remote.portfolioItem.createMany({ data: items, skipDuplicates: true });
  await remote.siteSettings.createMany({ data: settings, skipDuplicates: true });
  await remote.contactMessage.createMany({ data: messages, skipDuplicates: true });

  const [ru, rc, rs, ri, rst, rm] = await Promise.all([
    remote.user.count(),
    remote.category.count(),
    remote.service.count(),
    remote.portfolioItem.count(),
    remote.siteSettings.count(),
    remote.contactMessage.count(),
  ]);

  console.log("Migración completada. Conteos en Turso:");
  console.log(`  users=${ru} categories=${rc} services=${rs} portfolio=${ri} settings=${rst} messages=${rm}`);

  await remote.$disconnect();
  await local.$disconnect();
}

main().catch((error) => {
  console.error("ERROR:", error);
  process.exit(1);
});
