/**
 * Hover roll, letter by letter: each letter slides up out of view in turn while a
 * copy in the accent colour rises from below to take its place. Pure CSS
 * transitions, staggered per letter.
 */
export function Roll({ text, under = "text-gold" }: { text: string; under?: string }) {
  const letters = Array.from(text);
  const letterClass =
    "inline-block transition-transform duration-[650ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
  const glyph = (ch: string) => (ch === " " ? " " : ch);
  return (
    <span className="relative -my-[0.14em] inline-block overflow-x-visible overflow-y-clip whitespace-nowrap py-[0.14em] align-top">
      <span className="sr-only">{text}</span>
      <span aria-hidden className="block">
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`${letterClass} group-hover:-translate-y-[120%] group-focus-visible:-translate-y-[120%]`}
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {glyph(ch)}
          </span>
        ))}
      </span>
      <span aria-hidden className={`absolute inset-x-0 top-[0.14em] block ${under}`}>
        {letters.map((ch, i) => (
          <span
            key={i}
            className={`${letterClass} translate-y-[120%] group-hover:translate-y-0 group-focus-visible:translate-y-0`}
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {glyph(ch)}
          </span>
        ))}
      </span>
    </span>
  );
}
