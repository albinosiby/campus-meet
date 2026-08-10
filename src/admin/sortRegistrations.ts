import type { PaymentStatus, Registration } from "@/admin/types";
import { formatPassId } from "@/shared/passId";

export type RegistrationSortKey =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "email-asc"
  | "pass-asc"
  | "college-asc"
  | "zone-asc"
  | "amount-desc"
  | "payment";

export const REGISTRATION_SORT_OPTIONS: {
  value: RegistrationSortKey;
  label: string;
}[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "email-asc", label: "Email A–Z" },
  { value: "pass-asc", label: "Pass ID A–Z" },
  { value: "college-asc", label: "College A–Z" },
  { value: "zone-asc", label: "Zone A–Z" },
  { value: "amount-desc", label: "Amount high–low" },
  { value: "payment", label: "Payment status" },
];

const PAYMENT_ORDER: Record<PaymentStatus, number> = {
  pending: 0,
  unpaid: 1,
  paid: 2,
};

export function compareRegistrations(
  a: Registration,
  b: Registration,
  sortKey: RegistrationSortKey
): number {
  switch (sortKey) {
    case "oldest":
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    case "name-asc":
      return a.fullName.localeCompare(b.fullName, undefined, {
        sensitivity: "base",
      });
    case "name-desc":
      return b.fullName.localeCompare(a.fullName, undefined, {
        sensitivity: "base",
      });
    case "email-asc":
      return a.email.localeCompare(b.email, undefined, {
        sensitivity: "base",
      });
    case "pass-asc":
      return formatPassId(a.id).localeCompare(formatPassId(b.id), undefined, {
        sensitivity: "base",
      });
    case "college-asc":
      return a.college.localeCompare(b.college, undefined, {
        sensitivity: "base",
      });
    case "zone-asc":
      return a.zone.localeCompare(b.zone, undefined, { sensitivity: "base" });
    case "amount-desc":
      return (b.amount ?? 0) - (a.amount ?? 0);
    case "payment":
      return PAYMENT_ORDER[a.paymentStatus] - PAYMENT_ORDER[b.paymentStatus];
    case "newest":
    default:
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }
}

export function sortRegistrations(
  registrations: Registration[],
  sortKey: RegistrationSortKey
): Registration[] {
  return [...registrations].sort((a, b) => compareRegistrations(a, b, sortKey));
}
