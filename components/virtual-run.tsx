"use client";

import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { ChessKnight } from "@/components/chess-knight";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FeaturedCardView } from "@/components/featured-chapters";
import { EarlyBirdTimer, LiveCountdown, nowSecond, subscribeClock } from "@/components/live-countdown";
import { Roll } from "@/components/roll";
import { bookHref, earlyBird, everyRunnerGets, tiers, timers, twoDayCopy, virtualSteps, winnersGet } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;
const FRAME = "clamp(20px, 2.6vw, 36px)";
const PAINT = ["#f2b705", "#c99400", "#ab71e3", "#3b1f8e"];
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const isTwoDay = (km: number) => km === 50;

/* ---------- Distance chart (the reference's "one bar per night") ---------- */

/**
 * One bar per package, as tall as its distance. The two-day package stacks two
 * 25 km segments. Pointing at (or focusing) a bar reads it out above the chart.
 */
export function DistanceChart() {
  const [active, setActive] = useState<number | null>(null);
  const max = 50;
  const marks = [10, 20, 30, 40, 50];
  const t = active == null ? null : tiers[active];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2 border-t border-ink/20 pt-6">
        <p className="display m-0 min-h-[1.2em] text-[clamp(22px,1.57vw,30px)] leading-[1.2]" aria-live="polite">
          {t
            ? `${t.name} · ${isTwoDay(t.km) ? "25 km a day for two days" : t.distance} · ${rupees(t.price)}`
            : "Each bar is one package, as tall as its distance"}
        </p>
        <p className="m-0 text-[clamp(16px,1.05vw,20px)] leading-[1.15] text-ink/60">
          {t ? t.bestFor : "Point at a package to read it."}
        </p>
      </div>

      <div className="grid grid-cols-[28px_1fr] gap-x-4">
        {/* Scale */}
        <div className="relative h-[clamp(260px,23vw,440px)]">
          {marks.map((m) => (
            <span
              key={m}
              className="absolute right-0 -translate-y-1/2 text-sm leading-none text-ink/60"
              style={{ bottom: `${(m / max) * 100}%` }}
            >
              {m}
            </span>
          ))}
        </div>

        {/* Bars over gridlines */}
        <div className="relative h-[clamp(260px,23vw,440px)]">
          {marks.map((m) => (
            <span key={m} aria-hidden className="absolute inset-x-0 h-px bg-ink/15" style={{ bottom: `${(m / max) * 100}%` }} />
          ))}
          <ul className="relative m-0 grid h-full list-none grid-cols-7 items-end gap-[clamp(8px,2vw,40px)] p-0">
            {tiers.map((tier, i) => {
              const segments = isTwoDay(tier.km) ? [25, 25] : [tier.km];
              return (
                <li key={tier.name} className="flex h-full items-end">
                  <button
                    type="button"
                    aria-label={`${tier.name}, ${tier.distance}, ${rupees(tier.price)}`}
                    onPointerEnter={() => setActive(i)}
                    onPointerLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="group flex h-full w-full cursor-pointer flex-col justify-end border-0 bg-transparent p-0"
                  >
                    <motion.span
                      className="flex w-full origin-bottom flex-col-reverse gap-[3px]"
                      style={{ height: `${(tier.km / max) * 100}%` }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 1.2, ease, delay: 0.1 + i * 0.07 }}
                    >
                      {segments.map((s, j) => (
                        <span
                          key={j}
                          className={`block w-full transition-colors duration-300 ${
                            active === i ? "bg-[#f2b705]" : "bg-[#3b1f8e] group-hover:bg-[#f2b705]"
                          }`}
                          style={{ flex: s }}
                        />
                      ))}
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Axis */}
        <div />
        <ul className="m-0 grid list-none grid-cols-7 gap-[clamp(8px,2vw,40px)] p-0 pt-4">
          {tiers.map((tier, i) => (
            <li key={tier.name} className={`text-sm leading-[1.25] transition-colors ${active === i ? "text-ink" : "text-ink/60"}`}>
              <span className="block truncate">{tier.name}</span>
              <span className="block text-ink">{tier.km} km</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Gold-framed panel: dates and what every runner gets ---------- */

export function RunnerPanel() {
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
        {/* The two countdowns the content document asks for on this page. */}
        <div className="flex flex-1 flex-col items-center gap-8 text-center">
          <LiveCountdown spec={timers.virtual} size="large" />
          <span aria-hidden className="flex w-[clamp(140px,15.5vw,220px)] items-center gap-3">
            <span className="h-px flex-1 bg-[#f2b705]/50" />
            <ChessKnight className="text-[20px] text-[#f2b705]" />
            <span className="h-px flex-1 bg-[#f2b705]/50" />
          </span>
          <LiveCountdown spec={timers.winners} size="small" />
          <p className="m-0 text-sm text-[#f8f3fe]/60">The run is open from 19 to 26 January 2027.</p>
        </div>

        <span aria-hidden className="w-px self-stretch bg-[#f8f3fe]/20 max-[900px]:h-px max-[900px]:w-full" />

        <div className="flex w-full flex-1 flex-col">
          <p className="m-0 pb-2 text-sm text-[#f8f3fe]/60">Every runner gets</p>
          <ul className="m-0 flex list-none flex-col p-0">
            {everyRunnerGets.map((item) => (
              <li key={item} className="flex items-baseline gap-4 border-b border-[#f2b705]/80 py-5">
                <span aria-hidden className="block size-1.5 shrink-0 translate-y-[-0.3em] rotate-45 bg-[#f2b705]" />
                <span className="display text-[clamp(22px,1.68vw,32px)] leading-[1.15]">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------- Packages grid (the reference collection grid) ---------- */

export function PackageGrid() {
  // Early-bird: only while an offer is set and its deadline has not passed.
  const now = useSyncExternalStore(subscribeClock, nowSecond, () => null);
  const offer = earlyBird.virtual;
  const offerOn = !!offer && now != null && now < Date.parse(offer.ends) / 1000;
  const price = (name: string, standard: number) => {
    const early = offerOn ? offer?.prices[name] : undefined;
    return early == null ? (
      rupees(standard)
    ) : (
      <>
        <s className="opacity-60">{rupees(standard)}</s> <span className="font-medium">{rupees(early)}</span>
      </>
    );
  };
  return (
    <>
    {offerOn && offer && (
      <div className="mb-6">
        <EarlyBirdTimer ends={offer.ends} />
      </div>
    )}
    <motion.div
      className="grid gap-px bg-[#3b1f8e] p-px md:grid-cols-2 lg:grid-cols-3"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease }}
    >
      {tiers.map((t, i) => (
        <article key={t.name} className="flex">
          <FeaturedCardView
            card={{
              label: `No. ${String(i + 1).padStart(2, "0")}`,
              mark: String(t.km),
              title: t.name,
              meta: isTwoDay(t.km)
                ? ["2 × 25 km", price(t.name, t.price), "Two days"]
                : [t.distance, price(t.name, t.price), t.bestFor],
              href: bookHref,
            }}
          />
        </article>
      ))}

      {/* What winners get */}
      <article className="flex flex-col justify-between gap-8 bg-[#3b1f8e] p-6 text-[#f8f3fe]">
        <div className="flex flex-col gap-3">
          <span className="label text-[#f2b705]">Winners</span>
          <p className="display m-0 text-[clamp(28px,2.31vw,44px)] leading-[1.05] tracking-[-0.02em]">What winners get</p>
        </div>
        <ul className="m-0 flex list-none flex-col p-0">
          {winnersGet.map((w) => (
            <li key={w} className="border-b border-[#f8f3fe]/20 py-3 text-base leading-[1.3]">
              {w}
            </li>
          ))}
        </ul>
      </article>

      {/* Book */}
      <Link
        href={bookHref}
        className="group relative isolate flex flex-col justify-between gap-8 overflow-hidden bg-navy p-6 text-ink transition-colors duration-[250ms] [transition-delay:120ms] hover:text-[#f2b705] md:col-span-2 lg:col-span-1"
      >
        {PAINT.map((color, i) => (
          <span
            key={color}
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 origin-top scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transition-delay:var(--out)] group-hover:scale-y-100 group-hover:[transition-delay:var(--in)] group-focus-visible:scale-y-100"
            style={{ background: color, "--in": `${i * 70}ms`, "--out": `${(3 - i) * 70}ms` } as CSSProperties}
          />
        ))}
        <span aria-hidden className="block size-1.5 rotate-45 bg-[#f2b705]" />
        <span className="flex flex-col gap-3">
          <span className="display text-[clamp(30px,2.62vw,50px)] leading-[1.05] tracking-[-0.02em]">Book your distance</span>
          <span className="text-sm leading-[1.3] opacity-70">
            Every package includes a finisher&rsquo;s medal and a goodie bag shipped to your home. {twoDayCopy}
          </span>
          <span aria-hidden className="text-xl transition-transform duration-500 group-hover:translate-x-1.5">
            →
          </span>
        </span>
      </Link>
    </motion.div>
    </>
  );
}

/* ---------- How it works (the reference ledger) ---------- */

export function StepsLedger() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="text-ink [--g:24px] max-[700px]:[--g:8px]">
      <header className="grid grid-cols-12 items-end gap-x-[var(--g)] gap-y-4 border-b border-ink pb-10">
        <h2 className="display col-span-12 m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em] min-[1081px]:col-span-7">
          How it works
        </h2>
        <div className="col-span-12 flex flex-col items-start gap-4 min-[1081px]:col-span-5 min-[1081px]:col-start-8 min-[1081px]:items-end">
          <dl className="m-0 flex gap-10">
            <div className="flex flex-col items-start gap-1 min-[1081px]:items-end">
              <dt className="text-sm text-ink/60">Steps</dt>
              <dd className="display m-0 text-[clamp(32px,2.31vw,44px)] leading-none">{virtualSteps.length}</dd>
            </div>
          </dl>
          <Link href="/faq" className="group inline-flex items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
            <Roll text="Read the FAQ" under="text-gold" />
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </header>

      <ol className="m-0 flex list-none flex-col p-0">
        {virtualSteps.map((s, i) => {
          const isOpen = open === i;
          return (
            <li key={s.title} className="relative border-b border-ink/15">
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group grid min-h-[120px] w-full cursor-pointer grid-cols-12 items-baseline gap-x-[var(--g)] border-0 bg-transparent px-0 pb-[46px] pt-10 text-left text-ink"
              >
                <span className="col-span-1 text-sm tabular-nums text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                <span
                  className={`display col-span-6 -my-[0.2em] overflow-hidden text-ellipsis whitespace-nowrap py-[0.2em] text-[clamp(32px,3.33vw,64px)] leading-none tracking-[-0.02em] transition-[color,transform] duration-[250ms,800ms] ease-[cubic-bezier(0.16,1,0.3,1)] min-[1081px]:col-span-4 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-2.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-gold group-focus-visible:translate-x-2.5 group-focus-visible:text-gold ${isOpen ? "translate-x-2.5 text-[#f2b705]" : ""}`}
                >
                  {s.title}
                </span>
                <span className="col-span-5 text-base leading-[1.3] text-ink/60 min-[1081px]:col-span-6">{s.body}</span>
                <span aria-hidden className="col-span-12 hidden justify-self-end text-2xl min-[1081px]:col-span-1 min-[1081px]:block">
                  {isOpen ? "−" : "+"}
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
                    <div className="grid grid-cols-12 gap-x-[var(--g)] pb-12">
                      <div className="col-span-12 flex flex-col gap-4 min-[761px]:col-span-7 min-[761px]:col-start-6">
                        <p className="m-0 text-lg leading-[1.4]">{stepDetail[i]}</p>
                        <Link href={bookHref} className="group inline-flex w-fit items-baseline gap-2 bg-[#c6f432] px-5 py-3 text-lg font-bold text-[#1e1146]">
                          <Roll text="Book virtual run" under="text-[#3b1f8e]" />
                          <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
                            →
                          </span>
                        </Link>
                      </div>
                    </div>
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

// Detail lines under each step, drawn only from the confirmed facts.
const stepDetail = [
  "Choose from seven distances, 5 km to the two-day 50 km. Bookings open on this website and on BookMyShow.",
  "Run between 19 and 26 January 2027, wherever you like, at your own pace.",
  "How to submit your run, including accepted tracking apps, will be published before the start.",
  "Winners are announced on Republic Day, 26 January 2027.",
  "Your finisher's medal and goodie bag arrive at your home. Winners also receive a trophy, a prize and a premium ticket to race day on 14 March 2027.",
];
