import type Lenis from "lenis";

/** The page's smooth-scroll instance, so overlays can pause scrolling while they're open. */
export const lenisRef: { current: Lenis | null } = { current: null };
