"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { bookHref, heroArt, legalLinks, site } from "@/lib/content";
import { Crest } from "@/components/logo";
import { Roll } from "@/components/roll";

const ease = [0.16, 1, 0.3, 1] as const;
const PAINT = ["#f7b538", "#c98f2e", "#145a86", "#08335d"];

const places = [
  { href: bookHref, label: "Book your run", note: "Pick your distance and take your place." },
  { href: "/workshops", label: "Workshops", note: "Twelve free sessions, before and after the run." },
  { href: "/giving-back", label: "Giving Back", note: "10% of profits go to NGOs doing good work." },
];

// With the cards above, the crest (home) and the legal row, the footer links to every page.
const quickLinks = [
  { href: "/virtual-run", label: "Virtual Run" },
  { href: "/official-run", label: "Official Run" },
  { href: "/faq", label: "FAQ" },
  { href: "/challenges", label: "Challenges" },
  { href: "/contact", label: "Contact" },
];

/**
 * Footer in the reference layout: a giant title rising letter by letter, a
 * gold tagline, three cards with the four-colour hover curtain, a contact line
 * with quick links, the stallion artwork rising from the bottom edge, and a
 * small credits row.
 */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // The artwork grows up from the bottom edge as the footer comes into view.
  const artScale = useTransform(scrollYProgress, [0.3, 1], [0.86, 1]);
  const title = "Take your mark";

  // Spotlight over the artwork: follows the pointer with a little lag, opens when
  // the pointer is over the footer and closes when it leaves. Mouse and pen only.
  const artRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const footer = ref.current;
    const art = artRef.current;
    if (!footer || !art || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const target = { x: 50, y: 30, r: 0 };
    const cur = { x: 50, y: 30, r: 0 };
    let raf = 0;
    const tick = () => {
      cur.x += (target.x - cur.x) * 0.12;
      cur.y += (target.y - cur.y) * 0.12;
      cur.r += (target.r - cur.r) * 0.1;
      art.style.setProperty("--x", `${cur.x}%`);
      art.style.setProperty("--y", `${cur.y}%`);
      art.style.setProperty("--r", `${cur.r}px`);
      const settled = Math.abs(target.x - cur.x) < 0.05 && Math.abs(target.y - cur.y) < 0.05 && Math.abs(target.r - cur.r) < 0.5;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      const r = art.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width) * 100;
      target.y = ((e.clientY - r.top) / r.height) * 100;
      target.r = Math.max(180, r.width * 0.16);
      kick();
    };
    const onLeave = () => {
      target.r = 0;
      kick();
    };
    footer.addEventListener("pointermove", onMove);
    footer.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      footer.removeEventListener("pointermove", onMove);
      footer.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <footer
      ref={ref}
      className="relative flex flex-col gap-16 overflow-hidden bg-[#08335d] px-[max(20px,2.78vw)] pb-[clamp(16px,1.39vw,20px)] pt-[max(96px,8.33vw)] text-[#fdffff] [container-type:inline-size]"
    >
      {heroArt && (
        <motion.div
          ref={artRef}
          aria-hidden
          className="pointer-events-none absolute bottom-[-46cqw] left-1/2 z-0 w-[72cqw] -translate-x-1/2 origin-bottom will-change-transform max-[760px]:bottom-[-40cqw]"
          style={{ scale: artScale, "--x": "50%", "--y": "30%", "--r": "0px" } as unknown as React.CSSProperties}
        >
          {/* Dimmed, navy-toned version, so the footer text above it stays readable. */}
          <Image
            src={heroArt.src}
            alt=""
            width={heroArt.width}
            height={heroArt.height}
            sizes="72vw"
            className="h-auto w-full opacity-[0.22] [filter:grayscale(1)_brightness(1.15)]"
          />
          {/* Full-colour version, revealed in a soft spotlight that follows the pointer. */}
          <Image
            src={heroArt.src}
            alt=""
            width={heroArt.width}
            height={heroArt.height}
            sizes="72vw"
            className="absolute inset-0 h-auto w-full [mask-image:radial-gradient(circle_var(--r)_at_var(--x)_var(--y),#000_0%,#000_35%,transparent_100%)] [-webkit-mask-image:radial-gradient(circle_var(--r)_at_var(--x)_var(--y),#000_0%,#000_35%,transparent_100%)]"
          />
        </motion.div>
      )}

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
            className="group display text-[clamp(30px,2.31vw,44px)] leading-[1.05] tracking-[-0.02em]"
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
              <Link href={l.href} className="group text-[clamp(22px,1.57vw,30px)] font-light tracking-[-0.01em]">
                <Roll text={l.label} under="text-[#f7b538]" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Room for the artwork rising from the bottom edge. */}
      <div aria-hidden className="h-[32cqw] max-[760px]:h-[44cqw]" />

      <div className="relative z-[1] flex flex-wrap items-end justify-between gap-3 text-sm font-light text-[#fdffff]/60">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="m-0">© 2026 {site.organiser}</p>
          {legalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="underline decoration-1 underline-offset-[3px] transition-colors hover:text-[#f7b538]"
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
            className="underline decoration-1 underline-offset-[3px] transition-colors hover:text-[#f7b538]"
          >
            MAYAVERSE
          </a>
        </p>
      </div>
    </footer>
  );
}
