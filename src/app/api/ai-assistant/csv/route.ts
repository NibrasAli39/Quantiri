import { NextResponse } from "next/server";
import { z } from "zod";
import Papa, { ParseResult } from "papaparse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import type { ParsedCsv } from "@/types/ai";
import { Prisma } from "@prisma/client";

const bodySchema = z.object({
  fileName: z.string(),
  fileSize: z.number().int(),
  text: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsedBody = bodySchema.safeParse(json);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Invalid body", issues: parsedBody.error.format() },
        { status: 400 },
      );
    }

    const { fileName, fileSize, text } = parsedBody.data;

    // Parse CSV server-side
    const parsed = Papa.parse<Record<string, unknown>>(text, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    }) as ParseResult<Record<string, unknown>>;

    const rows = parsed.data ?? [];
    const firstRow = rows[0] ?? {};
    const columns = Object.keys(firstRow);

    const previewRows = rows.slice(0, 50);

    // Save preview into DB
    const dataset = await db.dataset.create({
      data: {
        userId: session.user.id,
        fileName,
        fileSize,
        columns,
        rows: previewRows as Prisma.JsonArray,
        rowCount: rows.length,
      },
    });

    const result: ParsedCsv = {
      id: dataset.id,
      columns,
      rows: previewRows,
      rowCount: rows.length,
      fileName,
      fileSize,
    };

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
