import type { Registration } from "../types";
import {
  downloadBlob,
  EXPORT_HEADERS,
  exportFilename,
  registrationToRow,
} from "./utils";

function escapeCsv(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadCsv(registrations: Registration[]): void {
  const lines = [
    EXPORT_HEADERS.join(","),
    ...registrations.map((reg) =>
      registrationToRow(reg).map(escapeCsv).join(",")
    ),
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  downloadBlob(blob, exportFilename("csv"));
}
