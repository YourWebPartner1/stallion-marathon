import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Waiver",
  description: "Participant waiver and release for Stallion Marathon, Chapter I.",
};

// DRAFT: written as a starting point only. Have it reviewed by legal counsel before launch.
export default function WaiverPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      word="Waiver"
      title="Participant waiver"
      intro="Every runner accepts this waiver when they register for Stallion Marathon, Chapter I."
      updated="November 2026"
      sections={[
        {
          heading: "Fitness to run",
          body: [
            "I confirm that I am medically fit to take part and have trained for my chosen distance. I will consult a doctor if I have any condition that could put me at risk.",
          ],
        },
        {
          heading: "Assumption of risk",
          body: [
            "I understand that distance running carries risks, including injury, illness and, in rare cases, death. I take part voluntarily and accept these risks.",
            "For the virtual run, I am responsible for choosing a safe route, following traffic rules and running in suitable conditions.",
          ],
        },
        {
          heading: "Medical treatment",
          body: [
            "I allow event medical staff to give me first aid or medical treatment if needed, and to arrange transport to a hospital at my own cost.",
          ],
        },
        {
          heading: "The equestrian start",
          body: [
            "I understand that the race is led out by a horse and rider. I will keep the distance set by marshals and stay behind the start line until instructed.",
          ],
        },
        {
          heading: "Release",
          body: [
            "To the extent permitted by law, I release the organisers, sponsors, partners and volunteers from liability for any loss, injury or damage arising from my participation, except where caused by their negligence.",
          ],
        },
      ]}
    />
  );
}
