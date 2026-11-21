import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Hanken_Grotesk, IBM_Plex_Mono, Noto_Serif_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { CountdownBar } from "@/components/countdown-bar";
import { SiteFooter } from "@/components/site-footer";
import { MotionProvider } from "@/components/motion";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/content";
import { jsonLd, organization, website } from "@/lib/structured-data";

// Bodoni Moda supplies the gold italic accents inside headings (Gambarino has no italic).
const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

// Condensed high-contrast serif for the giant titles (narrowed with its wdth axis in globals.css).
const caps = Noto_Serif_Display({
  variable: "--font-caps",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Classic grotesque for body text and the hero tagline.
const body = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const label = IBM_Plex_Mono({
  variable: "--font-label",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  applicationName: site.name,
  title: {
    default: "Stallion Marathon 2027 Hyderabad: How's Your Horsepower?",
    template: "%s | Stallion Marathon",
  },
  description:
    "Virtual run for Republic Day 2027 and the official marathon at Gachibowli Stadium on 14 March 2027. Book now.",
  keywords: [
    "Hyderabad marathon 2027",
    "virtual run Republic Day",
    "Gachibowli marathon",
    "virtual marathon India",
    "corporate run challenge Hyderabad",
  ],
  openGraph: {
    title: "Stallion Marathon, Chapter I",
    description:
      "Virtual run for Republic Day 2027 and the official marathon at Gachibowli Stadium on 14 March 2027. Book now.",
    type: "website",
    locale: "en_IN",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#08335D",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${caps.variable} ${body.variable} ${label.variable} h-full antialiased`}
    >
      <head>
        {/* Gambarino (Indian Type Foundry, free licence) for sentence-case headings and menu links. */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=gambarino@400&display=swap" />
      </head>
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd([organization, website]) }} />
        <SmoothScroll />
        <MotionProvider>
          <a
            href="#main"
            className="label sr-only z-50 bg-gold px-4 py-3 text-on-gold focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <CountdownBar />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
