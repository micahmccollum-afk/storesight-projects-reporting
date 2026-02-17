"use client";

import Image from "next/image";
import { RefreshCw, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { CSVUpload } from "./csv-upload";
import { useTheme } from "./theme-provider";

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
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src="/storesight-logo.png"
          alt="Storesight"
          width={180}
          height={40}
          priority
          className={cn("h-9 w-auto", theme === "dark" && "brightness-0 invert")}
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
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-card text-card-foreground hover:bg-accent transition-colors"
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4" />
          ) : (
            <Sun className="w-4 h-4" />
          )}
        </button>
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
