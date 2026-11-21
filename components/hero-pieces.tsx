"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { buildPiece, disposeTree, type PieceKind } from "@/lib/pieces-3d";

type Layer = "back" | "front";

/**
 * Resting spot for each piece. x is % of the stage width, y and size are in vw
 * (the hero scales with the viewport width), tilt is the piece's own lean in
 * radians, drift is how much it lags the page scroll (more = closer).
 */
type Spot = {
  kind: PieceKind;
  layer: Layer;
  x: number;
  y: number;
  size: number;
  tilt: [number, number, number];
  drift: number;
  phone?: { x: number; y: number; size: number };
};

// Sized and placed from the reference at 1000px wide: its king stands about
// 20vw tall, the pawn, rook and die about 12-13vw, the lower card about 15vw.
const SPOTS: Spot[] = [
  { kind: "trophy", layer: "front", x: 12, y: 45, size: 17, tilt: [0.12, 0.5, 0.3], drift: 0.3, phone: { x: 13, y: 56, size: 20 } },
  { kind: "medal", layer: "back", x: 23.5, y: 39, size: 11, tilt: [0.1, -0.5, -0.12], drift: 0.2, phone: { x: 27, y: 45, size: 14 } },
  { kind: "coin", layer: "front", x: 17.5, y: 63, size: 8, tilt: [0.35, 0.6, 0.1], drift: 0.34 },
  { kind: "card", layer: "back", x: 50, y: 21, size: 10, tilt: [0.1, 0.35, -0.2], drift: 0.16, phone: { x: 52, y: 20, size: 12 } },
  { kind: "horseshoe", layer: "back", x: 79.5, y: 41, size: 12, tilt: [0.25, -0.55, 0.15], drift: 0.2, phone: { x: 75, y: 45, size: 14 } },
  { kind: "stopwatch", layer: "front", x: 90.5, y: 43, size: 13, tilt: [0.15, -0.7, -0.15], drift: 0.3, phone: { x: 88, y: 57, size: 17 } },
  { kind: "card", layer: "front", x: 82, y: 63, size: 14, tilt: [0.2, Math.PI + 0.4, 0.34], drift: 0.36 },
  { kind: "bib", layer: "front", x: 9.5, y: 80, size: 11, tilt: [0.25, 0.55, -0.18], drift: 0.38 },
];

const FLIP_SECONDS = 1.6;
const INTRO_SECONDS = 1.6;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

type Piece = {
  spot: Spot;
  root: THREE.Group; // position and scale
  lean: THREE.Group; // resting tilt plus idle sway
  flip: THREE.Group; // turns half a turn per click
  phase: number;
  flipFrom: number;
  flipTo: number;
  flipStart: number;
  scene: THREE.Scene;
};

/**
 * Two transparent WebGL canvases around the hero artwork: one behind it, one in
 * front. The pieces sway gently, lag the page as it scrolls, fly in from the
 * centre on load, and turn over when clicked or tapped. Fewer, larger pieces
 * on phones; no motion beyond the flip for reduced-motion visitors.
 */
export function HeroPieces() {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const back = backRef.current;
    const front = frontRef.current;
    const stage = back?.parentElement;
    if (!back || !front || !stage) return;

    let gl: { back: THREE.WebGLRenderer; front: THREE.WebGLRenderer };
    try {
      const make = (canvas: HTMLCanvasElement) => {
        const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
        r.setClearColor(0x000000, 0);
        return r;
      };
      gl = { back: make(back), front: make(front) };
    } catch {
      return; // No WebGL: the hero simply shows without pieces.
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const phone = window.matchMedia("(max-width: 640px)").matches;

    const scenes = { back: new THREE.Scene(), front: new THREE.Scene() };
    for (const s of Object.values(scenes)) {
      s.add(new THREE.HemisphereLight(0xfff6e0, 0x6b4a1e, 1.6));
      const sun = new THREE.DirectionalLight(0xffffff, 2.4);
      sun.position.set(-0.6, 0.9, 1);
      s.add(sun);
    }

    // A long lens keeps perspective gentle; the z = 0 plane maps one unit to one CSS pixel.
    const camera = new THREE.PerspectiveCamera(18, 1, 1, 20000);

    const pieces: Piece[] = SPOTS.filter((s) => !phone || s.phone).map((spot, i) => {
      const mesh = buildPiece(spot.kind);
      const flip = new THREE.Group();
      flip.add(mesh);
      const lean = new THREE.Group();
      lean.add(flip);
      const root = new THREE.Group();
      root.add(lean);
      scenes[spot.layer].add(root);
      return { spot, root, lean, flip, phase: i * 1.7, flipFrom: 0, flipTo: 0, flipStart: -1, scene: scenes[spot.layer] };
    });

    let width = 0;
    let height = 0;
    const resize = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      for (const r of Object.values(gl)) {
        r.setPixelRatio(dpr);
        r.setSize(width, height, false);
      }
      camera.aspect = width / height;
      camera.position.set(0, 0, height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
      camera.updateProjectionMatrix();
      drawNow?.();
    };
    let drawNow: (() => void) | null = null;
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    // Where a piece rests, in world units (x right, y up, origin at the stage centre).
    const restOf = (p: Piece) => {
      const s = phone && p.spot.phone ? p.spot.phone : p.spot;
      return {
        x: (s.x / 100) * width - width / 2,
        y: height / 2 - (s.y / 100) * width,
        size: (s.size / 100) * width,
      };
    };

    const start = performance.now();
    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Hit-testing: the canvases ignore the pointer, so the stage listens and casts a ray.
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const pick = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      ndc.set(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      // Front layer first, it sits on top.
      for (const layer of ["front", "back"] as const) {
        const hits = ray.intersectObjects(
          pieces.filter((p) => p.spot.layer === layer).map((p) => p.root),
          true,
        );
        if (hits.length) return pieces.find((p) => p.root === findRoot(hits[0].object, pieces));
      }
      return undefined;
    };
    const onClick = (e: MouseEvent) => {
      const p = pick(e.clientX, e.clientY);
      if (!p) return;
      const now = (performance.now() - start) / 1000;
      const current = currentFlip(p, now);
      p.flipFrom = current;
      p.flipTo = Math.round(p.flipTo / Math.PI + 1) * Math.PI;
      p.flipStart = now;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      stage.style.cursor = pick(e.clientX, e.clientY) ? "pointer" : "";
    };
    stage.addEventListener("click", onClick);
    stage.addEventListener("pointermove", onMove);

    const currentFlip = (p: Piece, now: number) => {
      if (p.flipStart < 0) return p.flipTo;
      const dur = reduced ? 0.3 : FLIP_SECONDS;
      const t = Math.min(1, (now - p.flipStart) / dur);
      return p.flipFrom + (p.flipTo - p.flipFrom) * easeInOut(t);
    };

    // Only draw while the hero is on screen.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(stage);

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) return;
      draw();
    };
    const draw = () => {
      const now = (performance.now() - start) / 1000;

      for (const [i, p] of pieces.entries()) {
        const rest = restOf(p);
        // Fly in from just above the artwork's centre, one after another.
        const intro = reduced ? 1 : easeOutExpo(Math.max(0, Math.min(1, (now - 0.6 - i * 0.07) / INTRO_SECONDS)));
        const fromX = 0;
        const fromY = height / 2 - 0.42 * width;
        const sway = reduced ? 0 : 1;
        const drift = reduced ? 0 : scrollY * p.spot.drift;

        p.root.position.set(
          fromX + (rest.x - fromX) * intro + Math.sign(rest.x) * scrollY * 0.06 * sway,
          fromY + (rest.y - fromY) * intro - drift + Math.sin(now * 0.7 + p.phase) * rest.size * 0.05 * sway,
          0,
        );
        p.root.scale.setScalar(rest.size * (0.25 + 0.75 * intro));
        p.root.visible = intro > 0.001;

        const [tx, ty, tz] = p.spot.tilt;
        p.lean.rotation.set(
          tx + Math.sin(now * 0.55 + p.phase) * 0.12 * sway,
          ty + Math.sin(now * 0.35 + p.phase * 0.6) * 0.18 * sway + (1 - intro) * 2.4,
          tz + Math.sin(now * 0.45 + p.phase * 1.3) * 0.08 * sway,
        );

        const f = currentFlip(p, now);
        p.flip.rotation.y = f;
        // A small hop toward the viewer at the middle of a flip.
        const mid = p.flipStart < 0 ? 0 : Math.sin(Math.min(1, (now - p.flipStart) / FLIP_SECONDS) * Math.PI);
        p.flip.position.z = mid * 0.35;
      }

      gl.back.render(scenes.back, camera);
      gl.front.render(scenes.front, camera);
    };
    drawNow = draw;
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      stage.removeEventListener("click", onClick);
      stage.removeEventListener("pointermove", onMove);
      stage.style.cursor = "";
      for (const s of Object.values(scenes)) disposeTree(s);
      gl.back.dispose();
      gl.front.dispose();
    };
  }, []);

  return (
    <>
      <canvas ref={backRef} aria-hidden className="pointer-events-none absolute inset-0 z-[15] h-full w-full" />
      <canvas ref={frontRef} aria-hidden className="pointer-events-none absolute inset-0 z-30 h-full w-full" />
    </>
  );
}

function findRoot(obj: THREE.Object3D, pieces: Piece[]) {
  let o: THREE.Object3D | null = obj;
  while (o) {
    if (pieces.some((p) => p.root === o)) return o;
    o = o.parent;
  }
  return null;
}
