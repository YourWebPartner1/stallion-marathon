import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { Roll } from "@/components/roll";
import { bookHref, deraPillars } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/giving-back" },
  title: "Giving Back",
  description: "10% of Stallion Marathon profits go to NGOs working on the four pillars of D.E.R.A. Every run counts twice.",
};

const PAINT = ["#f7b538", "#c98f2e", "#145a86", "#08335d"];

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
          statement={["Every run counts", "twice."]}
          aside={
            <CountLedger
              count="10%"
              caption="of profits to NGOs"
              rows={deraPillars.map((p) => ({ label: p.title, value: p.letter }))}
            />
          }
        />
      </section>

      <section aria-label="About giving back" className="px-[max(20px,2.78vw)] py-16">
        <div className="grid gap-y-6 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Run for something</p>
          <p className="display m-0 text-[clamp(24px,1.89vw,36px)] leading-[1.25] lg:col-span-6">
            When you run Stallion Marathon, you also give. We donate 10% of our profits to NGOs whose work matches four
            causes we care about.
          </p>
        </div>
      </section>

      <section aria-labelledby="dera-title" className="px-[max(20px,2.78vw)] py-16">
        <div className="mb-10 grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
          <h2 id="dera-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em] lg:col-span-7">
            D<span className="text-gold">.</span>E<span className="text-gold">.</span>R<span className="text-gold">.</span>A
            <span className="text-gold">.</span>
            <span className="sr-only"> The four pillars</span>
          </h2>
          <p className="m-0 self-end text-base leading-[1.3] text-ink/60 lg:col-span-5 lg:col-start-8 lg:text-right">
            The four pillars our giving supports.
          </p>
        </div>

        <ul className="m-0 grid list-none gap-px bg-[#08335d] p-px sm:grid-cols-2 lg:grid-cols-4">
          {deraPillars.map((p, i) => (
            <li
              key={p.letter}
              className="group relative isolate flex min-h-[clamp(420px,30vw,560px)] flex-col overflow-hidden bg-navy p-6 text-ink transition-colors duration-[250ms] [transition-delay:120ms] [container-type:inline-size] hover:text-[#f7b538]"
            >
              {PAINT.map((color, j) => (
                <span
                  key={color}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 -z-10 origin-top scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transition-delay:var(--out)] group-hover:scale-y-100 group-hover:[transition-delay:var(--in)]"
                  style={{ background: color, "--in": `${j * 70}ms`, "--out": `${(3 - j) * 70}ms` } as CSSProperties}
                />
              ))}
              <span className="label opacity-60">Pillar {String(i + 1).padStart(2, "0")}</span>
              <span aria-hidden className="caps grid flex-1 place-items-center text-[62cqw] leading-none">
                {p.letter}
              </span>
              <h3 className="display m-0 text-[clamp(26px,2.1vw,40px)] leading-[1.05] tracking-[-0.015em]">{p.title}</h3>
              <span aria-hidden className="mt-4 block h-px w-10 bg-current opacity-60" />
              <p className="m-0 mt-4 text-sm leading-[1.45] opacity-75">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="Book" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-16">
        <div className="grid gap-y-8 border-y border-ink py-14 lg:grid-cols-12 lg:gap-x-6">
          <p className="m-0 text-sm text-ink/60 lg:col-span-3">Every registration counts</p>
          <p className="display m-0 text-[clamp(24px,1.89vw,36px)] leading-[1.25] lg:col-span-6">
            Every registration supports this work. We&rsquo;ll name our partner NGOs and share an update after race day.
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
