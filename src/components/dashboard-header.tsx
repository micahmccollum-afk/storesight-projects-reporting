"use client";

import { BarChart3, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { CSVUpload } from "./csv-upload";

interface DashboardHeaderProps {
  isLoading: boolean;
  hasData: boolean;
  onRefresh: () => void;
  onUploadSuccess: () => void;
  lastUpdated?: Date;
}

export function DashboardHeader({
  isLoading,
  hasData,
  onRefresh,
  onUploadSuccess,
  lastUpdated,
}: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Revenue & Product Report
          </h1>
          <p className="text-sm text-muted-foreground">
            Marketplace project revenue and product performance
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {lastUpdated && hasData && (
          <span className="text-xs text-muted-foreground hidden sm:block">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
        <CSVUpload onUploadSuccess={onUploadSuccess} compact />
        {hasData && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <RefreshCw
              className={cn("w-4 h-4", isLoading && "animate-spin")}
            />
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        )}
      </div>
    </header>
  );
}
