"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FitText } from "@/components/fit-text";
import { useIntroReady } from "@/lib/intro";
import { HeroPieces } from "@/components/hero-pieces";

type Art = { src: string; alt: string; width: number; height: number } | null;

const STRETCH = 1.37; // letters drawn 1.37× taller than the font's own proportions (title ≈ 24% of the width tall, as on the reference)
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Homepage hero, as in the redesign brief: a small gold line, the giant
 * stretched STALLION kept whole, then the headline, buttons and trust line on
 * the left and the stallion artwork on the right (stacked on phones, text
 * first, so the button is above the fold).
 */
export function HeroStage({
  eyebrow,
  title,
  srTitle,
  headline,
  children,
  signature,
  art,
}: {
  eyebrow: string;
  title: string;
  srTitle: string;
  headline: string;
  children: ReactNode;
  signature: string;
  art: Art;
}) {
  const ready = useIntroReady();
  const enter = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.7, ease, delay },
  });

  return (
    <div className="relative overflow-hidden pb-[clamp(48px,5vw,88px)] pt-[clamp(96px,10vw,240px)]">
      <p className="overflow-y-clip px-5 text-center text-[clamp(0.75rem,1.188vw,1.07rem)] uppercase tracking-[0.1475em] text-[#1e1146] sm:px-10">
        <motion.span
          className="block"
          initial={{ y: "100%" }}
          animate={{ y: ready ? "0%" : "100%" }}
          transition={{ duration: 0.7, ease }}
        >
          {eyebrow}
        </motion.span>
      </p>

      <div className="relative -mt-[1.4vw] px-5 sm:px-10">
        <h1 className="caps relative z-10 text-[22vw] text-ink">
          <span aria-hidden>
            <FitText immediate perLetter letterDelay={0.04} align="center" stretch={STRETCH} lines={[title]} />
          </span>
          <span className="sr-only">{srTitle}</span>
        </h1>
      </div>

      <div className="relative z-20 mt-[clamp(28px,3vw,56px)] grid items-center gap-x-6 gap-y-12 px-[max(20px,2.78vw)] lg:grid-cols-12">
        <motion.div className="flex flex-col gap-6 lg:col-span-5" {...enter(0.15)}>
          <p className="display m-0 text-[clamp(36px,3.5vw,68px)] leading-[1.02] tracking-[-0.02em] text-ink">{headline}</p>
          {children}
        </motion.div>

        {art && (
          <motion.figure className="pointer-events-none m-0 lg:col-span-7" {...enter(0.25)}>
            <Image
              src={art.src}
              alt={art.alt}
              width={art.width}
              height={art.height}
              priority
              sizes="(min-width: 1024px) 52vw, 92vw"
              className="mx-auto h-auto w-full max-w-[880px]"
            />
            <figcaption className="display mt-4 text-center text-[clamp(22px,1.9vw,36px)] italic leading-none text-gold">
              {signature}
            </figcaption>
          </motion.figure>
        )}
      </div>

      {/* 3D race pieces around the artwork: one layer behind it, one in front. */}
      <HeroPieces />
    </div>
  );
}
