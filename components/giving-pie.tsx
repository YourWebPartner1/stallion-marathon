"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;
const GOLD = "#f7b538";
const CX = 240;
const CY = 250;
const R = 190;
// The share that goes to NGOs, as a slice at the upper right.
const FROM = -62;
const TO = -26;
const MID = (FROM + TO) / 2;

const n = (v: number) => Math.round(v * 100) / 100;
const at = (deg: number, r: number) => {
  const a = (deg * Math.PI) / 180;
  return `${n(CX + Math.cos(a) * r)} ${n(CY + Math.sin(a) * r)}`;
};
const wedge = (from: number, to: number, r: number) =>
  `M${CX} ${CY}L${at(from, r)}A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${at(to, r)}Z`;

// Engraved rays across the rest of the pie.
const rays = Array.from({ length: 80 }, (_, i) => TO + 4.05 + i * 4.05)
  .filter((d) => d < FROM + 360 - 3)
  .map((d, i) => `M${at(d, i % 2 ? R * 0.5 : R * 0.22)}L${at(d, R * 0.9)}`)
  .join("");

const OUT = 34;
const shift = { x: n(Math.cos((MID * Math.PI) / 180) * OUT), y: n(Math.sin((MID * Math.PI) / 180) * OUT) };

/**
 * An animated pie: the circle of profits is drawn, then one slice fills with
 * gold, parts from the rest and is named. No figure is shown. Plays once, the
 * first time it is seen; drawn for navy bands.
 */
export function GivingPie({ className = "" }: { className?: string }) {
  const still = useReducedMotion();
  const show = (delay: number, duration = 0.9) => ({ duration: still ? 0 : duration, delay: still ? 0 : delay, ease });

  return (
    <motion.svg
      viewBox="0 0 620 470"
      role="img"
      aria-label="Pie diagram of our profits: one slice goes to NGO donations."
      className={`block h-auto w-full overflow-visible ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.45 }}
    >
      {/* The rest of the profits */}
      <motion.path
        d={wedge(TO, FROM + 360, R)}
        fill="#0e3f6e"
        stroke={GOLD}
        strokeWidth={3}
        strokeLinejoin="round"
        variants={{
          hidden: { pathLength: 0, fillOpacity: 0 },
          show: { pathLength: 1, fillOpacity: 1, transition: { pathLength: show(0, 1.3), fillOpacity: show(0.7, 0.8) } },
        }}
      />
      <motion.path
        d={rays}
        fill="none"
        stroke={GOLD}
        strokeOpacity={0.42}
        strokeWidth={1.5}
        strokeLinecap="round"
        variants={{ hidden: { opacity: 0, scale: 0.6 }, show: { opacity: 1, scale: 1, transition: show(0.55, 1.1) } }}
        style={{ transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}
      />
      <motion.text
        x={CX - 46}
        y={CY + 88}
        textAnchor="middle"
        fill="#fdffff"
        stroke="#0e3f6e"
        strokeWidth={12}
        paintOrder="stroke"
        className="display"
        fontSize={34}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: show(1) } }}
      >
        Our profits
      </motion.text>

      {/* The slice for NGOs */}
      <motion.g variants={{ hidden: { x: 0, y: 0 }, show: { ...shift, transition: show(1.55, 1) } }}>
        <motion.path
          d={wedge(FROM, TO, R)}
          fill={GOLD}
          stroke={GOLD}
          strokeWidth={3}
          strokeLinejoin="round"
          variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: show(1.05, 0.8) } }}
          style={{ transformOrigin: `${CX}px ${CY}px`, transformBox: "view-box" }}
        />
        {/* A heart on the slice */}
        <motion.g
          variants={{ hidden: { opacity: 0, scale: 0 }, show: { opacity: 1, scale: 1, transition: show(1.9, 0.6) } }}
          style={{ transformOrigin: `${at(MID, R * 0.74).split(" ").map((v) => `${v}px`).join(" ")}`, transformBox: "view-box" }}
        >
          <path
            transform={`translate(${at(MID, R * 0.74)}) scale(1.25)`}
            d="M0 13C-16 2-19-6-16-12C-12-19-3-18 0-10C3-18 12-19 16-12C19-6 16 2 0 13Z"
            fill="#08335d"
          >
            {!still && (
              <animateTransform
                attributeName="transform"
                additive="sum"
                type="scale"
                values="1;1.14;1;1.08;1"
                keyTimes="0;0.12;0.26;0.38;0.6"
                dur="2.6s"
                repeatCount="indefinite"
              />
            )}
          </path>
        </motion.g>
      </motion.g>

      {/* Its name */}
      <motion.path
        d="M414 120L446 92H470"
        fill="none"
        stroke={GOLD}
        strokeWidth={2}
        variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: show(2, 0.6) } }}
      />
      <motion.text
        x={480}
        y={84}
        fill={GOLD}
        className="display"
        fontSize={38}
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: show(2.2, 0.6) } }}
      >
        <tspan x={480}>NGO</tspan>
        <tspan x={480} dy={38}>
          donations
        </tspan>
      </motion.text>
    </motion.svg>
  );
}
