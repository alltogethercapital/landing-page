import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { LP_SESSION_COOKIE } from "@/lib/lp-auth";
import { isSameOriginRequest } from "@/lib/request-security";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return Response.json({ error: "Request rejected." }, { status: 403 });
  }

  const cookieStore = await cookies();
  cookieStore.set(LP_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return new Response(null, { status: 303, headers: { Location: "/lp-login" } });
}
