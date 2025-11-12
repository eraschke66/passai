/**
 * Material Detail Modal Component
 * Displays detailed information about a material with download action
 */

import { useState } from "react";
import {
  Download,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Book,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import type { StudyMaterial, ProcessingStatus } from "../types/material.types";

export interface MaterialDetailModalProps {
  material: StudyMaterial | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (material: StudyMaterial) => void;
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

/**
 * Formats date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Gets status badge info
 */
function getStatusBadge(status: ProcessingStatus) {
  switch (status) {
    case "pending":
      return {
        text: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertCircle,
      };
    case "processing":
      return {
        text: "Processing",
        color: "bg-blue-100 text-blue-800",
        icon: AlertCircle,
      };
    case "ready":
      return {
        text: "Ready",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle2,
      };
    case "failed":
      return {
        text: "Failed",
        color: "bg-red-100 text-red-800",
        icon: AlertCircle,
      };
    default:
      return {
        text: status,
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
      };
  }
}

export function MaterialDetailModal({
  material,
  open,
  onOpenChange,
  onDownload,
}: MaterialDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const { data: subjects } = useSubjects();

  if (!material) return null;

  const statusBadge = getStatusBadge(material.processing_status);
  const StatusIcon = statusBadge.icon;

  // Get subject name from subject_id
  const subject = subjects?.find((s) => s.id === material.subject_id);
  const subjectName = subject?.name || "Unknown Subject";

  const handleCopyText = async () => {
    if (material.text_content) {
      try {
        await navigator.clipboard.writeText(material.text_content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col overflow-hidden">
        <DialogHeader className="shrink-0 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <DialogTitle className="wrap-break-word text-xl font-bold text-slate-900 lg:text-2xl">
                {material.file_name}
              </DialogTitle>
              <DialogDescription className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                  <Book className="h-3.5 w-3.5" />
                  {subjectName}
                </span>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-700">
                  {material.file_type}
                </span>
                <span className="text-sm text-slate-600">
                  {formatFileSize(material.file_size)}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-sm text-slate-600">
                  {formatDate(material.created_at)}
                </span>
              </DialogDescription>
            </div>
            {onDownload && (
              <Button
                variant="outline"
                size="default"
                onClick={() => onDownload(material)}
                className="shrink-0 rounded-xl border-2 border-slate-200 font-semibold hover:border-slate-300"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="space-y-6 pr-2">
            {/* Status section */}
            {material.processing_status !== "ready" && (
              <>
                <div className="rounded-xl border-2 border-slate-200 bg-white p-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-900">
                    Status
                  </h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold",
                        statusBadge.color
                      )}
                    >
                      <StatusIcon className="h-4 w-4" />
                      {statusBadge.text}
                    </span>
                  </div>
                  {material.processing_status === "failed" &&
                    material.error_message && (
                      <div className="mt-3 rounded-lg border-2 border-red-200 bg-red-50 p-3">
                        <p className="text-sm font-medium text-red-800">
                          {material.error_message}
                        </p>
                      </div>
                    )}
                </div>
              </>
            )}

            {/* Text content section */}
            {material.processing_status === "ready" &&
              material.text_content && (
                <div className="rounded-xl border-2 border-slate-200 bg-white">
                  <div className="flex items-center justify-between border-b-2 border-slate-200 px-4 py-3 lg:px-5 lg:py-4">
                    <h3 className="text-sm font-semibold text-slate-900 lg:text-base">
                      Extracted Text
                    </h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyText}
                      className="rounded-lg border-2 border-slate-200 font-semibold transition-all hover:border-slate-300"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-green-600" />
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Text
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-4 lg:p-6">
                    <p className="wrap-break-word whitespace-pre-wrap text-sm leading-relaxed text-slate-700 lg:text-base lg:leading-loose">
                      {material.text_content}
                    </p>
                  </div>
                </div>
              )}

            {/* No text available message */}
            {material.processing_status === "ready" &&
              !material.text_content && (
                <div className="rounded-xl border-2 border-slate-200 bg-white py-12 text-center">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <FileText className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    No text content extracted from this file
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    This file type may not support text extraction
                  </p>
                </div>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
