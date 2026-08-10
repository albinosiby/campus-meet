import { EVENT_INFO } from "@/landing/data/eventData";

type McmWordmarkSize = "sm" | "md" | "lg";
type McmWordmarkTone = "dark" | "light";

interface McmWordmarkProps {
  size?: McmWordmarkSize;
  tone?: McmWordmarkTone;
  align?: "left" | "right" | "center";
  className?: string;
  /** Show full event name under the MCM lockup */
  showFullName?: boolean;
}

const SIZE = {
  sm: {
    org: "text-sm font-bold leading-tight",
    mark: "text-[8px] tracking-[0.42em]",
    name: "text-[9px] tracking-[0.14em]",
  },
  md: {
    org: "text-xl font-bold leading-tight",
    mark: "text-[10px] tracking-[0.48em]",
    name: "text-[10px] tracking-[0.16em]",
  },
  lg: {
    org: "text-2xl font-extrabold leading-tight md:text-3xl",
    mark: "text-xs tracking-[0.52em] md:text-sm",
    name: "text-[11px] tracking-[0.18em]",
  },
} as const;

/**
 * Official MCM lockup: JESUS YOUTH + MCM '26
 * MCM = Malabar Campus Meet
 */
export function McmWordmark({
  size = "md",
  tone = "dark",
  align = "left",
  className = "",
  showFullName = false,
}: McmWordmarkProps) {
  const styles = SIZE[size];
  const orgColor = tone === "dark" ? "text-cream" : "text-admin-ink";
  const nameColor =
    tone === "dark" ? "text-cream-muted" : "text-admin-muted";
  const alignClass =
    align === "right"
      ? "items-end text-right"
      : align === "center"
        ? "items-center text-center"
        : "items-start text-left";

  return (
    <div
      className={`flex flex-col ${alignClass} ${className}`.trim()}
      aria-label={`${EVENT_INFO.organizer} ${EVENT_INFO.abbreviation} ${EVENT_INFO.shortYear} — ${EVENT_INFO.name}`}
    >
      <span
        className={`font-heading uppercase ${styles.org} ${orgColor}`}
      >
        {EVENT_INFO.organizer}
      </span>
      <span
        className={`mt-0.5 font-heading font-medium uppercase text-gold ${styles.mark}`}
      >
        {EVENT_INFO.abbreviation}&nbsp;{EVENT_INFO.shortYear}
      </span>
      {showFullName ? (
        <span
          className={`mt-1 font-heading uppercase ${styles.name} ${nameColor}`}
        >
          {EVENT_INFO.name}
        </span>
      ) : null}
    </div>
  );
}
