"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { bookHref } from "@/lib/content";
import { NextCountdown } from "@/components/countdown";
import { Crest } from "@/components/logo";
import { Roll } from "@/components/roll";
import { lenisRef } from "@/lib/lenis";

// Four large links, the rest in the smaller list on the left, mirroring the reference layout.
const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/virtual-run", label: "Virtual Run" },
  { href: "/official-run", label: "Official Run" },
  { href: "/workshops", label: "Workshops" },
  { href: "/schools", label: "Schools & Colleges" },
];
const secondaryLinks = [
  { href: "/volunteers", label: "Volunteers" },
  { href: "/giving-back", label: "Giving Back" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: bookHref, label: "Book Now" },
];
const ease = [0.76, 0, 0.24, 1] as const; // ease-in-out for the curtain
const easeOut = [0.16, 1, 0.3, 1] as const; // soft landing for text
const easeIn = [0.7, 0, 0.84, 0] as const; // quick exit
const curve = (c: readonly number[]) => `cubic-bezier(${c.join(", ")})`;
const barTransition =
  "transform 0.64s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.32s cubic-bezier(0.16, 1, 0.3, 1)";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const lastY = useRef(0);

  // Close the menu on navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Slides away while scrolling down and returns on the way back up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dy = y - lastY.current;
      // Ignore repeated events at the same position (smooth scroll re-sends them).
      setSolid(y > 80);
      if (Math.abs(dy) < 4) return;
      if (y <= 240) setHidden(false);
      else setHidden(dy > 0);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the menu is open, pause scrolling. Smooth scroll is stopped and native
  // wheel/touch scrolling is blocked, but the scrollbar stays put so nothing shifts.
  useEffect(() => {
    if (!open) return;
    lenisRef.current?.stop();
    const block = (e: Event) => {
      if (!(e.target as HTMLElement).closest?.("#site-menu")) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      lenisRef.current?.start();
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color] duration-500 ${hidden && !open ? "-translate-y-full" : "translate-y-0"
          } ${solid && !open ? "bg-[#1e1146]" : ""}`}
      >
        {/* Transparent at the top of the page; once scrolled it hides going down and comes back up on a solid bar, so it never sits over content. */}
        <div className={`flex items-center justify-between gap-6 px-[clamp(20px,2.78vw,64px)] transition-[padding] duration-500 ${solid ? "py-3 sm:py-4" : "pb-4 pt-12 sm:pb-5 sm:pt-[52px]"}`}>
          <Link href="/" aria-label="Stallion Marathon, home" className="group block">
            <span className="hidden sm:block">
              <Crest height={57} className="bg-gold group-hover:bg-ink" />
            </span>
            <span className="sm:hidden">
              <Crest height={46} className="bg-gold group-hover:bg-ink" />
            </span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href={bookHref}
              className="label group flex whitespace-nowrap bg-gold px-4 py-2.5 text-xs tracking-[0.16em] text-on-gold transition-colors duration-500 hover:bg-ink hover:text-navy focus-visible:bg-ink focus-visible:text-navy sm:px-5"
            >
              <Roll text="Book now" under="text-navy" />
            </Link>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
              className="group -mr-1.5 flex size-11 cursor-pointer items-center justify-center"
            >
              {/* Two 3px bars in a 32px column. Hover (mouse only): they shorten and stagger.
                  Open: they meet in the middle and turn into an X. */}
              <span aria-hidden className="flex w-8 flex-col items-center justify-center gap-2">
                <span
                  className={`block h-[3px] w-full rounded-[1px] bg-gold will-change-transform ${open
                    ? "[transform:translateY(5.5px)_rotate(45deg)]"
                    : "pointer-fine:group-hover:[transform:translateX(18%)_scaleX(0.64)] group-focus-visible:[transform:translateX(18%)_scaleX(0.64)]"
                    }`}
                  style={{ transition: barTransition }}
                />
                <span
                  className={`block h-[3px] w-full rounded-[1px] bg-gold will-change-transform ${open
                    ? "[transform:translateY(-5.5px)_rotate(-45deg)]"
                    : "pointer-fine:group-hover:[transform:translateX(-18%)_scaleX(0.64)] group-focus-visible:[transform:translateX(-18%)_scaleX(0.64)]"
                    }`}
                  style={{ transition: barTransition }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Always in the page; hidden and inert while closed, like a native dialog.
          Every movement below is a CSS transition on transform or opacity, which the
          browser runs on its compositor thread, so it stays smooth even if the page is busy. */}
      <div
        id="site-menu"
        data-lenis-prevent
        aria-hidden={!open}
        inert={!open}
        className={`fixed left-0 top-0 z-40 h-[100svh] w-screen ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      >
        {/* Curtain: four panels hinged at the top-right corner. Closed they are swung
            90° out of view; opening swings them in one after another, navy last. */}
        {["#f2b705", "#c99400", "#ab71e3", "#3b1f8e"].map((color, i) => (
          <div
            key={color}
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 will-change-transform [backface-visibility:hidden]"
            style={{
              backgroundColor: color,
              transformOrigin: "100% 0%",
              transform: open ? "rotate(0deg)" : "rotate(90deg)",
              transition: open
                ? `transform 1s ${curve(ease)} ${i * 0.09}s`
                : `transform 0.8s ${curve(ease)} ${0.2 + (3 - i) * 0.08}s`,
            }}
          />
        ))}

        <div
          className="relative h-full overflow-y-auto px-[clamp(20px,2.78vw,64px)] pb-[clamp(48px,5vw,80px)] pt-[clamp(120px,14vw,200px)] max-[1000px]:pb-12 max-[1000px]:pt-24"
          style={{
            opacity: open ? 1 : 0,
            visibility: open ? "visible" : "hidden",
            transition: open
              ? `opacity 0.4s ${curve(easeOut)} 0.5s, visibility 0s linear 0s`
              : `opacity 0.35s ${curve(easeIn)}, visibility 0s linear 0.35s`,
          }}
        >
          {/* Two columns sharing the width 1 : 2, like the reference; stacked and centred below 1000px. */}
          <div className="flex gap-[clamp(2rem,6vw,6rem)] max-[1000px]:min-h-full max-[1000px]:flex-col max-[1000px]:justify-center">
            {/* Left column: countdown and small links on top, credit at the bottom. */}
            <div className="order-1 flex flex-1 flex-col justify-between gap-8 max-[1000px]:order-2">
              <div>
                <MenuLine as="div" open={open} index={0} delay={0.6}>
                  <NextCountdown
                    labelClass="text-[clamp(12px,0.9vw,14px)] text-gold"
                    valueClass="caps mt-1 text-[clamp(24px,2.5vw,36px)] tabular-nums text-ink"
                  />
                </MenuLine>
                <ul className="mt-[clamp(1.25rem,2vw,2rem)] flex flex-col text-[clamp(20px,1.94vw,30px)] font-light tracking-[-0.02em]">
                  {secondaryLinks.map((item, i) => (
                    <MenuLine key={item.href} open={open} index={i + 1} delay={0.6}>
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className={`group flex w-fit leading-[1.43] ${pathname === item.href ? "text-gold" : "text-ink"}`}
                      >
                        <Roll text={item.label} under={pathname === item.href ? "text-ink" : "text-gold"} />
                      </Link>
                    </MenuLine>
                  ))}
                </ul>
              </div>

              {/* Credit, in the style of the reference's "A project by". */}
              <div className="flex flex-col items-start gap-2">
                <p className="text-[clamp(12px,0.9vw,14px)] text-gold">A project by</p>
                <MenuLine as="div" open={open} index={0} delay={0.85}>
                  <a
                    href="https://www.mayaverse.business/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="caps group flex w-fit text-[clamp(24px,2.5vw,36px)] text-ink"
                  >
                    <Roll text="MayaVerse" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </MenuLine>
              </div>
            </div>

            {/* Primary links, large serif. */}
            <nav aria-label="Main" className="order-2 flex flex-[2] max-[1000px]:order-1 max-[1000px]:flex-none">
              <ul className="flex flex-col gap-[clamp(14px,min(2.78vw,3vh),40px)] text-[clamp(34px,min(5vw,8.5vh),76px)] tracking-[-0.02em] max-[1000px]:text-[clamp(30px,min(10vw,6.5vh),56px)]">
                {primaryLinks.map((item, i) => {
                  const active = pathname === item.href;
                  return (
                    <MenuLine key={item.href} open={open} index={i} delay={0.55}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`display group flex w-fit leading-none ${active ? "text-gold" : "text-ink"}`}
                      >
                        {/* Current page rests in gold and rolls to ivory; the rest do the opposite. */}
                        <Roll text={item.label} under={active ? "text-ink" : "text-gold"} />
                      </Link>
                    </MenuLine>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

/** One menu line, rising from behind a mask once the curtain has dropped. */
function MenuLine({
  children,
  open,
  index,
  delay,
  as: Tag = "li",
}: {
  children: React.ReactNode;
  open: boolean;
  index: number;
  delay: number;
  /** "div" when the line isn't inside a list. */
  as?: "li" | "div";
}) {
  return (
    <Tag className="-my-[0.14em] block overflow-x-visible overflow-y-clip py-[0.14em]">
      <div
        className="will-change-transform"
        style={{
          transform: open ? "translateY(0)" : "translateY(110%)",
          transition: open
            ? `transform 1s ${curve(easeOut)} ${delay + index * 0.07}s`
            : `transform 0.35s ${curve(easeIn)}`,
        }}
      >
        {children}
      </div>
    </Tag>
  );
}

