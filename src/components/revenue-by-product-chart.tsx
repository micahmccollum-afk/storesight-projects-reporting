"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import type { ProductBreakdown } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface RevenueByProductChartProps {
  data: ProductBreakdown[];
  isLoading: boolean;
}

const COLORS = [
  "#6D36FF",
  "#9C5CFF",
  "#C980FF",
  "#FFA450",
  "#FFDF50",
  "#81D994",
  "#D60046",
  "#4E339C",
  "#34508A",
  "#CA88E9",
];

function truncateLabel(label: string, maxLen: number = 22): string {
  return label.length > maxLen ? label.slice(0, maxLen) + "..." : label;
}

export function RevenueByProductChart({
  data,
  isLoading,
}: RevenueByProductChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="h-5 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-[320px] bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  const top10 = data.slice(0, 10);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-card-foreground">
          Revenue by Product
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Top {top10.length} products by earned revenue
        </p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={top10}
          layout="vertical"
          margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#D9E2FF"
          />
          <XAxis
            type="number"
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            fontSize={12}
            tick={{ fill: "#6E328C" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="productName"
            width={170}
            fontSize={12}
            tick={{ fill: "#463572" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => truncateLabel(v)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #D9E2FF",
              borderRadius: "12px",
              fontSize: "13px",
              padding: "10px 14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            formatter={(value: number | undefined) => [
            value !== undefined ? formatCurrency(value) : "",
            "Revenue",
          ]}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={24}>
            {top10.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
