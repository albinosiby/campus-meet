import { EVENT_INFO } from "@/landing/data/eventData";

type EventWordmarkSize = "sm" | "md" | "lg";
type EventWordmarkTone = "dark" | "light";

interface EventWordmarkProps {
  size?: EventWordmarkSize;
  tone?: EventWordmarkTone;
  align?: "left" | "right" | "center";
  className?: string;
}

const SIZE = {
  sm: {
    org: "text-sm font-bold leading-tight",
    mark: "text-[8px] tracking-[0.12em]",
  },
  md: {
    org: "text-xl font-bold leading-tight",
    mark: "text-[10px] tracking-[0.14em]",
  },
  lg: {
    org: "text-2xl font-extrabold leading-tight md:text-3xl",
    mark: "text-xs tracking-[0.16em] md:text-sm",
  },
} as const;

/** Brand lockup: Jesus Youth + Malabar Campus Meet '26 */
export function EventWordmark({
  size = "md",
  tone = "dark",
  align = "left",
  className = "",
}: EventWordmarkProps) {
  const styles = SIZE[size];
  const orgColor = tone === "dark" ? "text-cream" : "text-admin-ink";
  const alignClass =
    align === "right"
      ? "items-end text-right"
      : align === "center"
        ? "items-center text-center"
        : "items-start text-left";

  return (
    <div
      className={`flex flex-col ${alignClass} ${className}`.trim()}
      aria-label={`${EVENT_INFO.organizer} — ${EVENT_INFO.name} ${EVENT_INFO.year}`}
    >
      <span className={`font-heading uppercase ${styles.org} ${orgColor}`}>
        {EVENT_INFO.organizer}
      </span>
      <span
        className={`mt-0.5 font-heading font-semibold uppercase text-gold ${styles.mark}`}
      >
        {EVENT_INFO.name} {EVENT_INFO.shortYear}
      </span>
    </div>
  );
}
