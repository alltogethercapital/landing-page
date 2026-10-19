// The two leading atlas tiles make binary treatments available without changing
// the original density ramp, whose indices remain offset by exactly two.
const ORIGINAL_GLYPH_RAMP =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYZXcvunxrj/ft\\|()1{}[]?_-+~<>i!lI;:\",^'. ";

export const HERO_GLYPHS = `01${ORIGINAL_GLYPH_RAMP}`;
export const ATLAS_COLS = 9;
export const ATLAS_ROWS = 8;
export const ATLAS_TILE = 64;

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

float luma(vec3 rgb) {
  return dot(rgb, vec3(0.2126, 0.7152, 0.0722));
}

vec3 videoAt(vec2 point) {
  return texture2D(uVideo, mix(uCropMin, uCropMax, clamp(point, 0.0, 1.0))).rgb;
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

// Raw Transmission keeps its cinematic contrast in both UI themes.
export const HERO_FRAGMENT_SHADER = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D uAtlas;
uniform sampler2D uScene;
uniform vec2 uGrid;
uniform vec2 uCellPx;
uniform float uFade;

const vec2 ATLAS_GRID = vec2(${ATLAS_COLS}.0, ${ATLAS_ROWS}.0);
const float ATLAS_PAD = ${(2 / ATLAS_TILE).toFixed(5)};
const float ORIGINAL_COUNT = ${ORIGINAL_GLYPH_RAMP.length}.0;

float lumOf(vec3 rgb) { return dot(rgb, vec3(0.299, 0.587, 0.114)); }

float glyphAt(float index, vec2 cellUV, float weight) {
  float boxWidth = (uCellPx.y * 0.85) / uCellPx.x;
  vec2 boxMin = vec2((1.0 - boxWidth) * 0.5, 0.0);
  vec2 inBox = (cellUV - boxMin) / vec2(boxWidth, 1.0);
  float mask = step(0.0, inBox.x) * step(inBox.x, 1.0);
  vec2 atlasUV = clamp(inBox, 0.0, 1.0);
  atlasUV.y = 1.0 - atlasUV.y;
  atlasUV = ATLAS_PAD + atlasUV * (1.0 - 2.0 * ATLAS_PAD);
  vec2 tile = vec2(mod(index, ATLAS_GRID.x), floor(index / ATLAS_GRID.x));
  float coverage = texture2D(uAtlas, (tile + atlasUV) / ATLAS_GRID).r;
  return smoothstep(0.05, 0.9 - weight * 0.4, coverage) * mask;
}

void main() {
  vec2 cell = floor(vUV * uGrid);
  vec2 cellUV = fract(vUV * uGrid);
  vec2 center = (cell + 0.5) / uGrid;
  vec4 scene = texture2D(uScene, center);
  vec3 rgb = scene.rgb;
  float tone = pow(clamp(lumOf(rgb), 0.0, 1.0), 0.8);
  float density = max(smoothstep(0.03, 0.98, tone), scene.a * 0.65);
  float index = 2.0 + floor((1.0 - clamp(density, 0.0, 1.0)) * (ORIGINAL_COUNT - 1.0) + 0.5);
  float coverage = glyphAt(index, cellUV, 0.0);
  float presence = smoothstep(0.06, 0.24, density);
  vec3 paper = vec3(0.047, 0.052, 0.05);
  vec3 ink = clamp(rgb * 1.8 + 0.08, 0.0, 1.0);
  vec3 base = mix(paper, rgb, 0.32);
  base = mix(paper, base, mix(density, 1.0, 0.36));
  vec3 color = mix(base, ink, coverage * presence);

  gl_FragColor = vec4(mix(paper, clamp(color, 0.0, 1.0), uFade), 1.0);
}
`;
