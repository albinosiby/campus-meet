import * as XLSX from "xlsx";
import type { Registration } from "../types";
import {
  EXPORT_HEADERS,
  PAYMENT_EXPORT_HEADERS,
  exportFilename,
  paymentRowsForExport,
  registrationToRow,
} from "./utils";

function sheetFromRows(headers: readonly string[], body: string[][]) {
  const rows = [[...headers], ...body];
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet["!cols"] = headers.map((header, index) => ({
    wch: Math.min(
      48,
      Math.max(
        header.length + 2,
        ...rows.slice(1).map((row) => String(row[index] ?? "").length + 2)
      )
    ),
  }));
  return worksheet;
}

export function downloadExcel(registrations: Registration[]): void {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    sheetFromRows(
      EXPORT_HEADERS,
      registrations.map((reg) => registrationToRow(reg))
    ),
    "Registrations"
  );
  XLSX.utils.book_append_sheet(
    workbook,
    sheetFromRows(PAYMENT_EXPORT_HEADERS, paymentRowsForExport(registrations)),
    "Payments"
  );
  XLSX.writeFile(workbook, exportFilename("xlsx"));
}
