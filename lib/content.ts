/**
 * All site copy and event data, taken from the "Stallion Marathon Website
 * Content Master Document" (6 November 2026).
 *
 * The document marks unconfirmed facts in [square brackets]. Those are kept as
 * `null` here: the site either hides them or shows "To be announced". Fill
 * them in as they are confirmed. Open items from the document:
 *  - Official race: distances, prices, early-bird prices, inclusions, premium
 *    ticket details, start time, written venue approval.
 *  - Virtual run: close date, proof-of-run method, how winners are chosen,
 *    prize details, which days count for the Two-Day Stallion, delivery,
 *    GST/fees.
 *  - Workshops: dates, venue, speakers, seat booking.
 *  - Sector Challenges: registration form link, attribution, cut-off,
 *    leaderboard visibility, announcement date.
 *  - Brand and legal: dedicated email, partner NGOs, final legal wording.
 */

export const TBA = "To be announced";

export const site = {
  name: "Stallion Marathon",
  fullName: "Stallion Marathon, Chapter I",
  tagline: "How's your horsepower?",
  pitch: "Run your distance, your way, then take the start line behind a stallion.",
  organiser: "Stallion Marathon Organising Team",
  phone: "7075701406",
  phoneDisplay: "7075701406",
  // Not yet supplied: a dedicated Stallion Marathon address. Hidden until set.
  email: null as string | null,
  // The live address, used for search engines and share links. Set
  // NEXT_PUBLIC_SITE_URL in Vercel once the own domain is connected.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://stallion-marathon.vercel.app").replace(/\/$/, ""),
};

/** Every public page, for the sitemap. */
export const pages = [
  "/",
  "/virtual-run",
  "/official-run",
  "/workshops",
  "/volunteers",
  "/giving-back",
  "/book",
  "/faq",
  "/contact",
  "/terms",
  "/waiver",
  "/refund-policy",
  "/privacy",
] as const;

/**
 * Optional cover artwork for the homepage hero, shown in front of the lower half
 * of the title. Put the file in /public and fill this in, e.g.
 * { src: "/hero-stallion.png", alt: "Gilded stallion", width: 1600, height: 1400 }.
 * A transparent PNG or WebP works best.
 */
// Using the SM crest until commissioned artwork arrives. Set to null for a text-only hero.
export const heroArt = {
  src: "/hero/stallion-chapter-one.webp",
  alt: "Cream and gold stallion wearing a finisher's medal, its mane flowing into runners passing Charminar, an equestrian leading the field on a stadium track, marigolds, running shoes and a stopwatch",
  width: 1233,
  height: 1276,
} as { src: string; alt: string; width: number; height: number } | null;

export const booking = {
  // Set these once the links exist. Until then booking buttons fall back to the phone number.
  websiteUrl: null as string | null,
  bookMyShowUrl: null as string | null,
};

export const forms = {
  // Sector Challenges registration form, [form link] in the content document.
  challengeUrl: null as string | null,
};

/** Until a separate form is supplied, challenges register on the Volunteers page. */
export const challengeHref = forms.challengeUrl ?? "/volunteers#register-organisation";

/** Where a "Book" button should go. */
export const bookHref = "/book";

export const dates = {
  virtualStart: "2027-01-19T00:00:00+05:30",
  virtualClose: null as string | null, // [close date]
  winners: "2027-01-26T00:00:00+05:30",
  // Targets midnight until the flag-off time is announced.
  raceDay: "2027-03-14T00:00:00+05:30",
};

export type TimerSpec = {
  id: string;
  target: string;
  label: string;
  dateText: string;
  zeroMessage: string;
};

export const timers = {
  virtual: {
    id: "virtual",
    target: dates.virtualStart,
    label: "Virtual Run starts in",
    dateText: "19 January 2027",
    zeroMessage: "The Virtual Run is live. Start running.",
  },
  winners: {
    id: "winners",
    target: dates.winners,
    label: "Winners announced in",
    dateText: "26 January 2027",
    zeroMessage: "It is Republic Day. Winners announced today.",
  },
  race: {
    id: "race",
    target: dates.raceDay,
    label: "Race Day in",
    dateText: "14 March 2027",
    zeroMessage: "It is Race Day. See you at Gachibowli.",
  },
} satisfies Record<string, TimerSpec>;

export const nav = [
  { href: "/virtual-run", label: "Virtual Run" },
  { href: "/official-run", label: "Official Run" },
  { href: "/workshops", label: "Workshops" },
  { href: "/volunteers", label: "Volunteers" },
  { href: "/giving-back", label: "Giving Back" },
  { href: "/faq", label: "FAQ" },
] as const;

export const footerLinks = [
  { href: "/", label: "Home" },
  ...nav,
  { href: "/book", label: "Book Now" },
  { href: "/contact", label: "Contact" },
];

export const legalLinks = [
  { href: "/terms", label: "Terms" },
  { href: "/waiver", label: "Participant Waiver" },
  { href: "/refund-policy", label: "Refund Policy" },
  { href: "/privacy", label: "Privacy Policy" },
];

export const pillars = [
  { title: "Run your way", body: "Pick 5 km or go the full 42 km. Run it where you like." },
  { title: "More than a race", body: "Free workshops, from how to run to how to handle bullies." },
  { title: "Earn your place", body: "Win the virtual run and get a premium ticket to race day in any category." },
  { title: "Run for something", body: "A share of our profits goes to NGOs doing good work." },
];

/**
 * NGO partners, in the order shown. To add one: put its logo in assets/ngo, prepare
 * it with scripts/ngo-logos.mjs (it must read well on navy) and list it here. `url`
 * is the NGO's website; while null the logo is not a link.
 */
export const ngoPartners: { name: string; logo: string; width: number; height: number; url: string | null }[] = [
  { name: "Animal Warriors Conservation Society", logo: "/ngo/animal-warriors.webp", width: 900, height: 399, url: null },
  { name: "Kacche Raaste Nature Awareness Center", logo: "/ngo/kacche-raaste.webp", width: 1024, height: 409, url: null },
];

export type Tier = {
  name: string;
  distance: string;
  km: number;
  price: number;
  bestFor: string;
};

export const tiers: Tier[] = [
  { name: "Trot", distance: "5 km", km: 5, price: 599, bestFor: "First-timers, families, easy starts" },
  { name: "Canter", distance: "8 km", km: 8, price: 699, bestFor: "Stepping up from 5 km" },
  { name: "Gallop", distance: "10 km", km: 10, price: 799, bestFor: "The classic benchmark distance" },
  { name: "Charge", distance: "15 km", km: 15, price: 899, bestFor: "Building toward a half marathon" },
  { name: "Half Stallion", distance: "21 km", km: 21, price: 1199, bestFor: "Half marathon runners" },
  { name: "Full Stallion", distance: "42 km", km: 42, price: 1299, bestFor: "Full marathon runners" },
  {
    name: "Two-Day Stallion",
    distance: "25 km a day for two days (50 km total)",
    km: 50,
    price: 1599,
    bestFor: "Passionate endurance runners",
  },
];

export const twoDayCopy = "Two days. 25 km each day. 50 km in total. For the runner who wants more than a marathon.";

// [inclusive or extra]: hidden until confirmed.
export const priceNote = null as string | null;

/**
 * Early-bird offers, one per event. While set and before its deadline, each
 * package shows the standard price struck through beside the early-bird price,
 * with a countdown to the deadline. Fill in when decided, for example:
 * virtual: { ends: "2026-12-31T23:59:59+05:30", prices: { Trot: 499, Canter: 599 } }
 */
export type EarlyBird = { ends: string; prices: Record<string, number> };
export const earlyBird: { virtual: EarlyBird | null; official: EarlyBird | null } = {
  virtual: null, // [early-bird prices and end date]
  official: null, // [early-bird prices and end date]
};

export const everyRunnerGets = [
  "A finisher's medal shipped to your home",
  "A goodie bag shipped to your home",
  "Free workshops with the Stallion team, for runners who can attend in Hyderabad",
  "A chance to win",
];

export const winnersGet = [
  "A prize", // [prize details]
  "Public recognition on our channels",
  "A trophy delivered to your home",
  "A premium ticket to the official Stallion Marathon on 14 March 2027, valid for any race category you choose",
];

export const virtualSteps = [
  { title: "Book", body: "Book your distance on this website or on BookMyShow." },
  { title: "Run", body: "Run from 19 January 2027, anywhere you like. The closing date will be announced." },
  { title: "Submit", body: "Submit your run. How to submit will be announced before the start." },
  { title: "Results", body: "Watch for results on Republic Day, 26 January 2027." },
  { title: "Receive", body: "Receive your medal and goodie bag at home. Winners also receive their trophy and prize." },
];

export const venue = {
  name: "Gachibowli Stadium",
  fullName: "GMC Balayogi Gachibowli Stadium",
  address: "GMC Balayogi Gachibowli Stadium, Gachibowli Sports Complex, Hyderabad",
  runners: "Up to 30,000",
  date: "Sunday 14 March 2027",
};

export const raceFacts = [
  { label: "Event", value: "Stallion Marathon, Chapter I" },
  { label: "Date", value: "Sunday 14 March 2027" },
  { label: "Venue", value: venue.address },
  { label: "Start time and flag-off", value: TBA },
  { label: "Expected participation", value: "Up to 30,000 runners" },
  { label: "Distances and prices", value: TBA },
  { label: "Bookings", value: "Official website and BookMyShow" },
  { label: "Organiser", value: site.organiser },
];

export type Workshop = {
  id: string;
  title: string;
  body: string;
  phase: "before" | "after";
};

export const workshops: Workshop[] = [
  { id: "w01", phase: "before", title: "How to Run", body: "Pace, breathing and form for your first or fastest run." },
  { id: "w02", phase: "before", title: "How to Golf", body: "A calm, skilful game you can take up at any age." },
  { id: "w03", phase: "before", title: "Diet for a Working Day", body: "Eat for energy when you sit at a desk all day." },
  { id: "w13", phase: "before", title: "Snake Awareness Programme", body: "The different kinds of snakes and the habitats they live in." },
  { id: "w14", phase: "before", title: "Reptile Interaction", body: "How reptiles react and where they live, from the largest plant-eating lizard to desert lizards." },
  { id: "w04", phase: "after", title: "Physical Wellbeing", body: "Recover well and keep your body moving." },
  { id: "w05", phase: "after", title: "Self-Defence", body: "Practical moves and awareness to stay safe." },
  { id: "w06", phase: "after", title: "Beating Short Attention Span", body: "Focus habits that work in a distracted world." },
  { id: "w07", phase: "after", title: "Cognitive Intelligence", body: "Train how you think, decide and remember." },
  { id: "w08", phase: "after", title: "Psychological Wellbeing", body: "Tools for a steadier mind." },
  { id: "w09", phase: "after", title: "How Gratitude Makes You a Millionaire", body: "Why gratitude shapes success and wealth." },
  { id: "w10", phase: "after", title: "How to Pitch and Sell", body: "Say what you do so people want it." },
  { id: "w11", phase: "after", title: "Protecting Your Data from Cybercrime", body: "Simple steps to stay safe online." },
  { id: "w12", phase: "after", title: "Handling Bullies", body: "Stay composed and stand up for yourself." },
];

export const headcountBands = ["1,000 to 4,999", "5,000 to 9,999", "10,000 or more"];

export const challenges = [
  { name: "Corporate Challenge", who: "Companies with 1,000 or more people", picked: "One overall winner", banded: false },
  { name: "Hospital Challenge", who: "Hospitals and healthcare organisations", picked: "One winner per headcount category", banded: true },
  { name: "Pharmacy Challenge", who: "Pharmacies and pharma organisations", picked: "One winner per headcount category", banded: true },
  { name: "Bank Challenge", who: "Banks", picked: "One winner per headcount category", banded: true },
];

export const challengePrizes = [
  { title: "HR Champion", body: "The HR lead who brings the most bookings wins ₹50,000 cash and a public mention." },
  { title: "Winning organisation", body: "A trophy, a stage mention on race day and special-edition medals for its participants." },
];

export const challengeSteps = [
  "The HR lead registers the organisation.",
  "Employees book on the official website or BookMyShow, selecting the organisation.",
  "Bookings are counted until the cut-off date, to be announced.",
  "Winners are announced at a date to be confirmed.",
];

/** Educational institutions programme, from Maya's handwritten notes (24 November 2026). */
export const schoolSteps = [
  { label: "Register", value: "Register your school or college below. We confirm the visit by call and email." },
  { label: "Visit", value: "A trainer visits your campus, and two flex boards stay up for one week." },
  {
    label: "Talk",
    value: "The marathon and its workshops, why it is important to be physically fit, and why running is a habit worth taking up.",
    note: "Students are also encouraged to get their parents running.",
  },
  { label: "Test", value: "A short revision test on what was covered." },
];

export const schoolRewards = [
  { title: "Every student", body: "Everyone who attends gets a certificate." },
  { title: "Top 10", body: "The top 10 in the revision test get a small gift, such as a badge." },
  { title: "Top performer", body: "Complimentary access to any workshop they like." },
  { title: "Lucky draw", body: "Any interested student gets a chance to volunteer at the marathon." },
  { title: "Teachers", body: "Teachers who conduct the programme get a certificate and the option to volunteer for the marathon." },
];

export const deraPillars = [
  { letter: "D", title: "Delicious", body: "A thank-you meal for jawans (army, navy, air force) and police personnel." },
  { letter: "E", title: "Education", body: "Support for children: stationery, hygiene education, school fees." },
  { letter: "R", title: "Respectable burial", body: "Dignified burial for stray animals." },
  { letter: "A", title: "Animal care", body: "Medical support, tree planting and green cover, adoption." },
];

export const bookingSteps = [
  "Choose your chapter: Virtual Run or Official Run.",
  "Choose your distance or package.",
  "Enter your details and accept the participant waiver.",
  "Pay securely.",
  "Receive your confirmation.",
];

export type Faq = { q: string; a: string };
export type FaqGroup = { group: string; items: Faq[] };

export const faqs: FaqGroup[] = [
  {
    group: "General",
    items: [
      { q: "What is Stallion Marathon?", a: "A two-part running festival in Hyderabad: a virtual run for Republic Day 2027 and the official race on 14 March 2027 at Gachibowli Stadium." },
      { q: "Where can I book?", a: "On this website and on BookMyShow." },
      { q: "Who do I contact?", a: `Call ${site.phone}.` },
    ],
  },
  {
    group: "Virtual Run",
    items: [
      { q: "When does the virtual run start and end?", a: "It starts on 19 January 2027, one week before Republic Day. The submission closing date will be announced. Winners are announced on 26 January 2027." },
      { q: "Where do I run the virtual run?", a: "Anywhere you like." },
      { q: "What distances can I choose?", a: "5 km, 8 km, 10 km, 15 km, 21 km and 42 km, or the Two-Day Stallion: 25 km a day for two days, 50 km in total." },
      { q: "How much does it cost?", a: "5 km ₹599, 8 km ₹699, 10 km ₹799, 15 km ₹899, 21 km ₹1,199, 42 km ₹1,299, Two-Day Stallion ₹1,599." },
      { q: "What do I get?", a: "A finisher's medal and a goodie bag delivered to your home, and free workshops if you can attend in Hyderabad." },
      { q: "What do winners get?", a: "A prize, recognition, a trophy delivered to your home, and a premium ticket to the official race on 14 March 2027 in any category you choose." },
    ],
  },
  {
    group: "Official Run",
    items: [
      { q: "Where and when is the official race?", a: "Sunday 14 March 2027 at GMC Balayogi Gachibowli Stadium, Hyderabad. Start time to be announced." },
      { q: "How many runners are expected?", a: "Up to 30,000." },
    ],
  },
  {
    group: "Workshops and Challenges",
    items: [
      { q: "Are the workshops free?", a: "Yes, for virtual run participants who can attend in Hyderabad." },
      { q: "Can my company take part?", a: "Yes, through the Sector Challenges for Corporate, Hospital, Pharmacy and Bank organisations. HR leads register their organisation." },
      { q: "Can my school or college take part?", a: "Yes, through the Educational Institutions Programme. Register on the Volunteers page." },
      { q: "Can I volunteer?", a: "Yes. Fill in the form on the Volunteers page." },
    ],
  },
  {
    group: "Money",
    items: [
      { q: "Can I get a refund?", a: "Tickets are non-refundable." },
      { q: "Where does the money go?", a: "A share of our profits goes to NGOs working on causes aligned with our four pillars." },
    ],
  },
];

/** Workshop counts, so every mention stays right when sessions change. */
export const workshopCount = {
  total: workshops.length,
  before: workshops.filter((w) => w.phase === "before").length,
  after: workshops.filter((w) => w.phase === "after").length,
};

/** A small number in words, for sentences ("Fourteen free sessions"). */
export const numberWord = (n: number) =>
  ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty"][n] ?? String(n);
