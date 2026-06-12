import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_RECIPIENTS } from "@/lib/site";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
// Must be a verified sender on a domain verified in your Resend account.
const FROM_EMAIL = process.env.RESEND_FROM ?? "onboarding@resend.dev";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const { email } = (await request.json()) as { email?: string };
    const clean = email?.trim() ?? "";

    if (!clean || !EMAIL_RE.test(clean)) {
      return NextResponse.json(
        { error: "Please enter a valid email." },
        { status: 400 },
      );
    }

    if (!resend) {
      return NextResponse.json(
        { error: "Email is not configured. Please set RESEND_API_KEY." },
        { status: 503 },
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_RECIPIENTS,
      replyTo: clean,
      subject: "New newsletter signup — All Together",
      text: `New subscriber: ${clean}`,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
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
