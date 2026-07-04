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
  const [
    atlasMedium,
    newsreaderRegular,
    newsreaderSemiBold,
    aformicCover,
    arrayLabsCover,
    mavenCover,
    volantisCover,
  ] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/AtlasTypewriter-Medium-Web.ttf")),
    readFile(join(process.cwd(), "public/fonts/Newsreader-Regular.ttf")),
    readFile(join(process.cwd(), "public/fonts/Newsreader-SemiBold.ttf")),
    readFile(join(process.cwd(), "public/work/cards/aformic.jpg")),
    readFile(join(process.cwd(), "public/work/cards/array-labs.jpg")),
    readFile(join(process.cwd(), "public/work/cards/maven.jpg")),
    readFile(join(process.cwd(), "public/work/cards/volantis.jpg")),
  ]);
  const productCovers = [aformicCover, arrayLabsCover, mavenCover, volantisCover].map(
    (image) => `data:image/jpeg;base64,${image.toString("base64")}`,
  );
  const verticalRules = [64, 291, 367, 894, 1046];

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
            left: 80,
            display: "flex",
            flexDirection: "column",
            width: 164,
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              width: 154,
              height: 31,
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid #000000",
              fontFamily: "Atlas Typewriter",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: 4.2,
              lineHeight: 1,
              color: "#000000",
            }}
          >
            <span style={{ marginRight: -4.2 }}>ALLTOGETHER</span>
            <div
              style={{
                position: "absolute",
                right: -1.5,
                bottom: -5,
                left: -1.5,
                height: 1.5,
                backgroundColor: "#000000",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 30,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              color: "rgba(0, 0, 0, 0.54)",
              fontFamily: "Atlas Typewriter",
              fontSize: 14,
              lineHeight: 1.25,
            }}
          >
            <span>companies</span>
            <span>founders</span>
            <span>updates</span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            top: 92,
            left: 367,
            display: "flex",
            flexDirection: "column",
            width: 760,
          }}
        >
          <div
            style={{
              color: "#00E100",
              fontFamily: "Atlas Typewriter",
              fontSize: 15,
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            [all together]
          </div>
          <div
            style={{
              marginTop: 26,
              display: "flex",
              flexDirection: "column",
              fontFamily: "Newsreader",
              fontSize: 55,
              fontWeight: 400,
              lineHeight: 0.96,
              letterSpacing: -1.8,
              color: "#000000",
            }}
          >
            <span>The future is built together.</span>
            <span>The future is built now.</span>
          </div>
          <div
            style={{
              marginTop: 28,
              width: 610,
              fontSize: 20,
              fontWeight: 400,
              lineHeight: 1.35,
              color: "rgba(0, 0, 0, 0.72)",
            }}
          >
            Backing founders across AI, defense, energy, robotics, semiconductors, and space.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 367,
            right: 64,
            bottom: 82,
            display: "flex",
            gap: 8,
          }}
        >
          {productCovers.map((src, index) => (
            <img
              key={index}
              alt=""
              src={src}
              width={184}
              height={106}
              style={{
                width: 184,
                height: 106,
                objectFit: "cover",
                border: "1px solid rgba(0, 0, 0, 0.10)",
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 367,
            right: 64,
            bottom: 34,
            display: "flex",
            overflow: "hidden",
            fontFamily: "Atlas Typewriter",
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: 4,
            color: "rgba(0, 0, 0, 0.26)",
            whiteSpace: "nowrap",
          }}
        >
          {GLYPH_RAMP}
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
