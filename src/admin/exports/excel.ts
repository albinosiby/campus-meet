import * as XLSX from "xlsx";
import type { Registration } from "../types";
import {
  EXPORT_HEADERS,
  exportFilename,
  registrationToRow,
} from "./utils";

export function downloadExcel(registrations: Registration[]): void {
  const rows = [
    [...EXPORT_HEADERS],
    ...registrations.map((reg) => registrationToRow(reg)),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet["!cols"] = EXPORT_HEADERS.map((header, index) => ({
    wch: Math.max(
      header.length + 2,
      ...rows.slice(1).map((row) => String(row[index] ?? "").length + 2)
    ),
  }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
  XLSX.writeFile(workbook, exportFilename("xlsx"));
}
