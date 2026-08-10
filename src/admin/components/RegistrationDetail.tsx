"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Trash2, X } from "lucide-react";
import {
  DIETARY_LABELS,
  GENDER_LABELS,
  PAYMENT_STATUS_LABELS,
  YEAR_LABELS,
  ZONE_LABELS,
} from "@/admin/constants";
import { formatCurrency } from "@/admin/analytics";
import type { PaymentStatus, Registration } from "@/admin/types";
import { formatPassId } from "@/shared/passId";

interface RegistrationDetailProps {
  registration: Registration;
  onClose: () => void;
  onPaymentStatusChange: (id: string, status: PaymentStatus) => void;
  onDelete: (id: string) => Promise<void> | void;
}

const STATUS_STYLES: Record<PaymentStatus, string> = {
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  unpaid: "border-red-200 bg-red-50 text-red-700",
  pending: "border-amber-200 bg-amber-50 text-amber-800",
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="border-b border-admin-border/80 py-3 last:border-b-0">
      <dt className="text-[10px] font-heading uppercase tracking-[0.18em] text-admin-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-admin-ink">{value || "—"}</dd>
    </div>
  );
}

export function RegistrationDetail({
  registration: reg,
  onClose,
  onPaymentStatusChange,
  onDelete,
}: RegistrationDetailProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  async function handleDelete() {
    setDeleteError("");
    setDeleting(true);
    try {
      await onDelete(reg.id);
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Could not delete this registration. Try again."
      );
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 bg-admin-ink/40 backdrop-blur-[2px]"
        aria-label="Close details"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="registration-detail-title"
        className="relative z-10 flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-sm border border-admin-border bg-admin-surface shadow-xl sm:rounded-sm"
      >
        <div className="flex items-start justify-between gap-4 border-b border-admin-border px-5 py-4 md:px-6">
          <div>
            <p className="text-[10px] font-heading uppercase tracking-[0.22em] text-gold-dim">
              Registration details
            </p>
            <h2
              id="registration-detail-title"
              className="mt-1 font-heading text-xl font-bold text-admin-ink"
            >
              {reg.fullName}
            </h2>
            <p className="mt-1 font-mono text-xs tracking-wider text-gold-dim">
              Pass ID · {formatPassId(reg.id)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-admin-border text-admin-muted transition-colors hover:border-gold/40 hover:text-admin-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-2 md:px-6">
          <dl>
            <DetailRow
              label="Pass ID"
              value={
                <code className="rounded-sm bg-admin-elevated px-2 py-1 font-mono text-[12px] tracking-wider text-gold-dim">
                  {formatPassId(reg.id)}
                </code>
              }
            />
            <DetailRow label="Email" value={reg.email} />
            <DetailRow label="Phone" value={reg.phone} />
            <DetailRow label="Gender" value={GENDER_LABELS[reg.gender]} />
            <DetailRow label="College / University" value={reg.college} />
            <DetailRow label="Course / Program" value={reg.course} />
            <DetailRow label="Year of study" value={YEAR_LABELS[reg.year]} />
            <DetailRow label="Zone" value={ZONE_LABELS[reg.zone]} />
            <DetailRow label="Diocese / Parish" value={reg.diocese || "—"} />
            <DetailRow
              label="Dietary preference"
              value={DIETARY_LABELS[reg.dietary]}
            />
            <DetailRow label="Amount" value={formatCurrency(reg.amount)} />
            <DetailRow
              label="Transaction ID"
              value={
                reg.transactionId ? (
                  <code className="rounded-sm bg-admin-elevated px-2 py-1 font-mono text-[12px]">
                    {reg.transactionId}
                  </code>
                ) : (
                  "—"
                )
              }
            />
            <DetailRow
              label="Payment status"
              value={
                <select
                  value={reg.paymentStatus}
                  onChange={(e) =>
                    onPaymentStatusChange(
                      reg.id,
                      e.target.value as PaymentStatus
                    )
                  }
                  className={`mt-1 appearance-none rounded-sm border px-2.5 py-1.5 text-[11px] font-heading ${STATUS_STYLES[reg.paymentStatus]}`}
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
              }
            />
            <DetailRow
              label="Registered at"
              value={new Date(reg.createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            />
            <DetailRow
              label="Record ID"
              value={
                <code className="break-all font-mono text-[11px] text-admin-muted">
                  {reg.id}
                </code>
              }
            />
          </dl>
        </div>

        <div className="space-y-3 border-t border-admin-border px-5 py-4 md:px-6">
          {deleteError ? (
            <p className="text-xs text-red-600" role="alert">
              {deleteError}
            </p>
          ) : null}

          {confirmDelete ? (
            <div className="rounded-sm border border-red-200 bg-red-50 px-3 py-3">
              <p className="text-sm text-red-800">
                Delete <span className="font-semibold">{reg.fullName}</span>?
                This cannot be undone.
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
                  disabled={deleting}
                  className="btn-outline flex-1 justify-center"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-outline flex-1 justify-center"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-red-200 bg-red-50 px-4 py-2 text-xs font-heading uppercase tracking-[0.14em] text-red-700 transition-colors hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
