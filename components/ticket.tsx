import type { CSSProperties, ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Inner padding classes for the content area. */
  padding?: string;
  /** "solid" uses the section's own background; "navy" forces a dark ticket, e.g. on ivory sections. */
  fill?: "solid" | "navy";
  /** Corner notch radius in px. */
  notch?: number;
};

const layer = (o: number, n: number) => ({ "--o": `${o}px`, "--n": `${n}px` }) as CSSProperties;

/**
 * Double-ruled gold frame with notched corners, like an admission ticket.
 * Four stacked layers: gold rule, gap, fine gold rule, content.
 */
export function Ticket({ children, className = "", padding = "p-8 sm:p-10", fill = "solid", notch = 18 }: Props) {
  const theme = fill === "navy" ? "theme-dark" : "";
  return (
    <div className={`notch bg-gold p-[2px] ${theme} ${className}`} style={layer(0, notch)}>
      <div className="notch h-full bg-navy p-[6px]" style={layer(2, notch)}>
        <div className="notch h-full bg-gold/60 p-px" style={layer(8, notch)}>
          <div className={`notch h-full bg-navy ${padding}`} style={layer(9, notch)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
