import * as THREE from "three";

/**
 * Hand-built 3D race pieces in a flat, cartoon ("toon") style with dark ink
 * outlines, to sit beside the illustrated stallion. Each builder returns a
 * group roughly one unit across, centred on the origin, front face toward +z.
 */

const INK = 0x4a2a0e;
const CREAM = 0xf3dfb5;
const GOLD = 0xd9a441;
const GOLD_DEEP = 0xb07a1e;
const NAVY = 0x08335d;
const IVORY = 0xfbf7ee;

let gradient: THREE.DataTexture | null = null;
/** Three hard bands of light, the cel-shaded look. */
function toonGradient() {
  if (gradient) return gradient;
  // Deep shadow, mid tone, lit face and a bright highlight band, like the painted figure.
  const data = new Uint8Array([70, 70, 70, 255, 150, 150, 150, 255, 220, 220, 220, 255, 255, 255, 255, 255]);
  gradient = new THREE.DataTexture(data, 4, 1, THREE.RGBAFormat);
  gradient.minFilter = THREE.NearestFilter;
  gradient.magFilter = THREE.NearestFilter;
  gradient.needsUpdate = true;
  return gradient;
}

function toon(color: number, map?: THREE.Texture) {
  return new THREE.MeshToonMaterial({
    color: map ? 0xffffff : color,
    map,
    gradientMap: toonGradient(),
    transparent: !!map,
    alphaTest: map ? 0.5 : 0,
  });
}

const inkMaterial = new THREE.MeshBasicMaterial({ color: INK, side: THREE.BackSide });

/** A mesh plus a slightly larger back-facing copy behind it, which reads as an ink outline. */
function inked(geometry: THREE.BufferGeometry, material: THREE.Material, outline = 0.045) {
  const g = new THREE.Group();
  const mesh = new THREE.Mesh(geometry, material);
  const hull = new THREE.Mesh(geometry, inkMaterial);
  hull.scale.setScalar(1 + outline);
  g.add(hull, mesh);
  return g;
}

/** A face decal drawn on a 2D canvas: transparent outside the drawing so it clips to the piece. */
function decal(draw: (c: CanvasRenderingContext2D, s: number) => void, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const c = canvas.getContext("2d")!;
  draw(c, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const hex = (n: number) => `#${n.toString(16).padStart(6, "0")}`;

function diamond(c: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  c.beginPath();
  c.moveTo(x, y - r);
  c.lineTo(x + r * 0.72, y);
  c.lineTo(x, y + r);
  c.lineTo(x - r * 0.72, y);
  c.closePath();
  c.fillStyle = fill;
  c.fill();
}

function roundRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

function roundedShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

/** A thin slab with picture faces on both sides: cards and race bibs. */
function slab(w: number, h: number, depth: number, front: THREE.Texture, back: THREE.Texture, edge: number) {
  const g = new THREE.Group();
  const geo = new THREE.ExtrudeGeometry(roundedShape(w, h, Math.min(w, h) * 0.09), {
    depth,
    bevelEnabled: false,
  });
  geo.translate(0, 0, -depth / 2);
  g.add(inked(geo, toon(edge), 0.03));
  const faceGeo = new THREE.PlaneGeometry(w, h);
  const f = new THREE.Mesh(faceGeo, toon(0, front));
  f.position.z = depth / 2 + 0.002;
  const b = new THREE.Mesh(faceGeo, toon(0, back));
  b.position.z = -depth / 2 - 0.002;
  b.rotation.y = Math.PI;
  g.add(f, b);
  return g;
}

/** A round disc with picture faces: coins, medals, the stopwatch body. */
function disc(radius: number, depth: number, rim: number, front: THREE.Texture, back: THREE.Texture) {
  const g = new THREE.Group();
  const geo = new THREE.CylinderGeometry(radius, radius, depth, 48);
  geo.rotateX(Math.PI / 2);
  g.add(inked(geo, toon(rim), 0.04));
  const faceGeo = new THREE.CircleGeometry(radius * 0.97, 48);
  const f = new THREE.Mesh(faceGeo, toon(0, front));
  f.position.z = depth / 2 + 0.002;
  const b = new THREE.Mesh(faceGeo, toon(0, back));
  b.position.z = -depth / 2 - 0.002;
  b.rotation.y = Math.PI;
  g.add(f, b);
  return g;
}

/* ---------- Face artwork ---------- */

const cardFront = () =>
  decal((c, s) => {
    roundRect(c, 4, 4, s - 8, s - 8, s * 0.09);
    c.fillStyle = hex(IVORY);
    c.fill();
    c.lineWidth = s * 0.02;
    c.strokeStyle = hex(GOLD);
    roundRect(c, s * 0.08, s * 0.08, s * 0.84, s * 0.84, s * 0.05);
    c.stroke();
    diamond(c, s / 2, s / 2, s * 0.16, hex(GOLD));
    diamond(c, s * 0.18, s * 0.17, s * 0.045, hex(GOLD_DEEP));
    diamond(c, s * 0.82, s * 0.83, s * 0.045, hex(GOLD_DEEP));
  });

const cardBack = () =>
  decal((c, s) => {
    roundRect(c, 4, 4, s - 8, s - 8, s * 0.09);
    c.fillStyle = hex(NAVY);
    c.fill();
    c.lineWidth = s * 0.018;
    c.strokeStyle = hex(GOLD);
    roundRect(c, s * 0.08, s * 0.08, s * 0.84, s * 0.84, s * 0.05);
    c.stroke();
    c.globalAlpha = 0.35;
    for (let y = 0.2; y < 0.85; y += 0.13) for (let x = 0.2; x < 0.85; x += 0.15) diamond(c, s * x, s * y, s * 0.025, hex(GOLD));
    c.globalAlpha = 1;
    diamond(c, s / 2, s / 2, s * 0.12, hex(GOLD));
  });

const bibFront = () =>
  decal((c, s) => {
    roundRect(c, 4, 4, s - 8, s - 8, s * 0.07);
    c.fillStyle = hex(IVORY);
    c.fill();
    c.fillStyle = hex(GOLD);
    c.fillRect(4, s * 0.06, s - 8, s * 0.17);
    c.fillStyle = hex(NAVY);
    c.font = `600 ${s * 0.08}px Georgia, serif`;
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("STALLION", s / 2, s * 0.145);
    c.font = `700 ${s * 0.3}px Georgia, serif`;
    c.fillText("2027", s / 2, s * 0.56);
    for (const [x, y] of [
      [0.08, 0.3],
      [0.92, 0.3],
      [0.08, 0.9],
      [0.92, 0.9],
    ]) {
      c.beginPath();
      c.arc(s * x, s * y, s * 0.025, 0, Math.PI * 2);
      c.fill();
    }
  });

const bibBack = () =>
  decal((c, s) => {
    roundRect(c, 4, 4, s - 8, s - 8, s * 0.07);
    c.fillStyle = hex(IVORY);
    c.fill();
    c.lineWidth = s * 0.014;
    c.strokeStyle = hex(GOLD);
    roundRect(c, s * 0.07, s * 0.07, s * 0.86, s * 0.86, s * 0.04);
    c.stroke();
    diamond(c, s / 2, s / 2, s * 0.08, hex(GOLD));
  });

/** Round face: gold field, ring, and a centre motif. */
const roundFace = (motif: (c: CanvasRenderingContext2D, s: number) => void, field = GOLD) =>
  decal((c, s) => {
    c.beginPath();
    c.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2);
    c.fillStyle = hex(field);
    c.fill();
    c.lineWidth = s * 0.03;
    c.strokeStyle = hex(GOLD_DEEP);
    c.beginPath();
    c.arc(s / 2, s / 2, s * 0.4, 0, Math.PI * 2);
    c.stroke();
    motif(c, s);
  });

const horseshoeMotif = (c: CanvasRenderingContext2D, s: number) => {
  c.lineWidth = s * 0.07;
  c.lineCap = "round";
  c.strokeStyle = hex(GOLD_DEEP);
  c.beginPath();
  c.arc(s / 2, s * 0.47, s * 0.17, Math.PI * 0.85, Math.PI * 2.15);
  c.stroke();
};

const numeralMotif = (text: string, color = GOLD_DEEP) => (c: CanvasRenderingContext2D, s: number) => {
  c.fillStyle = hex(color);
  c.font = `700 ${s * 0.36}px Georgia, serif`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  c.fillText(text, s / 2, s * 0.52);
};

const dialFace = () =>
  decal((c, s) => {
    c.beginPath();
    c.arc(s / 2, s / 2, s / 2 - 2, 0, Math.PI * 2);
    c.fillStyle = hex(IVORY);
    c.fill();
    c.strokeStyle = hex(NAVY);
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const long = i % 5 === 0;
      c.lineWidth = long ? s * 0.014 : s * 0.006;
      const r1 = s * (long ? 0.36 : 0.4);
      c.beginPath();
      c.moveTo(s / 2 + Math.cos(a) * r1, s / 2 + Math.sin(a) * r1);
      c.lineTo(s / 2 + Math.cos(a) * s * 0.44, s / 2 + Math.sin(a) * s * 0.44);
      c.stroke();
    }
    c.lineCap = "round";
    c.lineWidth = s * 0.02;
    c.beginPath();
    c.moveTo(s / 2, s / 2);
    c.lineTo(s / 2 + s * 0.22, s / 2 - s * 0.16);
    c.stroke();
    c.strokeStyle = hex(GOLD_DEEP);
    c.lineWidth = s * 0.012;
    c.beginPath();
    c.moveTo(s / 2, s / 2 + s * 0.06);
    c.lineTo(s / 2, s / 2 - s * 0.33);
    c.stroke();
    c.fillStyle = hex(NAVY);
    c.beginPath();
    c.arc(s / 2, s / 2, s * 0.03, 0, Math.PI * 2);
    c.fill();
  });

/* ---------- Pieces ---------- */

export type PieceKind = "medal" | "coin" | "horseshoe" | "stopwatch" | "bib" | "card" | "trophy";

export function buildPiece(kind: PieceKind): THREE.Group {
  const g = new THREE.Group();
  switch (kind) {
    case "card": {
      g.add(slab(0.7, 1, 0.025, cardFront(), cardBack(), IVORY));
      break;
    }
    case "bib": {
      g.add(slab(1, 0.82, 0.02, bibFront(), bibBack(), IVORY));
      break;
    }
    case "coin": {
      g.add(disc(0.5, 0.09, GOLD_DEEP, roundFace(horseshoeMotif), roundFace(numeralMotif("I"))));
      break;
    }
    case "medal": {
      const body = disc(0.4, 0.08, GOLD_DEEP, roundFace(numeralMotif("SM")), roundFace(numeralMotif("2027")));
      body.position.y = -0.18;
      const rim = inked(new THREE.TorusGeometry(0.4, 0.035, 10, 48), toon(GOLD), 0.06);
      rim.position.y = -0.18;
      // Ribbon: two crossed straps, navy and gold.
      const strapGeo = new THREE.BoxGeometry(0.16, 0.5, 0.02);
      const left = inked(strapGeo, toon(NAVY), 0.06);
      left.position.set(-0.1, 0.32, -0.02);
      left.rotation.z = -0.32;
      const right = inked(strapGeo, toon(GOLD), 0.06);
      right.position.set(0.1, 0.32, -0.03);
      right.rotation.z = 0.32;
      g.add(left, right, body, rim);
      break;
    }
    case "horseshoe": {
      const geo = new THREE.TorusGeometry(0.36, 0.11, 14, 40, Math.PI * 1.45);
      // The arc's gap starts at 1.725π; turn it to the top so it opens upward, a lucky horseshoe.
      geo.rotateZ(Math.PI / 2 - Math.PI * 1.725);
      geo.scale(1, 1, 0.55);
      const shoe = inked(geo, toon(GOLD), 0.05);
      g.add(shoe);
      // Nail holes as small dark studs on the front.
      const studGeo = new THREE.CircleGeometry(0.022, 10);
      const studMat = new THREE.MeshBasicMaterial({ color: INK });
      for (let i = 0; i < 6; i++) {
        const a = Math.PI * (0.05 + (i / 5) * 0.9) + Math.PI;
        const stud = new THREE.Mesh(studGeo, studMat);
        stud.position.set(Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0.065);
        g.add(stud);
      }
      break;
    }
    case "stopwatch": {
      const body = disc(0.42, 0.16, GOLD, dialFace(), roundFace(numeralMotif("I", GOLD_DEEP), CREAM));
      const ring = inked(new THREE.TorusGeometry(0.42, 0.045, 10, 48), toon(GOLD_DEEP), 0.05);
      const stemGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.14, 16);
      const stem = inked(stemGeo, toon(GOLD_DEEP), 0.08);
      stem.position.y = 0.5;
      const crownGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.07, 20);
      const crown = inked(crownGeo, toon(GOLD), 0.08);
      crown.position.y = 0.6;
      const loopGeo = new THREE.TorusGeometry(0.09, 0.025, 8, 24);
      const loop = inked(loopGeo, toon(GOLD_DEEP), 0.1);
      loop.position.y = 0.72;
      const btn = inked(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12), toon(GOLD_DEEP), 0.1);
      btn.position.set(0.3, 0.33, 0);
      btn.rotation.z = -0.8;
      g.add(body, ring, stem, crown, loop, btn);
      g.position.y = -0.12;
      break;
    }
    case "trophy": {
      // Cup turned on a lathe, like a chess piece.
      const profile = [
        [0.0, -0.5],
        [0.3, -0.5],
        [0.3, -0.44],
        [0.2, -0.4],
        [0.08, -0.3],
        [0.06, -0.1],
        [0.1, -0.02],
        [0.3, 0.06],
        [0.36, 0.3],
        [0.36, 0.48],
        [0.32, 0.48],
        [0.3, 0.3],
        [0.0, 0.2],
      ].map(([x, y]) => new THREE.Vector2(x, y));
      const cupGeo = new THREE.LatheGeometry(profile, 40);
      const cup = inked(cupGeo, toon(GOLD), 0.04);
      const handleGeo = new THREE.TorusGeometry(0.13, 0.035, 8, 24, Math.PI * 1.2);
      const h1 = inked(handleGeo, toon(GOLD_DEEP), 0.08);
      h1.position.set(-0.38, 0.28, 0);
      h1.rotation.z = Math.PI * 0.4;
      const h2 = inked(handleGeo, toon(GOLD_DEEP), 0.08);
      h2.position.set(0.38, 0.28, 0);
      h2.rotation.z = -Math.PI * 1.4 + Math.PI;
      h2.rotation.y = Math.PI;
      const plate = inked(new THREE.BoxGeometry(0.36, 0.12, 0.02), toon(NAVY), 0.06);
      plate.position.set(0, -0.42, 0.24);
      g.add(cup, h1, h2, plate);
      break;
    }
  }
  return g;
}

export function disposeTree(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | THREE.Material[] | undefined;
    const list = Array.isArray(mat) ? mat : mat ? [mat] : [];
    for (const x of list) {
      const map = (x as THREE.MeshToonMaterial).map;
      if (map) map.dispose();
      if (x !== inkMaterial) x.dispose();
    }
  });
}
