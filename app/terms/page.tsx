import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms",
  description: "Terms and conditions for Stallion Marathon, Chapter I.",
};

// DRAFT: the master document lists final terms wording as an open item. Have legal counsel review before launch.
export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      word="Terms"
      title="Terms & conditions"
      intro="These terms apply to every booking for Stallion Marathon, Chapter I: the Virtual Run and the Official Run."
      updated="November 2026"
      sections={[
        {
          heading: "Organiser",
          body: [`Stallion Marathon, Chapter I is organised by ${site.legalName}, which also takes all payments.`],
        },
        {
          heading: "Booking",
          body: [
            "Bookings are made on the official website or on BookMyShow. Both channels show the same event names, distances and prices.",
            "By booking you confirm that the details you give are accurate and you accept the participant waiver.",
          ],
        },
        {
          heading: "Refunds",
          body: ["Tickets are non-refundable. See the Refund Policy for details."],
        },
        {
          heading: "Virtual Run",
          body: [
            "The Virtual Run is open from 19 to 26 January 2027, and winners are announced on 26 January 2027. Accepted proof of run and how winners are chosen will be published before the run starts.",
            "Medals and goodie bags are shipped to the delivery address you give when booking.",
          ],
        },
        {
          heading: "Official Run",
          body: [
            "The Official Run takes place on Sunday 14 March 2027. Start times will be announced. Runners must follow the instructions of marshals and medical staff on race day.",
          ],
        },
        {
          heading: "Prizes and premium tickets",
          body: [
            "Virtual Run winners receive a prize, recognition, a trophy and a premium ticket to the Official Run, valid for any race category they choose.",
          ],
        },
        {
          heading: "Contact",
          body: [`Questions about these terms: call ${site.phoneDisplay} or email ${site.email}.`],
        },
      ]}
    />
  );
}
