/**
 * Vets caring for stray animals, drawn in the hero stallion's palette: brown ink,
 * cream, marigold and olive. Two drawings share one ground line. They sit side by
 * side on wide screens and stack on phones so the figures stay readable.
 */
import type { CSSProperties, ReactNode } from "react";
import { SceneStage } from "@/components/scene-stage";

const C = {
  ink: "#3b2410",
  cream: "#f5deb3",
  tan: "#dcae6c",
  tanDark: "#b98345",
  coat: "#fdf8ec",
  coatShade: "#e6d6b4",
  gold: "#f7b538",
  marigold: "#ec9a1f",
  marigoldDark: "#c9741a",
  olive: "#7d7a3f",
  oliveDark: "#5f5c2c",
  teal: "#5f97ad",
  skin: "#b87a4b",
  hair: "#24150c",
  rose: "#d8695c",
};

const line = { stroke: C.ink, strokeWidth: 3, strokeLinejoin: "round", strokeLinecap: "round" } as const;
const thin = { stroke: C.ink, strokeWidth: 1.6, strokeLinecap: "round", fill: "none", opacity: 0.55 } as const;

const GROUND = 540;

/** A part that turns or scales around the point (x, y) in drawing units. */
function Part({ x, y, motion, delay = 0, children }: { x: number; y: number; motion: string; delay?: number; children: ReactNode }) {
  return (
    <g
      className={`vet-part vet-${motion}`}
      style={{ "--ox": `${x}px`, "--oy": `${y}px`, animationDelay: `${delay}s` } as CSSProperties}
    >
      {children}
    </g>
  );
}

function Heart({ x, y, size = 1, delay = 0 }: { x: number; y: number; size?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <path
        className="vet-heart"
        style={{ animationDelay: `${delay}s` }}
        d="M0 12 C-22 -4 -20 -24 -8 -24 C-2 -24 0 -18 0 -15 C0 -18 2 -24 8 -24 C20 -24 22 -4 0 12 Z"
        fill={C.rose}
        {...line}
        strokeWidth={2.4}
      />
    </g>
  );
}

/** Marigold head: three rings of round petals. */
function Marigold({ x, y, r = 26 }: { x: number; y: number; r?: number }) {
  const ring = (n: number, dist: number, petal: number, fill: string, turn = 0) =>
    Array.from({ length: n }, (_, i) => {
      const a = ((i + turn) / n) * Math.PI * 2;
      return (
        <circle
          key={`${n}-${i}`}
          cx={(x + Math.cos(a) * dist).toFixed(1)}
          cy={(y + Math.sin(a) * dist).toFixed(1)}
          r={petal.toFixed(1)}
          fill={fill}
          stroke={C.ink}
          strokeWidth={1.5}
        />
      );
    });
  return (
    <g>
      {ring(11, r * 0.78, r * 0.27, C.marigoldDark)}
      {ring(9, r * 0.5, r * 0.26, C.marigold, 0.5)}
      {ring(6, r * 0.24, r * 0.2, C.gold)}
      <circle cx={x} cy={y} r={r * 0.14} fill={C.marigoldDark} />
    </g>
  );
}

function Leaf({ x, y, turn, size = 1 }: { x: number; y: number; turn: number; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn}) scale(${size})`}>
      <path d="M0 0 C12 -20 40 -22 58 -4 C40 10 14 12 0 0 Z" fill={C.olive} {...line} strokeWidth={2.2} />
      <path d="M4 -1 Q28 -8 52 -4" {...thin} />
    </g>
  );
}

function Posy({ x, flip = false }: { x: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} 0)${flip ? " scale(-1 1)" : ""}`}>
      <Leaf x={4} y={536} turn={-150} size={0.9} />
      <Leaf x={34} y={534} turn={-28} size={0.95} />
      <Leaf x={14} y={526} turn={-84} size={0.85} />
      <Marigold x={18} y={516} r={28} />
      <Marigold x={54} y={528} r={19} />
    </g>
  );
}

function FallingLeaf({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        className="vet-leaf"
        style={{ animationDelay: `${delay}s` }}
        d="M0 0 C5 -9 18 -10 26 -2 C18 5 6 6 0 0 Z"
        fill={C.gold}
        opacity={0.8}
      />
    </g>
  );
}

/** The gold ring behind each group, with beads around it like a Mucha halo. */
function Halo({ x, y, r }: { x: number; y: number; r: number }) {
  return (
    <g fill="none" stroke={C.gold}>
      <circle cx={x} cy={y} r={r} fill={C.gold} fillOpacity={0.1} strokeWidth={2} />
      <circle cx={x} cy={y} r={r - 22} strokeWidth={1} opacity={0.6} />
      {Array.from({ length: 40 }, (_, i) => {
        const a = (i / 40) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={(x + Math.cos(a) * (r - 11)).toFixed(1)}
            cy={(y + Math.sin(a) * (r - 11)).toFixed(1)}
            r={2.6}
            fill={C.gold}
            stroke="none"
            opacity={0.8}
          />
        );
      })}
    </g>
  );
}

function Ground({ width }: { width: number }) {
  return (
    <g>
      <line x1={0} x2={width} y1={GROUND} y2={GROUND} stroke={C.gold} strokeWidth={2} />
      <line x1={0} x2={width} y1={GROUND + 9} y2={GROUND + 9} stroke={C.gold} strokeWidth={1} opacity={0.45} />
    </g>
  );
}

/**
 * A vet kneeling on one knee, facing right, hands at about (330, 398).
 * `held` is drawn in the moving hand.
 */
function Vet({ look, held, workDelay = 0 }: { look: "bun" | "short"; held?: ReactNode; workDelay?: number }) {
  return (
    <g>
      {/* Back leg: knee on the ground, shoe behind */}
      <path d="M150 440 Q148 500 172 518 L176 540 L70 540 Q62 524 78 516 L120 508 Q112 470 118 440 Z" fill={C.oliveDark} {...line} />
      <path d="M86 514 L50 506 Q38 512 40 540 L84 540 Z" fill={C.hair} {...line} />
      {/* Front leg: thigh forward, shin down */}
      <path d="M150 424 Q215 408 264 420 Q290 428 288 456 L282 522 L240 522 L238 466 Q190 478 150 474 Z" fill={C.olive} {...line} />
      <path d="M238 518 L284 518 Q312 522 314 540 L236 540 Z" fill={C.hair} {...line} />

      {/* Coat */}
      <Part x={180} y={430} motion="breathe" delay={workDelay}>
        <path
          d="M150 282 Q166 262 196 262 Q228 266 238 300 Q250 350 246 420 Q248 452 262 468 Q220 484 182 470 Q160 496 112 506 Q100 440 118 372 Q128 312 150 282 Z"
          fill={C.coat}
          {...line}
        />
        <path d="M150 300 Q128 350 122 430 Q118 470 114 500 Q142 494 160 480 Q140 400 150 300 Z" fill={C.coatShade} />
        <path d="M228 300 Q236 370 230 462 M190 468 Q196 440 192 412" {...thin} />
        {/* Scrubs and collar */}
        <path d="M196 264 L214 306 L230 280 Q220 266 204 262 Z" fill={C.teal} {...line} strokeWidth={2.4} />
        <path d="M188 262 Q196 286 214 312 L206 264 Z" fill={C.coat} {...line} strokeWidth={2.4} />
        {/* Pocket with a paw */}
        <path d="M176 396 L216 398 L214 432 Q196 438 178 430 Z" fill={C.coat} {...line} strokeWidth={2} />
        <g fill={C.marigold}>
          <ellipse cx={196} cy={420} rx={6.5} ry={5.5} />
          <circle cx={187} cy={412} r={2.8} />
          <circle cx={193} cy={408} r={2.8} />
          <circle cx={200} cy={408} r={2.8} />
          <circle cx={206} cy={413} r={2.8} />
        </g>
      </Part>

      {/* Head, looking down at the patient */}
      <Part x={196} y={258} motion="nod" delay={workDelay}>
        <path d="M184 236 L186 270 Q200 280 214 270 L216 240 Z" fill={C.skin} {...line} strokeWidth={2.4} />
        {look === "bun" && <circle cx={152} cy={198} r={20} fill={C.hair} {...line} />}
        <path
          d="M172 206 Q174 170 208 168 Q238 170 242 200 L250 216 Q250 222 242 222 L240 234 Q236 250 220 250 Q198 250 188 240 Q172 228 172 206 Z"
          fill={C.skin}
          {...line}
        />
        {look === "bun" ? (
          <path d="M166 226 Q150 176 196 160 Q232 154 244 192 Q222 190 208 182 Q206 206 196 216 Q190 232 180 238 Q170 236 166 226 Z" fill={C.hair} {...line} />
        ) : (
          <>
            <path d="M170 222 Q156 170 198 158 Q238 152 246 186 Q224 194 206 186 Q204 204 196 212 L190 230 Q176 232 170 222 Z" fill={C.hair} {...line} />
            <path d="M194 222 Q196 252 222 252 Q238 250 241 234 Q228 240 220 230 Q206 230 194 222 Z" fill={C.hair} {...line} strokeWidth={2} />
          </>
        )}
        {/* Ear, eye, brow, smile */}
        <path d="M196 208 Q188 204 188 214 Q190 224 198 220" fill={C.skin} {...line} strokeWidth={2.2} />
        <path d="M222 206 Q229 210 235 205" fill="none" {...line} strokeWidth={2.4} />
        <path d="M220 195 Q228 190 237 194" fill="none" {...line} strokeWidth={2.4} />
        <path d="M224 234 Q232 238 238 231" fill="none" {...line} strokeWidth={2.2} stroke={look === "bun" ? C.ink : C.cream} />
        {look === "bun" && <Marigold x={172} y={180} r={12} />}
      </Part>

      {/* Far arm steadies, near arm works */}
      <Part x={190} y={306} motion="work" delay={workDelay}>
        <path d="M172 300 Q186 288 206 300 Q226 330 244 362 L306 384 L300 412 L232 400 Q208 388 192 362 Q172 326 172 300 Z" fill={C.coat} {...line} />
        <path d="M206 352 Q220 366 234 372 M192 340 Q200 356 212 366" {...thin} />
        <path d="M302 384 Q326 380 340 392 Q346 402 334 408 Q318 416 299 411 Z" fill={C.skin} {...line} strokeWidth={2.4} />
        <path d="M324 394 L338 398" {...thin} />
        {held}
      </Part>
    </g>
  );
}

/** A street dog sitting, facing left, one front paw held out to the vet. */
function Dog() {
  return (
    <g>
      <Part x={474} y={522} motion="wag">
        <path d="M470 520 Q512 520 528 486 Q534 462 524 452 Q512 456 510 476 Q500 498 468 500 Z" fill={C.tan} {...line} />
      </Part>
      <Part x={430} y={540} motion="breathe" delay={0.4}>
        <path d="M378 318 L440 312 Q450 352 462 390 Q488 430 488 490 Q488 528 468 540 L380 540 Q376 470 366 420 Q360 366 378 318 Z" fill={C.tan} {...line} />
        <path d="M374 372 Q366 396 370 416 L390 414 Q398 392 394 374 Z" fill={C.cream} />
        {/* Haunch */}
        <path d="M424 538 Q414 486 446 466 Q478 464 486 500 Q488 530 468 540 Z" fill={C.tan} {...line} strokeWidth={2.4} />
        <path d="M410 540 Q406 524 426 522 L466 526 Q474 540 462 540 Z" fill={C.cream} {...line} strokeWidth={2.4} />
        <path d="M450 400 Q460 416 466 430 M440 406 Q448 420 452 434 M462 486 Q470 494 472 506" {...thin} />
        {/* Standing front leg */}
        <path d="M372 436 Q370 486 376 520 Q360 524 360 540 L402 540 Q404 486 404 450" fill={C.tan} {...line} strokeWidth={2.6} />
      </Part>

      {/* Lifted paw and its bandage */}
      <path d="M392 402 Q366 418 344 408 Q322 402 318 416 Q318 432 338 436 Q368 444 394 434" fill={C.tan} {...line} strokeWidth={2.6} />
      <path d="M322 412 Q328 418 324 426" {...thin} />
      <g fill="none" strokeLinecap="round">
        {[348, 357, 366].map((x, i) => (
          <g key={x}>
            <path className="vet-wrap" style={{ animationDelay: `${i * 0.35}s` }} pathLength={1} d={`M${x - 4} 409 Q${x + 4} 424 ${x - 1} 438`} stroke={C.ink} strokeWidth={13} />
            <path className="vet-wrap" style={{ animationDelay: `${i * 0.35}s` }} pathLength={1} d={`M${x - 4} 409 Q${x + 4} 424 ${x - 1} 438`} stroke={C.coat} strokeWidth={9} />
          </g>
        ))}
      </g>

      {/* Head */}
      <Part x={410} y={340} motion="nod" delay={0.8}>
        <path d="M382 258 Q408 244 434 262 Q450 290 440 324 Q424 352 396 350 Q376 348 366 334 Q340 336 330 322 Q326 308 344 302 Q360 298 366 284 Q370 266 382 258 Z" fill={C.tan} {...line} />
        <path d="M366 334 Q340 336 330 322 Q326 308 344 302 Q362 306 372 318 Q374 330 366 334 Z" fill={C.cream} {...line} strokeWidth={2.2} />
        <path d="M328 312 Q328 302 340 303 Q346 310 338 316 Q330 318 328 312 Z" fill={C.hair} />
        <path d="M342 328 Q354 330 364 324" fill="none" {...line} strokeWidth={2.2} />
        <path d="M348 331 Q350 346 360 344 Q366 338 362 328 Z" fill={C.rose} {...line} strokeWidth={2} />
        <g>
          <Part x={380} y={288} motion="blink" delay={1}>
            <ellipse cx={380} cy={288} rx={5.5} ry={7} fill={C.hair} />
            <circle cx={378} cy={285} r={1.8} fill={C.coat} />
          </Part>
        </g>
        <path d="M370 274 Q378 268 386 272" fill="none" {...line} strokeWidth={2.2} />
        <Part x={420} y={262} motion="flick" delay={0.5}>
          <path d="M408 258 Q438 244 458 272 Q468 302 452 320 Q430 312 424 290 Q418 272 408 258 Z" fill={C.tanDark} {...line} />
        </Part>
        <path d="M378 354 Q414 368 449 344" fill="none" stroke={C.ink} strokeWidth={15} strokeLinecap="round" />
        <path d="M378 354 Q414 368 449 344" fill="none" stroke={C.rose} strokeWidth={10} strokeLinecap="round" />
        <circle cx={402} cy={372} r={8} fill={C.gold} {...line} strokeWidth={2} />
      </Part>
    </g>
  );
}

/** Open first-aid kit with a paw on it. */
function Kit({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx={22} cy={496} r={9} fill={C.coat} {...line} strokeWidth={2} />
      <circle cx={22} cy={496} r={3.5} {...thin} />
      <rect x={38} y={486} width={12} height={20} rx={2} fill={C.teal} {...line} strokeWidth={2} />
      <Part x={64} y={500} motion="lid">
        <path d="M2 500 L2 488 Q2 480 10 480 L56 480 Q64 480 64 488 L64 500 Z" fill={C.marigold} {...line} strokeWidth={2.4} />
        <path d="M24 480 Q24 470 33 470 Q42 470 42 480" fill="none" {...line} strokeWidth={2.4} />
      </Part>
      <rect x={0} y={500} width={66} height={40} rx={5} fill={C.gold} {...line} strokeWidth={2.4} />
      <circle cx={33} cy={520} r={13} fill={C.coat} {...line} strokeWidth={1.8} />
      <g fill={C.ink}>
        <ellipse cx={33} cy={523.5} rx={4.6} ry={3.8} />
        <circle cx={26.5} cy={518.5} r={1.9} />
        <circle cx={31} cy={515} r={1.9} />
        <circle cx={35.5} cy={515} r={1.9} />
        <circle cx={40} cy={518.5} r={1.9} />
      </g>
    </g>
  );
}

/** A cat sitting on a crate, facing right. */
function Cat() {
  return (
    <g>
      <rect x={36} y={456} width={112} height={84} rx={3} fill={C.tanDark} {...line} />
      <path d="M36 484 L148 484 M36 512 L148 512 M62 456 L62 540 M122 456 L122 540" {...thin} />
      <Part x={62} y={446} motion="swish">
        <path d="M66 454 Q28 456 26 420 Q26 396 12 392 Q6 400 12 416 Q10 474 66 470 Z" fill={C.marigold} {...line} strokeWidth={2.6} />
      </Part>
      <Part x={92} y={456} motion="breathe" delay={0.2}>
        <path d="M86 352 Q118 350 124 396 Q130 430 130 456 L58 456 Q50 420 64 386 Q70 360 86 352 Z" fill={C.marigold} {...line} />
        <path d="M108 372 Q122 396 118 440 Q104 420 102 384 Z" fill={C.cream} />
        <path d="M104 456 Q100 426 108 408 M60 412 Q70 416 78 414 M58 428 Q70 432 80 429 M68 396 Q76 400 82 398" {...thin} />
        <path d="M98 456 Q98 444 112 444 Q132 444 134 456 Z" fill={C.cream} {...line} strokeWidth={2.2} />
      </Part>
      <Part x={96} y={366} motion="nod" delay={0.3}>
        <Part x={78} y={318} motion="flick" delay={1.6}>
          <path d="M70 324 L66 286 L98 308 Z" fill={C.marigold} {...line} strokeWidth={2.6} />
        </Part>
        <path d="M106 308 L134 288 L132 326 Z" fill={C.marigold} {...line} strokeWidth={2.6} />
        <path d="M98 304 Q134 304 138 336 Q136 368 100 370 Q64 368 62 336 Q66 306 98 304 Z" fill={C.marigold} {...line} />
        <path d="M108 344 Q126 338 134 348 Q130 366 108 367 Q98 360 108 344 Z" fill={C.cream} />
        <path d="M88 306 L90 320 M98 304 L99 320 M108 306 L107 320 M64 336 L76 338 M65 346 L76 345" {...thin} opacity={0.8} />
        <path d="M90 336 Q96 330 102 336" fill="none" {...line} strokeWidth={2.6} />
        <path d="M120 336 Q126 330 131 336" fill="none" {...line} strokeWidth={2.6} />
        <path d="M111 344 L119 344 L115 349 Z" fill={C.rose} {...line} strokeWidth={1.4} />
        <path d="M115 349 Q111 356 105 353 M115 349 Q119 356 125 353" fill="none" {...line} strokeWidth={1.8} />
        <path d="M130 349 L152 344 M130 354 L152 356 M98 350 L80 348 M98 355 L80 359" {...thin} strokeWidth={1.3} stroke={C.coat} opacity={0.8} />
      </Part>
    </g>
  );
}

/** A street cow with a marigold garland, standing behind the vet and looking left. */
function Cow() {
  return (
    <g>
      <Part x={728} y={262} motion="swish" delay={0.6}>
        <path d="M722 258 Q764 280 752 372" fill="none" stroke={C.ink} strokeWidth={11} strokeLinecap="round" />
        <path d="M722 258 Q764 280 752 372" fill="none" stroke={C.cream} strokeWidth={5.5} strokeLinecap="round" />
        <path d="M752 364 Q736 392 748 422 Q768 400 758 364 Z" fill={C.hair} {...line} strokeWidth={2} />
      </Part>
      {/* Far legs */}
      <path d="M528 400 L526 526 L560 526 L562 400 Z M664 400 L668 526 L700 526 L698 400 Z" fill={C.tanDark} {...line} strokeWidth={2.6} />
      <path d="M524 522 L562 522 L564 540 L522 540 Z M666 522 L702 522 L704 540 L664 540 Z" fill={C.hair} {...line} strokeWidth={2} />
      <Part x={590} y={420} motion="breathe" delay={0.9}>
        <path
          d="M452 300 Q452 252 486 240 Q500 206 536 232 Q600 246 684 236 Q730 238 734 300 Q738 372 716 408 Q690 420 650 410 Q590 436 520 414 Q478 410 462 372 Q450 340 452 300 Z"
          fill={C.cream}
          {...line}
        />
        <path d="M560 250 Q612 248 632 282 Q626 326 582 328 Q546 318 546 284 Q548 262 560 250 Z M676 300 Q712 292 728 318 Q726 366 706 384 Q674 372 668 336 Z" fill={C.tan} opacity={0.9} />
        <path d="M480 392 Q488 404 500 408 M600 414 Q630 412 648 404 M700 262 Q716 276 718 300 M520 250 Q530 258 532 270" {...thin} />
      </Part>
      {/* Near legs */}
      <path d="M484 388 Q482 450 486 526 L522 526 Q524 460 530 412 M692 396 Q690 460 704 526 L736 526 Q738 450 727 372" fill={C.cream} {...line} strokeWidth={2.6} />
      <path d="M484 522 L524 522 L526 540 L482 540 Z M702 522 L738 522 L740 540 L700 540 Z" fill={C.hair} {...line} strokeWidth={2} />
      <path d="M496 452 Q504 458 514 454 M710 452 Q720 458 728 454" {...thin} />

      {/* Neck, dewlap and head */}
      <Part x={478} y={300} motion="nod" delay={0.2}>
        <path d="M492 240 Q448 216 414 212 L398 284 Q426 312 440 356 Q458 396 486 386 Q500 320 492 240 Z" fill={C.cream} {...line} />
        <path d="M432 318 Q446 330 452 356 M420 300 Q440 306 456 330" {...thin} />
        <path d="M400 200 Q360 192 354 154 Q354 140 366 130 Q366 162 408 180 Z M422 198 Q462 188 466 148 Q466 134 454 126 Q456 158 414 180 Z" fill={C.coatShade} {...line} strokeWidth={2.4} />
        <path d="M392 208 Q362 194 342 210 Q356 230 388 224 Z" fill={C.tan} {...line} strokeWidth={2.4} />
        <path d="M432 196 Q410 178 388 194 Q372 216 366 252 Q350 280 348 304 Q352 328 378 326 Q398 322 408 296 Q432 262 438 228 Q440 206 432 196 Z" fill={C.cream} {...line} />
        <path d="M358 286 Q346 296 348 308 Q354 328 378 326 Q396 322 402 304 Q384 286 358 286 Z" fill={C.tan} {...line} strokeWidth={2.2} />
        <ellipse cx={360} cy={301} rx={3.6} ry={5} fill={C.hair} transform="rotate(20 360 301)" />
        <path d="M358 316 Q374 320 388 311" fill="none" {...line} strokeWidth={2} />
        <Part x={394} y={238} motion="blink" delay={2.2}>
          <ellipse cx={394} cy={238} rx={6} ry={7.5} fill={C.hair} />
          <circle cx={392} cy={235} r={2} fill={C.coat} />
        </Part>
        <path d="M384 226 Q394 220 404 226" fill="none" {...line} strokeWidth={2.2} />
        <path d="M402 196 Q408 206 412 196 Q420 206 424 196 Q414 188 402 196 Z" fill={C.tanDark} />
        <Part x={436} y={214} motion="flick" delay={2.4}>
          <path d="M432 210 Q460 196 486 214 Q474 236 444 232 Q432 224 432 210 Z" fill={C.tan} {...line} strokeWidth={2.6} />
          <path d="M444 216 Q460 210 474 216" {...thin} />
        </Part>
        {[
          [486, 250],
          [478, 278],
          [472, 306],
          [466, 334],
          [462, 362],
          [472, 388],
        ].map(([x, y]) => (
          <Marigold key={y} x={x} y={y} r={17} />
        ))}
      </Part>
    </g>
  );
}

export function VetScene({ className = "" }: { className?: string }) {
  return (
    <SceneStage className={`vet-stage ${className}`}>
      <div className="grid items-end gap-y-10 lg:grid-cols-[560fr_760fr]">
        <svg viewBox="0 0 560 560" className="block h-auto w-full overflow-visible" role="img" aria-labelledby="vet-dog-title">
          <title id="vet-dog-title">A vet kneels to bandage the paw of a stray dog, whose tail is wagging</title>
          <Halo x={280} y={310} r={222} />
          <FallingLeaf x={150} y={120} delay={-2} />
          <FallingLeaf x={420} y={90} delay={-6} />
          <Ground width={560} />
          <Kit x={314} />
          <Dog />
          <Vet
            look="bun"
            held={
              <g>
                <circle cx={344} cy={388} r={13} fill={C.coat} {...line} strokeWidth={2.4} />
                <path d="M344 388 Q348 382 351 388 Q350 397 341 395 Q334 388 341 380" {...thin} />
              </g>
            }
          />
          <Posy x={-4} />
          <Heart x={352} y={250} />
          <Heart x={318} y={280} size={0.6} delay={0.4} />
        </svg>

        <svg viewBox="0 0 760 560" className="block h-auto w-full overflow-visible" role="img" aria-labelledby="vet-cat-title">
          <title id="vet-cat-title">A second vet listens to a cat&rsquo;s heartbeat while a cow with a marigold garland looks on</title>
          <Halo x={360} y={310} r={222} />
          <FallingLeaf x={220} y={110} delay={-4} />
          <FallingLeaf x={560} y={80} delay={-1} />
          <Ground width={760} />
          <Cow />
          <Cat />
          <g transform="translate(470 0) scale(-1 1)">
            <Vet
              look="short"
              workDelay={0.5}
              held={
                <g>
                  <path d="M222 290 Q236 332 262 340 Q312 350 344 398" fill="none" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
                  <circle cx={346} cy={400} r={18} className="vet-pulse" fill="none" stroke={C.gold} strokeWidth={2.5} />
                  <circle cx={346} cy={400} r={10} fill={C.gold} {...line} strokeWidth={2.4} />
                </g>
              }
            />
          </g>
          <Heart x={166} y={304} delay={-3} />
          <Posy x={640} flip />
        </svg>
      </div>
    </SceneStage>
  );
}
