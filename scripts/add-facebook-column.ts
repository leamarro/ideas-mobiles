import "dotenv/config";
import { createClient } from "@libsql/client";

// Agrega la columna `facebook` a site_settings en Turso (idempotente).
// Uso (desde la raíz del proyecto):
//   $env:TURSO_DATABASE_URL="libsql://..."; $env:TURSO_AUTH_TOKEN="..."; npx tsx scripts/add-facebook-column.ts
// o pasando los valores por argumento:
//   npx tsx scripts/add-facebook-column.ts "libsql://..." "token"

const url = process.argv[2] || process.env.TURSO_DATABASE_URL;
const authToken = process.argv[3] || process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error("Faltan TURSO_DATABASE_URL y TURSO_AUTH_TOKEN (por env o argumentos).");
  process.exit(1);
}

async function main() {
  const client = createClient({ url, authToken });

  const tables = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name='site_settings'"
  );
  if (tables.rows.length === 0) {
    throw new Error("No existe la tabla site_settings en la BD remota.");
  }

  const info = await client.execute('PRAGMA table_info("site_settings")');
  const hasFacebook = info.rows.some((row) => row.name === "facebook");

  if (hasFacebook) {
    console.log("OK: site_settings.facebook ya existe, nada que hacer.");
    return;
  }

  await client.execute(
    'ALTER TABLE "site_settings" ADD COLUMN "facebook" TEXT NOT NULL DEFAULT \'\''
  );

  const after = await client.execute('PRAGMA table_info("site_settings")');
  const column = after.rows.find((row) => row.name === "facebook");
  if (!column) throw new Error("La columna no se agregó.");
  console.log(`OK: agregada site_settings.facebook (${String(column.type)}, NOT NULL DEFAULT '').`);
}

main()
  .catch((error) => {
    console.error("ERROR:", error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
