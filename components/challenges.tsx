"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { challengeHref, challengePrizes, challenges, headcountBands } from "@/lib/content";
import { ChessKnight } from "@/components/chess-knight";

const ease = [0.16, 1, 0.3, 1] as const;
const FRAME = "clamp(20px, 2.6vw, 36px)";
const PAINT = ["#f2b705", "#c99400", "#ab71e3", "#3b1f8e"];

/** Gold-framed navy panel: the ₹50,000 HR prize on the left, what's at stake on the right. */
export function PrizePanel() {
  return (
    <motion.div
      className="notch bg-[#f2b705]"
      style={{ "--n": "26px", "--o": "0px", padding: FRAME } as unknown as CSSProperties}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease }}
    >
      <div
        className="notch flex items-center gap-[clamp(20px,2.94vw,40px)] bg-[#3b1f8e] px-[clamp(20px,2.94vw,40px)] py-[clamp(40px,5.88vw,80px)] text-[#f8f3fe] max-[900px]:flex-col"
        style={{ "--n": "26px", "--o": FRAME } as CSSProperties}
      >
        <div className="flex flex-1 flex-col items-center gap-5 text-center">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-[#f8f3fe]/60">HR Champion</p>
          <p className="caps m-0 text-[clamp(64px,6.7vw,128px)] leading-[0.9] text-[#f2b705]">₹50,000</p>
          <span aria-hidden className="flex w-[clamp(140px,15.5vw,220px)] items-center gap-3">
            <span className="h-px flex-1 bg-[#f2b705]/50" />
            <ChessKnight className="text-[20px] text-[#f2b705]" />
            <span className="h-px flex-1 bg-[#f2b705]/50" />
          </span>
          <p className="m-0 max-w-sm text-base leading-[1.3] text-[#f8f3fe]/60">
            Cash and a public mention for the HR lead who brings the most bookings.
          </p>
        </div>

        <span aria-hidden className="w-px self-stretch bg-[#f8f3fe]/20 max-[900px]:h-px max-[900px]:w-full" />

        <div className="flex w-full flex-1 flex-col">
          <p className="m-0 pb-2 text-sm text-[#f8f3fe]/60">What&rsquo;s at stake</p>
          <ul className="m-0 flex list-none flex-col p-0">
            {challengePrizes.map((p) => (
              <li key={p.title} className="flex flex-col gap-2 border-b border-[#f2b705]/80 py-5">
                <span className="display text-[clamp(24px,1.68vw,32px)] leading-[1.15]">{p.title}</span>
                <span className="text-base leading-[1.35] text-[#f8f3fe]/70">{p.body}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/** The four challenges as ruled cards with the hover curtain; each leads to registration. */
export function ChallengeGrid() {
  return (
    <motion.div
      className="grid gap-px bg-[#3b1f8e] p-px lg:grid-cols-2"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease }}
    >
      {challenges.map((c, i) => (
        <Link
          key={c.name}
          href={challengeHref}
          className="group relative isolate flex min-h-[clamp(360px,26vw,500px)] flex-col overflow-hidden bg-navy p-[clamp(24px,2.1vw,40px)] text-ink transition-colors duration-[250ms] [transition-delay:120ms] hover:text-[#f2b705]"
        >
          {PAINT.map((color, j) => (
            <span
              key={color}
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10 origin-top scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transition-delay:var(--out)] group-hover:scale-y-100 group-hover:[transition-delay:var(--in)] group-focus-visible:scale-y-100"
              style={{ background: color, "--in": `${j * 70}ms`, "--out": `${(3 - j) * 70}ms` } as CSSProperties}
            />
          ))}
          <div className="flex items-start justify-between gap-4">
            <span className="caps text-[clamp(44px,3.6vw,68px)] leading-[0.9]">{String(i + 1).padStart(2, "0")}</span>
            <span className="label pt-1 opacity-60">{String(i + 1).padStart(2, "0")} / 04</span>
          </div>
          <h3 className="display m-0 mt-auto pt-12 text-[clamp(32px,2.83vw,54px)] leading-[1.02] tracking-[-0.02em]">{c.name}</h3>
          <dl className="m-0 mt-6 flex flex-col border-t border-current/25">
            <div className="grid grid-cols-[minmax(110px,30%)_1fr] gap-4 border-b border-current/25 py-3">
              <dt className="text-sm opacity-60">Who can enter</dt>
              <dd className="m-0 text-base leading-[1.3]">{c.who}</dd>
            </div>
            <div className="grid grid-cols-[minmax(110px,30%)_1fr] gap-4 border-b border-current/25 py-3">
              <dt className="text-sm opacity-60">Winners</dt>
              <dd className="m-0 text-base leading-[1.3]">{c.picked}</dd>
            </div>
          </dl>
          {c.banded && (
            <p className="m-0 mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm opacity-70">
              {headcountBands.map((b, j) => (
                <span key={b} className="flex items-center gap-2">
                  {j > 0 && <span aria-hidden className="size-1 rotate-45 bg-current" />}
                  {b}
                </span>
              ))}
            </p>
          )}
          <span className="mt-6 flex items-center justify-between border-t border-current/30 pt-4 text-lg tracking-[-0.01em]">
            Register your organisation
            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </span>
        </Link>
      ))}
    </motion.div>
  );
}
