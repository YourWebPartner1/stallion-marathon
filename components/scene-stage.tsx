"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";

/** Marks its content as playing only while it is on screen, so looping drawings rest when nobody sees them. */
export function SceneStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.15 });
  return (
    <div ref={ref} data-playing={inView} className={className}>
      {children}
    </div>
  );
}
