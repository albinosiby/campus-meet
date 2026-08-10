"use client";

import { FormEvent, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import {
  findRegistrationByEmail,
  normalizeEmail,
  submitRegistrationPayment,
} from "@/admin/storage";
import type { Registration } from "@/admin/types";
import { PaymentInstructions } from "@/landing/components/PaymentInstructions";
import {
  EVENT_INFO,
  EVENT_PAYMENT,
  formatRegistrationFee,
} from "@/landing/data/eventData";
import { EventWordmark } from "@/shared/components/EventWordmark";

const fieldClass =
  "w-full bg-obsidian-card border border-obsidian-border text-cream text-sm px-4 py-3 rounded-sm focus:border-gold/40 focus:outline-none transition-colors placeholder:text-cream-muted/40 font-body";

type Step = "lookup" | "pay" | "done";

export default function PaymentPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const [step, setStep] = useState<Step>("lookup");
  const [email, setEmail] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleLookup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLookingUp(true);

    try {
      const found = await findRegistrationByEmail(email);
      if (!found) {
        setError(
          "No registration found for this email. Use the same email you registered with."
        );
        setRegistration(null);
        return;
      }

      if (found.paymentStatus === "paid") {
        setRegistration(found);
        setStep("done");
        return;
      }

      if (found.paymentStatus === "pending" && found.transactionId.trim()) {
        setRegistration(found);
        setStep("done");
        return;
      }

      setRegistration(found);
      setStep("pay");
    } catch {
      setError("Could not look up your registration. Check your connection.");
    } finally {
      setLookingUp(false);
    }
  }

  async function handleSubmitPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!registration) return;

    const txn = transactionId.trim();
    if (txn.length < 6) {
      setError("Enter a valid transaction ID (at least 6 characters).");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      await submitRegistrationPayment(registration.id, txn);
      setRegistration({
        ...registration,
        transactionId: txn,
        paymentStatus: "pending",
      });
      setStep("done");
    } catch {
      setError(
        "Could not save payment details. Check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function resetFlow() {
    setStep("lookup");
    setRegistration(null);
    setTransactionId("");
    setError("");
  }

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
            COMPLETE YOUR
            <br />
            PAYMENT
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-cream-muted">
            Pay the {formatRegistrationFee()} registration fee for{" "}
            {EVENT_INFO.name}. Enter the same email you used while registering
            so we can match your payment.
          </p>
          <div className="mb-10 mt-6 h-px w-16 bg-gold/40" />

          {step === "done" && registration ? (
            <div className="glass-card rounded-sm p-8 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-gold" />
              <h2 className="mt-4 font-heading text-2xl font-bold text-cream">
                {registration.paymentStatus === "paid"
                  ? "Payment confirmed"
                  : "Payment submitted"}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-cream-muted">
                {registration.paymentStatus === "paid"
                  ? `Thanks, ${registration.fullName}. Your fee is marked as paid.`
                  : `Thanks, ${registration.fullName}. We received your transaction details and will verify them shortly.`}
              </p>
              <dl className="mx-auto mt-6 max-w-sm space-y-3 text-left">
                <div className="flex justify-between gap-4 border-b border-obsidian-border pb-2 text-sm">
                  <dt className="text-cream-muted">Email</dt>
                  <dd className="text-cream">{registration.email}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-obsidian-border pb-2 text-sm">
                  <dt className="text-cream-muted">Amount</dt>
                  <dd className="text-cream">
                    {EVENT_PAYMENT.currencySymbol}
                    {registration.amount || EVENT_PAYMENT.amount}
                  </dd>
                </div>
                {registration.transactionId ? (
                  <div className="flex justify-between gap-4 border-b border-obsidian-border pb-2 text-sm">
                    <dt className="text-cream-muted">Txn ID</dt>
                    <dd className="font-mono text-xs text-gold">
                      {registration.transactionId}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <div className="mt-8 flex flex-col items-center gap-3">
                <Link href="/" className="btn-primary inline-flex">
                  Back to home
                </Link>
                <button
                  type="button"
                  onClick={resetFlow}
                  className="btn-outline inline-flex"
                >
                  Pay for another registration
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
                  Registration email *
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
                <p className="mt-2 text-[11px] leading-relaxed text-gold/80">
                  This email is how we find your registration and link the
                  payment.
                </p>
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

          {step === "pay" && registration ? (
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

              <PaymentInstructions />

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
                  minLength={6}
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className={fieldClass}
                  placeholder="Enter UPI reference / transaction ID"
                />
                <p className="mt-2 text-[11px] leading-relaxed text-cream-muted/50">
                  Find this in your UPI app payment history after paying.
                </p>
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
                disabled={submitting || transactionId.trim().length < 6}
                className="btn-primary w-full justify-center disabled:opacity-60"
              >
                {submitting ? "SUBMITTING…" : "SUBMIT PAYMENT"}
                <ArrowRight className="btn-arrow h-4 w-4" />
              </button>
            </form>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
