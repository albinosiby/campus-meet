import writeExcelFile, { type Cell } from "write-excel-file/browser";
import type { Registration } from "../types";
import {
  EXPORT_HEADERS,
  PAYMENT_EXPORT_HEADERS,
  downloadBlob,
  exportFilename,
  paymentRowsForExport,
  registrationToRow,
} from "./utils";

function sheetFromRows(headers: readonly string[], body: string[][]) {
  const rows: Cell[][] = [
    headers.map((header) => ({ value: header, fontWeight: "bold" })),
    ...body.map((row) => row.map((value) => ({ value }))),
  ];
  const columns = headers.map((header, index) => ({
    width: Math.min(
      48,
      Math.max(
        header.length + 2,
        ...body.map((row) => String(row[index] ?? "").length + 2)
      )
    ),
  }));
  return { rows, columns };
}

export async function downloadExcel(
  registrations: Registration[]
): Promise<void> {
  const registrationsSheet = sheetFromRows(
    EXPORT_HEADERS,
    registrations.map((reg) => registrationToRow(reg))
  );
  const paymentsSheet = sheetFromRows(
    PAYMENT_EXPORT_HEADERS,
    paymentRowsForExport(registrations)
  );

  const blob = await writeExcelFile([
    {
      data: registrationsSheet.rows,
      sheet: "Registrations",
      columns: registrationsSheet.columns,
      stickyRowsCount: 1,
    },
    {
      data: paymentsSheet.rows,
      sheet: "Payments",
      columns: paymentsSheet.columns,
      stickyRowsCount: 1,
    },
  ]).toBlob();
  downloadBlob(blob, exportFilename("xlsx"));
}
