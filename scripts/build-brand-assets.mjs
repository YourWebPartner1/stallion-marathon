/**
 * Builds web assets from the two-colour crest logo (gold on navy).
 *
 *   node scripts/build-brand-assets.mjs
 *
 * Outputs:
 *   public/brand/sm-crest-mask.png  white shape with transparency, recoloured in CSS
 *   public/brand/sm-crest-gold.png  gold on transparent, for places CSS can't reach
 *   app/icon.png, app/apple-icon.png  browser and home-screen icons
 *
 * The background is removed by measuring how far each pixel sits between the
 * navy and the gold, which keeps the anti-aliased edges smooth.
 */
import sharp from "sharp";

const SRC = "public/brand/sm-crest-original.webp";
const GOLD = [0xf7, 0xb5, 0x38];
const NAVY = [0x08, 0x33, 0x5d];

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const px = (i) => [data[i * 3], data[i * 3 + 1], data[i * 3 + 2]];

// Background colour: average of the four corners.
const corners = [0, width - 1, (height - 1) * width, height * width - 1].map(px);
const bg = [0, 1, 2].map((c) => corners.reduce((s, p) => s + p[c], 0) / 4);

// Ink colour: average of the pixels furthest from the background.
const dist = (p) => Math.hypot(p[0] - bg[0], p[1] - bg[1], p[2] - bg[2]);
let maxD = 0;
for (let i = 0; i < width * height; i++) maxD = Math.max(maxD, dist(px(i)));
const inkSum = [0, 0, 0];
let inkN = 0;
for (let i = 0; i < width * height; i++) {
  const p = px(i);
  if (dist(p) > maxD * 0.85) {
    inkSum[0] += p[0];
    inkSum[1] += p[1];
    inkSum[2] += p[2];
    inkN++;
  }
}
const ink = inkSum.map((v) => v / inkN);
const axis = ink.map((v, c) => v - bg[c]);
const axisLen2 = axis.reduce((s, v) => s + v * v, 0);

// Alpha = position of each pixel along the navy → gold line.
const alpha = Buffer.alloc(width * height);
let minX = width, minY = height, maxX = 0, maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = y * width + x;
    const p = px(i);
    const t = ((p[0] - bg[0]) * axis[0] + (p[1] - bg[1]) * axis[1] + (p[2] - bg[2]) * axis[2]) / axisLen2;
    // Small dead zones at each end clean up compression noise.
    const a = Math.min(1, Math.max(0, (t - 0.08) / 0.84));
    alpha[i] = Math.round(a * 255);
    if (a > 0.1) {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    }
  }
}

const pad = 8;
const crop = {
  left: Math.max(0, minX - pad),
  top: Math.max(0, minY - pad),
  width: Math.min(width, maxX + pad + 1) - Math.max(0, minX - pad),
  height: Math.min(height, maxY + pad + 1) - Math.max(0, minY - pad),
};

function solid(rgb) {
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    out[i * 4] = rgb[0];
    out[i * 4 + 1] = rgb[1];
    out[i * 4 + 2] = rgb[2];
    out[i * 4 + 3] = alpha[i];
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).extract(crop);
}

await solid([255, 255, 255]).png({ compressionLevel: 9 }).toFile("public/brand/sm-crest-mask.png");
await solid(GOLD).png({ compressionLevel: 9 }).toFile("public/brand/sm-crest-gold.png");

// Square icons: gold crest centred on the site navy.
const goldCrest = await solid(GOLD).png().toBuffer();
async function icon(size, file, inset) {
  const inner = Math.round(size * (1 - inset * 2));
  const mark = await sharp(goldCrest).resize(inner, inner, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: { r: NAVY[0], g: NAVY[1], b: NAVY[2], alpha: 1 } } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(file);
}
await icon(512, "app/icon.png", 0.06);
await icon(180, "app/apple-icon.png", 0.1);

console.log("background", bg.map(Math.round), "ink", ink.map(Math.round), "crop", crop);
