"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { MonthlyRevenue } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface RevenueOverTimeChartProps {
  data: MonthlyRevenue[];
  isLoading: boolean;
}

export function RevenueOverTimeChart({
  data,
  isLoading,
}: RevenueOverTimeChartProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
        <div className="h-5 w-48 bg-muted rounded animate-pulse mb-6" />
        <div className="h-[320px] bg-muted/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-base font-semibold text-card-foreground">
          Revenue Over Time
        </h3>
        <p className="text-sm text-muted-foreground mt-0.5">
          Monthly earned revenue trend
        </p>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart
          data={data}
          margin={{ top: 4, right: 20, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e2e8f0"
          />
          <XAxis
            dataKey="month"
            fontSize={12}
            tick={{ fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            fontSize={12}
            tick={{ fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
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
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            strokeWidth={2.5}
            fill="url(#revenueGradient)"
            dot={{ r: 4, fill: "#2563eb", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#2563eb", strokeWidth: 2, stroke: "white" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
