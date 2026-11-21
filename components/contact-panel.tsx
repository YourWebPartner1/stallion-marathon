"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { Roll } from "@/components/roll";
import { site } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;
const FRAME = "clamp(20px, 2.6vw, 36px)";

/** Gold-framed navy panel: the phone number large on the left, the details on the right. */
export function ContactPanel() {
  const rows = [
    { label: "Organiser", value: site.organiser },
    { label: "Phone", value: site.phoneDisplay },
    ...(site.email ? [{ label: "Email", value: site.email }] : []),
    { label: "Bookings", value: "Official website and BookMyShow" },
  ];
  return (
    <motion.div
      className="notch bg-[#f7b538]"
      style={{ "--n": "26px", "--o": "0px", padding: FRAME } as unknown as CSSProperties}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 1, ease }}
    >
      <div
        className="notch flex items-center gap-[clamp(20px,2.94vw,40px)] bg-[#08335d] px-[clamp(20px,2.94vw,40px)] py-[clamp(40px,5.88vw,80px)] text-[#fdffff] max-[900px]:flex-col"
        style={{ "--n": "26px", "--o": FRAME } as CSSProperties}
      >
        <div className="flex flex-1 flex-col items-center gap-5 text-center">
          <p className="m-0 text-xs uppercase tracking-[0.14em] text-[#fdffff]/60">Call us</p>
          <a
            href={`tel:+91${site.phone}`}
            className="group display text-[clamp(44px,5.03vw,96px)] leading-none tracking-[-0.02em]"
          >
            <Roll text={site.phoneDisplay} under="text-[#f7b538]" />
          </a>
          <span aria-hidden className="flex w-[clamp(140px,15.5vw,220px)] items-center gap-3">
            <span className="h-px flex-1 bg-[#f7b538]/50" />
            <span className="size-2 rotate-45 bg-[#f7b538]" />
            <span className="h-px flex-1 bg-[#f7b538]/50" />
          </span>
          <p className="m-0 text-xl text-[#f7b538]">{site.organiser}</p>
          {site.email && (
            <a href={`mailto:${site.email}`} className="text-base text-[#fdffff]/70 underline underline-offset-4">
              {site.email}
            </a>
          )}
        </div>

        <span aria-hidden className="w-px self-stretch bg-[#fdffff]/20 max-[900px]:h-px max-[900px]:w-full" />

        <div className="flex w-full flex-1 flex-col">
          <p className="display m-0 pb-4 text-[clamp(22px,1.68vw,32px)] leading-[1.2]">
            Questions about booking, teams or race day? Get in touch with the Stallion Marathon Organising Team.
          </p>
          <dl className="m-0 flex flex-col">
            {rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[minmax(110px,35%)_1fr] gap-4 border-b border-[#f7b538]/80 py-4">
                <dt className="text-sm text-[#fdffff]/60">{r.label}</dt>
                <dd className="m-0 text-lg leading-[1.3]">{r.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </motion.div>
  );
}
