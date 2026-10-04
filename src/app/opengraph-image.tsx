import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export const alt = "Machine Spirit Capital";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [unica77, brandMark, staticNoise] = await Promise.all([
    readFile(join(process.cwd(), "public/fonts/Unica77LLWeb-Regular.ttf")),
    readFile(join(process.cwd(), "public/brand/machine-spirit-wing-mark.png")),
    readFile(join(process.cwd(), "public/brand/machine-spirit-static-noise.png")),
  ]);

  const brandMarkSrc = `data:image/png;base64,${brandMark.toString("base64")}`;
  const staticNoiseSrc = `data:image/png;base64,${staticNoise.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          backgroundColor: "#f1efe9",
          color: "#0f0f0e",
        }}
      >
        <img
          alt=""
          src={staticNoiseSrc}
          width={1200}
          height={630}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.055,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 30,
            right: 30,
            bottom: 30,
            left: 30,
            display: "flex",
            border: "1px solid rgba(15, 15, 14, 0.08)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 30,
          }}
        >
          <img
            alt=""
            src={brandMarkSrc}
            width={190}
            height={93}
            style={{ width: 190, height: 93, objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 10,
              fontFamily: "Unica77",
              fontSize: 44,
              fontWeight: 400,
              letterSpacing: 7,
              lineHeight: 1,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            <span>MACHINE SPIRIT</span>
            <span>CAPITAL</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Unica77",
          data: unica77,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
