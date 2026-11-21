import type { Metadata } from "next";
import { ChallengeGrid, PrizePanel } from "@/components/challenges";
import { FactLedger } from "@/components/official-run";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { ButtonLink } from "@/components/ui";
import { challengeHref, challengeSteps, challenges, volunteerHref } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/volunteers" },
  title: { absolute: "Volunteer and Sector Challenges | Stallion Marathon" },
  description:
    "Volunteer at Stallion Marathon, or enter your organisation in the Corporate, Hospital, Pharmacy or Bank Challenge. The HR lead with the most bookings wins ₹50,000.",
};

// Short labels for the four entry steps; the sentences are the confirmed wording.
const stepLabels = ["Register", "Book", "Count", "Announce"];

/**
 * Volunteers, in the reference's inner-page layout: heading, the volunteer
 * sign-up band, then the Sector Challenges (prize panel, challenge cards and
 * how to enter).
 */
export default function VolunteersPage() {
  return (
    <div className="theme-light bg-navy text-ink">
      <section className="px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Volunteers"
          statement={["Run it, or help", "run it."]}
          aside={
            <CountLedger
              count={String(challenges.length)}
              caption="sector challenges, and a place for every volunteer"
              rows={[
                { label: "Volunteers", value: "Register below" },
                ...challenges.map((c) => ({
                  label: c.name.replace(" Challenge", ""),
                  value: c.banded ? "By headcount" : "One winner",
                })),
              ]}
            />
          }
        />
      </section>

      <section aria-labelledby="volunteer-title" className="px-[max(20px,2.78vw)] py-16">
        <div className="grid items-end gap-x-6 gap-y-8 border-y border-ink py-14 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-3">
            <p className="m-0 text-sm text-ink/60">Volunteer with us</p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-6">
            <h2 id="volunteer-title" className="display m-0 text-[clamp(32px,3.15vw,60px)] leading-[1.05] tracking-[-0.02em]">
              Help bring Chapter I to life.
            </h2>
            <p className="m-0 text-lg leading-[1.35] text-ink/70">
              Join the team behind Stallion Marathon. Register as a volunteer and we&rsquo;ll be in touch with roles and
              timings.
            </p>
          </div>
          <div className="lg:col-span-3 lg:justify-self-end">
            <ButtonLink href={volunteerHref}>Register as a volunteer</ButtonLink>
          </div>
        </div>
      </section>

      <section id="challenges" aria-label="About the challenges" className="scroll-mt-24 px-[max(20px,2.78vw)] py-16">
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
            link: { label: "Register your organisation", href: challengeHref },
          }}
          rows={challengeSteps.map((s, i) => ({ label: stepLabels[i] ?? `Step ${i + 1}`, value: s }))}
        />
      </section>
    </div>
  );
}
