"use client";

import { useEffect } from "react";
import { useAIAssistantStore } from "@/lib/stores/ai-assistant";
import { useFetchInsights } from "@/lib/hooks/ai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  CartesianGrid,
  AreaChart,
  ScatterChart,
  Scatter,
  Cell,
  Area,
} from "recharts";
import { AIChart } from "@/types/ai";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function renderChart(chart: AIChart): React.ReactNode {
  switch (chart.type) {
    case "line":
      return (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart accessibilityLayer data={chart.data}>
            <CartesianGrid vertical={false} />
            <XAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              dataKey={chart.xKey}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Legend />
            <Line
              type="natural"
              dataKey={chart.yKey}
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      );

    case "bar":
      return (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart accessibilityLayer data={chart.data}>
            <CartesianGrid />
            <XAxis
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              dataKey={chart.xKey}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Legend />
            <Bar dataKey={chart.yKey} radius={8} fill="var(--color-desktop)" />
          </BarChart>
        </ChartContainer>
      );

    case "pie":
      return (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <PieChart>
            <Legend />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chart.data}
              dataKey={chart.yKey}
              nameKey={chart.xKey}
              label
            >
              {chart.data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      );

    case "area":
      return (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart accessibilityLayer data={chart.data}>
            <CartesianGrid />
            <XAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              dataKey={chart.xKey}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Legend />
            <Area
              type="natural"
              dataKey={chart.yKey}
              stroke="var(--color-desktop)"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
            />
          </AreaChart>
        </ChartContainer>
      );

    case "scatter":
      return (
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ScatterChart>
            <CartesianGrid />
            <XAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              type="category"
              dataKey={chart.xKey}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              type="number"
              dataKey={chart.yKey}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Legend />
            <Scatter data={chart.data} fill="var(--color-desktop)" />
          </ScatterChart>
        </ChartContainer>
      );

    default:
      return null;
  }
}

export default function InsightsSection() {
  const dataset = useAIAssistantStore((s) => s.dataset);
  const { mutate, data, isPending, isError, error } = useFetchInsights();

  useEffect(() => {
    if (dataset) mutate(dataset);
  }, [dataset, mutate]);

  if (!dataset) return null;

  return (
    <div className="mt-8 space-y-6">
      <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6">
          <CardTitle className="text-xl font-bold">
            AI Insights & Visualizations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 bg-gradient-to-b from-white to-gray-50">
          {isPending && (
            <div className="flex items-center gap-3 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing dataset...</span>
            </div>
          )}

          {isError && (
            <p className="text-red-500">
              Error: {error instanceof Error ? error.message : "Failed to load"}
            </p>
          )}

          {data && (
            <div className="space-y-8">
              {data.insights?.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900 tracking-tight">
                    Insights
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {data.insights.map((insight, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 rounded-2xl p-5 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <p className="text-base text-gray-800 leading-relaxed">
                          {insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.charts?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.charts.map((chart, index) => (
                    <Card
                      key={index}
                      className="shadow-lg rounded-2xl border-0 hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-gray-700">
                          {chart.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>{renderChart(chart)}</CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No charts generated</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
