"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { ProductBreakdown } from "@/lib/types";
import { getChartColors } from "@/lib/chart-theme";
import { useTheme } from "./theme-provider";

interface ActivationsByProductChartProps {
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

export function ActivationsByProductChart({
  data,
  isLoading,
}: ActivationsByProductChartProps) {
  const { theme } = useTheme();
  const colors = useMemo(() => getChartColors(), [theme]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="h-5 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-[320px] bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  const sorted = [...data].sort((a, b) => b.projectCount - a.projectCount);
  const totalActivations = sorted.reduce((s, d) => s + d.projectCount, 0);

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="mb-2">
        <h3 className="text-base font-semibold text-card-foreground">
          Activations by Product
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          {totalActivations} total activations across {sorted.length} products
        </p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={sorted}
            dataKey="projectCount"
            nameKey="productName"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={110}
            paddingAngle={2}
            label={({ percent }: { percent?: number }) =>
              percent && percent > 0.05
                ? `${(percent * 100).toFixed(0)}%`
                : ""
            }
            labelLine={false}
          >
            {sorted.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.85}
                stroke={theme === "dark" ? "#1a1228" : "white"}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: colors.tooltipBg,
              border: `1px solid ${colors.tooltipBorder}`,
              borderRadius: "12px",
              fontSize: "13px",
              padding: "10px 14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              color: colors.label,
            }}
            itemStyle={{ color: colors.label }}
            formatter={(value: number | undefined, name: string | undefined) => [
              value !== undefined ? `${value} projects` : "",
              name || "Activations",
            ]}
            labelStyle={{ fontWeight: 600, marginBottom: 4, color: colors.label }}
            labelFormatter={() => ""}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              fontSize: "12px",
              lineHeight: "20px",
              color: colors.label,
            }}
            formatter={(value: string) =>
              value.length > 20 ? value.slice(0, 20) + "..." : value
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
