import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoDir = resolve(scriptDir, "..");
const sourceDir = join(repoDir, "assets", "brand");
const publicDir = join(repoDir, "public", "brand");
const tempDir = join(repoDir, "output", "brand", "wing-kit-build");
const kitDir = join(
  homedir(),
  "Downloads",
  "Machine Spirit Brand",
  "Machine Spirit Wing Mark Brand Kit",
);

const suppliedSource =
  "/var/folders/61/5jdz0pkd3wx20y53kcnw7vww0000gn/T/codex-clipboard-7777882f-4f59-4cc0-8667-cf9afed261f0.png";
const sourceImage = join(sourceDir, "machine-spirit-wing-reference.png");
const font = "/System/Library/Fonts/HelveticaNeue.ttc";

const colors = {
  ink: "#141412",
  ivory: "#F4F2EE",
};

const folders = {
  logosLight: join(kitDir, "01 Logos", "Light"),
  logosDark: join(kitDir, "01 Logos", "Dark"),
  logosTransparent: join(kitDir, "01 Logos", "Transparent"),
  profiles: join(kitDir, "02 Profiles"),
  bannersLight: join(kitDir, "03 Banners", "Light"),
  bannersDark: join(kitDir, "03 Banners", "Dark"),
  web: join(kitDir, "04 Web and App"),
  source: join(kitDir, "05 Source"),
  guidance: join(kitDir, "06 Guidance"),
};

for (const folder of [sourceDir, publicDir, tempDir, kitDir, ...Object.values(folders)]) {
  mkdirSync(folder, { recursive: true });
}

if (existsSync(suppliedSource)) {
  copyFileSync(suppliedSource, sourceImage);
}

if (!existsSync(sourceImage)) {
  throw new Error(`Missing source image: ${sourceImage}`);
}

function runMagick(args) {
  execFileSync("magick", args, { stdio: "inherit" });
}

function write(path, contents) {
  writeFileSync(path, contents.trimStart());
}

function markShapes(fill) {
  return `
    <g fill="${fill}">
      <path d="M0 0H1118V300H230L0 0Z"/>
      <path d="M1754 0H2872L2636 300H1754V0Z"/>
      <path d="M229 428H1118V666H467L229 428Z"/>
      <path d="M1754 428H2643L2405 666H1754V428Z"/>
      <rect x="1317" y="428" width="238" height="238"/>
      <path d="M504 795H1118V1033H742L504 795Z"/>
      <path d="M1754 795H2368L2130 1033H1754V795Z"/>
      <path d="M826 1162H1118V1400H1064L826 1162Z"/>
      <path d="M1754 1162H2046L1808 1400H1754V1162Z"/>
    </g>`;
}

function markSvg(fill, label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2872 1400" role="img" aria-labelledby="title">
  <title id="title">${label}</title>
  ${markShapes(fill).trim()}
</svg>`;
}

function renderSvg(svgPath, outputPath, width) {
  runMagick([
    "-background",
    "none",
    svgPath,
    "-filter",
    "Lanczos",
    "-resize",
    `${width}x`,
    outputPath,
  ]);
}

function squareMark(markPath, outputPath, size, markWidth, background = "none") {
  runMagick([
    "-size",
    `${size}x${size}`,
    `canvas:${background}`,
    "(",
    markPath,
    "-resize",
    `${markWidth}x`,
    ")",
    "-gravity",
    "center",
    "-composite",
    outputPath,
  ]);
}

function makeWordmark(outputPath, fill) {
  runMagick([
    "-background",
    "none",
    "-fill",
    fill,
    "-font",
    font,
    "-pointsize",
    "238",
    "-kerning",
    "34",
    "label:MACHINE SPIRIT",
    "-gravity",
    "center",
    "-extent",
    "4096x1024",
    outputPath,
  ]);
}

function makeHorizontalLockup(wordmarkPath, markPath, outputPath) {
  const wordmarkTrimmed = join(tempDir, `wordmark-${Date.now()}-${Math.random()}.png`);
  const markResized = join(tempDir, `mark-${Date.now()}-${Math.random()}.png`);
  const spacer = join(tempDir, `horizontal-spacer-${Date.now()}-${Math.random()}.png`);
  runMagick([wordmarkPath, "-trim", "+repage", "-resize", "2450x", wordmarkTrimmed]);
  runMagick([markPath, "-resize", "520x", markResized]);
  runMagick(["-size", "130x1", "canvas:none", spacer]);
  runMagick([
    "-background",
    "none",
    "-gravity",
    "center",
    wordmarkTrimmed,
    spacer,
    markResized,
    "+append",
    "-gravity",
    "center",
    "-extent",
    "4096x1024",
    outputPath,
  ]);
}

function makeStackedLockup(wordmarkPath, markPath, outputPath) {
  const wordmarkTrimmed = join(tempDir, `stack-wordmark-${Date.now()}-${Math.random()}.png`);
  const markResized = join(tempDir, `stack-mark-${Date.now()}-${Math.random()}.png`);
  const spacer = join(tempDir, `stack-spacer-${Date.now()}-${Math.random()}.png`);
  runMagick([wordmarkPath, "-trim", "+repage", "-resize", "1360x", wordmarkTrimmed]);
  runMagick([markPath, "-resize", "1200x", markResized]);
  runMagick(["-size", "1x120", "canvas:none", spacer]);
  runMagick([
    "-background",
    "none",
    "-gravity",
    "center",
    markResized,
    spacer,
    wordmarkTrimmed,
    "-append",
    "-gravity",
    "center",
    "-extent",
    "2048x2048",
    outputPath,
  ]);
}

function placeOnBackground(assetPath, outputPath, width, height, background, assetWidth, offsetY = 0) {
  runMagick([
    "-size",
    `${width}x${height}`,
    `canvas:${background}`,
    "(",
    assetPath,
    "-resize",
    `${assetWidth}x`,
    ")",
    "-gravity",
    "center",
    "-geometry",
    `+0${offsetY >= 0 ? "+" : ""}${offsetY}`,
    "-composite",
    outputPath,
  ]);
}

function resize(input, output, size) {
  runMagick([input, "-filter", "Lanczos", "-resize", size, output]);
}

const blackSvg = join(folders.source, "Machine Spirit wing mark - black.svg");
const ivorySvg = join(folders.source, "Machine Spirit wing mark - ivory.svg");
write(blackSvg, markSvg(colors.ink, "Machine Spirit wing mark in black"));
write(ivorySvg, markSvg(colors.ivory, "Machine Spirit wing mark in ivory"));

const blackTight = join(
  folders.logosTransparent,
  "Machine Spirit wing mark - black - tight 4096.png",
);
const ivoryTight = join(
  folders.logosTransparent,
  "Machine Spirit wing mark - ivory - tight 4096.png",
);
renderSvg(blackSvg, blackTight, 4096);
renderSvg(ivorySvg, ivoryTight, 4096);

const blackSquare = join(
  folders.logosTransparent,
  "Machine Spirit wing mark - black - square 4096.png",
);
const ivorySquare = join(
  folders.logosTransparent,
  "Machine Spirit wing mark - ivory - square 4096.png",
);
squareMark(blackTight, blackSquare, 4096, 2872);
squareMark(ivoryTight, ivorySquare, 4096, 2872);

const wordmarkBlack = join(
  folders.logosTransparent,
  "Machine Spirit wordmark only - black - 4096x1024.png",
);
const wordmarkIvory = join(
  folders.logosTransparent,
  "Machine Spirit wordmark only - ivory - 4096x1024.png",
);
makeWordmark(wordmarkBlack, colors.ink);
makeWordmark(wordmarkIvory, colors.ivory);

const horizontalBlack = join(
  folders.logosTransparent,
  "Machine Spirit horizontal lockup - black - 4096x1024.png",
);
const horizontalIvory = join(
  folders.logosTransparent,
  "Machine Spirit horizontal lockup - ivory - 4096x1024.png",
);
makeHorizontalLockup(wordmarkBlack, blackTight, horizontalBlack);
makeHorizontalLockup(wordmarkIvory, ivoryTight, horizontalIvory);

const stackedBlack = join(
  folders.logosTransparent,
  "Machine Spirit stacked lockup - black - 2048.png",
);
const stackedIvory = join(
  folders.logosTransparent,
  "Machine Spirit stacked lockup - ivory - 2048.png",
);
makeStackedLockup(wordmarkBlack, blackTight, stackedBlack);
makeStackedLockup(wordmarkIvory, ivoryTight, stackedIvory);

const lightSymbol = join(folders.logosLight, "Machine Spirit symbol - light - 4096.png");
const darkSymbol = join(folders.logosDark, "Machine Spirit symbol - dark - 4096.png");
squareMark(blackTight, lightSymbol, 4096, 2872, colors.ivory);
squareMark(ivoryTight, darkSymbol, 4096, 2872, colors.ink);

placeOnBackground(
  horizontalBlack,
  join(folders.logosLight, "Machine Spirit horizontal lockup - light - 4096x1024.png"),
  4096,
  1024,
  colors.ivory,
  3100,
);
placeOnBackground(
  horizontalIvory,
  join(folders.logosDark, "Machine Spirit horizontal lockup - dark - 4096x1024.png"),
  4096,
  1024,
  colors.ink,
  3100,
);
placeOnBackground(
  stackedBlack,
  join(folders.logosLight, "Machine Spirit stacked lockup - light - 2048.png"),
  2048,
  2048,
  colors.ivory,
  1700,
);
placeOnBackground(
  stackedIvory,
  join(folders.logosDark, "Machine Spirit stacked lockup - dark - 2048.png"),
  2048,
  2048,
  colors.ink,
  1700,
);

const profileDark2048 = join(folders.profiles, "Profile avatar - dark - 2048.png");
const profileLight2048 = join(folders.profiles, "Profile avatar - light - 2048.png");
squareMark(ivoryTight, profileDark2048, 2048, 1436, colors.ink);
squareMark(blackTight, profileLight2048, 2048, 1436, colors.ivory);
for (const size of [800, 400]) {
  resize(profileDark2048, join(folders.profiles, `Profile avatar - dark - ${size}.png`), `${size}x${size}`);
  resize(profileLight2048, join(folders.profiles, `Profile avatar - light - ${size}.png`), `${size}x${size}`);
}

const bannerSpecs = [
  ["X banner", 3000, 1000, 1180, 0],
  ["X banner standard", 1500, 500, 590, 0],
  ["LinkedIn company banner", 2256, 382, 760, 0],
  ["LinkedIn company banner standard", 1128, 191, 380, 0],
  ["LinkedIn personal banner", 3168, 792, 980, 0],
  ["LinkedIn personal banner standard", 1584, 396, 490, 0],
  ["YouTube channel banner", 2560, 1440, 900, 0],
  ["Open Graph social card", 2400, 1260, 1060, 0],
  ["Open Graph social card standard", 1200, 630, 530, 0],
  ["Presentation cover", 3840, 2160, 1280, 0],
  ["Presentation cover standard", 1920, 1080, 640, 0],
  ["Email header", 2400, 600, 980, 0],
  ["Email header standard", 1200, 300, 490, 0],
];

for (const [name, width, height, assetWidth, offsetY] of bannerSpecs) {
  placeOnBackground(
    horizontalBlack,
    join(folders.bannersLight, `${name} - light - ${width}x${height}.png`),
    width,
    height,
    colors.ivory,
    assetWidth,
    offsetY,
  );
  placeOnBackground(
    horizontalIvory,
    join(folders.bannersDark, `${name} - dark - ${width}x${height}.png`),
    width,
    height,
    colors.ink,
    assetWidth,
    offsetY,
  );
}

const appDark = join(folders.web, "App icon - dark - 1024.png");
const appLight = join(folders.web, "App icon - light - 1024.png");
squareMark(ivoryTight, appDark, 1024, 718, colors.ink);
squareMark(blackTight, appLight, 1024, 718, colors.ivory);
resize(appDark, join(folders.web, "Web icon - dark - 512.png"), "512x512");
resize(appLight, join(folders.web, "Web icon - light - 512.png"), "512x512");
resize(appDark, join(folders.web, "android-icon-dark-512.png"), "512x512");
resize(appDark, join(folders.web, "android-icon-dark-192.png"), "192x192");
resize(appDark, join(folders.web, "apple-touch-icon-dark-180.png"), "180x180");
resize(appLight, join(folders.web, "apple-touch-icon-light-180.png"), "180x180");
runMagick([appDark, "-define", "icon:auto-resize=64,48,32,16", join(folders.web, "favicon-dark.ico")]);
runMagick([appLight, "-define", "icon:auto-resize=64,48,32,16", join(folders.web, "favicon-light.ico")]);

copyFileSync(sourceImage, join(folders.source, "Original supplied mark.png"));

const overviewSvg = join(tempDir, "brand-kit-overview.svg");
write(
  overviewSvg,
  `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1600" viewBox="0 0 2400 1600">
  <rect width="2400" height="1600" fill="${colors.ivory}"/>
  <text x="140" y="170" fill="${colors.ink}" font-family="Helvetica Neue, Arial, sans-serif" font-size="76">MACHINE SPIRIT</text>
  <text x="140" y="235" fill="#56534d" font-family="Helvetica Neue, Arial, sans-serif" font-size="28" letter-spacing="5">WING MARK IDENTITY SYSTEM</text>
  <rect x="140" y="330" width="1010" height="650" fill="#FBFAF7" stroke="#D2CEC6"/>
  <g transform="translate(278 470) scale(.255)">${markShapes(colors.ink)}</g>
  <text x="190" y="930" fill="${colors.ink}" font-family="Helvetica Neue, Arial, sans-serif" font-size="26" letter-spacing="5">LIGHT MODE</text>
  <rect x="1250" y="330" width="1010" height="650" fill="${colors.ink}"/>
  <g transform="translate(1388 470) scale(.255)">${markShapes(colors.ivory)}</g>
  <text x="1300" y="930" fill="${colors.ivory}" font-family="Helvetica Neue, Arial, sans-serif" font-size="26" letter-spacing="5">DARK MODE</text>
  <text x="140" y="1100" fill="${colors.ink}" font-family="Helvetica Neue, Arial, sans-serif" font-size="34" letter-spacing="6">CORE PALETTE</text>
  <rect x="140" y="1160" width="330" height="170" fill="${colors.ink}"/>
  <text x="500" y="1230" fill="${colors.ink}" font-family="Helvetica Neue, Arial, sans-serif" font-size="30">Machine Charcoal</text>
  <text x="500" y="1280" fill="#56534d" font-family="Helvetica Neue, Arial, sans-serif" font-size="24" letter-spacing="3">#141412</text>
  <rect x="930" y="1160" width="330" height="170" fill="${colors.ivory}" stroke="#C9C4BB"/>
  <text x="1290" y="1230" fill="${colors.ink}" font-family="Helvetica Neue, Arial, sans-serif" font-size="30">Warm Paper</text>
  <text x="1290" y="1280" fill="#56534d" font-family="Helvetica Neue, Arial, sans-serif" font-size="24" letter-spacing="3">#F4F2EE</text>
  <text x="140" y="1450" fill="#56534d" font-family="Helvetica Neue, Arial, sans-serif" font-size="23" letter-spacing="1">Use the mark with generous clear space. Minimum digital width: 24 px.</text>
  <text x="140" y="1500" fill="#56534d" font-family="Helvetica Neue, Arial, sans-serif" font-size="23" letter-spacing="1">Never stretch, outline, rotate, recolor, or add effects.</text>
</svg>`,
);
renderSvg(overviewSvg, join(kitDir, "Machine Spirit Brand Kit Overview.png"), 2400);

const readme = `MACHINE SPIRIT WING MARK BRAND KIT

CORE COLORS
Machine Charcoal  #141412
Warm Paper        #F4F2EE

LOGO USE
- Use the charcoal mark and lockups on Warm Paper or other very light surfaces.
- Use the paper mark and lockups on Machine Charcoal or other very dark surfaces.
- Keep clear space around the mark equal to the width of its center square.
- Minimum digital width: 24 px for the standalone mark.
- Do not stretch, rotate, outline, recolor, shadow, or alter the geometry.

FOLDERS
01 Logos: light, dark, and transparent master assets.
02 Profiles: square social avatars at 400, 800, and 2048 px.
03 Banners: X, LinkedIn, YouTube, Open Graph, presentation, and email formats.
04 Web and App: app icons, web icons, Apple/Android icons, and ICO favicons.
05 Source: original supplied art and editable SVG masters.
06 Guidance: quick-use notes and asset manifest.

WORDMARK
The supplied website lockup uses Helvetica Neue with wide tracking and the wing mark to the right of MACHINE SPIRIT.
`;
write(join(kitDir, "README.txt"), readme);
write(join(folders.guidance, "Logo usage.txt"), readme);

const manifest = {
  brand: "Machine Spirit",
  mark: "Wing mark",
  colors,
  generatedAt: new Date().toISOString(),
  source: "User-supplied 4096 x 4096 PNG",
  minimumDigitalWidth: "24px",
};
write(join(folders.guidance, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const publicBlack = join(publicDir, "machine-spirit-wing-mark.png");
const publicIvory = join(publicDir, "machine-spirit-wing-mark-ivory.png");
resize(blackTight, publicBlack, "1024x");
resize(ivoryTight, publicIvory, "1024x");
copyFileSync(blackSvg, join(publicDir, "machine-spirit-wing-mark.svg"));
copyFileSync(ivorySvg, join(publicDir, "machine-spirit-wing-mark-ivory.svg"));
resize(blackSquare, join(publicDir, "machine-spirit-mark.png"), "1024x1024");
resize(ivorySquare, join(publicDir, "machine-spirit-mark-white.png"), "1024x1024");
copyFileSync(blackSvg, join(publicDir, "machine-spirit-mark.svg"));
copyFileSync(ivorySvg, join(publicDir, "machine-spirit-mark-white.svg"));
resize(horizontalBlack, join(publicDir, "machine-spirit-lockup-light.png"), "2048x512");
resize(horizontalIvory, join(publicDir, "machine-spirit-lockup-dark.png"), "2048x512");
copyFileSync(join(folders.web, "Web icon - light - 512.png"), join(publicDir, "machine-spirit-favicon-light.png"));
copyFileSync(join(folders.web, "Web icon - dark - 512.png"), join(publicDir, "machine-spirit-favicon-dark.png"));
copyFileSync(appDark, join(repoDir, "src", "app", "icon.png"));
copyFileSync(join(folders.web, "apple-touch-icon-dark-180.png"), join(repoDir, "src", "app", "apple-icon.png"));
copyFileSync(join(folders.web, "favicon-dark.ico"), join(repoDir, "src", "app", "favicon.ico"));

for (const alias of [
  "machine-spirit-geometric-mark.png",
  "machine-spirit-signal-mark.png",
  "machine-spirit-signal-mark-v2.png",
]) {
  copyFileSync(publicBlack, join(publicDir, alias));
}
copyFileSync(publicIvory, join(publicDir, "machine-spirit-signal-mark-v2-ivory.png"));

console.log(kitDir);
