import type { Faq } from "@/lib/content";

/**
 * Stallion for Schools & Colleges, from Maya's page brief (27 November 2026).
 * Her [bracketed] suggestions are used as final (approved 27 November 2026).
 * `stillOpen` lists the blanks the brief left for later.
 */
export const schoolFee = "₹9,999";

export const schoolTrust = [
  "Open to schools and colleges across Hyderabad",
  "Conducted at your facility by partner NGOs",
  "Certificates for coordinators and students",
  "Organised by Lemerian Workin Pvt Ltd",
];

export const schoolBenefits = [
  { title: "Workshop at your campus", body: "Our team and partner NGO experts travel to you. No venue or travel arrangement needed from your side." },
  { title: "Certificate of Participation", body: "Every participating student receives one. The school or college coordinator receives one too." },
  { title: "Quiz and brainstorming round", body: "A fun, interactive session after the workshop to test and reinforce what students learned." },
  { title: "Prizes and souvenirs", body: "Winners of the quiz take home a prize or souvenir." },
  { title: "Recognition for your institution", body: "Your institution is featured on the Stallion Marathon website as a partner school or college, with permission." },
];

export const schoolSteps = [
  { label: "Register", value: "The coordinator fills the short form on this page. It takes about 3 minutes." },
  {
    label: "Confirm",
    value: "Our team calls or emails within 2 working days to confirm the date, time, student count and venue inside your campus.",
    note: `Institutions that booked themselves pay ${schoolFee} per session plus GST, online or by invoice, to lock the date. Institutions invited by our team pay nothing.`,
  },
  { label: "Workshop day", value: "Our team and a partner NGO arrive at your facility and conduct the workshop, followed by the quiz and brainstorming round." },
  { label: "Certificates and prizes", value: "Participation certificates are issued to students and the coordinator. Quiz winners receive their prize or souvenir on the spot." },
];

export const schoolTopics = [
  { title: "Animal care", body: "How to look after the animals around us, and what to do when one needs help." },
  { title: "Wild animal conservation", body: "Why wild animals matter, and how students can help protect them and their homes." },
  { title: "Reptile and snake show", body: "A live demonstration with trained handlers: tell snakes apart, stay safe and leave them be." },
];

export const schoolWhoCanApply = [
  "Schools in Hyderabad, Secunderabad and Cyberabad (classes 8 to 12)",
  "Junior colleges, degree colleges, engineering colleges and universities in Hyderabad, Secunderabad and Cyberabad",
  "Minimum group size: 30 students",
  "The institution provides a hall or open space and basic seating. Our team confirms requirements after registration.",
];

export const schoolFaqs: Faq[] = [
  {
    q: "Is there a fee for the institution?",
    a: `If our team approached your institution, the session is free. If your institution books through this page, the fee is ${schoolFee} per session plus GST (18% or as applicable), paid online or by invoice.`,
  },
  { q: "Where is the workshop held?", a: "At your school or college. Our team comes to you." },
  { q: "Who conducts the workshops?", a: "Partner NGOs working in animal care and wildlife conservation, together with the Stallion team." },
  { q: "How long does it take?", a: "The workshop is about 60 to 90 minutes, plus the quiz round of about 30 minutes." },
  { q: "Who gets a certificate?", a: "All students who attend, and the school or college coordinator." },
  { q: "What do winners get?", a: "Quiz winners receive a prize or souvenir from Stallion Marathon." },
  { q: "How many students can attend one session?", a: "Between 30 and 200. For larger groups, contact us." },
  { q: "Do we need to arrange anything?", a: "A hall or open space, seating, and a power point if possible. We bring the rest." },
  { q: "Can we book more than one session?", a: "Yes. Mention it in the form or contact us after your first session." },
  { q: "Is this connected to the Stallion Marathon on 14 March 2027?", a: "Yes. The program introduces students to the Stallion Marathon community." },
];

export const schoolShareMessage = (link: string) =>
  `Hi, I found this program called Stallion for Schools & Colleges. Their team and partner NGOs come to our campus for a workshop on animal care and wildlife, give certificates to students and the coordinator, and hold a quiz with prizes. A session is ${schoolFee}. Please check it out: ${link}`;

/** Blanks the brief left for later. */
export const stillOpen = [
  "Which partner NGO runs which topic, a line about each, and any more topics",
  "The quiz prize or souvenir",
  "Certificates printed on the day or emailed later",
  "Licensed handlers, safety distance and permissions for the live reptile and snake show",
  "Any discount or invite for students to the 14 March 2027 run",
  "Office hours",
];
