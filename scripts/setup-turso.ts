import "dotenv/config";
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { localDatabaseUrl } from "../src/lib/prisma";

// Migra esquema + datos desde SQLite local hacia Turso.
// Uso (desde la raÃ­z del proyecto):
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
  // Ojo: no usar el cliente de src/lib/prisma acá — si TURSO_DATABASE_URL está
  // en el entorno, ese cliente apuntaría a Turso en vez del SQLite local.
  const local = new PrismaClient({
    adapter: new PrismaLibSQL({ url: localDatabaseUrl() }),
  });

  console.log("2/3 Creando tablas en Turso...");
  const statements = ddl
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const statement of statements) {
    try {
      await remote.$executeRawUnsafe(`${statement};`);
    } catch {
      console.log("    (tabla ya existía, se ignora)");
    }
  }
  console.log(`    ${statements.length} sentencias procesadas.`);

  console.log("3/3 Copiando datos de la BD local...");
  const [users, categories, services, items, settings, messages] = await Promise.all([
    local.user.findMany(),
    local.category.findMany(),
    local.service.findMany(),
    local.portfolioItem.findMany(),
    local.siteSettings.findMany(),
    local.contactMessage.findMany(),
  ]);

  await remote.user.createMany({ data: users });
  await remote.category.createMany({ data: categories });
  await remote.service.createMany({ data: services });
  await remote.portfolioItem.createMany({ data: items });
  await remote.siteSettings.createMany({ data: settings });
  await remote.contactMessage.createMany({ data: messages });

  const [ru, rc, rs, ri, rst, rm] = await Promise.all([
    remote.user.count(),
    remote.category.count(),
    remote.service.count(),
    remote.portfolioItem.count(),
    remote.siteSettings.count(),
    remote.contactMessage.count(),
  ]);

  console.log("MigraciÃ³n completada. Conteos en Turso:");
  console.log(`  users=${ru} categories=${rc} services=${rs} portfolio=${ri} settings=${rst} messages=${rm}`);

  await remote.$disconnect();
  await local.$disconnect();
}

main().catch((error) => {
  console.error("ERROR:", error);
  process.exit(1);
});
