import Link from "next/link";
import { Roll } from "@/components/roll";

/**
 * Call-to-action button, identical to the header's "Book now": gold, small
 * spaced capitals, no arrow. On hover the letters roll up one by one while the
 * button fades to the page's ink colour (ivory on dark sections, navy on light
 * ones). The primary gold is always the bright brand gold. The ghost variant is
 * the same button as a gold outline.
 */
export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: string;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const look =
    variant === "primary"
      ? "border border-[#f7b538] bg-[#f7b538] text-[#041d36]"
      : "border border-gold text-gold";
  return (
    <Link
      href={href}
      className={`label group flex whitespace-nowrap px-8 py-[18px] text-[0.8rem] transition-colors duration-500 hover:border-ink hover:bg-ink hover:text-navy focus-visible:border-ink focus-visible:bg-ink focus-visible:text-navy sm:px-10 ${look} ${className}`}
    >
      <Roll text={children} under="text-navy" />
    </Link>
  );
}
