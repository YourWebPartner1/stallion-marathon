"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useIntroReady } from "@/lib/intro";

const ease = [0.16, 1, 0.3, 1] as const;
const PROBE = 100; // px size the hidden copies are measured at
const LINE = 0.86; // matches the caps utility's line-height

/**
 * Sizes each line so it runs exactly edge to edge of its container, then
 * reveals it rising from behind a mask. Before scripts run, the font size from
 * the parent's classes is used, so set a sensible vw size there as a fallback.
 *
 * `stretch` pulls the letters taller than the font draws them (a vertical
 * scale), for the elongated poster-style titles.
 */
export function FitText({
  lines,
  immediate = false,
  max = 2000,
  maxVw,
  align = "left",
  stretch = 1,
  perLetter = false,
  letterDelay = 0,
}: {
  lines: ReactNode[];
  /** Animate on mount instead of on scroll, for content above the fold. */
  immediate?: boolean;
  /** Largest font size in px. */
  max?: number;
  /** Largest font size as a share of the viewport width, so short words don't grow huge. */
  maxVw?: number;
  align?: "left" | "center";
  /** Vertical stretch factor; 1 = the font's own proportions. */
  stretch?: number;
  /** Split string lines into letters that each rise from their own mask, one after another. */
  perLetter?: boolean;
  /** Seconds before the first letter starts (perLetter only). */
  letterDelay?: number;
}) {
  const ready = useIntroReady();
  const wrap = useRef<HTMLSpanElement>(null);
  const probes = useRef<(HTMLSpanElement | null)[]>([]);
  const [sizes, setSizes] = useState<number[] | null>(null);

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => {
      const width = el.clientWidth;
      if (!width) return;
      const cap = maxVw ? Math.min(max, (window.innerWidth * maxVw) / 100) : max;
      setSizes(
        probes.current.map((p) => {
          const w = p?.scrollWidth || 1;
          return Math.min(cap, ((PROBE * width) / w) * 0.995);
        }),
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [max, maxVw, lines.length]);

  return (
    <motion.span
      ref={wrap}
      className={`relative block ${align === "center" ? "text-center" : ""}`}
      initial="hidden"
      {...(immediate ? { animate: ready ? "show" : "hidden" } : { whileInView: "show", viewport: { once: true, amount: 0.2 } })}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
    >
      {lines.map((line, i) => {
        const size = sizes?.[i];
        return (
          <span
            key={i}
            className="block overflow-hidden whitespace-nowrap pb-[0.04em]"
            style={
              size
                ? { fontSize: `${size}px`, height: stretch !== 1 ? `${size * LINE * stretch + size * 0.04}px` : undefined }
                : undefined
            }
          >
            {perLetter && typeof line === "string" ? (
              <span
                className="block origin-top"
                style={stretch !== 1 ? { transform: `scaleY(${stretch})` } : undefined}
              >
                {Array.from(line).map((ch, j) => (
                  <span key={j} className="inline-block overflow-x-visible overflow-y-clip align-top">
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { y: "100%" },
                        show: { y: "0%", transition: { duration: 0.8, ease, delay: letterDelay + j * 0.035 } },
                      }}
                    >
                      {ch === " " ? "00a0" : ch}
                    </motion.span>
                  </span>
                ))}
              </span>
            ) : (
              <motion.span
                className="block"
                variants={{ hidden: { y: "105%" }, show: { y: "0%", transition: { duration: 0.8, ease } } }}
              >
                <span
                  className="block origin-top"
                  style={stretch !== 1 ? { transform: `scaleY(${stretch})` } : undefined}
                >
                  {line}
                </span>
              </motion.span>
            )}
          </span>
        );
      })}
      {/* Hidden copies at a fixed size, used only for measuring. */}
      <span aria-hidden className="pointer-events-none invisible absolute left-0 top-0 h-0 w-0 overflow-hidden whitespace-nowrap">
        {lines.map((line, i) => (
          <span
            key={i}
            ref={(n) => {
              probes.current[i] = n;
            }}
            className="block w-max"
            style={{ fontSize: `${PROBE}px` }}
          >
            {/* Letters are measured as separate boxes too, so the fit matches what is drawn. The
                text sits in a generated ::before, so it never reads as a second copy of the title. */}
            {perLetter && typeof line === "string" ? (
              Array.from(line).map((ch, j) => (
                <span key={j} data-t={ch === " " ? " " : ch} className="inline-block before:content-[attr(data-t)]" />
              ))
            ) : typeof line === "string" ? (
              <span data-t={line} className="before:content-[attr(data-t)]" />
            ) : (
              line
            )}
          </span>
        ))}
      </span>
    </motion.span>
  );
}
