"use client";

import { useMemo, useState } from "react";
import { Download, ChevronDown, FileSpreadsheet, FileText, Table2 } from "lucide-react";
import { downloadCsv, downloadExcel, downloadPdf } from "@/admin/exports";
import type { DashboardStats, Registration } from "@/admin/types";

interface ExportMenuProps {
  registrations: Registration[];
  stats: DashboardStats;
}

const OPTIONS = [
  {
    id: "csv" as const,
    label: "Download CSV",
    hint: "Comma-separated values",
    icon: Table2,
  },
  {
    id: "excel" as const,
    label: "Download Excel",
    hint: "Microsoft Excel (.xlsx)",
    icon: FileSpreadsheet,
  },
  {
    id: "pdf" as const,
    label: "Download PDF",
    hint: "Printable report",
    icon: FileText,
  },
];

export function ExportMenu({ registrations, stats }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const disabled = useMemo(() => registrations.length === 0, [registrations]);

  function handleExport(id: (typeof OPTIONS)[number]["id"]) {
    if (disabled) return;
    if (id === "csv") downloadCsv(registrations);
    if (id === "excel") downloadExcel(registrations);
    if (id === "pdf") downloadPdf(registrations, stats);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-sm border border-gold/40 bg-gold px-4 py-2.5 text-xs font-heading uppercase tracking-[0.16em] text-obsidian transition-colors hover:bg-gold-bright disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Download className="h-3.5 w-3.5" />
        Export Report
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Close export menu"
            className="fixed inset-0 z-30 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-40 mt-2 w-64 overflow-hidden rounded-sm border border-admin-border bg-admin-surface shadow-xl">
            {OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleExport(option.id)}
                  className="flex w-full items-start gap-3 border-b border-admin-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-admin-elevated"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gold-dim" />
                  <span>
                    <span className="block text-sm font-heading text-admin-ink">
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-admin-muted">
                      {option.hint}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
