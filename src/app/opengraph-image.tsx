import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GLYPH_RAMP } from "@/lib/glyphs";

// Share-preview card (iMessage / Slack / X / LinkedIn). Static TTFs are kept in
// /public/fonts because Satori in this build accepts only static TTF/OTF.

export const runtime = "nodejs";

export const alt =
  "All Together, backing the founders rebuilding the hard frontier.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [interBlack, interSemibold] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Inter-Black.ttf")),
    readFile(join(process.cwd(), "public/fonts/Inter-SemiBold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0b",
          padding: "0 80px",
        }}
      >
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 78,
            lineHeight: 1,
            letterSpacing: 8,
            color: "#ffffff",
            whiteSpace: "nowrap",
          }}
        >
          ALL TOGETHER
        </div>

        <div
          style={{
            marginTop: 30,
            fontFamily: "Inter",
            fontSize: 24,
            fontWeight: 600,
            color: "#059f70",
          }}
        >
          The future is built together. The future is built now.
        </div>

        {/* The brand alphabet — the ramp that renders the hero. */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 44,
            display: "flex",
            justifyContent: "center",
            fontFamily: "Inter",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 6,
            color: "rgba(255, 255, 255, 0.30)",
            whiteSpace: "nowrap",
          }}
        >
          {GLYPH_RAMP.trim()}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: interBlack, style: "normal", weight: 900 },
        { name: "Inter", data: interSemibold, style: "normal", weight: 600 },
      ],
    },
  );
}
