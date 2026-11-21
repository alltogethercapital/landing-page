import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  createLpSessionToken,
  LP_SESSION_COOKIE,
  LP_SESSION_REFRESH_AFTER_SECONDS,
  LP_SESSION_TTL_SECONDS,
  lpSessionCookieOptions,
  readLpSessionToken,
} from "@/lib/lp-session-token";

export function proxy(request: NextRequest) {
  const isPortal = request.nextUrl.pathname === "/lp" || request.nextUrl.pathname.startsWith("/lp/");
  const session = readLpSessionToken(request.cookies.get(LP_SESSION_COOKIE)?.value);

  if (!session) {
    return isPortal ? NextResponse.redirect(new URL("/lp-login", request.url)) : NextResponse.next();
  }

  // A signed-in device skips the password screen.
  const response = request.nextUrl.pathname === "/lp-login"
    ? NextResponse.redirect(new URL("/lp", request.url))
    : NextResponse.next();

  // Rolling refresh: each visit (at most once a day) restarts the one-year window.
  const now = Math.floor(Date.now() / 1000);
  const isLegacy = session.exp - session.iat !== LP_SESSION_TTL_SECONDS;
  if (isLegacy || now - session.iat >= LP_SESSION_REFRESH_AFTER_SECONDS) {
    response.cookies.set(LP_SESSION_COOKIE, createLpSessionToken(), lpSessionCookieOptions);
  }
  return response;
}

export const config = {
  matcher: ["/lp", "/lp/:path*", "/lp-login"],
};
