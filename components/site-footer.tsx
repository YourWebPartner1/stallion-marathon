"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { bookHref, legalLinks, numberWord, site, workshopCount } from "@/lib/content";
import { FooterScene } from "@/components/footer-scene";
import { Crest } from "@/components/logo";
import { Roll } from "@/components/roll";

const ease = [0.16, 1, 0.3, 1] as const;
const PAINT = ["#f7b538", "#c98f2e", "#145a86", "#08335d"];

const places = [
  { href: bookHref, label: "Book your run", note: "Pick your distance and take your place." },
  { href: "/workshops", label: "Workshops", note: `${numberWord(workshopCount.total)} free sessions, before and after the run.` },
  { href: "/giving-back", label: "Giving Back", note: "A share of our profits goes to NGOs doing good work." },
];

// With the cards above, the crest (home) and the legal row, the footer links to every page.
const quickLinks = [
  { href: "/virtual-run", label: "Virtual Run" },
  { href: "/official-run", label: "Official Run" },
  { href: "/faq", label: "FAQ" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/contact", label: "Contact" },
];

/**
 * Footer in the reference layout: a giant title rising letter by letter, a
 * gold tagline, three cards with the four-colour hover curtain, a contact line
 * with quick links, the engraved race-day scene at the bottom edge, which the
 * pointer brushes gold, and a small credits row.
 */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const title = "Take your mark";

  return (
    <footer
      ref={ref}
      className="relative flex flex-col gap-16 overflow-hidden bg-[#08335d] px-[max(20px,2.78vw)] pb-[clamp(16px,1.39vw,20px)] pt-[max(96px,8.33vw)] text-[#fdffff] [container-type:inline-size]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[74cqw] -translate-x-1/2 max-[760px]:[mask-image:linear-gradient(#000_88%,transparent)] max-[760px]:bottom-[174px] max-[760px]:w-[132cqw]"
      >
        <FooterScene area={ref} className="relative w-full" />
      </div>

      <div className="relative z-[1] flex flex-col items-start gap-6">
        <Link href="/" aria-label="Stallion Marathon, home" className="group">
          <Crest height={91} className="bg-[#f7b538] transition-colors group-hover:bg-[#fdffff]" />
        </Link>
        <motion.p
          aria-label={title}
          className="caps m-0 whitespace-nowrap text-[clamp(56px,8.4vw,210px)] leading-[0.9] tracking-[-0.01em] max-[760px]:text-[clamp(44px,13vw,96px)]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          {Array.from(title).map((ch, i) => (
            <span
              key={i}
              aria-hidden
              // Word gaps at a normal reading width; the condensed face makes a plain space too narrow.
              className={`inline-block overflow-hidden py-[0.14em] align-top -my-[0.14em] ${ch === " " ? "w-[0.3em]" : ""}`}
            >
              <motion.span
                className="inline-block"
                variants={{
                  hidden: { y: "110%" },
                  show: { y: "0%", transition: { duration: 1.1, ease, delay: i * 0.035 } },
                }}
              >
                {ch === " " ? " " : ch}
              </motion.span>
            </span>
          ))}
        </motion.p>
        {/* The document's one-line pitch; the tagline itself closes the homepage just above. */}
        <p className="display m-0 max-w-[24ch] text-[clamp(28px,2.31vw,44px)] leading-[1.1] tracking-[-0.02em] text-[#f7b538]">
          {site.pitch}
        </p>
      </div>

      <nav aria-label="Footer" className="relative z-[1] grid grid-cols-3 gap-6 max-[760px]:grid-cols-1">
        {places.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group relative isolate flex min-h-[clamp(168px,12vw,240px)] flex-col gap-2 overflow-hidden bg-[#fdffff] p-10 text-[#08335d] transition-[translate,color] duration-[800ms,250ms] ease-[cubic-bezier(0.16,1,0.3,1)] [transition-delay:0ms,120ms] max-[760px]:min-h-0 max-[760px]:p-6 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-2 [@media(hover:hover)_and_(pointer:fine)]:hover:text-[#f7b538] focus-visible:-translate-y-2 focus-visible:text-[#f7b538]"
          >
            {PAINT.map((color, i) => (
              <span
                key={color}
                aria-hidden
                className="pointer-events-none absolute inset-0 -z-10 origin-top scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transition-delay:var(--out)] group-hover:scale-y-100 group-hover:[transition-delay:var(--in)] group-focus-visible:scale-y-100 group-focus-visible:[transition-delay:var(--in)]"
                style={{ background: color, "--in": `${i * 45}ms`, "--out": `${(3 - i) * 45}ms` } as React.CSSProperties}
              />
            ))}
            <span aria-hidden className="block size-1.5 rotate-45 bg-[#f7b538]" />
            <span className="display mt-auto text-[clamp(30px,2.31vw,44px)] leading-[1.05] tracking-[-0.02em]">
              {p.label}
            </span>
            <span className="text-sm font-light leading-[1.2] text-pretty">{p.note}</span>
          </Link>
        ))}
      </nav>

      <div className="relative z-[1] flex items-end justify-between gap-x-16 gap-y-6 max-[760px]:flex-col max-[760px]:items-start">
        <div className="flex flex-col gap-2">
          <p className="m-0 text-sm text-[#fdffff]/60">Call the team</p>
          <a
            href={`tel:+91${site.phone}`}
            className="group display max-[760px]:inline-flex max-[760px]:min-h-11 max-[760px]:items-center text-[clamp(30px,2.31vw,44px)] leading-[1.05] tracking-[-0.02em]"
          >
            <Roll text={site.phoneDisplay} under="text-[#f7b538]" />
          </a>
          {/* Email, as the document lists for the footer; shown once a dedicated address exists. */}
          {site.email ? (
            <a href={`mailto:${site.email}`} className="text-lg text-[#fdffff]/80 underline underline-offset-4 hover:text-[#f7b538]">
              {site.email}
            </a>
          ) : (
            <p className="m-0 text-base text-[#fdffff]/60">
              Email: <span className="italic">To be announced</span>
            </p>
          )}
        </div>
        <ul className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-2 p-0">
          {quickLinks.map((l, i) => (
            <li key={l.href} className="flex items-center gap-4">
              {i > 0 && <span aria-hidden className="block size-1 rotate-45 bg-[#f7b538]" />}
              <Link href={l.href} className="group inline-flex items-center text-[clamp(22px,1.57vw,30px)] max-[760px]:min-h-11 font-light tracking-[-0.01em]">
                <Roll text={l.label} under="text-[#f7b538]" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Room for the artwork rising from the bottom edge. */}
      <div aria-hidden className="h-[max(40px,calc(37cqw-250px))] max-[760px]:h-[66cqw]" />

      <div className="relative z-[1] flex flex-wrap items-end justify-between gap-3 text-sm font-light text-[#fdffff]/60">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-0 min-[761px]:max-w-[11.5rem] min-[761px]:flex-col min-[761px]:items-start min-[761px]:gap-y-1.5">
          <p className="m-0 max-[760px]:w-full">© 2026 {site.organiser}</p>
          {legalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-[3px] transition-colors hover:text-[#f7b538] min-[761px]:min-h-0"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <p className="m-0">
          A project by{" "}
          <a
            href="https://www.mayaverse.business/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center underline decoration-1 underline-offset-[3px] transition-colors hover:text-[#f7b538] min-[761px]:min-h-0"
          >
            MAYAVERSE
          </a>
        </p>
      </div>
    </footer>
  );
}
