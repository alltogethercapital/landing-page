import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "at_lp_session";

export function proxy(request: NextRequest) {
  if (!request.cookies.has(SESSION_COOKIE)) {
    return NextResponse.redirect(new URL("/lp-login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/lp/:path*"],
};
