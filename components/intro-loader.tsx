"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { crestFrame, crestLetters, crestSuits, crestViewBox } from "@/lib/crest-lines";
import { markIntroReady } from "@/lib/intro";
import { lenisRef } from "@/lib/lenis";

/**
 * Opening moment, once per page load: the crest's frame sweeps in from the top
 * down both sides, SM rises, the four suits pop in, then the sheet lifts away.
 *
 * Every movement is a CSS animation of transform or opacity, which the browser
 * runs apart from the page's own work, so loading can't make it stutter. This
 * script only tells the page when to begin its entrances and tidies up after.
 */
export function IntroLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    let cancelled = false;
    const timers: number[] = [];
    const finish = () => {
      if (cancelled) return;
      lenisRef.current?.start();
      markIntroReady();
      setGone(true);
    };
    const lift = el?.getAnimations().find((a) => (a as CSSAnimation).animationName === "intro-lift");
    // Reduced motion (nothing to play) or a tab in the background: straight to the page.
    if (!lift || document.hidden) {
      timers.push(window.setTimeout(finish, 0));
    } else {
      lenisRef.current?.stop();
      const delay = Number(lift.effect?.getComputedTiming().delay ?? 0);
      const left = Math.max(0, delay + 60 - Number(lift.currentTime ?? 0));
      timers.push(
        window.setTimeout(() => {
          lenisRef.current?.start();
          markIntroReady();
        }, left),
      );
      lift.finished.then(finish, finish);
      timers.push(window.setTimeout(finish, left + 1500));
    }
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      lenisRef.current?.start();
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={ref} aria-hidden className="intro">
      <div className="intro-crest">
        <Lines d={crestFrame} />
        {/* Two navy halves turn away from the top, uncovering the frame on both sides at once. */}
        <span className="intro-half intro-half-left">
          <i />
        </span>
        <span className="intro-half intro-half-right">
          <i />
        </span>
        <span className="intro-letters">
          <Lines d={crestLetters} />
        </span>
        {crestSuits.map((s, i) => (
          <span key={i} className="intro-suit" style={{ "--i": i, transformOrigin: `${s.x}% ${s.y}%` } as CSSProperties}>
            <Lines d={s.d} />
          </span>
        ))}
      </div>
    </div>
  );
}

/** All the lines as one path, so each layer is painted once and never again. */
function Lines({ d }: { d: string }) {
  return (
    <svg viewBox={crestViewBox} className="intro-lines">
      <path d={d} />
    </svg>
  );
}
