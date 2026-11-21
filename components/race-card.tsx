"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Roll } from "@/components/roll";
import { bookHref, dates, everyRunnerGets, tiers } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;
const FRAME = "clamp(20px, 2.6vw, 36px)";
const DAY = 86_400_000;

const milestones = [
  { title: "Virtual Run starts", where: "Anywhere", date: dates.virtualStart, short: "19 Jan" },
  { title: "Winners named", where: "Republic Day", date: dates.winners, short: "26 Jan" },
  { title: "Race Day", where: "Gachibowli Stadium", date: dates.raceDay, short: "14 Mar" },
];

const noSubscribe = () => () => {};
const daysKey = () =>
  milestones.map((m) => Math.max(0, Math.ceil((new Date(m.date).getTime() - Date.now()) / DAY))).join(",");

/** Days from now to each milestone. Null on the server, so the first paint shows the plain dates. */
function useDaysLeft() {
  const key = useSyncExternalStore(noSubscribe, daysKey, () => null);
  return key ? key.split(",").map(Number) : null;
}

/**
 * Calendar and race card in the reference "play log" layout: a gold-framed
 * navy panel for what is next, then a 12-column ledger of the seven distances.
 * Each row carries a gold bar sized to its distance and opens to show what
 * every runner gets.
 */
export function RaceCard() {
  return (
    <section
      aria-labelledby="race-card-title"
      className="theme-light relative -mt-px flex flex-col gap-[clamp(64px,5.87vw,112px)] bg-navy px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16 text-ink"
    >
      <NextUp />
      <Ledger />
    </section>
  );
}

function NextUp() {
  const days = useDaysLeft();
  const furthest = days ? Math.max(...days, 1) : 1;
  return (
    <motion.div
      className="notch bg-[#f7b538]"
      style={{ "--n": "26px", "--o": "0px", padding: FRAME } as unknown as CSSProperties}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease }}
    >
      <div
        className="notch flex items-center gap-[clamp(20px,2.94vw,40px)] bg-[#08335d] px-[clamp(20px,2.94vw,40px)] py-[clamp(40px,5.88vw,80px)] text-[#fdffff] max-[900px]:flex-col"
        style={{ "--n": "26px", "--o": FRAME } as CSSProperties}
      >
        <div className="flex flex-1 flex-col items-center gap-5 text-center">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-[#fdffff]/60">Next on the calendar</p>
          <p className="display m-0 text-[clamp(48px,5.03vw,96px)] leading-none tracking-[-0.02em]">19 Jan 2027</p>
          <span aria-hidden className="flex w-[clamp(140px,15.5vw,220px)] items-center gap-3">
            <span className="h-px flex-1 bg-[#f7b538]/50" />
            <span className="size-2 rotate-45 bg-[#f7b538]" />
            <span className="h-px flex-1 bg-[#f7b538]/50" />
          </span>
          <p className="m-0 text-xl text-[#f7b538]">Virtual Run / Republic Day Edition</p>
          <p className="m-0 text-base leading-[1.2] text-[#fdffff]/60">Run from anywhere. Winners named on Republic Day.</p>
        </div>

        <span aria-hidden className="w-px self-stretch bg-[#fdffff]/20 max-[900px]:h-px max-[900px]:w-full" />

        <ul className="m-0 flex w-full flex-1 list-none flex-col gap-10 p-0">
          {milestones.map((m, i) => {
            const d = days?.[i];
            // Closer dates fill more of the bar.
            const fill = d == null ? 0 : 1 - d / (furthest * 1.05);
            return (
              <li key={m.title} className="flex flex-col gap-5 border-b border-[#f7b538]/80 py-5">
                <div className="flex items-baseline gap-3.5">
                  <p className="display m-0 min-w-0 flex-1 truncate text-[clamp(24px,1.68vw,32px)] leading-[1.15]">
                    {m.title}
                  </p>
                  <p className="m-0 hidden flex-1 truncate text-xl text-[#f7b538] sm:block">{m.where}</p>
                  <p className="m-0 whitespace-nowrap text-right text-xl tabular-nums">
                    {d == null ? m.short : d === 0 ? "Today" : `${d} days`}
                  </p>
                </div>
                <div aria-hidden className="flex h-[3px]">
                  <motion.span
                    className="block h-full origin-left bg-[#f7b538]"
                    style={{ width: `${Math.max(fill, 0.02) * 100}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease, delay: 0.2 + i * 0.1 }}
                  />
                  <span className="block h-full flex-1 bg-[#fdffff]/20" />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

function Ledger() {
  const [open, setOpen] = useState<number | null>(null);
  const maxKm = Math.max(...tiers.map((t) => t.km));
  return (
    <div className="text-ink [--g:24px] max-[700px]:[--g:8px]">
      <header className="grid grid-cols-12 items-end gap-x-[var(--g)] gap-y-4 border-b border-ink pb-10">
        <h2
          id="race-card-title"
          className="display col-span-12 m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em] min-[1081px]:col-span-7"
        >
          The race card
        </h2>
        <div className="col-span-12 flex flex-col items-start gap-4 min-[1081px]:col-span-5 min-[1081px]:col-start-8 min-[1081px]:items-end">
          <dl className="m-0 flex gap-10">
            {[
              { k: "Distances", v: String(tiers.length) },
              { k: "Virtual from", v: `₹${tiers[0].price}` },
            ].map((t) => (
              <div key={t.k} className="flex flex-col items-start gap-1 min-[1081px]:items-end">
                <dt className="text-sm text-ink/60">{t.k}</dt>
                <dd className="display m-0 text-[clamp(32px,2.31vw,44px)] leading-none tabular-nums">{t.v}</dd>
              </div>
            ))}
          </dl>
          <Link href={bookHref} className="group inline-flex items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
            <Roll text="Book your distance" under="text-gold" />
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-x-[var(--g)] pb-2 pt-6 text-sm leading-[1.2] text-ink/60 max-[760px]:hidden">
        <span className="col-[2/span_4] min-[1081px]:col-[2/span_3]">Distance</span>
        <span className="col-[6/span_4] min-[1081px]:col-[5/span_4]">Package</span>
        <span className="hidden min-[1081px]:col-[9/span_2] min-[1081px]:block">Format</span>
        <span className="col-[10/span_3] text-right min-[1081px]:col-[11/span_2]">Virtual price</span>
      </div>

      <ol className="m-0 flex list-none flex-col p-0">
        {tiers.map((t, i) => {
          const isOpen = open === i;
          const twoDay = t.km === 50;
          return (
            <li key={t.name} className="relative bg-navy">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group relative grid min-h-[120px] w-full cursor-pointer grid-cols-12 items-baseline gap-x-[var(--g)] border-0 bg-transparent px-0 pb-[46px] pt-10 text-left text-ink"
              >
                <span className="col-span-1 text-sm tabular-nums text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={`display col-span-4 -my-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap py-[0.2em] text-[clamp(32px,3.33vw,64px)] leading-none tracking-[-0.02em] tabular-nums transition-[color,transform] duration-[250ms,800ms] ease-[cubic-bezier(0.16,1,0.3,1)] min-[1081px]:col-span-3 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-2.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[#f7b538] group-focus-visible:translate-x-2.5 group-focus-visible:text-[#f7b538] ${isOpen ? "translate-x-2.5 text-[#f7b538]" : ""}`}
                >
                  {twoDay ? "50 km" : t.distance}
                </span>
                <span className="col-span-4 flex min-w-0 flex-col gap-2">
                  <span className="display -my-[0.14em] overflow-hidden text-ellipsis whitespace-nowrap py-[0.14em] text-[clamp(22px,1.57vw,30px)] leading-[1.1] tracking-[-0.01em]">
                    {t.name}
                  </span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-base leading-[1.15] text-ink/60">
                    {twoDay ? "25 km a day for two days" : t.bestFor}
                  </span>
                </span>
                <span className="display col-span-2 hidden -my-[0.14em] overflow-hidden py-[0.14em] text-[clamp(22px,1.57vw,30px)] leading-[1.1] min-[1081px]:block">
                  {twoDay ? "Two days" : "One day"}
                </span>
                <span className="col-span-3 justify-self-end whitespace-nowrap text-[clamp(22px,1.57vw,30px)] tabular-nums min-[1081px]:col-span-2">
                  ₹{t.price.toLocaleString("en-IN")}
                </span>

                {/* Ledger bar: gold, sized to the distance, starting at the second column. */}
                <span aria-hidden className="pointer-events-none absolute bottom-[-1px] left-[calc((100%+var(--g))/12)] right-0 h-[3px]">
                  <span className="absolute inset-x-0 top-[1px] h-px bg-ink/15" />
                  <motion.span
                    className="relative block h-full origin-left bg-[#f7b538]"
                    style={{ width: `${(t.km / maxKm) * 100}%` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease, delay: 0.1 }}
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="detail"
                    className="overflow-hidden"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.6, ease }}
                  >
                    <motion.div
                      className="grid grid-cols-12 gap-x-[var(--g)] pb-16 pt-2"
                      initial={{ y: -12, clipPath: "inset(0 0 100% 0)" }}
                      animate={{ y: 0, clipPath: "inset(0 0 0% 0)" }}
                      exit={{ y: -12, clipPath: "inset(0 0 100% 0)" }}
                      transition={{ duration: 0.6, ease }}
                    >
                      <ul className="col-span-12 m-0 list-none p-0 min-[761px]:col-span-8 min-[761px]:col-start-5">
                        <li className="pb-2 text-sm text-ink/60">Every runner gets</li>
                        {everyRunnerGets.map((g) => (
                          <li key={g} className="border-b border-ink/15 py-3 text-lg">
                            {g}
                          </li>
                        ))}
                        <li className="pt-6">
                          <Link href={bookHref} className="group inline-flex items-baseline gap-2 text-lg">
                            <Roll text={`Book ${t.name}`} under="text-gold" />
                            <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
                              →
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

