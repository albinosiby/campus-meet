"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  DIETARY_LABELS,
  GENDER_LABELS,
  YEAR_LABELS,
  ZONE_LABELS,
} from "@/admin/constants";
import { formatCurrency } from "@/admin/analytics";
import {
  amountRemaining,
  formatPaidAt,
  isCashPayment,
  isFullyPaid,
  paymentMethodLabel,
  paymentProgressLabel,
  REGISTRATION_FEE,
} from "@/admin/payment";
import {
  appendAdminPayment,
  deleteRegistration,
  getRegistrationById,
  updatePaymentStatus,
} from "@/admin/storage";
import type { Registration } from "@/admin/types";
import { formatPassId } from "@/shared/passId";
import { AdminShell } from "./AdminShell";

const fieldClass =
  "mt-1 w-full rounded-sm border border-admin-border bg-admin-elevated px-3 py-2 text-sm text-admin-ink focus:border-gold/40 focus:outline-none";

export function RegistrationDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id")?.trim() ?? "";

  const [reg, setReg] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualTxn, setManualTxn] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function reload() {
    if (!id) {
      setReg(null);
      setLoading(false);
      setError("Missing registration id.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const row = await getRegistrationById(id);
      if (!row) {
        setReg(null);
        setError("Registration not found.");
      } else {
        setReg(row);
        const remaining = amountRemaining(row.amount);
        setManualAmount(String(remaining > 0 ? remaining : REGISTRATION_FEE));
      }
    } catch {
      setError("Could not load registration.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleVerify() {
    if (!reg) return;
    setSaving(true);
    setError("");
    try {
      await updatePaymentStatus(reg.id, "paid");
      setReg({ ...reg, paymentStatus: "paid" });
    } catch {
      setError("Could not verify payment.");
    } finally {
      setSaving(false);
    }
  }

  async function handleManualPayment() {
    if (!reg) return;
    const amount = Number(manualAmount);
    if (!Number.isFinite(amount) || amount < 1) {
      setError("Enter a valid amount collected.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await appendAdminPayment(reg.id, amount, manualTxn.trim() || undefined);
      await reload();
      setManualTxn("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not record payment."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!reg) return;
    setDeleting(true);
    try {
      await deleteRegistration(reg.id);
      router.push("/dashboard/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete registration."
      );
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  const remaining = reg ? amountRemaining(reg.amount) : 0;
  const fully = reg ? isFullyPaid(reg.amount) : false;
  const progress = reg ? paymentProgressLabel(reg) : "";

  return (
    <AdminShell
      title={reg?.fullName ?? "Registration"}
      subtitle={
        reg
          ? `Pass ${formatPassId(reg.id)} · ${progress}`
          : "Student payment & details"
      }
    >
      <div className="mb-6">
        <Link
          href="/dashboard/"
          className="inline-flex items-center gap-2 text-sm text-admin-muted no-underline transition-colors hover:text-admin-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        </div>
      ) : !reg ? (
        <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error || "Registration not found."}
        </p>
      ) : (
        <div className="space-y-6">
          {error ? (
            <p
              className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <section className="rounded-sm border border-admin-border bg-admin-surface p-5 md:p-6">
            <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-gold-dim">
              Payment status
            </p>
            <p className="mt-2 font-heading text-2xl font-bold text-admin-ink">
              {progress}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Stat label="Fee" value={formatCurrency(REGISTRATION_FEE)} />
              <Stat label="Paid" value={formatCurrency(reg.amount)} />
              <Stat
                label="Remaining"
                value={fully ? "₹0" : formatCurrency(remaining)}
              />
            </div>

            {fully && reg.paymentStatus !== "paid" ? (
              <button
                type="button"
                onClick={() => void handleVerify()}
                disabled={saving}
                className="mt-5 inline-flex w-full items-center justify-center rounded-sm border border-emerald-300 bg-emerald-600 px-3 py-2.5 text-xs font-heading uppercase tracking-[0.14em] text-white hover:bg-emerald-700 disabled:opacity-60 sm:w-auto"
              >
                {saving ? "Saving…" : "Verify — paid fully"}
              </button>
            ) : null}

            {reg.paymentStatus === "paid" && fully ? (
              <p className="mt-4 text-sm text-emerald-700">
                Verified as paid fully.
              </p>
            ) : null}
          </section>

          <section className="rounded-sm border border-admin-border bg-admin-surface p-5 md:p-6">
            <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-gold-dim">
              Transactions
            </p>
            {reg.payments.length === 0 ? (
              <p className="mt-3 text-sm text-admin-muted">No payments yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {reg.payments.map((payment, index) => (
                  <li
                    key={`${payment.transactionId}-${payment.paidAt}-${index}`}
                    className="rounded-sm border border-admin-border bg-admin-elevated px-4 py-3"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-heading text-lg font-semibold text-admin-ink">
                        {formatCurrency(payment.amount)}
                      </span>
                      <span className="text-xs text-admin-muted">
                        {formatPaidAt(payment.paidAt)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] font-heading uppercase tracking-[0.14em] text-gold-dim">
                      {paymentMethodLabel(payment)}
                    </p>
                    {!isCashPayment(payment) ? (
                      <p className="mt-1 break-all font-mono text-xs text-admin-muted">
                        Txn · {payment.transactionId}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {remaining > 0 ? (
            <section className="rounded-sm border border-emerald-200 bg-emerald-50/80 p-5 md:p-6">
              <p className="text-[10px] font-heading uppercase tracking-[0.18em] text-emerald-800">
                Record cash / manual payment
              </p>
              <p className="mt-1.5 text-xs text-emerald-900/80">
                Remaining due: {formatCurrency(remaining)}
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="manual-amount"
                    className="text-[10px] font-heading uppercase tracking-[0.14em] text-admin-muted"
                  >
                    Amount *
                  </label>
                  <input
                    id="manual-amount"
                    type="number"
                    min={1}
                    max={remaining}
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label
                    htmlFor="manual-txn"
                    className="text-[10px] font-heading uppercase tracking-[0.14em] text-admin-muted"
                  >
                    Transaction ID (optional)
                  </label>
                  <input
                    id="manual-txn"
                    type="text"
                    value={manualTxn}
                    onChange={(e) => setManualTxn(e.target.value)}
                    className={fieldClass}
                    placeholder="If any"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleManualPayment()}
                disabled={saving}
                className="mt-3 inline-flex w-full items-center justify-center rounded-sm border border-emerald-300 bg-emerald-600 px-3 py-2.5 text-xs font-heading uppercase tracking-[0.14em] text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Add payment"}
              </button>
            </section>
          ) : null}

          <section className="rounded-sm border border-admin-border bg-admin-surface p-5 md:p-6">
            <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-gold-dim">
              Student details
            </p>
            <dl className="mt-3 divide-y divide-admin-border/80">
              <Detail label="Pass ID" value={formatPassId(reg.id)} mono />
              <Detail label="Email" value={reg.email} />
              <Detail label="Phone" value={reg.phone} />
              <Detail label="Gender" value={GENDER_LABELS[reg.gender]} />
              <Detail label="College" value={reg.college} />
              <Detail label="Course" value={reg.course} />
              <Detail label="Year" value={YEAR_LABELS[reg.year]} />
              <Detail label="Zone" value={ZONE_LABELS[reg.zone]} />
              <Detail label="Diocese / Parish" value={reg.diocese || "—"} />
              <Detail label="Dietary" value={DIETARY_LABELS[reg.dietary]} />
              <Detail
                label="Registered at"
                value={formatPaidAt(reg.createdAt)}
              />
            </dl>
          </section>

          <section className="rounded-sm border border-red-200 bg-red-50/60 p-5">
            {confirmDelete ? (
              <div>
                <p className="text-sm text-red-800">
                  Delete {reg.fullName}? This cannot be undone.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void handleDelete()}
                    disabled={deleting}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm border border-red-300 bg-red-600 px-3 py-2 text-xs font-heading uppercase tracking-[0.14em] text-white disabled:opacity-60"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deleting ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="btn-outline flex-1 justify-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-2 rounded-sm border border-red-200 bg-white px-4 py-2 text-xs font-heading uppercase tracking-[0.14em] text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete registration
              </button>
            )}
          </section>
        </div>
      )}
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-admin-border bg-admin-elevated px-3 py-3 text-center">
      <p className="text-[10px] font-heading uppercase tracking-[0.14em] text-admin-muted">
        {label}
      </p>
      <p className="mt-1 font-heading text-lg font-bold tabular-nums text-admin-ink">
        {value}
      </p>
    </div>
  );
}

function Detail({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5 py-3 sm:flex-row sm:justify-between sm:gap-4">
      <dt className="text-[10px] font-heading uppercase tracking-[0.16em] text-admin-muted">
        {label}
      </dt>
      <dd
        className={`text-sm text-admin-ink sm:text-right ${
          mono ? "font-mono text-xs tracking-wider text-gold-dim" : ""
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
