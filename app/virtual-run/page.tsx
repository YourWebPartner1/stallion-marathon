import type { Metadata } from "next";
import { jsonLd, virtualRunEvent } from "@/lib/structured-data";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { FactLedger } from "@/components/official-run";
import { DistanceChart, PackageGrid, RunnerPanel, StepsLedger } from "@/components/virtual-run";
import { priceNote, TBA, tiers } from "@/lib/content";

// "Rules to publish" from the content document, in its order.
const virtualRules = [
  { label: "Choosing winners", value: TBA, note: "How winners are chosen, for example by time per distance" },
  { label: "Proof of run", value: TBA, note: "Accepted proof of run and tracking apps" },
  { label: "Delivery", value: TBA, note: "Delivery areas and timelines for medals and goodie bags" },
  { label: "One go", value: TBA, note: "Whether each run, and each day of the Two-Day Stallion, is completed in one go" },
  { label: "Refunds and transfers", value: TBA, note: "Refund and transfer policy" },
];

export const metadata: Metadata = {
  alternates: { canonical: "/virtual-run" },
  title: { absolute: "Virtual Run Republic Day 2027 | Stallion Marathon" },
  description: "Run 5 to 42 km anywhere from 19 January 2027. Medal and goodie bag delivered home. From ₹599.",
};

/**
 * Virtual Run, in the reference's inner-page layout: heading with a distance
 * ledger and a one-bar-per-package chart, a gold-framed panel for the dates
 * and what every runner gets, the packages grid, then how it works.
 */
export default function VirtualRunPage() {
  return (
    <div className="theme-light bg-navy text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(virtualRunEvent) }} />
      <section className="flex flex-col gap-16 px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Virtual Run"
          label="Stallion Virtual Run: Republic Day Edition"
          statement={["Run for the Republic.", "From wherever you are."]}
          aside={
            <CountLedger
              count={String(tiers.length)}
              caption="distances, Republic Day Edition"
              rows={tiers.map((t) => ({ label: t.name, value: `${t.km} km` }))}
            />
          }
        />
        {/* Intro copy, word for word from the content document. */}
        <div className="grid gap-y-6 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Republic Day Edition</p>
          <p className="display m-0 text-[clamp(24px,1.89vw,36px)] leading-[1.25] lg:col-span-7">
            Starting 19 January 2027, run your chosen distance, anywhere, at your own pace. On Republic Day, 26 January, we
            announce the winners. Every runner receives a finisher&rsquo;s medal and a goodie bag at home. Winners take home a
            prize, recognition and a trophy, and a premium ticket to the official Stallion Marathon on 14 March 2027.
          </p>
        </div>
        <DistanceChart />
      </section>

      <section aria-label="Dates and what every runner gets" className="px-[max(20px,2.78vw)] py-16">
        <RunnerPanel />
      </section>

      <section id="packages" aria-labelledby="packages-title" className="scroll-mt-32 px-[max(20px,2.78vw)] py-16">
        <div className="mb-10 grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
          <h2 id="packages-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em] lg:col-span-7">
            Choose your gait
          </h2>
          <p className="m-0 self-end text-base leading-[1.3] text-ink/60 lg:col-span-5 lg:col-start-8 lg:text-right">
            Every package includes a finisher&rsquo;s medal and a goodie bag shipped to your home.
            {priceNote && <> {priceNote}</>}
          </p>
        </div>
        <PackageGrid />
      </section>

      <section aria-label="How it works" className="px-[max(20px,2.78vw)] py-16">
        <StepsLedger />
      </section>

      {/* The five rules the content document lists to publish before launch; each
          shows "To be announced" until its detail is supplied. */}
      <section aria-label="Rules" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <FactLedger
          title="The rules"
          aside={{
            count: String(virtualRules.length),
            caption: "Published before the run starts",
            link: { label: "Read the terms", href: "/terms" },
          }}
          rows={virtualRules}
        />
      </section>
    </div>
  );
}
