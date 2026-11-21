"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type CSSProperties, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Workshop } from "@/lib/content";

const STORAGE_KEY = "stallion:reserved-workshops";
const PAINT = ["#f7b538", "#c98f2e", "#145a86", "#08335d"];

const filters = [
  { id: "all", label: "All 12" },
  { id: "before", label: "Before the run 03" },
  { id: "after", label: "After the run 09" },
] as const;

type FilterId = (typeof filters)[number]["id"];

// Seats a visitor has requested, remembered in this browser only as a convenience.
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function readStored() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function parseIds(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function WorkshopGrid({ workshops }: { workshops: Workshop[] }) {
  const [filter, setFilter] = useState<FilterId>("all");
  const stored = useSyncExternalStore(subscribe, readStored, () => "[]");
  // Covers this visit when storage is unavailable.
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const reserved = useMemo(() => [...parseIds(stored), ...sessionIds], [stored, sessionIds]);
  const [active, setActive] = useState<Workshop | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (active && !d.open) d.showModal();
    if (!active && d.open) d.close();
  }, [active]);

  const markReserved = (id: string) => {
    setSessionIds((ids) => [...ids, id]);
    try {
      const next = Array.from(new Set([...parseIds(readStored()), id]));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      listeners.forEach((cb) => cb());
    } catch {
      /* storage unavailable: sessionIds still shows the seat for this visit */
    }
  };

  const shown = workshops.filter((w) => filter === "all" || w.phase === filter);

  return (
    <div>
      {/* Filters, styled as a quiet ledger of tabs with counts, like the reference categories. */}
      <div role="group" aria-label="Filter workshops" className="flex flex-wrap gap-x-10 gap-y-3 border-b border-ink pb-6">
        {filters.map((f) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.id)}
              className={`group relative cursor-pointer border-0 bg-transparent p-0 pb-1 text-[clamp(20px,1.57vw,30px)] tracking-[-0.01em] transition-colors ${
                on ? "text-ink" : "text-ink/50 hover:text-ink"
              }`}
            >
              {f.label}
              <span
                aria-hidden
                className={`absolute inset-x-0 -bottom-[25px] h-[3px] origin-left bg-[#f7b538] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  on ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}
      </div>

      <motion.ul layout className="m-0 mt-10 grid list-none gap-px bg-[#08335d] p-px sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((w) => {
            const number = workshops.indexOf(w) + 1;
            const isReserved = reserved.includes(w.id);
            return (
              <motion.li
                layout
                key={w.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="group relative isolate flex min-h-[clamp(320px,22vw,420px)] flex-col overflow-hidden bg-navy p-6 text-ink transition-colors duration-[250ms] [transition-delay:120ms] hover:text-[#f7b538]"
              >
                {PAINT.map((color, i) => (
                  <span
                    key={color}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 -z-10 origin-top scale-y-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] [transition-delay:var(--out)] group-hover:scale-y-100 group-hover:[transition-delay:var(--in)]"
                    style={{ background: color, "--in": `${i * 70}ms`, "--out": `${(3 - i) * 70}ms` } as CSSProperties}
                  />
                ))}
                <div className="flex items-start justify-between gap-4">
                  <span className="caps text-[clamp(44px,3.6vw,68px)] leading-[0.9]">{String(number).padStart(2, "0")}</span>
                  <span className="label pt-1 opacity-60">{w.phase === "before" ? "Before the run" : "After the run"}</span>
                </div>
                <h3 className="display m-0 mt-auto pt-10 text-[clamp(26px,2.1vw,40px)] leading-[1.05] tracking-[-0.015em]">
                  {w.title}
                </h3>
                <p className="m-0 mt-3 text-sm leading-[1.4] opacity-70">{w.body}</p>
                <p className="m-0 mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm opacity-70">
                  {["Hyderabad", "30–100 per batch", "Free"].map((m, i) => (
                    <span key={m} className="flex items-center gap-2">
                      {i > 0 && <span aria-hidden className="size-1 rotate-45 bg-current" />}
                      {m}
                    </span>
                  ))}
                </p>
                <button
                  type="button"
                  onClick={() => setActive(w)}
                  disabled={isReserved}
                  className={`mt-6 flex cursor-pointer items-center justify-between gap-4 border-0 border-t bg-transparent px-0 pb-0 pt-4 text-left text-lg tracking-[-0.01em] text-current ${
                    isReserved ? "cursor-default border-current/40" : "border-current/30"
                  }`}
                >
                  {isReserved ? (
                    <span className="flex items-center gap-2">
                      <Check aria-hidden className="size-4" /> Seat requested
                    </span>
                  ) : (
                    <>
                      <span>
                        Reserve my seat<span className="sr-only">: {w.title}</span>
                      </span>
                      <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
                        →
                      </span>
                    </>
                  )}
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      <dialog
        ref={dialogRef}
        data-lenis-prevent
        onClose={() => setActive(null)}
        aria-labelledby="reserve-title"
        className="m-auto w-[calc(100%-2rem)] max-w-lg border border-line bg-navy-900 p-0 text-ink backdrop:bg-navy-950/80 backdrop:backdrop-blur-sm"
      >
        {active && (
          <ReserveForm
            workshop={active}
            onClose={() => setActive(null)}
            onReserved={() => markReserved(active.id)}
          />
        )}
      </dialog>
    </div>
  );
}

function ReserveForm({
  workshop,
  onClose,
  onReserved,
}: {
  workshop: Workshop;
  onClose: () => void;
  onReserved: () => void;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, workshopId: workshop.id }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
      setState("done");
      onReserved();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const field =
    "mt-2 w-full border border-line bg-navy px-4 py-3 text-ink placeholder:text-muted/60 focus:border-gold focus:outline-none";

  return (
    <div className="p-7 sm:p-9">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="label text-gold">Free workshop</p>
          <h2 id="reserve-title" className="display mt-3 text-3xl">
            {workshop.title}
          </h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Close" className="text-muted hover:text-gold">
          <X className="size-5" />
        </button>
      </div>

      {state === "done" ? (
        <div className="mt-8">
          <p className="leading-relaxed text-muted">
            Your seat request is in. We&rsquo;ll email you the date and joining details once the schedule is confirmed.
          </p>
          <button type="button" onClick={onClose} className="label mt-8 w-full bg-gold px-6 py-4 text-on-gold">
            Done
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="label text-muted">Full name</span>
            <input name="name" required autoComplete="name" className={field} />
          </label>
          <label className="block">
            <span className="label text-muted">Email</span>
            <input name="email" type="email" required autoComplete="email" className={field} />
          </label>
          <label className="block">
            <span className="label text-muted">Phone (optional)</span>
            <input name="phone" type="tel" autoComplete="tel" inputMode="tel" className={field} />
          </label>
          {state === "error" && (
            <p role="alert" className="text-sm text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={state === "sending"}
            className="label w-full bg-gold px-6 py-4 text-on-gold transition-colors hover:bg-ink hover:text-navy disabled:opacity-60"
          >
            {state === "sending" ? "Sending…" : "Request my seat"}
          </button>
        </form>
      )}
    </div>
  );
}
