import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { GivingPie } from "@/components/giving-pie";
import { NgoPartners } from "@/components/ngo-partners";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { Roll } from "@/components/roll";
import { VetScene } from "@/components/vet-scene";
import { bookHref, causes } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/giving-back" },
  title: "Giving Back",
  description: "A share of Stallion Marathon profits goes to NGOs working on the four pillars of D.E.R.A. Every run counts twice.",
};

const PAINT = ["#f2b705", "#c99400", "#ab71e3", "#3b1f8e"];

/**
 * Giving Back, in the reference's inner-page layout: heading with the four
 * pillars, an intro band, the D.E.R.A. cards with the hover curtain, and a
 * closing band.
 */
export default function GivingBackPage() {
  return (
    <div className="theme-light bg-navy text-ink">
      <section className="px-[max(20px,2.78vw)] pb-16 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Giving Back"
          statement={["Your feet carry you.", "Your entry carries them."]}
          aside={
            <CountLedger
              count={String(causes.length)}
              caption="causes our giving supports"
              rows={causes.map((c, i) => ({ label: c.title, value: String(i + 1).padStart(2, "0") }))}
            />
          }
        />
      </section>

      <section aria-label="About giving back" className="px-[max(20px,2.78vw)] py-16">
        <div className="theme-dark grid items-center gap-x-6 gap-y-10 px-[clamp(20px,4vw,72px)] py-[clamp(40px,4.5vw,80px)] lg:grid-cols-12">
          <div className="lg:col-span-6">
            <GivingPie className="max-w-[640px]" />
          </div>
          <div className="flex flex-col gap-5 lg:col-span-5 lg:col-start-8">
            <p className="m-0 text-sm text-ink/70">Run for something</p>
            <p className="display m-0 text-[clamp(26px,2.31vw,44px)] leading-[1.2] tracking-[-0.01em]">
              Stallion&rsquo;s profits go to animal care, children&rsquo;s schooling and the NGOs who do this work every
              day. Every booking, every kilometre.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="care-title"
        className="theme-dark overflow-hidden px-[max(20px,2.78vw)] pb-[max(56px,5vw)] pt-[max(64px,5.87vw)]"
      >
        <div className="mb-12 grid gap-y-5 lg:grid-cols-12 lg:gap-x-6">
          <h2 id="care-title" className="display m-0 text-[clamp(36px,3.36vw,64px)] leading-[1.05] tracking-[-0.02em] lg:col-span-7">
            Kind hands for the animals on our streets and in the wild.
          </h2>
          <a
            href="#animal-care"
            className="group inline-flex w-fit items-baseline gap-2 self-end text-xl leading-[1.2] tracking-[-0.01em] lg:col-span-5 lg:justify-self-end"
          >
            <Roll text="Animal care" under="text-gold" />
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-y-1">
              ↓
            </span>
          </a>
        </div>
        <VetScene className="mx-auto max-w-[1320px]" />
        <NgoPartners className="mt-[max(48px,4.5vw)]" />
      </section>

      <section id="causes" aria-labelledby="dera-title" className="scroll-mt-24 px-[max(20px,2.78vw)] py-16">
        <div className="mb-10 grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
          <h2 id="dera-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em] lg:col-span-7">
            Our causes
          </h2>
          <p className="m-0 self-end text-base leading-[1.3] text-ink/60 lg:col-span-5 lg:col-start-8 lg:text-right">
            Where your entry goes, and who does the work.
          </p>
        </div>

        <ul className="m-0 grid list-none gap-px bg-[#3b1f8e] p-px sm:grid-cols-2 lg:grid-cols-4">
          {causes.map((p, i) => (
            <li
              key={p.id}
              id={p.id}
              className="group relative isolate flex scroll-mt-24 min-h-[clamp(420px,30vw,560px)] flex-col overflow-hidden bg-navy p-6 text-ink transition-colors duration-[250ms] [transition-delay:120ms] [container-type:inline-size] hover:text-[#f2b705]"
            >
              {PAINT.map((color, j) => (
                <span
                  key={color}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 origin-top scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transition-delay:var(--out)] group-hover:scale-y-100 group-hover:[transition-delay:var(--in)]"
                  style={{ background: color, "--in": `${j * 70}ms`, "--out": `${(3 - j) * 70}ms` } as CSSProperties}
                />
              ))}
              <span className="label opacity-60">Cause {String(i + 1).padStart(2, "0")}</span>
              <span aria-hidden className="caps grid flex-1 place-items-center text-[44cqw] leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="display m-0 text-[clamp(26px,2.1vw,40px)] leading-[1.05] tracking-[-0.015em]">{p.title}</h3>
              <span aria-hidden className="mt-4 block h-px w-10 bg-current opacity-60" />
              <p className="m-0 mt-4 text-sm leading-[1.45] opacity-75">{p.body}</p>
              {p.partner && <p className="m-0 mt-3 text-sm leading-[1.35]">With {p.partner}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Book" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <div className="grid gap-y-8 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Every registration counts</p>
          <p className="display m-0 text-[clamp(24px,1.89vw,36px)] leading-[1.25] lg:col-span-6">
            Every registration supports this work. We&rsquo;ll share an update after race day.
          </p>
          <div className="self-end lg:col-span-3 lg:justify-self-end">
            <Link href={bookHref} className="group inline-flex items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
              <Roll text="Book your run" under="text-gold" />
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
