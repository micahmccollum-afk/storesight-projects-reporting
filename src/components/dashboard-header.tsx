"use client";

import Image from "next/image";
import { RefreshCw } from "lucide-react";
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
      <div className="flex items-center gap-4">
        <Image
          src="/storesight-logo.png"
          alt="Storesight"
          width={180}
          height={40}
          priority
          className="h-9 w-auto"
        />
        <div className="hidden sm:block h-8 w-px bg-border" />
        <p className="hidden sm:block text-sm font-medium text-muted-foreground">
          Revenue & Product Report
        </p>
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
