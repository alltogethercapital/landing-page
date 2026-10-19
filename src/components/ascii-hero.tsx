"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { ASCII_HERO_CLIPS } from "@/lib/ascii-hero-assets";

import {
  ATLAS_COLS, ATLAS_ROWS, ATLAS_TILE, HERO_GLYPHS,
  HERO_VERTEX_SHADER, HERO_FRAGMENT_SHADER, HERO_SCENE_SHADER,
} from "@/lib/hero-shaders";

const CLIP_FADE_LEAD_S = 0.5;
const PIXEL_BUDGET = 8_000_000;
const CELL_SIZE_CSS = 3.8;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

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
  for (let i = 0; i < HERO_GLYPHS.length; i++) {
    const x = (i % ATLAS_COLS) * ATLAS_TILE + ATLAS_TILE / 2;
    const y = Math.floor(i / ATLAS_COLS) * ATLAS_TILE + ATLAS_TILE / 2;
    ctx.fillText(HERO_GLYPHS[i], x, y);
  }
  return canvas;
}

function compileProgram(gl: WebGLRenderingContext, fragment: string): WebGLProgram | null {
  const make = (type: number, src: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("ascii-hero shader:", gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };
  const vs = make(gl.VERTEX_SHADER, HERO_VERTEX_SHADER);
  const fs = make(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    return null;
  }
  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.bindAttribLocation(program, 0, "aPos");
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

export function AsciiHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fallbackRef = useRef<HTMLVideoElement>(null);
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

    const program = compileProgram(gl, HERO_FRAGMENT_SHADER);
    const sceneProgram = compileProgram(gl, HERO_SCENE_SHADER);
    if (!program || !sceneProgram) {
      if (program) gl.deleteProgram(program);
      if (sceneProgram) gl.deleteProgram(sceneProgram);
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
    const uFade = u("uFade");
    const sceneUniform = (name: string) => gl.getUniformLocation(sceneProgram, name);
    const sceneU = {
      video: sceneUniform("uVideo"),
      grid: sceneUniform("uGrid"),
      cropMin: sceneUniform("uCropMin"),
      cropMax: sceneUniform("uCropMax"),
    };

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

    gl.uniform1i(u("uAtlas"), 1);
    const sceneTex = makeTexture(3);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    const sceneBuffer = gl.createFramebuffer();
    gl.uniform1i(u("uScene"), 3);
    gl.useProgram(sceneProgram);
    gl.uniform1i(sceneU.video, 0);
    gl.useProgram(program);

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
      clip: 0,
      errorStreak: 0,
      unlockArmed: false,
      columns: 1,
      rows: 1,
    };
    section.dataset.heroStyle = "raw-transmission";

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

      const compactScale = window.innerWidth <= 480 ? 0.85 : 1;
      const cellW = Math.max(3, CELL_SIZE_CSS * compactScale * dpr * scale);
      const cellH = cellW / 0.6;
      const cols = Math.min(360, Math.max(24, Math.floor(w / cellW)));
      const rows = Math.max(8, Math.floor(h / cellH));
      gl.useProgram(program);
      gl.uniform2f(uGrid, cols, rows);
      gl.uniform2f(uCellPx, w / cols, h / rows);
      if (state.columns !== cols || state.rows !== rows) {
        state.columns = cols;
        state.rows = rows;
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, sceneTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.useProgram(sceneProgram);
      gl.uniform2f(sceneU.grid, cols, rows);
      gl.useProgram(program);
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
      gl.useProgram(sceneProgram);
      gl.uniform2f(sceneU.cropMin, minX, minY);
      gl.uniform2f(sceneU.cropMax, maxX, maxY);
      gl.useProgram(program);
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
      gl.useProgram(sceneProgram);
      gl.bindFramebuffer(gl.FRAMEBUFFER, sceneBuffer);
      gl.viewport(0, 0, state.columns, state.rows);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      gl.uniform1f(uFade, state.fade);
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
      if (!shouldRun() || reducedMotion) return;
      video.play().then(disarmUnlock).catch(() => undefined);
    };
    const armUnlock = () => {
      if (state.destroyed || state.contextLost || reducedMotion || state.unlockArmed) return;
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
        if (state.destroyed || state.contextLost || reducedMotion) return;
        // Show the poster when autoplay is blocked and retry only while visible
        // on a real user activation.
        uploadPoster(ASCII_HERO_CLIPS[state.clip].poster);
        armUnlock();
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
      // Resume only while visible and motion is allowed.
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

    // --- Visibility ---------------------------------------------------------
    const syncPlayback = () => {
      if (state.destroyed || state.contextLost || reducedMotion) return;
      if (state.inView && !document.hidden) {
        playCurrent();
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
      gl.deleteTexture(sceneTex);
      gl.deleteFramebuffer(sceneBuffer);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteProgram(sceneProgram);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const fallback = fallbackRef.current;
    const section = sectionRef.current;
    if (!fallback || !section) return;
    let visible = true;
    const syncPlayback = () => {
      if (reducedMotion || document.hidden || !visible) {
        fallback.pause();
      } else {
        fallback.play().catch(() => undefined);
      }
    };
    const onPlaying = () => {
      if (reducedMotion || document.hidden || !visible) fallback.pause();
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      syncPlayback();
    }, { threshold: 0.01 });
    observer.observe(section);
    document.addEventListener("visibilitychange", syncPlayback);
    fallback.addEventListener("playing", onPlaying);
    syncPlayback();
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncPlayback);
      fallback.removeEventListener("playing", onPlaying);
      fallback.pause();
    };
  }, [webglOk, reducedMotion]);

  return (
    <section ref={sectionRef} className="ascii-hero" aria-label="Machine Spirit Capital film reel">
      <canvas ref={canvasRef} className="ascii-hero-canvas" aria-hidden="true" />
      {!webglOk && (
        <video
          ref={fallbackRef}
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
