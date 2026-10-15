import { createRequire } from "node:module";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { basename, join } from "node:path";

const requireFromNext = createRequire(import.meta.resolve("next/package.json"));
const sharp = requireFromNext("sharp");
const rawDirectory = "output/founder-cutouts/raw";
const outputDirectory = "public/founders/transparent-v2";
mkdirSync(outputDirectory, { recursive: true });

// Tighten extraction spill without recoloring any pixels from the photograph.
function contractAlpha(alpha, width, height, radius) {
  const horizontal = Buffer.alloc(alpha.length);
  const contracted = Buffer.alloc(alpha.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minimum = 255;
      for (let dx = -radius; dx <= radius; dx++) {
        if (x + dx >= 0 && x + dx < width) minimum = Math.min(minimum, alpha[y * width + x + dx]);
      }
      horizontal[y * width + x] = minimum;
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minimum = 255;
      for (let dy = -radius; dy <= radius; dy++) {
        if (y + dy >= 0 && y + dy < height) minimum = Math.min(minimum, horizontal[(y + dy) * width + x]);
      }
      contracted[y * width + x] = minimum;
    }
  }
  return contracted;
}

const edgeCleanup = {
  "joe-landon": 8,
  "phil-c-frank": 2,
  "alexander-urbanski": 1,
  "kareem-selim": 1,
  "zaky-hassan": 1,
  "jeffrey-lin": 1,
  "yousef-abdelfattah": 1,
};

const selected = process.argv.slice(2);
const slugs = selected.length
  ? selected
  : readdirSync(rawDirectory).filter((file) => file.endsWith(".png")).map((file) => basename(file, ".png"));

for (const slug of slugs) {
  const source = join("public/founders/portraits", `${slug}.webp`);
  const maskSource = join(rawDirectory, `${slug}.png`);
  if (!existsSync(source) || !existsSync(maskSource) || slug === "ayush-chauhan") {
    throw new Error(`A verified source and extracted mask are required for ${slug}`);
  }

  // Keep the real photograph's RGB pixels. Only the extracted alpha is used.
  const { data, info } = await sharp(source).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const metadata = await sharp(maskSource).metadata();
  if (!metadata.hasAlpha) throw new Error(`${slug}: extraction has no transparency`);
  // Non-square edit targets are centered on a square without changing source pixels.
  const edge = Math.max(info.width, info.height);
  // Register the one extraction whose vertical framing compressed toward the bottom.
  const maskHeight = slug === "dimitris-koutentakis" ? Math.round(edge * 1.105) : edge;
  let alpha = await sharp(maskSource).extractChannel("alpha")
    .resize(edge, maskHeight, { fit: "fill" })
    .extract({ left: Math.floor((edge - info.width) / 2), top: maskHeight - edge + Math.floor((edge - info.height) / 2), width: info.width, height: info.height })
    .raw().toBuffer();
  if (slug === "xu-zheng") {
    // Align the small silhouette and remove the pale edge left by its extraction.
    const registered = Buffer.alloc(alpha.length);
    for (let y = 0; y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        let minimum = 255;
        const radius = y > info.height * 0.6 ? 2 : 1;
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const px = x + dx;
            const py = y + dy - 2;
            minimum = Math.min(minimum, px >= 0 && px < info.width && py >= 0 && py < info.height
              ? alpha[py * info.width + px] : 0);
          }
        }
        registered[y * info.width + x] = minimum;
      }
    }
    alpha = registered;
  }
  if (edgeCleanup[slug]) alpha = contractAlpha(alpha, info.width, info.height, edgeCleanup[slug]);
  if (slug === "mingi-kwon") {
    // Trim the foreground cushion along the original sweatshirt's lower edge.
    for (let y = 0; y < info.height; y++) {
      for (let x = Math.floor(info.width * 0.86); x < info.width; x++) {
        const garmentEdge = info.height - (x - info.width * 0.86) * 0.55;
        if (y > garmentEdge) alpha[y * info.width + x] = 0;
      }
    }
  }
  if (slug === "joe-landon") {
    // The extraction reaches the lower canvas border beyond the dark jacket.
    // Clear only the neutral white exterior at those two outer side margins.
    for (let y = Math.floor(info.height * 0.75); y < info.height; y++) {
      for (let x = 0; x < info.width; x++) {
        if (x >= info.width * 0.12 && x <= info.width * 0.88) continue;
        const pixel = y * info.width + x;
        const colors = [data[pixel * info.channels], data[pixel * info.channels + 1], data[pixel * info.channels + 2]];
        if (Math.min(...colors) > 200 && Math.max(...colors) - Math.min(...colors) < 15) alpha[pixel] = 0;
      }
    }
  }
  let transparent = 0;
  let visible = 0;
  for (let i = 0; i < alpha.length; i += 1) {
    const offset = i * info.channels;
    if (alpha[i] < 8) {
      data[offset] = data[offset + 1] = data[offset + 2] = 0;
    }
    data[offset + info.channels - 1] = alpha[i] < 8 ? 0 : alpha[i] > 245 ? 255 : alpha[i];
    if (alpha[i] < 8) transparent += 1;
    if (alpha[i] > 245) visible += 1;
  }
  if (transparent / alpha.length < 0.03 || visible / alpha.length < 0.01) {
    throw new Error(`${slug}: extraction is empty or still opaque`);
  }
  const output = join(outputDirectory, `${slug}.webp`);
  await sharp(data, { raw: info }).webp({ lossless: true }).toFile(output);
  console.log(`${slug}: ${info.width}x${info.height}, ${Math.round(100 * transparent / alpha.length)}% transparent`);
}
