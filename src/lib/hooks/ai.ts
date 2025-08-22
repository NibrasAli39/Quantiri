"use client";

import { useMutation } from "@tanstack/react-query";
import Papa, { ParseResult } from "papaparse";
import type { ParsedCsv } from "@/types/ai";

/**
 * Parse CSV client-side and return a preview (first 50 rows).
 */
export function useParseCsvMutation() {
  return useMutation({
    mutationKey: ["parse-csv"],
    mutationFn: async (file: File): Promise<ParsedCsv> => {
      const text = await file.text();
      const parsed = await new Promise<ParseResult<Record<string, unknown>>>(
        (resolve, reject) => {
          Papa.parse<Record<string, unknown>>(text, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: (res) => resolve(res),
            error: (err: unknown) => reject(err),
          });
        },
      );

      const rows = parsed.data as Record<string, unknown>[];
      const firstRow = rows[0] ?? {};
      const columns = Object.keys(firstRow);

      return {
        columns,
        rows: rows.slice(0, 50),
        rowCount: rows.length,
        fileName: (file && file.name) || "uploaded.csv",
        fileSize: file.size || 0,
      };
    },
  });
}

/**
 * Simple mock chat mutation — later replaced by server call.
 */
export function useChatMutation() {
  return useMutation({
    mutationKey: ["ai-chat"],
    mutationFn: async (prompt: string) => {
      // simulated latency
      await new Promise((r) => setTimeout(r, 550));
      const lower = prompt.toLowerCase();

      if (
        lower.includes("top") ||
        lower.includes("rank") ||
        lower.includes("best")
      ) {
        return "I can prepare a ranked list once your dataset is uploaded. (UI demo response)";
      }
      if (lower.includes("chart") || lower.includes("trend")) {
        return "I'll return chart-ready data once the dataset is available. (UI demo response)";
      }
      return "Got it — once your CSV is uploaded, I'll analyze and summarize the key insights.";
    },
  });
}
