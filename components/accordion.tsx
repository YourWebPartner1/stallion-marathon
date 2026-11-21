"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Faq } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Questions as rows in the reference log style: a number, the question in the
 * display face (gold and nudged right on hover or when open), and the answer
 * opening underneath.
 */
export function Accordion({ items, startIndex = 0 }: { items: Faq[]; startIndex?: number }) {
  const [open, setOpen] = useState<number | null>(null);
  const baseId = useId();

  return (
    <ul className="m-0 list-none border-t border-ink/20 p-0 [--g:24px] max-[700px]:[--g:8px]">
      {items.map((item, i) => {
        const isOpen = open === i;
        const panelId = `${baseId}-panel-${i}`;
        const buttonId = `${baseId}-button-${i}`;
        return (
          <li key={item.q} className="border-b border-ink/15">
            <h3 className="m-0 font-normal">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group grid w-full cursor-pointer grid-cols-12 items-baseline gap-x-[var(--g)] border-0 bg-transparent px-0 py-8 text-left text-ink"
              >
                <span className="col-span-1 text-sm tabular-nums text-ink/60">
                  {String(startIndex + i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`display col-span-10 text-[clamp(22px,1.89vw,36px)] leading-[1.15] tracking-[-0.01em] transition-[color,transform] duration-[250ms,800ms] ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-2.5 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[#f7b538] group-focus-visible:translate-x-2.5 group-focus-visible:text-[#f7b538] ${
                    isOpen ? "translate-x-2.5 text-[#f7b538]" : ""
                  }`}
                >
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={`col-span-1 justify-self-end text-2xl leading-none text-[#f7b538] transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                >
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-12 gap-x-[var(--g)] pb-8">
                    <p className="col-span-11 col-start-2 m-0 max-w-3xl text-lg leading-[1.45] text-ink/75 lg:col-span-8 lg:col-start-2">
                      {item.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
