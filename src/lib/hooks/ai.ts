"use client";

import { useMutation } from "@tanstack/react-query";
import type { ParsedCsv, ChatRequestBody } from "@/types/ai";

export function useParseCsvMutation() {
  return useMutation({
    mutationKey: ["parse-csv"],
    mutationFn: async (file: File): Promise<ParsedCsv> => {
      const text = await file.text();
      const payload = { fileName: file.name, fileSize: file.size, text };
      const res = await fetch("/api/ai-assistant/csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "CSV upload failed");
      }
      const data = (await res.json()) as ParsedCsv | { error?: string };
      if ("error" in data && data.error) throw new Error(String(data.error));
      return data as ParsedCsv;
    },
  });
}

export function useChatMutation() {
  return useMutation({
    mutationKey: ["ai-chat"],
    mutationFn: async (payload: ChatRequestBody): Promise<string> => {
      const res = await fetch("/api/ai-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || "AI API request failed");
      }
      const data = await res.json();
      if (data?.error) throw new Error(String(data.error));
      return String(data.reply ?? "");
    },
  });
}
