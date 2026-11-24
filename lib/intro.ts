import { useSyncExternalStore } from "react";

/** Whether the opening loader, or a page-change sheet, has lifted. Entrance animations wait for it. */
let ready = false;
const listeners = new Set<() => void>();

export function markIntroReady() {
  if (ready) return;
  ready = true;
  for (const f of [...listeners]) f();
}

/** Holds entrance animations back while a page change covers the screen. */
export function holdIntro() {
  if (!ready) return;
  ready = false;
  for (const f of [...listeners]) f();
}

function subscribe(f: () => void) {
  listeners.add(f);
  return () => {
    listeners.delete(f);
  };
}

export const useIntroReady = () =>
  useSyncExternalStore(
    subscribe,
    () => ready,
    () => false,
  );

/** Calls `f` once the loader has lifted (at once if it already has). Returns a cancel function. */
export function onIntroReady(f: () => void) {
  if (ready) {
    f();
    return () => {};
  }
  const off = subscribe(() => {
    if (!ready) return;
    off();
    f();
  });
  return off;
}
