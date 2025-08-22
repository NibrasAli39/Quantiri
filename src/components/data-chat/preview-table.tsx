"use client";

import { cn } from "@/lib/utils";

type Props = {
  columns: string[];
  rows: Record<string, unknown>[];
};

export default function PreviewTable({ columns, rows }: Props) {
  if (!columns.length) {
    return (
      <div className="text-sm text-muted-foreground">No columns detected.</div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="max-h-64 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-slate-100">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="px-3 py-2 text-left font-medium text-slate-700"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  className="px-3 py-3 text-muted-foreground"
                  colSpan={columns.length}
                >
                  No rows to display.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} className={cn(i % 2 ? "bg-white" : "bg-slate-50")}>
                  {columns.map((c) => (
                    <td key={c} className="px-3 py-2 whitespace-pre-wrap">
                      {formatCell(r[c])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t px-3 py-2 text-xs text-muted-foreground">
        Showing up to first 50 rows
      </div>
    </div>
  );
}

function formatCell(v: unknown): string | number {
  if (v === null || typeof v === "undefined") return "";
  if (typeof v === "number") return Number.isFinite(v) ? v : "";
  return String(v);
}
