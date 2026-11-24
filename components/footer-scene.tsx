"use client";

import { useEffect, useRef, type RefObject } from "react";

const BLUE = "/footer/track-blue.webp";
const GOLD = "/footer/track-gold.webp";
const BRISTLES = 56;
const RADIUS = 0.0415; // half the brush's width, as a share of the picture's
const FIRST = 650; // ms until the first specks dry
const LAST = 3900; // ms until the last strand has gone

/** `d` is the distance along the stroke, in brush radii. */
type Point = { x: number; y: number; d: number; t: number; pen: number; first?: boolean };

/**
 * The engraved race-day scene. Moving a mouse over the footer brushes the gold
 * version of the same picture onto it: a solid band with torn edges, which dries
 * into specks, then into a few thick strands, then goes. Draws nothing at all while the brush is still. Touch screens
 * and reduced motion get the plain picture. Redraw the pictures with
 * `node scripts/footer-scene.mjs`.
 */
export function FooterScene({ area, className }: { area: RefObject<HTMLElement | null>; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const footer = area.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !footer || !ctx) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hash = (n: number) => {
      const v = Math.sin(n * 127.1 + 11.7) * 43758.5453;
      return v - Math.floor(v);
    };
    /** Smooth noise: hash values joined by curves. */
    const noise = (n: number) => {
      const i = Math.floor(n);
      const u = n - i;
      return hash(i) + (hash(i + 1) - hash(i)) * u * u * (3 - 2 * u);
    };
    const bristles = Array.from({ length: BRISTLES }, (_, i) => ({
      across: (i / (BRISTLES - 1)) * 2 - 1,
      fine: hash(i * 3.3),
      edge: Math.max(0, Math.abs((i / (BRISTLES - 1)) * 2 - 1) - 0.82) / 0.18, // 0 inside, 1 at the rim
    }));

    let gold: HTMLImageElement | null = null;
    let points: Point[] = [];
    let pen = 0; // a new number starts a new stroke
    let raf = 0;

    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.offsetWidth * dpr);
      const h = Math.round(canvas.offsetHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      return r;
    };

    let painted = 0; // when the brush last moved
    let lastDraw = 0;
    const draw = () => {
      const now = performance.now();
      // Drying is slow, so it needs fewer redraws than painting.
      if (now - painted > 120 && now - lastDraw < 32) {
        raf = requestAnimationFrame(draw);
        return;
      }
      lastDraw = now;
      points = points.filter((p) => now - p.t < LAST);
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!points.length) {
        raf = 0;
        return;
      }

      const radius = canvas.width * RADIUS;
      // Direction taken over a few points, so the band bends smoothly.
      const normals = points.map((p, i) => {
        let a = i;
        let b = i;
        while (a > 0 && i - a < 3 && points[a - 1].pen === p.pen) a--;
        while (b < points.length - 1 && b - i < 3 && points[b + 1].pen === p.pen) b++;
        const dx = points[b].x - points[a].x;
        const dy = points[b].y - points[a].y;
        const len = Math.hypot(dx, dy) || 1;
        return [-dy / len, dx / len];
      });

      // Where each stroke begins and ends, for its ragged, rounded tips.
      const ends = new Map<number, [number, number]>();
      for (const p of points) {
        const e = ends.get(p.pen);
        if (e) e[1] = p.d;
        else ends.set(p.pen, [p.first ? p.d : p.d - 2, p.d]);
      }

      ctx.lineCap = "butt";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#000";
      // Wider than their spacing, so together they make one solid band.
      ctx.lineWidth = ((radius * 2) / BRISTLES) * 1.75;
      ctx.beginPath();
      for (const b of bristles) {
        let down = false;
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (i > 0 && points[i - 1].pen !== p.pen) down = false;
          // Torn edge: the outermost bristles only catch here and there.
          if (b.edge > 0 && hash(Math.floor(p.d * 7) + b.across * 91 + p.pen * 17) < b.edge * 0.62) {
            down = false;
            continue;
          }
          const [from, to] = ends.get(p.pen)!;
          const back = 0.7 * b.across * b.across + 0.22 * hash(b.across * 37 + p.pen * 5);
          if (p.d - from < back || to - p.d < back * 0.8) {
            down = false;
            continue;
          }
          const age = now - p.t;
          if (age > FIRST) {
            // Strands: neighbouring bristles dry together, some long before others.
            const strand = noise(b.across * 4.2 + p.pen * 7.3 + noise(p.d * 0.35) * 0.9);
            const speck = noise(p.d * 2.6 + b.fine * 40);
            const stays = Math.min(1, Math.max(0, strand * 0.82 + speck * 0.34 + b.fine * 0.1 - b.edge * 0.3 - 0.06));
            if (age > FIRST + (LAST - FIRST) * stays * stays * 1.02) {
              down = false;
              continue;
            }
          }
          const off = radius * (b.across + (noise(p.d * 1.3 + b.across * 3) - 0.5) * 0.05 + (hash(Math.floor(p.d * 5) + b.across * 50) - 0.5) * 0.12 * b.edge);
          const x = p.x + normals[i][0] * off;
          const y = p.y + normals[i][1] * off;
          if (down) ctx.lineTo(x, y);
          else ctx.moveTo(x, y);
          down = true;
        }
      }
      ctx.stroke();

      if (gold?.complete && gold.naturalWidth) {
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(gold, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      raf = requestAnimationFrame(draw);
    };

    const onEnter = () => {
      pen++;
      if (gold) return;
      gold = new Image();
      gold.src = GOLD;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      if (!gold) onEnter();
      const r = size();
      const x = ((e.clientX - r.left) / r.width) * canvas.width;
      const y = ((e.clientY - r.top) / r.height) * canvas.height;
      const pad = canvas.width * 0.06;
      if (x < -pad || y < -pad || x > canvas.width + pad || y > canvas.height + pad) {
        pen++;
        return;
      }
      const last = points[points.length - 1];
      const radius = canvas.width * RADIUS;
      const t = performance.now();
      if (last && last.pen === pen) {
        const gap = Math.hypot(x - last.x, y - last.y);
        if (gap < radius * 0.1) return;
        // Close, even points, so the specks have somewhere to form.
        const steps = Math.min(40, Math.max(1, Math.round(gap / (radius * 0.2))));
        for (let i = 1; i <= steps; i++) {
          const k = i / steps;
          points.push({ x: last.x + (x - last.x) * k, y: last.y + (y - last.y) * k, d: last.d + (gap / radius) * k, t, pen });
        }
      } else {
        points.push({ x, y, d: hash(pen) * 100, t, pen, first: true });
      }
      if (points.length > 460) points.splice(0, points.length - 460);
      painted = performance.now();
      if (!raf) raf = requestAnimationFrame(draw);
    };

    footer.addEventListener("pointerenter", onEnter);
    footer.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      footer.removeEventListener("pointerenter", onEnter);
      footer.removeEventListener("pointermove", onMove);
    };
  }, [area]);

  return (
    <div aria-hidden className={`pointer-events-none aspect-[1600/1000] ${className ?? ""}`}>
      {/* A plain picture: both copies must line up exactly, so neither is resized by the image service. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={BLUE} alt="" width={1600} height={1000} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
