/**
 * Prepares the NGO partner logos for the site's navy bands.
 *
 *   node scripts/ngo-logos.mjs
 *
 * Reads assets/ngo (the files the NGOs supplied), writes public/ngo. The logos
 * keep their own colours; only the black around them becomes transparent.
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const load = async (file) => {
  const { data, info } = await sharp(`assets/ngo/${file}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
};
const save = ({ data, w, h }, file, width, options) =>
  sharp(data, { raw: { width: w, height: h, channels: 4 } }).resize({ width }).webp(options).toFile(`public/ngo/${file}`).then((i) => console.log(file, i.width, i.height, i.size));

mkdirSync("public/ngo", { recursive: true });

// Animal Warriors: white on black, so the brightness is the shape.
{
  const img = await load("animal-warriors.jpg");
  for (let i = 0; i < img.data.length; i += 4) {
    const light = Math.max(0, Math.min(1, (img.data[i + 1] - 16) / 224));
    img.data.fill(255, i, i + 3);
    img.data[i + 3] = Math.round(light * 255);
  }
  await save(img, "animal-warriors.webp", 900, { quality: 90 });
}

// Kacche Raaste: a postage stamp; clear the black outside its edge, not the black inside.
{
  const img = await load("kacche-raaste.jpg");
  const { data, w, h } = img;
  const DARK = 62;
  const red = (i) => Math.max(data[i * 4], data[i * 4 + 1], data[i * 4 + 2]);
  const seen = new Uint8Array(w * h);
  const queue = [];
  const visit = (x, y) => {
    const i = y * w + x;
    if (x < 0 || y < 0 || x >= w || y >= h || seen[i] || red(i) > DARK) return;
    seen[i] = 1;
    queue.push([x, y]);
  };
  for (let x = 0; x < w; x++) {
    visit(x, 0);
    visit(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    visit(0, y);
    visit(w - 1, y);
  }
  while (queue.length) {
    const [x, y] = queue.pop();
    visit(x + 1, y);
    visit(x - 1, y);
    visit(x, y + 1);
    visit(x, y - 1);
  }
  for (let i = 0; i < w * h; i++) {
    if (!seen[i]) continue;
    const a = Math.max(0, Math.min(1, (red(i) - 24) / (DARK - 24)));
    data.set([101, 17, 40, Math.round(a * 255)], i * 4); // the stamp's maroon, so the edge stays clean
  }
  await save(img, "kacche-raaste.webp", 1024, { quality: 90 });
}
