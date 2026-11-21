import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/** robots.txt: allow every page except the API, and point to the sitemap. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
