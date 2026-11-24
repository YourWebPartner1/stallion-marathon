import { HeroStage } from "@/components/hero";
import { Interlude } from "@/components/interlude";
import { StatTable } from "@/components/stat-table";
import { StartLineArt } from "@/components/start-line-art";
import { GivingPie } from "@/components/giving-pie";
import { NgoPartners } from "@/components/ngo-partners";
import { Roll } from "@/components/roll";
import Link from "next/link";
import { WhyStallion } from "@/components/why-stallion";
import { TeaserBand } from "@/components/teaser-band";
import { ClosingCta } from "@/components/closing-cta";
import { RaceCard } from "@/components/race-card";
import { FeaturedChapters } from "@/components/featured-chapters";
import { LiveCountdown } from "@/components/live-countdown";
import { Reveal } from "@/components/motion";
import { ButtonLink, Container } from "@/components/ui";
import { bookHref, heroArt, TBA, timers, workshopCount } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Hero />
      <CountdownStrip />
      <Interlude text="A Hyderabad running festival in two parts: a virtual run for Republic Day 2027, then the official race at Gachibowli Stadium on 14 March 2027. The virtual run is the on-ramp. The stadium race is the main event. Winners of the first earn their place at the second." />
      <Chapters />
      <WhyStallion />
      <StartLine />
      <TeaserBand
        id="workshops-teaser"
        figure={String(workshopCount.total)}
        figureCaption="free workshops"
        lines={["Learn before you run.", "Learn after you finish."]}
        note="Free workshops for virtual run participants."
        cta={{ label: "See workshops", href: "/workshops" }}
      />
      <TeaserBand
        id="challenges-teaser"
        figure="₹50K"
        figureCaption="HR Champion prize"
        lines={["Is your company ready?"]}
        note="Corporate, Hospital, Pharmacy and Bank Challenges. The HR who brings the most bookings wins ₹50,000."
        cta={{ label: "Enter your organisation", href: "/volunteers#challenges" }}
      />
      <GivingBackStrip />
      <Numbers />
      <RaceCard />
      <ClosingCta />
    </>
  );
}

function Hero() {
  return (
    <section aria-label="Hero" className="relative overflow-hidden">
      <HeroStage
        tagline="How’s your horsepower?"
        title="Stallion"
        srTitle="Stallion Marathon, Chapter I"
        art={heroArt}
      />
      {/* One quiet, centred line and the two buttons, so the hero flows straight into the interlude. */}
      <Container className="relative z-20 pb-[clamp(56px,6vw,96px)] pt-2 text-center">
        <Reveal delay={0.3}>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted">
            Stallion Marathon, Chapter I. Run the virtual edition this Republic Day, then take the start line at
            Gachibowli Stadium on 14 March 2027.
          </p>
        </Reveal>
        {/* Static buttons: no entrance or hover animation. */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={bookHref}>Book your run</ButtonLink>
          <ButtonLink href="/official-run" variant="ghost">
            See the race
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}

/** The document's countdown strip: virtual run start and race day, side by side, under the hero. */
function CountdownStrip() {
  return (
    <section aria-label="Countdown" className="relative px-[max(20px,2.78vw)] pb-[clamp(56px,6vw,96px)]">
      <div className="grid border-y border-[#f7b538]/40 md:grid-cols-2">
        <div className="py-10 md:border-r md:border-[#f7b538]/40">
          <LiveCountdown spec={timers.virtual} size="large" />
        </div>
        <div className="border-t border-[#f7b538]/40 py-10 md:border-t-0">
          <LiveCountdown spec={timers.race} size="large" />
        </div>
      </div>
    </section>
  );
}

/** The document's start-line block: the stallion start, with the diagram as its image until race photography exists. */
function StartLine() {
  return (
    <section
      aria-labelledby="start-line-title"
      className="theme-light relative -mt-px bg-navy px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] text-ink"
    >
      <div className="grid items-center gap-x-6 gap-y-12 border-t border-ink pt-[max(64px,5.87vw)] lg:grid-cols-12">
        <div className="theme-dark lg:col-span-6">
          <StartLineArt />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5 lg:col-start-8">
          <span aria-hidden className="flex w-[clamp(140px,15.5vw,220px)] items-center gap-3">
            <span className="h-px flex-1 bg-gold/40" />
            <span className="size-2.5 rotate-45 bg-gold" />
            <span className="h-px flex-1 bg-gold/40" />
          </span>
          <h2 id="start-line-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em]">
            The race starts behind a stallion.
          </h2>
          <p className="display m-0 text-[clamp(22px,1.57vw,30px)] leading-[1.25] text-ink/80">
            An equestrian on horseback leads the field away at the start, instead of the usual lead cyclist. Come see it.
          </p>
          <Link href="/official-run" className="group inline-flex w-fit items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
            <Roll text="See the race" under="text-gold" />
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** The giving-back strip: a navy band between the light sections, with the animated pie of profits. */
function GivingBackStrip() {
  return (
    <section aria-labelledby="giving-strip" className="relative overflow-hidden bg-[#08335d] px-[max(20px,2.78vw)] py-[max(64px,5.87vw)] text-[#fdffff]">
      <div className="grid items-center gap-x-6 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <GivingPie className="max-w-[640px]" />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
          <h2 id="giving-strip" className="display m-0 text-balance text-[clamp(32px,3.36vw,64px)] leading-[1.05] tracking-[-0.02em]">
            <span className="block">A share of our profits goes to NGOs.</span>
            <span className="block text-[#f7b538]">Every run counts twice.</span>
          </h2>
          <Link href="/giving-back" className="group inline-flex w-fit items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
            <Roll text="Giving Back" under="text-[#f7b538]" />
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-x-1.5">
              →
            </span>
          </Link>
        </div>
      </div>
      <NgoPartners className="mt-[max(56px,5vw)]" />
    </section>
  );
}

function Chapters() {
  return (
    <FeaturedChapters
      title="Choose your Chapter"
      statement={["The virtual run is the on-ramp.", "The stadium race is the main event."]}
      count="7"
      caption="distances, 5 km to 50 km"
      action={{ label: "Book your run", href: bookHref }}
      chapters={[
        {
          label: "Part one",
          mark: "I",
          title: "Virtual Run: Republic Day Edition",
          rows: [
            { k: "When", v: "Starts 19 January 2027. Awards on Republic Day, 26 January" },
            { k: "Where", v: "Anywhere you can run" },
            { k: "Distances", v: "5, 8, 10, 15, 21, 42 km, or 50 km over two days" },
            { k: "From", v: "₹599" },
            { k: "Includes", v: "Medal and goodie bag shipped to your home, free workshops" },
          ],
          cta: "Book virtual run",
          href: bookHref,
        },
        {
          label: "Part two",
          mark: "II",
          title: "Official Run: Race Day",
          rows: [
            { k: "When", v: "Sunday 14 March 2027" },
            { k: "Where", v: "Gachibowli Stadium, Hyderabad" },
            { k: "Details", v: `Distances, prices and what’s included: ${TBA.toLowerCase()}`, pending: true },
          ],
          cta: "Book race day",
          href: bookHref,
        },
      ]}
    />
  );
}

function Numbers() {
  return (
    <StatTable
      word="Run"
      hint="Pick up a card and move it around"
      centre={{ title: "Race day", value: "14.03", sub: "2027", caption: "Gachibowli Stadium, Hyderabad" }}
      stats={[
        { title: "Runners", value: "30,000", sub: "Up to, on race day" },
        { title: "Distances", value: "7", sub: "5 km to 50 km" },
        { title: "Virtual from", value: "₹599", sub: "Medal shipped home" },
        { title: "Workshops", value: String(workshopCount.total), sub: "Free", caption: `${workshopCount.before} before · ${workshopCount.after} after` },
        { title: "HR prize", value: "₹50K", sub: "Sector Challenges" },
        { title: "Given back", value: "NGOs", sub: "A share of our profits" },
        { title: "Virtual start", value: "19.01", sub: "2027", caption: "Run from anywhere" },
        { title: "Chapters", value: "2", sub: "One season" },
      ]}
    />
  );
}
