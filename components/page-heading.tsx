"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FitText } from "@/components/fit-text";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Inner-page heading in the reference layout: an edge-to-edge title, then a
 * 12-column row with a gold diamond ornament, a statement whose lines rise in,
 * and an aside (usually a count, a caption and a small ledger).
 */
export function PageHeading({
  title,
  label,
  statement,
  aside,
}: {
  title: string;
  /** Optional small gold line above the title, e.g. the page's full name. */
  label?: string;
  statement: string[];
  aside: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        {label && (
          <p className="m-0 overflow-y-clip text-center text-[clamp(0.7rem,1.188vw,1.07rem)] uppercase tracking-[0.1475em] text-gold">
            <motion.span
              className="block"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease, delay: 0.1 }}
            >
              {label}
            </motion.span>
          </p>
        )}
        <h1 className="caps m-0 text-[14vw] leading-[0.9] text-ink">
          <FitText immediate lines={[title]} />
        </h1>
      </div>

      <div className="grid gap-y-10 pt-6 lg:grid-cols-12 lg:gap-x-6">
        <div aria-hidden className="flex items-center gap-4 self-start pt-[0.9em] lg:col-span-2">
          <span className="h-px flex-1 bg-gold/40" />
          <span className="size-2.5 rotate-45 bg-gold" />
          <span className="h-px flex-1 bg-gold/40" />
        </div>

        <motion.p
          className="display m-0 text-[clamp(28px,2.31vw,44px)] leading-[1.12] tracking-[-0.02em] lg:col-span-5 lg:col-start-4"
          initial="hidden"
          animate="show"
        >
          {statement.map((line, i) => (
            <span key={i} className="-my-[0.14em] block overflow-hidden py-[0.14em]">
              <motion.span
                className="block"
                variants={{
                  hidden: { y: "110%" },
                  show: { y: "0%", transition: { duration: 1.1, ease, delay: 0.35 + i * 0.1 } },
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.5 }}
        >
          {aside}
        </motion.div>
      </div>
    </header>
  );
}

/** Count, caption and a ruled ledger of label / value rows, as in the reference aside. */
export function CountLedger({
  count,
  caption,
  rows,
}: {
  count: string;
  caption: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="caps m-0 text-[clamp(56px,3.99vw,76px)] leading-[0.9]">{count}</p>
      <p className="m-0 text-base leading-[1.2] text-ink/60">{caption}</p>
      <dl className="m-0 mt-4 flex flex-col border-t border-ink/20">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 border-b border-ink/20 py-2 text-base leading-[1.25]">
            <dt>{r.label}</dt>
            <dd className="m-0 tabular-nums text-ink/60">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
