"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, ParsedCsv } from "@/types/ai";

type UIStatus = "idle" | "uploading" | "parsing" | "ready" | "thinking";

type State = {
  status: UIStatus;
  dataset: ParsedCsv | null;
  messages: ChatMessage[];
};

type Actions = {
  setStatus: (s: UIStatus) => void;
  setDataset: (d: ParsedCsv | null) => void;
  appendMessage: (
    m: Omit<ChatMessage, "id" | "createdAt"> &
      Partial<Pick<ChatMessage, "id" | "createdAt">>,
  ) => ChatMessage;
  resetConversation: () => void;
  clearDataset: () => void;
  loadSampleDataset: () => void;
};

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useAIAssistantStore = create<State & Actions>()(
  persist(
    (set) => ({
      status: "idle",
      dataset: null,
      messages: [
        {
          id: uid(),
          role: "assistant",
          content:
            "Hi — upload a CSV to preview your data and start asking questions. Try ‘Top 5 products by revenue’ as an example.",
          createdAt: new Date().toISOString(),
        },
      ],

      setStatus: (s) => set(() => ({ status: s })),
      setDataset: (d) =>
        set(() => ({ dataset: d, status: d ? "ready" : "idle" })),

      appendMessage: ({ role, content, id, createdAt }) => {
        const msg: ChatMessage = {
          id: id ?? uid(),
          role,
          content,
          createdAt: createdAt ?? new Date().toISOString(),
        };
        set((s) => ({ messages: [...s.messages, msg] }));
        return msg;
      },

      resetConversation: () =>
        set(() => ({
          messages: [
            {
              id: uid(),
              role: "assistant",
              content: "Conversation cleared. Upload a dataset and ask away!",
              createdAt: new Date().toISOString(),
            },
          ],
          status: "idle",
        })),

      clearDataset: () => set(() => ({ dataset: null, status: "idle" })),

      loadSampleDataset: () =>
        set(() => ({
          dataset: {
            columns: ["product", "month", "revenue"],
            rows: [
              { product: "A", month: "Jan", revenue: 1200 },
              { product: "B", month: "Jan", revenue: 980 },
              { product: "A", month: "Feb", revenue: 1500 },
              { product: "B", month: "Feb", revenue: 1100 },
            ],
            rowCount: 4,
            fileName: "sample.csv",
            fileSize: 1024,
          },
          status: "ready",
        })),
    }),
    {
      name: "ai-assistant-ui-v1",
      partialize: (s) => ({ messages: s.messages, dataset: s.dataset }),
    },
  ),
);
