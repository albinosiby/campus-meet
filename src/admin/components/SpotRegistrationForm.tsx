"use client";

import { FormEvent, useState, type ReactNode } from "react";
import { Banknote, Smartphone, UserPlus, X } from "lucide-react";
import { GENDER_LABELS, ZONE_LABELS } from "@/admin/constants";
import {
  cashTransactionId,
  derivePaymentStatus,
  REGISTRATION_FEE,
  sanitizeUpiTransactionIdInput,
  upiTransactionIdError,
} from "@/admin/payment";
import { addRegistration, markPaidFullCheckIn } from "@/admin/storage";
import type { Gender, PaymentMethod, Registration, Zone } from "@/admin/types";

const fieldClass =
  "w-full rounded-sm border border-admin-border bg-admin-elevated px-3 py-2.5 text-sm text-admin-ink focus:border-gold/50 focus:outline-none";

interface SpotRegistrationFormProps {
  onCreated: (registration: Registration) => void;
  onClose: () => void;
}

export function SpotRegistrationForm({
  onCreated,
  onClose,
}: SpotRegistrationFormProps) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [college, setCollege] = useState("");
  const [zone, setZone] = useState<Zone | "">("");
  const [amountPaid, setAmountPaid] = useState(String(REGISTRATION_FEE));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [transactionId, setTransactionId] = useState("");
  const [paidFull, setPaidFull] = useState(false);
  const [checkIn, setCheckIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const amount = Number(amountPaid);
    const hasPayment = Number.isFinite(amount) && amount > 0;

    if (!fullName.trim() || !phone.trim() || !gender || !college.trim() || !zone) {
      setError("Name, gender, phone, campus, and zone are required.");
      return;
    }
    if (
      amountPaid !== "" &&
      (!Number.isFinite(amount) || amount < 0 || amount > REGISTRATION_FEE)
    ) {
      setError(`Amount must be between 0 and ${REGISTRATION_FEE}.`);
      return;
    }
    if (hasPayment && paymentMethod === "upi" && !paidFull) {
      const txnError = upiTransactionIdError(transactionId);
      if (txnError) {
        setError(txnError);
        return;
      }
    }

    setSubmitting(true);
    setError("");
    const now = new Date().toISOString();
    const useUpi =
      paymentMethod === "upi" && !upiTransactionIdError(transactionId);
    const txn = paidFull
      ? useUpi
        ? transactionId.trim()
        : cashTransactionId()
      : !hasPayment
        ? ""
        : paymentMethod === "cash"
          ? cashTransactionId()
          : transactionId.trim();
    const paidAmount = paidFull
      ? REGISTRATION_FEE
      : hasPayment
        ? amount
        : 0;

    try {
      const created = await addRegistration({
        fullName: fullName.trim(),
        email: null,
        phone: phone.trim(),
        gender,
        college: college.trim(),
        course: null,
        year: null,
        zone,
        diocese: null,
        dietary: null,
        amount: paidAmount,
        transactionId: txn,
        paymentStatus: derivePaymentStatus(paidAmount),
        payments:
          paidAmount > 0
            ? [
                {
                  amount: paidAmount,
                  transactionId: txn,
                  paidAt: now,
                  source: "admin",
                  method: useUpi ? "upi" : "cash",
                },
              ]
            : [],
        paymentVerified: false,
        paymentVerifiedAt: "",
        verifiedAmount: 0,
        checkedIn: checkIn,
        checkedInAt: checkIn ? now : "",
      });
      const registration = paidFull
        ? await markPaidFullCheckIn(created.id)
        : created;
      onCreated(registration);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save spot registration."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className="rounded-sm border border-gold/30 bg-admin-surface p-5 shadow-sm md:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-gold-dim">
            Walk-in
          </p>
          <h3 className="mt-1 font-heading text-lg font-bold text-admin-ink">
            Spot registration
          </h3>
          <p className="mt-1 text-sm text-admin-muted">
            Name, gender, zone, campus, phone, and payment.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-admin-border text-admin-muted hover:text-admin-ink"
          aria-label="Close spot registration"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Name *">
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Phone *">
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={fieldClass}
          />
        </Field>
        <Field label="Gender *">
          <select
            required
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
            className={fieldClass}
          >
            <option value="">Select gender</option>
            {(Object.keys(GENDER_LABELS) as Gender[]).map((key) => (
              <option key={key} value={key}>
                {GENDER_LABELS[key]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Campus *">
          <input
            required
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className={fieldClass}
            placeholder="College / campus"
          />
        </Field>
        <Field label="Zone *">
          <select
            required
            value={zone}
            onChange={(e) => setZone(e.target.value as Zone)}
            className={fieldClass}
          >
            <option value="">Select zone</option>
            {(Object.keys(ZONE_LABELS) as Zone[]).map((key) => (
              <option key={key} value={key}>
                {ZONE_LABELS[key]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="mt-5 rounded-sm border border-admin-border bg-admin-elevated p-4">
        <p className="text-[10px] font-heading uppercase tracking-[0.16em] text-admin-muted">
          Payment
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("cash")}
            className={`inline-flex items-center justify-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-heading uppercase tracking-[0.12em] ${
              paymentMethod === "cash"
                ? "border-gold/50 bg-gold/15 text-admin-ink"
                : "border-admin-border text-admin-muted"
            }`}
          >
            <Banknote className="h-3.5 w-3.5" />
            Cash
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("upi")}
            className={`inline-flex items-center justify-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-heading uppercase tracking-[0.12em] ${
              paymentMethod === "upi"
                ? "border-gold/50 bg-gold/15 text-admin-ink"
                : "border-admin-border text-admin-muted"
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            UPI
          </button>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label={`Amount (of ₹${REGISTRATION_FEE})`}>
            <input
              type="number"
              min={0}
              max={REGISTRATION_FEE}
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className={fieldClass}
            />
          </Field>
          {paymentMethod === "upi" ? (
            <Field label="UPI Transaction ID">
              <input
                value={transactionId}
                onChange={(e) =>
                  setTransactionId(sanitizeUpiTransactionIdInput(e.target.value))
                }
                className={fieldClass}
                placeholder="Required if amount > 0"
              />
            </Field>
          ) : (
            <p className="self-end text-xs text-admin-muted">
              Cash — no transaction ID needed.
            </p>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-admin-ink">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={paidFull}
              onChange={(e) => setPaidFull(e.target.checked)}
            />
            Paid full after save
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={checkIn}
              onChange={(e) => setCheckIn(e.target.checked)}
            />
            Check in now
          </label>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-gold/40 bg-gold px-4 py-3 text-xs font-heading uppercase tracking-[0.14em] text-obsidian disabled:opacity-60"
      >
        <UserPlus className="h-4 w-4" />
        {submitting ? "Saving…" : "Save spot registration"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-heading uppercase tracking-[0.14em] text-admin-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
