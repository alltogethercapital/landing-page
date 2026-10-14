import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { isSameOriginRequest } from "@/lib/request-security";

// Dev-only sink for the cover renderer (scripts/render-covers.browser.js):
// the browser draws each Notes cover on a canvas — the company's product
// photo rendered through the brand's ASCII ramp — and POSTs the JPEG here.
// Refuses to run outside `next dev`.
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "dev only" }, { status: 403 });
  }
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  }
  let body: { slug?: unknown; dataUrl?: unknown } | null;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }
  const slug = body?.slug;
  const dataUrl = body?.dataUrl;
  if (typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug) || slug.length > 128) {
    return NextResponse.json({ error: "bad slug" }, { status: 400 });
  }
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/jpeg;base64,")) {
    return NextResponse.json({ error: "bad payload" }, { status: 400 });
  }
  const base64 = dataUrl.slice("data:image/jpeg;base64,".length);
  const file = join(process.cwd(), "public/updates/covers", `${slug}.jpg`);
  await writeFile(file, Buffer.from(base64, "base64"));
  return NextResponse.json({ ok: true, file: `/updates/covers/${slug}.jpg` });
}
