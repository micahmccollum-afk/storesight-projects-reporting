"use client";

import { DollarSign, FolderKanban, TrendingUp } from "lucide-react";
import type { KPIData } from "@/lib/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface KPICardsProps {
  kpis: KPIData | undefined;
  isLoading: boolean;
}

const cards = [
  {
    key: "totalRevenue" as const,
    title: "Total Revenue",
    icon: DollarSign,
    color: "#10b981",
    format: (v: number) => formatCurrency(v),
  },
  {
    key: "totalProjects" as const,
    title: "Total Projects",
    icon: FolderKanban,
    color: "#2563eb",
    format: (v: number) => formatNumber(v),
  },
  {
    key: "avgRevenuePerProject" as const,
    title: "Avg Revenue / Project",
    icon: TrendingUp,
    color: "#8b5cf6",
    format: (v: number) => formatCurrency(v),
  },
];

export function KPICards({ kpis, isLoading }: KPICardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = kpis?.[card.key] ?? 0;

        return (
          <div
            key={card.key}
            className="bg-card rounded-2xl border border-border p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-xl"
                style={{ backgroundColor: `${card.color}12` }}
              >
                <Icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {card.title}
              </span>
            </div>
            <div className="text-3xl font-bold text-card-foreground">
              {isLoading ? (
                <div className="h-9 w-32 bg-muted rounded animate-pulse" />
              ) : (
                card.format(value)
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
