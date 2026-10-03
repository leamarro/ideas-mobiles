import { readdir, stat } from "node:fs/promises";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const IMAGES_DIR = join(process.cwd(), "public", "images");
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 82;
const SKIP = new Set(["placeholder.svg"]);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

let converted = 0;
let skipped = 0;
let saved = 0;

for await (const file of walk(IMAGES_DIR)) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext) || SKIP.has(basename(file))) continue;

  const outFile = file.replace(/\.(jpe?g|png)$/i, ".webp");
  const outStat = await stat(outFile).catch(() => null);
  if (outStat) {
    skipped++;
    continue;
  }

  const inStat = await stat(file);
  const pipeline = sharp(file);
  const meta = await pipeline.metadata();
  const needsResize = meta.width && meta.width > MAX_WIDTH;

  await pipeline
    .resize(needsResize ? { width: MAX_WIDTH, withoutEnlargement: true } : undefined)
    .webp({ quality: WEBP_QUALITY })
    .toFile(outFile);

  const outSize = (await stat(outFile)).size;
  converted++;
  saved += inStat.size - outSize;
  console.log(
    `${file.slice(IMAGES_DIR.length + 1)}: ${formatBytes(inStat.size)} -> ${formatBytes(outSize)}`
  );
}

console.log(`\nOK: ${converted} convertidas, ${skipped} ya existían, ahorro total ${formatBytes(saved)}`);
