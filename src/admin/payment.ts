import { EVENT_PAYMENT } from "@/landing/data/eventData";
import type {
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
  Registration,
} from "./types";

export const REGISTRATION_FEE = EVENT_PAYMENT.amount;

function inferPaymentMethod(row: Partial<PaymentRecord>): PaymentMethod | undefined {
  if (row.method === "cash" || row.method === "upi") return row.method;
  if (String(row.transactionId ?? "").startsWith("CASH-")) return "cash";
  return undefined;
}

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
    return payments
      .map((entry) => {
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
          method: inferPaymentMethod(row),
        };
      })
      .filter((payment) => payment.amount > 0 && payment.transactionId.length >= 8);
  }

  if (
    fallback &&
    fallback.amount > 0 &&
    fallback.transactionId.trim().length >= 8
  ) {
    return [
      {
        amount: fallback.amount,
        transactionId: fallback.transactionId.trim(),
        paidAt: fallback.paidAt,
        source: "register",
        method: fallback.transactionId.trim().startsWith("CASH-")
          ? "cash"
          : "upi",
      },
    ];
  }

  return [];
}

export function createPaymentRecord(input: {
  amount: number;
  transactionId: string;
  source: PaymentRecord["source"];
  method?: PaymentMethod;
  paidAt?: string;
}): PaymentRecord {
  const method =
    input.method ??
    (input.transactionId.trim().startsWith("CASH-") ? "cash" : "upi");
  return {
    amount: input.amount,
    transactionId: input.transactionId.trim(),
    paidAt: input.paidAt ?? new Date().toISOString(),
    source: input.source,
    method,
  };
}

export function cashTransactionId(): string {
  return `CASH-${Date.now()}`;
}

/** NPCI UTR / UPI Ref is typically 12 digits; some apps show a slightly longer id. */
export const UPI_TRANSACTION_ID_MIN_LENGTH = 12;
export const UPI_TRANSACTION_ID_MAX_LENGTH = 35;

const UPI_TRANSACTION_ID_PATTERN = /^[A-Za-z0-9]{12,35}$/;

export function looksLikeUpiId(value: string): boolean {
  return /@/.test(value) || /upi\s*id/i.test(value);
}

/** Keep letters and digits only so a pasted UPI ID (name@bank) cannot be submitted. */
export function sanitizeUpiTransactionIdInput(raw: string): string {
  return raw.replace(/[^A-Za-z0-9]/g, "").slice(0, UPI_TRANSACTION_ID_MAX_LENGTH);
}

export function isValidUpiTransactionId(value: string): boolean {
  const txn = value.trim();
  if (looksLikeUpiId(txn)) return false;
  if (!UPI_TRANSACTION_ID_PATTERN.test(txn)) return false;
  return /\d{8,}/.test(txn);
}

export function upiTransactionIdError(value: string): string | null {
  const txn = value.trim();
  if (!txn) return "Enter the UPI transaction ID from your payment.";
  if (looksLikeUpiId(txn)) {
    return "That is a UPI ID. Enter the transaction / UTR number from your UPI app after paying — not the UPI ID.";
  }
  if (/[^A-Za-z0-9]/.test(txn)) {
    return "Transaction ID can only contain letters and numbers.";
  }
  if (txn.length < UPI_TRANSACTION_ID_MIN_LENGTH) {
    return "Enter the full UPI Ref / UTR number (usually 12 digits).";
  }
  if (txn.length > UPI_TRANSACTION_ID_MAX_LENGTH) {
    return "Transaction ID is too long. Copy only the UPI Ref / UTR number.";
  }
  if (!/\d{8,}/.test(txn)) {
    return "Enter the UPI Ref / UTR number from your payment receipt, not a name or UPI ID.";
  }
  return null;
}

export function isCashPayment(payment: PaymentRecord): boolean {
  return payment.method === "cash" || payment.transactionId.startsWith("CASH-");
}

export function paymentMethodLabel(payment: PaymentRecord): string {
  return isCashPayment(payment) ? "Cash" : "UPI";
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
