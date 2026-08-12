import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import {
  createLpSessionToken,
  LP_SESSION_COOKIE,
  lpSessionCookieOptions,
  verifyPortalPassword,
} from "@/lib/lp-auth";
import { isSameOriginRequest } from "@/lib/request-security";

type FailureState = { count: number; resetAt: number; blockedUntil?: number };

const globalRateLimit = globalThis as typeof globalThis & {
  lpLoginFailures?: Map<string, FailureState>;
};
const failures = globalRateLimit.lpLoginFailures ?? new Map<string, FailureState>();
globalRateLimit.lpLoginFailures = failures;

const WINDOW_MS = 15 * 60 * 1000;
const BLOCK_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

function response(body: Record<string, unknown>, status: number, retryAfter?: number) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, private",
      ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
    },
  });
}

function redirectTo(request: NextRequest, destination: string) {
  void request;
  return new Response(null, { status: 303, headers: { Location: destination } });
}

function requestKey(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function getFailureState(key: string, now: number) {
  const existing = failures.get(key);
  if (!existing || existing.resetAt <= now) {
    const fresh: FailureState = { count: 0, resetAt: now + WINDOW_MS };
    failures.set(key, fresh);
    return fresh;
  }
  return existing;
}

export async function POST(request: NextRequest) {
  const isFormSubmission = request.headers.get("content-type")?.includes("form-urlencoded");
  if (!isSameOriginRequest(request)) {
    return isFormSubmission ? redirectTo(request, "/lp-login?error=request") : response({ error: "Request rejected." }, 403);
  }
  if (!process.env.LP_PORTAL_PASSWORD || !process.env.LP_SESSION_SECRET) {
    return isFormSubmission ? redirectTo(request, "/lp-login?error=config") : response({ error: "Investor access is not configured yet." }, 503);
  }

  const now = Date.now();
  const key = requestKey(request);
  const failureState = getFailureState(key, now);
  if (failureState.blockedUntil && failureState.blockedUntil > now) {
    const retryAfter = Math.ceil((failureState.blockedUntil - now) / 1000);
    return isFormSubmission ? redirectTo(request, "/lp-login?error=rate") : response({ error: "Too many attempts. Try again later." }, 429, retryAfter);
  }

  let password = "";
  try {
    if (isFormSubmission) {
      const body = await request.formData();
      password = typeof body.get("password") === "string" ? String(body.get("password")) : "";
    } else {
      const body = (await request.json()) as { password?: unknown };
      password = typeof body.password === "string" ? body.password : "";
    }
  } catch {
    return isFormSubmission ? redirectTo(request, "/lp-login?error=request") : response({ error: "Invalid request." }, 400);
  }

  if (!verifyPortalPassword(password)) {
    failureState.count += 1;
    if (failureState.count >= MAX_FAILURES) failureState.blockedUntil = now + BLOCK_MS;
    failures.set(key, failureState);
    return isFormSubmission ? redirectTo(request, "/lp-login?error=invalid") : response({ error: "That access password is not valid." }, 401);
  }

  failures.delete(key);
  const cookieStore = await cookies();
  cookieStore.set(LP_SESSION_COOKIE, createLpSessionToken(now), lpSessionCookieOptions);
  return isFormSubmission ? redirectTo(request, "/lp") : response({ ok: true }, 200);
}
