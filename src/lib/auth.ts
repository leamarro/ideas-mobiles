import { cookies } from "next/headers";
import { SESSION_COOKIE, SessionPayload, verifySessionToken } from "@/lib/session";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireSession(): Promise<SessionPayload | null> {
  return getSession();
}
