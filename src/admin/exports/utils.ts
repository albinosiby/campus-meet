import {
  DIETARY_LABELS,
  GENDER_LABELS,
  PAYMENT_STATUS_LABELS,
  YEAR_LABELS,
  ZONE_LABELS,
} from "../constants";
import type { Registration } from "../types";
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
  "Transaction ID",
  "Payment Status",
  "Registered At",
] as const;

export function registrationToRow(reg: Registration): string[] {
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
    reg.transactionId || "—",
    PAYMENT_STATUS_LABELS[reg.paymentStatus] ?? reg.paymentStatus,
    new Date(reg.createdAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  ];
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
