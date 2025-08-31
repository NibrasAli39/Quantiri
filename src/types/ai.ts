export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ParsedCsv = {
  id?: string;
  columns: string[];
  rows: Record<string, unknown>[]; // keep unknown for type-safety
  rowCount: number;
  fileName: string;
  fileSize: number;
};

/** API request/response types for server route */
export type ChatRequestBody = {
  messages: { role: ChatRole; content: string }[]; // conversation history (client should send last N messages)
  datasetId?: string | null;
  dataset?: {
    columns: string[];
    rows: Record<string, unknown>[]; // send preview only (first N rows)
    rowCount: number;
    fileName?: string;
  } | null;
  // optional override params
  model?: string | null;
  temperature?: number | null;
  requestStructured?: boolean;
};

export type ChatApiResponse = {
  reply: string;
  // optional structured payload for future (charts, tables)
  structured?: ChartInsightsResponse;
};

export type AIChart = {
  type: "bar" | "line" | "pie" | "scatter" | "area";
  title: string;
  xKey: string;
  yKey: string;
  data: Record<string, number>[];
};

export type ChartInsightsResponse = {
  insights: string[];
  charts: AIChart[];
};
