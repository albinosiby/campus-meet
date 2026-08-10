import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { DashboardStats, Registration } from "../types";
import {
  EXPORT_HEADERS,
  exportFilename,
  registrationToRow,
} from "./utils";

export function downloadPdf(
  registrations: Registration[],
  stats: DashboardStats
): void {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const marginX = 36;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 22, 30);
  doc.text("Malabar Campus Meet 2026 — Registration Report", marginX, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 100);
  doc.text(
    `Generated ${new Date().toLocaleString("en-IN")}  ·  Total: ${stats.total}  ·  Paid: ${stats.paidCount}  ·  Pending: ${stats.pendingCount}  ·  Unpaid: ${stats.unpaidCount}`,
    marginX,
    58
  );

  doc.text(
    `Amount received: ₹${stats.amountReceived}  ·  Pending: ₹${stats.amountPending}  ·  Expected: ₹${stats.amountExpected}`,
    marginX,
    74
  );

  autoTable(doc, {
    startY: 90,
    head: [[...EXPORT_HEADERS]],
    body: registrations.map((reg) => registrationToRow(reg)),
    styles: {
      fontSize: 7.5,
      cellPadding: 4,
      textColor: [30, 32, 40],
    },
    headStyles: {
      fillColor: [200, 164, 78],
      textColor: [15, 17, 24],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 246, 242],
    },
    margin: { left: marginX, right: marginX },
  });

  doc.save(exportFilename("pdf"));
}
