"use client";

import { useSyncExternalStore } from "react";
import { nowSecond, subscribeClock } from "@/components/live-countdown";
import { timers, type TimerSpec } from "@/lib/content";

const ORDER: TimerSpec[] = [timers.virtual, timers.winners, timers.race];
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Sticky top bar on every page, as the content document specifies: only the
 * next upcoming date, counting down in days, hours, minutes and seconds to a
 * fixed IST moment, switching automatically as each date passes. Shows the
 * plain date before scripts run.
 */
export function CountdownBar() {
  const now = useSyncExternalStore(subscribeClock, nowSecond, () => null);

  let spec = ORDER[0];
  let message: string | null = null;
  if (now != null) {
    const next = ORDER.find((t) => Date.parse(t.target) / 1000 > now);
    if (next) spec = next;
    else message = timers.race.zeroMessage;
  }
  const left = now == null || message ? null : Math.max(0, Math.floor(Date.parse(spec.target) / 1000) - now);

  return (
    <div className="fixed inset-x-0 top-0 z-[55] flex h-8 items-center justify-center gap-3 bg-[#041d36] px-4 text-[12px] leading-none text-[#fdffff] sm:text-[13px]">
      {message ? (
        <span className="text-[#f7b538]">{message}</span>
      ) : (
        <>
          <span className="text-[#f7b538]">{spec.label}</span>
          <span aria-hidden className="block size-1 rotate-45 bg-[#f7b538]/70" />
          {left == null ? (
            <span>{spec.dateText}</span>
          ) : (
            <>
              <span aria-hidden className="tabular-nums tracking-[0.04em]">
                {Math.floor(left / 86400)}d {pad(Math.floor((left % 86400) / 3600))}h {pad(Math.floor((left % 3600) / 60))}m{" "}
                {pad(left % 60)}s
              </span>
              <span className="sr-only">
                {Math.floor(left / 86400)} days and {Math.floor((left % 86400) / 3600)} hours
              </span>
              <span className="hidden text-[#fdffff]/60 sm:inline">· {spec.dateText}</span>
            </>
          )}
        </>
      )}
    </div>
  );
}
