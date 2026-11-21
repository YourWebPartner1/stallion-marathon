import type { Metadata } from "next";
import { FactLedger } from "@/components/official-run";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { WorkshopGrid } from "@/components/workshop-grid";
import { numberWord, TBA, workshopCount, workshops } from "@/lib/content";

// "To fill before launch" from the content document, in its order.
const details = [
  { label: "Dates", value: "Coming soon", note: "For all workshops" },
  { label: "Venue", value: TBA, note: "In Hyderabad" },
  { label: "Speakers", value: TBA },
  { label: "Seat limits", value: TBA, note: "Per session; groups of 30 to 100" },
  { label: "Official Run runners", value: TBA, note: "Whether race-day runners also attend free" },
];

export const metadata: Metadata = {
  alternates: { canonical: "/workshops" },
  title: { absolute: "Free Running and Wellbeing Workshops | Stallion Marathon" },
  description: `${numberWord(workshopCount.total)} free workshops on running, health, wildlife, money and safety for virtual run participants.`,
};

/** Workshops, in the reference's inner-page layout: heading with a ledger, a short intro, then the filterable grid. */
export default function WorkshopsPage() {
  const before = workshops.filter((w) => w.phase === "before").length;
  const after = workshops.length - before;
  return (
    <div className="theme-light bg-navy text-ink">
      <section className="px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Workshops"
          statement={["Learn before you run.", "Learn after you finish."]}
          aside={
            <CountLedger
              count={String(workshops.length)}
              caption="free sessions, in Hyderabad"
              rows={[
                { label: "Before the run", value: String(before).padStart(2, "0") },
                { label: "After the run", value: String(after).padStart(2, "0") },
                { label: "Group size", value: "30 to 100" },
                { label: "Cost", value: "Free" },
              ]}
            />
          }
        />
      </section>

      <section aria-label="About the workshops" className="px-[max(20px,2.78vw)] py-16">
        <div className="grid gap-y-6 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">The Stallion workshop series</p>
          <p className="display m-0 text-[clamp(24px,1.89vw,36px)] leading-[1.25] lg:col-span-6">
            A race is one day. These workshops are for the rest of your life. Small groups of 30 to 100, led by people who
            know the subject. Free for every Stallion Virtual Run participant who can join us in Hyderabad.
          </p>
          <p className="m-0 self-end text-base leading-[1.3] text-ink/60 lg:col-span-3 lg:text-right">
            Dates for all workshops are coming soon. Reserve your seat now and we&rsquo;ll be in touch.
          </p>
        </div>
      </section>

      <section aria-label="All workshops" className="px-[max(20px,2.78vw)] py-16">
        <WorkshopGrid workshops={workshops} />
      </section>

      <section aria-label="The details" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <FactLedger
          title="The details"
          aside={{ count: String(details.length), caption: "Announced before the workshops", link: { label: "Read the FAQ", href: "/faq" } }}
          rows={details}
        />
      </section>
    </div>
  );
}
