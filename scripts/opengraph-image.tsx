import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { heroArt, site } from "@/lib/content";

/**
 * Source of app/opengraph-image.png, the picture shown when the site is shared
 * on WhatsApp, Instagram, LinkedIn, X and so on. Drawn from the brand colours,
 * fonts, crest and hero stallion.
 *
 * The site serves the saved PNG, not this file. To redraw it (for example after
 * the hero stallion is replaced): copy this file to app/opengraph-image.tsx,
 * move app/opengraph-image.png aside, run the dev server, save
 * http://localhost:3001/opengraph-image as app/opengraph-image.png (compress it to
 * under 300 KB for WhatsApp, for example with sharp palette PNG), then move
 * this file back here.
 */

export const alt = `${site.fullName}: ${site.tagline} Virtual run from 19 January 2027, race day 14 March 2027 at Gachibowli Stadium, Hyderabad.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const navy = "#08335d";
const navyDeep = "#041d36";
const gold = "#f7b538";
const ivory = "#fdffff";

/**
 * A font from assets/og (static TTF copies of the site's Google fonts, both
 * under the SIL Open Font Licence; the renderer can't read WOFF2). Null if missing.
 */
async function font(file: string) {
  try {
    return await readFile(join(process.cwd(), "assets", "og", file));
  } catch {
    return null;
  }
}

/** A file in /public as a data URL; WebP is converted to PNG, which the renderer needs. */
async function publicImage(path: string) {
  try {
    let data = await readFile(join(process.cwd(), "public", path));
    if (path.endsWith(".webp")) {
      const sharp = (await import("sharp")).default;
      data = await sharp(data).resize({ height: 900 }).png().toBuffer();
    }
    return `data:image/png;base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const title = "STALLION";
  const [caps, label, crest, stallion] = await Promise.all([
    font("caps.ttf"),
    font("label.ttf"),
    publicImage("brand/sm-crest-gold.png"),
    heroArt ? publicImage(heroArt.src.replace(/^\//, "")) : Promise.resolve(null),
  ]);

  const fonts = [
    ...(caps ? [{ name: "Caps", data: caps, weight: 500 as const }] : []),
    ...(label ? [{ name: "Label", data: label, weight: 500 as const }] : []),
  ];
  const labelFont = label ? "Label" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(180deg, ${navy} 0%, ${navyDeep} 100%)`,
          color: ivory,
          position: "relative",
          fontFamily: labelFont,
        }}
      >
        {/* Thin gold frame. */}
        {stallion && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={stallion} alt="" width={480} height={497} style={{ position: "absolute", right: 34, top: 66 }} />
        )}

        <div
          style={{
            position: "absolute",
            top: 22,
            left: 22,
            right: 22,
            bottom: 22,
            border: `2px solid ${gold}`,
            opacity: 0.6,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 72px", width: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {crest && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={crest} alt="" width={62} height={70} />
            )}
            <span style={{ color: gold, fontSize: 22, letterSpacing: 4 }}>HOW&apos;S YOUR HORSEPOWER?</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: caps ? "Caps" : "serif", fontSize: 148, lineHeight: 0.9, letterSpacing: -2 }}>{title}</span>
            <span style={{ color: gold, fontSize: 30, letterSpacing: 6, marginTop: 14 }}>MARATHON · CHAPTER I</span>
          </div>

          <div style={{ display: "flex", gap: 48, borderTop: `1px solid ${ivory}55`, paddingTop: 22 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: gold, fontSize: 16, letterSpacing: 3 }}>VIRTUAL RUN</span>
              <span style={{ fontSize: 22, letterSpacing: 1 }}>FROM 19 JAN 2027</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: gold, fontSize: 16, letterSpacing: 3 }}>RACE DAY</span>
              <span style={{ fontSize: 19, letterSpacing: 0.3 }}>14 MAR 2027 · GACHIBOWLI STADIUM</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
