import type { Metadata } from "next";
import { ChallengeGrid, PrizePanel } from "@/components/challenges";
import { FactLedger } from "@/components/official-run";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { challengeSteps, challenges } from "@/lib/content";

export const metadata: Metadata = {
  title: { absolute: "Corporate, Hospital, Pharmacy, Bank Run Challenges" },
  description: "Compete for your organisation. The HR lead with the most bookings wins ₹50,000.",
};

// Short labels for the four entry steps; the sentences are the confirmed wording.
const stepLabels = ["Register", "Book", "Count", "Announce"];

/**
 * Sector Challenges, in the reference's inner-page layout: heading with the
 * four challenges, an intro band, the gold-framed prize panel, the challenge
 * cards, then how to enter.
 */
export default function ChallengesPage() {
  return (
    <div className="theme-light bg-navy text-ink">
      <section className="px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Challenges"
          statement={["Which organisation", "runs hardest?"]}
          aside={
            <CountLedger
              count={String(challenges.length)}
              caption="sector challenges, ₹50,000 HR prize"
              rows={challenges.map((c) => ({
                label: c.name.replace(" Challenge", ""),
                value: c.banded ? "By headcount" : "One winner",
              }))}
            />
          }
        />
      </section>

      <section aria-label="About the challenges" className="px-[max(20px,2.78vw)] py-16">
        <div className="grid gap-y-6 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Sector Challenges</p>
          <p className="display m-0 text-[clamp(24px,1.89vw,36px)] leading-[1.25] lg:col-span-6">
            Stallion Marathon Sector Challenges turn team spirit into a friendly contest. Register your organisation, get your people booked,
            and compete against others in your sector. HR leaders, this one is yours to win.
          </p>
        </div>
      </section>

      <section aria-label="The prize" className="px-[max(20px,2.78vw)] py-16">
        <PrizePanel />
      </section>

      <section aria-labelledby="field-title" className="px-[max(20px,2.78vw)] py-16">
        <div className="mb-10 grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
          <h2 id="field-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em] lg:col-span-7">
            Find your field
          </h2>
          <p className="m-0 self-end text-base leading-[1.3] text-ink/60 lg:col-span-5 lg:col-start-8 lg:text-right">
            Headcount categories: organisations compete within their size band of 1,000 to 4,999, 5,000 to 9,999, or
            10,000 or more people.
          </p>
        </div>
        <ChallengeGrid />
      </section>

      <section aria-label="How to enter" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <FactLedger
          title="How to enter"
          aside={{
            count: String(challengeSteps.length),
            caption: "Steps",
            link: { label: "Register your organisation", href: "/contact" },
          }}
          rows={challengeSteps.map((s, i) => ({ label: stepLabels[i] ?? `Step ${i + 1}`, value: s }))}
        />
      </section>
    </div>
  );
}
