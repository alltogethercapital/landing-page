"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ASCII_HERO_CLIPS } from "@/lib/ascii-hero-assets";

// Video rendered as colored ASCII glyphs, in the spirit of generalintuition.com.
// One WebGL draw per frame: the current video frame (TEXTURE0) is sampled once
// per cell, luminance picks a glyph from a prerendered atlas (TEXTURE1), and the
// glyph is tinted with the underlying video color. Pointer movement injects glow
// points that lift cell luminance into a bright trail (matching the reference
// effect, the boost shifts cells toward the sparse end of the ramp).

// Dense → sparse. 69 glyphs; luminance 0 picks "$", luminance 1 picks the space —
// the same convention the reference effect ships with.
const GLYPH_RAMP =
  "$@B%8&WM#*oahkbdpqwmZO0QLCJUYZXcvunxrj/ft\\|()1{}[]?_-+~<>i!lI;:\",^'. ";
const ATLAS_COLS = 9;
const ATLAS_ROWS = 8;
const ATLAS_TILE = 64; // px per glyph tile in the atlas canvas
const MAX_GLOW = 8;
const GLOW_LIFE_S = 1.0;
const CLIP_FADE_LEAD_S = 0.5; // start fading out this long before a clip ends
const PIXEL_BUDGET = 8_000_000; // cap on canvas device pixels (5K displays)

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const VERT_SRC = `
attribute vec2 aPos;
varying vec2 vUV;
void main() {
  vUV = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;
varying vec2 vUV;
uniform sampler2D uVideo;
uniform sampler2D uAtlas;
uniform vec2 uGrid;       // columns, rows
uniform vec2 uCellPx;     // device px per cell
uniform vec2 uCanvasPx;   // device px canvas size
uniform vec2 uCropMin;    // cover-fit crop window into the video texture
uniform vec2 uCropMax;
uniform float uFade;      // clip transition fade, 0..1
uniform int uGlowCount;
uniform vec2 uGlowPts[${MAX_GLOW}];
uniform float uGlowFade[${MAX_GLOW}]; // per-point strength 0..1, computed on CPU
uniform float uGlowRadiusPx;

const float GAMMA = 1.6;
const float TILE_OPACITY = 0.58;
const float CHAR_ASPECT = 0.85;
const float VIVID = 1.28;
const vec3 ACCENT = vec3(0.118, 0.216, 0.851); // #1E37D9
const float GLYPH_COUNT = ${GLYPH_RAMP.length}.0;
const vec2 ATLAS_GRID = vec2(${ATLAS_COLS}.0, ${ATLAS_ROWS}.0);
const float ATLAS_PAD = ${(2 / ATLAS_TILE).toFixed(5)};

float lumOf(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

float glowAt(vec2 uv) {
  float g = 0.0;
  for (int i = 0; i < ${MAX_GLOW}; i++) {
    if (i < uGlowCount) {
      // Chebyshev distance: the glow stamp is a square, not a circle.
      vec2 dp = abs((uv - uGlowPts[i]) * uCanvasPx);
      float d = max(dp.x, dp.y);
      float s = clamp(1.0 - d / uGlowRadiusPx, 0.0, 1.0);
      s = s * s * (3.0 - 2.0 * s); // soft shoulder, no hard plateau edge
      g = min(1.0, g + s * uGlowFade[i]);
    }
  }
  return g;
}

void main() {
  vec2 cell = floor(vUV * uGrid);
  vec2 cellUV = fract(vUV * uGrid);
  vec2 center = (cell + 0.5) / uGrid;

  vec3 rgb = texture2D(uVideo, mix(uCropMin, uCropMax, center)).rgb;
  float lum = pow(clamp(lumOf(rgb), 0.0, 1.0), GAMMA);

  float g = 0.0;
  if (uGlowCount > 0) {
    g = glowAt(center);
    lum = clamp(lum + pow(g, 1.5) * 0.5, 0.0, 1.0);
  }

  float idx = floor(lum * (GLYPH_COUNT - 1.0) + 0.5);

  // Atlas tiles are square; the display cell is narrow (w/h ≈ 0.6). Draw the
  // glyph in a centered box that preserves the character's true aspect.
  float boxW = (uCellPx.y * CHAR_ASPECT) / uCellPx.x;
  vec2 boxMin = vec2((1.0 - boxW) * 0.5, 0.0);
  vec2 inBox = (cellUV - boxMin) / vec2(boxW, 1.0);
  float mask = step(0.0, inBox.x) * step(inBox.x, 1.0);

  vec2 gUV = clamp(inBox, 0.0, 1.0);
  gUV.y = 1.0 - gUV.y; // atlas canvas rows run top-down
  gUV = ATLAS_PAD + gUV * (1.0 - 2.0 * ATLAS_PAD);
  vec2 tile = vec2(mod(idx, ATLAS_GRID.x), floor(idx / ATLAS_GRID.x));
  float alpha = texture2D(uAtlas, (tile + gUV) / ATLAS_GRID).r;
  alpha = smoothstep(0.05, 0.9, alpha) * mask;

  // Dimmed video tile under a brighter hue-locked glyph.
  vec3 base = rgb * TILE_OPACITY;
  vec3 lit = clamp(base + rgb, 0.0, 1.0);
  float baseL = max(0.0001, lumOf(base));
  float litL = max(0.0001, lumOf(lit));
  lit = clamp(base * (litL / baseL), 0.0, 1.0);
  vec3 col = mix(base, lit, alpha);

  if (g > 0.0) {
    vec3 boosted = clamp(col * 1.45, 0.0, 1.0);
    vec3 screened = 1.0 - (1.0 - col) * (1.0 - boosted);
    // Lift the glow toward the identity blue so the trail reads as tinted,
    // not just brighter.
    vec3 tinted = 1.0 - (1.0 - screened) * (1.0 - ACCENT * 0.35);
    col = mix(col, tinted, g * 0.9);
  }

  // Vividness: pull the final color away from its own gray.
  col = clamp(mix(vec3(lumOf(col)), col, VIVID), 0.0, 1.0);

  gl_FragColor = vec4(col * uFade, 1.0);
}
`;

function buildGlyphAtlas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = ATLAS_COLS * ATLAS_TILE;
  canvas.height = ATLAS_ROWS * ATLAS_TILE;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = `300 ${Math.floor(ATLAS_TILE * 0.78)}px ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < GLYPH_RAMP.length; i++) {
    const x = (i % ATLAS_COLS) * ATLAS_TILE + ATLAS_TILE / 2;
    const y = Math.floor(i / ATLAS_COLS) * ATLAS_TILE + ATLAS_TILE / 2;
    ctx.fillText(GLYPH_RAMP[i], x, y);
  }
  return canvas;
}

function compileProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const make = (type: number, src: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("ascii-hero shader:", gl.getShaderInfoLog(shader));
      return null;
    }
    return shader;
  };
  const vs = make(gl.VERTEX_SHADER, VERT_SRC);
  const fs = make(gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) return null;
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("ascii-hero link:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

function cellSizeCss(viewportW: number): number {
  if (viewportW <= 480) return 4.5;
  if (viewportW <= 768) return 5;
  if (viewportW <= 1024) return 5.5;
  return 6;
}

export function AsciiHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [webglOk, setWebglOk] = useState(true);

  // OS reduced-motion preference, tracked live.
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!section || !canvas || !video) return;

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) {
      setWebglOk(false);
      return;
    }

    const program = compileProgram(gl);
    if (!program) {
      setWebglOk(false);
      return;
    }
    gl.useProgram(program);

    // Fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uGrid = u("uGrid");
    const uCellPx = u("uCellPx");
    const uCanvasPx = u("uCanvasPx");
    const uCropMin = u("uCropMin");
    const uCropMax = u("uCropMax");
    const uFade = u("uFade");
    const uGlowCount = u("uGlowCount");
    const uGlowPts = u("uGlowPts");
    const uGlowFade = u("uGlowFade");
    const uGlowRadiusPx = u("uGlowRadiusPx");

    const makeTexture = (unit: number) => {
      const tex = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return tex;
    };

    // TEXTURE0: video frames (flipped — DOM sources are top-down).
    const videoTex = makeTexture(0);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));

    // TEXTURE1: glyph atlas (sampled with explicit top-down math in the shader).
    const atlasTex = makeTexture(1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildGlyphAtlas());

    gl.uniform1i(u("uVideo"), 0);
    gl.uniform1i(u("uAtlas"), 1);

    const state = {
      raf: 0,
      rafActive: false,
      rvfcId: 0,
      newFrame: false,
      usesRvfc: "requestVideoFrameCallback" in HTMLVideoElement.prototype,
      videoW: 16,
      videoH: 9,
      fade: 0,
      fadeTarget: 1,
      inView: true,
      destroyed: false,
      contextLost: false,
      glowPts: new Float32Array(MAX_GLOW * 2),
      glowStart: new Float32Array(MAX_GLOW),
      glowFade: new Float32Array(MAX_GLOW),
      glowCount: 0,
      glowCursor: 0,
      lastStamp: 0,
      cellDeviceW: 16,
      clip: 0,
      errorStreak: 0,
      unlockArmed: false,
    };

    const epoch = performance.now();
    const nowS = () => (performance.now() - epoch) / 1000;

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      let w = Math.max(1, Math.round(section.clientWidth * dpr));
      let h = Math.max(1, Math.round(section.clientHeight * dpr));
      // Keep huge displays inside a fragment budget; CSS upscales the canvas
      // and the chunky cells hide the difference.
      const scale = Math.min(1, Math.sqrt(PIXEL_BUDGET / (w * h)));
      w = Math.max(1, Math.round(w * scale));
      h = Math.max(1, Math.round(h * scale));

      const reallocated = canvas.width !== w || canvas.height !== h;
      if (reallocated) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);

      const cellW = Math.max(3, cellSizeCss(window.innerWidth) * dpr * scale);
      const cellH = cellW / 0.6;
      const cols = Math.min(360, Math.max(24, Math.floor(w / cellW)));
      const rows = Math.max(8, Math.floor(h / cellH));
      state.cellDeviceW = w / cols;

      gl.uniform2f(uGrid, cols, rows);
      gl.uniform2f(uCellPx, w / cols, h / rows);
      gl.uniform2f(uCanvasPx, w, h);
      applyCrop(w, h);
      // Resizing the backing store clears it — repaint in the same frame.
      if (reallocated) drawFrame();
    };

    const applyCrop = (w: number, h: number) => {
      // CSS-style "cover": crop the video texture to the canvas aspect.
      const videoAR = state.videoW / state.videoH;
      const canvasAR = w / h;
      let minX = 0;
      let minY = 0;
      let maxX = 1;
      let maxY = 1;
      if (canvasAR > videoAR) {
        const frac = videoAR / canvasAR;
        minY = (1 - frac) / 2;
        maxY = 1 - minY;
      } else {
        const frac = canvasAR / videoAR;
        minX = (1 - frac) / 2;
        maxX = 1 - minX;
      }
      gl.uniform2f(uCropMin, minX, minY);
      gl.uniform2f(uCropMax, maxX, maxY);
    };

    const uploadVideoFrame = () => {
      gl.activeTexture(gl.TEXTURE0);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
      } catch {
        // Frame not ready yet — keep the previous texture.
      }
    };

    const uploadPoster = (src: string) => {
      const img = new Image();
      img.onload = () => {
        if (state.destroyed || state.contextLost) return;
        state.videoW = img.naturalWidth;
        state.videoH = img.naturalHeight;
        applySize();
        gl.activeTexture(gl.TEXTURE0);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        state.fade = 1;
        drawFrame();
      };
      img.src = src;
    };

    const drawFrame = () => {
      if (state.contextLost) return;
      // Glow strengths are computed CPU-side so the shader only ever sees
      // values in [0,1] — absolute timestamps break fp16 mediump GPUs.
      const now = nowS();
      let alive = 0;
      for (let i = 0; i < state.glowCount; i++) {
        const fade = 1 - (now - state.glowStart[i]) / GLOW_LIFE_S;
        state.glowFade[i] = fade > 0 ? (fade < 1 ? fade : 1) : 0;
        if (state.glowFade[i] > 0) alive++;
      }
      if (state.glowCount > 0 && alive === 0) {
        state.glowCount = 0;
        state.glowCursor = 0;
      }
      gl.uniform1f(uFade, state.fade);
      gl.uniform1i(uGlowCount, state.glowCount);
      gl.uniform2fv(uGlowPts, state.glowPts);
      gl.uniform1fv(uGlowFade, state.glowFade);
      gl.uniform1f(uGlowRadiusPx, state.cellDeviceW * 10);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const shouldRun = () =>
      !state.destroyed && !state.contextLost && state.inView && !document.hidden;

    const tick = () => {
      if (!shouldRun()) {
        state.rafActive = false;
        return;
      }
      state.raf = requestAnimationFrame(tick);

      if (state.newFrame || !state.usesRvfc) {
        state.newFrame = false;
        if (video.readyState >= 2) uploadVideoFrame();
      }

      state.fade += (state.fadeTarget - state.fade) * 0.12;
      if (Math.abs(state.fadeTarget - state.fade) < 0.002) state.fade = state.fadeTarget;

      drawFrame();
    };

    const ensureLoop = () => {
      if (reducedMotion) return;
      if (!state.rafActive && shouldRun()) {
        state.rafActive = true;
        state.raf = requestAnimationFrame(tick);
      }
    };

    const chainRvfc = () => {
      if (!state.usesRvfc || state.destroyed) return;
      state.rvfcId = video.requestVideoFrameCallback(() => {
        state.newFrame = true;
        chainRvfc();
      });
    };

    // --- Autoplay unlock (activation-granting events only) ------------------
    const UNLOCK_EVENTS = ["pointerup", "touchend", "keydown"] as const;
    const unlock = () => {
      if (state.destroyed || state.contextLost) return;
      video.play().then(disarmUnlock).catch(() => undefined);
    };
    const armUnlock = () => {
      if (state.unlockArmed) return;
      state.unlockArmed = true;
      UNLOCK_EVENTS.forEach((t) => window.addEventListener(t, unlock));
    };
    const disarmUnlock = () => {
      if (!state.unlockArmed) return;
      state.unlockArmed = false;
      UNLOCK_EVENTS.forEach((t) => window.removeEventListener(t, unlock));
    };

    // --- Clip cycling -------------------------------------------------------
    const playCurrent = () => {
      // Off-screen or hidden: the IO/visibility handlers resume playback when
      // the hero is actually watchable again.
      if (document.hidden || !state.inView) return;
      video.muted = true;
      video.play().catch(() => {
        video.muted = true;
        video.play().catch(() => {
          // Autoplay fully blocked (e.g. iOS Low Power Mode): show the poster
          // through the shader and retry on a real user activation.
          uploadPoster(ASCII_HERO_CLIPS[state.clip].poster);
          armUnlock();
        });
      });
    };

    const advanceClip = () => {
      if (state.destroyed || state.contextLost) return;
      state.clip = (state.clip + 1) % ASCII_HERO_CLIPS.length;
      video.src = ASCII_HERO_CLIPS[state.clip].src;
      video.load();
      playCurrent();
    };

    const onLoadedMetadata = () => {
      if (video.videoWidth > 0) {
        state.videoW = video.videoWidth;
        state.videoH = video.videoHeight;
        applySize();
      }
      // A fresh clip always fades back in, even if the resume play() races.
      state.fadeTarget = 1;
    };
    const onLoadedData = () => {
      // Paint the first frame even when the render loop is parked (page loaded
      // in a background tab) so the hero is never black on first sight.
      if (!state.rafActive && !state.contextLost) {
        state.fade = 1;
        uploadVideoFrame();
        drawFrame();
      }
    };
    const onPlaying = () => {
      state.fadeTarget = 1;
      state.errorStreak = 0;
      disarmUnlock();
      ensureLoop();
    };
    const onTimeUpdate = () => {
      if (
        video.duration > 0 &&
        video.duration - video.currentTime < CLIP_FADE_LEAD_S
      ) {
        state.fadeTarget = 0;
      }
    };
    const onEnded = () => {
      advanceClip();
    };
    const onError = () => {
      state.errorStreak++;
      if (state.errorStreak >= ASCII_HERO_CLIPS.length) {
        // Every clip failed (blocked requests, broken deploy) — settle on the
        // poster instead of looping network requests forever.
        uploadPoster(ASCII_HERO_CLIPS[state.clip].poster);
        return;
      }
      advanceClip();
    };
    const onPause = () => {
      // Keep playing unless we're intentionally stopped.
      if (shouldRun() && !video.ended && !reducedMotion) {
        video.play().catch(() => undefined);
      }
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    video.addEventListener("error", onError);
    video.addEventListener("pause", onPause);

    // --- Pointer glow -------------------------------------------------------
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || reducedMotion) return;
      const now = performance.now();
      if (now - state.lastStamp < 25) return;
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;
      state.lastStamp = now;
      const slot = state.glowCursor % MAX_GLOW;
      state.glowPts[slot * 2] = x;
      state.glowPts[slot * 2 + 1] = 1 - y; // shader UV origin is bottom-left
      state.glowStart[slot] = nowS();
      state.glowCursor++;
      state.glowCount = Math.min(state.glowCount + 1, MAX_GLOW);
    };
    section.addEventListener("pointermove", onPointerMove, { passive: true });

    // --- Visibility ---------------------------------------------------------
    const syncPlayback = () => {
      if (state.destroyed || state.contextLost || reducedMotion) return;
      if (state.inView && !document.hidden) {
        video.play().catch(() => undefined);
        ensureLoop();
      } else {
        video.pause();
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        state.inView = entries[0]?.isIntersecting ?? true;
        syncPlayback();
      },
      { rootMargin: "120px 0px 120px 0px", threshold: 0.01 },
    );
    io.observe(section);
    document.addEventListener("visibilitychange", syncPlayback);

    const ro = new ResizeObserver(() => applySize());
    ro.observe(section);

    const onContextLost = (event: Event) => {
      event.preventDefault();
      state.contextLost = true;
      video.pause();
      setWebglOk(false); // drop to the plain <video> fallback
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    // --- Boot ---------------------------------------------------------------
    applySize();

    if (reducedMotion) {
      // Static treatment: one poster frame through the shader, no video
      // download, no animation loop. Resize repaints via applySize.
      uploadPoster(ASCII_HERO_CLIPS[state.clip].poster);
    } else {
      video.src = ASCII_HERO_CLIPS[state.clip].src;
      video.load();
      playCurrent();
      chainRvfc();
      ensureLoop();
    }

    return () => {
      state.destroyed = true;
      if (state.rafActive) cancelAnimationFrame(state.raf);
      if (state.rvfcId && state.usesRvfc) {
        video.cancelVideoFrameCallback?.(state.rvfcId);
      }
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      section.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("error", onError);
      video.removeEventListener("pause", onPause);
      disarmUnlock();
      video.pause();
      video.removeAttribute("src");
      video.load(); // release the media decoder (required on iOS Safari)
      // Free GPU objects but keep the context alive: React StrictMode/HMR
      // re-runs this effect on the same canvas, and a killed context would
      // poison the next setup. The context itself is reclaimed with the canvas.
      gl.deleteTexture(videoTex);
      gl.deleteTexture(atlasTex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
    };
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="ascii-hero" aria-label="All Together film reel">
      <canvas ref={canvasRef} className="ascii-hero-canvas" aria-hidden="true" />
      {!webglOk && (
        <video
          className="ascii-hero-fallback"
          src={ASCII_HERO_CLIPS[0].src}
          poster={ASCII_HERO_CLIPS[0].poster}
          muted
          playsInline
          autoPlay={!reducedMotion}
          loop={!reducedMotion}
          aria-hidden="true"
          tabIndex={-1}
        />
      )}
      <video
        ref={videoRef}
        className="ascii-hero-source"
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
    </section>
  );
}
