"use client";

import { FitText } from "@/components/fit-text";
import { ButtonLink } from "@/components/button-link";
import { bookHref, site } from "@/lib/content";

/**
 * The document's final call to action, last before the footer: "Chapter I
 * starts now." edge to edge, the tagline, and the Book your run button.
 */
export function ClosingCta() {
  return (
    <section
      aria-labelledby="closing-title"
      className="theme-light relative -mt-px flex flex-col items-center gap-10 bg-navy px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-[max(64px,5.87vw)] text-center text-ink"
    >
      <h2 id="closing-title" className="caps m-0 w-full text-[12vw] leading-[0.9] text-ink">
        <FitText lines={["Chapter I starts now."]} align="center" />
      </h2>
      <p className="display m-0 text-[clamp(28px,2.83vw,54px)] leading-[1.1] tracking-[-0.02em] text-gold">
        How&rsquo;s your horsepower?
      </p>
      <ButtonLink href={bookHref}>Book your run, from ₹599</ButtonLink>
      <p className="m-0 text-base text-ink/70">
        Questions?{" "}
        <a href={`tel:+91${site.phone}`} className="underline underline-offset-4 hover:text-gold">
          +91 70757 01406
        </a>
      </p>
    </section>
  );
}
