"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { pillars } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;
const PAINT = ["#f7b538", "#c98f2e", "#145a86", "#08335d"];

// Where each pillar leads for more.
const pillarLinks = ["/virtual-run", "/workshops", "/official-run#premium", "/giving-back"];

/**
 * "Why Stallion": the four message pillars from the content document as ruled
 * tiles with the hover curtain, each leading to the page that says more.
 */
export function WhyStallion() {
  return (
    <section
      aria-labelledby="why-title"
      className="theme-light relative -mt-px bg-navy px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] text-ink"
    >
      <div className="mb-10 grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
        <h2 id="why-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em] lg:col-span-7">
          Why Stallion
        </h2>
        <p className="m-0 self-end text-base leading-[1.3] text-ink/60 lg:col-span-5 lg:col-start-8 lg:text-right">
          Run your distance, your way, then take the start line behind a stallion.
        </p>
      </div>

      <motion.ul
        className="m-0 grid list-none gap-px bg-[#08335d] p-px sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease }}
      >
        {pillars.map((p, i) => (
          <li key={p.title} className="flex">
            <Link
              href={pillarLinks[i] ?? "/"}
              className="group relative isolate flex min-h-[clamp(320px,24vw,440px)] w-full flex-col overflow-hidden bg-navy p-6 text-ink transition-colors duration-[250ms] [transition-delay:120ms] hover:text-[#f7b538] focus-visible:outline-2 focus-visible:-outline-offset-[6px] focus-visible:outline-[#f7b538]"
            >
              {PAINT.map((color, j) => (
                <span
                  key={color}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 origin-top scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transition-delay:var(--out)] group-hover:scale-y-100 group-hover:[transition-delay:var(--in)] group-focus-visible:scale-y-100"
                  style={{ background: color, "--in": `${j * 70}ms`, "--out": `${(3 - j) * 70}ms` } as CSSProperties}
                />
              ))}
              <span className="caps text-[clamp(44px,3.6vw,68px)] leading-[0.9]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display m-0 mt-auto pt-10 text-[clamp(28px,2.31vw,44px)] leading-[1.05] tracking-[-0.02em]">{p.title}</h3>
              <span aria-hidden className="mt-4 block h-px w-10 bg-current opacity-60" />
              <p className="m-0 mt-4 text-base leading-[1.4] opacity-75">{p.body}</p>
              <span aria-hidden className="mt-6 text-lg transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </li>
        ))}
      </motion.ul>
    </section>
  );
}
