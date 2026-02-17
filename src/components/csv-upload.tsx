"use client";

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface CSVUploadProps {
  onUploadSuccess: () => void;
  compact?: boolean;
}

export function CSVUpload({ onUploadSuccess, compact = false }: CSVUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".csv")) {
        setUploadResult({
          success: false,
          message: "Please select a CSV file",
        });
        return;
      }

      setIsUploading(true);
      setUploadResult(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed");
        }

        setUploadResult({
          success: true,
          message: `Uploaded ${data.filename} (${data.rows} rows)`,
        });

        // Small delay to ensure blob is readable before refetching
        await new Promise((resolve) => setTimeout(resolve, 1500));
        onUploadSuccess();

        setTimeout(() => {
          setUploadResult(null);
        }, 3000);
      } catch (error) {
        setUploadResult({
          success: false,
          message:
            error instanceof Error ? error.message : "Upload failed",
        });
      } finally {
        setIsUploading(false);
      }
    },
    [onUploadSuccess]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleUpload(file);
    },
    [handleUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [handleUpload]
  );

  if (compact) {
    return (
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            "border border-border bg-card text-card-foreground hover:bg-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            uploadResult?.success === true && "border-success text-success",
            uploadResult?.success === false && "border-destructive text-destructive"
          )}
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : uploadResult?.success === true ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : uploadResult?.success === false ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {isUploading
            ? "Uploading..."
            : uploadResult?.success === true
              ? "Done!"
              : uploadResult?.success === false
                ? "Failed"
                : "Upload CSV"}
        </button>
        {uploadResult && !uploadResult.success && (
          <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-card border border-destructive rounded-lg shadow-lg text-xs text-destructive z-50">
            {uploadResult.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-8">
      <div className="max-w-lg mx-auto text-center">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10">
            <FileSpreadsheet className="w-7 h-7 text-primary" />
          </div>
        </div>
        <h2 className="text-lg font-semibold text-card-foreground mb-1">
          Upload Tableau Export
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Export your &quot;All Project Activity&quot; data from Tableau as a CSV, then
          drag it here or click to browse.
        </p>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-accent/50",
            isUploading && "pointer-events-none opacity-60"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <span className="text-sm font-medium text-muted-foreground">
                Processing CSV...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Upload
                className={cn(
                  "w-8 h-8 transition-colors",
                  isDragging ? "text-primary" : "text-muted-foreground"
                )}
              />
              <div>
                <span className="text-sm font-medium text-primary">
                  Click to upload
                </span>
                <span className="text-sm text-muted-foreground">
                  {" "}or drag and drop
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                CSV files only
              </span>
            </div>
          )}
        </div>

        {uploadResult && (
          <div
            className={cn(
              "mt-4 flex items-center gap-2 justify-center text-sm font-medium",
              uploadResult.success ? "text-emerald-600" : "text-red-600"
            )}
          >
            {uploadResult.success ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {uploadResult.message}
          </div>
        )}

        <div className="mt-6 p-4 bg-muted/50 rounded-lg text-left">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            How to export from Tableau
          </p>
          <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
            <li>Open the &quot;All Project Activity&quot; dashboard in Tableau</li>
            <li>Click the download icon (top-right toolbar)</li>
            <li>Select &quot;Crosstab&quot; or &quot;Data&quot; export format</li>
            <li>Choose CSV and save the file</li>
            <li>Upload the file here</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
