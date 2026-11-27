import { ButtonLink } from "@/components/button-link";

/**
 * A homepage teaser in the reference band style: a large figure on the left,
 * the document's teaser line in the middle, and its button on the right,
 * between ink rules.
 */
export function TeaserBand({
  id,
  figure,
  figureCaption,
  lines,
  note,
  cta,
}: {
  id: string;
  figure: string;
  figureCaption: string;
  lines: string[];
  note?: string;
  cta: { label: string; href: string };
}) {
  return (
    <section
      aria-labelledby={id}
      className="teaser-band theme-light relative -mt-px bg-navy px-[max(20px,2.78vw)] pb-[max(64px,5.87vw)] text-ink"
    >
      <div className="grid items-end gap-x-6 gap-y-8 border-y border-ink py-14 lg:grid-cols-12">
        <div className="flex flex-col gap-2 lg:col-span-3">
          <span className="caps text-[clamp(64px,5.5vw,104px)] leading-[0.85]">{figure}</span>
          <span className="text-sm text-ink/60">{figureCaption}</span>
        </div>
        <div className="flex flex-col gap-3 lg:col-span-6">
          <h2 id={id} className="display m-0 text-[clamp(32px,3.15vw,60px)] leading-[1.05] tracking-[-0.02em]">
            {lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </h2>
          {note && <p className="m-0 text-lg leading-[1.35] text-ink/70">{note}</p>}
        </div>
        <div className="lg:col-span-3 lg:justify-self-end">
          <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
