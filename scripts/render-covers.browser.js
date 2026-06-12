// Notes cover renderer — runs IN THE BROWSER on the dev site (paste into the
// console, or execute via the preview tooling), with `next dev` running so
// /api/dev-cover can save the results.
//
// Each cover is the company's own product photo rendered through the brand's
// ASCII ramp: ink-black field, white characters by luminance, the brightest
// cells glowing accent green, signed with the "A" mark. Companies without
// product photography use their wordmark, inverted (dark marks → bright type).
//
// Usage in the browser:
//   await window.__renderCovers()            // all
//   await window.__renderCovers(["shield-ai"]) // subset

(() => {
  const RAMP =
    "$@B%8&WM#*oahkbdpqwmZO0QLCJUYZXcvunxrj/ft\\|()1{}[]?_-+~<>i!lI;:\",^'. ";
  const GREEN = "#059f70";
  const INK = "#0a0a0b";
  const W = 960;
  const H = 540;

  // slug → source image. `invert: true` for dark-wordmark-on-light sources.
  const SOURCES = {
    "shield-ai": { src: "/hero-drones.jpg" },
    "1x": { src: "/hero-robots.jpg" },
    openai: { src: "/work/openai.jpg" },
    anduril: { src: "/work/anduril.jpg" },
    "aurelius-systems": { src: "/work/aurelius.jpg" },
    "salient-motion": { src: "/work/salient-jet.jpg" },
    replit: { src: "/work/replit.jpg" },
    "applied-intuition": { src: "/work/applied.jpg" },
    "figure-ai": { src: "/work/figure-ai.jpg" },
    apptronik: { src: "/work/apptronik.jpg" },
    volantis: { src: "/work/volantis.jpg" },
    starcloud: { src: "/work/starcloud.jpg" },
    exowatt: { src: "/work/exowatt.jpg" },
    "aalo-atomics": { src: "/work/aalo.jpg" },
    "quaise-energy": { src: "/work/quaise.jpg" },
    unspun: { src: "/work/unspun.jpg" },
    lance: { src: "/work/lance.jpg" },
    samply: { src: "/work/samply.jpg" },
    hark: { src: "/work/hark.jpg" },
    campus: { src: "/logos/cards/campus.png", invert: true },
    "bud-break-innovations": { src: "/work/budbreak.jpg" },
    "maven-robotics": { src: "/work/cards/maven.jpg" },
    "eccentric-machines": { src: "/work/eccentric.jpg" },
    "array-labs": { src: "/work/cards/array-labs.jpg" },
    "commons-clinic": { src: "/logos/cards/commons-clinic.png", invert: true },
    corgi: { src: "/logos/cards/corgi.png", invert: true },
    aformic: { src: "/logos/cards/aformic.png", invert: true },
    // Flagship essays
    "the-future-is-built-together": { src: "/hero.jpg" },
    "every-company-is-a-character": { src: "/work/figure.jpg" },
    "the-hard-frontier": { src: "/work/anduril.jpg", seed: 7 },
  };

  const loadImage = (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`load failed: ${src}`));
      img.src = src;
    });

  function drawCover(img, { invert = false } = {}) {
    // Wordmark sources need a finer grid for letterforms to stay legible.
    const COLS = invert ? 150 : 96;
    const CELL_W = W / COLS;
    const CELL_H = invert ? 10.8 : 17;
    const ROWS = Math.floor(H / CELL_H);
    const FONT = invert ? 9.5 : 15;

    // Sample the photo at one pixel per cell, cover-fit.
    const sample = document.createElement("canvas");
    sample.width = COLS;
    sample.height = ROWS;
    const sctx = sample.getContext("2d", { willReadFrequently: true });
    if (invert) {
      sctx.fillStyle = "#fff";
      sctx.fillRect(0, 0, COLS, ROWS);
      // Wordmarks: fit (don't crop), centered, with breathing room.
      const pad = 0.1;
      const scale = Math.min(
        (COLS * (1 - pad * 2)) / img.naturalWidth,
        (ROWS * (1 - pad * 2)) / img.naturalHeight,
      );
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      sctx.drawImage(img, (COLS - dw) / 2, (ROWS - dh) / 2, dw, dh);
    } else {
      const gridAR = W / H;
      const imgAR = img.naturalWidth / img.naturalHeight;
      let sx = 0;
      let sy = 0;
      let sw = img.naturalWidth;
      let sh = img.naturalHeight;
      if (imgAR > gridAR) {
        sw = img.naturalHeight * gridAR;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / gridAR;
        sy = (img.naturalHeight - sh) / 2;
      }
      sctx.drawImage(img, sx, sy, sw, sh, 0, 0, COLS, ROWS);
    }
    const data = sctx.getImageData(0, 0, COLS, ROWS).data;

    // Per-image auto-levels: stretch between the 8th and 92nd luminance
    // percentiles so shadows fall to true black and the subject separates —
    // smoky mid-gray sources otherwise become uniform character soup.
    const lums = new Float32Array(COLS * ROWS);
    for (let i = 0; i < COLS * ROWS; i++) {
      const o = i * 4;
      let l =
        (0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2]) / 255;
      if (invert) l = 1 - l;
      lums[i] = l;
    }
    const sorted = Float32Array.from(lums).sort();
    const lo = sorted[Math.floor(sorted.length * 0.08)];
    const hi = sorted[Math.floor(sorted.length * 0.92)];
    const range = Math.max(0.05, hi - lo);

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = INK;
    ctx.fillRect(0, 0, W, H);
    ctx.font = `500 ${FONT}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        let lum = (lums[y * COLS + x] - lo) / range;
        lum = Math.min(1, Math.max(0, lum));
        lum = Math.pow(lum, 0.9);
        if (lum < 0.1) continue; // shadows stay black — the subject emerges
        // Bright pixel → dense, bright character.
        const idx = Math.round((1 - lum) * (RAMP.length - 1));
        const glyph = RAMP[idx];
        if (glyph === " ") continue;
        if (lum > 0.8) {
          ctx.fillStyle = GREEN;
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = "#ffffff";
          ctx.globalAlpha = 0.16 + 0.84 * Math.pow(lum, 1.25);
        }
        ctx.fillText(glyph, (x + 0.5) * CELL_W, (y + 0.5) * CELL_H);
      }
    }
    ctx.globalAlpha = 1;

    // The A mark, signed bottom-right on a quiet plate.
    const plate = 104;
    const px = W - plate - 20;
    const py = H - plate - 20;
    ctx.fillStyle = "rgba(0, 0, 0, 0.62)";
    ctx.fillRect(px, py, plate, plate);
    ctx.save();
    ctx.translate(px + 4, py + 4);
    ctx.strokeStyle = GREEN;
    ctx.lineWidth = 7;
    ctx.lineCap = "butt";
    ctx.stroke(new Path2D("M14 91 60 7"));
    ctx.stroke(new Path2D("M53 5 89 91"));
    ctx.stroke(new Path2D("M73 53 C 52 62 30 77 14 91"));
    ctx.restore();

    return canvas.toDataURL("image/jpeg", 0.82);
  }

  window.__renderCovers = async (only) => {
    const slugs = only ?? Object.keys(SOURCES);
    const results = [];
    for (const slug of slugs) {
      try {
        const img = await loadImage(SOURCES[slug].src);
        const dataUrl = drawCover(img, SOURCES[slug]);
        const res = await fetch("/api/dev-cover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, dataUrl }),
        });
        results.push(`${slug}: ${res.ok ? "ok" : `HTTP ${res.status}`}`);
      } catch (error) {
        results.push(`${slug}: FAILED ${error.message}`);
      }
    }
    return results;
  };
})();
