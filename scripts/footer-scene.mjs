/**
 * Draws the footer picture: a stadium track seen like a table, set with race-day
 * things, hurdles around it. Engraved look: flat fills, ink outlines, hatching.
 *
 *   node scripts/footer-scene.mjs
 *
 * Writes public/footer/track-blue.webp and track-gold.webp: the same picture in
 * two palettes. The footer shows the blue one; the brush reveals the gold one.
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

const W = 1600;
const H = 1000;
const PALETTES = {
  blue: { dark: "#081629", ground: "#0b1c33", lane: "#0e2440", mid: "#24568d", light: "#3b76b5", paper: "#4080bf", hi: "#6aa2da", ink: "#061120", thread: "#285a92" },
  gold: { dark: "#8a6a24", ground: "#a67f2b", lane: "#a67c24", mid: "#d99a2b", light: "#f7b538", paper: "#fbd37c", hi: "#ffe7ae", ink: "#2a1904", thread: "#5b4314" },
};

let seed = 7;
const rand = () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};
const f = (v) => Math.round(v * 10) / 10;
let C;
let clipId = 0;

/** Broken, slightly wavering ruled lines over a box, at an angle: the engraver's shading. */
function rules(box, angle, gap, color, width, broken = 0.25, wave = 1.2) {
  const [x0, y0, x1, y1] = box;
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const R = Math.hypot(x1 - x0, y1 - y0) / 2 + 4;
  const a = (angle * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
  let d = "";
  for (let t = -R; t <= R; t += gap) {
    let s = -R + rand() * 12;
    while (s < R) {
      const e = Math.min(R, s + 20 + rand() * (rand() < broken ? 30 : 160));
      let first = true;
      for (let u = s; u <= e; u += 16) {
        const v = t + Math.sin(u / 23 + t) * wave * 0.5 + (rand() - 0.5) * wave;
        d += `${first ? "M" : "L"}${f(cx + u * ca - v * sa)} ${f(cy + u * sa + v * ca)}`;
        first = false;
      }
      s = e + 3 + rand() * (rand() < broken ? 34 : 8);
    }
  }
  return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
}

/** A filled shape with hatching inside and an ink outline. */
function shape(d, box, { fill = C.mid, hatch = [], line = 2.6, stroke = C.ink, extra = "", tone = 1, cast = 0 } = {}) {
  const id = `c${++clipId}`;
  const [x0, y0, x1, y1] = box;
  const inner = hatch.map((h) => rules(box, ...h)).join("");
  const area = `x="${f(x0 - 2)}" y="${f(y0 - 2)}" width="${f(x1 - x0 + 4)}" height="${f(y1 - y0 + 4)}"`;
  // Dense lines fade in toward the lower right, pale ones toward the upper left.
  const shade = tone
    ? `<mask id="m${id}"><rect ${area} fill="url(#toDark)"/></mask><mask id="h${id}"><rect ${area} fill="url(#toLight)"/></mask>` +
      `<g mask="url(#m${id})">${rules(box, 52, 3.1, C.ink, 1.25 * tone, 0.06, 0.6)}${rules(box, -24, 4.6, C.ink, 0.9 * tone, 0.2, 0.6)}</g>` +
      `<g mask="url(#h${id})">${rules(box, 18, 4.4, C.hi, 1, 0.35, 0.6)}</g>`
    : "";
  const shadow = cast ? `<path d="${d}" transform="translate(${f(cast)} ${f(cast * 0.8)})" fill="${C.ink}" opacity="0.6"/>` : "";
  return `${shadow}<path d="${d}" fill="${fill}"/><clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${inner}${shade}${extra}</g><path d="${d}" fill="none" stroke="${stroke}" stroke-width="${line}" stroke-linejoin="round"/>`;
}
const g = (t, ...c) => `<g transform="${t}">${c.join("")}</g>`;
const poly = (...p) => `M${p.map((q) => q.map(f).join(" ")).join("L")}Z`;
const ell = (cx, cy, rx, ry) => `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${rx * 2} 0a${rx} ${ry} 0 1 0 ${-rx * 2} 0Z`;
const stroke = (d, w = 2, color = C.ink) => `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

/* ---------- things on the track ---------- */

/** A track hurdle: striped board on two metal posts, feet reaching toward the viewer. */
function hurdle() {
  const tube = (x0, y0, x1, y1, r) => {
    const a = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2, dx = Math.cos(a) * r, dy = Math.sin(a) * r;
    return shape(poly([x0 + dx, y0 + dy], [x1 + dx, y1 + dy], [x1 - dx, y1 - dy], [x0 - dx, y0 - dy]), [Math.min(x0, x1) - r, Math.min(y0, y1) - r, Math.max(x0, x1) + r, Math.max(y0, y1) + r], {
      fill: C.mid,
      hatch: [[(Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI, 4.5, C.ink, 1.3, 0.15], [(Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI, 11, C.hi, 1.2, 0.5]],
      line: 2.8,
    });
  };
  const foot = (x, out) => tube(x, 150, x + out * 46, 192, 7) + `<circle cx="${x + out * 46}" cy="192" r="9" fill="${C.light}" stroke="${C.ink}" stroke-width="2.6"/>`;
  const post = (x) => tube(x, -34, x, 152, 8.5) + shape(poly([x - 15, 20], [x + 15, 20], [x + 15, 42], [x - 15, 42]), [x - 16, 18, x + 16, 44], { fill: C.light, hatch: [[90, 4, C.ink, 1.1]], line: 2.4 });
  // Board with a little thickness on top, striped toward both ends.
  const top = shape(poly([-138, -94], [138, -94], [146, -84], [-146, -84]), [-146, -96, 146, -82], { fill: C.hi, line: 2.6 });
  const face = poly([-146, -84], [146, -84], [146, -26], [-146, -26]);
  const stripes = [-1, 1]
    .map((k) => [0, 1].map((n) => `<path d="${poly([k * (138 - n * 34), -84], [k * (120 - n * 34), -84], [k * (106 - n * 34), -26], [k * (124 - n * 34), -26])}" fill="${C.ink}" opacity="0.82"/>`).join(""))
    .join("");
  const board = shape(face, [-146, -84, 146, -26], { fill: C.light, hatch: [[0, 6.5, C.ink, 1.5, 0.2, 1.6], [1, 21, C.hi, 1.2, 0.5, 1.6]], extra: stripes, line: 3.4 });
  const marks = [-42, 0, 42].map((x) => `<path d="${poly([x, -75], [x + 13, -55], [x, -35], [x - 13, -55])}" fill="${C.hi}" stroke="${C.ink}" stroke-width="2.4"/>`).join("");
  return tube(-112, 118, 112, 118, 6) + post(-112) + post(112) + foot(-112, -1) + foot(112, 1) + top + board + marks;
}

function pencil(len = 150) {
  return (
    shape(poly([0, -7], [len - 26, -7], [len - 26, 7], [0, 7]), [0, -8, len, 8], { fill: C.light, hatch: [[0, 5, C.ink, 1.3]], line: 2.5 }) +
    shape(poly([len - 26, -7], [len, 0], [len - 26, 7]), [len - 28, -8, len, 8], { fill: C.hi, line: 2.5 }) +
    shape(poly([-16, -7], [0, -7], [0, 7], [-16, 7]), [-18, -8, 2, 8], { fill: C.mid, line: 2.5 })
  );
}

function sheet(w, h, title, rows) {
  let s = shape(poly([0, 0], [w, 0], [w, h], [0, h]), [0, 0, w, h], { fill: C.paper, tone: 0.3, cast: 8 });
  s += `<text x="14" y="30" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="25" fill="${C.ink}">${title}</text>`;
  const top = 42, step = (h - top - 12) / rows;
  for (let i = 0; i <= rows; i++) s += stroke(`M10 ${f(top + i * step)}L${w - 10} ${f(top + i * step)}`, 1.8);
  for (const x of [0.16, 0.6, 0.8]) s += stroke(`M${f(w * x)} ${top}L${f(w * x)} ${f(top + rows * step)}`, 1.8);
  for (let i = 0; i < rows; i++) {
    const y = top + i * step + step * 0.64;
    let d = `M${f(w * 0.2)} ${f(y)}`;
    for (let x = w * 0.2; x < w * (0.36 + rand() * 0.2); x += 5) d += `q1.5 ${f(-4 - rand() * 6)} 3 0t2 0`;
    s += stroke(d, 1.6) + stroke(`M${f(w * 0.65)} ${f(y)}l8 -6l5 5l8 -5`, 1.5) + stroke(`M${f(w * 0.85)} ${f(y)}l6 -7l6 6`, 1.5);
  }
  return s;
}

function bibs(n, label) {
  let s = "";
  for (let i = n - 1; i >= 0; i--) {
    const turn = i ? (i % 2 ? 7 : -5) * i : 0;
    const one =
      shape("M8 0H148q8 0 8 8V92q0 8 -8 8H8q-8 0 -8 -8V8q0 -8 8 -8Z", [0, 0, 156, 100], { fill: i ? C.mid : C.paper, tone: i ? 1 : 0.35, cast: i === n - 1 ? 9 : 3 }) +
      (i
        ? ""
        : shape("M4 4H152V30H4Z", [4, 4, 152, 30], { fill: C.mid, tone: 0.8, line: 2 }) +
          `<text x="78" y="25" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="19" letter-spacing="3" fill="${C.hi}">STALLION</text>` +
          `<text x="78" y="82" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="52" fill="${C.ink}">${label}</text>` +
          stroke("M22 90H134", 1.4) +
          [[12, 42], [144, 42], [12, 91], [144, 91]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.4" fill="${C.ink}"/><circle cx="${x - 1}" cy="${y - 1}" r="1" fill="${C.hi}"/>`).join(""));
    s += g(`translate(${i * 3} ${i * 13}) rotate(${turn} 78 50)`, one);
  }
  return s;
}

/** Lidded trophy with a horseshoe on top, as in the hero. */
function cup() {
  const band = (y, rx, h, fill) => shape(`M${-rx} ${y}Q0 ${y + 9} ${rx} ${y}L${rx} ${y + h}Q0 ${y + h + 9} ${-rx} ${y + h}Z`, [-rx, y - 2, rx, y + h + 10], { fill, line: 2 });
  const handle = (k) => `M${k * 25} -104C${k * 50} -110 ${k * 52} -66 ${k * 17} -62`;
  return (
    `<ellipse cx="16" cy="8" rx="46" ry="13" fill="${C.ink}" opacity="0.65"/>` +
    shape("M-31 -2C-31 -18 31 -18 31 -2L33 8Q0 23 -33 8Z", [-34, -16, 34, 22], { fill: C.mid }) +
    band(-18, 24, 7, C.light) +
    shape("M-19 -16C-8 -22 -7 -36 -5 -50L5 -50C7 -36 8 -22 19 -16Q0 -8 -19 -16Z", [-20, -52, 20, -8], { fill: C.light }) +
    shape(ell(0, -50, 12, 6), [-13, -57, 13, -43], { fill: C.hi, line: 2 }) +
    [-1, 1].map((k) => stroke(handle(k), 10) + stroke(handle(k), 5.4, C.light) + stroke(handle(k), 1.2, C.hi)).join("") +
    shape("M-29 -112Q0 -103 29 -112C31 -74 18 -56 0 -52C-18 -56 -31 -74 -29 -112Z", [-31, -114, 31, -50], { fill: C.light, line: 2.8 }) +
    band(-93, 28, 4, C.hi) +
    shape("M-31 -114Q0 -104 31 -114C28 -132 14 -140 0 -141C-14 -140 -28 -132 -31 -114Z", [-33, -143, 33, -104], { fill: C.mid }) +
    shape(ell(0, -146, 7, 5), [-8, -152, 8, -140], { fill: C.hi, line: 2 }) +
    stroke("M-9 -172C-17 -160 -10 -150 0 -150C10 -150 17 -160 9 -172", 7) +
    stroke("M-9 -172C-17 -160 -10 -150 0 -150C10 -150 17 -160 9 -172", 3.6, C.hi)
  );
}

/** A stallion bust on a turned base. */
function stallion() {
  const head = "M-18 40C-20 16 -10 -2 -22 -20C-32 -8 -46 4 -60 4C-74 2 -80 -10 -72 -22C-62 -36 -50 -50 -42 -66C-38 -84 -22 -98 -8 -104L-12 -126L6 -110L16 -124L22 -102C46 -88 60 -54 62 -18C64 8 58 26 62 40Q20 54 -18 40Z";
  let s = `<ellipse cx="24" cy="86" rx="72" ry="17" fill="${C.ink}" opacity="0.65"/>`;
  s += shape("M-46 70C-46 58 66 58 66 70L70 84Q10 102 -50 84Z", [-52, 58, 72, 100], { fill: C.mid });
  s += shape("M-34 58C-34 48 56 48 56 58L58 68Q10 82 -36 68Z", [-38, 46, 60, 80], { fill: C.light });
  s += shape("M-24 42Q20 56 66 42L56 58Q10 70 -32 58Z", [-34, 40, 68, 68], { fill: C.mid });
  s += shape(head, [-80, -128, 66, 52], { fill: C.light, line: 3.2 });
  // Mane: long locks falling behind.
  for (let i = 0; i < 9; i++) {
    const y = -98 + i * 14;
    s += shape(`M${f(20 + i * 3.4)} ${y}C${f(44 + i * 3)} ${y + 2} ${f(62 + i * 1.6)} ${y + 18} ${f(74 + Math.sin(i) * 6)} ${y + 40}C${f(56 + i)} ${y + 34} ${f(34 + i * 2)} ${y + 22} ${f(18 + i * 3.2)} ${y + 20}Z`, [14, y - 2, 86, y + 44], { fill: i % 2 ? C.mid : C.hi, line: 2, tone: 0.8 });
  }
  s += shape("M-10 -104C-26 -96 -34 -82 -30 -68C-20 -78 -8 -84 4 -86Z", [-36, -106, 6, -66], { fill: C.mid, line: 2 });
  s += stroke("M-34 -56Q-26 -64 -16 -58Q-24 -50 -34 -56", 2.6) + `<circle cx="-25" cy="-57" r="3.6" fill="${C.ink}"/>`;
  s += stroke("M-68 -16Q-62 -22 -58 -14", 3) + stroke("M-64 -2Q-52 0 -44 -8", 2.4) + stroke("M-14 -30Q-4 -4 -8 24M2 -44Q14 -14 12 26", 1.6);
  s += stroke("M-58 -32L-30 -18M-44 -60L-18 -38", 3, C.ink) + stroke("M-58 -32L-30 -18M-44 -60L-18 -38", 1.2, C.hi);
  return s;
}

function bottle() {
  return (
    `<ellipse cx="14" cy="4" rx="34" ry="10" fill="${C.ink}" opacity="0.6"/>` +
    shape("M-22 0C-25 -24 -25 -54 -20 -66C-12 -74 12 -74 20 -66C25 -54 25 -24 22 0Q0 9 -22 0Z", [-26, -74, 26, 8], { fill: C.light }) +
    shape("M-23 -18Q0 -8 23 -18L24 -44Q0 -34 -24 -44Z", [-26, -46, 26, -8], { fill: C.mid, line: 2 }) +
    `<path d="${poly([0, -40], [8, -28], [0, -16], [-8, -28])}" fill="${C.hi}" stroke="${C.ink}" stroke-width="1.8"/>` +
    shape("M-13 -70Q0 -64 13 -70L12 -82Q0 -77 -12 -82Z", [-14, -84, 14, -62], { fill: C.mid, line: 2 }) +
    shape("M-5 -80Q0 -78 5 -80L4 -92Q0 -94 -4 -92Z", [-6, -94, 6, -78], { fill: C.hi, line: 2 })
  );
}

function stopwatch() {
  let s = `<ellipse cx="10" cy="12" rx="66" ry="62" fill="${C.ink}" opacity="0.6"/>`;
  s += shape("M-9 -76H9V-56H-9Z", [-10, -78, 10, -54], { fill: C.mid, line: 2.4 }) + stroke(ell(0, -88, 15, 12), 9) + stroke(ell(0, -88, 15, 12), 4.6, C.light);
  s += g("rotate(38)", shape("M-6 -78H6V-58H-6Z", [-8, -80, 8, -56], { fill: C.light, line: 2.4 })) + g("rotate(-38)", shape("M-5 -74H5V-58H-5Z", [-7, -76, 7, -56], { fill: C.mid, line: 2.2 }));
  s += shape(ell(0, 0, 63, 61), [-64, -62, 64, 62], { fill: C.mid }) + shape(ell(0, 0, 54, 52), [-55, -53, 55, 53], { fill: C.light, line: 2 }) + shape(ell(0, 0, 47, 45), [-48, -46, 48, 46], { fill: C.paper, tone: 0.3, line: 2.2 });
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, r = i % 15 === 0 ? 31 : i % 5 === 0 ? 36 : 40;
    s += stroke(`M${f(Math.cos(a) * r)} ${f(Math.sin(a) * r * 0.96)}L${f(Math.cos(a) * 43)} ${f(Math.sin(a) * 43 * 0.96)}`, i % 5 ? 1.1 : 2.6);
  }
  return s + `<circle cx="0" cy="18" r="10" fill="none" stroke="${C.ink}" stroke-width="1.6"/>` + stroke("M0 18L5 12", 1.8) + stroke("M0 0L21 -25", 3.2) + stroke("M0 0L-6 22", 2.2) + `<circle r="4.4" fill="${C.ink}"/><circle r="1.5" fill="${C.hi}"/>`;
}

function medal() {
  let s = `<ellipse cx="14" cy="32" rx="60" ry="52" fill="${C.ink}" opacity="0.6"/>`;
  s += shape("M-74 -118L-44 -128L6 -34L-16 -24Z", [-80, -130, 10, -20], { fill: C.mid, hatch: [[62, 22, C.hi, 2.2, 0.05]] });
  s += shape("M52 -132L84 -120L22 -22L-2 -32Z", [-4, -134, 86, -20], { fill: C.light, hatch: [[122, 22, C.hi, 2.2, 0.05]] });
  s += shape("M-16 -36H24V-22H-16Z", [-18, -38, 26, -20], { fill: C.hi, line: 2.2 });
  s += shape(ell(4, 20, 58, 52), [-58, -36, 66, 76], { fill: C.light }) + shape(ell(4, 20, 46, 41), [-44, -22, 52, 62], { fill: C.mid, line: 2.2 });
  for (const k of [-1, 1])
    for (let i = 0; i < 7; i++) {
      const a = Math.PI / 2 + k * (0.3 + i * 0.32);
      s += `<ellipse cx="${f(4 + Math.cos(a) * 36)}" cy="${f(20 + Math.sin(a) * 32)}" rx="7" ry="3.2" transform="rotate(${f((a * 180) / Math.PI + k * 62)} ${f(4 + Math.cos(a) * 36)} ${f(20 + Math.sin(a) * 32)})" fill="${C.hi}" stroke="${C.ink}" stroke-width="1.2"/>`;
    }
  return s + stroke("M-8 6C-18 22 -10 36 4 37C18 36 26 22 16 6", 9) + stroke("M-8 6C-18 22 -10 36 4 37C18 36 26 22 16 6", 5, C.hi);
}

function shoe() {
  const upper = "M14 80C6 58 8 30 20 12C26 2 40 2 50 14C60 28 76 26 88 16C100 32 118 46 142 54C170 62 198 64 208 82C212 92 208 97 200 98L16 98C12 92 13 86 14 80Z";
  let s = `<ellipse cx="116" cy="118" rx="118" ry="15" fill="${C.ink}" opacity="0.65"/>`;
  // Tongue and inside of the collar, behind the upper.
  s += shape("M20 12C22 -2 36 -8 50 -6C66 -14 84 -12 92 0C96 8 94 14 88 18C76 30 60 28 50 14C40 2 26 2 20 12Z", [16, -16, 98, 30], { fill: C.ground, tone: 0.8, line: 2.4 });
  s += shape("M56 0C64 -16 86 -20 96 -8L92 18L64 24Z", [54, -22, 98, 26], { fill: C.mid, line: 2.4 });
  s += shape(upper, [6, 0, 212, 100], { fill: C.light, line: 3 });
  s += shape("M168 62C190 66 204 72 208 84C211 93 207 97 200 98H160C150 88 154 70 168 62Z", [150, 60, 212, 100], { fill: C.mid, line: 2.2 });
  s += shape("M14 80C8 60 9 36 18 20C28 30 34 62 30 98H16C12 92 13 86 14 80Z", [8, 18, 36, 100], { fill: C.mid, line: 2.2 });
  s += shape("M44 98C60 78 84 66 116 58L130 66C104 74 82 84 68 98Z", [42, 56, 132, 100], { fill: C.hi, tone: 0.5, line: 2 });
  s += shape("M82 98C94 86 112 78 140 72L154 78C132 84 116 90 108 98Z", [80, 70, 156, 100], { fill: C.hi, tone: 0.5, line: 2 });
  // Laces crossing up the front.
  for (let i = 0; i < 5; i++) {
    const x = 70 + i * 15, y = 22 + i * 8.5;
    for (const d of [`M${x} ${y - 10}L${x + 10} ${y + 16}`, `M${x + 15} ${y - 3}L${x - 5} ${y + 9}`]) s += stroke(d, 5.6) + stroke(d, 3, C.paper);
  }
  for (const d of ["M70 10C56 -20 30 -18 40 0C44 8 60 10 70 10", "M72 10C84 -22 114 -18 102 2C96 10 82 12 72 10"]) s += stroke(d, 5.4) + stroke(d, 2.8, C.paper);
  // Midsole with a groove, then the tread.
  s += shape("M8 95C60 101 150 100 210 93C221 100 219 112 208 116C150 121 62 121 18 116C5 112 3 101 8 95Z", [2, 92, 222, 122], { fill: C.paper, tone: 0.7, line: 2.8 });
  s += stroke("M10 106C70 112 150 111 216 104", 1.8);
  for (let x = 16; x < 204; x += 14) s += shape(`M${x} 116h10l-2 8h-7Z`, [x - 1, 115, x + 11, 125], { fill: C.mid, tone: 0, line: 1.8 });
  return s;
}

function horseshoe() {
  const d = "M-56 -52L-32 -60C-12 -24 -34 14 -30 26C-24 50 24 50 30 26C34 14 12 -24 32 -60L56 -52C66 -10 66 30 46 52C22 76 -22 76 -46 52C-66 30 -66 -10 -56 -52Z";
  let s = shape(d, [-66, -64, 66, 74], { fill: C.light, hatch: [[64, 6, C.ink, 1.4, 0.25]] });
  for (const [x, y] of [[-46, -22], [-49, 8], [-38, 40], [0, 56], [38, 40], [49, 8], [46, -22]]) s += `<rect x="${x - 4}" y="${y - 5}" width="8" height="10" rx="2" fill="${C.ink}"/>`;
  return s;
}

function cone() {
  return (
    shape("M-40 0Q0 16 40 0L44 12Q0 30 -44 12Z", [-46, -2, 46, 28], { fill: C.mid, hatch: [[0, 5, C.ink, 1.4]], line: 2.6 }) +
    shape("M-27 4L-8 -82Q0 -88 8 -82L27 4Q0 14 -27 4Z", [-30, -90, 30, 14], { fill: C.light, hatch: [[84, 6, C.ink, 1.3, 0.2]], line: 3 }) +
    shape("M-21 -24Q0 -15 21 -24L16 -46Q0 -38 -16 -46Z", [-24, -48, 24, -14], { fill: C.hi, line: 2.4 })
  );
}

/** The course map in the middle, like the board on a table. */
function board() {
  const out = poly([628, 452], [972, 452], [1046, 702], [554, 702]);
  let s = `<path d="${poly([548, 712], [1064, 712], [1064, 744], [548, 744])}" fill="${C.ink}" opacity="0.6"/>` + shape(poly([554, 702], [1046, 702], [1046, 726], [554, 726]), [554, 700, 1046, 728], { fill: C.mid, hatch: [[0, 5, C.ink, 1.6]] });
  s += shape(out, [554, 452, 1046, 702], { fill: C.mid, hatch: [[0, 9, C.ink, 1, 0.5]] });
  const inn = [[656, 478], [944, 478], [1000, 676], [600, 676]];
  s += shape(poly(...inn), [600, 478, 1000, 676], { fill: C.dark, hatch: [[3, 5, C.thread, 0.9, 0.5]], tone: 0, line: 3 });
  // Parks and a lake on the map.
  for (const [x, y, rx, ry] of [[706, 620, 34, 18], [884, 540, 30, 15], [736, 516, 24, 10]]) s += shape(ell(x, y, rx, ry), [x - rx, y - ry, x + rx, y + ry], { fill: C.mid, tone: 0.7, line: 2 });
  // Streets, drawn in the board's own perspective.
  const at = (u, v) => {
    const l = [656 + (600 - 656) * v, 478 + 198 * v], r = [944 + (1000 - 944) * v, 478 + 198 * v];
    return [l[0] + (r[0] - l[0]) * u, l[1]];
  };
  for (const u of [0.2, 0.4, 0.6, 0.8]) s += stroke(`M${at(u, 0).map(f).join(" ")}L${at(u, 1).map(f).join(" ")}`, 2, C.light);
  for (const v of [0.25, 0.5, 0.75]) s += stroke(`M${at(0, v).map(f).join(" ")}L${at(1, v).map(f).join(" ")}`, 2, C.light);
  const route = [[0.06, 0.86], [0.2, 0.75], [0.2, 0.5], [0.4, 0.25], [0.6, 0.25], [0.6, 0.6], [0.8, 0.75], [0.8, 0.25], [0.94, 0.12]].map((p) => at(...p));
  let d = `M${route[0].map(f).join(" ")}`;
  for (let i = 1; i < route.length - 1; i++) d += `Q${route[i].map(f).join(" ")} ${f((route[i][0] + route[i + 1][0]) / 2)} ${f((route[i][1] + route[i + 1][1]) / 2)}`;
  d += `L${route.at(-1).map(f).join(" ")}`;
  s += stroke(d, 9) + `<path d="${d}" fill="none" stroke="${C.hi}" stroke-width="4.6" stroke-dasharray="13 9" stroke-linecap="round"/>`;
  // Border: diamonds along every side, a rosette in each corner.
  const border = (a, b, n) => {
    for (let i = 1; i < n; i++) {
      const x = a[0] + ((b[0] - a[0]) * i) / n, y = a[1] + ((b[1] - a[1]) * i) / n;
      s += `<path d="${poly([x, y - 7], [x + 6, y], [x, y + 7], [x - 6, y])}" fill="${i % 2 ? C.hi : C.light}" stroke="${C.ink}" stroke-width="1.6"/>`;
    }
  };
  border([640, 465], [960, 465], 16);
  border([576, 690], [1024, 690], 20);
  border([641, 466], [577, 689], 11);
  border([959, 466], [1023, 689], 11);
  for (const [x, y, k] of [[641, 466, 11], [959, 466, 11], [577, 689, 14], [1023, 689, 14]])
    s += `<circle cx="${x}" cy="${y}" r="${k}" fill="${C.light}" stroke="${C.ink}" stroke-width="2.4"/><circle cx="${x}" cy="${y}" r="${k * 0.45}" fill="${C.dark}"/>`;
  const pin = (x, y, k = 1) =>
    g(`translate(${x} ${y}) scale(${k})`, `<ellipse cx="0" cy="2" rx="13" ry="5" fill="${C.ink}" opacity="0.6"/>`, shape("M0 0C-9 -22 -24 -32 -24 -52A24 24 0 0 1 24 -52C24 -32 9 -22 0 0Z", [-26, -78, 26, 2], { fill: C.light, hatch: [[70, 5.5, C.ink, 1.3, 0.2]] }), `<circle cx="0" cy="-52" r="10" fill="${C.dark}" stroke="${C.ink}" stroke-width="2"/>`);
  const [a, b, c, e] = [at(0.06, 0.86), at(0.4, 0.28), at(0.62, 0.62), at(0.94, 0.14)];
  return s + pin(b[0], b[1], 0.78) + pin(e[0], e[1], 0.74) + pin(c[0], c[1], 0.92) + pin(a[0] + 8, a[1], 1.02);
}

function scene() {
  const cx = 800, cy = 780;
  let s = "";
  // Hurdles behind the track.
  s += g("translate(800 236) scale(0.9)", hurdle());
  s += g("translate(410 306) rotate(-13) scale(0.94)", hurdle());
  s += g("translate(1190 306) rotate(13) scale(0.94)", hurdle());

  // The track: six lanes round a mown infield.
  s += `<path d="${ell(cx, cy, 724, 466)}" fill="${C.ink}"/><path d="${ell(cx, cy, 719, 462)}" fill="${C.mid}"/><path d="${ell(cx, cy, 710, 454)}" fill="${C.ink}"/>`;
  s += shape(ell(cx, cy, 704, 449), [96, 331, 1504, 1229], { fill: C.ground, tone: 0, line: 3 });
  let dots = "";
  for (let n = 0; n < 5200; n++) {
    const a = rand() * Math.PI * 2, k = 0.872 + rand() * 0.124;
    dots += `M${f(cx + Math.cos(a) * 704 * k)} ${f(cy + Math.sin(a) * 449 * k)}h${f(1 + rand() * 3)}`;
  }
  s += stroke(dots, 1.1, C.thread);
  for (let i = 1; i <= 5; i++) s += `<path d="${ell(cx, cy, 704 - i * 15, 449 - i * 11)}" fill="none" stroke="${C.light}" stroke-width="2"/>`;
  const IX = 612, IY = 382;
  s += shape(ell(cx, cy, IX, IY), [cx - IX, cy - IY, cx + IX, cy + IY], { fill: C.dark, tone: 0, line: 4 });
  s += `<path d="${ell(cx, cy, IX + 5, IY + 4)}" fill="none" stroke="${C.hi}" stroke-width="2.4"/>`;
  // Grass: short tufts, thicker in every other mown band.
  let thin = "", thick = "";
  for (let n = 0; n < 5400; n++) {
    const a = rand() * Math.PI * 2, k = Math.sqrt(rand()) * 0.985;
    const x = cx + Math.cos(a) * IX * k, y = cy + Math.sin(a) * IY * k;
    if (y > H + 10) continue;
    const size = 4 + ((y - 380) / 620) * 7, d = `M${f(x)} ${f(y)}q${f((rand() - 0.5) * 5)} ${f(-size * 0.6)} ${f((rand() - 0.5) * 7)} ${f(-size)}`;
    if (Math.floor((y - 380) / 46) % 2) thick += d + `M${f(x + 3)} ${f(y)}q2 ${f(-size * 0.5)} ${f(3 + rand() * 3)} ${f(-size * 0.8)}`;
    else thin += d;
  }
  s += stroke(thin, 1.1, C.thread) + stroke(thick, 1.4, C.thread);
  // Start line, with lane numbers.
  s += stroke("M640 344L668 408", 5, C.hi);
  [1, 2, 3, 4, 5].forEach((n, i) => (s += g(`translate(${f(684 + i * 3.2)} ${f(351 + i * 12.2)}) scale(1 0.72)`, `<text text-anchor="middle" y="5" font-family="Georgia, serif" font-weight="700" font-size="13" fill="${C.hi}">${6 - n}</text>`)));

  s += board();
  s += g("translate(462 462) rotate(-9) skewX(-16) scale(0.84 0.6)", bibs(4, "21"));
  s += g("translate(1030 444) rotate(6) skewX(8) scale(0.9 0.72)", sheet(176, 138, "Splits", 5));
  s += g("translate(1252 512) rotate(137) scale(0.86)", pencil(150));
  s += g("translate(366 586) scale(0.94)", cup());
  s += g("translate(1270 640) scale(0.94)", cup());
  s += g("translate(448 664) scale(0.78)", bottle());
  s += g("translate(304 694) rotate(-15) skewX(14) scale(1.02 0.8)", sheet(206, 206, "Results", 8));
  s += g("translate(392 896) rotate(15) scale(1)", pencil(170));
  s += g("translate(1142 664) scale(0.82 0.72)", stopwatch());
  s += g("translate(1084 776) rotate(9) skewX(-12) scale(1.02 0.74)", bibs(4, "42"));
  s += g("translate(566 796) rotate(-5) scale(0.86 0.84)", shoe());
  s += g("translate(706 846) rotate(4) scale(0.94 0.92)", shoe());
  s += g("translate(556 636) rotate(-14) scale(0.56 0.44)", horseshoe());
  s += g("translate(1026 934) scale(0.8 0.66)", medal());
  s += g("translate(902 800) scale(0.84)", stallion());
  s += g("translate(1424 700) scale(0.72)", cone());
  s += g("translate(180 700) scale(0.72)", cone());

  // Hurdles in front, half out of the picture.
  s += g("translate(186 858) rotate(-15) scale(1.14)", hurdle());
  s += g("translate(1414 858) rotate(15) scale(1.14)", hurdle());
  return s;
}

mkdirSync("public/footer", { recursive: true });
for (const [name, palette] of Object.entries(PALETTES)) {
  C = palette;
  seed = 7;
  clipId = 0;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="2000" height="1250"><defs><linearGradient id="toDark" x1="0.12" y1="0" x2="0.95" y2="1"><stop offset="0.3" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><linearGradient id="toLight" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="0.42" stop-color="#000"/></linearGradient></defs>${scene()}</svg>`;
  const info = await sharp(Buffer.from(svg)).webp({ quality: 74, alphaQuality: 88, effort: 6 }).toFile(`public/footer/track-${name}.webp`);
  console.log(name, `${info.width}x${info.height}`, `${info.size >> 10}KB`);
}
