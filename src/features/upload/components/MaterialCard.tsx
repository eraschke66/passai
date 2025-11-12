/**
 * Material Card Component
 * Displays an individual material with actions (view, download, delete)
 */

import { useState } from "react";
import {
  FileText,
  Image,
  FileType,
  Trash2,
  Eye,
  AlertCircle,
  Loader2,
  MoreVertical,
  Book,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import type {
  StudyMaterial,
  MaterialType,
  ProcessingStatus,
} from "../types/material.types";

export interface MaterialCardProps {
  material: StudyMaterial;
  onView?: (material: StudyMaterial) => void;
  onDownload?: (material: StudyMaterial) => void;
  onDelete?: (material: StudyMaterial) => void;
  className?: string;
}

/**
 * Gets icon for material type
 */
function getMaterialIcon(type: MaterialType) {
  switch (type) {
    case "image":
      return Image;
    case "pdf":
      return FileText;
    case "docx":
      return FileType;
    case "pptx":
      return FileType;
    case "text":
      return FileText;
    default:
      return FileText;
  }
}

/**
 * Gets gradient color for material type
 */
function getMaterialGradient(type: MaterialType) {
  switch (type) {
    case "pdf":
      return "from-red-500 to-pink-600";
    case "image":
      return "from-blue-500 to-cyan-600";
    case "docx":
      return "from-green-500 to-emerald-600";
    case "pptx":
      return "from-orange-500 to-amber-600";
    case "text":
      return "from-purple-500 to-indigo-600";
    default:
      return "from-slate-500 to-slate-600";
  }
}

/**
 * Formats relative time
 */
function formatRelativeTime(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

/**
 * Gets status badge info
 */
function getStatusBadge(status: ProcessingStatus) {
  switch (status) {
    case "pending":
      return { text: "Pending", color: "bg-yellow-100 text-yellow-800" };
    case "processing":
      return { text: "Processing", color: "bg-blue-100 text-blue-800" };
    case "ready":
      return { text: "Ready", color: "bg-green-100 text-green-800" };
    case "failed":
      return { text: "Failed", color: "bg-red-100 text-red-800" };
    default:
      return { text: status, color: "bg-gray-100 text-gray-800" };
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

export function MaterialCard({
  material,
  onView,
  onDelete,
  className,
}: MaterialCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: subjects } = useSubjects();
  const Icon = getMaterialIcon(material.file_type);
  const gradientClass = getMaterialGradient(material.file_type);
  const statusBadge = getStatusBadge(material.processing_status);
  const isProcessing = material.processing_status === "processing";
  const isFailed = material.processing_status === "failed";

  // Get subject name from subject_id
  const subject = subjects?.find((s) => s.id === material.subject_id);
  const subjectName = subject?.name || "Unknown";

  const handleDelete = async () => {
    if (onDelete && !isDeleting) {
      setIsDeleting(true);
      try {
        await onDelete(material);
      } catch (error) {
        console.error("Delete failed:", error);
        setIsDeleting(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl border-2 border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-lg lg:rounded-2xl lg:p-5",
        isFailed && "border-red-200 bg-red-50/50",
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        {/* Icon with Gradient */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br shadow-md",
            isFailed ? "from-red-500 to-red-600" : gradientClass
          )}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          ) : (
            <Icon className="h-6 w-6 text-white" />
          )}
        </div>

        {/* File info */}
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate font-bold text-slate-900 transition-colors group-hover:text-blue-600">
            {material.file_name}
          </h3>
          <div className="mb-2 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-linear-to-r from-blue-600 to-indigo-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
              <Book className="h-3 w-3" />
              {subjectName}
            </span>
            <span className="text-xs text-slate-600 uppercase">
              {material.file_type}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>{formatFileSize(material.file_size)}</span>
            <span>•</span>
            <span>{formatRelativeTime(new Date(material.created_at))}</span>
          </div>
        </div>

        {/* Actions dropdown */}
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-slate-100 opacity-0 group-hover:opacity-100"
          onClick={() => {}}
        >
          <MoreVertical className="h-4 w-4 text-slate-600" />
        </button>
      </div>

      {/* Status badge */}
      {material.processing_status !== "ready" && (
        <div className="mb-2 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
              statusBadge.color
            )}
          >
            {statusBadge.text}
          </span>
        </div>
      )}

      {/* Error message */}
      {isFailed && material.error_message && (
        <div className="mt-2 flex items-start gap-2 text-xs text-red-600">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{material.error_message}</span>
        </div>
      )}

      {/* Actions Footer */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-3">
        <div className="flex items-center gap-1 text-xs text-slate-600">
          <span>{formatRelativeTime(new Date(material.created_at))}</span>
        </div>
        <div className="flex items-center gap-1">
          {onView && (
            <button
              onClick={() => onView(material)}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-blue-50"
            >
              <Eye className="h-4 w-4 text-slate-600 hover:text-blue-600" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-red-50 disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
              ) : (
                <Trash2 className="h-4 w-4 text-slate-600 hover:text-red-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
