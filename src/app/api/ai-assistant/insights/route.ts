import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { ParsedCsv, ChartInsightsResponse } from "@/types/ai";

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfigured: missing GROQ_API_KEY" },
        { status: 500 },
      );
    }

    const groq = new Groq({ apiKey });
    const body: { dataset: ParsedCsv; question?: string } = await req.json();

    if (!body?.dataset?.columns?.length) {
      return NextResponse.json(
        { error: "No dataset provided" },
        { status: 400 },
      );
    }

    const datasetContext = `
The dataset contains ${body.dataset.rowCount} rows.
Columns: ${body.dataset.columns.join(", ")}.
Preview rows: ${JSON.stringify(body.dataset.rows.slice(0, 50), null, 2)}.
    `;

    const userQuestion =
      body.question || "Generate insights and charts for this dataset.";

    const systemPrompt = `
You are a data visualization assistant.  
Analyze the provided dataset and return a JSON object following EXACTLY this schema:  

{
  "insights": ["string", "string", ...],
  "charts": [
    {
      "type": "bar" | "line" | "pie" | "scatter" | "area",
      "title": "string",
      "xKey": "string",
      "yKey": "string",
      "data": [
        { "<xKey>": string | number, "<yKey>": number },
        ...
      ]
    }
  ]
}

Rules:
1. data must be a valid array of objects in the exact format Recharts expects:
   - Each object represents one data point.
   - The keys must match exactly the xKey and yKey values.
   - All numeric values for yKey must be valid numbers.
2. The title must be a short, human-readable description of the chart.
3. Always output valid JSON only — no explanations, no triple backticks, no markdown, no comments.
4. Ensure all strings use double quotes, and no trailing commas.
5. Values must come directly from the dataset — do not invent random numbers.
6. insights should summarize key patterns or trends in plain English.

Return ONLY the JSON object and nothing else.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `${datasetContext}\n\nUser request: ${userQuestion}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 1200,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    console.log("raw is:", raw);

    let parsed: ChartInsightsResponse;
    try {
      parsed = JSON.parse(raw);
      console.log("parse is: ", parsed);
    } catch (e) {
      console.log(e);
      parsed = { insights: [], charts: [] };
    }

    console.log(JSON.stringify(parsed), "This is parsed data");
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
