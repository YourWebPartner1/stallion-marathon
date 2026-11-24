import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { mergeVertices, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Hand-built 3D race pieces in a painted, cel-shaded style with brown ink
 * outlines, to sit beside the illustrated stallion. Each builder returns a
 * group roughly one unit tall, centred on the origin, front face toward +z.
 */

const INK = "#54240c";

type Paint = { light: string; mid: string; shade: string; shine: string };
const CREAM: Paint = { light: "#fcf0cc", mid: "#f0cc84", shade: "#b4783c", shine: "#ffffff" };
const GOLD: Paint = { light: "#f0c078", mid: "#cc9030", shade: "#904818", shine: "#fff3d8" };
const AMBER: Paint = { light: "#fcd08a", mid: "#ea9f33", shade: "#a8621c", shine: "#fff3d8" };
const NAVY: Paint = { light: "#1f5c92", mid: "#0f4474", shade: "#082a4d", shine: "#8fb7d9" };
const IVORY: Paint = { light: "#ffffff", mid: "#f0d8a8", shade: "#b49060", shine: "#ffffff" };

/** Outline thickness in world units (the hero maps one unit to one CSS pixel). Set on resize. */
export const outlineWidth = { value: 3 };

/* ---------- Materials ---------- */

const VERTEX = /* glsl */ `
  varying vec3 vN;
  varying vec3 vP;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vN = normalize(normalMatrix * normal);
    vec4 p = modelViewMatrix * vec4(position, 1.0);
    vP = p.xyz;
    gl_Position = projectionMatrix * p;
  }`;

// Three flat paint bands and a small highlight, with edges softened by about a pixel.
const FRAGMENT = /* glsl */ `
  uniform vec3 uLight, uMid, uShade, uShine;
  uniform float uGloss;
  #ifdef USE_FACE
    uniform sampler2D uMap;
  #endif
  varying vec3 vN;
  varying vec3 vP;
  varying vec2 vUv;
  const vec3 L = vec3(-0.62, 0.5, 0.42);
  float band(float e, float x) { float w = max(fwidth(x), 0.012); return smoothstep(e - w, e + w, x); }
  void main() {
    vec3 n = normalize(vN);
    float d = dot(n, normalize(L));
    float lit = band(0.44, d);
    float body = band(-0.18, d);
    vec3 col;
    #ifdef USE_FACE
      vec4 face = texture2D(uMap, vUv);
      if (face.a < 0.02) discard;
      col = face.rgb * mix(vec3(0.5, 0.31, 0.12), mix(vec3(0.93, 0.82, 0.62), vec3(1.0), lit), body);
      gl_FragColor = vec4(col, face.a);
    #else
      col = mix(mix(uShade, uMid, body), uLight, lit);
      float s = pow(max(dot(n, normalize(normalize(L) + normalize(-vP))), 0.0), 70.0);
      col = mix(col, uShine, band(0.55, s) * uGloss);
      gl_FragColor = vec4(col, 1.0);
    #endif
    #include <colorspace_fragment>
  }`;

function painted(p: Paint, gloss = 1) {
  return new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uLight: { value: new THREE.Color(p.light) },
      uMid: { value: new THREE.Color(p.mid) },
      uShade: { value: new THREE.Color(p.shade) },
      uShine: { value: new THREE.Color(p.shine) },
      uGloss: { value: gloss },
    },
  });
}

function faceMaterial(map: THREE.Texture) {
  return new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    defines: { USE_FACE: "" },
    uniforms: { uMap: { value: map } },
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
    polygonOffsetUnits: -2,
  });
}

// The outline is the same shape pushed outward along its normals, seen from inside.
const inkMaterial = new THREE.ShaderMaterial({
  vertexShader: /* glsl */ `
    uniform float uWidth;
    void main() {
      vec4 p = modelViewMatrix * vec4(position, 1.0);
      p.xyz += normalize(normalMatrix * normal) * uWidth;
      gl_Position = projectionMatrix * p;
    }`,
  fragmentShader: /* glsl */ `
    uniform vec3 uInk;
    void main() {
      gl_FragColor = vec4(uInk, 1.0);
      #include <colorspace_fragment>
    }`,
  uniforms: { uWidth: outlineWidth, uInk: { value: new THREE.Color(INK) } },
  side: THREE.BackSide,
});

/** A painted mesh with an even ink outline. */
function inked(geometry: THREE.BufferGeometry, paint: Paint, gloss = 1) {
  // Shared vertices give the outline smooth normals, so it never splits at hard corners.
  const bare = geometry.clone();
  bare.deleteAttribute("uv");
  bare.deleteAttribute("normal");
  const hullGeometry = mergeVertices(bare, 1e-4);
  hullGeometry.computeVertexNormals();
  const g = new THREE.Group();
  g.add(new THREE.Mesh(hullGeometry, inkMaterial), new THREE.Mesh(geometry, painted(paint, gloss)));
  return g;
}

/* ---------- Shapes ---------- */

function roundedShape(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
  s.lineTo(x + w, y + h - r);
  s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
  s.lineTo(x + r, y + h);
  s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(x, y + r);
  s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

function extruded(shape: THREE.Shape, depth: number, bevel = 0.012) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: depth - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelOffset: -bevel,
    bevelSegments: 2,
    curveSegments: 28,
  });
  geo.translate(0, 0, -(depth - bevel * 2) / 2);
  // Round along the curve, crisp at the real edges.
  return toCreasedNormals(geo, 0.5);
}

/** Picture on the front (+z) and back (-z) of a flat piece. */
function faces(w: number, h: number, depth: number, front: THREE.Texture, back: THREE.Texture) {
  const g = new THREE.Group();
  const geo = new THREE.PlaneGeometry(w, h);
  const f = new THREE.Mesh(geo, faceMaterial(front));
  f.position.z = depth / 2 + 0.003;
  const b = new THREE.Mesh(geo, faceMaterial(back));
  b.position.z = -depth / 2 - 0.003;
  b.rotation.y = Math.PI;
  g.add(f, b);
  return g;
}

/** Profile spun around the y axis. Points are [radius, y], bottom to top. */
function lathe(points: [number, number][], segments = 64) {
  return new THREE.LatheGeometry(
    points.map(([x, y]) => new THREE.Vector2(x, y)),
    segments,
  );
}

/** A round disc facing +z with softly bevelled edges. */
function discGeometry(radius: number, depth: number) {
  const d = depth / 2;
  const b = Math.min(d, radius) * 0.45;
  const points: [number, number][] = [[0.0001, -d]];
  for (let i = 0; i <= 5; i++) {
    const a = (i / 5) * (Math.PI / 2);
    points.push([radius - b + Math.sin(a) * b, -d + b - Math.cos(a) * b]);
  }
  for (let i = 5; i >= 0; i--) {
    const a = (i / 5) * (Math.PI / 2);
    points.push([radius - b + Math.sin(a) * b, d - b + Math.cos(a) * b]);
  }
  points.push([0.0001, d]);
  const geo = lathe(points);
  geo.rotateX(Math.PI / 2);
  return geo;
}

/* ---------- Face artwork ---------- */

type Ctx = CanvasRenderingContext2D;
const C = { navy: "#08335d", navyDeep: "#062747", gold: "#f7b538", ochre: "#c98f2e", brown: "#94551a", ivory: "#fffaf0", cream: "#f3dcae" };

/** A picture drawn on a 2D canvas, `ratio` = width / height. */
function decal(draw: (c: Ctx, w: number, h: number) => void, ratio = 1, height = 448) {
  const canvas = document.createElement("canvas");
  canvas.height = height;
  canvas.width = Math.round(height * ratio);
  const c = canvas.getContext("2d")!;
  draw(c, canvas.width, canvas.height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function roundRect(c: Ctx, x: number, y: number, w: number, h: number, r: number) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
}

function diamond(c: Ctx, x: number, y: number, r: number, fill: string) {
  c.beginPath();
  c.moveTo(x, y - r);
  c.lineTo(x + r * 0.78, y);
  c.lineTo(x, y + r);
  c.lineTo(x - r * 0.78, y);
  c.closePath();
  c.fillStyle = fill;
  c.fill();
}

function word(c: Ctx, text: string, x: number, y: number, size: number, fill: string, font: string, spacing = 0) {
  c.font = `600 ${size}px ${font}`;
  c.letterSpacing = `${spacing}px`;
  c.textAlign = "center";
  c.textBaseline = "alphabetic";
  c.fillStyle = fill;
  const m = c.measureText(text);
  c.fillText(text, x + spacing / 2, y + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2);
}

/** Laurel branches curving up both sides of a circle. */
function laurel(c: Ctx, x: number, y: number, r: number, fill: string) {
  c.fillStyle = fill;
  for (const side of [-1, 1]) {
    for (let i = 0; i < 8; i++) {
      const a = Math.PI / 2 + side * (0.22 + i * 0.29);
      for (const out of [0.9, 1.12]) {
        c.save();
        c.translate(x + Math.cos(a) * r * out, y + Math.sin(a) * r * out);
        c.rotate(a + side * (out > 1 ? 2.1 : 1.1));
        c.beginPath();
        c.ellipse(0, 0, r * 0.16, r * 0.065, 0, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }
  }
}

function horseshoePath(c: Ctx, x: number, y: number, r: number, width: number, stroke: string) {
  c.lineWidth = width;
  c.lineCap = "butt";
  c.strokeStyle = stroke;
  c.beginPath();
  c.ellipse(x, y, r, r * 1.12, 0, -Math.PI * 0.33, Math.PI * 1.33);
  c.stroke();
}

const CARD_RATIO = 0.77;
const cardBack = (font: string) =>
  decal((c, w, h) => {
    c.fillStyle = C.navy;
    roundRect(c, 0, 0, w, h, w * 0.09);
    c.fill();
    c.save();
    roundRect(c, w * 0.11, w * 0.11, w * 0.78, h - w * 0.22, w * 0.04);
    c.clip();
    c.strokeStyle = C.gold;
    c.globalAlpha = 0.28;
    c.lineWidth = w * 0.006;
    for (let i = -h; i < w + h; i += w * 0.062) {
      c.beginPath();
      c.moveTo(i, 0);
      c.lineTo(i + h, h);
      c.moveTo(i + h, 0);
      c.lineTo(i, h);
      c.stroke();
    }
    c.restore();
    c.strokeStyle = C.gold;
    c.lineWidth = w * 0.02;
    roundRect(c, w * 0.07, w * 0.07, w * 0.86, h - w * 0.14, w * 0.05);
    c.stroke();
    c.lineWidth = w * 0.009;
    roundRect(c, w * 0.11, w * 0.11, w * 0.78, h - w * 0.22, w * 0.035);
    c.stroke();
    diamond(c, w / 2, h / 2, w * 0.27, C.gold);
    diamond(c, w / 2, h / 2, w * 0.225, C.navyDeep);
    word(c, "SM", w / 2, h / 2, w * 0.17, C.gold, font);
  }, CARD_RATIO);

const cardFront = (font: string) =>
  decal((c, w, h) => {
    c.fillStyle = C.ivory;
    roundRect(c, 0, 0, w, h, w * 0.09);
    c.fill();
    c.strokeStyle = C.ochre;
    c.lineWidth = w * 0.012;
    roundRect(c, w * 0.09, w * 0.09, w * 0.82, h - w * 0.18, w * 0.04);
    c.stroke();
    horseshoePath(c, w / 2, h * 0.49, w * 0.19, w * 0.09, C.gold);
    for (const flip of [0, 1]) {
      c.save();
      c.translate(w / 2, h / 2);
      c.rotate(flip * Math.PI);
      word(c, "I", -w * 0.29, -h * 0.36, w * 0.15, C.navy, font);
      diamond(c, -w * 0.29, -h * 0.265, w * 0.05, C.gold);
      c.restore();
    }
  }, CARD_RATIO);

const BIB_RATIO = 0.86;
const bibFront = (font: string) =>
  decal((c, w, h) => {
    c.fillStyle = "#ffffff";
    roundRect(c, 0, 0, w, h, w * 0.09);
    c.fill();
    c.save();
    roundRect(c, 0, 0, w, h, w * 0.09);
    c.clip();
    c.fillStyle = C.navy;
    c.fillRect(0, 0, w, h * 0.25);
    c.fillStyle = C.gold;
    c.fillRect(0, h * 0.25, w, h * 0.022);
    c.fillRect(0, h * 0.93, w, h * 0.07);
    c.restore();
    word(c, "STALLION", w / 2, h * 0.145, w * 0.155, "#ffffff", font, w * 0.018);
    word(c, "2027", w / 2, h * 0.5, w * 0.42, C.navy, font);
    c.strokeStyle = C.ochre;
    c.lineWidth = w * 0.006;
    for (const y of [0.66, 0.84]) {
      c.beginPath();
      c.moveTo(w * 0.2, h * y);
      c.lineTo(w * 0.44, h * y);
      c.moveTo(w * 0.56, h * y);
      c.lineTo(w * 0.8, h * y);
      c.stroke();
      diamond(c, w / 2, h * y, w * 0.03, C.gold);
    }
    word(c, "CHAPTER I", w / 2, h * 0.75, w * 0.1, C.brown, font, w * 0.03);
    pins(c, w, h);
  }, BIB_RATIO);

const bibBack = () =>
  decal((c, w, h) => {
    c.fillStyle = "#ffffff";
    roundRect(c, 0, 0, w, h, w * 0.09);
    c.fill();
    c.strokeStyle = C.ochre;
    c.lineWidth = w * 0.012;
    roundRect(c, w * 0.13, w * 0.13, w * 0.74, h - w * 0.26, w * 0.04);
    c.stroke();
    c.lineWidth = w * 0.005;
    roundRect(c, w * 0.155, w * 0.155, w * 0.69, h - w * 0.31, w * 0.03);
    c.stroke();
    horseshoePath(c, w / 2, h * 0.48, w * 0.17, w * 0.08, C.gold);
    for (const y of [0.22, 0.78]) diamond(c, w / 2, h * y, w * 0.035, C.ochre);
    pins(c, w, h);
  }, BIB_RATIO);

function pins(c: Ctx, w: number, h: number) {
  c.fillStyle = INK;
  for (const x of [0.07, 0.93])
    for (const y of [0.06, 0.94]) {
      c.beginPath();
      c.arc(w * x, h * y, w * 0.022, 0, Math.PI * 2);
      c.fill();
    }
}

const medalFace = (text: string, font: string) =>
  decal((c, w) => {
    laurel(c, w / 2, w / 2, w * 0.33, C.brown);
    word(c, text, w / 2, w * 0.49, w * (text.length > 2 ? 0.2 : 0.32), C.brown, font);
  });

const coinFront = () =>
  decal((c, w) => {
    c.strokeStyle = C.ochre;
    c.lineWidth = w * 0.02;
    c.beginPath();
    c.arc(w / 2, w / 2, w * 0.43, 0, Math.PI * 2);
    c.stroke();
    horseshoePath(c, w / 2, w * 0.47, w * 0.2, w * 0.1, C.ochre);
  });

const coinBack = (font: string) =>
  decal((c, w) => {
    c.strokeStyle = C.ochre;
    c.lineWidth = w * 0.02;
    c.beginPath();
    c.arc(w / 2, w / 2, w * 0.43, 0, Math.PI * 2);
    c.stroke();
    laurel(c, w / 2, w / 2, w * 0.31, C.ochre);
    word(c, "I", w / 2, w * 0.49, w * 0.32, C.brown, font);
  });

const tokenFace = (text: string, font: string) =>
  decal((c, w) => {
    c.strokeStyle = C.gold;
    c.lineWidth = w * 0.03;
    c.beginPath();
    c.arc(w / 2, w / 2, w * 0.42, 0, Math.PI * 2);
    c.stroke();
    word(c, text, w / 2, w * 0.5, w * 0.34, C.navy, font);
  });

/** The distances on the die, one per face. */
const DISTANCES = ["5", "8", "10", "15", "21", "42"];

const dieFace = (km: string, font: string) =>
  decal((c, w) => {
    c.strokeStyle = C.ochre;
    c.lineWidth = w * 0.012;
    roundRect(c, w * 0.05, w * 0.05, w * 0.9, w * 0.9, w * 0.06);
    c.stroke();
    for (const [x, y] of [
      [0.14, 0.14],
      [0.86, 0.14],
      [0.14, 0.86],
      [0.86, 0.86],
    ])
      diamond(c, w * x, w * y, w * 0.045, C.gold);
    word(c, km, w / 2, w * 0.44, w * 0.46, C.navy, font);
    word(c, "KM", w / 2, w * 0.77, w * 0.13, C.ochre, font, w * 0.03);
  });

/* ---------- Pieces ---------- */

export type PieceKind = "trophy" | "medal" | "token" | "coin" | "card" | "horseshoe" | "die" | "bib";

const DIE_SIDES = (
  [
    [0, 0],
    [0, -Math.PI / 2],
    [0, Math.PI],
    [0, Math.PI / 2],
    [Math.PI / 2, 0],
    [-Math.PI / 2, 0],
  ] as const
).map(([x, y]) => new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, 0)));

/** Turns that bring each die face to the top, in DISTANCES order. */
export const DIE_TURNS = DIE_SIDES.map((q) =>
  new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2).multiply(q),
);

export function buildPiece(kind: PieceKind, font: string): THREE.Group {
  const g = new THREE.Group();
  switch (kind) {
    case "card": {
      const depth = 0.03;
      g.add(inked(extruded(roundedShape(CARD_RATIO, 1, 0.07), depth, 0.008), IVORY, 0));
      g.add(faces(CARD_RATIO - 0.008, 0.992, depth, cardBack(font), cardFront(font)));
      break;
    }
    case "bib": {
      const depth = 0.024;
      g.add(inked(extruded(roundedShape(BIB_RATIO, 1, 0.08), depth, 0.008), IVORY, 0));
      g.add(faces(BIB_RATIO - 0.008, 0.992, depth, bibFront(font), bibBack()));
      break;
    }
    case "coin": {
      g.add(inked(discGeometry(0.5, 0.14), AMBER, 0.6));
      g.add(inked(discGeometry(0.43, 0.16), CREAM, 0));
      g.add(faces(0.84, 0.84, 0.16, coinFront(), coinBack(font)));
      break;
    }
    case "token": {
      // The share of profits given back, as a small ivory and gold token.
      g.add(inked(discGeometry(0.5, 0.16), AMBER));
      g.add(inked(discGeometry(0.42, 0.19), IVORY, 0));
      g.add(faces(0.8, 0.8, 0.19, tokenFace("10%", font), tokenFace("SM", font)));
      break;
    }
    case "medal": {
      const disc = new THREE.Group();
      disc.add(inked(discGeometry(0.34, 0.1), CREAM));
      disc.add(inked(discGeometry(0.275, 0.13), AMBER, 0.5));
      disc.add(faces(0.5, 0.5, 0.13, medalFace("SM", font), medalFace("2027", font)));
      disc.position.y = -0.16;
      const bar = inked(extruded(roundedShape(0.22, 0.07, 0.03), 0.1), GOLD);
      bar.position.y = 0.2;
      g.add(disc, bar);
      for (const side of [-1, 1]) {
        const strap = new THREE.Group();
        strap.add(inked(extruded(roundedShape(0.15, 0.38, 0.01), 0.03, 0.006), NAVY, 0));
        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.37, 0.036), painted(AMBER, 0));
        strap.add(stripe);
        strap.position.set(side * 0.1, 0.34, side * 0.02);
        strap.rotation.z = -side * 0.34;
        g.add(strap);
      }
      break;
    }
    case "horseshoe": {
      const a0 = Math.PI * 0.67;
      const a1 = Math.PI * 2.33;
      const ring = (outer: number, inner: number, pad = 0) => {
        const s = new THREE.Shape();
        s.absellipse(0, 0, outer, outer * 1.12, a0 + pad, a1 - pad, false, 0);
        s.absellipse(0, 0, inner, inner * 1.12, a1 - pad, a0 + pad, true, 0);
        s.closePath();
        return s;
      };
      g.add(inked(extruded(ring(0.46, 0.25), 0.17, 0.03), CREAM));
      g.add(new THREE.Mesh(extruded(ring(0.375, 0.335, 0.12), 0.19, 0.004), painted(GOLD, 0)));
      const hole = new THREE.BoxGeometry(0.03, 0.05, 0.2);
      const holeMaterial = new THREE.MeshBasicMaterial({ color: INK });
      for (let i = 0; i < 8; i++) {
        const a = a0 + 0.3 + (i / 7) * (a1 - a0 - 0.6);
        const m = new THREE.Mesh(hole, holeMaterial);
        m.position.set(Math.cos(a) * 0.355, Math.sin(a) * 0.355 * 1.12, 0);
        m.rotation.z = a;
        g.add(m);
      }
      g.position.y = 0.02;
      break;
    }
    case "die": {
      const s = 0.8;
      g.add(inked(new RoundedBoxGeometry(s, s, s, 4, 0.09), IVORY, 0));
      const geo = new THREE.PlaneGeometry(s * 0.8, s * 0.8);
      DISTANCES.forEach((km, i) => {
        const m = new THREE.Mesh(geo, faceMaterial(dieFace(km, font)));
        // A face that turn i brings to the front sits where the inverse turn puts +z.
        const q = DIE_SIDES[i].clone().invert();
        m.quaternion.copy(q);
        m.position.set(0, 0, s / 2 + 0.003).applyQuaternion(q);
        m.userData.base = q;
        g.add(m);
      });
      break;
    }
    case "trophy": {
      const ring = (radius: number, tube: number, y: number) => {
        const t = new THREE.TorusGeometry(radius, tube, 10, 56);
        t.rotateX(Math.PI / 2);
        t.translate(0, y, 0);
        return t;
      };
      // Profiles run from the bottom up; each is one turned part.
      const parts: [THREE.BufferGeometry, Paint, number][] = [
        [
          lathe([
            [0.0001, -0.5],
            [0.185, -0.5],
            [0.2, -0.492],
            [0.205, -0.475],
            [0.2, -0.458],
            [0.185, -0.45],
            [0.0001, -0.45],
          ]),
          GOLD,
          1,
        ],
        [
          lathe([
            [0.0001, -0.455],
            [0.16, -0.452],
            [0.172, -0.44],
            [0.168, -0.425],
            [0.14, -0.412],
            [0.0001, -0.408],
          ]),
          CREAM,
          0.6,
        ],
        [
          lathe([
            [0.0001, -0.412],
            [0.128, -0.41],
            [0.1, -0.392],
            [0.072, -0.36],
            [0.052, -0.31],
            [0.042, -0.25],
            [0.042, -0.205],
            [0.0001, -0.2],
          ]),
          GOLD,
          1,
        ],
        [
          lathe([
            [0.0001, -0.245],
            [0.045, -0.242],
            [0.075, -0.228],
            [0.084, -0.21],
            [0.075, -0.192],
            [0.045, -0.178],
            [0.0001, -0.175],
          ]),
          CREAM,
          0.6,
        ],
        [
          lathe([
            [0.0001, -0.186],
            [0.05, -0.183],
            [0.105, -0.16],
            [0.15, -0.118],
            [0.178, -0.06],
            [0.192, 0.01],
            [0.198, 0.09],
            [0.2, 0.17],
            [0.0001, 0.172],
          ]),
          GOLD,
          1,
        ],
        [ring(0.188, 0.011, 0.085), CREAM, 0],
        [ring(0.145, 0.011, -0.118), CREAM, 0],
        [ring(0.2, 0.022, 0.18), CREAM, 1],
        [
          lathe([
            [0.0001, 0.18],
            [0.192, 0.185],
            [0.186, 0.215],
            [0.16, 0.258],
            [0.115, 0.292],
            [0.06, 0.312],
            [0.0001, 0.316],
          ]),
          GOLD,
          1,
        ],
        [ring(0.108, 0.01, 0.292), CREAM, 0],
        [
          lathe([
            [0.0001, 0.305],
            [0.038, 0.308],
            [0.026, 0.33],
            [0.03, 0.348],
            [0.048, 0.356],
            [0.048, 0.368],
            [0.03, 0.376],
            [0.0001, 0.378],
          ]),
          CREAM,
          0.6,
        ],
      ];
      for (const [geo, paint, gloss] of parts) g.add(inked(geo, paint, gloss));
      // A little horseshoe on top, opening upward.
      const shoe = new THREE.TorusGeometry(0.052, 0.017, 10, 32, Math.PI * 1.5);
      shoe.rotateZ(Math.PI * 0.75);
      shoe.scale(1, 1.08, 0.85);
      shoe.translate(0, 0.437, 0);
      g.add(inked(shoe, CREAM, 0.6));
      for (const side of [-1, 1]) {
        const curve = new THREE.CatmullRomCurve3(
          [
            [0.188, 0.12],
            [0.235, 0.168],
            [0.292, 0.15],
            [0.302, 0.075],
            [0.262, 0.005],
            [0.21, -0.045],
            [0.168, -0.085],
          ].map(([x, y]) => new THREE.Vector3(side * x, y, 0)),
        );
        g.add(inked(new THREE.TubeGeometry(curve, 32, 0.021, 10), CREAM, 0.6));
      }
      // A badge on both sides, so one is always coming round.
      for (const side of [0, 1]) {
        const holder = new THREE.Group();
        holder.rotation.y = side * Math.PI;
        const badge = new THREE.Group();
        badge.add(inked(discGeometry(0.083, 0.035), CREAM, 0));
        const mark = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.14), faceMaterial(medalFace("SM", font)));
        mark.position.z = 0.0205;
        badge.add(mark);
        badge.position.set(0, -0.015, 0.189);
        badge.rotation.x = 0.1;
        holder.add(badge);
        g.add(holder);
      }
      break;
    }
  }
  return g;
}

/** Turns the die's side numbers upright for the number (an index) that will be on top. */
export function uprightDie(die: THREE.Object3D, top: number) {
  const up = new THREE.Vector3();
  const q = new THREE.Quaternion();
  die.traverse((m) => {
    const base = m.userData.base as THREE.Quaternion | undefined;
    if (!base) return;
    q.copy(DIE_TURNS[top]).multiply(base);
    up.set(0, 1, 0).applyQuaternion(q.invert());
    // Faces looking straight up or down have no upright to find.
    const a = Math.hypot(up.x, up.y) < 0.5 ? 0 : Math.atan2(-up.x, up.y);
    m.quaternion.copy(base).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), a));
  });
}

export function disposeTree(root: THREE.Object3D) {
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.geometry) m.geometry.dispose();
    const mat = m.material as THREE.Material | undefined;
    if (!mat || mat === inkMaterial) return;
    const map = (mat as THREE.ShaderMaterial).uniforms?.uMap?.value as THREE.Texture | undefined;
    if (map) map.dispose();
    mat.dispose();
  });
}
