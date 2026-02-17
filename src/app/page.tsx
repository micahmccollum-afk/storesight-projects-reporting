"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { KPICards } from "@/components/kpi-cards";
import { RevenueByProductChart } from "@/components/revenue-by-product-chart";
import { RevenueOverTimeChart } from "@/components/revenue-over-time-chart";
import { ProjectTable } from "@/components/project-table";
import { CSVUpload } from "@/components/csv-upload";
import { ConnectionBanner } from "@/components/connection-banner";
import { useDashboardData } from "@/hooks/use-dashboard-data";

export default function Dashboard() {
  const { data, isLoading, isError, error, noData, refetch, dataUpdatedAt } =
    useDashboardData();

  const hasData = !noData && (data?.projects?.length ?? 0) > 0;

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <DashboardHeader
          isLoading={isLoading}
          hasData={hasData}
          onRefresh={refetch}
          onUploadSuccess={refetch}
          lastUpdated={dataUpdatedAt}
        />

        <ConnectionBanner noData={noData} />

        {noData && !isLoading && <CSVUpload onUploadSuccess={refetch} />}

        {isError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-700">
            {(error as Error)?.message || "An error occurred loading data."}
          </div>
        )}

        {!noData && (
          <>
            <KPICards kpis={data?.kpis} isLoading={isLoading} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueByProductChart
                data={data?.revenueByProduct || []}
                isLoading={isLoading}
              />
              <RevenueOverTimeChart
                data={data?.revenueByMonth || []}
                isLoading={isLoading}
              />
            </div>

            <ProjectTable
              data={data?.projects || []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </main>
  );
}
