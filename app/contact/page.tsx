import type { Metadata } from "next";
import { ContactPanel } from "@/components/contact-panel";
import { FeaturedCardView } from "@/components/featured-chapters";
import { PageHeading } from "@/components/page-heading";
import { Roll } from "@/components/roll";
import { bookHref, challenges, faqs, site, tiers } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact",
  description: `Contact the ${site.organiser} on ${site.phone}.`,
};

/**
 * Contact, in the reference's inner-page layout: heading with the phone number
 * in the aside, a gold-framed panel with the details, and three cards that
 * point to the right place for common questions.
 */
export default function ContactPage() {
  const questions = faqs.reduce((n, g) => n + g.items.length, 0);
  return (
    <div className="theme-light bg-navy text-ink">
      <section className="px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Contact"
          statement={["Talk to the stable."]}
          aside={
            <div className="flex flex-col gap-2">
              <p className="m-0 text-base leading-[1.2] text-ink/60">Call the team</p>
              <a href={`tel:+91${site.phone}`} className="group caps text-[clamp(44px,3.99vw,76px)] leading-[0.9]">
                <Roll text={site.phoneDisplay} under="text-gold" />
              </a>
              <dl className="m-0 mt-4 flex flex-col border-t border-ink/20">
                {[
                  { label: "Organiser", value: site.organiser },
                  { label: "Email", value: site.email ?? "To be announced" },
                  { label: "Bookings", value: "Website, BookMyShow" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between gap-4 border-b border-ink/20 py-2 text-base leading-[1.25]">
                    <dt>{r.label}</dt>
                    <dd className="m-0 text-right text-ink/60">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          }
        />
      </section>

      <section aria-label="Contact details" className="px-[max(20px,2.78vw)] py-16">
        <ContactPanel />
      </section>

      <section aria-labelledby="help-title" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <h2 id="help-title" className="display m-0 mb-10 border-b border-ink pb-10 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em]">
          Find it faster
        </h2>
        <div className="grid gap-px bg-[#08335d] p-px lg:grid-cols-3">
          {[
            {
              label: "Questions answered",
              mark: String(questions),
              title: "Runner questions",
              meta: ["Booking, distances, medals and race day"],
              href: "/faq",
            },
            {
              label: "Sector Challenges",
              mark: String(challenges.length),
              title: "Register your team",
              meta: ["HR leads: register your organisation"],
              href: "/challenges",
            },
            {
              label: "Distances",
              mark: String(tiers.length),
              title: "Book your run",
              meta: ["Virtual run and race day, on this website and BookMyShow"],
              href: bookHref,
            },
          ].map((c) => (
            <article key={c.title} className="flex">
              <FeaturedCardView card={c} />
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
