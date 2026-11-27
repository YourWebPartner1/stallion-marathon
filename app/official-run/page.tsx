import type { Metadata } from "next";
import { jsonLd, officialRunEvent } from "@/lib/structured-data";
import Link from "next/link";
import { FeaturedCardView } from "@/components/featured-chapters";
import { OfficialPackages, RacePanel } from "@/components/official-run";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { Roll } from "@/components/roll";
import { StartLineArt } from "@/components/start-line-art";
import { challenges, TBA, venue, workshopCount } from "@/lib/content";
import { ChessKnight } from "@/components/chess-knight";

export const metadata: Metadata = {
  alternates: { canonical: "/official-run" },
  title: { absolute: "Stallion Marathon 14 March 2027, Gachibowli Stadium" },
  description: "Hyderabad's race day starts behind a stallion. Choose your category and book.",
};

/**
 * Official Run, in the reference's inner-page layout: heading with the key
 * facts, a gold-framed panel with race day and the essentials, the stallion
 * start, the race card ledger, the premium ticket and the race-day extras.
 */
export default function OfficialRunPage() {
  return (
    <div className="theme-light bg-navy text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(officialRunEvent) }} />
      <section className="flex flex-col gap-16 px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Race Day"
          label="Stallion Marathon, Chapter I: Race Day"
          statement={["Race day is 14 March.", "Be on the line."]}
          aside={
            <CountLedger
              count="14.03"
              caption="Sunday 14 March 2027"
              rows={[
                { label: "Venue", value: venue.name },
                { label: "Runners", value: "Up to 30,000" },
                { label: "Flag-off", value: TBA },
                { label: "Bookings", value: "Website, BookMyShow" },
              ]}
            />
          }
        />
        {/* Intro copy, word for word from the content document. */}
        <div className="grid gap-y-6 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Chapter I · Race Day</p>
          <p className="display m-0 text-[clamp(24px,1.89vw,36px)] leading-[1.25] lg:col-span-7">
            Chapter I of the Stallion Marathon comes to Gachibowli Stadium on Sunday 14 March 2027. Thousands of
            Hyderabad&rsquo;s runners, one start line, and a race that begins behind a stallion. Pick your distance, book your
            place, and find out how your horsepower holds up.
          </p>
        </div>
      </section>

      <section aria-label="Race day and the essentials" className="px-[max(20px,2.78vw)] py-16">
        <RacePanel />
      </section>

      {/* The stallion start */}
      <section aria-labelledby="start-title" className="px-[max(20px,2.78vw)] py-16">
        <div className="grid items-center gap-x-6 gap-y-12 lg:grid-cols-12">
          <div className="theme-dark lg:col-span-6">
            <StartLineArt />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
            <span aria-hidden className="flex w-[clamp(140px,15.5vw,220px)] items-center gap-3">
              <span className="h-px flex-1 bg-gold/40" />
              <ChessKnight className="text-[22px] text-gold" />
              <span className="h-px flex-1 bg-gold/40" />
            </span>
            <h2 id="start-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em]">
              The stallion start
            </h2>
            <p className="display m-0 text-[clamp(22px,1.57vw,30px)] leading-[1.25] text-ink/80">
              The race is flagged off by a stallion. An equestrian on horseback leads the runners away from the line, in
              place of the usual lead cyclist.
            </p>
          </div>
        </div>
      </section>

      <section id="packages" aria-label="Race categories and packages" className="scroll-mt-32 px-[max(20px,2.78vw)] py-16">
        <OfficialPackages />
      </section>

      {/* Premium ticket */}
      <section id="premium" aria-labelledby="premium-title" className="scroll-mt-32 px-[max(20px,2.78vw)] py-16">
        <div className="grid gap-y-8 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">For virtual run winners</p>
          <div className="flex flex-col gap-6 lg:col-span-6">
            <h2 id="premium-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em]">
              The premium ticket
            </h2>
            <p className="m-0 text-[clamp(18px,1.26vw,24px)] leading-[1.35] text-ink/80">
              Virtual run winners receive a Premium package ticket to this race and can choose any race category—including
              timed chip, buffet breakfast, home BIB delivery, general health check-up, metal-engraved water bottle, and
              any one workshop.
            </p>
          </div>
          <div className="self-end lg:col-span-3 lg:justify-self-end">
            <Link href="/virtual-run" className="group inline-flex items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
              <Roll text="Earn yours in the virtual run" under="text-gold" />
              <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Race-day extras */}
      <section aria-labelledby="more-title" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <h2 id="more-title" className="display m-0 mb-10 border-b border-ink pb-10 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em]">
          More than a morning
        </h2>
        <div className="grid gap-px bg-[#3b1f8e] p-px lg:grid-cols-3">
          {[
            { label: "Free sessions", mark: String(workshopCount.total), title: "Workshops", meta: ["Before and after the run"], href: "/workshops" },
            {
              label: "Sector Challenges",
              mark: String(challenges.length),
              title: "Challenges",
              meta: ["Organisations compete for the most bookings"],
              href: "/volunteers#challenges",
            },
            { label: "A share of profits", mark: "NGO", title: "Giving Back", meta: ["Supporting NGOs doing good work"], href: "/giving-back" },
          ].map((c) => (
            <article key={c.title} className="flex">
              <FeaturedCardView card={c} />
            </article>
          ))}
        </div>

        {/* Race-day logistics from the content document, to be filled from the final operations plan. */}
        <div className="mt-16 grid gap-y-6 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">On the day</p>
          <ul className="m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-3 p-0 lg:col-span-6">
            {["Venue map", "Parking", "Transport", "Baggage", "Hydration", "Medical help"].map((item, i) => (
              <li key={item} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden className="block size-1 rotate-45 bg-gold" />}
                <span className="display text-[clamp(22px,1.68vw,32px)] leading-[1.15]">{item}</span>
              </li>
            ))}
          </ul>
          <p className="m-0 self-end text-base italic leading-[1.3] text-ink/60 lg:col-span-3 lg:text-right">{TBA}</p>
        </div>
      </section>
    </div>
  );
}
