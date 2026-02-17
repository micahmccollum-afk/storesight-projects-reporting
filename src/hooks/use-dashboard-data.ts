"use client";

import { useQuery } from "@tanstack/react-query";
import type { DashboardData } from "@/lib/types";

interface DashboardResponse extends DashboardData {
  noData?: boolean;
  error?: string;
}

async function fetchDashboardData(): Promise<DashboardResponse> {
  const response = await fetch(`/api/data?t=${Date.now()}`, {
    cache: "no-store",
  });
  const data = await response.json();

  if (data.noData) return data;

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch dashboard data");
  }

  return data;
}

export function useDashboardData() {
  const query = useQuery<DashboardResponse>({
    queryKey: ["dashboard-data"],
    queryFn: fetchDashboardData,
    staleTime: 0,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError && !query.data?.noData,
    error: query.error,
    noData: query.data?.noData === true,
    refetch: query.refetch,
    dataUpdatedAt: query.dataUpdatedAt
      ? new Date(query.dataUpdatedAt)
      : undefined,
  };
}
