"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FitText } from "@/components/fit-text";
import { HeroPieces } from "@/components/hero-pieces";

type Art = { src: string; alt: string; width: number; height: number } | null;

const STRETCH = 1.37; // letters drawn 1.37× taller than the font's own proportions (title ≈ 24% of the width tall, as on the reference)
const ease = [0.16, 1, 0.3, 1] as const;



/**
 * Homepage hero stage: small gold line, the giant stretched title, two gold
 * outline echoes of it that drift apart on scroll, and the cover artwork in
 * front of the lower half of the title.
 */
export function HeroStage({ tagline, title, srTitle, art }: { tagline: string; title: string; srTitle: string; art: Art }) {
  const ref = useRef<HTMLDivElement>(null);
  // Outline echoes slide down at a fixed share of the page scroll (22% and 42%),
  // so they fan out below the title into a cascading stack, as on the reference.
  const { scrollY } = useScroll();
  const echoNear = useTransform(scrollY, (v) => v * 0.22);
  const echoFar = useTransform(scrollY, (v) => v * 0.42);
  // Invisible at rest so no gold edge peeks around the solid letters; fades in over the first 40px.
  const echoOpacity = useTransform(scrollY, [0, 40], [0, 1]);

  return (
    <div ref={ref} className="relative overflow-hidden pb-10 pt-[clamp(96px,10vw,240px)]">
      {/* Tagline rises out of a mask, like the reference. */}
      <p className="overflow-y-clip px-5 text-center text-[clamp(0.7rem,1.188vw,1.07rem)] uppercase tracking-[0.1475em] text-gold sm:px-10">
        <motion.span
          className="block"
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1, ease, delay: 0.1 }}
        >
          {tagline}
        </motion.span>
      </p>

      <div className="relative -mt-[1.4vw] px-5 sm:px-10">
        {/* Gold outline echoes behind the solid title. At rest they sit exactly under it,
            hidden; scrolling slides them down to fan out below. Farthest first. */}
        {[echoFar, echoNear].map((y, i) => (
          <motion.div
            key={i}
            aria-hidden
            className="caps outline-text pointer-events-none absolute inset-x-5 top-0 z-0 text-[22vw] will-change-transform sm:inset-x-10"
            style={{ y, opacity: echoOpacity }}
          >
            <FitText immediate perLetter letterDelay={0.25} align="center" stretch={STRETCH} lines={[title]} />
          </motion.div>
        ))}
        <h1 className="caps relative z-10 text-[22vw] text-ink">
          <span aria-hidden>
            <FitText immediate perLetter letterDelay={0.25} align="center" stretch={STRETCH} lines={[title]} />
          </span>
          <span className="sr-only">{srTitle}</span>
        </h1>
      </div>

      {art && (
        <motion.div
          className="pointer-events-none relative z-20 mx-auto -mt-[10.9vw] w-[60vw] max-sm:w-[72vw]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
        >
          <Image
            src={art.src}
            alt={art.alt}
            width={art.width}
            height={art.height}
            priority
            sizes="(min-width: 640px) 60vw, 72vw"
            className="h-auto w-full"
          />
        </motion.div>
      )}

      {/* 3D race pieces: one layer behind the artwork, one in front. */}
      <HeroPieces />
    </div>
  );
}
