import { NextResponse } from "next/server";
import { z } from "zod";
import Groq from "groq-sdk";
import type { ChatApiResponse, ChatRequestBody } from "@/types/ai";
import { db } from "@/lib/db";

const bodySchema = z.object({
  messages: z
    .array(
      z.object({ role: z.enum(["user", "assistant"]), content: z.string() }),
    )
    .nonempty(),
  datasetId: z.string().optional(),
  dataset: z
    .object({
      columns: z.array(z.string()),
      rows: z.array(
        z.record(
          z.string(),
          z.union([z.string(), z.number(), z.boolean(), z.null()]),
        ),
      ),
      rowCount: z.number(),
      fileName: z.string().optional(),
    })
    .nullable()
    .optional(),
  model: z.string().optional(),
  temperature: z.number().optional(),
});

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const DEFAULT_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
const DEFAULT_TEMPERATURE = Number(process.env.GROQ_TEMPERATURE ?? "0.0");
const DEFAULT_MAX_OUTPUT_TOKENS = Number(
  process.env.GROQ_MAX_OUTPUT_TOKENS ?? "1024",
);

// helper: compact dataset summary (token-efficient)
function buildDatasetSummary(
  dataset?: ChatRequestBody["dataset"],
  maxRows = 50,
): string {
  if (!dataset) return "";
  const cols = dataset.columns.join(", ");
  const rowsPreview = (dataset.rows ?? []).slice(0, maxRows).map((r) =>
    dataset.columns
      .map((c) => {
        const v = (r as Record<string, unknown>)[c];
        if (v === null || typeof v === "undefined") return "";
        if (typeof v === "object") return JSON.stringify(v);
        return String(v);
      })
      .join(" | "),
  );
  return `DATASET SUMMARY\nColumns: ${cols}\nPreview (first ${
    rowsPreview.length
  }) rows:\n${rowsPreview.map((r, i) => `${i + 1}. ${r}`).join("\n")}\n\n`;
}

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: missing GROQ_API_KEY" },
        { status: 500 },
      );
    }

    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.format() },
        { status: 400 },
      );
    }

    const body = parsed.data as ChatRequestBody;

    // Load dataset if datasetId is provided
    let dataset = body.dataset;
    if (body.datasetId) {
      const ds = await db.dataset.findUnique({ where: { id: body.datasetId } });
      if (ds) {
        dataset = {
          columns: ds.columns,
          rows: ds.rows as Record<string, unknown>[],
          rowCount: ds.rowCount,
          fileName: ds.fileName,
        };
      }
    }

    const messagesWindow = body.messages.slice(-12);
    const datasetSummary = buildDatasetSummary(dataset);

    const model = body.model ?? DEFAULT_MODEL;
    const temperature =
      typeof body.temperature === "number"
        ? body.temperature
        : DEFAULT_TEMPERATURE;

    // Call Groq SDK
    const completion = await groq.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: `You are Quantiri, a personal AI data analyst. Provide short, actionable answers.\n\n${datasetSummary}`,
        },
        ...messagesWindow.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      ],
      temperature,
      max_tokens: DEFAULT_MAX_OUTPUT_TOKENS,
    });

    const reply =
      completion.choices?.[0]?.message?.content ?? "No reply generated";

    const result: ChatApiResponse = { reply: String(reply) };
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
