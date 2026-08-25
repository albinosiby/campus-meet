"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { buildDashboardStats, formatCurrency } from "@/admin/analytics";
import {
  getRegistrations,
  updatePayment,
  updatePaymentStatus,
  deleteRegistration,
} from "@/admin/storage";
import type { PaymentStatus, Registration } from "@/admin/types";
import { FeeNotice } from "@/landing/components/FeeNotice";
import type { ManualPaymentPayload } from "./RegistrationDetail";
import { AdminShell } from "./AdminShell";
import { ExportMenu } from "./ExportMenu";
import { PieChartCard } from "./PieChartCard";
import { RegistrationsTable } from "./RegistrationsTable";
import { StatsCards } from "./StatsCards";

export function Dashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const rows = await getRegistrations();
        if (!cancelled) {
          setRegistrations(rows);
          setLoadError("");
        }
      } catch {
        if (!cancelled) {
          setLoadError(
            "Could not load registrations. Check Firestore rules and that you are signed in."
          );
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(
    () => buildDashboardStats(registrations),
    [registrations]
  );

  async function handlePaymentStatusChange(
    id: string,
    status: PaymentStatus
  ) {
    const previous = registrations;
    setRegistrations((rows) =>
      rows.map((row) =>
        row.id === id ? { ...row, paymentStatus: status } : row
      )
    );

    try {
      await updatePaymentStatus(id, status);
    } catch {
      setRegistrations(previous);
      setLoadError("Could not update payment status. Try again.");
    }
  }

  async function handleMarkPaid(id: string, payload: ManualPaymentPayload) {
    const previous = registrations;
    setRegistrations((rows) =>
      rows.map((row) =>
        row.id === id
          ? {
              ...row,
              paymentStatus: "paid",
              amount: payload.amount,
              ...(payload.transactionId
                ? { transactionId: payload.transactionId }
                : {}),
            }
          : row
      )
    );

    try {
      await updatePayment(id, {
        paymentStatus: "paid",
        amount: payload.amount,
        ...(payload.transactionId
          ? { transactionId: payload.transactionId }
          : {}),
      });
      setLoadError("");
    } catch {
      setRegistrations(previous);
      setLoadError("Could not mark registration as paid. Try again.");
      throw new Error("Could not mark registration as paid. Try again.");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteRegistration(id);
      setRegistrations((rows) => rows.filter((row) => row.id !== id));
      setLoadError("");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not delete registration. Try again.";
      setLoadError(message);
      throw error instanceof Error ? error : new Error(message);
    }
  }

  return (
    <AdminShell
      title="Registrations Dashboard"
      subtitle="Live overview of campus meet sign-ups & fee collection"
    >
      {!loaded ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold/30 border-t-gold" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-8"
        >
          {loadError ? (
            <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loadError}
            </p>
          ) : null}

          <FeeNotice variant="light" className="max-w-xl" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-heading uppercase tracking-[0.28em] text-gold-dim">
                Reports & Analytics
              </p>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-admin-muted">
                Registrants pay on signup and show as Paid. Click Verify after
                you confirm the UPI (or mark cash collections manually).
                Received{" "}
                <span className="font-heading font-semibold text-admin-ink">
                  {formatCurrency(stats.amountReceived)}
                </span>
                ; remaining{" "}
                <span className="font-heading font-semibold text-admin-ink">
                  {formatCurrency(stats.amountRemaining)}
                </span>
                .
              </p>
            </div>
            <ExportMenu
              registrations={registrations}
              stats={stats}
              scopeLabel="All registrations"
            />
          </div>

          <StatsCards stats={stats} />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PieChartCard
              title="Payment Status"
              description="Paid (awaiting verify), verified, or unpaid."
              data={stats.payments}
            />
            <PieChartCard
              title="Registrations by Zone"
              description="How sign-ups are distributed across Malabar zones."
              data={stats.zones}
            />
            <PieChartCard
              title="Gender Split"
              description="Male and female participation across all registrations."
              data={stats.genders}
            />
            <PieChartCard
              title="Year of Study"
              description="Breakdown of registrants by academic year."
              data={stats.years}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <PieChartCard
              title="Dietary Preferences"
              description="Meal preference mix for planning hospitality."
              data={stats.dietary}
            />
            <PieChartCard
              title="Colleges"
              description="All colleges by registration count."
              data={stats.topColleges}
            />
          </div>

          <RegistrationsTable
            registrations={registrations}
            onPaymentStatusChange={(id, status) => {
              void handlePaymentStatusChange(id, status);
            }}
            onMarkPaid={handleMarkPaid}
            onDelete={handleDelete}
          />
        </motion.div>
      )}
    </AdminShell>
  );
}
