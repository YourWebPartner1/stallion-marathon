"use client";

import { useSyncExternalStore } from "react";
import type { TimerSpec } from "@/lib/content";

// One shared clock that ticks once a second; null on the server, so the
// prerendered page shows the plain dates until scripts run.
const clockListeners = new Set<() => void>();
let clockTimer: ReturnType<typeof setInterval> | null = null;
export function subscribeClock(cb: () => void) {
  clockListeners.add(cb);
  if (!clockTimer) clockTimer = setInterval(() => clockListeners.forEach((l) => l()), 1000);
  return () => {
    clockListeners.delete(cb);
    if (!clockListeners.size && clockTimer) {
      clearInterval(clockTimer);
      clockTimer = null;
    }
  };
}
export const nowSecond = () => Math.floor(Date.now() / 1000);

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Live countdown to a fixed IST moment (the targets carry +05:30), as the
 * content document specifies: days, hours, minutes and seconds, a message at
 * zero, a polite screen-reader summary, and the plain date before scripts run.
 */
export function LiveCountdown({ spec, size }: { spec: TimerSpec; size: "large" | "small" }) {
  const now = useSyncExternalStore(subscribeClock, nowSecond, () => null);
  const target = Math.floor(Date.parse(spec.target) / 1000);
  const left = now == null ? null : Math.max(0, target - now);
  const done = left === 0;
  const parts =
    left == null
      ? null
      : [
          ["Days", Math.floor(left / 86400)],
          ["Hrs", Math.floor((left % 86400) / 3600)],
          ["Min", Math.floor((left % 3600) / 60)],
          ["Sec", left % 60],
        ];
  const num = size === "large" ? "text-[clamp(40px,4.2vw,80px)]" : "text-[clamp(26px,2.31vw,44px)]";

  return (
    <div className="flex flex-col items-center gap-3">
      <p className={`m-0 ${size === "large" ? "text-xl" : "text-base"} text-[#f7b538]`}>{done ? spec.zeroMessage : spec.label}</p>
      {parts == null ? (
        // Before scripts run, and if they never do.
        <p className={`display m-0 leading-none tracking-[-0.02em] ${num}`}>{spec.dateText}</p>
      ) : done ? null : (
        <>
          <span className="sr-only" aria-live="polite">
            {spec.label} {parts[0][1]} days and {parts[1][1]} hours.
          </span>
          <div aria-hidden className="flex items-start gap-[clamp(8px,1vw,18px)]">
            {parts.map(([unit, value], k) => (
              <div key={unit as string} className="flex items-start gap-[clamp(8px,1vw,18px)]">
                {k > 0 && <span className={`display leading-none text-[#f7b538]/50 ${num}`}>:</span>}
                <div className="flex flex-col items-center gap-1">
                  <span className={`display leading-none tabular-nums tracking-[-0.02em] ${num}`}>
                    {k === 0 ? String(value) : pad(value as number)}
                  </span>
                  <span className="text-xs uppercase tracking-[0.14em] text-[#fdffff]/60">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="m-0 text-sm text-[#fdffff]/60">{spec.dateText} · IST</p>
    </div>
  );
}

/** Small early-bird deadline timer, shown beside prices while an offer runs. Renders nothing after the deadline. */
export function EarlyBirdTimer({ ends }: { ends: string }) {
  const now = useSyncExternalStore(subscribeClock, nowSecond, () => null);
  const end = Math.floor(Date.parse(ends) / 1000);
  if (now != null && now >= end) return null;
  const left = now == null ? null : end - now;
  return (
    <p className="m-0 inline-flex items-center gap-2 text-sm">
      <span className="text-gold">Early-bird ends in</span>
      <span className="tabular-nums">
        {left == null
          ? new Date(ends).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" })
          : `${Math.floor(left / 86400)}d ${pad(Math.floor((left % 86400) / 3600))}h ${pad(Math.floor((left % 3600) / 60))}m ${pad(left % 60)}s`}
      </span>
    </p>
  );
}
