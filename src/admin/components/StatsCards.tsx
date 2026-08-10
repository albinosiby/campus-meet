"use client";

import {
  Banknote,
  CalendarDays,
  Clock3,
  CircleAlert,
  TrendingUp,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/admin/analytics";
import type { DashboardStats } from "@/admin/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Registrations",
      value: String(stats.total),
      icon: Users,
      accent: "text-gold-dim",
      ring: "border-gold/25 bg-gold/[0.08]",
    },
    {
      label: "Amount Received",
      value: formatCurrency(stats.amountReceived),
      icon: Banknote,
      accent: "text-emerald-700",
      ring: "border-emerald-200 bg-emerald-50",
    },
    {
      label: "Pending Amount",
      value: formatCurrency(stats.amountPending),
      icon: Clock3,
      accent: "text-amber-700",
      ring: "border-amber-200 bg-amber-50",
    },
    {
      label: "Paid / Unpaid",
      value: `${stats.paidCount} / ${stats.unpaidCount}`,
      icon: CircleAlert,
      accent: "text-accent-blue",
      ring: "border-accent-blue/25 bg-accent-blue/[0.08]",
    },
    {
      label: "Registered Today",
      value: String(stats.today),
      icon: CalendarDays,
      accent: "text-accent-blue",
      ring: "border-accent-blue/25 bg-accent-blue/[0.08]",
    },
    {
      label: "This Week",
      value: String(stats.thisWeek),
      icon: TrendingUp,
      accent: "text-gold",
      ring: "border-gold/20 bg-gold/[0.06]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-sm border border-admin-border bg-admin-surface p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-heading uppercase tracking-[0.22em] text-admin-muted">
                  {card.label}
                </p>
                <p className="mt-3 font-heading text-2xl font-extrabold tabular-nums text-admin-ink md:text-3xl">
                  {card.value}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-sm border ${card.ring}`}
              >
                <Icon className={`h-4 w-4 ${card.accent}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
