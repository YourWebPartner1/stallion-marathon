"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Crest } from "@/components/logo";
import { holdIntro, markIntroReady } from "@/lib/intro";

// The site's four curtain colours, each sheet arriving at its own tilt, navy last.
const SHEETS = [
  { color: "#f7b538", tilt: -8 },
  { color: "#c98f2e", tilt: 6 },
  { color: "#145a86", tilt: -4 },
  { color: "#08335d", tilt: 2 },
];
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const COVER = { duration: 300, step: 28 };
const LIFT = { duration: 360, step: 24 };

/**
 * Page change: four coloured sheets sweep up over the page, the crest rises on
 * the last one, the new page loads underneath, and the sheets carry on up and
 * away. Plain navigation for reduced motion, new tabs, other sites and links
 * within the same page.
 */
export function PageTransition() {
  const root = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const arrived = useRef<(() => void) | null>(null);

  // The new page is on screen: let the waiting transition finish.
  useEffect(() => {
    arrived.current?.();
    arrived.current = null;
  }, [pathname]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const sheets = [...el.querySelectorAll<HTMLElement>("[data-sheet]")];
    const mark = el.querySelector<HTMLElement>("[data-mark]");
    if (!mark) return;
    let busy = false;

    const run = async (href: string) => {
      busy = true;
      router.prefetch(href);
      el.style.display = "block";
      el.style.pointerEvents = "auto";

      const cover = sheets.map((s, i) =>
        s.animate(
          [{ transform: `translateY(118%) rotate(${SHEETS[i].tilt}deg)` }, { transform: "translateY(0) rotate(0deg)" }],
          { duration: COVER.duration, delay: i * COVER.step, easing: EASE, fill: "both" },
        ),
      );
      const rise = mark.animate(
        [
          { clipPath: "inset(100% 0 0 0)", transform: "translateY(14%)" },
          { clipPath: "inset(0 0 0 0)", transform: "translateY(0)" },
        ],
        { duration: 240, delay: 140, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" },
      );
      await Promise.all([...cover, rise].map((a) => a.finished));

      const there = new Promise<void>((done) => {
        arrived.current = done;
        // Never leave the page covered if a navigation is slow or goes nowhere.
        window.setTimeout(done, 4000);
      });
      holdIntro();
      router.push(href);
      await there;
      await new Promise((done) => window.setTimeout(done, 40));

      const lift = sheets.map((s, i) =>
        s.animate(
          [{ transform: "translateY(0) rotate(0deg)" }, { transform: `translateY(-118%) rotate(${-SHEETS[i].tilt}deg)` }],
          { duration: LIFT.duration, delay: (sheets.length - 1 - i) * LIFT.step, easing: EASE, fill: "both" },
        ),
      );
      // The new page's entrances start as the sheets leave.
      window.setTimeout(markIntroReady, 60);
      await Promise.all(lift.map((a) => a.finished));
      [...cover, rise, ...lift].forEach((a) => a.cancel());
      el.style.display = "none";
      el.style.pointerEvents = "none";
      busy = false;
    };

    // Runs before the link's own handler; a prevented click is left alone by it.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const raw = a.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      if (url.pathname === location.pathname) return;
      // Old addresses that redirect keep the same motion; the path check above only skips this page.
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      e.preventDefault();
      if (!busy) run(url.pathname + url.search + url.hash);
    };
    // Fetch the next page as soon as a link is pointed at or touched.
    const onPoint = (e: Event) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (a && a.origin === location.origin && a.pathname !== location.pathname && !a.target) {
        router.prefetch(a.pathname + a.search);
      }
    };
    document.addEventListener("pointerover", onPoint, { passive: true });
    document.addEventListener("touchstart", onPoint, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointerover", onPoint);
      document.removeEventListener("touchstart", onPoint);
      document.removeEventListener("click", onClick, true);
    };
  }, [router]);

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed inset-0 z-[95] hidden overflow-clip">
      {SHEETS.map((s, i) => (
        <div
          key={s.color}
          data-sheet
          className="absolute -inset-x-[12%] -inset-y-[19%] grid place-items-center will-change-transform"
          style={{ background: s.color, transform: `translateY(118%) rotate(${s.tilt}deg)` }}
        >
          {i === SHEETS.length - 1 && (
            <span data-mark className="block" style={{ clipPath: "inset(100% 0 0 0)" }}>
              <Crest height={170} className="bg-[#f7b538]" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
