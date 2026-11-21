"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FitText } from "@/components/fit-text";
import { Roll } from "@/components/roll";

const ease = [0.16, 1, 0.3, 1] as const;

export type FeaturedCard = {
  title: string;
  meta: React.ReactNode[];
  href: string;
  /** Large numeral shown in the picture area until artwork exists. */
  mark: string;
  label: string;
};

/** A large chapter card: the document's When / Where / Distances / From / Includes rows and a booking button. */
export type ChapterCard = {
  label: string;
  mark: string;
  title: string;
  rows: { k: string; v: string; pending?: boolean }[];
  cta: string;
  href: string;
};

// Curtain colours, the same four as the menu: gold, ochre, teal, then navy on top.
const PAINT = ["#f7b538", "#c98f2e", "#145a86", "#08335d"];

/**
 * Featured section in the reference layout: an edge-to-edge title, a 12-column
 * row (ornament, statement, count and link), then a grid of cards ruled by 1px
 * navy lines. Hovering a card drops a four-colour curtain and turns its text gold.
 */
export function FeaturedChapters({
  title,
  statement,
  count,
  caption,
  action,
  cards = [],
  chapters,
}: {
  title: string;
  statement: string[];
  count: string;
  caption: string;
  action: { label: string; href: string };
  cards?: FeaturedCard[];
  /** Large chapter cards, shown two across instead of the three-up grid. */
  chapters?: ChapterCard[];
}) {
  return (
    <section
      aria-labelledby="featured-title"
      className="theme-light relative flex flex-col gap-16 bg-navy px-[max(20px,2.78vw)] py-[max(96px,8.33vw)] text-ink"
    >
      <header className="flex flex-col gap-10">
        <h2 id="featured-title" className="caps m-0 text-[14vw] leading-[0.9] text-ink">
          <FitText lines={[title]} />
        </h2>

        <div className="grid gap-y-10 pt-6 lg:grid-cols-12 lg:gap-x-6">
          {/* Ornament: rule, diamond, rule */}
          <div aria-hidden className="flex items-center gap-4 self-start pt-[0.9em] lg:col-span-2">
            <span className="h-px flex-1 bg-gold/40" />
            <span className="size-2.5 rotate-45 bg-gold" />
            <span className="h-px flex-1 bg-gold/40" />
          </div>

          <motion.p
            className="display m-0 text-[clamp(28px,2.31vw,44px)] leading-[1.12] tracking-[-0.02em] lg:col-span-5 lg:col-start-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
          >
            {statement.map((line, i) => (
              <span key={i} className="block overflow-hidden py-[0.14em] -my-[0.14em]">
                <motion.span
                  className="block"
                  variants={{
                    hidden: { y: "110%" },
                    show: { y: "0%", transition: { duration: 1.1, ease, delay: i * 0.1 } },
                  }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </motion.p>

          <motion.div
            className="lg:col-span-3 lg:col-start-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.9, ease, delay: 0.2 }}
          >
            <Link href={action.href} className="group flex flex-col gap-2">
              <span className="caps text-[clamp(56px,3.99vw,76px)] leading-[0.9]">{count}</span>
              <span className="text-base leading-[1.2] text-ink/60">{caption}</span>
              <span className="mt-4 flex items-center justify-between gap-4 border-b border-ink/30 pb-2 text-xl leading-[1.2] tracking-[-0.01em]">
                <Roll text={action.label} under="text-gold" />
                <span
                  aria-hidden
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* The grid fades in as one piece so the navy rules never show through moving cards. */}
      <motion.div
        className={`grid gap-px bg-[#08335d] p-px ${chapters ? "lg:grid-cols-2" : "lg:grid-cols-3"}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1, ease }}
      >
        {chapters
          ? chapters.map((c) => (
              <article key={c.title} className="flex">
                <ChapterCardView card={c} />
              </article>
            ))
          : cards.map((c) => (
              <article key={c.title} className="flex">
                <FeaturedCardView card={c} />
              </article>
            ))}
      </motion.div>
    </section>
  );
}

export function FeaturedCardView({ card }: { card: FeaturedCard }) {
  return (
    <Link
      href={card.href}
      className="group relative flex w-full flex-col justify-between overflow-hidden bg-navy p-6 text-ink [container-type:inline-size] focus-visible:outline-2 focus-visible:-outline-offset-[6px] focus-visible:outline-[#f7b538]"
    >
      {PAINT.map((color, i) => (
        <span
          key={color}
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-top scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transition-delay:var(--out)] group-hover:scale-y-100 group-hover:[transition-delay:var(--in)] group-focus-visible:scale-y-100 group-focus-visible:[transition-delay:var(--in)]"
          style={{ background: color, "--in": `${i * 70}ms`, "--out": `${(3 - i) * 70}ms` } as React.CSSProperties}
        />
      ))}

      {/* Picture area: square, a large numeral stands in until artwork exists. */}
      <div className="relative grid aspect-square w-full place-items-center">
        <span className="label absolute left-0 top-0 text-ink/60 transition-colors duration-500 group-hover:text-[#f7b538]">
          {card.label}
        </span>
        <span
          aria-hidden
          className="caps text-[46cqw] leading-none text-ink transition-colors duration-500 group-hover:text-[#f7b538]"
        >
          {card.mark}
        </span>
      </div>

      <div className="relative mt-6 flex flex-col gap-2 transition-colors duration-500 group-hover:text-[#f7b538]">
        <h3 className="display m-0 -my-[0.14em] overflow-hidden text-ellipsis whitespace-nowrap py-[0.14em] text-[clamp(20px,6.4cqw,52px)] leading-[1.05] tracking-[-0.015em]">
          {card.title}
        </h3>
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          {card.meta.map((m, i) => (
            <span key={i} className="flex items-center gap-2 opacity-70">
              {i > 0 && <span aria-hidden className="size-1 rotate-45 bg-current" />}
              {m}
            </span>
          ))}
        </p>
      </div>
    </Link>
  );
}

export function ChapterCardView({ card }: { card: ChapterCard }) {
  return (
    <Link
      href={card.href}
      className="group relative flex w-full flex-col overflow-hidden bg-navy p-[clamp(24px,2.5vw,48px)] text-ink transition-colors duration-500 hover:text-[#f7b538] focus-visible:outline-2 focus-visible:-outline-offset-[6px] focus-visible:outline-[#f7b538]"
    >
      {PAINT.map((color, i) => (
        <span
          key={color}
          aria-hidden
          className="pointer-events-none absolute inset-0 origin-top scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transition-delay:var(--out)] group-hover:scale-y-100 group-hover:[transition-delay:var(--in)] group-focus-visible:scale-y-100 group-focus-visible:[transition-delay:var(--in)]"
          style={{ background: color, "--in": `${i * 70}ms`, "--out": `${(3 - i) * 70}ms` } as React.CSSProperties}
        />
      ))}
      <div className="relative flex items-start justify-between gap-6">
        <span className="label pt-2 opacity-60">{card.label}</span>
        <span aria-hidden className="caps text-[clamp(72px,7vw,140px)] leading-[0.8]">
          {card.mark}
        </span>
      </div>
      <h3 className="display relative m-0 mt-[clamp(24px,3vw,56px)] text-[clamp(32px,3.15vw,60px)] leading-[1.02] tracking-[-0.02em]">
        {card.title}
      </h3>
      <dl className="relative m-0 mt-8 flex flex-1 flex-col border-t border-current/25">
        {card.rows.map((r) => (
          <div key={r.k} className="grid grid-cols-[minmax(96px,28%)_1fr] gap-4 border-b border-current/25 py-4">
            <dt className="text-sm opacity-60">{r.k}</dt>
            <dd className={`m-0 text-base leading-[1.35] ${r.pending ? "italic opacity-60" : ""}`}>{r.v}</dd>
          </div>
        ))}
      </dl>
      <span className="relative mt-8 flex items-center justify-between gap-4 bg-[#f7b538] px-6 py-4 text-lg tracking-[-0.01em] text-[#08335d]">
        {card.cta}
        <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
          →
        </span>
      </span>
    </Link>
  );
}
