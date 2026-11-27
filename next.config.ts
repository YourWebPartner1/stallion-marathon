import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      // The Sector Challenges now live on the Volunteers page.
      { source: "/challenges", destination: "/volunteers#challenges", permanent: true },
      // One address for everyone: www and the original Vercel address move to stallionmarathon.com.
      // Matched on these exact hosts only, so Vercel's preview links keep working.
      ...["www.stallionmarathon.com", "stallion-marathon.vercel.app"].map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://stallionmarathon.com/:path*",
        permanent: true,
      })),
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
