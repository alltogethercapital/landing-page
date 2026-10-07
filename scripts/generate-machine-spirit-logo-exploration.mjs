import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUTPUT = join(ROOT, "assets/brand/machine-spirit-logo-exploration");
const SVG_OUTPUT = join(OUTPUT, "svg");
mkdirSync(SVG_OUTPUT, { recursive: true });

const INK = "#141412";
const IVORY = "#f4f2ee";

function pointToward(from, to, distance) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy) || 1;
  return [from[0] + (dx / length) * distance, from[1] + (dy / length) * distance];
}

function roundedPolygon(points, radius) {
  const corners = points.map((point, index) => {
    const previous = points[(index - 1 + points.length) % points.length];
    const next = points[(index + 1) % points.length];
    const previousLength = Math.hypot(previous[0] - point[0], previous[1] - point[1]);
    const nextLength = Math.hypot(next[0] - point[0], next[1] - point[1]);
    const cut = Math.min(radius, previousLength * 0.22, nextLength * 0.22);
    return {
      point,
      before: pointToward(point, previous, cut),
      after: pointToward(point, next, cut),
    };
  });

  const [first, ...rest] = corners;
  return [
    `M${first.before[0].toFixed(2)} ${first.before[1].toFixed(2)}`,
    `Q${first.point[0]} ${first.point[1]} ${first.after[0].toFixed(2)} ${first.after[1].toFixed(2)}`,
    ...rest.flatMap((corner) => [
      `L${corner.before[0].toFixed(2)} ${corner.before[1].toFixed(2)}`,
      `Q${corner.point[0]} ${corner.point[1]} ${corner.after[0].toFixed(2)} ${corner.after[1].toFixed(2)}`,
    ]),
    "Z",
  ].join(" ");
}

function mirror(points, width = 1000) {
  return points.map(([x, y]) => [width - x, y]).reverse();
}

const families = [
  {
    id: "core-wing",
    name: "Core Wing",
    description: "Closest to the existing mark, with a softer engineered finish.",
    gap: 222,
    corner: 5,
    center: "square",
    rows: [
      [0, 0, 388, 104, 80],
      [80, 142, 388, 84, 82],
      [176, 278, 388, 84, 84],
      [286, 420, 388, 82, 96],
    ],
  },
  {
    id: "signal-wing",
    name: "Signal Wing",
    description: "A lighter, broadcast-like rhythm with five signal feathers.",
    gap: 206,
    corner: 7,
    center: "dot",
    rows: [
      [12, 0, 397, 66, 62],
      [70, 103, 397, 66, 68],
      [139, 206, 397, 66, 76],
      [222, 309, 397, 66, 82],
      [318, 412, 397, 66, 88],
    ],
  },
  {
    id: "spirit-core",
    name: "Spirit Core",
    description: "A stronger central presence held inside the wing structure.",
    gap: 248,
    corner: 8,
    center: "diamond",
    rows: [
      [6, 0, 376, 102, 72],
      [88, 139, 376, 88, 82],
      [185, 278, 376, 88, 92],
      [300, 417, 376, 88, 104],
    ],
  },
  {
    id: "ascendant",
    name: "Ascendant",
    description: "Longer upper planes and a more upward, forward posture.",
    gap: 214,
    corner: 6,
    center: "square",
    rows: [
      [0, 0, 393, 88, 112],
      [110, 134, 393, 82, 96],
      [224, 272, 393, 78, 78],
      [334, 416, 393, 72, 58],
    ],
  },
  {
    id: "forge-wing",
    name: "Forge Wing",
    description: "Fewer, heavier forms with a compact industrial stance.",
    gap: 226,
    corner: 9,
    center: "pill",
    rows: [
      [0, 0, 387, 122, 92],
      [128, 188, 387, 116, 104],
      [272, 376, 387, 112, 116],
    ],
  },
  {
    id: "aerial",
    name: "Aerial",
    description: "Slim, widely spaced planes with an almost weightless profile.",
    gap: 194,
    corner: 11,
    center: "dot",
    rows: [
      [20, 0, 403, 54, 54],
      [74, 101, 403, 54, 62],
      [141, 202, 403, 54, 70],
      [220, 303, 403, 54, 78],
      [312, 404, 403, 54, 86],
    ],
  },
  {
    id: "relay",
    name: "Relay",
    description: "A technical cadence that reads as wing, signal, and transfer.",
    gap: 234,
    corner: 6,
    center: "bar",
    rows: [
      [0, 0, 383, 76, 64],
      [64, 112, 383, 76, 72],
      [139, 224, 383, 76, 80],
      [226, 336, 383, 76, 88],
      [323, 448, 383, 62, 92],
    ],
  },
  {
    id: "veil-wing",
    name: "Veil Wing",
    description: "More organic corner behavior without losing the hard geometry.",
    gap: 218,
    corner: 18,
    center: "round-square",
    rows: [
      [2, 0, 391, 96, 72],
      [82, 139, 391, 86, 80],
      [180, 278, 391, 82, 90],
      [292, 417, 391, 78, 100],
    ],
  },
  {
    id: "talon",
    name: "Talon",
    description: "Sharper taper and shorter lower forms for a decisive silhouette.",
    gap: 230,
    corner: 5,
    center: "diamond",
    rows: [
      [0, 0, 385, 96, 118],
      [98, 144, 385, 84, 112],
      [218, 288, 385, 80, 106],
      [342, 432, 385, 68, 94],
    ],
  },
  {
    id: "synthesis",
    name: "Synthesis",
    description: "The wing and machine-signal readings brought into one balanced form.",
    gap: 210,
    corner: 12,
    center: "round-square",
    rows: [
      [8, 0, 395, 92, 82],
      [82, 136, 395, 86, 88],
      [172, 272, 395, 82, 94],
      [278, 408, 395, 78, 100],
    ],
  },
];

function centerMarkup(type, y, size, radius) {
  const x = 500 - size / 2;
  if (type === "diamond") {
    return `<path d="${roundedPolygon([[500, y], [x + size, y + size / 2], [500, y + size], [x, y + size / 2]], radius)}"/>`;
  }
  if (type === "dot") {
    return `<circle cx="500" cy="${y + size / 2}" r="${size / 2}"/>`;
  }
  if (type === "pill") {
    return `<rect x="${x - size * 0.18}" y="${y}" width="${size * 1.36}" height="${size}" rx="${size / 2}"/>`;
  }
  if (type === "bar") {
    return `<rect x="${x - size * 0.3}" y="${y + size * 0.28}" width="${size * 1.6}" height="${size * 0.44}" rx="${radius}"/>`;
  }
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${type === "round-square" ? radius * 1.8 : radius}"/>`;
}

function conceptMarkup(family, variant) {
  const t = (variant - 4.5) / 4.5;
  const gap = family.gap + t * 18;
  const innerLeft = 500 - gap / 2;
  const corner = Math.max(3, family.corner + variant * 0.72);
  const density = 1 + t * 0.04;
  const taper = t * 9;
  const paths = family.rows.flatMap(([outer, y, inner, height, bevel], rowIndex) => {
    const rowHeight = height * density;
    const rowInner = innerLeft + (inner - (500 - family.gap / 2)) + (rowIndex % 2 ? t * 3 : 0);
    const rowOuter = outer + (rowIndex * taper) / Math.max(1, family.rows.length - 1);
    const rowBevel = bevel + t * 10;
    const left = [
      [rowOuter, y],
      [rowInner, y],
      [rowInner, y + rowHeight],
      [rowOuter + rowBevel, y + rowHeight],
    ];
    return [
      `<path d="${roundedPolygon(left, corner)}"/>`,
      `<path d="${roundedPolygon(mirror(left), corner)}"/>`,
    ];
  });
  const anchorRow = family.rows[Math.min(1, family.rows.length - 1)];
  const coreSize = Math.max(48, anchorRow[3] * (0.68 + variant * 0.018));
  const coreY = anchorRow[1] + (anchorRow[3] - coreSize) / 2;
  paths.push(centerMarkup(family.center, coreY, coreSize, corner));
  return `<g fill="currentColor">${paths.join("")}</g>`;
}

function conceptSvg(markup, number, title) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" role="img" aria-labelledby="title">
  <title id="title">Machine Spirit logo concept ${String(number).padStart(2, "0")}: ${title}</title>
  <g color="${INK}" transform="translate(0 240)">${markup}</g>
</svg>
`;
}

const concepts = [];
for (const [familyIndex, family] of families.entries()) {
  for (let variant = 0; variant < 10; variant += 1) {
    const number = familyIndex * 10 + variant + 1;
    const suffix = String.fromCharCode(65 + variant);
    const title = `${family.name} ${suffix}`;
    const slug = `${String(number).padStart(3, "0")}-${family.id}-${suffix.toLowerCase()}`;
    const markup = conceptMarkup(family, variant);
    writeFileSync(join(SVG_OUTPUT, `${slug}.svg`), conceptSvg(markup, number, title));
    concepts.push({ number, title, slug, family, markup });
  }
}

const tile = 560;
const sheetWidth = tile * 10;
const sheetHeight = tile * 10;
const overviewTiles = concepts.map((concept, index) => {
  const column = index % 10;
  const row = Math.floor(index / 10);
  return `<g transform="translate(${column * tile} ${row * tile})">
    <rect x="12" y="12" width="536" height="536" rx="8" fill="#f7f6f5" stroke="#dedbd5"/>
    <text x="38" y="53" fill="#6f6b64" font-family="Arial, sans-serif" font-size="18">${String(concept.number).padStart(3, "0")}</text>
    <g color="${INK}" transform="translate(54 80) scale(.452)">${concept.markup}</g>
    <text x="280" y="386" text-anchor="middle" fill="${INK}" font-family="Arial, sans-serif" font-size="21" letter-spacing="5">MACHINE SPIRIT</text>
    <text x="280" y="430" text-anchor="middle" fill="#6f6b64" font-family="Arial, sans-serif" font-size="16" letter-spacing="1">${concept.title.toUpperCase()}</text>
  </g>`;
}).join("");

writeFileSync(join(OUTPUT, "machine-spirit-100-overview.svg"), `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${sheetWidth} ${sheetHeight}" role="img" aria-labelledby="title">
  <title id="title">One hundred Machine Spirit wing logo concepts</title>
  <rect width="100%" height="100%" fill="#ece9e3"/>
  ${overviewTiles}
</svg>
`);

const cards = concepts.map((concept) => `<button class="card" data-index="${concept.number - 1}" aria-label="View ${concept.title}">
  <span class="number">${String(concept.number).padStart(3, "0")}</span>
  <img src="svg/${concept.slug}.svg" alt="" />
  <span class="card-name">${concept.title}</span>
</button>`).join("");

writeFileSync(join(OUTPUT, "index.html"), `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Machine Spirit — 100 Wing Studies</title>
<style>
:root{color-scheme:light;--bg:#f2f0ec;--paper:#f7f6f5;--ink:#141412;--muted:#77736c;--line:#d8d4cc}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Arial,sans-serif}.shell{display:grid;grid-template-columns:minmax(360px,42vw) 1fr;min-height:100vh}.stage{position:sticky;top:0;height:100vh;padding:42px;border-right:1px solid var(--line);display:flex;flex-direction:column}.eyebrow,.number,.meta{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}.preview{margin:auto;width:min(100%,560px);aspect-ratio:1;background:var(--paper);display:grid;place-items:center}.preview img{width:82%;height:82%;object-fit:contain}.wordmark{text-align:center;font-size:26px;letter-spacing:.2em;text-transform:uppercase;margin-top:24px}.meta{text-align:center;margin-top:12px}.controls{display:flex;justify-content:space-between;gap:10px}.controls button{width:48px;height:48px;border:1px solid var(--line);background:var(--paper);font-size:22px;cursor:pointer}.gallery{padding:42px;display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;align-content:start}.card{position:relative;min-height:210px;border:1px solid var(--line);background:var(--paper);color:var(--ink);padding:22px 14px 16px;cursor:pointer;text-align:center}.card:hover,.card.active{border-color:var(--ink)}.card img{width:100%;height:130px;object-fit:contain}.card .number{position:absolute;top:12px;left:12px}.card-name{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}@media(max-width:800px){.shell{display:block}.stage{position:relative;height:auto;min-height:74vh;border-right:0;border-bottom:1px solid var(--line);padding:24px}.gallery{padding:18px;grid-template-columns:repeat(2,1fr)}}
</style>
</head>
<body>
<main class="shell">
  <section class="stage">
    <p class="eyebrow">100 wing studies</p>
    <div class="preview"><img id="preview" alt="Selected Machine Spirit logo concept" /></div>
    <div class="wordmark">Machine Spirit</div>
    <div class="meta" id="name"></div>
    <div class="controls"><button id="prev" aria-label="Previous concept">←</button><button id="next" aria-label="Next concept">→</button></div>
  </section>
  <section class="gallery">${cards}</section>
</main>
<script>
const concepts=${JSON.stringify(concepts.map(({ title, slug }) => ({ title, slug })))};let current=0;const preview=document.querySelector('#preview');const name=document.querySelector('#name');const cards=[...document.querySelectorAll('.card')];function select(index){current=(index+concepts.length)%concepts.length;preview.src='svg/'+concepts[current].slug+'.svg';name.textContent=String(current+1).padStart(3,'0')+' / '+concepts[current].title;cards.forEach((card,i)=>card.classList.toggle('active',i===current));cards[current].scrollIntoView({block:'nearest'})}cards.forEach((card,i)=>card.addEventListener('click',()=>select(i)));document.querySelector('#prev').addEventListener('click',()=>select(current-1));document.querySelector('#next').addEventListener('click',()=>select(current+1));addEventListener('keydown',(event)=>{if(event.key==='ArrowLeft')select(current-1);if(event.key==='ArrowRight')select(current+1)});select(0);
</script>
</body>
</html>`);

writeFileSync(join(OUTPUT, "README.md"), `# Machine Spirit logo exploration

One hundred monochrome wing-mark directions, organized as ten families with ten refinements each.

- Open \`index.html\` to cycle through every option.
- \`machine-spirit-100-overview.svg\` is the full contact sheet.
- Every option in \`svg/\` is resolution-independent and has a transparent background.
- All displayed wordmarks use **Machine Spirit** only.

## Families

${families.map((family, index) => `${index + 1}. **${family.name}** — ${family.description}`).join("\n")}
`);

function canonicalMark(fill) {
  const shapes = [
    [[0, 0], [1118, 0], [1118, 300], [230, 300]],
    [[1754, 0], [2872, 0], [2636, 300], [1754, 300]],
    [[229, 428], [1118, 428], [1118, 666], [467, 666]],
    [[1754, 428], [2643, 428], [2405, 666], [1754, 666]],
    [[504, 795], [1118, 795], [1118, 1033], [742, 1033]],
    [[1754, 795], [2368, 795], [2130, 1033], [1754, 1033]],
    [[826, 1162], [1118, 1162], [1118, 1400], [1064, 1400]],
    [[1754, 1162], [2046, 1162], [1808, 1400], [1754, 1400]],
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2872 1400" role="img" aria-labelledby="title">
  <title id="title">Machine Spirit wing mark</title>
  <g fill="${fill}">
    ${shapes.map((shape) => `<path d="${roundedPolygon(shape, 18)}"/>`).join("\n    ")}
    <rect x="1317" y="428" width="238" height="238" rx="18"/>
  </g>
</svg>
`;
}

const canonicalInk = canonicalMark(INK);
const canonicalIvory = canonicalMark(IVORY);
writeFileSync(join(ROOT, "public/brand/machine-spirit-wing-mark.svg"), canonicalInk);
writeFileSync(join(ROOT, "public/brand/machine-spirit-wing-mark-ivory.svg"), canonicalIvory);
writeFileSync(join(ROOT, "public/brand/machine-spirit-mark.svg"), canonicalInk);
writeFileSync(join(ROOT, "public/brand/machine-spirit-mark-white.svg"), canonicalIvory);

console.log(`Generated ${concepts.length} Machine Spirit logo concepts in ${OUTPUT}`);
