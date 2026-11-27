"use client";

import { useState, type CSSProperties } from "react";
import { ChessKnight } from "@/components/chess-knight";
import Link from "next/link";
import { motion } from "framer-motion";
import { FeaturedCardView } from "@/components/featured-chapters";
import { LiveCountdown } from "@/components/live-countdown";
import { Roll } from "@/components/roll";
import {
  bookHref,
  officialDistancePrices,
  officialTierInclusions,
  officialWorkshopNote,
  raceFacts,
  signaturePackages,
  site,
  studInclusions,
  studPackages,
  TBA,
  timers,
  venue,
} from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;
const FRAME = "clamp(20px, 2.6vw, 36px)";
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Gold-framed navy panel: race day on the left, the essentials on the right. */
export function RacePanel() {
  // Every row of the document's race-facts table, plus the contact line.
  const facts = [
    ...raceFacts,
    { label: "Contact", value: site.email ? `${site.phone}, ${site.email}` : site.phone },
  ];

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
          {/* The live countdown the content document asks for on this page. */}
          <LiveCountdown spec={timers.race} size="large" />
          <span aria-hidden className="flex w-[clamp(140px,15.5vw,220px)] items-center gap-3">
            <span className="h-px flex-1 bg-[#f2b705]/50" />
            <ChessKnight className="text-[20px] text-[#f2b705]" />
            <span className="h-px flex-1 bg-[#f2b705]/50" />
          </span>
          <p className="m-0 text-xl text-[#f2b705]">{venue.name}</p>
          <p className="m-0 max-w-sm text-base leading-[1.3] text-[#f8f3fe]/60">{venue.address}</p>
        </div>

        <span aria-hidden className="w-px self-stretch bg-[#f8f3fe]/20 max-[900px]:h-px max-[900px]:w-full" />

        <dl className="m-0 flex w-full flex-1 flex-col">
          <p className="m-0 pb-2 text-sm text-[#f8f3fe]/60">The essentials</p>
          {facts.map((f) => (
            <div key={f.label} className="grid grid-cols-[minmax(110px,40%)_1fr] gap-4 border-b border-[#f2b705]/80 py-4">
              <dt className="text-sm text-[#f8f3fe]/60">{f.label}</dt>
              <dd className={`m-0 text-lg leading-[1.3] ${f.value === TBA ? "italic text-[#f8f3fe]/60" : ""}`}>{f.value}</dd>
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

/* ---------- Official Run Packages (Stud, 5–21 km tiers, Signature & VIP) ---------- */

type TierKey = "basic" | "standard" | "premium";

const TIERS: { key: TierKey; label: string; tagline: string; highlight?: boolean }[] = [
  { key: "basic", label: "Basic", tagline: "Fun run · untimed" },
  { key: "standard", label: "Standard", tagline: "Timed · medal & kit", highlight: true },
  { key: "premium", label: "Premium", tagline: "Buffet · home BIB · bottle" },
];

function CellValue({ val, dark }: { val: string | boolean; dark?: boolean }) {
  if (val === true) {
    return (
      <span aria-label="Included" className={`inline-flex items-center justify-center font-medium ${dark ? "text-[#f2b705]" : "text-[#3b1f8e]"}`}>
        ✓
      </span>
    );
  }
  if (val === false) {
    return (
      <span aria-label="Not included" className={dark ? "text-[#f8f3fe]/30" : "text-ink/25"}>
        —
      </span>
    );
  }
  return <span className="text-sm leading-[1.3]">{val}</span>;
}

/**
 * All Official Run packages in three editorial bands:
 *  A. Stud — Kids under 12 (1 km, 2 km, 3 km)
 *  B. 5–21 km Packages (Basic, Standard, Premium pricing + inclusion comparison)
 *  C. Signature & VIP Packages (Clydesdale, Mustang, Black Stallion VIP)
 */
export function OfficialPackages() {
  const [selectedTier, setSelectedTier] = useState<TierKey | null>("standard");

  return (
    <div className="flex flex-col gap-24">
      {/* A. Stud Packages — Kids under 12 */}
      <div className="flex flex-col gap-10">
        <header className="grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="flex flex-col gap-3 lg:col-span-7">
            <span className="label text-gold">Part A · Kids under 12</span>
            <h2 className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em]">
              Stud packages
            </h2>
          </div>
          <p className="m-0 self-end text-base leading-[1.35] text-ink/70 lg:col-span-5 lg:col-start-8 lg:text-right">
            One distance, one package. A fun run for our young champions across 1 km, 2 km and 3 km.
          </p>
        </header>

        <motion.div
          className="grid gap-px bg-[#3b1f8e] p-px md:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease }}
        >
          {studPackages.map((pkg, i) => (
            <article key={pkg.distance} className="flex">
              <FeaturedCardView
                card={{
                  label: `Stud · 0${i + 1}`,
                  mark: `${pkg.km}K`,
                  title: pkg.distance,
                  meta: [rupees(pkg.price), "Fun run", "Kids under 12"],
                  href: bookHref,
                }}
              />
            </article>
          ))}
        </motion.div>

        {/* Stud inclusions strip */}
        <div className="grid gap-y-6 border-y border-ink/20 py-8 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Included in all Stud runs</p>
          <dl className="m-0 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-4">
            {studInclusions.map((inc) => (
              <div key={inc.label} className="flex flex-col gap-1 border-l border-ink/15 pl-3">
                <dt className="text-xs uppercase tracking-[0.12em] text-ink/60">{inc.label}</dt>
                <dd className="m-0 text-base leading-[1.25] text-ink">
                  {inc.value === true ? "Included" : inc.value === false ? "Not included" : inc.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* B. 5–21 km Packages (Basic, Standard, Premium) */}
      <div className="flex flex-col gap-10">
        <header className="grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="flex flex-col gap-3 lg:col-span-7">
            <span className="label text-gold">Part B · Three tiers, six distances</span>
            <h2 className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em]">
              5–21 km packages
            </h2>
          </div>
          <div className="flex flex-col items-start gap-4 self-end lg:col-span-5 lg:col-start-8 lg:items-end">
            <p className="m-0 text-base leading-[1.35] text-ink/70 lg:text-right">
              Pick your distance, pick your tier. Click a tier column to highlight its prices and inclusions.
            </p>
            <Link href={bookHref} className="group inline-flex items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
              <Roll text="Book your distance" under="text-gold" />
              <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>
        </header>

        {/* Tier highlight pills (especially helpful on smaller screens) */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs uppercase tracking-[0.16em] text-ink/60">Highlight tier:</span>
          {TIERS.map((t) => {
            const active = selectedTier === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setSelectedTier(active ? null : t.key)}
                className={`cursor-pointer border px-4 py-2 text-sm transition-colors ${
                  active
                    ? "border-[#3b1f8e] bg-[#3b1f8e] text-[#f2b705]"
                    : "border-ink/25 bg-transparent text-ink hover:border-[#3b1f8e]"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Pricing table */}
        <div className="overflow-x-auto border border-[#3b1f8e]">
          <table className="w-full min-w-[540px] border-collapse text-left">
            <thead>
              <tr className="bg-[#3b1f8e] text-[#f8f3fe]">
                <th scope="col" className="px-5 py-5 text-xs font-normal uppercase tracking-[0.18em] text-[#f8f3fe]/70">
                  Distance
                </th>
                {TIERS.map((t) => {
                  const active = selectedTier === t.key;
                  return (
                    <th
                      key={t.key}
                      scope="col"
                      className={`px-5 py-5 text-right transition-colors ${
                        active ? "bg-[#f2b705] text-[#3b1f8e]" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedTier(active ? null : t.key)}
                        className="ml-auto flex cursor-pointer flex-col items-end border-0 bg-transparent p-0 text-right text-inherit"
                      >
                        <span className="label">{t.label}</span>
                        <span className={`mt-1 text-xs font-normal ${active ? "text-[#3b1f8e]/80" : "text-[#f8f3fe]/60"}`}>
                          {t.tagline}
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {officialDistancePrices.map((row) => (
                <tr key={row.distance} className="border-t border-ink/15 transition-colors hover:bg-[#3b1f8e]/[0.03]">
                  <th scope="row" className="display px-5 py-5 text-[clamp(24px,2vw,34px)] font-normal leading-none">
                    {row.distance}
                  </th>
                  {TIERS.map((t) => {
                    const active = selectedTier === t.key;
                    return (
                      <td
                        key={t.key}
                        className={`px-5 py-5 text-right text-[clamp(18px,1.4vw,24px)] tabular-nums transition-colors ${
                          active ? "bg-[#f2b705]/15 font-medium text-[#3b1f8e]" : "text-ink/85"
                        }`}
                      >
                        {rupees(row[t.key])}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inclusions comparison table */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="display m-0 text-[clamp(28px,2.2vw,40px)] leading-none">What each tier includes</h3>
            <p className="m-0 text-sm text-ink/60">5 km and above · Basic, Standard &amp; Premium</p>
          </div>
          <div className="overflow-x-auto border border-[#3b1f8e]">
            <table className="w-full min-w-[600px] border-collapse text-left">
              <thead>
                <tr className="bg-[#3b1f8e] text-[#f8f3fe]">
                  <th scope="col" className="w-[34%] px-5 py-4 text-xs font-normal uppercase tracking-[0.18em] text-[#f8f3fe]/70">
                    Inclusion
                  </th>
                  {TIERS.map((t) => {
                    const active = selectedTier === t.key;
                    return (
                      <th
                        key={t.key}
                        scope="col"
                        className={`w-[22%] px-5 py-4 text-center text-xs font-normal uppercase tracking-[0.18em] transition-colors ${
                          active ? "bg-[#f2b705] font-medium text-[#3b1f8e]" : "text-[#f8f3fe]"
                        }`}
                      >
                        {t.label}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {officialTierInclusions.map((row) => (
                  <tr key={row.label} className="border-t border-ink/15 transition-colors hover:bg-[#3b1f8e]/[0.03]">
                    <th scope="row" className="px-5 py-3.5 text-base font-normal text-ink">
                      {row.label}
                    </th>
                    {TIERS.map((t) => {
                      const active = selectedTier === t.key;
                      return (
                        <td
                          key={t.key}
                          className={`px-5 py-3.5 text-center transition-colors ${
                            active ? "bg-[#f2b705]/15 text-[#3b1f8e]" : "text-ink/80"
                          }`}
                        >
                          <CellValue val={row[t.key]} />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="m-0 text-sm italic text-ink/65">{officialWorkshopNote}</p>
        </div>
      </div>

      {/* C. Signature & VIP Packages (Clydesdale, Mustang, Black Stallion VIP) */}
      <div className="flex flex-col gap-10">
        <header className="grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
          <div className="flex flex-col gap-3 lg:col-span-7">
            <span className="label text-gold">Part C · Any race category</span>
            <h2 className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em]">
              Signature &amp; VIP packages
            </h2>
          </div>
          <p className="m-0 self-end text-base leading-[1.35] text-ink/70 lg:col-span-5 lg:col-start-8 lg:text-right">
            All-inclusive race experiences with home BIB delivery, pick-up &amp; drop, comprehensive health checkups, and
            private VIP access.
          </p>
        </header>

        <motion.div
          className="grid gap-px bg-[#3b1f8e] p-px lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.9, ease }}
        >
          {signaturePackages.map((pkg) => {
            const dark = !!pkg.featured;
            return (
              <article
                key={pkg.id}
                className={`flex flex-col justify-between gap-8 p-[clamp(24px,2.4vw,40px)] ${
                  dark ? "bg-[#3b1f8e] text-[#f8f3fe]" : "bg-navy text-ink"
                }`}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`label ${
                        dark
                          ? "bg-[#f2b705] px-2.5 py-1 text-[#3b1f8e]"
                          : "text-gold"
                      }`}
                    >
                      {pkg.badge}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 border-b pb-6 border-current/20">
                    <h3 className="display m-0 text-[clamp(34px,2.8vw,52px)] leading-none tracking-[-0.02em]">
                      {pkg.name}
                    </h3>
                    <p
                      className={`display m-0 text-[clamp(30px,2.4vw,44px)] leading-none tabular-nums ${
                        dark ? "text-[#f2b705]" : "text-gold"
                      }`}
                    >
                      {rupees(pkg.price)}
                    </p>
                    <p className={`m-0 mt-2 text-sm leading-[1.45] ${dark ? "text-[#f8f3fe]/75" : "text-ink/70"}`}>
                      {pkg.subtitle}
                    </p>
                  </div>

                  <div className="flex flex-col gap-5">
                    {pkg.groups.map((g) => (
                      <div key={g.title} className="flex flex-col gap-2">
                        <h4
                          className={`m-0 text-xs font-medium uppercase tracking-[0.16em] ${
                            dark ? "text-[#f2b705]" : "text-gold"
                          }`}
                        >
                          {g.title}
                        </h4>
                        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
                          {g.items.map((item) => (
                            <li
                              key={item}
                              className={`flex items-baseline gap-2.5 text-sm leading-[1.4] ${
                                dark ? "text-[#f8f3fe]/90" : "text-ink/85"
                              }`}
                            >
                              <span
                                aria-hidden
                                className={`block size-1.5 shrink-0 translate-y-[-0.15em] rotate-45 ${
                                  dark ? "bg-[#f2b705]" : "bg-gold"
                                }`}
                              />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <Link
                  href={bookHref}
                  className={`group flex items-center justify-between gap-4 px-5 py-4 text-base font-medium tracking-[-0.01em] transition-colors duration-300 ${
                    dark
                      ? "bg-[#f2b705] text-[#3b1f8e] hover:bg-[#f8f3fe]"
                      : "bg-[#3b1f8e] text-[#f8f3fe] hover:bg-[#f2b705] hover:text-[#3b1f8e]"
                  }`}
                >
                  <span>Book {pkg.name}</span>
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </article>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
