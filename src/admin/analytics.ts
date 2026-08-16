import {
  COLLEGE_COLORS,
  DIETARY_COLORS,
  DIETARY_LABELS,
  GENDER_COLORS,
  GENDER_LABELS,
  PAYMENT_STATUS_COLORS,
  PAYMENT_STATUS_LABELS,
  YEAR_COLORS,
  YEAR_LABELS,
  ZONE_COLORS,
  ZONE_LABELS,
} from "./constants";
import type {
  ChartSlice,
  DashboardStats,
  Dietary,
  Gender,
  PaymentStatus,
  Registration,
  YearOfStudy,
  Zone,
} from "./types";

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

function countByKey<T extends string>(
  items: Registration[],
  getKey: (item: Registration) => T,
  labels: Record<T, string>,
  colors: Record<T, string>
): ChartSlice[] {
  const counts = new Map<T, number>();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return (Object.keys(labels) as T[])
    .map((key) => ({
      key,
      label: labels[key],
      value: counts.get(key) ?? 0,
      color: colors[key],
    }))
    .filter((slice) => slice.value > 0);
}

function topColleges(items: Registration[]): ChartSlice[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const name = item.college.trim() || "Unknown";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([label, value], index) => ({
      key: `${label.toLowerCase().replace(/\s+/g, "-")}-${index}`,
      label,
      value,
      color: COLLEGE_COLORS[index % COLLEGE_COLORS.length],
    }));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildDashboardStats(registrations: Registration[]): DashboardStats {
  const now = new Date();
  const todayStart = startOfDay(now).getTime();
  const weekStart = startOfWeek(now).getTime();

  const paid = registrations.filter((r) => r.paymentStatus === "paid");
  const unpaid = registrations.filter((r) => r.paymentStatus === "unpaid");
  const pending = registrations.filter((r) => r.paymentStatus === "pending");

  return {
    total: registrations.length,
    today: registrations.filter((r) => new Date(r.createdAt).getTime() >= todayStart)
      .length,
    thisWeek: registrations.filter(
      (r) => new Date(r.createdAt).getTime() >= weekStart
    ).length,
    paidCount: paid.length,
    unpaidCount: unpaid.length,
    pendingCount: pending.length,
    amountReceived: paid.reduce((sum, r) => sum + (r.amount || 0), 0),
    amountPending: pending.reduce((sum, r) => sum + (r.amount || 0), 0),
    amountExpected: registrations.reduce((sum, r) => sum + (r.amount || 0), 0),
    zones: countByKey(
      registrations,
      (r) => r.zone as Zone,
      ZONE_LABELS,
      ZONE_COLORS
    ),
    genders: countByKey(
      registrations,
      (r) => r.gender as Gender,
      GENDER_LABELS,
      GENDER_COLORS
    ),
    years: countByKey(
      registrations,
      (r) => r.year as YearOfStudy,
      YEAR_LABELS,
      YEAR_COLORS
    ),
    dietary: countByKey(
      registrations,
      (r) => r.dietary as Dietary,
      DIETARY_LABELS,
      DIETARY_COLORS
    ),
    payments: countByKey(
      registrations,
      (r) => r.paymentStatus as PaymentStatus,
      PAYMENT_STATUS_LABELS,
      PAYMENT_STATUS_COLORS
    ),
    topColleges: topColleges(registrations),
  };
}
