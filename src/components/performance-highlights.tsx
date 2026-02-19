"use client";

import { useState } from "react";
import {
  Trophy,
  Star,
  Building2,
  Rocket,
  Crown,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ProjectRow, ProductBreakdown } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface PerformanceHighlightsProps {
  projects: ProjectRow[];
  revenueByProduct: ProductBreakdown[];
  isLoading: boolean;
}

interface Highlight {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
  color: string;
  bg: string;
  projects: ProjectRow[];
}

function computeHighlights(
  projects: ProjectRow[],
  revenueByProduct: ProductBreakdown[]
): Highlight[] {
  const highlights: Highlight[] = [];

  // Top Product by Revenue
  if (revenueByProduct.length > 0) {
    const top = revenueByProduct[0];
    const matchingProjects = projects.filter(
      (p) => p.productName === top.productName
    );
    highlights.push({
      icon: Trophy,
      label: "Top Product by Revenue",
      value: top.productName,
      detail: `${formatCurrency(top.revenue)} earned across ${top.projectCount} projects`,
      color: "#6D36FF",
      bg: "#ECE5FF",
      projects: matchingProjects.sort(
        (a, b) => b.earnedRevenueWithFees - a.earnedRevenueWithFees
      ),
    });
  }

  // Most Popular Product (by activations)
  if (revenueByProduct.length > 0) {
    const mostActive = [...revenueByProduct].sort(
      (a, b) => b.projectCount - a.projectCount
    )[0];
    const matchingProjects = projects.filter(
      (p) => p.productName === mostActive.productName
    );
    highlights.push({
      icon: Rocket,
      label: "Most Popular Product",
      value: mostActive.productName,
      detail: `${mostActive.projectCount} project activations`,
      color: "#9C5CFF",
      bg: "#ECE5FF",
      projects: matchingProjects.sort(
        (a, b) => b.earnedRevenueWithFees - a.earnedRevenueWithFees
      ),
    });
  }

  // Top Client by Revenue
  const clientRevenue = new Map<string, number>();
  const clientProjects = new Map<string, number>();
  projects.forEach((p) => {
    if (!p.companyName) return;
    clientRevenue.set(
      p.companyName,
      (clientRevenue.get(p.companyName) || 0) + p.earnedRevenueWithFees
    );
    clientProjects.set(
      p.companyName,
      (clientProjects.get(p.companyName) || 0) + 1
    );
  });

  if (clientRevenue.size > 0) {
    const topClient = [...clientRevenue.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0];
    const count = clientProjects.get(topClient[0]) || 0;
    const matchingProjects = projects
      .filter((p) => p.companyName === topClient[0])
      .sort((a, b) => b.earnedRevenueWithFees - a.earnedRevenueWithFees);
    highlights.push({
      icon: Crown,
      label: "Top Client by Revenue",
      value: topClient[0],
      detail: `${formatCurrency(topClient[1])} from ${count} projects`,
      color: "#FFA450",
      bg: "#FFF7ED",
      projects: matchingProjects,
    });
  }

  // Highest Revenue Project
  if (projects.length > 0) {
    const topProject = [...projects].sort(
      (a, b) => b.earnedRevenueWithFees - a.earnedRevenueWithFees
    )[0];
    highlights.push({
      icon: Star,
      label: "Highest Revenue Project",
      value: topProject.projectName,
      detail: `${formatCurrency(topProject.earnedRevenueWithFees)} — ${topProject.companyName}`,
      color: "#81D994",
      bg: "#ECFDF5",
      projects: [topProject],
    });
  }

  // Most Active Client (by project count)
  if (clientProjects.size > 0) {
    const mostActiveClient = [...clientProjects.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0];
    const rev = clientRevenue.get(mostActiveClient[0]) || 0;
    const matchingProjects = projects
      .filter((p) => p.companyName === mostActiveClient[0])
      .sort((a, b) => b.earnedRevenueWithFees - a.earnedRevenueWithFees);
    highlights.push({
      icon: Building2,
      label: "Most Active Client",
      value: mostActiveClient[0],
      detail: `${mostActiveClient[1]} projects totaling ${formatCurrency(rev)}`,
      color: "#4E339C",
      bg: "#ECE5FF",
      projects: matchingProjects,
    });
  }

  // Highest Avg Revenue Product
  const qualifiedProducts = revenueByProduct.filter(
    (p) => p.projectCount >= 2
  );
  if (qualifiedProducts.length > 0) {
    const best = [...qualifiedProducts].sort(
      (a, b) =>
        b.revenue / b.projectCount - a.revenue / a.projectCount
    )[0];
    const matchingProjects = projects
      .filter((p) => p.productName === best.productName)
      .sort((a, b) => b.earnedRevenueWithFees - a.earnedRevenueWithFees);
    highlights.push({
      icon: Zap,
      label: "Highest Avg Revenue Product",
      value: best.productName,
      detail: `${formatCurrency(Math.round(best.revenue / best.projectCount))} avg per project`,
      color: "#D60046",
      bg: "#FFF1F2",
      projects: matchingProjects,
    });
  }

  return highlights;
}

export function PerformanceHighlights({
  projects,
  revenueByProduct,
  isLoading,
}: PerformanceHighlightsProps) {
  const [expandedLabel, setExpandedLabel] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border p-5 shadow-sm"
          >
            <div className="h-4 w-32 bg-muted rounded animate-pulse mb-3" />
            <div className="h-5 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 w-40 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  const highlights = computeHighlights(projects, revenueByProduct);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {highlights.map((h) => {
        const Icon = h.icon;
        const isExpanded = expandedLabel === h.label;

        return (
          <div
            key={h.label}
            className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() =>
                setExpandedLabel(isExpanded ? null : h.label)
              }
              className="w-full text-left p-5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 mb-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                    style={{ backgroundColor: h.bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: h.color }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {h.label}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs text-muted-foreground">
                    {h.projects.length} projects
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              <p
                className="text-sm font-bold text-card-foreground leading-snug truncate"
                title={h.value}
              >
                {h.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{h.detail}</p>
            </button>

            {isExpanded && (
              <div className="border-t border-border px-5 py-4 bg-muted/20 max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      <th className="pb-2 pr-3">Project</th>
                      <th className="pb-2 pr-3 hidden sm:table-cell">Company</th>
                      <th className="pb-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {h.projects.map((p) => (
                      <tr
                        key={p.projectId}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="py-2 pr-3 font-medium text-card-foreground truncate max-w-[140px]" title={p.projectName}>
                          {p.projectName}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground truncate max-w-[120px] hidden sm:table-cell" title={p.companyName}>
                          {p.companyName}
                        </td>
                        <td className="py-2 text-right font-semibold text-card-foreground whitespace-nowrap">
                          {formatCurrency(p.earnedRevenueWithFees)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
