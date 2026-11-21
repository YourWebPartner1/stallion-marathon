import type { MetadataRoute } from "next";
import { pages, site } from "@/lib/content";

const legal = new Set(["/terms", "/waiver", "/refund-policy", "/privacy"]);

/** sitemap.xml: every public page, so search engines find them all. */
export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: legal.has(path) ? "yearly" : "weekly",
    priority: path === "/" ? 1 : legal.has(path) ? 0.3 : 0.8,
  }));
}
