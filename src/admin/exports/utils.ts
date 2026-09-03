import {
  DIETARY_LABELS,
  GENDER_LABELS,
  PAYMENT_STATUS_LABELS,
  YEAR_LABELS,
  ZONE_LABELS,
} from "../constants";
import { formatPaidAt, paymentMethodLabel } from "../payment";
import type { PaymentRecord, Registration } from "../types";
import { formatPassId } from "@/shared/passId";

export const EXPORT_HEADERS = [
  "Pass ID",
  "ID",
  "Full Name",
  "Email",
  "Phone",
  "Gender",
  "College",
  "Course",
  "Year",
  "Zone",
  "Diocese",
  "Dietary",
  "Amount (₹)",
  "Payments",
  "Transaction IDs",
  "Payment details",
  "Payment Status",
  "Registered At",
] as const;

export const PAYMENT_EXPORT_HEADERS = [
  "Pass ID",
  "Full Name",
  "Email",
  "Phone",
  "Installment",
  "Amount (₹)",
  "Method",
  "Transaction ID",
  "Paid At",
] as const;

export function paymentsForExport(reg: Registration): PaymentRecord[] {
  if (Array.isArray(reg.payments) && reg.payments.length > 0) {
    return reg.payments;
  }
  if (reg.transactionId) {
    return [
      {
        amount: Number(reg.amount) || 0,
        transactionId: reg.transactionId,
        paidAt: reg.createdAt,
      },
    ];
  }
  return [];
}

export function formatExportTransactionIds(reg: Registration): string {
  const ids = paymentsForExport(reg)
    .map((payment) => payment.transactionId.trim())
    .filter(Boolean);
  return ids.length > 0 ? ids.join(" | ") : "—";
}

export function formatExportPaymentDetails(reg: Registration): string {
  const payments = paymentsForExport(reg);
  if (payments.length === 0) return "—";
  return payments
    .map((payment, index) => {
      const method = paymentMethodLabel(payment);
      return `${index + 1}. ₹${payment.amount} ${method} ${payment.transactionId}`;
    })
    .join(" | ");
}

export function registrationToRow(reg: Registration): string[] {
  const payments = paymentsForExport(reg);
  return [
    formatPassId(reg.id),
    reg.id,
    reg.fullName,
    reg.email,
    reg.phone,
    GENDER_LABELS[reg.gender],
    reg.college,
    reg.course,
    YEAR_LABELS[reg.year],
    ZONE_LABELS[reg.zone],
    reg.diocese || "—",
    DIETARY_LABELS[reg.dietary],
    String(reg.amount ?? 0),
    String(payments.length),
    formatExportTransactionIds(reg),
    formatExportPaymentDetails(reg),
    PAYMENT_STATUS_LABELS[reg.paymentStatus] ?? reg.paymentStatus,
    new Date(reg.createdAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  ];
}

export function paymentRowsForExport(registrations: Registration[]): string[][] {
  return registrations.flatMap((reg) =>
    paymentsForExport(reg).map((payment, index) => [
      formatPassId(reg.id),
      reg.fullName,
      reg.email,
      reg.phone,
      String(index + 1),
      String(payment.amount),
      paymentMethodLabel(payment),
      payment.transactionId,
      formatPaidAt(payment.paidAt),
    ])
  );
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportFilename(ext: string): string {
  const stamp = new Date().toISOString().slice(0, 10);
  return `malabar-campus-meet-2026-registrations-${stamp}.${ext}`;
}
