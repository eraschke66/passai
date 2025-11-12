/**
 * Upload Progress List Component
 * Displays real-time progress for file uploads
 */

import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { UploadProgress } from "../types/material.types";

export interface UploadProgressListProps {
  uploads: UploadProgress[];
  className?: string;
}

/**
 * Gets status icon for upload
 */
function getStatusIcon(status: UploadProgress["status"]) {
  switch (status) {
    case "uploading":
    case "processing":
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    case "complete":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-destructive" />;
    default:
      return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
  }
}

/**
 * Gets status text for upload
 */
function getStatusText(upload: UploadProgress): string {
  switch (upload.status) {
    case "uploading":
      return "Uploading...";
    case "processing":
      return "Processing...";
    case "complete":
      return "Complete";
    case "failed":
      return upload.error || "Failed";
    default:
      return "Pending";
  }
}

/**
 * Gets status color class
 */
function getStatusColorClass(status: UploadProgress["status"]): string {
  switch (status) {
    case "uploading":
    case "processing":
      return "text-primary";
    case "complete":
      return "text-green-600";
    case "failed":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

export function UploadProgressList({
  uploads,
  className,
}: UploadProgressListProps) {
  if (uploads.length === 0) {
    return null;
  }

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Upload Progress</h3>
        <span className="text-xs text-muted-foreground">
          {uploads.filter((u) => u.status === "complete").length} of{" "}
          {uploads.length} complete
        </span>
      </div>

      {/* Progress list */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {uploads.map((upload) => (
          <div
            key={upload.fileId}
            className={cn(
              "p-3 rounded-lg border bg-card transition-colors",
              upload.status === "failed" &&
                "border-destructive bg-destructive/5"
            )}
          >
            {/* File name and status */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="shrink-0">{getStatusIcon(upload.status)}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {upload.fileName}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      getStatusColorClass(upload.status)
                    )}
                  >
                    {getStatusText(upload)}
                  </p>
                </div>
              </div>

              {/* Progress percentage */}
              {upload.status !== "failed" && (
                <span className="text-xs font-medium text-muted-foreground shrink-0">
                  {Math.round(upload.progress)}%
                </span>
              )}
            </div>

            {/* Progress bar */}
            {upload.status !== "failed" && upload.status !== "complete" && (
              <Progress value={upload.progress} className="h-1.5" />
            )}

            {/* Error message */}
            {upload.status === "failed" && upload.error && (
              <div className="mt-2 text-xs text-destructive">
                {upload.error}
              </div>
            )}

            {/* Material ID for completed uploads */}
            {upload.status === "complete" && upload.materialId && (
              <div className="mt-2">
                <Progress value={100} className="h-1.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
