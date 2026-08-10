"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import {
  DIETARY_LABELS,
  GENDER_LABELS,
  PAYMENT_STATUS_LABELS,
  YEAR_LABELS,
  ZONE_LABELS,
} from "@/admin/constants";
import { formatCurrency } from "@/admin/analytics";
import type { PaymentStatus, Registration, Zone } from "@/admin/types";

interface RegistrationsTableProps {
  registrations: Registration[];
  onPaymentStatusChange: (id: string, status: PaymentStatus) => void;
}

const STATUS_STYLES: Record<PaymentStatus, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  unpaid: "border-red-200 bg-red-50 text-red-700",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
};

export function RegistrationsTable({
  registrations,
  onPaymentStatusChange,
}: RegistrationsTableProps) {
  const [query, setQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState<Zone | "all">("all");
  const [paymentFilter, setPaymentFilter] = useState<PaymentStatus | "all">(
    "all"
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return registrations.filter((reg) => {
      if (zoneFilter !== "all" && reg.zone !== zoneFilter) return false;
      if (paymentFilter !== "all" && reg.paymentStatus !== paymentFilter)
        return false;
      if (!q) return true;
      return (
        reg.fullName.toLowerCase().includes(q) ||
        reg.email.toLowerCase().includes(q) ||
        reg.college.toLowerCase().includes(q) ||
        reg.phone.toLowerCase().includes(q) ||
        reg.course.toLowerCase().includes(q) ||
        reg.transactionId.toLowerCase().includes(q)
      );
    });
  }, [registrations, query, zoneFilter, paymentFilter]);

  return (
    <div className="rounded-sm border border-admin-border bg-admin-surface shadow-sm">
      <div className="flex flex-col gap-4 border-b border-admin-border px-5 py-5 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h3 className="font-heading text-base font-semibold text-admin-ink">
            All Registrations
          </h3>
          <p className="mt-1 text-xs text-admin-muted">
            Showing {filtered.length} of {registrations.length} records
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-admin-muted/70" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, txn ID, college…"
              className="w-full rounded-sm border border-admin-border bg-admin-elevated py-2.5 pl-9 pr-3 text-sm text-admin-ink placeholder:text-admin-muted/50 focus:border-gold/50 focus:outline-none sm:w-64"
            />
          </div>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value as Zone | "all")}
            className="appearance-none rounded-sm border border-admin-border bg-admin-elevated px-3 py-2.5 text-sm text-admin-ink focus:border-gold/50 focus:outline-none"
          >
            <option value="all">All zones</option>
            {(Object.keys(ZONE_LABELS) as Zone[]).map((zone) => (
              <option key={zone} value={zone}>
                {ZONE_LABELS[zone]}
              </option>
            ))}
          </select>
          <select
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(e.target.value as PaymentStatus | "all")
            }
            className="appearance-none rounded-sm border border-admin-border bg-admin-elevated px-3 py-2.5 text-sm text-admin-ink focus:border-gold/50 focus:outline-none"
          >
            <option value="all">All payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border bg-admin-elevated text-[11px] font-heading uppercase tracking-[0.16em] text-admin-muted">
              <th className="px-5 py-3 font-medium md:px-6">Name</th>
              <th className="px-4 py-3 font-medium">Contact</th>
              <th className="px-4 py-3 font-medium">College</th>
              <th className="px-4 py-3 font-medium">Zone</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Transaction ID</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-5 py-3 font-medium md:px-6">Registered</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-16 text-center text-sm text-admin-muted"
                >
                  No registrations match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((reg) => (
                <tr
                  key={reg.id}
                  className="border-b border-admin-border/80 transition-colors hover:bg-admin-elevated/80"
                >
                  <td className="px-5 py-4 md:px-6">
                    <p className="font-heading font-medium text-admin-ink">
                      {reg.fullName}
                    </p>
                    <p className="mt-0.5 text-[11px] text-admin-muted">
                      {reg.course} · {YEAR_LABELS[reg.year]} ·{" "}
                      {GENDER_LABELS[reg.gender]} · {DIETARY_LABELS[reg.dietary]}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-admin-muted">{reg.email}</p>
                    <p className="mt-0.5 text-[11px] text-admin-muted/80">
                      {reg.phone}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-admin-muted">
                    <p>{reg.college}</p>
                    {reg.diocese ? (
                      <p className="mt-0.5 text-[11px] text-admin-muted/80">
                        {reg.diocese}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex rounded-sm border border-gold/25 bg-gold/10 px-2 py-1 text-[11px] font-heading text-gold-dim">
                      {ZONE_LABELS[reg.zone]}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-heading font-semibold tabular-nums text-admin-ink">
                    {formatCurrency(reg.amount)}
                  </td>
                  <td className="px-4 py-4">
                    <code className="rounded-sm bg-admin-elevated px-2 py-1 font-mono text-[11px] text-admin-ink">
                      {reg.transactionId || "—"}
                    </code>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      value={reg.paymentStatus}
                      onChange={(e) =>
                        onPaymentStatusChange(
                          reg.id,
                          e.target.value as PaymentStatus
                        )
                      }
                      className={`appearance-none rounded-sm border px-2 py-1.5 text-[11px] font-heading ${STATUS_STYLES[reg.paymentStatus]}`}
                      aria-label={`Payment status for ${reg.fullName}`}
                    >
                      {(Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]).map(
                        (status) => (
                          <option key={status} value={status}>
                            {PAYMENT_STATUS_LABELS[status]}
                          </option>
                        )
                      )}
                    </select>
                  </td>
                  <td className="px-5 py-4 text-admin-muted md:px-6">
                    {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
