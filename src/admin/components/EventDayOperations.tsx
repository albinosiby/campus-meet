"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  RefreshCcw,
  Search,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { buildDashboardStats, formatCurrency } from "@/admin/analytics";
import { PAYMENT_STATUS_LABELS, ZONE_LABELS } from "@/admin/constants";
import { amountRemaining, paymentProgressLabel } from "@/admin/payment";
import { getRegistrations, updateEventDayStatus } from "@/admin/storage";
import type { PaymentStatus, Registration, Zone } from "@/admin/types";
import { formatPassId } from "@/shared/passId";
import { AdminShell } from "./AdminShell";
import { ExportMenu } from "./ExportMenu";

type EventFilter =
  | "all"
  | "present"
  | "not-present"
  | "verified"
  | "awaiting-verify"
  | "unpaid";

const PAYMENT_BADGES: Record<PaymentStatus, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
  unpaid: "border-red-200 bg-red-50 text-red-700",
};

function formatDateTime(value?: string): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function personMatchesSearch(reg: Registration, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const digits = q.replace(/\D/g, "");
  const phoneDigits = reg.phone.replace(/\D/g, "");
  const passId = formatPassId(reg.id).toLowerCase();
  const transactionIds = reg.payments
    .map((payment) => payment.transactionId)
    .join(" ")
    .toLowerCase();

  return (
    reg.fullName.toLowerCase().includes(q) ||
    reg.email.toLowerCase().includes(q) ||
    reg.phone.toLowerCase().includes(q) ||
    (digits.length >= 3 && phoneDigits.includes(digits)) ||
    passId.includes(q) ||
    reg.college.toLowerCase().includes(q) ||
    reg.course.toLowerCase().includes(q) ||
    reg.diocese.toLowerCase().includes(q) ||
    reg.transactionId.toLowerCase().includes(q) ||
    transactionIds.includes(q)
  );
}

function statusMatchesFilter(reg: Registration, filter: EventFilter): boolean {
  if (filter === "present") return reg.checkedIn;
  if (filter === "not-present") return !reg.checkedIn;
  if (filter === "verified") return reg.paymentStatus === "paid";
  if (filter === "awaiting-verify") return reg.paymentStatus === "pending";
  if (filter === "unpaid") return reg.paymentStatus === "unpaid";
  return true;
}

function SummaryCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-sm border border-admin-border bg-admin-surface p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-heading uppercase tracking-[0.16em] text-admin-muted">
            {label}
          </p>
          <p className="mt-2 font-heading text-2xl font-bold text-admin-ink">
            {value}
          </p>
          <p className="mt-1 text-xs text-admin-muted">{helper}</p>
        </div>
        <span className="rounded-full border border-gold/20 bg-gold/10 p-2 text-gold-dim">
          <Icon className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

export function EventDayOperations() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState<Zone | "all">("all");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadRegistrations() {
    setLoaded(false);
    try {
      const rows = await getRegistrations();
      setRegistrations(rows);
      setLoadError("");
    } catch {
      setLoadError(
        "Could not load registrations from Firebase. Check the Firebase config and rules."
      );
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    void loadRegistrations();
  }, []);

  const filtered = useMemo(() => {
    return registrations
      .filter((reg) => zoneFilter === "all" || reg.zone === zoneFilter)
      .filter((reg) => statusMatchesFilter(reg, eventFilter))
      .filter((reg) => personMatchesSearch(reg, query))
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  }, [registrations, query, zoneFilter, eventFilter]);

  const stats = useMemo(() => buildDashboardStats(filtered), [filtered]);
  const checkedInCount = registrations.filter((reg) => reg.checkedIn).length;
  const filteredCheckedIn = filtered.filter((reg) => reg.checkedIn).length;
  const verifiedCount = registrations.filter(
    (reg) => reg.paymentStatus === "paid"
  ).length;
  const awaitingVerifyCount = registrations.filter(
    (reg) => reg.paymentStatus === "pending"
  ).length;
  const totalCollected = registrations
    .filter((reg) => reg.paymentStatus === "paid")
    .reduce((sum, reg) => sum + (reg.verifiedAmount ?? reg.amount ?? 0), 0);

  async function patchRegistration(
    id: string,
    patch: Partial<Registration>,
    remotePatch: Parameters<typeof updateEventDayStatus>[1]
  ) {
    const previous = registrations;
    setUpdatingId(id);
    setRegistrations((rows) =>
      rows.map((row) => (row.id === id ? { ...row, ...patch } : row))
    );

    try {
      await updateEventDayStatus(id, remotePatch);
      setLoadError("");
    } catch {
      setRegistrations(previous);
      setLoadError("Could not update this person. Check Firestore rules.");
    } finally {
      setUpdatingId(null);
    }
  }

  function verifyPayment(reg: Registration) {
    const now = new Date().toISOString();
    void patchRegistration(
      reg.id,
      {
        paymentStatus: "paid",
        paymentVerified: true,
        paymentVerifiedAt: now,
        verifiedAmount: reg.amount,
      },
      {
        paymentStatus: "paid",
        paymentVerified: true,
        paymentVerifiedAt: now,
        verifiedAmount: reg.amount,
      }
    );
  }

  function undoPaymentVerification(reg: Registration) {
    const nextStatus: PaymentStatus = reg.amount > 0 ? "pending" : "unpaid";
    void patchRegistration(
      reg.id,
      {
        paymentStatus: nextStatus,
        paymentVerified: false,
        paymentVerifiedAt: "",
        verifiedAmount: 0,
      },
      {
        paymentStatus: nextStatus,
        paymentVerified: false,
        paymentVerifiedAt: "",
        verifiedAmount: 0,
      }
    );
  }

  function toggleCheckIn(reg: Registration) {
    const checkedIn = !reg.checkedIn;
    const checkedInAt = checkedIn ? new Date().toISOString() : "";
    void patchRegistration(
      reg.id,
      { checkedIn, checkedInAt },
      { checkedIn, checkedInAt }
    );
  }

  return (
    <AdminShell
      title="Event Day Desk"
      subtitle="Search, verify payment, check in participants, and export attendance"
    >
      {!loaded ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {loadError ? (
            <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <SummaryCard
              label="Total Registered"
              value={registrations.length}
              helper="All Firebase records"
              icon={Users}
            />
            <SummaryCard
              label="Checked In"
              value={checkedInCount}
              helper={`${Math.max(0, registrations.length - checkedInCount)} not present`}
              icon={UserCheck}
            />
            <SummaryCard
              label="Verified"
              value={verifiedCount}
              helper="Payment confirmed"
              icon={CheckCircle2}
            />
            <SummaryCard
              label="Need Verify"
              value={awaitingVerifyCount}
              helper="Paid, waiting check"
              icon={Clock3}
            />
            <SummaryCard
              label="Collected"
              value={formatCurrency(totalCollected)}
              helper="Verified amount"
              icon={CreditCard}
            />
          </div>

          <div className="rounded-sm border border-admin-border bg-admin-surface shadow-sm">
            <div className="flex flex-col gap-4 border-b border-admin-border px-5 py-5 md:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-xs font-heading uppercase tracking-[0.22em] text-gold-dim">
                    Live Firebase Operations
                  </p>
                  <h2 className="mt-2 font-heading text-xl font-bold text-admin-ink">
                    Find Person & Mark Attendance
                  </h2>
                  <p className="mt-1 text-sm text-admin-muted">
                    Showing {filtered.length} records · Present in this view:{" "}
                    {filteredCheckedIn}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => void loadRegistrations()}
                    className="inline-flex items-center gap-2 rounded-sm border border-admin-border bg-admin-elevated px-3 py-2.5 text-xs font-heading uppercase tracking-[0.14em] text-admin-ink transition-colors hover:border-gold/40"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    Refresh
                  </button>
                  <ExportMenu
                    compact
                    registrations={filtered}
                    stats={stats}
                    scopeLabel="Current event-day view"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_180px_200px]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-muted/70" />
                  <input
                    type="search"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search name, phone, email, pass ID, college, or transaction ID"
                    className="w-full rounded-sm border border-admin-border bg-admin-elevated py-3 pl-10 pr-3 text-sm text-admin-ink placeholder:text-admin-muted/50 focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <select
                  value={zoneFilter}
                  onChange={(event) =>
                    setZoneFilter(event.target.value as Zone | "all")
                  }
                  className="rounded-sm border border-admin-border bg-admin-elevated px-3 py-3 text-sm text-admin-ink focus:border-gold/50 focus:outline-none"
                >
                  <option value="all">All zones</option>
                  {(Object.keys(ZONE_LABELS) as Zone[]).map((zone) => (
                    <option key={zone} value={zone}>
                      {ZONE_LABELS[zone]}
                    </option>
                  ))}
                </select>
                <select
                  value={eventFilter}
                  onChange={(event) =>
                    setEventFilter(event.target.value as EventFilter)
                  }
                  className="rounded-sm border border-admin-border bg-admin-elevated px-3 py-3 text-sm text-admin-ink focus:border-gold/50 focus:outline-none"
                >
                  <option value="all">All people</option>
                  <option value="present">Checked in</option>
                  <option value="not-present">Not present</option>
                  <option value="verified">Payment verified</option>
                  <option value="awaiting-verify">Need payment verify</option>
                  <option value="unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1120px] text-left text-sm">
                <thead>
                  <tr className="border-b border-admin-border bg-admin-elevated text-[11px] font-heading uppercase tracking-[0.14em] text-admin-muted">
                    <th className="px-5 py-3">Person</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">College</th>
                    <th className="px-4 py-3">Paid</th>
                    <th className="px-4 py-3">Payment</th>
                    <th className="px-4 py-3">Check In</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {filtered.map((reg) => {
                    const remaining = amountRemaining(reg.amount);
                    const disabled = updatingId === reg.id;

                    return (
                      <tr key={reg.id} className="align-top hover:bg-admin-elevated/70">
                        <td className="px-5 py-4">
                          <p className="font-heading font-semibold text-admin-ink">
                            {reg.fullName}
                          </p>
                          <p className="mt-1 text-xs text-admin-muted">
                            {formatPassId(reg.id)} · {ZONE_LABELS[reg.zone]}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-admin-ink">{reg.phone}</p>
                          <p className="mt-1 max-w-[180px] truncate text-xs text-admin-muted">
                            {reg.email}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="max-w-[220px] truncate text-admin-ink">
                            {reg.college}
                          </p>
                          <p className="mt-1 text-xs text-admin-muted">
                            {reg.course}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-heading font-semibold text-admin-ink">
                            {formatCurrency(reg.amount)}
                          </p>
                          <p className="mt-1 text-xs text-admin-muted">
                            {remaining > 0
                              ? `${formatCurrency(remaining)} pending`
                              : "Full amount paid"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${PAYMENT_BADGES[reg.paymentStatus]}`}
                          >
                            {PAYMENT_STATUS_LABELS[reg.paymentStatus]}
                          </span>
                          <p className="mt-2 text-xs text-admin-muted">
                            {paymentProgressLabel(reg)}
                          </p>
                          {reg.paymentVerifiedAt ? (
                            <p className="mt-1 text-[11px] text-admin-muted">
                              Verified {formatDateTime(reg.paymentVerifiedAt)}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                              reg.checkedIn
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-admin-border bg-admin-elevated text-admin-muted"
                            }`}
                          >
                            {reg.checkedIn ? "Present" : "Not present"}
                          </span>
                          <p className="mt-2 text-xs text-admin-muted">
                            {reg.checkedInAt
                              ? formatDateTime(reg.checkedInAt)
                              : "No check-in time"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap justify-end gap-2">
                            {reg.paymentStatus === "paid" ? (
                              <button
                                type="button"
                                disabled={disabled}
                                onClick={() => undoPaymentVerification(reg)}
                                className="inline-flex items-center gap-1.5 rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-heading uppercase tracking-[0.12em] text-amber-800 disabled:opacity-50"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                Undo Verify
                              </button>
                            ) : (
                              <button
                                type="button"
                                disabled={disabled || reg.amount <= 0}
                                onClick={() => verifyPayment(reg)}
                                className="inline-flex items-center gap-1.5 rounded-sm border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-heading uppercase tracking-[0.12em] text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Verify Paid
                              </button>
                            )}
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => toggleCheckIn(reg)}
                              className={`inline-flex items-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-heading uppercase tracking-[0.12em] disabled:opacity-50 ${
                                reg.checkedIn
                                  ? "border-admin-border bg-admin-elevated text-admin-muted"
                                  : "border-gold/40 bg-gold text-obsidian hover:bg-gold-bright"
                              }`}
                            >
                              <UserCheck className="h-3.5 w-3.5" />
                              {reg.checkedIn ? "Undo Check In" : "Check In"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="font-heading text-sm font-semibold text-admin-ink">
                  No matching person found
                </p>
                <p className="mt-1 text-sm text-admin-muted">
                  Try searching by phone number, name, email, pass ID, college,
                  or transaction ID.
                </p>
              </div>
            ) : null}
          </div>
        </motion.div>
      )}
    </AdminShell>
  );
}
