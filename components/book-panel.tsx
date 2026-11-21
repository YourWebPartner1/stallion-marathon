"use client";

import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { booking, site } from "@/lib/content";

const ease = [0.16, 1, 0.3, 1] as const;
const FRAME = "clamp(20px, 2.6vw, 36px)";

/** Gold button to a booking channel; until its link exists it books by phone instead. */
function ChannelButton({ url, label }: { url: string | null; label: string }) {
  const cls =
    "group inline-flex w-full items-center justify-between gap-4 bg-[#f7b538] px-6 py-4 text-lg tracking-[-0.01em] text-[#08335d] transition-colors duration-300 hover:bg-[#fdffff] sm:w-auto";
  const arrow = (
    <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1.5">
      →
    </span>
  );
  if (url) {
    return (
      <a href={url} className={cls} target="_blank" rel="noopener noreferrer">
        {label}
        {arrow}
      </a>
    );
  }
  return (
    <a href={`tel:+91${site.phone}`} className={cls}>
      Call {site.phoneDisplay} to book
      {arrow}
    </a>
  );
}

/** Gold-framed navy panel with the two booking channels side by side. */
export function BookPanel() {
  const channels = [
    {
      tag: "Primary channel",
      title: "Official website",
      body: "Virtual run, official race, Sector Challenge registration and workshop seats.",
      url: booking.websiteUrl,
      label: "Book on the website",
    },
    {
      tag: "Also on",
      title: "BookMyShow",
      body: "Virtual run and official race listings.",
      url: booking.bookMyShowUrl,
      label: "Book on BookMyShow",
    },
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
        className="notch flex items-stretch gap-[clamp(20px,2.94vw,40px)] bg-[#08335d] px-[clamp(20px,2.94vw,40px)] py-[clamp(40px,5.88vw,80px)] text-[#fdffff] max-[900px]:flex-col"
        style={{ "--n": "26px", "--o": FRAME } as CSSProperties}
      >
        {channels.map((c, i) => (
          <div key={c.title} className="contents">
            {i > 0 && <span aria-hidden className="w-px self-stretch bg-[#fdffff]/20 max-[900px]:h-px max-[900px]:w-full" />}
            <div className="flex flex-1 flex-col items-start gap-5">
              <p className="m-0 text-xs uppercase tracking-[0.14em] text-[#f7b538]">{c.tag}</p>
              <h3 className="display m-0 text-[clamp(36px,3.36vw,64px)] leading-none tracking-[-0.02em]">{c.title}</h3>
              <span aria-hidden className="flex w-[clamp(120px,10vw,180px)] items-center gap-3">
                <span className="h-px flex-1 bg-[#f7b538]/50" />
                <span className="size-2 rotate-45 bg-[#f7b538]" />
                <span className="h-px flex-1 bg-[#f7b538]/50" />
              </span>
              <p className="m-0 flex-1 text-lg leading-[1.35] text-[#fdffff]/70">{c.body}</p>
              <ChannelButton url={c.url} label={c.label} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
