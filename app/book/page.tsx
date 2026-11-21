import type { Metadata } from "next";
import Link from "next/link";
import { BookPanel } from "@/components/book-panel";
import { FeaturedCardView } from "@/components/featured-chapters";
import { FactLedger } from "@/components/official-run";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { bookingSteps, TBA } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/book" },
  title: "Book Now",
  description: "Book the Stallion Virtual Run or race day at Gachibowli Stadium on the official website or BookMyShow.",
};

// Short labels for the five booking steps; the sentences are the confirmed wording.
const stepLabels = ["Chapter", "Distance", "Details", "Pay", "Confirm"];

/**
 * Book Now, in the reference's inner-page layout: heading, the two chapters as
 * cards, a gold-framed panel with both booking channels, the five booking
 * steps, and the terms line.
 */
export default function BookPage() {
  return (
    <div className="theme-light bg-navy text-ink">
      <section className="px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Book Now"
          statement={["Take your place", "at the start."]}
          aside={
            <CountLedger
              count="2"
              caption="chapters, two channels, same prices"
              rows={[
                { label: "Virtual Run", value: "From ₹599" },
                { label: "Official Run", value: TBA },
                { label: "Official website", value: "Primary" },
                { label: "BookMyShow", value: "Also on" },
              ]}
            />
          }
        />
      </section>

      <section aria-labelledby="chapter-title" className="px-[max(20px,2.78vw)] py-16">
        <div className="mb-10 grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
          <h2 id="chapter-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em] lg:col-span-7">
            Choose your chapter
          </h2>
          <p className="m-0 self-end text-base leading-[1.3] text-ink/60 lg:col-span-5 lg:col-start-8 lg:text-right">
            Book the Virtual Run or race day on the official website or on BookMyShow. Both show the same event names,
            distances and prices.
          </p>
        </div>
        <div className="grid gap-px bg-[#08335d] p-px md:grid-cols-2">
          {[
            {
              label: "Part one",
              mark: "I",
              title: "Virtual Run",
              meta: ["Starts 19 January 2027", "From ₹599", "See packages"],
              href: "/virtual-run#packages",
            },
            {
              label: "Part two",
              mark: "II",
              title: "Official Run",
              meta: ["Sunday 14 March 2027", `Prices ${TBA.toLowerCase()}`, "See race day"],
              href: "/official-run",
            },
          ].map((c) => (
            <article key={c.title} className="flex">
              <FeaturedCardView card={c} />
            </article>
          ))}
        </div>
      </section>

      <section aria-label="Where to book" className="px-[max(20px,2.78vw)] py-16">
        <BookPanel />
      </section>

      <section aria-label="How booking works" className="px-[max(20px,2.78vw)] py-16">
        <FactLedger
          title="How booking works"
          aside={{ count: String(bookingSteps.length), caption: "Steps", link: { label: "Read the FAQ", href: "/faq" } }}
          rows={bookingSteps.map((s, i) => ({ label: stepLabels[i] ?? `Step ${i + 1}`, value: s }))}
        />
      </section>

      <section aria-label="Terms" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <div className="grid gap-y-6 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Before you book</p>
          <p className="display m-0 text-[clamp(22px,1.68vw,32px)] leading-[1.3] lg:col-span-7">
            By booking you accept the{" "}
            <Link href="/waiver" className="underline decoration-gold underline-offset-4 hover:text-gold">
              participant waiver
            </Link>
            ,{" "}
            <Link href="/terms" className="underline decoration-gold underline-offset-4 hover:text-gold">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/refund-policy" className="underline decoration-gold underline-offset-4 hover:text-gold">
              refund policy
            </Link>
            . Tickets are non-refundable.
          </p>
        </div>
      </section>
    </div>
  );
}
