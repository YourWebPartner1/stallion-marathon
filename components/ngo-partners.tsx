import Image from "next/image";
import { ngoPartners } from "@/lib/content";

/**
 * The NGO line: partner logos in their own colours, for navy bands. Each logo
 * links to the NGO's website once its address is in lib/content.ts.
 */
export function NgoPartners({ className = "" }: { className?: string }) {
  return (
    <div className={`border-t border-[#fdffff]/25 pt-8 text-[#fdffff] lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-6 ${className}`}>
      <h3 className="m-0 mb-7 text-base font-normal leading-[1.3] text-[#fdffff]/70 lg:col-span-3 lg:mb-0">Our NGO partners</h3>
      <ul className="m-0 flex list-none flex-wrap items-center gap-x-[clamp(32px,4.4vw,84px)] gap-y-9 p-0 lg:col-span-9 lg:justify-end">
        {ngoPartners.map((p) => {
          const logo = (
            <Image
              src={p.logo}
              alt={p.name}
              width={p.width}
              height={p.height}
              sizes="300px"
              className="h-[clamp(84px,7vw,124px)] w-auto max-w-full object-contain"
            />
          );
          return (
            <li key={p.name}>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="block transition-opacity duration-300 hover:opacity-75">
                  {logo}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                logo
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
