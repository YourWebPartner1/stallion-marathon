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
import { ButtonLink } from "@/components/ui";
import { bookHref, heroArt, timers, workshopCount } from "@/lib/content";
import { ChessKnight } from "@/components/chess-knight";

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
        figureCaption={`free workshops, ${workshopCount.before} before and ${workshopCount.after} after`}
        lines={["Learn before you run.", "Heal after you finish."]}
        note="Free workshops for virtual run participants."
        cta={{ label: "See all workshops", href: "/workshops" }}
      />
      <TeaserBand
        id="schools-teaser"
        figure="₹1,999"
        figureCaption="per session, or free if our team invited you"
        lines={["Bring Stallion", "to your campus."]}
        note="Animal care and wildlife workshops at your school or college, led by partner NGOs. Certificates for everyone, prizes for quiz winners."
        cta={{ label: "Schools & Colleges", href: "/schools" }}
      />
      <TeaserBand
        id="challenges-teaser"
        figure="₹50K"
        figureCaption="HR Champion prize"
        lines={["Your team runs on deadlines.", "Give them a finish line."]}
        note="Corporate, Hospital, Pharmacy and Bank Challenges. The HR lead who brings the most bookings wins ₹50,000. Your team gets a wellness day they’ll actually show up for, and a leaderboard they’ll argue about on Slack."
        cta={{ label: "Enter your organisation", href: "/volunteers#register-organisation" }}
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
    <section aria-label="Hero" className="relative overflow-hidden bg-[linear-gradient(180deg,#ab71e3_0%,#9a62dc_22%,#6439bd_46%,#3b1f8e_100%)]">
      <HeroStage
        eyebrow="Hyderabad · Chapter I · 2027"
        title="Stallion"
        srTitle="Stallion Marathon, Chapter I"
        headline="Every race has a leader. Ours has a mane."
        signature="How’s your horsepower?"
        art={heroArt}
      >
        <p className="m-0 max-w-xl text-lg leading-[1.45] text-ink">
          The first marathon led by a stallion. Run the virtual edition from anywhere this January, then race behind him
          at Gachibowli Stadium on 14 March 2027.
        </p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <ButtonLink href={bookHref}>Book your run, from ₹599</ButtonLink>
          <Link href="#start-line-title" className="group inline-flex items-baseline gap-2 text-lg leading-[1.2] text-ink">
            <Roll text="Watch the start" under="text-gold" />
            <span aria-hidden className="inline-block transition-transform duration-500 group-hover:translate-y-1">
              ↓
            </span>
          </Link>
        </div>
        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink">
          {["Profits support animal care and children’s schooling", "Medal shipped home", "Also on BookMyShow"].map((t, i) => (
            <span key={t} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="size-1 rotate-45 bg-gold" />}
              {t}
            </span>
          ))}
        </p>
      </HeroStage>
    </section>
  );
}

/** The document's countdown strip: virtual run start and race day, side by side, under the hero. */
function CountdownStrip() {
  return (
    <section aria-label="Countdown" className="relative px-[max(20px,2.78vw)] pb-[clamp(56px,6vw,96px)]">
      <div className="grid border-y border-[#f2b705]/40 md:grid-cols-2">
        <div className="py-10 md:border-r md:border-[#f2b705]/40">
          <LiveCountdown spec={timers.virtual} size="large" />
        </div>
        <div className="border-t border-[#f2b705]/40 py-10 md:border-t-0">
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
            <ChessKnight className="text-[22px] text-gold" />
            <span className="h-px flex-1 bg-gold/40" />
          </span>
          <p className="label m-0 text-gold">Fig. 01 · The start</p>
          <h2 id="start-line-title" className="display m-0 text-[clamp(40px,3.99vw,76px)] leading-none tracking-[-0.02em]">
            Where a cyclist usually leads, a stallion runs.
          </h2>
          <p className="display m-0 text-[clamp(22px,1.57vw,30px)] leading-[1.25] text-ink/80">
            At most marathons, a lead cyclist shows the runners the way. In Hyderabad, on 14 March, a stallion will. He
            sets the pace for the first stretch, and thousands follow his hoofbeats out of Gachibowli Stadium.
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
    <section aria-labelledby="giving-strip" className="relative overflow-hidden bg-[#3b1f8e] px-[max(20px,2.78vw)] py-[max(64px,5.87vw)] text-[#f8f3fe]">
      <div className="grid items-center gap-x-6 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <GivingPie className="max-w-[640px]" />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
          <p className="label m-0 text-[#f2b705]">Giving back</p>
          <h2 id="giving-strip" className="display m-0 text-balance text-[clamp(32px,3.36vw,64px)] leading-[1.05] tracking-[-0.02em]">
            <span className="block">Your feet carry you.</span>
            <span className="block text-[#f2b705]">Your entry carries them.</span>
          </h2>
          <p className="m-0 max-w-xl text-lg leading-[1.45] text-[#f8f3fe]/80">
            Stallion&rsquo;s profits go to animal care, children&rsquo;s schooling and the NGOs who do this work every day.
            Every booking, every kilometre.
          </p>
          <Link href="/giving-back" className="group inline-flex w-fit items-baseline gap-2 text-xl leading-[1.2] tracking-[-0.01em]">
            <Roll text="Giving Back" under="text-[#f2b705]" />
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
      title="Two chapters. One season."
      statement={["Run from wherever you are.", "Then come and run behind him."]}
      count="7"
      caption="distances, 5 km to 50 km"
      action={{ label: "Book your run", href: bookHref }}
      chapters={[
        {
          label: "Part one",
          mark: "I",
          title: "Virtual Run, Republic Day Edition",
          lead: "Run from wherever you are.",
          rows: [
            { k: "When", v: "19 to 26 January 2027; winners named on Republic Day, 26 January" },
            { k: "Where", v: "Anywhere in India" },
            { k: "Distances", v: "5 to 50 km" },
            { k: "From", v: "₹599, with a medal and goodie bag shipped home and free workshops" },
            { k: "Winners", v: "The fastest virtual runners win a premium Race Day place" },
          ],
          cta: "Book Chapter I",
          href: bookHref,
        },
        {
          label: "Part two",
          mark: "II",
          title: "Race Day",
          lead: "Then come and run behind him.",
          rows: [
            { k: "When", v: "Sunday 14 March 2027" },
            { k: "Where", v: "Gachibowli Stadium, Hyderabad. Led by a stallion. Up to 30,000 runners" },
            { k: "Distances", v: "1–3 km Stud (Kids under 12), 5, 8, 10, 12, 15 and 21 km" },
            { k: "From", v: "₹455 (Stud) · ₹799 (5–21 km) · Signature & VIP up to ₹50,000" },
            { k: "Tiers", v: "Basic, Standard, Premium, Clydesdale, Mustang & Black Stallion VIP" },
          ],
          cta: "See race day packages",
          href: "/official-run#packages",
        },
      ]}
      footnote="Book here or on BookMyShow, same price."
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
        { title: "Runners", value: "30,000", sub: "Up to 30,000 runners on race day" },
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
