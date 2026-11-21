import type { CSSProperties } from "react";

const CREST_RATIO = 995 / 1132; // width / height of public/brand/sm-crest-mask.png

/**
 * The SM crest. Drawn through a CSS mask so it takes its colour from a
 * background class (gold by default), which also switches to ochre on ivory
 * sections. Regenerate the files with `node scripts/build-brand-assets.mjs`.
 */
export function Crest({ height, className = "bg-gold" }: { height: number; className?: string }) {
  const style: CSSProperties = {
    width: Math.round(height * CREST_RATIO),
    height,
    maskImage: "url(/brand/sm-crest-mask.png)",
    WebkitMaskImage: "url(/brand/sm-crest-mask.png)",
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskPosition: "center",
    WebkitMaskPosition: "center",
  };
  return <span aria-hidden className={`block shrink-0 transition-colors ${className}`} style={style} />;
}
