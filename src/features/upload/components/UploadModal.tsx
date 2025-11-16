/**
 * Upload Modal
 * Modal for uploading materials with drag-and-drop and staging area
 */

import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploadZone } from "./FileUploadZone";
import { FileStagingArea } from "./FileStagingArea";
import { UploadProgressList } from "./UploadProgressList";
import { useMaterialUpload } from "../hooks";
import { useSubjects } from "@/features/subjects/hooks/useSubjects";
import { cn } from "@/lib/utils";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preSelectedSubjectId?: string | null;
  onUploadComplete?: () => void;
}

export function UploadModal({
  open,
  onOpenChange,
  preSelectedSubjectId,
  onUploadComplete,
}: UploadModalProps) {
  // File staging state
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    preSelectedSubjectId || null
  );
  const [showSubjectError, setShowSubjectError] = useState(false);

  // Hooks
  const { uploadFiles, uploadProgress, isUploading } = useMaterialUpload();
  const { data: subjects, isLoading: loadingSubjects } = useSubjects();

  /**
   * Handles file selection
   */
  const handleFilesSelected = (files: File[]) => {
    setStagedFiles((prev) => [...prev, ...files]);
    setShowSubjectError(false);
  };

  /**
   * Removes a file from staging
   */
  const handleRemoveFile = (index: number) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Clears all staged files
   */
  const handleClearAll = () => {
    setStagedFiles([]);
  };

  /**
   * Handles subject selection change
   */
  const handleSubjectChange = (value: string) => {
    setSelectedSubjectId(value);
    setShowSubjectError(false);
  };

  /**
   * Uploads staged files
   */
  const handleUpload = async () => {
    if (stagedFiles.length === 0) return;

    // If no subject selected, show error
    if (!selectedSubjectId) {
      setShowSubjectError(true);
      toast.error("Select a subject", {
        description: "Please select a subject to upload materials to",
      });
      return;
    }

    const result = await uploadFiles(stagedFiles, selectedSubjectId);

    if (result.successCount > 0) {
      setStagedFiles([]);
      toast.success("Material uploaded! 🎃", {
        description: `${result.successCount} ${
          result.successCount === 1 ? "file" : "files"
        } uploaded successfully`,
      });

      // Call completion callback and close modal after short delay
      if (onUploadComplete) {
        onUploadComplete();
      }

      // Close modal after uploads complete
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);
    }

    if (result.failureCount > 0) {
      toast.error("Upload failed", {
        description: `${result.failureCount} ${
          result.failureCount === 1 ? "file" : "files"
        } failed to upload`,
      });
    }
  };

  /**
   * Handles modal close
   */
  const handleClose = () => {
    if (isUploading) {
      toast.error("Upload in progress", {
        description: "Please wait for uploads to complete",
      });
      return;
    }

    setStagedFiles([]);
    setShowSubjectError(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto lg:max-w-4xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900 lg:text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600">
              <Upload className="h-5 w-5 text-white" />
            </div>
            Upload Materials
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 lg:text-base">
            Upload PDFs, images, Word documents, PowerPoint presentations, or
            text files
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Subject Selector */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-900">
              Subject <span className="text-red-600">*</span>
            </label>
            <Select
              value={selectedSubjectId || ""}
              onValueChange={handleSubjectChange}
              disabled={loadingSubjects || isUploading}
            >
              <SelectTrigger
                className={cn(
                  "h-12 w-full rounded-xl border-2 bg-white font-semibold transition-all",
                  showSubjectError && !selectedSubjectId
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-slate-200 hover:border-slate-300"
                )}
              >
                <SelectValue placeholder="Select a subject..." />
              </SelectTrigger>
              <SelectContent>
                {subjects?.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
                {subjects?.length === 0 && (
                  <div className="px-2 py-1.5 text-sm text-slate-500">
                    No subjects available
                  </div>
                )}
              </SelectContent>
            </Select>
            {showSubjectError && !selectedSubjectId && (
              <p className="mt-2 text-xs font-medium text-red-600">
                Please select a subject before uploading
              </p>
            )}
          </div>

          {/* Upload Zone */}
          <FileUploadZone
            onFilesSelected={handleFilesSelected}
            disabled={isUploading}
          />

          {/* Staging Area */}
          {stagedFiles.length > 0 && (
            <FileStagingArea
              files={stagedFiles}
              onRemoveFile={handleRemoveFile}
              onClearAll={handleClearAll}
            />
          )}

          {/* Upload Progress */}
          {uploadProgress.length > 0 && (
            <UploadProgressList uploads={uploadProgress} />
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t-2 border-slate-200 pt-5">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isUploading}
              className="h-11 rounded-xl border-2 border-slate-200 font-semibold hover:border-slate-300"
            >
              {isUploading ? "Uploading..." : "Cancel"}
            </Button>
            <Button
              onClick={handleUpload}
              disabled={isUploading || stagedFiles.length === 0}
              className="h-11 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 font-semibold shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload {stagedFiles.length}{" "}
                  {stagedFiles.length === 1 ? "File" : "Files"}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
