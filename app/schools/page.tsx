import type { Metadata } from "next";
import Image from "next/image";
import { Accordion } from "@/components/accordion";
import { ButtonLink } from "@/components/button-link";
import { CountLedger, PageHeading } from "@/components/page-heading";
import { SchoolShare, SchoolStickyButton } from "@/components/school-extras";
import { SchoolForm } from "@/components/school-form";
import { ngoPartners, site } from "@/lib/content";
import { schoolBenefits, schoolFaqs, schoolFee, schoolSteps, schoolTopics, schoolTrust, schoolWhoCanApply } from "@/lib/schools";

export const metadata: Metadata = {
  alternates: { canonical: "/schools" },
  title: { absolute: "Stallion for Schools & Colleges | Animal & Wildlife Workshops in Hyderabad" },
  description:
    "Book animal care and wildlife conservation workshops at your school or college in Hyderabad, led by partner NGOs with the Stallion Marathon team. Certificates for students and coordinators, quiz prizes for winners.",
  keywords: [
    "school workshops Hyderabad",
    "college workshops Hyderabad",
    "animal care workshop for students",
    "wildlife conservation workshop",
    "snake show for schools Hyderabad",
    "Stallion Marathon schools",
  ],
};

const anchors = [
  { href: "#benefits", label: "Benefits" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#register", label: "Register" },
  { href: "#faqs", label: "FAQs" },
];

// Short descriptions for the partner logos on this page.
const ngoLines: Record<string, string> = {
  "Animal Warriors Conservation Society": "Animal rescue and conservation.",
  "Kacche Raaste Nature Awareness Center": "Nature awareness for children.",
};

// The quiz details box; Maya's brief leaves these to confirm.
const quizDetails = [
  ["Format", "Individual or team-based"],
  ["Winners", "1 winner per session, or the top 3"],
  ["Prize", "A prize or souvenir"],
];

const h2 = "display m-0 text-[clamp(36px,3.5vw,68px)] leading-[1.02] tracking-[-0.02em]";

/**
 * Stallion for Schools & Colleges, in the order of Maya's page brief: hero,
 * benefits, how it works, topics, certificates, quiz, who can apply, a note
 * for students, the registration form, FAQs and contact. Light theme only.
 */
export default function SchoolsPage() {
  return (
    <div className="theme-light bg-navy text-ink">
      <SchoolStickyButton />

      {/* 1. Hero */}
      <section className="px-[max(20px,2.78vw)] pb-12 pt-[max(120px,9.44vw)]">
        <PageHeading
          title="Schools & Colleges"
          label="Stallion for Schools & Colleges"
          statement={["Bring Stallion", "to your campus."]}
          aside={
            <CountLedger
              count={schoolFee}
              caption="per session if you book yourself. Free if our team invited you."
              rows={[
                { label: "Where", value: "Your campus" },
                { label: "Certificates", value: "Everyone" },
                { label: "Quiz", value: "Prizes" },
                { label: "Group", value: "30 to 200" },
              ]}
            />
          }
        />
        <div className="mt-14 grid gap-x-6 gap-y-8 border-t border-ink pt-12 lg:grid-cols-12">
          <div className="flex flex-col gap-6 lg:col-span-7">
            <p className="display m-0 text-[clamp(22px,1.68vw,32px)] leading-[1.3]">
              Our team and partner NGOs come to your school or college and run a hands-on workshop on animal care, wildlife
              and conservation. Free if our team invited you, {schoolFee} per session if you book yourself. Certificates
              for everyone. Prizes for quiz winners.
            </p>
            <div id="schools-hero-cta" className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href="#register">Register your institution</ButtonLink>
              <a
                href="/schools/stallion-schools-program-brief.pdf"
                download
                className="label inline-flex items-center border border-ink px-8 py-[18px] text-[0.8rem] text-ink transition-colors duration-300 hover:bg-ink hover:text-navy"
              >
                Download program brief (PDF)
              </a>
            </div>
            <p className="display m-0 text-[clamp(20px,1.47vw,28px)] italic text-gold">How&rsquo;s your horsepower?</p>
          </div>
          <ul className="m-0 flex list-none flex-col gap-3 self-end p-0 text-base text-ink/75 lg:col-span-4 lg:col-start-9">
            {schoolTrust.map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rotate-45 bg-gold" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Jump links */}
      <nav aria-label="On this page" className="sticky top-8 z-30 border-y border-ink/20 bg-navy/95 px-[max(20px,2.78vw)] backdrop-blur">
        <ul className="m-0 flex list-none gap-x-8 overflow-x-auto p-0 py-4 text-base">
          {anchors.map((a) => (
            <li key={a.href} className="shrink-0">
              <a href={a.href} className="underline-offset-4 hover:text-gold hover:underline">
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 2. What your institution gets */}
      <section id="benefits" aria-labelledby="benefits-title" className="scroll-mt-28 px-[max(20px,2.78vw)] py-[max(72px,6vw)]">
        <h2 id="benefits-title" className={`${h2} mb-10 border-b border-ink pb-10`}>
          What your institution gets
        </h2>
        <ul className="m-0 grid list-none gap-px bg-[#3b1f8e] p-px sm:grid-cols-2 lg:grid-cols-5">
          {schoolBenefits.map((b, i) => (
            <li key={b.title} className={`flex flex-col gap-4 bg-navy p-6 ${i === schoolBenefits.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <span aria-hidden className="grid size-12 place-items-center rounded-full border border-gold text-lg text-gold">
                {i + 1}
              </span>
              <h3 className="display m-0 mt-6 text-[clamp(24px,1.68vw,32px)] leading-[1.1] tracking-[-0.01em]">{b.title}</h3>
              <p className="m-0 text-base leading-[1.45] text-ink/75">{b.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. How it works */}
      <section id="how-it-works" aria-labelledby="how-title" className="theme-dark scroll-mt-28 px-[max(20px,2.78vw)] py-[max(72px,6vw)]">
        <h2 id="how-title" className={`${h2} mb-14`}>
          How it works
        </h2>
        <ol className="relative m-0 grid list-none gap-10 p-0 lg:grid-cols-4 lg:gap-6">
          <span aria-hidden className="absolute bottom-2 left-[23px] top-2 w-px bg-[#f2b705]/50 lg:bottom-auto lg:left-0 lg:right-0 lg:top-[23px] lg:h-px lg:w-auto" />
          {schoolSteps.map((s, i) => (
            <li key={s.label} className="relative flex gap-6 lg:flex-col lg:gap-8">
              <span className="relative z-[1] grid size-12 shrink-0 place-items-center rounded-full bg-[#f2b705] text-lg text-[#1e1146]">{i + 1}</span>
              <div className="flex flex-col gap-3">
                <h3 className="display m-0 text-[clamp(26px,2.1vw,40px)] leading-[1.05]">{s.label}</h3>
                <p className="m-0 text-base leading-[1.45] text-ink/85">{s.value}</p>
                {s.note && <p className="m-0 text-sm leading-[1.45] text-ink/70">{s.note}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. Workshop topics and partner NGOs */}
      <section aria-labelledby="topics-title" className="px-[max(20px,2.78vw)] py-[max(72px,6vw)]">
        <div className="mb-10 grid gap-y-4 border-b border-ink pb-10 lg:grid-cols-12 lg:gap-x-6">
          <h2 id="topics-title" className={`${h2} lg:col-span-7`}>
            Workshop topics
          </h2>
          <p className="m-0 self-end text-base leading-[1.35] text-ink/70 lg:col-span-5 lg:col-start-8 lg:text-right">
            Led by partner NGOs working in animal care and wildlife conservation. The coordinator picks one when registering.
            Each workshop is 60 to 90 minutes, followed by a quiz round of about 30 minutes, for groups of 30 to 200 students.
          </p>
        </div>
        <ul className="m-0 grid list-none gap-px bg-[#3b1f8e] p-px md:grid-cols-3">
          {schoolTopics.map((t, i) => (
            <li key={t.title} className="flex min-h-[clamp(220px,16vw,300px)] flex-col justify-between gap-8 bg-navy p-6">
              <span className="label text-gold">Topic {String(i + 1).padStart(2, "0")}</span>
              <div className="flex flex-col gap-3">
                <h3 className="display m-0 text-[clamp(26px,2.1vw,40px)] leading-[1.05]">{t.title}</h3>
                <p className="m-0 text-base leading-[1.45] text-ink/75">{t.body}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-14 grid gap-8 lg:grid-cols-12 lg:items-center">
          <h3 className="m-0 text-base font-normal text-ink/70 lg:col-span-3">Our partner NGOs</h3>
          <ul className="m-0 flex list-none flex-wrap gap-6 p-0 lg:col-span-9">
            {ngoPartners.map((p) => (
              <li key={p.name} className="flex items-center gap-5 bg-[#3b1f8e] px-6 py-5 text-[#f8f3fe]">
                <Image src={p.logo} alt={p.name} width={p.width} height={p.height} sizes="200px" className="h-16 w-auto" />
                <span className="max-w-[16ch] text-sm leading-[1.35] text-[#f8f3fe]/80">{ngoLines[p.name]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5. Certificates */}
      <section aria-labelledby="certificates-title" className="px-[max(20px,2.78vw)] py-[max(72px,6vw)]">
        <div className="grid items-center gap-x-6 gap-y-10 border-t border-ink pt-14 lg:grid-cols-12">
          <div className="flex flex-col gap-5 lg:col-span-5">
            <h2 id="certificates-title" className={h2}>
              Certificates for students and for your coordinator
            </h2>
            <p className="m-0 text-lg leading-[1.45] text-ink/80">
              Every student who attends receives a Certificate of Participation. The school or college coordinator who
              organises the session receives a Certificate of Participation as well, in recognition of bringing the program
              to their campus.
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <SampleCertificate />
          </div>
        </div>
      </section>

      {/* 6. Quiz and 7. Who can apply */}
      <section aria-label="Quiz and who can apply" className="px-[max(20px,2.78vw)] py-[max(72px,6vw)]">
        <div className="grid gap-px bg-[#3b1f8e] p-px lg:grid-cols-2">
          <div className="flex flex-col gap-5 bg-navy p-[clamp(24px,3vw,56px)]">
            <h2 className={h2}>Answer. Think. Win.</h2>
            <p className="m-0 text-lg leading-[1.45] text-ink/80">
              After the workshop, we run a quiz with a brainstorming round. Students answer questions, discuss with their
              teams and compete. Each quiz has a winner, and winners receive a prize or souvenir from Stallion Marathon.
            </p>
            <dl className="m-0 mt-2 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-ink/20 pt-5 text-base">
              {quizDetails.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-ink/60">{k}</dt>
                  <dd className="m-0">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-col gap-5 bg-navy p-[clamp(24px,3vw,56px)]">
            <h2 className={h2}>Who can apply</h2>
            <ul className="m-0 flex list-none flex-col gap-3 p-0 text-lg leading-[1.4] text-ink/80">
              {schoolWhoCanApply.map((w) => (
                <li key={w} className="flex items-start gap-3">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rotate-45 bg-gold" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 8. For students */}
      <section aria-labelledby="students-title" className="theme-dark px-[max(20px,2.78vw)] py-[max(72px,6vw)]">
        <div className="grid gap-x-6 gap-y-8 lg:grid-cols-12">
          <h2 id="students-title" className={`${h2} lg:col-span-6`}>
            Want this at your school or college? Tell your teachers.
          </h2>
          <div className="flex flex-col gap-6 self-end lg:col-span-5 lg:col-start-8">
            <p className="m-0 text-lg leading-[1.45] text-ink/85">
              Learn about animals and wildlife from experts, get a certificate, and you could win a prize in the quiz. Your
              school or college can book a session for {schoolFee}. Share this page with your teacher, principal or student
              coordinator and ask them to register. It takes 3 minutes.
            </p>
            <SchoolShare />
            <a href="/schools/stallion-schools-flyer.pdf" download className="w-fit text-base underline underline-offset-4 hover:text-[#f2b705]">
              Download a one-page flyer (PDF) to print or hand to your coordinator
            </a>
          </div>
        </div>
      </section>

      {/* 9. Registration form */}
      <section id="register" aria-labelledby="register-title" className="scroll-mt-28 px-[max(20px,2.78vw)] py-[max(72px,6vw)]">
        <div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <h2 id="register-title" className={h2}>
              Register your institution
            </h2>
            <p className="m-0 text-lg leading-[1.4] text-ink/75">Takes about 3 minutes. We will contact you within 2 working days.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <SchoolForm />
          </div>
        </div>
      </section>

      {/* 10. FAQs */}
      <section id="faqs" aria-labelledby="faqs-title" className="scroll-mt-28 px-[max(20px,2.78vw)] py-[max(72px,6vw)]">
        <h2 id="faqs-title" className={`${h2} mb-10`}>
          FAQs
        </h2>
        <Accordion items={schoolFaqs} />
      </section>

      {/* 11. Contact */}
      <section aria-labelledby="contact-title" className="px-[max(20px,2.78vw)] pb-[max(96px,8.33vw)] pt-8">
        <div className="grid gap-x-6 gap-y-6 border-y border-ink py-14 lg:grid-cols-12">
          <h2 id="contact-title" className={`${h2} lg:col-span-6`}>
            Questions? Talk to us.
          </h2>
          <div className="flex flex-col gap-2 self-end text-lg lg:col-span-5 lg:col-start-8">
            <p className="m-0">
              Phone and WhatsApp:{" "}
              <a href={`tel:+91${site.phone}`} className="underline underline-offset-4 hover:text-gold">
                {site.phoneDisplay}
              </a>
            </p>
            {site.email && (
              <p className="m-0">
                Email:{" "}
                <a href={`mailto:${site.email}`} className="underline underline-offset-4 hover:text-gold">
                  {site.email}
                </a>
              </p>
            )}
            <p className="m-0 text-base text-ink/70">Organised by Lemerian Workin Pvt Ltd, Banjara Hills, Hyderabad.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/** A sample certificate in the site's colours, with the name blurred. */
function SampleCertificate() {
  return (
    <svg viewBox="0 0 720 500" role="img" aria-label="Sample Certificate of Participation, name blurred" className="block h-auto w-full shadow-[0_24px_60px_rgba(30,17,70,0.18)]">
      <defs>
        <filter id="cert-blur">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect width="720" height="500" fill="#fdfaf3" />
      <rect x="18" y="18" width="684" height="464" fill="none" stroke="#3b1f8e" strokeWidth="10" />
      <rect x="36" y="36" width="648" height="428" fill="none" stroke="#f2b705" strokeWidth="2.5" />
      <rect x="44" y="44" width="632" height="412" fill="none" stroke="#f2b705" strokeWidth="1" />
      <image href="/brand/sm-crest-gold.png" x="324" y="58" width="72" height="72" />
      <text x="360" y="172" textAnchor="middle" fill="#3b1f8e" fontFamily="Georgia, serif" fontSize="36" letterSpacing="1">
        Certificate of Participation
      </text>
      <text x="360" y="204" textAnchor="middle" fill="#8a6500" fontFamily="Arial, sans-serif" fontSize="13" letterSpacing="4">
        STALLION FOR SCHOOLS &amp; COLLEGES
      </text>
      <text x="360" y="246" textAnchor="middle" fill="#1e1146" fillOpacity="0.7" fontFamily="Georgia, serif" fontSize="17" fontStyle="italic">
        This is presented to
      </text>
      <g filter="url(#cert-blur)">
        <text x="360" y="296" textAnchor="middle" fill="#1e1146" fontFamily="Georgia, serif" fontSize="38">
          Student Name Here
        </text>
      </g>
      <line x1="200" y1="312" x2="520" y2="312" stroke="#f2b705" strokeWidth="1.5" />
      <text x="360" y="346" textAnchor="middle" fill="#1e1146" fillOpacity="0.75" fontFamily="Georgia, serif" fontSize="16">
        for taking part in the Animal Care workshop with our partner NGOs
      </text>
      {[180, 540].map((x, i) => (
        <g key={x}>
          <line x1={x - 90} y1="410" x2={x + 90} y2="410" stroke="#3b1f8e" strokeWidth="1" />
          <text x={x} y="430" textAnchor="middle" fill="#1e1146" fillOpacity="0.65" fontFamily="Arial, sans-serif" fontSize="11" letterSpacing="2">
            {i ? "PARTNER NGO" : "STALLION MARATHON"}
          </text>
        </g>
      ))}
      <path d="M360 382 l14 24 -14 24 -14 -24 Z" fill="#f2b705" />
    </svg>
  );
}
