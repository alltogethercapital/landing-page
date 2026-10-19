import { createRequire } from "node:module";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");
const root = resolve(process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), ".."));
const sourcePath = "public/brand/identity/relief-light.svg";
const source = await readFile(join(root, sourcePath), "utf8");
// These are the exact seven rounded paths from the approved Soft Relief master.
const paths = [...new Set([...source.matchAll(/<path d="([^"]+)"/g)].map((match) => match[1]))];
if (paths.length !== 7) throw new Error("Expected the approved seven-piece relief mark");
const geometry = paths.map((path) => `<path d="${path}"/>`).join("");

// Measure the silhouette, excluding the master's asymmetric canvas padding and shadows.
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1840" height="620" viewBox="0 0 920 310"><g fill="white">${geometry}</g></svg>`);
const { data, info } = await sharp(mask).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let mass = 0;
let momentX = 0;
let momentY = 0;
for (let y = 0; y < info.height; y++) {
  for (let x = 0; x < info.width; x++) {
    const alpha = data[(y * info.width + x) * info.channels + 3];
    mass += alpha;
    momentX += (x + 0.5) * alpha;
    momentY += (y + 0.5) * alpha;
  }
}
const centroid = { x: momentX / mass / 2, y: momentY / mass / 2 };

function artwork(size) {
  const scale = size * 0.86 / 920;
  const x = size / 2 - centroid.x * scale;
  const y = size / 2 - centroid.y * scale;
  // Minimum pixel values keep the white rows distinct at 16px and 32px.
  const rim = Math.max(size === 16 ? 0.18 : 0.36, size * 0.0018) / scale;
  const depth = Math.max(0.45, size * 0.007) / scale;
  const contact = Math.max(0.25, size * 0.003) / scale;
  const blur = Math.max(0.3, size * 0.006) / scale;
  const lift = Math.max(0.45, size * 0.012) / scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <title>Machine Spirit — white Soft Relief on light stone</title>
  <defs>
    <radialGradient id="stone" cx="50%" cy="45%" r="70%"><stop stop-color="#d9ddd4"/><stop offset=".55" stop-color="#d2d7cd"/><stop offset="1" stop-color="#bfc6b9"/></radialGradient>
    <linearGradient id="face" x1="0" y1="0" x2=".08" y2="1"><stop stop-color="#ffffff"/><stop offset=".3" stop-color="#fcfcf8"/><stop offset="1" stop-color="#f1f2eb"/></linearGradient>
    <filter id="lift" x="-.2" y="-.6" width="1.4" height="2.5" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="blur"/>
      <feOffset in="blur" dy="${lift}" result="offset"/>
      <feFlood flood-color="#283122" flood-opacity=".32"/><feComposite in2="offset" operator="in" result="soft"/>
      <feOffset in="SourceAlpha" dy="${contact}" result="contact"/>
      <feFlood flood-color="#27301f" flood-opacity=".7"/><feComposite in2="contact" operator="in" result="edge"/>
      <feMerge><feMergeNode in="soft"/><feMergeNode in="edge"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <path fill="url(#stone)" d="M0 0H${size}V${size}H0Z"/>
  <g transform="translate(${x} ${y}) scale(${scale})" filter="url(#lift)">
    <g transform="translate(0 ${depth})" fill="#6f7b63">${geometry}</g>
    <g fill="url(#face)" stroke="#6f7966" stroke-opacity=".86" stroke-width="${rim}" stroke-linejoin="round">${geometry}</g>
  </g>
</svg>`;
}

const output = join(root, "output/favicon-soft-relief");
await mkdir(output, { recursive: true });
const frames = [];
for (const size of [16, 32, 48, 64, 128, 180, 256, 512]) {
  // Render directly at each destination size; avoid reducing a large, faint shadow.
  const png = await sharp(Buffer.from(artwork(size))).png().toBuffer();
  await writeFile(join(output, `favicon-${size}.png`), png);
  if ([16, 32, 48, 64, 128, 256].includes(size)) frames.push({ size, png });
  const numberedIcon = { 16: "icon1.png", 32: "icon2.png", 48: "icon3.png" }[size];
  if (numberedIcon) await writeFile(join(root, "src/app", numberedIcon), png);
  if (size === 512) await writeFile(join(root, "src/app/icon.png"), png);
  if (size === 180) await writeFile(join(root, "src/app/apple-icon.png"), png);
}

// PNG-backed ICO frames preserve the individually rendered small-size artwork.
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
for (const [index, { size, png }] of frames.entries()) {
  const entry = 6 + 16 * index;
  header[entry] = size === 256 ? 0 : size;
  header[entry + 1] = size === 256 ? 0 : size;
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(png.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += png.length;
}
await writeFile(join(root, "src/app/favicon.ico"), Buffer.concat([header, ...frames.map((frame) => frame.png)]));
await writeFile(join(root, "public/brand/identity/favicon-light.svg"), artwork(512));
await writeFile(join(output, "centering.json"), JSON.stringify({
  source: sourcePath,
  pieces: paths.length,
  centroid,
  boundingBoxCenter: { x: 460, y: 155 },
  opticalOffsetAt512: { x: (460 - centroid.x) * 512 * 0.86 / 920, y: (155 - centroid.y) * 512 * 0.86 / 920 },
  sizes: [16, 32, 48, 64, 128, 180, 256, 512],
}, null, 2) + "\n");
console.log(`Exported white Soft Relief favicons; silhouette centroid ${centroid.x.toFixed(2)}, ${centroid.y.toFixed(2)}.`);
