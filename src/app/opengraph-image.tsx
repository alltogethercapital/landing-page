import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Share-preview card (iMessage / Slack / X / LinkedIn). Static TTFs are kept in
// /public/fonts because Satori in this build accepts only static TTF/OTF.

export const runtime = "nodejs";

export const alt =
  "All Together, backing the founders rebuilding the hard frontier.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [
    atlasMedium,
    newsreaderRegular,
    newsreaderSemiBold,
    brandMark,
    shieldAiLogo,
    oneXLogo,
    openAiLogo,
    blueOriginLogo,
    longshotLogo,
    weaveLogo,
    supabaseLogo,
    valstadLogo,
    atomsLogo,
    higgsfieldLogo,
  ] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/AtlasTypewriter-Medium-Web.ttf")),
    readFile(join(process.cwd(), "public/fonts/Newsreader-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/Newsreader-SemiBold.ttf")),
    readFile(
      join(process.cwd(), "public/brand/all-together-rising-circles-logo.png"),
    ),
    readFile(join(process.cwd(), "public/logos/cards/shield-ai.png")),
    readFile(join(process.cwd(), "public/logos/cards/1x.png")),
    readFile(join(process.cwd(), "public/logos/cards/openai.png")),
    readFile(join(process.cwd(), "public/logos/cards/blue-origin.png")),
    readFile(join(process.cwd(), "public/logos/cards/longshot-space.png")),
    readFile(join(process.cwd(), "public/logos/cards/weave-robotics.png")),
    readFile(join(process.cwd(), "public/logos/cards/supabase.png")),
    readFile(join(process.cwd(), "public/logos/cards/valstad.png")),
    readFile(join(process.cwd(), "public/logos/cards/atoms.png")),
    readFile(join(process.cwd(), "public/logos/cards/higgsfield.png")),
  ]);
  const brandMarkSrc = `data:image/png;base64,${brandMark.toString("base64")}`;
  const companyLogos = [
    shieldAiLogo,
    oneXLogo,
    openAiLogo,
    blueOriginLogo,
    longshotLogo,
    weaveLogo,
    supabaseLogo,
    valstadLogo,
    atomsLogo,
    higgsfieldLogo,
  ].map((image) => `data:image/png;base64,${image.toString("base64")}`);
  const verticalRules = [56, 254, 320, 849, 980, 1144];
  const navigation = ["HOME", "OUR COMPANIES", "OUR ENTREPRENEURS", "OUR TEAM", "UPDATES"];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#f7f6f5",
          color: "#000000",
          fontFamily: "Newsreader",
        }}
      >
        {verticalRules.map((x) => (
          <div
            key={x}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: x,
              width: 1,
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            }}
          />
        ))}

        <div
          style={{
            position: "absolute",
            top: 72,
            left: 56,
            display: "flex",
            flexDirection: "column",
            width: 198,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "Atlas Typewriter",
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: 5,
              lineHeight: 1,
              color: "#000000",
            }}
          >
            <img
              alt=""
              src={brandMarkSrc}
              width={22}
              height={22}
              style={{ width: 22, height: 22, borderRadius: 999 }}
            />
            <span style={{ marginRight: -5 }}>A2R</span>
          </div>
          <div
            style={{
              marginTop: 34,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              fontFamily: "Atlas Typewriter",
              fontSize: 12,
              lineHeight: 1.25,
            }}
          >
            {navigation.map((item, index) => (
              <div
                key={item}
                style={{
                  position: "relative",
                  display: "flex",
                  color: index === 0 ? "#1685e5" : "rgba(0, 0, 0, 0.56)",
                }}
              >
                {index === 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -2,
                      left: -14,
                      width: 2,
                      height: 16,
                      backgroundColor: "#1685e5",
                    }}
                  />
                )}
                {item}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 74,
            left: 320,
            display: "flex",
            flexDirection: "column",
            width: 824,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Newsreader",
              fontSize: 58,
              fontWeight: 400,
              lineHeight: 0.94,
              letterSpacing: -2,
              color: "#000000",
            }}
          >
            <span>The future is built together.</span>
            <span>The future is built now.</span>
          </div>
          <div
            style={{
              marginTop: 24,
              width: 670,
              fontFamily: "Newsreader",
              fontSize: 21,
              fontWeight: 400,
              lineHeight: 1.35,
              color: "rgba(0, 0, 0, 0.72)",
            }}
          >
            All Together backs the founders rebuilding the hard frontier across AI,
            defense, energy, robotics, semiconductors, and space.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 320,
            right: 56,
            bottom: 54,
            display: "flex",
            flexWrap: "wrap",
            height: 206,
            borderTop: "1px solid rgba(0, 0, 0, 0.10)",
            borderLeft: "1px solid rgba(0, 0, 0, 0.10)",
            backgroundColor: "rgba(255, 255, 255, 0.54)",
          }}
        >
          {companyLogos.map((src, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "20%",
                height: 103,
                borderRight: "1px solid rgba(0, 0, 0, 0.10)",
                borderBottom: "1px solid rgba(0, 0, 0, 0.10)",
              }}
            >
              <img
                alt=""
                src={src}
                width={116}
                height={42}
                style={{
                  width: 116,
                  height: 42,
                  objectFit: "contain",
                  opacity: 0.58,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Atlas Typewriter", data: atlasMedium, style: "normal", weight: 500 },
        { name: "Newsreader", data: newsreaderRegular, style: "normal", weight: 400 },
        { name: "Newsreader", data: newsreaderSemiBold, style: "normal", weight: 600 },
      ],
    },
  );
}
