import { EVENT_PAYMENT } from "@/landing/data/eventData";
import type { PaymentRecord, PaymentStatus, Registration } from "./types";

export const REGISTRATION_FEE = EVENT_PAYMENT.amount;

export function sumPayments(payments: PaymentRecord[]): number {
  return payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
}

export function amountRemaining(amountPaid: number): number {
  return Math.max(0, REGISTRATION_FEE - amountPaid);
}

export function isFullyPaid(amountPaid: number): boolean {
  return amountPaid >= REGISTRATION_FEE;
}

export function normalizePayments(
  payments: unknown,
  fallback?: { amount: number; transactionId: string; paidAt: string }
): PaymentRecord[] {
  if (Array.isArray(payments) && payments.length > 0) {
    return payments.map((entry) => {
      const row = entry as Partial<PaymentRecord>;
      return {
        amount: Number(row.amount ?? 0),
        transactionId: String(row.transactionId ?? "").trim(),
        paidAt:
          typeof row.paidAt === "string" && row.paidAt
            ? row.paidAt
            : new Date().toISOString(),
        source:
          row.source === "register" ||
          row.source === "payment" ||
          row.source === "admin"
            ? row.source
            : undefined,
      };
    });
  }

  if (fallback && fallback.amount > 0) {
    return [
      {
        amount: fallback.amount,
        transactionId: fallback.transactionId,
        paidAt: fallback.paidAt,
        source: "register",
      },
    ];
  }

  return [];
}

export function createPaymentRecord(input: {
  amount: number;
  transactionId: string;
  source: PaymentRecord["source"];
  paidAt?: string;
}): PaymentRecord {
  return {
    amount: input.amount,
    transactionId: input.transactionId.trim(),
    paidAt: input.paidAt ?? new Date().toISOString(),
    source: input.source,
  };
}

/** UI label for payment progress (incomplete / awaiting verify / verified). */
export function paymentProgressLabel(reg: Registration): string {
  const paid = sumPayments(reg.payments);
  const remaining = amountRemaining(paid);

  if (reg.paymentStatus === "paid" && isFullyPaid(paid)) {
    return "Paid fully";
  }
  if (paid <= 0) return "Unpaid";
  if (remaining > 0) return "Incomplete";
  return "Awaiting verify";
}

export function derivePaymentStatus(amountPaid: number): PaymentStatus {
  if (amountPaid <= 0) return "unpaid";
  return "pending";
}

export function formatPaidAt(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}
