import "server-only";

import { createHmac, createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const LP_SESSION_COOKIE = "at_lp_session";
const SESSION_VERSION = 1;
const SESSION_TTL_SECONDS = 60 * 60 * 8;

type SessionPayload = {
  v: number;
  iat: number;
  exp: number;
};

function getSessionSecret() {
  return process.env.LP_SESSION_SECRET;
}

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

export function verifyPortalPassword(candidate: string) {
  const configuredPassword = process.env.LP_PORTAL_PASSWORD;
  if (!configuredPassword || candidate.length === 0 || candidate.length > 256) return false;
  return constantTimeEqual(candidate, configuredPassword);
}

export function createLpSessionToken(now = Date.now()) {
  const secret = getSessionSecret();
  if (!secret) throw new Error("LP_SESSION_SECRET is not configured");

  const issuedAt = Math.floor(now / 1000);
  const payload: SessionPayload = {
    v: SESSION_VERSION,
    iat: issuedAt,
    exp: issuedAt + SESSION_TTL_SECONDS,
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

export function verifyLpSessionToken(token: string | undefined, now = Date.now()) {
  const secret = getSessionSecret();
  if (!secret || !token) return false;

  const [encodedPayload, signature, ...extra] = token.split(".");
  if (!encodedPayload || !signature || extra.length > 0) return false;
  if (!constantTimeEqual(signature, sign(encodedPayload, secret))) return false;

  try {
    const payload = JSON.parse(decode(encodedPayload)) as Partial<SessionPayload>;
    const currentTime = Math.floor(now / 1000);
    return (
      payload.v === SESSION_VERSION &&
      typeof payload.iat === "number" &&
      typeof payload.exp === "number" &&
      payload.iat <= currentTime + 60 &&
      payload.exp > currentTime &&
      payload.exp - payload.iat === SESSION_TTL_SECONDS
    );
  } catch {
    return false;
  }
}

export async function hasValidLpSession() {
  const cookieStore = await cookies();
  return verifyLpSessionToken(cookieStore.get(LP_SESSION_COOKIE)?.value);
}

export const lpSessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
  priority: "high" as const,
};
