/**
 * File Staging Area Component
 * Displays selected files with validation status before upload
 */

import {
  X,
  FileText,
  Image,
  FileType,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { validateFile, getMaterialType } from "../utils/fileValidation";
import { MaterialType } from "../types/material.types";

export interface StagedFile {
  file: File;
  id: string;
  isValid: boolean;
  error?: string;
}

export interface FileStagingAreaProps {
  files: File[];
  onRemoveFile: (index: number) => void;
  onClearAll: () => void;
  className?: string;
}

/**
 * Gets icon for material type
 */
function getMaterialIcon(type: MaterialType | null) {
  switch (type) {
    case "image":
      return Image;
    case "pdf":
    case "docx":
    case "pptx":
      return FileType;
    case "text":
      return FileText;
    default:
      return FileText;
  }
}

/**
 * Formats file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function FileStagingArea({
  files,
  onRemoveFile,
  onClearAll,
  className,
}: FileStagingAreaProps) {
  if (files.length === 0) {
    return null;
  }

  // Validate each file
  const stagedFiles: StagedFile[] = files.map((file, index) => {
    const validation = validateFile(file);
    return {
      file,
      id: `${index}-${file.name}`,
      isValid: validation.valid,
      error: validation.error?.message,
    };
  });

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const validCount = stagedFiles.filter((f) => f.isValid).length;
  const invalidCount = stagedFiles.length - validCount;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium">
            Selected Files ({stagedFiles.length})
          </h3>
          {invalidCount > 0 && (
            <span className="text-xs text-destructive">
              {invalidCount} invalid
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Total: {formatFileSize(totalSize)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 text-xs"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* File list */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {stagedFiles.map((stagedFile, index) => {
          const materialType = getMaterialType(stagedFile.file);
          const Icon = getMaterialIcon(materialType);

          return (
            <div
              key={stagedFile.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border bg-card",
                "transition-colors",
                !stagedFile.isValid && "border-destructive bg-destructive/5"
              )}
            >
              {/* Icon */}
              <div
                className={cn(
                  "shrink-0 w-10 h-10 rounded-md flex items-center justify-center",
                  stagedFile.isValid ? "bg-primary/10" : "bg-destructive/10"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5",
                    stagedFile.isValid ? "text-primary" : "text-destructive"
                  )}
                />
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {stagedFile.file.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(stagedFile.file.size)}
                  </span>
                  {materialType && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground uppercase">
                        {materialType}
                      </span>
                    </>
                  )}
                </div>

                {/* Validation status */}
                <div className="mt-2 flex items-center gap-1.5">
                  {stagedFile.isValid ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                      <span className="text-xs text-green-600">
                        Ready to upload
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-xs text-destructive">
                        {stagedFile.error}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Remove button */}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                className="shrink-0 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove {stagedFile.file.name}</span>
              </Button>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      {validCount > 0 && (
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            {validCount} {validCount === 1 ? "file" : "files"} ready to upload
          </p>
        </div>
      )}
    </div>
  );
}
