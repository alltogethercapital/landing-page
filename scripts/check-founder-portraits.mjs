import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const source = readFileSync("src/lib/founders.ts", "utf8");
const ast = ts.createSourceFile("founders.ts", source, ts.ScriptTarget.Latest, true);
const founders = [];
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(ast) === "FOUNDERS") {
    for (const entry of node.initializer.elements) {
      founders.push(Object.fromEntries(entry.properties.filter(ts.isPropertyAssignment)
        .map((property) => [property.name.getText(ast), property.initializer.text])));
    }
  }
  ts.forEachChild(node, visit);
}
visit(ast);
const errors = [];
for (const founder of founders) {
  if (!founder.headshot?.startsWith("/founders/")) {
    errors.push(`${founder.name}: local founder image is required`);
    continue;
  }
  const rendered = founder.headshot.startsWith("/founders/cutouts/")
    ? founder.headshot.replace("/founders/cutouts/", "/founders/white-webp/").replace(/\.png$/, ".webp")
    : founder.headshot;
  for (const asset of new Set([founder.headshot, rendered])) {
    try {
      const bytes = readFileSync(join("public", asset));
      const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const webp = bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
      if (bytes.length < 200 || (!png && !webp)) throw new Error("invalid image");
    } catch {
      errors.push(`${founder.name}: missing, empty, or invalid ${asset}`);
    }
  }
}
if (!founders.length) errors.push("No founder entries found");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
const sources = JSON.parse(readFileSync("assets/brand/founder-portrait-sources.json", "utf8"));
for (const source of sources.filter((entry) => entry.pendingPortrait)) {
  console.warn(`Portrait still needed for ${source.name}: ${source.note}`);
}
console.log(`Verified all ${founders.length} founder image assignments and local assets.`);
