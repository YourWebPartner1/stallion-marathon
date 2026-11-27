import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: "/refund-policy" },
  title: "Refund Policy",
  description: "Refund policy for Stallion Marathon, Chapter I.",
};

// DRAFT: the master document still needs to confirm whether this covers the virtual run and any transfer rules.
export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      word="Refunds"
      title="Refund policy"
      intro="Please read this before you book."
      updated="November 2026"
      sections={[
        {
          heading: "Tickets are non-refundable",
          body: ["Once a booking is confirmed, the ticket price cannot be refunded."],
        },
        {
          heading: "Questions",
          body: [`If you have a question about your booking, call ${site.legalName} on ${site.phone}.`],
        },
      ]}
    />
  );
}
