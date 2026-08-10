import {
  EVENT_PAYMENT,
  formatRegistrationFee,
} from "@/landing/data/eventData";

interface FeeNoticeProps {
  variant?: "dark" | "light";
  className?: string;
}

export function FeeNotice({ variant = "dark", className = "" }: FeeNoticeProps) {
  const isDark = variant === "dark";
  const panel = isDark
    ? "border-obsidian-border bg-obsidian-card"
    : "border-admin-border bg-admin-surface";
  const title = isDark ? "text-cream" : "text-admin-ink";
  const muted = isDark ? "text-cream-muted" : "text-admin-muted";

  return (
    <div className={`rounded-sm border ${panel} p-5 ${className}`}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-heading uppercase tracking-[0.2em] ${muted}`}
          >
            Registration Fee
          </p>
          <p className={`mt-1 font-heading text-2xl font-extrabold ${title}`}>
            {formatRegistrationFee()}
          </p>
        </div>
        <p
          className={`rounded-sm border px-2.5 py-1 text-[11px] font-heading uppercase tracking-[0.14em] ${
            isDark
              ? "border-gold/30 bg-gold/10 text-gold"
              : "border-gold/30 bg-gold/10 text-gold-dim"
          }`}
        >
          Pay later
        </p>
      </div>
      <p className={`mt-3 text-sm leading-relaxed ${muted}`}>
        {EVENT_PAYMENT.collectionNote}
      </p>
    </div>
  );
}
