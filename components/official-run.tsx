"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LiveCountdown } from "@/components/live-countdown";
import { Roll } from "@/components/roll";
import { raceFacts, site, TBA, timers, venue } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;
const FRAME = "clamp(20px, 2.6vw, 36px)";

/** Gold-framed navy panel: race day on the left, the essentials on the right. */
export function RacePanel() {
  // Every row of the document's race-facts table, plus the contact line.
  const facts = [
    ...raceFacts,
    { label: "Contact", value: site.email ? `${site.phone}, ${site.email}` : site.phone },
  ];

  return (
    <motion.div
      className="notch bg-[#f7b538]"
      style={{ "--n": "26px", "--o": "0px", padding: FRAME } as unknown as CSSProperties}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease }}
    >
      <div
        className="notch flex items-center gap-[clamp(20px,2.94vw,40px)] bg-[#08335d] px-[clamp(20px,2.94vw,40px)] py-[clamp(40px,5.88vw,80px)] text-[#fdffff] max-[900px]:flex-col"
        style={{ "--n": "26px", "--o": FRAME } as CSSProperties}
      >
        <div className="flex flex-1 flex-col items-center gap-5 text-center">
          {/* The live countdown the content document asks for on this page. */}
          <LiveCountdown spec={timers.race} size="large" />
          <span aria-hidden className="flex w-[clamp(140px,15.5vw,220px)] items-center gap-3">
            <span className="h-px flex-1 bg-[#f7b538]/50" />
            <span className="size-2 rotate-45 bg-[#f7b538]" />
            <span className="h-px flex-1 bg-[#f7b538]/50" />
          </span>
          <p className="m-0 text-xl text-[#f7b538]">{venue.name}</p>
          <p className="m-0 max-w-sm text-base leading-[1.3] text-[#fdffff]/60">{venue.address}</p>
        </div>

        <span aria-hidden className="w-px self-stretch bg-[#fdffff]/20 max-[900px]:h-px max-[900px]:w-full" />

        <dl className="m-0 flex w-full flex-1 flex-col">
          <p className="m-0 pb-2 text-sm text-[#fdffff]/60">The essentials</p>
          {facts.map((f) => (
            <div key={f.label} className="grid grid-cols-[minmax(110px,40%)_1fr] gap-4 border-b border-[#f7b538]/80 py-4">
              <dt className="text-sm text-[#fdffff]/60">{f.label}</dt>
              <dd className={`m-0 text-lg leading-[1.3] ${f.value === TBA ? "italic text-[#fdffff]/60" : ""}`}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
}

/** A plain ledger in the reference log style: numbered rows of label and value, no expanding. */
export function FactLedger({
  title,
  aside,
  rows,
}: {
  title: string;
  aside: { count: string; caption: string; link?: { label: string; href: string } };
  rows: { label: string; value: string; note?: string }[];
}) {
  return (
    <div className="text-ink [--g:24px] max-[700px]:[--g:8px]">
      <header className="grid grid-cols-12 items-end gap-x-[var(--g)] gap-y-4 border-b border-ink pb-10">
        <h2 className="display col-span-12 m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em] min-[1081px]:col-span-7">
          {title}
        </h2>
        <div className="col-span-12 flex flex-col items-start gap-4 min-[1081px]:col-span-5 min-[1081px]:col-start-8 min-[1081px]:items-end">
          <dl className="m-0 flex flex-col items-start gap-1 min-[1081px]:items-end">
            <dt className="text-sm text-ink/60">{aside.caption}</dt>
            <dd className="display m-0 text-[clamp(32px,2.31vw,44px)] leading-none">{aside.count}</dd>
          </dl>
          {aside.link && (
            <Link href={aside.link.href} className="group inline-flex items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
              <Roll text={aside.link.label} under="text-gold" />
              <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          )}
        </div>
      </header>
      <ol className="m-0 flex list-none flex-col p-0">
        {rows.map((r, i) => (
          <li
            key={r.label}
            className="group grid min-h-[120px] grid-cols-12 items-baseline gap-x-[var(--g)] border-b border-ink/15 pb-[46px] pt-10"
          >
            <span className="col-span-1 text-sm tabular-nums text-ink/60">{String(i + 1).padStart(2, "0")}</span>
            <span className="display col-span-6 -my-[0.2em] py-[0.2em] max-[1080px]:leading-[1.05] min-[1081px]:overflow-hidden min-[1081px]:text-ellipsis min-[1081px]:whitespace-nowrap text-[clamp(32px,3.33vw,64px)] leading-none tracking-[-0.02em] min-[1081px]:col-span-5">
              {r.label}
            </span>
            <span className="col-span-5 flex flex-col gap-1 min-[1081px]:col-span-6">
              <span className={`text-[clamp(20px,1.57vw,30px)] leading-[1.15] ${r.value === TBA ? "italic text-ink/60" : ""}`}>{r.value}</span>
              {r.note && <span className="text-base leading-[1.2] text-ink/60">{r.note}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
