import Link from "next/link";
import { PageHeading } from "@/components/page-heading";
import { Roll } from "@/components/roll";
import { ButtonLink } from "@/components/ui";

const ways = [
  { href: "/", label: "Home" },
  { href: "/virtual-run", label: "Virtual Run" },
  { href: "/official-run", label: "Official Run" },
  { href: "/book", label: "Book Now" },
];

/** 404, in the same inner-page layout as the rest of the site. */
export default function NotFound() {
  return (
    <div className="theme-light bg-navy text-ink">
      <section className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Wrong Turn"
          label="404 · Off course"
          statement={["This page has left the track.", "Head back to the start line."]}
          aside={
            <div className="flex flex-col gap-6">
              <ul className="m-0 flex list-none flex-col border-t border-ink/20 p-0">
                {ways.map((w) => (
                  <li key={w.href} className="border-b border-ink/20">
                    <Link href={w.href} className="group flex items-baseline justify-between gap-4 py-2 text-base leading-[1.25]">
                      <Roll text={w.label} under="text-gold" />
                      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <ButtonLink href="/" className="w-fit">
                Back to home
              </ButtonLink>
            </div>
          }
        />
      </section>
    </div>
  );
}
