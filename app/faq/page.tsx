import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/accordion";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { Roll } from "@/components/roll";
import { faqs, site } from "@/lib/content";
import { faqPage, jsonLd } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: { canonical: "/faq" },
  title: "FAQ",
  description: "Answers about the Stallion Marathon virtual run, race day, workshops, challenges and payments.",
};

/**
 * FAQ, in the reference's inner-page layout: heading with a ledger of the
 * question groups, a sticky group index beside the questions, and a closing
 * band for anything not covered.
 */
export default function FaqPage() {
  const total = faqs.reduce((n, g) => n + g.items.length, 0);
  // Number questions straight through the page, not per group.
  const starts = faqs.map((_, i) => faqs.slice(0, i).reduce((n, g) => n + g.items.length, 0));

  return (
    <div className="theme-light bg-navy text-ink">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqPage) }} />
      <section className="px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Questions"
          statement={["Everything you need to know", "before you lace up."]}
          aside={
            <CountLedger
              count={String(total)}
              caption={`questions, in ${faqs.length} groups`}
              rows={faqs.map((g) => ({ label: g.group, value: String(g.items.length).padStart(2, "0") }))}
            />
          }
        />
      </section>

      <section aria-label="All questions" className="px-[max(20px,2.78vw)] py-16">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-6">
          <nav aria-label="FAQ sections" className="lg:col-span-3">
            <ul className="m-0 flex list-none flex-col border-t border-ink p-0 lg:sticky lg:top-28">
              {faqs.map((g) => (
                <li key={g.group} className="border-b border-ink/20">
                  <a
                    href={`#${slug(g.group)}`}
                    className="group flex items-baseline justify-between gap-4 py-3 text-[clamp(18px,1.26vw,24px)] tracking-[-0.01em]"
                  >
                    <Roll text={g.group} under="text-gold" />
                    <span className="text-sm tabular-nums text-ink/60">{String(g.items.length).padStart(2, "0")}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-20 lg:col-span-9">
            {faqs.map((g, i) => (
              <section key={g.group} aria-labelledby={slug(g.group)}>
                <h2
                  id={slug(g.group)}
                  className="display m-0 mb-6 scroll-mt-28 text-[clamp(32px,2.83vw,54px)] leading-none tracking-[-0.02em]"
                >
                  {g.group}
                </h2>
                <Accordion items={g.items} startIndex={starts[i]} />
              </section>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Still have a question" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <div className="grid gap-y-8 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Still have a question?</p>
          <div className="flex flex-col gap-2 lg:col-span-6">
            <p className="m-0 text-sm text-ink/60">Call the team</p>
            <a href={`tel:+91${site.phone}`} className="group display text-[clamp(36px,3.36vw,64px)] leading-none tracking-[-0.02em]">
              <Roll text={site.phoneDisplay} under="text-gold" />
            </a>
            {site.email && (
              <a href={`mailto:${site.email}`} className="mt-2 text-lg text-ink/75 underline underline-offset-4">
                {site.email}
              </a>
            )}
          </div>
          <div className="self-end lg:col-span-3 lg:justify-self-end">
            <Link href="/contact" className="group inline-flex items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
              <Roll text="Contact us" under="text-gold" />
              <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
