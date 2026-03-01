import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "ko_dash";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function b64urlEncode(buf: Buffer): string {
  return buf.toString("base64url");
}

function b64urlDecode(str: string): Buffer {
  return Buffer.from(str, "base64url");
}

export function signSession(secret: string): string {
  const payload = { e: Date.now() + TTL_MS };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = b64urlEncode(Buffer.from(payloadStr, "utf8"));
  const sig = createHmac("sha256", secret)
    .update(payloadStr)
    .digest();
  const sigB64 = b64urlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}

export function verifySession(secret: string, value: string): boolean {
  if (!value || !secret) return false;
  const parts = value.split(".");
  if (parts.length !== 2) return false;
  try {
    const payloadStr = b64urlDecode(parts[0]).toString("utf8");
    const payload = JSON.parse(payloadStr) as { e?: number };
    if (typeof payload.e !== "number" || payload.e < Date.now()) return false;
    const expectedSig = createHmac("sha256", secret).update(payloadStr).digest();
    const actualSig = b64urlDecode(parts[1]);
    if (expectedSig.length !== actualSig.length) return false;
    return timingSafeEqual(expectedSig, actualSig);
  } catch {
    return false;
  }
}

export async function isDashboardAuthenticated(): Promise<boolean> {
  const secret = process.env.DASHBOARD_PASSWORD;
  if (!secret) return false;
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  return verifySession(secret, value ?? "");
}

export async function setDashboardCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TTL_MS / 1000,
    path: "/",
  });
}

export async function clearDashboardCookie(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export { COOKIE_NAME };
