"use client";

import { useEffect, useState } from "react";
import { timers, type TimerSpec } from "@/lib/content";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function split(ms: number) {
  const t = Math.max(0, ms);
  return {
    days: Math.floor(t / DAY),
    hours: Math.floor((t % DAY) / HOUR),
    minutes: Math.floor((t % HOUR) / MINUTE),
    seconds: Math.floor((t % MINUTE) / SECOND),
  };
}

/**
 * Current time, read only in the browser so the prerendered page stays static.
 * Targets carry a fixed +05:30 offset, so every visitor counts down to the same IST moment.
 */
function useNow() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, SECOND);
    return () => clearInterval(id);
  }, []);
  return now;
}

const pad = (n: number) => String(n).padStart(2, "0");

const ORDER: TimerSpec[] = [timers.virtual, timers.winners, timers.race];

/** The next upcoming date only, switching automatically as each one passes. Shown in the site menu. */
export function NextCountdown({
  labelClass = "label text-gold",
  valueClass = "display mt-3 text-3xl tabular-nums text-ink",
}: {
  labelClass?: string;
  valueClass?: string;
} = {}) {
  const now = useNow();

  let spec: TimerSpec = ORDER[0];
  let message: string | null = null;
  if (now !== null) {
    const next = ORDER.find((t) => Date.parse(t.target) > now);
    if (next) spec = next;
    else {
      // After race day starts, show its message for that day, then hide.
      const raceStart = Date.parse(timers.race.target);
      if (now - raceStart > DAY) return null;
      message = timers.race.zeroMessage;
    }
  }

  const p = now === null ? null : split(Date.parse(spec.target) - now);

  return (
    <div>
      <p className={labelClass}>{message ?? spec.label}</p>
      {!message && (
        <p className={valueClass}>
          {p ? (
            <>
              <span aria-hidden>
                {p.days}d {pad(p.hours)}h {pad(p.minutes)}m
              </span>
              <span className="sr-only">
                {p.days} days and {p.hours} hours
              </span>
            </>
          ) : (
            spec.dateText
          )}
        </p>
      )}
    </div>
  );
}
