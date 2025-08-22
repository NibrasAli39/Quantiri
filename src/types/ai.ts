export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: string;
};

export type ParsedCsv = {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  fileName: string;
  fileSize: number;
};
