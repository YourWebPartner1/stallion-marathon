"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { onIntroReady } from "@/lib/intro";
import { buildPiece, DIE_TURNS, disposeTree, outlineWidth, uprightDie, type PieceKind } from "@/lib/pieces-3d";

type Layer = "back" | "front";

/**
 * Resting spot for each piece. x is % of the stage width, y and size are in vw
 * (the hero scales with the viewport width), tilt is the piece's own lean in
 * radians. `rise` is how much faster than the page it climbs while scrolling
 * (0 moves with the page), `spin` is its endless slow turn in radians a second,
 * `turn` is extra radians per 1000px of scroll, and `from` is the angle it
 * starts at.
 */
type Spot = {
  kind: PieceKind;
  layer: Layer;
  x: number;
  y: number;
  size: number;
  tilt: [number, number, number];
  rise: number;
  spin: number;
  turn: number;
  from: number;
  phone: { x: number; y: number; size: number };
};

// Placed around the artwork, clear of STALLION and the hero text: the pieces
// behind the figure travel with the page, the ones in front rise 1.3 to 1.7
// times as fast, and every piece keeps turning slowly on its own axis.
const SPOTS: Spot[] = [
  { kind: "medal", layer: "back", x: 10, y: 48, size: 9.5, tilt: [0.14, 0, 0.22], rise: 0, spin: 0.1, turn: 0.4, from: -0.3, phone: { x: 11, y: 192, size: 13 } },
  { kind: "card", layer: "back", x: 30, y: 46, size: 8, tilt: [0.06, 0, 0.1], rise: 0, spin: 0.085, turn: 2.1, from: -0.5, phone: { x: 89, y: 190, size: 11 } },
  { kind: "horseshoe", layer: "back", x: 94, y: 46, size: 9, tilt: [0.16, 0, -0.22], rise: 0, spin: -0.1, turn: -0.4, from: 0.35, phone: { x: 91, y: 230, size: 11 } },
  { kind: "token", layer: "front", x: 33, y: 88, size: 4.4, tilt: [-0.1, 0.25, 0], rise: 0.45, spin: 0.12, turn: 0.5, from: -0.2, phone: { x: 8, y: 262, size: 7 } },
  { kind: "coin", layer: "front", x: 38.5, y: 93, size: 6, tilt: [0.1, -0.2, 0], rise: 0.71, spin: -0.12, turn: -0.5, from: 0.15, phone: { x: 16, y: 274, size: 9 } },
  { kind: "bib", layer: "front", x: 94, y: 89, size: 10, tilt: [0.08, 0, -0.16], rise: 0.38, spin: -0.085, turn: -1.4, from: 0.35, phone: { x: 88, y: 270, size: 13 } },
];

const ACTION_SECONDS = 1.6;
const INTRO_SECONDS = 1.3;
// Full speed at once, then a long slow-down: a thrown object losing its spin.
const easeThrow = (t: number) => 1 - Math.pow(1 - t, 4);
/** Shoots past the end by an amount set by `over`, then springs back. */
const easeBurst = (t: number, over: number) => 1 + (over + 1) * Math.pow(t - 1, 3) + over * Math.pow(t - 1, 2);

/** Full turns each piece makes when thrown, and how it comes to rest. */
const THROWS: Record<PieceKind, { turns: number; lands: "same" | "other side" | "new face" }> = {
  trophy: { turns: 1, lands: "same" },
  medal: { turns: 1, lands: "other side" },
  horseshoe: { turns: 1, lands: "same" },
  token: { turns: 3, lands: "other side" },
  coin: { turns: 3, lands: "other side" },
  card: { turns: 2, lands: "other side" },
  bib: { turns: 2, lands: "other side" },
  die: { turns: 2, lands: "new face" },
};

type Piece = {
  spot: Spot;
  root: THREE.Group; // position and scale
  lean: THREE.Group; // resting tilt
  act: THREE.Group; // the tumble: on load and when pressed
  turn: THREE.Group; // the endless slow turn
  face: THREE.Group; // which side or number is showing
  phase: number;
  start: number; // when the current throw began, -1 when at rest
  axis: THREE.Vector3; // what it tumbles around
  from: THREE.Quaternion;
  to: THREE.Quaternion;
  number: number; // the die's number, as an index
};

const OTHER_SIDE = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);

/** Mostly head over heels, a little sideways, either direction. */
const throwAxis = (a: number, b: number) =>
  new THREE.Vector3(Math.cos(a), b * 0.45, Math.sin(a)).normalize();

/**
 * Two transparent WebGL canvases around the hero artwork: one behind it, one in
 * front. On load the pieces burst out of the centre, tumbling, overshoot and
 * spring back. They then turn slowly for ever, rise past the page as it
 * scrolls, and spin as if thrown when pressed. Reduced-motion visitors get
 * still pieces and an instant change of side.
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

    // A long lens keeps perspective gentle; the z = 0 plane maps one unit to one CSS pixel.
    const camera = new THREE.PerspectiveCamera(18);

    const pieces: Piece[] = SPOTS.map((spot, i) => {
      const [root, lean, act, turn, face] = [0, 1, 2, 3, 4].map(() => new THREE.Group());
      root.add(lean);
      lean.add(act);
      act.add(turn);
      turn.add(face);
      scenes[spot.layer].add(root);
      const number = 5; // the die starts on 42 km
      const at = () => (spot.kind === "die" ? DIE_TURNS[number].clone() : new THREE.Quaternion());
      return { spot, root, lean, act, turn, face, phase: i * 1.7, start: -1, axis: throwAxis(i * 2.1, Math.sin(i * 5)), from: at(), to: at(), number };
    });

    let width = 0;
    let height = 0;
    let quality = 1; // lowered if the machine can't keep up
    let drawNow: (() => void) | null = null;
    const resize = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      outlineWidth.value = Math.max(1.6, Math.min(4.2, width * 0.0024));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
      for (const r of Object.values(gl)) {
        r.setPixelRatio(dpr);
        r.setSize(width, height, false);
      }
      camera.aspect = width / height;
      const distance = height / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      camera.position.set(0, 0, distance);
      // Near and far hug the pieces, so thin layers (stripes, grooves, faces) stay crisp.
      camera.near = distance - width * 0.4;
      camera.far = distance + width * 0.4;
      camera.updateProjectionMatrix();
      drawNow?.();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    // The faces carry lettering, so the shapes are made once the title font is ready.
    let gone = false;
    const title = stage.querySelector(".caps");
    const font = title ? getComputedStyle(title).fontFamily : "Georgia, serif";
    // One piece per task, so the opening animation never stops for them.
    const build = async () => {
      for (const p of pieces) {
        await new Promise((next) => setTimeout(next, 0));
        if (gone) return;
        p.face.add(buildPiece(p.spot.kind, font));
        if (p.spot.kind === "die") uprightDie(p.face, p.number);
      }
      // One unseen draw, so shaders and pictures are ready before the pieces appear.
      if (start < 0) {
        for (const p of pieces) {
          p.root.visible = true;
          p.root.scale.setScalar(0.01);
        }
        gl.back.render(scenes.back, camera);
        gl.front.render(scenes.front, camera);
        for (const p of pieces) p.root.visible = false;
      }
      drawNow?.();
    };
    document.fonts.load(`600 40px ${font}`).then(build, build);

    // Where a piece rests, in world units (x right, y up, origin at the stage centre).
    const restOf = (p: Piece) => {
      const s = phone ? p.spot.phone : p.spot;
      return {
        x: (s.x / 100) * width - width / 2,
        y: height / 2 - (s.y / 100) * width,
        size: (s.size / 100) * width,
      };
    };

    let busyUntil = 0; // full frame rate until this time
    const stir = (ms: number) => {
      busyUntil = Math.max(busyUntil, performance.now() + ms);
    };
    // The clock starts when the opening loader lifts.
    let start = -1;
    const clock = () => (start < 0 ? 0 : (performance.now() - start) / 1000);
    const offIntro = onIntroReady(() => {
      start = performance.now();
      stir(2200);
    });
    let scrollY = window.scrollY;
    const onScroll = () => stir(250);
    window.addEventListener("scroll", onScroll, { passive: true });

    // The canvases ignore the pointer, so the stage listens and compares places.
    const pick = (clientX: number, clientY: number) => {
      const rect = stage.getBoundingClientRect();
      const x = clientX - rect.left - width / 2;
      const y = height / 2 - (clientY - rect.top);
      let best: Piece | undefined;
      let nearest = 1;
      for (const p of pieces) {
        const size = p.root.scale.x;
        const [hx, hy] = p.spot.kind === "trophy" ? [0.33, 0.5] : p.spot.kind === "die" ? [0.52, 0.56] : [0.45, 0.5];
        const d = Math.hypot((x - p.root.position.x) / (hx * size), (y - p.root.position.y) / (hy * size));
        // Pieces in front win over the ones behind.
        const score = p.spot.layer === "front" ? d * 0.8 : d;
        if (d < 1 && score < nearest) {
          nearest = score;
          best = p;
        }
      }
      return best;
    };
    const onPress = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const p = pick(e.clientX, e.clientY);
      if (!p) return;
      const now = clock();
      // A second press waits until the spin has nearly died away.
      if (p.start >= 0 && now - p.start < ACTION_SECONDS * 0.5) return;
      p.from.copy(p.to);
      const { lands } = THROWS[p.spot.kind];
      if (lands === "other side") p.to.multiply(OTHER_SIDE);
      if (lands === "new face") {
        p.number = (p.number + 1 + Math.floor(Math.random() * 5)) % 6;
        p.to.copy(DIE_TURNS[p.number]);
        uprightDie(p.face, p.number);
      }
      p.axis = throwAxis((Math.random() - 0.5) * 1.5 + (Math.random() < 0.5 ? Math.PI : 0), Math.random() * 2 - 1);
      p.start = reduced ? -1 : now;
      stir(ACTION_SECONDS * 1000 + 200);
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      stage.style.cursor = pick(e.clientX, e.clientY) ? "pointer" : "";
    };
    stage.addEventListener("pointerdown", onPress);
    stage.addEventListener("pointermove", onMove);

    /** Tumble left in a piece, and the side it is turning to. */
    const pose = (p: Piece, now: number, intro: number) => {
      let left = intro < 1 ? (1 - easeThrow(intro)) * Math.PI * 4 : 0;
      p.face.quaternion.copy(p.to);
      if (p.start >= 0) {
        const t = Math.min(1, (now - p.start) / ACTION_SECONDS);
        const e = easeThrow(t);
        left += (1 - e) * Math.PI * 2 * THROWS[p.spot.kind].turns;
        p.face.quaternion.slerpQuaternions(p.from, p.to, e);
        if (t >= 1) p.start = -1;
      }
      p.act.quaternion.setFromAxisAngle(p.axis, left);
    };

    // Only draw while the hero is on screen.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(stage);

    let raf = 0;
    let lastFrame = 0;
    let lastDraw = 0;
    let slow = 0;
    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        lastFrame = 0;
        return;
      }
      // Forty slow frames in a row: draw fewer pixels from here on.
      const gap = lastFrame ? time - lastFrame : 0;
      lastFrame = time;
      slow = gap > 24 && gap < 200 ? slow + 1 : 0;
      if (slow > 40 && quality > 0.5) {
        quality -= 0.25;
        slow = 0;
        resize();
      }
      // The slow turning needs no more than about 48 frames a second, however fast the screen.
      if (time > busyUntil && time - lastDraw < 20) return;
      lastDraw = time;
      draw();
    };
    const draw = () => {
      const now = clock();
      // Read at draw time, so the pieces move in step with the page.
      scrollY = window.scrollY;

      for (const [i, p] of pieces.entries()) {
        const rest = restOf(p);
        // Burst out from behind the title's centre, past the resting place, and spring back.
        const t = reduced ? 1 : Math.max(0, Math.min(1, (now - 0.3 - i * 0.03) / INTRO_SECONDS));
        const burst = easeBurst(t, p.spot.layer === "front" ? 3.2 : 1.1);
        const fromX = 0;
        const fromY = height / 2 - 0.27 * width;
        const alive = reduced ? 0 : 1;
        const scrolled = reduced ? 0 : scrollY;
        const { kind, rise, spin, turn, tilt, from } = p.spot;

        p.root.position.set(
          fromX + (rest.x - fromX) * burst,
          fromY + (rest.y - fromY) * burst + scrolled * rise + Math.sin(now * 0.66 + p.phase) * width * 0.008 * alive,
          0,
        );
        p.root.scale.setScalar(rest.size * Math.max(0.001, easeThrow(Math.min(1, t * 1.4))));
        p.root.visible = t > 0;

        pose(p, now, t);
        const k = scrolled / 1000;
        p.lean.rotation.set(tilt[0], tilt[1], tilt[2]);
        // Coins spin about their own face, everything else about its upright axis.
        const angle = from + now * spin * alive + k * turn;
        if (kind === "coin" || kind === "token") p.turn.rotation.z = angle;
        else p.turn.rotation.y = angle;
      }

      gl.back.render(scenes.back, camera);
      gl.front.render(scenes.front, camera);
    };
    drawNow = draw;
    raf = requestAnimationFrame(frame);

    return () => {
      gone = true;
      offIntro();
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      stage.removeEventListener("pointerdown", onPress);
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
