import Link from "next/link";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { Roll } from "@/components/roll";
import { legalLinks, site } from "@/lib/content";

export type LegalSection = { heading: string; body: string[] };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * Shared layout for Terms, Waiver, Refund Policy and Privacy, in the
 * reference's inner-page style: heading with a ledger of the sections, an intro
 * band, a sticky section index beside numbered sections, and links to the other
 * legal pages.
 */
export function LegalPage({
  eyebrow,
  word,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string;
  /** Short name shown as the giant title. */
  word: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <div className="theme-light bg-navy text-ink">
      <section className="px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title={word}
          statement={[`${title}.`]}
          aside={
            <CountLedger
              count={String(sections.length)}
              caption={`sections, last updated ${updated}`}
              rows={sections.map((s, i) => ({ label: s.heading, value: String(i + 1).padStart(2, "0") }))}
            />
          }
        />
      </section>

      <section aria-label="Introduction" className="px-[max(20px,2.78vw)] py-16">
        <div className="grid gap-y-6 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">
            {eyebrow} · Last updated {updated}
            <br />
            {site.legalName}
          </p>
          <p className="display m-0 text-[clamp(24px,1.89vw,36px)] leading-[1.25] lg:col-span-6">{intro}</p>
        </div>
      </section>

      <section aria-label={title} className="px-[max(20px,2.78vw)] py-16">
        <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-6">
          <nav aria-label="Sections" className="lg:col-span-3">
            <ol className="m-0 flex list-none flex-col border-t border-ink p-0 lg:sticky lg:top-28">
              {sections.map((s, i) => (
                <li key={s.heading} className="border-b border-ink/20">
                  <a href={`#${slug(s.heading)}`} className="group flex items-baseline gap-4 py-3 text-[clamp(16px,1.05vw,20px)]">
                    <span className="text-sm tabular-nums text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                    <Roll text={s.heading} under="text-gold" />
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <ol className="m-0 flex list-none flex-col border-t border-ink/20 p-0 lg:col-span-9">
            {sections.map((s, i) => (
              <li
                key={s.heading}
                id={slug(s.heading)}
                className="grid scroll-mt-28 grid-cols-12 gap-x-[clamp(8px,1.26vw,24px)] border-b border-ink/15 py-10"
              >
                <span className="col-span-1 pt-2 text-sm tabular-nums text-ink/60">{String(i + 1).padStart(2, "0")}</span>
                <div className="col-span-11 flex flex-col gap-4">
                  <h2 className="display m-0 text-[clamp(28px,2.31vw,44px)] leading-[1.05] tracking-[-0.02em]">{s.heading}</h2>
                  {s.body.map((p) => (
                    <p key={p} className="m-0 max-w-3xl text-lg leading-[1.5] text-ink/75">
                      {p}
                    </p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-label="Other legal pages" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <div className="grid gap-y-6 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Also read</p>
          <ul className="m-0 flex list-none flex-wrap items-center gap-x-5 gap-y-3 p-0 lg:col-span-9">
            {legalLinks.map((l, i) => (
              <li key={l.href} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden className="block size-1 rotate-45 bg-gold" />}
                <Link href={l.href} className="group text-[clamp(22px,1.57vw,30px)] tracking-[-0.01em]">
                  <Roll text={l.label} under="text-gold" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
