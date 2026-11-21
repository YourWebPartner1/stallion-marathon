"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cubicBezier, motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export type Stat = { title: string; value: string; sub?: string; extra?: string; caption?: string };

const easeOut = cubicBezier(0.16, 1, 0.3, 1);
const NAVY = "#08335d";
const GOLD = "#f7b538";

// Resting spots for the eight small cards, in landing order (right side first,
// working left), sampled from the reference: centre x %, centre y %, final tilt,
// starting tilt, scroll progress where the drop starts.
const SPOTS: [number, number, number, number, number][] = [
  [64.8, 22, -3, -8, 0.14],
  [88.1, 22, 3, 7, 0.17],
  [87.9, 78, -2, -6, 0.24],
  [64.8, 78, -3, -9, 0.3],
  [35.2, 22, 3, 8, 0.36],
  [35.2, 78, 3, 9, 0.39],
  [11.9, 22, -3, -7, 0.46],
  [12.1, 78, 2, 6, 0.5],
];
const CENTRE: [number, number, number, number, number] = [50, 50, 0, 10, 0.58];
const DROP = 0.28; // share of the scroll each card takes to land

/**
 * Pinned "table" of stat cards: a giant outline word sits behind, and as the
 * section scrolls the cards drop from above into a 4 + 1 + 4 layout, the large
 * centre card last. Once down they can be picked up and moved. Below 1000px
 * and for reduced motion it is a plain grid.
 */
export function StatTable({ word, centre, stats, hint }: { word: string; centre: Stat; stats: Stat[]; hint: string }) {
  const ref = useRef<HTMLElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [still, setStill] = useState(false);
  const [top, setTop] = useState(-1);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 999.98px), (prefers-reduced-motion: reduce)");
    const update = () => setStill(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (still) {
    return (
      <section aria-label="The season in numbers" className="theme-light relative -mt-px bg-navy px-5 py-24 text-ink">
        <p aria-hidden className="caps m-0 text-center text-[40vw] leading-[0.8]" style={outline}>
          {word}
        </p>
        <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-4">
          <div className="col-span-2 mx-auto w-[min(72vw,320px)]">
            <Card stat={centre} big />
          </div>
          {stats.map((s) => (
            <Card key={s.title} stat={s} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="The season in numbers" className="theme-light relative -mt-px h-[320svh] bg-navy text-ink">
      <div ref={tableRef} className="sticky top-0 h-[100svh] overflow-clip">
        {/* Giant outline word, each letter rising from its own mask as the section arrives. */}
        <motion.p
          aria-hidden
          className="caps pointer-events-none absolute inset-0 m-0 flex items-center justify-center text-[85svh] leading-none"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {Array.from(word).map((ch, i) => (
            <span key={i} className="block overflow-hidden py-[0.06em]">
              <motion.span
                className="block"
                style={outline}
                variants={{
                  hidden: { y: "105%" },
                  show: { y: "0%", transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 } },
                }}
              >
                {ch}
              </motion.span>
            </span>
          ))}
        </motion.p>

        <h2 className="sr-only">The season in numbers</h2>
        <ul className="m-0 list-none p-0">
          {stats.map((s, i) => (
            <Dropped
              key={s.title}
              stat={s}
              spot={SPOTS[i % SPOTS.length]}
              progress={scrollYProgress}
              table={tableRef}
              z={top === i ? 20 : 1 + i}
              onLift={() => setTop(i)}
            />
          ))}
          <Dropped
            stat={centre}
            spot={CENTRE}
            big
            progress={scrollYProgress}
            table={tableRef}
            z={top === stats.length ? 20 : 10}
            onLift={() => setTop(stats.length)}
          />
        </ul>

        <p className="absolute bottom-6 left-1/2 m-0 -translate-x-1/2 whitespace-nowrap text-sm text-ink/60">{hint}</p>
      </div>
    </section>
  );
}

const outline: CSSProperties = { color: "transparent", WebkitTextStroke: `1.5px ${NAVY}` };

/** One card: falls into its spot as the section scrolls, then can be dragged. */
function Dropped({
  stat,
  spot,
  big = false,
  progress,
  table,
  z,
  onLift,
}: {
  stat: Stat;
  spot: [number, number, number, number, number];
  big?: boolean;
  progress: MotionValue<number>;
  table: React.RefObject<HTMLDivElement | null>;
  z: number;
  onLift: () => void;
}) {
  const [x, y, rot, rot0, start] = spot;
  const range = [start, start + DROP];
  // Starts well above the stage, so it falls in through the top edge.
  const dropY = useTransform(progress, range, ["-150svh", "0svh"], { ease: easeOut });
  const rotate = useTransform(progress, range, [rot0, rot], { ease: easeOut });

  return (
    <motion.li
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        zIndex: z,
        y: dropY,
        rotate,
        height: big ? "min(52.5svh, 25.2vw)" : "min(38.1svh, 18.3vw)",
        width: big ? "calc(min(52.5svh, 25.2vw) * 380 / 480)" : "calc(min(38.1svh, 18.3vw) * 277 / 349)",
      }}
    >
      <motion.div
        className="h-full w-full cursor-grab touch-none select-none"
        drag
        dragConstraints={table}
        dragElastic={0.12}
        dragMomentum={false}
        onPointerDown={onLift}
        whileDrag={{ scale: 1.04, cursor: "grabbing" }}
      >
        <Card stat={stat} big={big} />
      </motion.div>
    </motion.li>
  );
}

/** The card face: ivory with a double ruled frame, sized in card-relative units. */
function Card({ stat, big = false }: { stat: Stat; big?: boolean }) {
  const line = big ? GOLD : NAVY;
  return (
    <div className="relative aspect-[277/349] h-full w-full bg-navy text-center text-[#08335d] shadow-[0_20px_40px_-24px_rgba(8,51,93,0.55)] [container-type:size]">
      <span aria-hidden className="pointer-events-none absolute inset-[3.5cqh] border" style={{ borderColor: line }} />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[5cqh] border opacity-40"
        style={{ borderColor: line }}
      />
      {/* Padding lives on this inner layer so the card's own size stays the unit for everything inside. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[4.9cqh] p-[16.6cqh]">
        <p className="m-0 text-[3.5cqh] leading-tight tracking-[-0.01em]">{stat.title}</p>
        <span aria-hidden className="flex w-[34cqw] items-center gap-[2cqw]">
          <span className="h-px flex-1 bg-current opacity-40" />
          <span className="size-[1.6cqh] rotate-45" style={{ background: GOLD }} />
          <span className="h-px flex-1 bg-current opacity-40" />
        </span>
        <p className="caps m-0 whitespace-nowrap text-[12.7cqh] leading-[0.9]">{stat.value}</p>
        {stat.sub && <p className="caps m-0 text-[5.5cqh] leading-[0.95]">{stat.sub}</p>}
        {stat.extra && <p className="caps m-0 text-[5.5cqh] leading-[0.95] text-[#f7b538]">{stat.extra}</p>}
        {stat.caption && <p className="m-0 text-[2.9cqh] leading-snug opacity-60">{stat.caption}</p>}
      </div>
    </div>
  );
}
