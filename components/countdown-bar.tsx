"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { nowSecond, subscribeClock } from "@/components/live-countdown";
import { bookHref, timers, type TimerSpec } from "@/lib/content";

const ORDER: TimerSpec[] = [timers.virtual, timers.winners, timers.race];
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Sticky top bar on every page, as the content document specifies: only the
 * next upcoming date, counting down in days, hours, minutes and seconds to a
 * fixed IST moment, switching automatically as each date passes. Shows the
 * plain date before scripts run. The whole bar leads to booking (redesign brief 4.1).
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
    <Link
      href={bookHref}
      className="fixed inset-x-0 top-0 z-[55] flex h-8 items-center justify-center gap-3 bg-[#1e1146] px-4 text-[12px] leading-none text-[#f8f3fe] transition-colors hover:bg-[#2c1670] sm:text-[13px]"
    >
      {message ? (
        <span className="text-[#f2b705]">{message}</span>
      ) : (
        <>
          <span className="hidden text-[#f8f3fe]/70 lg:inline">The deadline that&rsquo;s good for you</span>
          <span aria-hidden className="hidden size-1 rotate-45 bg-[#f2b705]/70 lg:block" />
          <span>{spec.label}</span>
          <span aria-hidden className="block size-1 rotate-45 bg-[#f2b705]/70" />
          {left == null ? (
            <span>{spec.dateText}</span>
          ) : (
            <>
              <span aria-hidden className="tabular-nums tracking-[0.04em] text-[#f2b705]">
                {Math.floor(left / 86400)}d {pad(Math.floor((left % 86400) / 3600))}h {pad(Math.floor((left % 3600) / 60))}m{" "}
                {pad(left % 60)}s
              </span>
              <span className="sr-only">
                {Math.floor(left / 86400)} days and {Math.floor((left % 86400) / 3600)} hours
              </span>
              <span className="hidden text-[#f8f3fe]/80 sm:inline">· Book from ₹599 →</span>
            </>
          )}
        </>
      )}
    </Link>
  );
}
