import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const SCHEME = "s1";
const KEY_LENGTH = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH);
  return `${SCHEME}$${salt}$${derived.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== SCHEME || !salt || !hash) return false;

  const expected = Buffer.from(hash, "hex");
  const derived = scryptSync(password, salt, KEY_LENGTH);

  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}
