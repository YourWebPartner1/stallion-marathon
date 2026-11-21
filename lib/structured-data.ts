import { booking, dates, site, tiers, venue } from "@/lib/content";

/**
 * Event structured data (schema.org JSON-LD) for search engines, as the content
 * document asks: name, dates, venue and price for both events. The Official Run
 * has no offers yet because its prices are still to be announced; add them here
 * once they are final.
 */

const organizer = { "@type": "Organization", name: site.organiser, telephone: `+91${site.phone}` };
const bookingUrl = booking.websiteUrl ?? undefined;

export const virtualRunEvent = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Stallion Virtual Run: Republic Day Edition",
  description:
    "Run your chosen distance, anywhere, at your own pace, from 19 January 2027. Winners announced on Republic Day, 26 January 2027.",
  startDate: dates.virtualStart,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  location: { "@type": "VirtualLocation", name: "Anywhere you can run" },
  organizer,
  offers: tiers.map((t) => ({
    "@type": "Offer",
    name: `${t.name}, ${t.distance}`,
    price: t.price,
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
    ...(bookingUrl ? { url: bookingUrl } : {}),
  })),
};

export const officialRunEvent = {
  "@context": "https://schema.org",
  "@type": "SportsEvent",
  name: site.fullName,
  description: "Hyderabad's race day starts behind a stallion. Up to 30,000 runners at Gachibowli Stadium.",
  startDate: dates.raceDay.slice(0, 10),
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: venue.fullName,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gachibowli Sports Complex",
      addressLocality: "Hyderabad",
      addressRegion: "Telangana",
      addressCountry: "IN",
    },
  },
  organizer,
};

/** Serialises JSON-LD safely for a <script> tag. */
export const jsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
