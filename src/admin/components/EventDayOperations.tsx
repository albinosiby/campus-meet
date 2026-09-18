"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Banknote,
  CheckCircle2,
  RefreshCcw,
  Search,
  Smartphone,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { buildDashboardStats } from "@/admin/analytics";
import { ZONE_LABELS } from "@/admin/constants";
import {
  amountRemaining,
  derivePaymentStatus,
  eventDayVerificationLabel,
  REGISTRATION_FEE,
  sanitizeUpiTransactionIdInput,
  upiTransactionIdError,
} from "@/admin/payment";
import {
  appendAdminPayment,
  getRegistrations,
  updateEventDayStatus,
} from "@/admin/storage";
import type { PaymentMethod, Registration, Zone } from "@/admin/types";
import { formatPassId } from "@/shared/passId";
import { AdminShell } from "./AdminShell";
import { ExportMenu } from "./ExportMenu";
import { SpotRegistrationForm } from "./SpotRegistrationForm";

type EventFilter =
  | "all"
  | "present"
  | "not-present"
  | "paid-full"
  | "waiting"
  | "unpaid";

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
    (reg.email ?? "").toLowerCase().includes(q) ||
    reg.phone.toLowerCase().includes(q) ||
    (digits.length >= 3 && phoneDigits.includes(digits)) ||
    passId.includes(q) ||
    reg.college.toLowerCase().includes(q) ||
    (reg.course ?? "").toLowerCase().includes(q) ||
    (reg.diocese ?? "").toLowerCase().includes(q) ||
    reg.transactionId.toLowerCase().includes(q) ||
    transactionIds.includes(q)
  );
}

function statusMatchesFilter(reg: Registration, filter: EventFilter): boolean {
  if (filter === "present") return reg.checkedIn;
  if (filter === "not-present") return !reg.checkedIn;
  if (filter === "paid-full") return reg.paymentVerified && reg.checkedIn;
  if (filter === "waiting") return !(reg.paymentVerified && reg.checkedIn);
  if (filter === "unpaid") return reg.amount <= 0;
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
  const [payFormId, setPayFormId] = useState<string | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [payMethod, setPayMethod] = useState<PaymentMethod>("cash");
  const [payTxn, setPayTxn] = useState("");
  const [payError, setPayError] = useState("");
  const [showSpotForm, setShowSpotForm] = useState(false);

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
  const paidFullCount = registrations.filter(
    (reg) => reg.paymentVerified && reg.checkedIn
  ).length;
  const waitingCount = registrations.length - paidFullCount;
  const filteredPaidFull = filtered.filter(
    (reg) => reg.paymentVerified && reg.checkedIn
  ).length;

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

  function openPayForm(reg: Registration) {
    setPayFormId(reg.id);
    setPayAmount(String(amountRemaining(reg.amount) || ""));
    setPayMethod("cash");
    setPayTxn("");
    setPayError("");
  }

  function paidFullCheckIn(reg: Registration) {
    const now = new Date().toISOString();
    const patch = {
      paymentVerified: true,
      paymentVerifiedAt: now,
      verifiedAmount: REGISTRATION_FEE,
      checkedIn: true,
      checkedInAt: now,
      paymentStatus: "paid" as const,
    };
    void patchRegistration(reg.id, patch, patch);
  }

  function undoPaidFullCheckIn(reg: Registration) {
    const patch = {
      paymentVerified: false,
      paymentVerifiedAt: "",
      verifiedAmount: 0,
      checkedIn: false,
      checkedInAt: "",
      paymentStatus: derivePaymentStatus(reg.amount),
    };
    void patchRegistration(reg.id, patch, patch);
  }

  async function submitEventDayPayment(reg: Registration) {
    const remaining = amountRemaining(reg.amount);
    const amount = Number(payAmount);
    if (!Number.isFinite(amount) || amount < 1 || amount > remaining) {
      setPayError(`Enter an amount between 1 and ${remaining}.`);
      return;
    }
    if (payMethod === "upi") {
      const txnError = upiTransactionIdError(payTxn);
      if (txnError) {
        setPayError(txnError);
        return;
      }
    }

    setUpdatingId(reg.id);
    setPayError("");
    try {
      const updated = await appendAdminPayment(
        reg.id,
        amount,
        payMethod === "upi" ? payTxn : undefined,
        payMethod
      );
      setRegistrations((rows) =>
        rows.map((row) => (row.id === reg.id ? updated : row))
      );
      setPayFormId(null);
      setPayTxn("");
      setLoadError("");
    } catch (error) {
      setPayError(
        error instanceof Error
          ? error.message
          : "Could not add this payment. Try again."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <AdminShell
      wide
      title="Event Day Desk"
      subtitle="Spot register walk-ins, mark paid full, and check in"
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

          {showSpotForm ? (
            <SpotRegistrationForm
              onClose={() => setShowSpotForm(false)}
              onCreated={(registration) => {
                setRegistrations((rows) => [registration, ...rows]);
                setShowSpotForm(false);
                setQuery(registration.fullName);
                setLoadError("");
              }}
            />
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Total Registered"
              value={registrations.length}
              helper="All Firebase records"
              icon={Users}
            />
            <SummaryCard
              label="Paid Full · Check In"
              value={paidFullCount}
              helper="Paid full and present"
              icon={CheckCircle2}
            />
            <SummaryCard
              label="Waiting"
              value={waitingCount}
              helper="Not yet paid full check-in"
              icon={Users}
            />
          </div>

          <div className="rounded-sm border border-admin-border bg-admin-surface shadow-sm">
            <div className="flex flex-col gap-4 border-b border-admin-border px-5 py-5 md:px-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-xs font-heading uppercase tracking-[0.22em] text-gold-dim">
                    Event-day payment desk
                  </p>
                  <h2 className="mt-2 font-heading text-xl font-bold text-admin-ink">
                    Find person, paid full check-in
                  </h2>
                  <p className="mt-1 text-sm text-admin-muted">
                    Showing {filtered.length} · Paid full check-in in this view:{" "}
                    {filteredPaidFull}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSpotForm((open) => !open)}
                    className="inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-gold px-3 py-2.5 text-xs font-heading uppercase tracking-[0.14em] text-obsidian"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    {showSpotForm ? "Close form" : "Spot registration"}
                  </button>
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
                  <option value="paid-full">Paid full check-in</option>
                  <option value="waiting">Waiting</option>
                  <option value="present">Checked in</option>
                  <option value="not-present">Not present</option>
                  <option value="unpaid">No payment yet</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] table-auto text-left text-sm">
                <thead>
                  <tr className="border-b border-admin-border bg-admin-elevated text-[11px] font-heading uppercase tracking-[0.14em] text-admin-muted">
                    <th className="px-5 py-3">Person</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">College</th>
                    <th className="px-4 py-3">Paid full / Check in</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {filtered.map((reg) => {
                    const remaining = amountRemaining(reg.amount);
                    const disabled = updatingId === reg.id;
                    const showPayForm = payFormId === reg.id;

                    return (
                      <tr
                        key={reg.id}
                        className="align-top hover:bg-admin-elevated/70"
                      >
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
                            {reg.email ?? "—"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <p className="max-w-[220px] truncate text-admin-ink">
                            {reg.college}
                          </p>
                          <p className="mt-1 text-xs text-admin-muted">
                            {reg.course ?? "—"}
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                              reg.paymentVerified && reg.checkedIn
                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                : "border-admin-border bg-admin-elevated text-admin-muted"
                            }`}
                          >
                            {eventDayVerificationLabel(reg)}
                          </span>
                          <p className="mt-2 text-xs text-admin-muted">
                            {reg.checkedInAt
                              ? formatDateTime(reg.checkedInAt)
                              : "Not checked in yet"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex flex-wrap justify-end gap-2">
                              {remaining > 0 ? (
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() =>
                                    showPayForm
                                      ? setPayFormId(null)
                                      : openPayForm(reg)
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-sm border border-gold/40 bg-gold/10 px-3 py-2 text-xs font-heading uppercase tracking-[0.12em] text-admin-ink disabled:opacity-50"
                                >
                                  {showPayForm ? "Close" : "Add payment"}
                                </button>
                              ) : null}
                              {reg.paymentVerified && reg.checkedIn ? (
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => undoPaidFullCheckIn(reg)}
                                  className="inline-flex items-center gap-1.5 rounded-sm border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-heading uppercase tracking-[0.12em] text-amber-800 disabled:opacity-50"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  Undo
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() => paidFullCheckIn(reg)}
                                  className="inline-flex items-center gap-1.5 rounded-sm border border-gold/40 bg-gold px-3 py-2 text-xs font-heading uppercase tracking-[0.12em] text-obsidian hover:bg-gold-bright disabled:opacity-50"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Paid full · Check in
                                </button>
                              )}
                            </div>

                            {showPayForm && remaining > 0 ? (
                              <div className="w-full max-w-sm rounded-sm border border-admin-border bg-admin-elevated p-3">
                                <p className="text-[10px] font-heading uppercase tracking-[0.14em] text-admin-muted">
                                  New desk payment
                                </p>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setPayMethod("cash")}
                                    className={`inline-flex items-center justify-center gap-1 rounded-sm border px-2 py-1.5 text-[10px] font-heading uppercase tracking-[0.1em] ${
                                      payMethod === "cash"
                                        ? "border-gold/50 bg-gold/15 text-admin-ink"
                                        : "border-admin-border text-admin-muted"
                                    }`}
                                  >
                                    <Banknote className="h-3 w-3" />
                                    Cash
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPayMethod("upi")}
                                    className={`inline-flex items-center justify-center gap-1 rounded-sm border px-2 py-1.5 text-[10px] font-heading uppercase tracking-[0.1em] ${
                                      payMethod === "upi"
                                        ? "border-gold/50 bg-gold/15 text-admin-ink"
                                        : "border-admin-border text-admin-muted"
                                    }`}
                                  >
                                    <Smartphone className="h-3 w-3" />
                                    UPI
                                  </button>
                                </div>
                                <input
                                  type="number"
                                  min={1}
                                  max={remaining}
                                  value={payAmount}
                                  onChange={(e) => setPayAmount(e.target.value)}
                                  className="mt-2 w-full rounded-sm border border-admin-border bg-admin-surface px-2 py-1.5 text-sm"
                                  placeholder={`Amount (max ${remaining})`}
                                />
                                {payMethod === "upi" ? (
                                  <input
                                    type="text"
                                    value={payTxn}
                                    onChange={(e) =>
                                      setPayTxn(
                                        sanitizeUpiTransactionIdInput(
                                          e.target.value
                                        )
                                      )
                                    }
                                    className="mt-2 w-full rounded-sm border border-admin-border bg-admin-surface px-2 py-1.5 text-sm"
                                    placeholder="UPI transaction ID"
                                  />
                                ) : null}
                                {payError ? (
                                  <p className="mt-2 text-[11px] text-red-600">
                                    {payError}
                                  </p>
                                ) : null}
                                <button
                                  type="button"
                                  disabled={disabled}
                                  onClick={() =>
                                    void submitEventDayPayment(reg)
                                  }
                                  className="mt-2 w-full rounded-sm border border-emerald-300 bg-emerald-600 px-3 py-2 text-[11px] font-heading uppercase tracking-[0.12em] text-white disabled:opacity-50"
                                >
                                  Save payment
                                </button>
                              </div>
                            ) : null}
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
