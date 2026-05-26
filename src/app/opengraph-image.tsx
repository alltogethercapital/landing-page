import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Generated at build time (statically optimized) — pre-rendered once and
// cached. The image is what shows in iMessage / Slack / Twitter / LinkedIn
// previews when someone shares an All Together Capital link.

export const runtime = "nodejs";

export const alt =
  "All Together Capital — backing the founders rebuilding the hard frontier.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  // Load the 1X NEO hero photo and the two static Inter TTFs we ship in
  // /public/fonts/. Static (non-variable) TTFs because Satori in this build
  // accepts only static TTF/OTF — it errors on WOFF2 signatures and on the
  // tables used by Inter's variable font.
  const [heroImage, interBlack, interSemibold] = await Promise.all([
    readFile(join(process.cwd(), "public/hero-robots.jpg")),
    readFile(join(process.cwd(), "public/fonts/Inter-Black.ttf")),
    readFile(join(process.cwd(), "public/fonts/Inter-SemiBold.ttf")),
  ]);
  const heroBase64 = `data:image/jpeg;base64,${heroImage.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          backgroundColor: "#0b0b0d",
          fontFamily: "Inter",
        }}
      >
        {/* 1X NEO product photo, full-bleed background */}
        <img
          src={heroBase64}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            objectFit: "cover",
          }}
        />
        {/* Dark legibility gradient at the bottom so the orange wordmark
            sits cleanly against the photo. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.4) 38%, rgba(0,0,0,0) 75%)",
          }}
        />
        {/* "All Together" + "Capital ®" wordmark — bottom of frame, mirrors
            the landing-page hero. */}
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            bottom: 24,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontWeight: 900,
              fontSize: 200,
              lineHeight: 1,
              letterSpacing: -10,
              color: "#ff4400",
              whiteSpace: "nowrap",
            }}
          >
            All Together
          </div>
          <div
            style={{
              marginTop: 6,
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "baseline",
              gap: 6,
            }}
          >
            <span
              style={{
                fontFamily: "Inter",
                fontSize: 18,
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: 7,
              }}
            >
              CAPITAL
            </span>
            <span
              style={{
                fontFamily: "Inter",
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.75)",
                position: "relative",
                bottom: 6,
              }}
            >
              ®
            </span>
          </div>
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
