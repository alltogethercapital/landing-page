import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { CONTACT_RECIPIENTS } from "@/lib/site";
import { isSameOriginRequest } from "@/lib/request-security";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
// Must be a verified sender on a domain verified in your Resend account.
const FROM_EMAIL = process.env.RESEND_FROM ?? "onboarding@resend.dev";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  }

  let clean = "";
  try {
    const body = (await request.json()) as { email?: unknown } | null;
    clean = typeof body?.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if (!clean || clean.length > 254 || !EMAIL_RE.test(clean)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  if (!resend) {
    return NextResponse.json(
      { error: "Subscriptions are unavailable right now. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_RECIPIENTS,
      replyTo: clean,
      subject: "New newsletter signup — Machine Spirit Capital",
      text: `New subscriber: ${clean}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Could not subscribe. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (e) {
    console.error("Subscribe API error:", e);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 },
    );
  }
}
