/**
 * Editorial diagram of the start: the lead horse ahead of the field on the stadium track.
 * Stands in for a photograph until race imagery exists.
 */
import { Ticket } from "@/components/ticket";

export function StartLineArt() {
  const lanes = [0, 1, 2, 3, 4, 5];
  return (
    <Ticket fill="navy" padding="p-6 sm:p-10">
    <figure className="relative">
      <svg viewBox="0 0 480 360" className="h-auto w-full" role="img" aria-labelledby="start-art-title">
        <title id="start-art-title">
          Diagram of the start: a horse and rider lead the field of runners out from the stadium start line
        </title>
        {/* track lanes */}
        {lanes.map((l) => (
          <line key={l} x1={40 + l * 80} y1={20} x2={40 + l * 80} y2={340} stroke="var(--line)" strokeWidth={1} />
        ))}
        {/* start line */}
        <line x1={40} y1={250} x2={440} y2={250} stroke="var(--gold)" strokeWidth={2} />
        <text x={40} y={274} fill="var(--muted)" fontFamily="var(--font-label)" fontSize={10} letterSpacing={3}>
          START · GACHIBOWLI
        </text>
        {/* field of runners behind the line */}
        {Array.from({ length: 30 }).map((_, i) => {
          const col = i % 10;
          const row = Math.floor(i / 10);
          return (
            <circle
              key={i}
              cx={64 + col * 38 + (row % 2) * 19}
              cy={290 + row * 18}
              r={4}
              fill="var(--beige)"
              opacity={0.55 - row * 0.15}
            />
          );
        })}
        {/* lead marker */}
        <line x1={240} y1={250} x2={240} y2={90} stroke="var(--gold)" strokeDasharray="3 6" strokeWidth={1} />
        <circle cx={240} cy={80} r={30} fill="none" stroke="var(--gold)" strokeWidth={1} />
        <circle cx={240} cy={80} r={10} fill="var(--gold)" />
        <text
          x={282}
          y={76}
          fill="var(--gold)"
          fontFamily="var(--font-label)"
          fontSize={10}
          letterSpacing={3}
        >
          LEAD HORSE
        </text>
        <text x={282} y={92} fill="var(--muted)" fontFamily="var(--font-label)" fontSize={9} letterSpacing={2}>
          IN PLACE OF THE LEAD CYCLIST
        </text>
      </svg>
      <figcaption className="label mt-6 flex justify-between text-muted">
        <span>Fig. 01 · The start</span>
        <span>Race day · 14.03.27</span>
      </figcaption>
    </figure>
    </Ticket>
  );
}
