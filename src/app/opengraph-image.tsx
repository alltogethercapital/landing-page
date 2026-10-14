import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { GLYPH_RAMP } from "@/lib/glyphs";

// Share preview uses the same live wing, wordmark, and dark monochrome identity.

export const runtime = "nodejs";

export const alt =
  "Machine Spirit Capital, backing the founders rebuilding the hard frontier.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [
    atlasMedium,
    spaceGrotesk,
    aformicCover,
    arrayLabsCover,
    mavenCover,
    volantisCover,
    brandMark,
    wordmark,
  ] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/AtlasTypewriter-Medium-Web.ttf")),
    readFile(join(process.cwd(), "public/fonts/SpaceGrotesk-Regular.ttf")),
    readFile(join(process.cwd(), "public/work/cards/aformic.jpg")),
    readFile(join(process.cwd(), "public/work/cards/array-labs.jpg")),
    readFile(join(process.cwd(), "public/work/cards/maven.jpg")),
    readFile(join(process.cwd(), "public/work/cards/volantis.jpg")),
    readFile(
      join(process.cwd(), "public/brand/machine-spirit-live-symbol-ivory.png"),
    ),
    readFile(join(process.cwd(), "public/brand/machine-spirit-wordmark-og.png")),
  ]);
  const productCovers = [aformicCover, arrayLabsCover, mavenCover, volantisCover].map(
    (image) => `data:image/jpeg;base64,${image.toString("base64")}`,
  );
  const brandMarkSrc = `data:image/png;base64,${brandMark.toString("base64")}`;
  const wordmarkSrc = `data:image/png;base64,${wordmark.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          backgroundColor: "#121212",
          color: "#f7f6f3",
          fontFamily: "Space Grotesk",
        }}
      >
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
          <img
            alt="Machine Spirit Capital"
            src={brandMarkSrc}
            width={96}
            height={47}
            style={{ width: 96, height: 47, objectFit: "contain" }}
          />
          <div
            style={{
              marginTop: 30,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              color: "rgba(247, 246, 243, 0.64)",
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
          <img
            alt="MACHINE SPIRIT"
            src={wordmarkSrc}
            width={260}
            height={24}
            style={{ width: 260, height: 24, objectFit: "contain" }}
          />
          <div
            style={{
              marginTop: 26,
              display: "flex",
              flexDirection: "column",
              fontFamily: "Space Grotesk",
              fontSize: 52,
              fontWeight: 400,
              lineHeight: 1.06,
              letterSpacing: -1.4,
              color: "#f7f6f3",
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
              color: "rgba(247, 246, 243, 0.76)",
            }}
          >
            Backing the builders and stewards of the hard frontier.
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
            color: "rgba(247, 246, 243, 0.2)",
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
        { name: "Space Grotesk", data: spaceGrotesk, style: "normal", weight: 400 },
      ],
    },
  );
}
