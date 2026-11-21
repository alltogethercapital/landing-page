import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Shared by the route handlers and the proxy (no server-only / next/headers here).
export const LP_SESSION_COOKIE = "at_lp_session";
const SESSION_VERSION = 1;

/** A device stays signed in for a year, and every visit pushes that out again. */
export const LP_SESSION_TTL_SECONDS = 60 * 60 * 24 * 365;
/** Tokens issued before remember-device shipped (8h); still honoured until they lapse. */
const LEGACY_SESSION_TTL_SECONDS = 60 * 60 * 8;
/** Re-issue the cookie at most once a day so visits don't rewrite it on every request. */
export const LP_SESSION_REFRESH_AFTER_SECONDS = 60 * 60 * 24;

type SessionPayload = { v: number; iat: number; exp: number };

function encode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(encodedPayload: string, secret: string) {
  return createHmac("sha256", secret).update(encodedPayload).digest("base64url");
}

function constantTimeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function createLpSessionToken(now = Date.now()) {
  const secret = process.env.LP_SESSION_SECRET;
  if (!secret) throw new Error("LP_SESSION_SECRET is not configured");
  const issuedAt = Math.floor(now / 1000);
  const payload: SessionPayload = { v: SESSION_VERSION, iat: issuedAt, exp: issuedAt + LP_SESSION_TTL_SECONDS };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

/** Returns the verified payload, or null when the token is missing, forged or expired. */
export function readLpSessionToken(token: string | undefined, now = Date.now()): SessionPayload | null {
  const secret = process.env.LP_SESSION_SECRET;
  if (!secret || !token) return null;
  const [encodedPayload, signature, ...extra] = token.split(".");
  if (!encodedPayload || !signature || extra.length > 0) return null;
  if (!constantTimeEqual(signature, sign(encodedPayload, secret))) return null;
  try {
    const payload = JSON.parse(decode(encodedPayload)) as Partial<SessionPayload>;
    const currentTime = Math.floor(now / 1000);
    const lifetime = (payload.exp ?? 0) - (payload.iat ?? 0);
    const valid =
      payload.v === SESSION_VERSION &&
      typeof payload.iat === "number" &&
      typeof payload.exp === "number" &&
      payload.iat <= currentTime + 60 &&
      payload.exp > currentTime &&
      (lifetime === LP_SESSION_TTL_SECONDS || lifetime === LEGACY_SESSION_TTL_SECONDS);
    return valid ? (payload as SessionPayload) : null;
  } catch {
    return null;
  }
}

export function verifyLpSessionToken(token: string | undefined, now = Date.now()) {
  return readLpSessionToken(token, now) !== null;
}

export const lpSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // Lax so a returning investor who follows a link from email is still recognised.
  sameSite: "lax" as const,
  path: "/",
  maxAge: LP_SESSION_TTL_SECONDS,
  priority: "high" as const,
};
