"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const FRAME = "clamp(20px, 2.6vw, 36px)"; // gold frame thickness

// Deterministic torn-paper outline: a gently wobbling edge covered in short,
// uneven fibres, with the odd longer tear, so it reads as hand-torn paper rather
// than a sawtooth. Pseudo-random from a fixed seed, so server and client agree.
const torn = (() => {
  const rand = (n: number) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const pts: string[] = [];
  const N = 260; // points around the whole outline
  const inset = 4; // % kept free for the fibres to reach into
  for (let i = 0; i < N; i++) {
    const t = i / N;
    // Walk the rectangle's perimeter: top, right, bottom, left.
    let x: number, y: number, nx: number, ny: number;
    if (t < 0.25) [x, y, nx, ny] = [t * 4 * 100, 0, 0, -1];
    else if (t < 0.5) [x, y, nx, ny] = [100, (t - 0.25) * 4 * 100, 1, 0];
    else if (t < 0.75) [x, y, nx, ny] = [100 - (t - 0.5) * 4 * 100, 100, 0, 1];
    else [x, y, nx, ny] = [0, 100 - (t - 0.75) * 4 * 100, -1, 0];
    // Slow wobble plus fine fibres, alternating in and out, and a rare long tear.
    const wobble = Math.sin(t * Math.PI * 14 + 1.3) * 0.9 + Math.sin(t * Math.PI * 37) * 0.5;
    const fibre = (i % 2 === 0 ? 1 : -0.4) * rand(i) * 1.8;
    const tear = rand(i + 999) > 0.97 ? rand(i + 77) * 3.2 : 0;
    const out = inset - 1 + wobble + fibre + tear;
    const px = Math.min(100, Math.max(0, inset + (x / 100) * (100 - 2 * inset) + nx * out));
    const py = Math.min(100, Math.max(0, inset + (y / 100) * (100 - 2 * inset) + ny * out));
    pts.push(`${px.toFixed(2)}% ${py.toFixed(2)}%`);
  }
  return `polygon(${pts.join(", ")})`;
})();

/**
 * Scroll interlude: a framed card pinned on screen. Its words fade away one by
 * one, then the frame zooms until the ivory card fills the screen and hands
 * over to the light section below. Static on small screens and for reduced motion.
 */
export function Interlude({ text }: { text: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = text.split(" ");
  // Below 1000px and for reduced motion the interlude is a plain framed card.
  const [still, setStill] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 999.98px), (prefers-reduced-motion: reduce)");
    const update = () => setStill(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Frame zoom, sampled from the reference: eases in from 0.35, out by 0.95,
  // ending at 4.66x so the gold sides leave the screen.
  const scale = useTransform(
    scrollYProgress,
    [0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95],
    [1, 1.031, 1.109, 1.245, 1.458, 1.783, 2.271, 2.848, 3.418, 3.937, 4.344, 4.592, 4.656],
  );
  // Torn paper starts hidden behind the frame and spreads faster than it,
  // filling the screen before the frame's sides leave.
  const paperScale = useTransform(scrollYProgress, [0.37, 0.4, 0.43, 0.46, 0.565, 0.65, 0.8], [1, 1.1, 1.37, 1.75, 3.2, 4.6, 7]);
  const paperOpacity = useTransform(scrollYProgress, [0.36, 0.37], [0, 1]);
  const cueTrack = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const cueOpacity = useTransform(scrollYProgress, [0.848, 0.9], [1, 0]);

  return (
    <section
      ref={ref}
      aria-label="Interlude"
      className="relative h-[230svh] bg-navy max-[1000px]:h-auto max-[1000px]:py-24 motion-reduce:h-auto motion-reduce:py-24"
    >
      <div className="sticky top-0 grid h-[100svh] place-items-center overflow-clip max-[1000px]:relative max-[1000px]:h-auto motion-reduce:relative motion-reduce:h-auto">
        {/* Torn paper behind the frame */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute aspect-[4/5] h-[min(68svh,calc((100vw-2*clamp(20px,2.78vw,64px))*1.25))] bg-paper will-change-transform max-[1000px]:hidden motion-reduce:hidden"
          style={{ clipPath: torn, scale: paperScale, opacity: paperOpacity }}
        />

        {/* The framed card: a drawn gold frame (border image) whose centre is the ivory card. */}
        <motion.div
          className="relative z-[1] grid aspect-[4/5] h-[min(68svh,calc((100vw-2*clamp(20px,2.78vw,64px))*1.25))] will-change-transform max-[1000px]:h-auto max-[1000px]:w-[min(80vw,420px)]"
          style={
            {
              scale: still ? 1 : scale,
              borderStyle: "solid",
              borderWidth: FRAME,
              borderImage: "url(/brand/frame.svg) 50 fill / 1 / 0 stretch",
            } as unknown as CSSProperties
          }
        >
          <div className="grid h-full place-items-center p-[clamp(24px,2.78vw,40px)] [container-type:inline-size]">
            <p className="display m-0 text-balance text-center text-[clamp(16px,6.6cqi,44px)] leading-[1.3] tracking-[-0.01em] text-[#08335d]">
              {words.map((w, i) => (
                <Word key={i} progress={scrollYProgress} index={i} count={words.length} still={still}>
                  {w}
                </Word>
              ))}
            </p>
          </div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-[clamp(24px,2.78vw,40px)] left-1/2 z-[2] flex -translate-x-1/2 flex-col items-center gap-2 text-ink max-[1000px]:hidden motion-reduce:hidden"
          style={{ opacity: cueOpacity }}
        >
          <span className="flex items-baseline gap-1 whitespace-nowrap text-[clamp(12px,0.9vw,14px)] leading-none">
            Keep scrolling{" "}
            <motion.span
              className="inline-block text-gold"
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1], repeat: Infinity }}
            >
              ↓
            </motion.span>
          </span>
          <span className="block h-px w-[clamp(72px,7vw,120px)] bg-ink/20">
            <motion.span className="block h-full origin-left bg-gold" style={{ scaleX: cueTrack }} />
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/** One word, fading away in reading order as the interlude scrolls. */
function Word({
  children,
  progress,
  index,
  count,
  still,
}: {
  children: string;
  progress: MotionValue<number>;
  index: number;
  count: number;
  still: boolean;
}) {
  const start = 0.14 + (index / count) * 0.17;
  const opacity = useTransform(progress, [start, start + 0.03], [1, 0]);
  return (
    <>
      <motion.span className="inline-block" style={{ opacity: still ? 1 : opacity }}>
        {children}
      </motion.span>{" "}
    </>
  );
}
