import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export {
  LP_SESSION_COOKIE,
  createLpSessionToken,
  lpSessionCookieOptions,
  verifyLpSessionToken,
} from "@/lib/lp-session-token";
import { LP_SESSION_COOKIE, verifyLpSessionToken } from "@/lib/lp-session-token";

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

export const hasValidLpSession = cache(async () => {
  const cookieStore = await cookies();
  return verifyLpSessionToken(cookieStore.get(LP_SESSION_COOKIE)?.value);
});

export const requireLpSession = cache(async () => {
  if (!(await hasValidLpSession())) redirect("/lp-login");
});
