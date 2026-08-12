import type { NextRequest } from "next/server";

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() || "";
}

function isLoopback(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
}

export function isSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (!origin || fetchSite === "cross-site") return false;

  try {
    const originUrl = new URL(origin);
    const forwardedHost = firstHeaderValue(request.headers.get("x-forwarded-host"));
    const requestHost = forwardedHost || firstHeaderValue(request.headers.get("host"));
    if (!requestHost) return origin === request.nextUrl.origin;

    const [requestHostname, requestPort = ""] = requestHost.toLowerCase().split(":");
    const originPort = originUrl.port || (originUrl.protocol === "https:" ? "443" : "80");
    const normalizedRequestPort = requestPort || (originUrl.protocol === "https:" ? "443" : "80");
    const hostnameMatches = originUrl.hostname.toLowerCase() === requestHostname;
    const localAliasMatches =
      process.env.NODE_ENV !== "production" &&
      isLoopback(originUrl.hostname.toLowerCase()) &&
      isLoopback(requestHostname);

    if ((!hostnameMatches && !localAliasMatches) || originPort !== normalizedRequestPort) return false;
    return process.env.NODE_ENV !== "production" || originUrl.protocol === "https:";
  } catch {
    return false;
  }
}
