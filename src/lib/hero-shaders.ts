// The two leading atlas tiles make binary treatments available without changing
// the original density ramp, whose indices remain offset by exactly two.
const ORIGINAL_GLYPH_RAMP =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYZXcvunxrj/ft\\|()1{}[]?_-+~<>i!lI;:\",^'. ";

export const HERO_GLYPHS = `01${ORIGINAL_GLYPH_RAMP}`;
export const ATLAS_COLS = 9;
export const ATLAS_ROWS = 8;
export const ATLAS_TILE = 64;

const glyphIndex = (glyph: string) =>
  HERO_GLYPHS.indexOf(glyph).toFixed(1);

export const HERO_VERTEX_SHADER = `
attribute vec2 aPos;
varying vec2 vUV;
void main() {
  vUV = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

// Render this pass at the character-grid resolution. Six source samples retain
// highlights; four wider neighbors preserve contours in soft or dark footage.
export const HERO_SCENE_SHADER = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D uVideo;
uniform vec2 uGrid;
uniform vec2 uCropMin;
uniform vec2 uCropMax;
uniform vec2 uPull;
uniform vec2 uLean;

float luma(vec3 rgb) {
  return dot(rgb, vec3(0.2126, 0.7152, 0.0722));
}

vec3 videoAt(vec2 point) {
  vec2 relative = point - 0.5;
  float perspective = max(0.72, 1.0 + dot(uLean, relative * 2.0));
  vec2 projected = 0.5 + relative / perspective - uPull;
  return texture2D(uVideo, mix(uCropMin, uCropMax, clamp(projected, 0.0, 1.0))).rgb;
}

void main() {
  vec2 center = (floor(vUV * uGrid) + 0.5) / uGrid;
  vec2 tap = vec2(0.25, 0.333333) / uGrid;
  vec3 lowerLeft = videoAt(center + vec2(-tap.x, -tap.y));
  vec3 lowerRight = videoAt(center + vec2(tap.x, -tap.y));
  vec3 middleLeft = videoAt(center + vec2(-tap.x, 0.0));
  vec3 middleRight = videoAt(center + vec2(tap.x, 0.0));
  vec3 upperLeft = videoAt(center + vec2(-tap.x, tap.y));
  vec3 upperRight = videoAt(center + vec2(tap.x, tap.y));

  vec3 rgb = (lowerLeft + lowerRight + middleLeft + middleRight + upperLeft + upperRight) / 6.0;
  float gradientX = luma((lowerRight + middleRight + upperRight) / 3.0)
    - luma((lowerLeft + middleLeft + upperLeft) / 3.0);
  float gradientY = luma((upperLeft + upperRight) * 0.5)
    - luma((lowerLeft + lowerRight) * 0.5);
  vec2 span = 1.0 / uGrid;
  float left = luma(videoAt(center - vec2(span.x, 0.0)));
  float right = luma(videoAt(center + vec2(span.x, 0.0)));
  float lower = luma(videoAt(center - vec2(0.0, span.y)));
  float upper = luma(videoAt(center + vec2(0.0, span.y)));
  float wideGradient = length(vec2(right - left, upper - lower));
  float fineGradient = length(vec2(gradientX, gradientY));
  float gradient = max(wideGradient, fineGradient * 1.8);
  float neighborhood = (left + right + lower + upper) * 0.25;
  // Relative contrast lets dark metal and softly lit faces retain their lines
  // without lifting every flat shadow into a field of noise.
  float relativeContrast = gradient / max(0.08, neighborhood);
  float absoluteEdge = smoothstep(0.009, 0.13, gradient);
  float relativeEdge = smoothstep(0.035, 0.4, relativeContrast);
  float contour = clamp(absoluteEdge * 0.65 + relativeEdge * 0.55, 0.0, 1.0);
  gl_FragColor = vec4(rgb, contour);
}
`;

export const HERO_FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D uVideo;
uniform sampler2D uAtlas;
uniform sampler2D uTrail;
uniform sampler2D uScene;
uniform vec2 uGrid;
uniform vec2 uCellPx;
uniform vec2 uCropMin;
uniform vec2 uCropMax;
uniform float uFade;
uniform float uStyle;
uniform float uDark;
uniform float uTime;
uniform vec2 uSize;

const vec2 ATLAS_GRID = vec2(${ATLAS_COLS}.0, ${ATLAS_ROWS}.0);
const float ATLAS_PAD = ${(2 / ATLAS_TILE).toFixed(5)};
const float ORIGINAL_COUNT = ${ORIGINAL_GLYPH_RAMP.length}.0;
const float SPACE = ${glyphIndex(" ")};
const float DOT = ${glyphIndex(".")};
const float COMMA = ${glyphIndex(",")};
const float COLON = ${glyphIndex(":")};
const float SEMICOLON = ${glyphIndex(";")};
const float DASH = ${glyphIndex("-")};
const float PLUS = ${glyphIndex("+")};
const float STAR = ${glyphIndex("*")};
const float HASH = ${glyphIndex("#")};
const float AT = ${glyphIndex("@")};
const float VERTICAL = ${glyphIndex("|")};
const float SLASH = ${glyphIndex("/")};
const float BACKSLASH = ${glyphIndex("\\")};

float lumOf(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

// Bounded arithmetic remains stable on mediump mobile fragment implementations.
float cellNoise(vec2 cell) {
  vec2 p = mod(cell, vec2(103.0, 97.0));
  return fract((p.x * 0.7548777 + p.y * 0.5698403) * 1.317);
}

float glyphAt(float index, vec2 cellUV, float glow, float original) {
  float boxW = (uCellPx.y * 0.85) / uCellPx.x;
  vec2 boxMin = vec2((1.0 - boxW) * 0.5, 0.0);
  vec2 inBox = (cellUV - boxMin) / vec2(boxW, 1.0);
  float mask = step(0.0, inBox.x) * step(inBox.x, 1.0);
  vec2 atlasUV = clamp(inBox, 0.0, 1.0);
  atlasUV.y = 1.0 - atlasUV.y;
  atlasUV = ATLAS_PAD + atlasUV * (1.0 - 2.0 * ATLAS_PAD);
  vec2 tile = vec2(mod(index, ATLAS_GRID.x), floor(index / ATLAS_GRID.x));
  float coverage = texture2D(uAtlas, (tile + atlasUV) / ATLAS_GRID).r;
  float threshold = mix(0.9 - glow * 0.4, 0.9, original);
  return smoothstep(0.05, threshold, coverage) * mask;
}

float densityGlyph(float density) {
  if (density < 0.075) return SPACE;
  if (density < 0.18) return DOT;
  if (density < 0.28) return COMMA;
  if (density < 0.39) return COLON;
  if (density < 0.49) return SEMICOLON;
  if (density < 0.59) return DASH;
  if (density < 0.7) return PLUS;
  if (density < 0.82) return STAR;
  if (density < 0.94) return HASH;
  return AT;
}

float contourGlyph(vec2 cell) {
  float direction = mod(floor(cell.x / 4.0) + floor(cell.y / 3.0), 4.0);
  if (direction < 1.0) return SLASH;
  if (direction < 2.0) return DASH;
  if (direction < 3.0) return BACKSLASH;
  return VERTICAL;
}

vec3 thermal(float value) {
  vec3 cold = vec3(0.12, 0.075, 0.025);
  vec3 ember = vec3(0.72, 0.23, 0.035);
  vec3 amber = vec3(1.0, 0.66, 0.15);
  vec3 warm = vec3(1.0, 0.94, 0.7);
  vec3 low = mix(cold, ember, smoothstep(0.06, 0.5, value));
  vec3 high = mix(amber, warm, smoothstep(0.64, 1.0, value));
  return mix(low, high, smoothstep(0.4, 0.7, value));
}

void main() {
  vec2 cell = floor(vUV * uGrid);
  vec2 cellUV = fract(vUV * uGrid);
  vec2 center = (cell + 0.5) / uGrid;

  // A literal comparison mode keeps the established homepage image unchanged.
  if (uStyle < -0.5) {
    vec3 rgb = texture2D(uVideo, mix(uCropMin, uCropMax, center)).rgb;
    float lum = pow(clamp(lumOf(rgb), 0.0, 1.0), 1.6);
    float index = 2.0 + floor(lum * (ORIGINAL_COUNT - 1.0) + 0.5);
    float alpha = glyphAt(index, cellUV, 0.0, 1.0);
    vec3 base = rgb * 0.58;
    vec3 lit = clamp(base + rgb, 0.0, 1.0);
    float baseL = max(0.0001, lumOf(base));
    float litL = max(0.0001, lumOf(lit));
    lit = clamp(base * (litL / baseL), 0.0, 1.0);
    vec3 original = mix(base, lit, alpha);
    original = clamp(mix(vec3(lumOf(original)), original, 1.28), 0.0, 1.0);
    gl_FragColor = vec4(original * uFade, 1.0);
    return;
  }

  vec4 scene = texture2D(uScene, center);
  vec3 rgb = scene.rgb;
  float rawLuma = lumOf(rgb);
  float tone = pow(clamp(rawLuma, 0.0, 1.0), 0.8);
  float contour = scene.a;
  float polarity = mix(1.0 - tone, tone, uDark);
  float glow = clamp(texture2D(uTrail, center).r, 0.0, 1.0);
  float noise = cellNoise(cell);
  float binary = step(0.5, fract(noise + tone * 1.73));
  float density = max(smoothstep(0.24, 0.92, polarity) * 0.86, contour * 0.82);
  float index = densityGlyph(density);
  float opacity = 0.9;
  float tileAmount = 0.025;
  float tileMix = 0.0;
  float scan = 1.0;
  float dotMode = 0.0;
  vec3 paper = mix(vec3(0.967, 0.963, 0.95), vec3(0.047, 0.052, 0.05), uDark);
  vec3 ink = mix(vec3(0.065, 0.073, 0.07), vec3(0.85, 0.9, 0.86), uDark);
  vec3 tileColor = rgb;

  if (uStyle < 0.5) {
    // Reference: bright paper or deep ink, sparse cells, recognizable contours.
    density = max(smoothstep(0.3, 0.94, polarity) * 0.88, contour * 0.78);
    if (contour > 0.42 && density < 0.72) index = contourGlyph(cell);
    tileAmount = 0.035;
    vec3 hueInk = mix(rgb * 0.5, clamp(rgb * 1.65 + 0.12, 0.0, 1.0), uDark);
    ink = mix(ink, hueInk, 0.34);
  } else if (uStyle < 1.5) {
    // Binary Signal: dense bits in separated data columns, not a density ramp.
    density = max(smoothstep(0.12, 0.9, polarity) * 0.83, contour * 0.7);
    density *= mix(0.45, 1.0, step(0.8, mod(cell.x, 6.0)));
    index = binary;
    opacity = 0.86;
    tileAmount = 0.075;
    ink = mix(vec3(0.075, 0.13, 0.115), vec3(0.76, 0.91, 0.83), uDark);
  } else if (uStyle < 2.5) {
    // Ghost Circuit: contour wisps suspended over almost untouched paper.
    density = max(contour * 0.86, smoothstep(0.12, 0.86, polarity) * 0.38);
    index = contourGlyph(cell);
    if (noise > 0.77) index = DOT;
    opacity = 0.72;
    tileAmount = 0.018;
    ink = mix(vec3(0.2, 0.25, 0.24), vec3(0.69, 0.79, 0.75), uDark);
  } else if (uStyle < 3.5) {
    // Terminal: contiguous information, phosphor tone, subtle horizontal scan.
    paper = mix(vec3(0.94, 0.965, 0.93), vec3(0.02, 0.055, 0.035), uDark);
    ink = mix(vec3(0.09, 0.27, 0.11), vec3(0.45, 0.94, 0.54), uDark);
    density = max(smoothstep(0.05, 0.93, polarity), contour * 0.8);
    index = mix(binary, densityGlyph(density), step(0.47, contour));
    tileAmount = 0.12;
    tileColor = mix(vec3(0.12, 0.3, 0.11), vec3(0.11, 0.55, 0.2), uDark);
    scan = 0.9 + 0.1 * step(0.35, fract(vUV.y * uSize.y * 0.5));
  } else if (uStyle < 4.5) {
    // Wireframe: connected contour strokes with almost no filled tonal mass.
    paper = mix(vec3(0.942, 0.966, 0.968), vec3(0.025, 0.064, 0.083), uDark);
    ink = mix(vec3(0.055, 0.245, 0.31), vec3(0.43, 0.86, 0.94), uDark);
    density = smoothstep(0.035, 0.5, contour) * 0.94;
    index = contourGlyph(cell);
    if (mod(cell.x + cell.y, 9.0) < 1.0) index = PLUS;
    tileAmount = 0.015;
    opacity = 0.95;
  } else if (uStyle < 5.5) {
    // Blueprint: a technical construction grid beneath the contour drawing.
    paper = mix(vec3(0.93, 0.953, 0.966), vec3(0.025, 0.075, 0.12), uDark);
    ink = mix(vec3(0.07, 0.25, 0.36), vec3(0.62, 0.82, 0.94), uDark);
    density = max(smoothstep(0.025, 0.64, contour) * 0.95, smoothstep(0.3, 0.95, polarity) * 0.26);
    index = contourGlyph(cell);
    if (mod(cell.x, 12.0) < 1.0 && mod(cell.y, 8.0) < 1.0) {
      index = PLUS;
      density = max(density, 0.28);
    }
    vec2 technical = fract(vUV * uSize / 64.0);
    float grid = max(1.0 - smoothstep(0.0, 0.016, technical.x), 1.0 - smoothstep(0.0, 0.016, technical.y));
    paper = mix(paper, ink, grid * 0.12);
    tileAmount = 0.025;
  } else if (uStyle < 6.5) {
    // Spectral: interleaved binary bands, punctuated by violet/teal contours.
    vec3 teal = mix(vec3(0.08, 0.32, 0.31), vec3(0.4, 0.86, 0.78), uDark);
    vec3 violet = mix(vec3(0.28, 0.18, 0.38), vec3(0.7, 0.56, 0.94), uDark);
    ink = mix(teal, violet, smoothstep(0.25, 0.8, tone));
    density = max(smoothstep(0.08, 0.83, polarity) * 0.82, contour * 0.92);
    density *= mix(0.48, 1.0, step(0.8, mod(cell.y, 3.0)));
    index = binary;
    if (contour > 0.58) index = contourGlyph(cell);
    tileAmount = 0.06;
    tileColor = mix(teal, violet, tone);
  } else if (uStyle < 7.5) {
    // Heat Signature: stepped thermal masses with bright diagnostic characters.
    paper = mix(vec3(0.97, 0.952, 0.915), vec3(0.075, 0.042, 0.022), uDark);
    float heat = floor(clamp(tone + contour * 0.16, 0.0, 1.0) * 5.0) / 5.0;
    tileColor = thermal(heat);
    ink = mix(tileColor * 0.5, mix(tileColor, vec3(1.0, 0.94, 0.75), 0.32), uDark);
    density = max(smoothstep(0.12, 0.86, polarity) * 0.86, contour * 0.8);
    index = densityGlyph(density);
    if (contour > 0.5) index = binary;
    tileAmount = 0.42;
    tileMix = 0.55;
  } else if (uStyle < 8.5) {
    // Halftone: variable-radius monochrome dots, resolving into bits under hand.
    density = max(smoothstep(0.04, 0.95, polarity), contour * 0.8);
    paper = mix(vec3(0.97, 0.968, 0.956), vec3(0.035), uDark);
    ink = mix(vec3(0.055), vec3(0.91), uDark);
    index = binary;
    dotMode = 1.0;
    tileAmount = 0.0;
  } else {
    // Raw Transmission: full-range ASCII and original footage hue, finely set.
    density = max(smoothstep(0.03, 0.98, polarity), contour * 0.65);
    index = 2.0 + floor((1.0 - clamp(density, 0.0, 1.0)) * (ORIGINAL_COUNT - 1.0) + 0.5);
    ink = mix(rgb * 0.55, clamp(rgb * 1.8 + 0.08, 0.0, 1.0), uDark);
    tileColor = rgb;
    tileAmount = 0.32;
    tileMix = 0.36;
    opacity = 1.0;
  }

  // Every look receives the same bounded cursor field. It adds local ink and
  // thickens existing glyph strokes; no cursor decoration is drawn over video.
  density = clamp(density + glow * 0.55, 0.0, 1.0);
  if (uStyle < 0.5 || (uStyle >= 2.5 && uStyle < 3.5) || (uStyle >= 6.5 && uStyle < 7.5)) {
    if (glow > 0.12) index = densityGlyph(density);
  }
  if (uStyle < 0.5 && contour <= 0.42) index = densityGlyph(density);

  float coverage = glyphAt(index, cellUV, glow, 0.0);
  float presence = smoothstep(0.06, 0.24, density);
  if (uStyle >= 0.5 && uStyle < 1.5) {
    presence *= smoothstep(noise * 0.55, noise * 0.55 + 0.25, density);
  }
  if (dotMode > 0.5) {
    float radius = 0.045 + sqrt(density) * 0.41;
    float dot = 1.0 - smoothstep(radius - 0.055, radius + 0.025, length((cellUV - 0.5) * vec2(1.0, 1.0)));
    coverage = mix(dot, coverage, smoothstep(0.1, 0.6, glow));
    presence = 1.0;
  }

  float peak = max(max(rgb.r, rgb.g), rgb.b);
  vec3 hue = peak > 0.005 ? rgb / peak : vec3(0.75, 0.82, 0.78);
  float hueLuma = lumOf(hue);
  vec3 vivid = clamp(mix(vec3(hueLuma), hue, 1.6), 0.0, 1.0);
  vec3 cursorInk = mix(vivid * 0.43, clamp(rgb * (1.0 + glow * 1.5) + vivid * 0.28, 0.0, 1.0), uDark);
  ink = mix(ink, cursorInk, glow);

  vec3 printedTile = paper * mix(vec3(1.0), clamp(tileColor, 0.0, 1.0), tileAmount);
  vec3 luminousTile = mix(paper, clamp(tileColor, 0.0, 1.0), tileAmount);
  vec3 base = mix(printedTile, luminousTile, uDark);
  base = mix(paper, base, mix(density, 1.0, tileMix));
  vec3 cursorTile = mix(paper * mix(vec3(1.0), vivid, 0.75), vivid, uDark);
  base = mix(base, cursorTile, glow * 0.75);
  vec3 color = mix(base, ink, coverage * presence * opacity);
  color = mix(paper, color, scan);

  // A barely perceptible carrier belongs only to the diagnostic treatments.
  // It follows the footage cadence instead of flashing arbitrary glyphs.
  if ((uStyle >= 2.5 && uStyle < 3.5) || (uStyle >= 5.5 && uStyle < 6.5)) {
    float carrier = 0.985 + 0.015 * sin(vUV.y * uSize.y * 0.08 - uTime * 0.65);
    color = mix(paper, color, carrier);
  }
  gl_FragColor = vec4(mix(paper, clamp(color, 0.0, 1.0), uFade), 1.0);
}
`;
