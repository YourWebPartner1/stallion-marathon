/**
 * Traces the crest's outline into vector paths, so the loader can draw it line by line.
 *
 *   node scripts/trace-crest.mjs
 *
 * Reads public/brand/sm-crest-mask.png, writes lib/crest-lines.ts. Run it again
 * after the crest changes.
 */
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const WIDTH = 420;
const { data, info } = await sharp("public/brand/sm-crest-mask.png")
  .ensureAlpha()
  .resize({ width: WIDTH })
  .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width: w, height: h } = info;
const at = (x, y) => data[(y * w + x) * 4 + 3] / 255;
const LEVEL = 0.5;

// Marching squares: one or two line pieces per cell, joined into closed loops.
const key = (p) => `${p[0].toFixed(3)},${p[1].toFixed(3)}`;
const mix = (a, b) => (LEVEL - a) / (b - a);
const next = new Map();
const add = (a, b) => next.set(key(a), { from: a, to: b });
for (let y = 0; y < h - 1; y++)
  for (let x = 0; x < w - 1; x++) {
    const tl = at(x, y), tr = at(x + 1, y), br = at(x + 1, y + 1), bl = at(x, y + 1);
    const c = (tl > LEVEL) * 8 + (tr > LEVEL) * 4 + (br > LEVEL) * 2 + (bl > LEVEL) * 1;
    if (c === 0 || c === 15) continue;
    const T = () => [x + mix(tl, tr), y];
    const R = () => [x + 1, y + mix(tr, br)];
    const B = () => [x + mix(bl, br), y + 1];
    const L = () => [x, y + mix(tl, bl)];
    // Ink kept on the right of travel.
    const cases = {
      1: [[L, B]], 2: [[B, R]], 3: [[L, R]], 4: [[R, T]], 5: [[L, T], [R, B]], 6: [[B, T]], 7: [[L, T]],
      8: [[T, L]], 9: [[T, B]], 10: [[T, R], [B, L]], 11: [[T, R]], 12: [[R, L]], 13: [[R, B]], 14: [[B, L]],
    };
    for (const [a, b] of cases[c]) add(a(), b());
  }

const loops = [];
while (next.size) {
  const [start] = next.keys();
  const pts = [];
  let k = start;
  while (next.has(k)) {
    const s = next.get(k);
    next.delete(k);
    pts.push(s.from);
    k = key(s.to);
  }
  if (pts.length > 10) loops.push(pts);
}

/** Drops points that sit within `eps` of the line through their neighbours. */
function simplify(pts, eps) {
  if (pts.length < 3) return pts;
  const [a, b] = [pts[0], pts[pts.length - 1]];
  const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1e-9;
  let far = 0, at = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = Math.hypot(dx, dy) < 1e-6
      ? Math.hypot(pts[i][0] - a[0], pts[i][1] - a[1])
      : Math.abs(dy * (pts[i][0] - a[0]) - dx * (pts[i][1] - a[1])) / len;
    if (d > far) { far = d; at = i; }
  }
  if (far <= eps) return [a, b];
  return [...simplify(pts.slice(0, at + 1), eps).slice(0, -1), ...simplify(pts.slice(at), eps)];
}

const length = (p) => p.reduce((s, q, i) => s + (i ? Math.hypot(q[0] - p[i - 1][0], q[1] - p[i - 1][1]) : 0), 0);
const n = (v) => String(Math.round(v * 10) / 10);
const toPath = (p) => `M${p.map((q) => `${n(q[0])} ${n(q[1])}`).join("L")}Z`;
const groups = { frame: [], letters: [], suits: [] };
for (const p of loops) {
  if (length(p) <= 14) continue;
  const xs = p.map((q) => q[0] / w), ys = p.map((q) => q[1] / h);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const d = toPath(simplify([...p, p[0]], 0.42));
  // SM sits in the middle; the suits are the small shapes out in the corners.
  if (x0 > 0.28 && x1 < 0.72 && y0 > 0.25 && y1 < 0.76) groups.letters.push(d);
  else if ((x1 < 0.19 || x0 > 0.81) && ((y0 > 0.19 && y1 < 0.31) || (y0 > 0.68 && y1 < 0.78)))
    groups.suits.push({ d, x: Math.round(((x0 + x1) / 2) * 100), y: Math.round(((y0 + y1) / 2) * 100) });
  else groups.frame.push(d);
}

const out = `/** Outline of the SM crest, traced by scripts/trace-crest.mjs. */
export const crestViewBox = "0 0 ${w} ${h}";

export const crestFrame =
  "${groups.frame.join("")}";

export const crestLetters =
  "${groups.letters.join("")}";

/** Each suit, with its centre as a share of the crest's width and height. */
export const crestSuits = [
${groups.suits.map((g) => `  { x: ${g.x}, y: ${g.y}, d: "${g.d}" },`).join("\n")}
];
`;
writeFileSync("lib/crest-lines.ts", out);
console.log(`${groups.frame.length} frame, ${groups.letters.length} letter and ${groups.suits.length} suit loops, ${(out.length / 1024).toFixed(1)} KB`);
