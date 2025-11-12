/**
 * File Upload Zone Component
 * Drag-and-drop zone with file picker and validation feedback
 */

import { useCallback, useState } from "react";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ACCEPTED_MIME_TYPES,
  ACCEPTED_FILE_EXTENSIONS,
  MAX_DOCUMENT_SIZE,
} from "../types/constants";

export interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  disabled?: boolean;
  maxFiles?: number;
  className?: string;
}

export function FileUploadZone({
  onFilesSelected,
  disabled = false,
  maxFiles = 10,
  className,
}: FileUploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles file selection from input or drop
   */
  const handleFiles = useCallback(
    (files: FileList | null) => {
      setError(null);

      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);

      // Check max files
      if (fileArray.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed at once`);
        return;
      }

      onFilesSelected(fileArray);
    },
    [maxFiles, onFilesSelected]
  );

  /**
   * Drag handlers
   */
  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragActive(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      handleFiles(files);
    },
    [disabled, handleFiles]
  );

  /**
   * File input change handler
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Reset input value so same file can be selected again
      e.target.value = "";
    },
    [handleFiles]
  );

  /**
   * Formats accepted file types for display
   */
  const getAcceptedTypesText = (): string => {
    return ACCEPTED_FILE_EXTENSIONS.join(", ");
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 transition-all lg:py-16",
          isDragActive &&
            !disabled &&
            "border-blue-500 bg-blue-50 scale-[1.02]",
          !isDragActive &&
            !disabled &&
            "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50",
          disabled && "cursor-not-allowed bg-slate-100 opacity-50"
        )}
      >
        {/* Hidden file input */}
        <input
          type="file"
          multiple
          accept={ACCEPTED_MIME_TYPES.join(",")}
          onChange={handleInputChange}
          disabled={disabled}
          className="sr-only"
          id="file-upload"
        />

        {/* Icon */}
        <div
          className={cn(
            "mb-4 flex h-16 w-16 items-center justify-center rounded-full transition-all lg:h-20 lg:w-20",
            isDragActive ? "bg-blue-100 animate-pulse" : "bg-slate-100"
          )}
        >
          {isDragActive ? (
            <Upload className="h-8 w-8 text-blue-600 lg:h-10 lg:w-10" />
          ) : (
            <Upload className="h-8 w-8 text-slate-400 lg:h-10 lg:w-10" />
          )}
        </div>

        {/* Text */}
        <div className="space-y-3 text-center">
          <h3 className="text-base font-bold text-slate-900 lg:text-lg">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </h3>
          <p className="text-sm text-slate-600">or</p>
          <Button
            type="button"
            variant="outline"
            size="default"
            disabled={disabled}
            onClick={() => document.getElementById("file-upload")?.click()}
            className="h-11 rounded-xl border-2 border-slate-200 bg-white font-semibold transition-all hover:border-slate-300 hover:shadow-md active:scale-95"
          >
            <FileText className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>

        {/* Info text */}
        <div className="mt-6 space-y-1 text-center">
          <p className="text-xs font-medium text-slate-600 lg:text-sm">
            Supported: {getAcceptedTypesText()}
          </p>
          <p className="text-xs text-slate-500">
            Max {MAX_DOCUMENT_SIZE / (1024 * 1024)}MB per file
            {maxFiles > 1 && ` • Up to ${maxFiles} files at once`}
          </p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border-2 border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
