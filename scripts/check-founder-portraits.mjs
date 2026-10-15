import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import ts from "typescript";

const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));
const sharp = nextRequire("sharp");

const source = readFileSync("src/lib/founders.ts", "utf8");
const ast = ts.createSourceFile("founders.ts", source, ts.ScriptTarget.Latest, true);
const catalog = [];
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "FOUNDER_CATALOG") {
    if (!ts.isArrayLiteralExpression(node.initializer)) {
      throw new Error("Founder catalog must be an array of literal entries");
    }
    for (const entry of node.initializer.elements) {
      catalog.push(Object.fromEntries(entry.properties.filter(ts.isPropertyAssignment)
        .map((property) => [property.name.getText(ast), property.initializer.text])));
    }
  }
  ts.forEachChild(node, visit);
}
visit(ast);

// This is the same allowlist used to construct the public FOUNDERS export.
const verified = JSON.parse(readFileSync("src/lib/verified-founder-portraits.json", "utf8"));
const sources = JSON.parse(readFileSync("assets/brand/founder-portrait-sources.json", "utf8"));
const pending = new Map(sources.filter((entry) => entry.pendingPortrait)
  .map((entry) => [entry.image, entry.name]));
const catalogSources = new Set(catalog.map((founder) => founder.headshot));
const errors = [];
const checkedAssets = new Set();
let published = 0;

if (!catalog.length) errors.push("No founder catalog entries found");
if (!Object.keys(verified).length) errors.push("No verified founder portraits found");

for (const [original, portrait] of Object.entries(verified)) {
  if (!catalogSources.has(original)) {
    errors.push(`Portrait registry has an unknown catalog source: ${original}`);
  }
  if (pending.has(original)) {
    errors.push(`${pending.get(original)}: pending or generic avatars cannot be published`);
  }
  if (typeof portrait !== "string" ||
      !/^\/founders\/(?:cutouts-webp|transparent(?:-v2)?)\/[a-z0-9-]+\.webp$/.test(portrait)) {
    errors.push(`Portrait registry must reference a local transparent WebP: ${original}`);
    continue;
  }
  if (checkedAssets.has(portrait)) continue;
  checkedAssets.add(portrait);
  try {
    const image = sharp(join("public", portrait));
    const metadata = await image.metadata();
    if (metadata.format !== "webp") throw new Error("image is not a valid WebP");
    if (!metadata.hasAlpha) throw new Error("image has no alpha channel");
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
    const pixels = info.width * info.height;
    let transparentPixels = 0;
    let visiblePixels = 0;
    for (let alpha = info.channels - 1; alpha < data.length; alpha += info.channels) {
      if (data[alpha] === 0) transparentPixels++;
      if (data[alpha] >= 128) visiblePixels++;
    }
    if (transparentPixels / pixels <= 0.03) {
      throw new Error("background must contain more than 3% fully transparent pixels");
    }
    if (visiblePixels / pixels <= 0.01) throw new Error("image has no visible portrait");
    // New cutouts change only transparency, never the person's photographic pixels.
    if (portrait.startsWith("/founders/transparent-v2/")) {
      const originalImage = await sharp(join("public", original)).ensureAlpha()
        .raw().toBuffer({ resolveWithObject: true });
      if (info.width !== originalImage.info.width || info.height !== originalImage.info.height) {
        throw new Error("cutout dimensions differ from the original photograph");
      }
      for (let pixel = 0; pixel < pixels; pixel++) {
        const offset = pixel * info.channels;
        const originalOffset = pixel * originalImage.info.channels;
        if (data[offset + info.channels - 1] === 0) continue;
        if ([0, 1, 2].some((channel) => data[offset + channel] !== originalImage.data[originalOffset + channel])) {
          throw new Error("cutout changed the original photograph's visible pixels");
        }
      }
    }
  } catch (error) {
    errors.push(`${portrait}: ${error.message}`);
  }
}

for (const founder of catalog) {
  if (!founder.headshot?.startsWith("/founders/")) {
    errors.push(`${founder.name}: a local founder photo source is required`);
  }
  if (Object.hasOwn(verified, founder.headshot)) published++;
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`Verified ${published} published founder cards and ${checkedAssets.size} transparent portrait assets; ${catalog.length - published} unapproved entries remain hidden.`);
