"use client";

import { FileSpreadsheet } from "lucide-react";

interface ConnectionBannerProps {
  noData: boolean;
}

export function ConnectionBanner({ noData }: ConnectionBannerProps) {
  if (!noData) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <FileSpreadsheet className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 text-sm">
            No Data Loaded
          </h3>
          <p className="text-blue-700 text-sm mt-1">
            Upload a CSV export from your Tableau &quot;All Project Activity&quot;
            dashboard to populate the dashboard. Use the{" "}
            <span className="font-medium">Upload CSV</span> button above or
            drag and drop the file into the upload area below.
          </p>
        </div>
      </div>
    </div>
  );
}
