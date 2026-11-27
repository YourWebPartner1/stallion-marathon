import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "How Stallion Marathon uses the information you give when you book.",
};

// DRAFT: written from the master document's list of booking details. Have legal counsel review before launch.
export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      word="Privacy"
      title="Privacy policy"
      intro="This explains what information we collect when you book and how we use it."
      updated="November 2026"
      sections={[
        {
          heading: "What we collect",
          body: [
            "When you book we ask for your name, date of birth, gender, phone number, email, city, chosen distance, T-shirt size where applicable, delivery address for your medal and goodie bag, an emergency contact, your organisation's name if you are part of a Sector Challenge, and your acceptance of the participant waiver.",
          ],
        },
        {
          heading: "How we use it",
          body: [
            "To manage your booking, deliver your medal and goodie bag, publish results, run the Sector Challenges, contact you about the event and reach your emergency contact if needed.",
          ],
        },
        {
          heading: "Volunteer, challenge and school forms",
          body: [
            "The forms on the Volunteers page turn your answers into a WhatsApp message to us, which you send yourself. This website does not store them. We use them to contact you about volunteering, the Sector Challenges or the Educational Institutions Programme. WhatsApp's own privacy policy also applies.",
          ],
        },
        {
          heading: "Booking partners",
          body: ["If you book through BookMyShow, their own privacy policy also applies to the details you give them."],
        },
        {
          heading: "Contact",
          body: [`For questions about your information, call ${site.legalName} on ${site.phone}.`],
        },
      ]}
    />
  );
}
