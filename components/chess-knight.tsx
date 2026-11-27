/**
 * The chess knight: the stallion as a chess piece, the same head as the one in
 * the footer engraving. Used as the ornament between the gold rules across the
 * site, in place of the old diamond. Takes its colour from `currentColor`; the
 * eye and nostril are holes, so it works on light and dark backgrounds alike.
 */
export function ChessKnight({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="-82 -130 166 236"
      className={`inline-block h-[1.15em] w-auto shrink-0 ${className}`}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M-18 40C-20 16 -10 -2 -22 -20C-32 -8 -46 4 -60 4C-74 2 -80 -10 -72 -22C-62 -36 -50 -50 -42 -66C-38 -84 -22 -98 -8 -104L-12 -126L6 -110L16 -124L22 -102C46 -88 60 -54 62 -18C64 8 58 26 62 40Q20 54 -18 40Z M-31 -57a6 6 0 1 0 12 0a6 6 0 1 0 -12 0Z M-70 -12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0Z"
      />
      <path d="M-26 50Q20 62 64 50L60 64Q20 76 -30 64Z" />
      <path d="M-40 72Q20 86 76 72L80 92Q20 108 -44 92Z" />
    </svg>
  );
}
