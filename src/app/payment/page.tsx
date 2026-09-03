"use client";

import { FormEvent, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, Banknote, CheckCircle2, Smartphone } from "lucide-react";
import Link from "next/link";
import {
  appendRegistrationPayment,
  findRegistrationByEmail,
  normalizeEmail,
} from "@/admin/storage";
import type { PaymentMethod, Registration } from "@/admin/types";
import {
  amountRemaining,
  formatPaidAt,
  isCashPayment,
  isFullyPaid,
  isValidUpiTransactionId,
  looksLikeUpiId,
  paymentMethodLabel,
  REGISTRATION_FEE,
  sanitizeUpiTransactionIdInput,
  UPI_TRANSACTION_ID_MAX_LENGTH,
  UPI_TRANSACTION_ID_MIN_LENGTH,
  upiTransactionIdError,
} from "@/admin/payment";
import { formatCurrency } from "@/admin/analytics";
import { PaymentInstructions } from "@/landing/components/PaymentInstructions";
import {
  EVENT_INFO,
  formatRegistrationFee,
} from "@/landing/data/eventData";
import { EventWordmark } from "@/shared/components/EventWordmark";

const fieldClass =
  "w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body";

type Step = "lookup" | "account" | "done";

export default function PaymentPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [step, setStep] = useState<Step>("lookup");
  const [email, setEmail] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [justPaidFully, setJustPaidFully] = useState(false);

  async function handleLookup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLookingUp(true);
    setJustPaidFully(false);

    try {
      const found = await findRegistrationByEmail(email);
      if (!found) {
        setError(
          "No registration found for this email. Use the same email you registered with."
        );
        setRegistration(null);
        return;
      }

      setRegistration(found);
      const remaining = amountRemaining(found.amount);
      if (
        (found.paymentStatus === "paid" && isFullyPaid(found.amount)) ||
        remaining <= 0
      ) {
        setStep("done");
        return;
      }

      setPayAmount(String(remaining));
      setStep("account");
    } catch {
      setError("Could not look up your registration. Check your connection.");
    } finally {
      setLookingUp(false);
    }
  }

  async function handleSubmitPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!registration) return;

    const amount = Number(payAmount);
    const remaining = amountRemaining(registration.amount);
    const txn = paymentMethod === "cash" ? "" : transactionId.trim();

    if (!Number.isFinite(amount) || amount < 1 || amount > remaining) {
      setError(`Enter an amount between 1 and ${remaining}.`);
      return;
    }
    if (paymentMethod === "upi") {
      const txnError = upiTransactionIdError(txn);
      if (txnError) {
        setError(txnError);
        return;
      }
    }

    setError("");
    setSubmitting(true);

    try {
      const updated = await appendRegistrationPayment(
        registration.id,
        amount,
        txn,
        paymentMethod
      );
      setRegistration(updated);
      setTransactionId("");
      setJustPaidFully(isFullyPaid(updated.amount));
      if (amountRemaining(updated.amount) <= 0) {
        setStep("done");
      } else {
        setPayAmount(String(amountRemaining(updated.amount)));
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not save payment details. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetFlow() {
    setStep("lookup");
    setRegistration(null);
    setTransactionId("");
    setPayAmount("");
    setPaymentMethod("upi");
    setError("");
    setJustPaidFully(false);
  }

  const remaining = registration
    ? amountRemaining(registration.amount)
    : REGISTRATION_FEE;
  const fullyPaid =
    registration != null &&
    (registration.paymentStatus === "paid" || remaining <= 0);

  return (
    <div className="min-h-screen bg-obsidian relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-gold/[0.03] blur-[150px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent-blue/[0.03] blur-[120px]" />
      </div>

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between section-pad py-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-cream-muted no-underline transition-colors hover:text-cream"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-heading text-xs uppercase tracking-[0.2em]">
            Back to Home
          </span>
        </Link>
        <EventWordmark size="sm" align="right" />
      </nav>

      <div className="relative z-10 mx-auto max-w-2xl section-pad py-12 md:py-20">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-4 font-heading text-xs uppercase tracking-[0.3em] text-gold">
            Fee payment
          </p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-cream md:text-5xl">
            PAY YOUR
            <br />
            FEE
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-muted">
            Total fee is {formatRegistrationFee()}. Look up with the same Gmail
            / email used at registration to pay any remaining amount.
          </p>
          <div className="mb-10 mt-6 h-px w-16 bg-gold/40" />

          {step === "done" && registration ? (
            <div className="glass-card rounded-sm p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
              <h2 className="mt-4 font-heading text-2xl font-bold text-cream">
                {registration.paymentStatus === "paid" || justPaidFully
                  ? "Paid fully"
                  : "Fee complete"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cream-muted">
                {registration.paymentStatus === "paid"
                  ? `Thanks, ${registration.fullName}. Your ${formatRegistrationFee()} fee is verified.`
                  : `Thanks, ${registration.fullName}. You have paid the full fee. We will verify your transactions shortly.`}
              </p>
              <PaymentSummary registration={registration} />
              <div className="mt-8 flex flex-col items-center gap-3">
                <Link href="/" className="btn-primary inline-flex">
                  Back to home
                </Link>
                <button
                  type="button"
                  onClick={resetFlow}
                  className="btn-outline inline-flex"
                >
                  Check another email
                </button>
              </div>
            </div>
          ) : null}

          {step === "lookup" ? (
            <form onSubmit={handleLookup} className="space-y-6">
              <div className="glass-card rounded-sm p-6">
                <label
                  htmlFor="email"
                  className="mb-2 block font-heading text-xs text-cream-muted"
                >
                  Registration email (Gmail) *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={fieldClass}
                  placeholder="Same email used for registration"
                  autoComplete="email"
                />
              </div>

              {error ? (
                <p className="text-center text-xs text-red-400/90" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={lookingUp || !normalizeEmail(email)}
                className="btn-primary w-full justify-center disabled:opacity-60"
              >
                {lookingUp ? "LOOKING UP…" : "CONTINUE"}
                <ArrowRight className="btn-arrow h-4 w-4" />
              </button>

              <p className="text-center text-[11px] text-cream-muted/50">
                Not registered yet?{" "}
                <Link
                  href={EVENT_INFO.registerUrl}
                  className="text-gold no-underline hover:underline"
                >
                  Register first
                </Link>
              </p>
            </form>
          ) : null}

          {step === "account" && registration ? (
            <form onSubmit={handleSubmitPayment} className="space-y-6">
              <div className="glass-card rounded-sm p-6">
                <p className="text-[10px] font-heading uppercase tracking-[0.2em] text-cream-muted">
                  Registered as
                </p>
                <p className="mt-1 font-heading text-xl font-bold text-cream">
                  {registration.fullName}
                </p>
                <p className="mt-1 text-sm text-cream-muted">
                  {registration.email} · {registration.college}
                </p>
                <button
                  type="button"
                  onClick={resetFlow}
                  className="mt-3 text-[11px] text-gold hover:underline"
                >
                  Use a different email
                </button>
              </div>

              <PaymentSummary registration={registration} />

              {remaining > 0 ? (
                <>
                  <div className="rounded-sm border border-obsidian-border bg-obsidian-card p-5">
                    <p className="text-[10px] font-heading uppercase tracking-[0.18em] text-cream-muted">
                      How are you paying?
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("upi")}
                        className={`inline-flex items-center justify-center gap-2 rounded-sm border px-3 py-2.5 text-xs font-heading uppercase tracking-[0.12em] transition-colors ${
                          paymentMethod === "upi"
                            ? "border-gold/50 bg-gold/15 text-gold"
                            : "border-obsidian-border text-cream-muted hover:border-gold/30 hover:text-cream"
                        }`}
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        UPI
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={`inline-flex items-center justify-center gap-2 rounded-sm border px-3 py-2.5 text-xs font-heading uppercase tracking-[0.12em] transition-colors ${
                          paymentMethod === "cash"
                            ? "border-gold/50 bg-gold/15 text-gold"
                            : "border-obsidian-border text-cream-muted hover:border-gold/30 hover:text-cream"
                        }`}
                      >
                        <Banknote className="h-3.5 w-3.5" />
                        Cash
                      </button>
                    </div>
                    {paymentMethod === "cash" ? (
                      <p className="mt-4 text-[11px] leading-relaxed text-cream-muted/70">
                        Paying in cash / liquid money. Enter the amount given to
                        the committee — no transaction ID needed.
                      </p>
                    ) : null}
                  </div>

                  {paymentMethod === "upi" ? <PaymentInstructions /> : null}

                  <div
                    className={`grid grid-cols-1 gap-4 ${
                      paymentMethod === "upi" ? "md:grid-cols-2" : ""
                    }`}
                  >
                    <div>
                      <label
                        htmlFor="payAmount"
                        className="mb-2 block font-heading text-xs text-cream-muted"
                      >
                        Amount you are paying now *
                      </label>
                      <input
                        type="number"
                        id="payAmount"
                        name="payAmount"
                        required
                        min={1}
                        max={remaining}
                        step={1}
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className={fieldClass}
                        placeholder={String(remaining)}
                      />
                      <p className="mt-2 text-[11px] text-cream-muted/50">
                        Remaining due: {formatCurrency(remaining)}
                      </p>
                    </div>
                    {paymentMethod === "upi" ? (
                      <div>
                        <label
                          htmlFor="transactionId"
                          className="mb-2 block font-heading text-xs text-cream-muted"
                        >
                          UPI Transaction ID *
                        </label>
                        <input
                          type="text"
                          id="transactionId"
                          name="transactionId"
                          required
                          minLength={UPI_TRANSACTION_ID_MIN_LENGTH}
                          maxLength={UPI_TRANSACTION_ID_MAX_LENGTH}
                          autoComplete="off"
                          autoCorrect="off"
                          spellCheck={false}
                          pattern="[A-Za-z0-9]{12,35}"
                          title="Enter the UPI Ref / UTR number (usually 12 digits), not the UPI ID"
                          value={transactionId}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (looksLikeUpiId(raw)) {
                              setTransactionId("");
                              setError(
                                "That is a UPI ID. Enter the transaction / UTR number from your UPI app after paying — not the UPI ID."
                              );
                              return;
                            }
                            setTransactionId(sanitizeUpiTransactionIdInput(raw));
                            setError("");
                          }}
                          className={fieldClass}
                          placeholder="e.g. 123456789012"
                        />
                        <p className="mt-2 text-[11px] leading-relaxed text-cream-muted/50">
                          Copy the UPI Ref / UTR number from your app after
                          paying — not the UPI ID (name@bank).
                        </p>
                      </div>
                    ) : null}
                  </div>

                  {error ? (
                    <p
                      className="text-center text-xs text-red-400/90"
                      role="alert"
                    >
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !payAmount ||
                      (paymentMethod === "upi" &&
                        !isValidUpiTransactionId(transactionId))
                    }
                    className="btn-primary w-full justify-center disabled:opacity-60"
                  >
                    {submitting ? "SUBMITTING…" : "SUBMIT THIS PAYMENT"}
                    <ArrowRight className="btn-arrow h-4 w-4" />
                  </button>
                </>
              ) : null}
            </form>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

function PaymentSummary({ registration }: { registration: Registration }) {
  const remaining = amountRemaining(registration.amount);
  const fully =
    registration.paymentStatus === "paid" || isFullyPaid(registration.amount);

  return (
    <div className="glass-card rounded-sm p-6 text-left">
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-[10px] font-heading uppercase tracking-[0.14em] text-cream-muted">
            Fee
          </p>
          <p className="mt-1 font-heading text-lg font-bold text-cream">
            {formatCurrency(REGISTRATION_FEE)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-heading uppercase tracking-[0.14em] text-cream-muted">
            Paid
          </p>
          <p className="mt-1 font-heading text-lg font-bold text-gold">
            {formatCurrency(registration.amount)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-heading uppercase tracking-[0.14em] text-cream-muted">
            Remaining
          </p>
          <p className="mt-1 font-heading text-lg font-bold text-cream">
            {fully ? "₹0" : formatCurrency(remaining)}
          </p>
        </div>
      </div>

      {fully ? (
        <p className="mt-4 rounded-sm border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-center text-sm text-emerald-200">
          Paid fully
        </p>
      ) : (
        <p className="mt-4 text-center text-xs text-amber-200/90">
          Incomplete — {formatCurrency(remaining)} still due
        </p>
      )}

      {registration.payments.length > 0 ? (
        <div className="mt-5 border-t border-obsidian-border pt-4">
          <p className="text-[10px] font-heading uppercase tracking-[0.18em] text-cream-muted">
            Your transactions
          </p>
          <ul className="mt-3 space-y-3">
            {registration.payments.map((payment, index) => (
              <li
                key={`${payment.transactionId}-${payment.paidAt}-${index}`}
                className="rounded-sm border border-obsidian-border bg-obsidian-light/40 px-3 py-2.5"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-heading font-semibold text-cream">
                    {formatCurrency(payment.amount)}
                  </span>
                  <span className="text-[11px] text-cream-muted">
                    {formatPaidAt(payment.paidAt)}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-heading uppercase tracking-[0.12em] text-gold">
                  {paymentMethodLabel(payment)}
                </p>
                {!isCashPayment(payment) ? (
                  <p className="mt-1 break-all font-mono text-[11px] text-cream-muted">
                    Txn · {payment.transactionId}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
