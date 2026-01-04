/**
 * Material Upload Hook
 * Orchestrates the complete upload process: validation → storage → backend processing
 * Uses Supabase Realtime for status updates (no polling!)
 */

import { useCallback, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMaterialType, validateFiles } from "../utils/fileValidation";
import { uploadFile } from "../services/storageService";
import {
  createMaterial,
  getUserStorageUsage,
} from "../services/materialService";
import { ProcessingStatus } from "../types/material.types";
import { processMaterial } from "@/lib/api/materialProcessing";
import {
  generateUniqueFileName,
  sanitizeFileName,
} from "../services/storageService";
import { ERROR_MESSAGES } from "../types/constants";
import {
  type MaterialStatusUpdate,
  useMaterialRealtime,
} from "./useMaterialRealtime";
import type {
  BatchUploadResult,
  UploadProgress,
  UploadResult,
} from "../types/material.types";

/**
 * Hook for uploading materials with progress tracking
 */
export function useMaterialUpload() {
  const { user } = useAuth();
  const [uploadProgress, setUploadProgress] = useState<
    Map<string, UploadProgress>
  >(new Map());
  const [isUploading, setIsUploading] = useState(false);

  /**
   * Handle material status updates from Realtime subscription
   */
  const handleStatusUpdate = useCallback((update: MaterialStatusUpdate) => {
    console.log("📨 Material status update received:", update);

    setUploadProgress((prev) => {
      const newMap = new Map(prev);

      // Find the upload progress entry by materialId
      for (const [fileId, progressItem] of newMap.entries()) {
        if (progressItem.materialId === update.materialId) {
          const updatedProgress: UploadProgress = { ...progressItem };

          // Update based on status
          switch (update.status) {
            case ProcessingStatus.PROCESSING:
              updatedProgress.status = "processing";
              updatedProgress.progress = 90;
              break;

            case ProcessingStatus.READY:
              updatedProgress.status = "complete";
              updatedProgress.progress = 100;
              updatedProgress.error = undefined;
              break;

            case ProcessingStatus.FAILED:
              updatedProgress.status = "failed";
              updatedProgress.progress = 100;
              updatedProgress.error =
                update.errorMessage || "Processing failed";
              break;

            default:
              break;
          }

          newMap.set(fileId, updatedProgress);
          console.log(`✅ Updated progress for ${fileId}:`, updatedProgress);
          break;
        }
      }

      return newMap;
    });
  }, []);

  // Subscribe to material status changes via Realtime
  useMaterialRealtime(handleStatusUpdate);

  /**
   * Updates progress for a specific file
   */
  const updateProgress = useCallback(
    (fileId: string, updates: Partial<UploadProgress>) => {
      setUploadProgress((prev) => {
        const newMap = new Map(prev);
        const current = newMap.get(fileId);
        if (current) {
          newMap.set(fileId, { ...current, ...updates });
        }
        return newMap;
      });
    },
    []
  );

  /**
   * Uploads a single file and initiates Edge Function processing
   * Realtime subscriptions will handle status updates automatically
   */
  const uploadSingleFile = useCallback(
    async (file: File, subjectId: string): Promise<UploadResult> => {
      if (!user?.id) {
        return {
          success: false,
          fileName: file.name,
          error: "User not authenticated",
        };
      }

      const fileId = `${Date.now()}-${file.name}`;

      try {
        // Validate file
        const materialType = getMaterialType(file);
        if (!materialType) {
          return {
            success: false,
            fileName: file.name,
            error: ERROR_MESSAGES.UNSUPPORTED_TYPE(file.name),
          };
        }

        // Initialize progress
        const progressData: UploadProgress = {
          fileId,
          fileName: file.name,
          status: "uploading",
          progress: 0,
        };
        setUploadProgress((prev) => new Map(prev).set(fileId, progressData));

        // Sanitize and make unique filename
        const sanitized = sanitizeFileName(file.name);
        const uniqueFileName = generateUniqueFileName(sanitized);

        // Upload to storage (30-80% progress)
        updateProgress(fileId, { status: "uploading", progress: 30 });
        const uploadResult = await uploadFile({
          userId: user.id,
          subjectId,
          file: new File([file], uniqueFileName, { type: file.type }),
          onProgress: (progress) =>
            updateProgress(fileId, { progress: 30 + progress * 0.5 }), // 30-80%
        });

        if (!uploadResult.success || !uploadResult.storagePath) {
          updateProgress(fileId, {
            status: "failed",
            error: uploadResult.error?.message,
          });
          return {
            success: false,
            fileName: file.name,
            error: uploadResult.error?.message || "Upload failed",
          };
        }

        // Create database record with PROCESSING status (80-90% progress)
        updateProgress(fileId, { status: "uploading", progress: 80 });
        const material = await createMaterial({
          subject_id: subjectId,
          user_id: user.id,
          file_name: uniqueFileName,
          file_type: materialType,
          file_size: file.size,
          storage_path: uploadResult.storagePath,
          processing_status: ProcessingStatus.PROCESSING,
          text_content: null,
        });

        if (!material) {
          updateProgress(fileId, {
            status: "failed",
            error: "Failed to create material record",
          });
          return {
            success: false,
            fileName: file.name,
            error: "Failed to save material",
          };
        }

        updateProgress(fileId, {
          status: "uploading",
          progress: 90,
          materialId: material.id,
        });

        // Call backend API to process material (async - don't block)
        // Realtime subscription will notify us of status changes
        processMaterial(material.id, uploadResult.storagePath).catch(
          (error) => {
            console.error("Failed to call backend API:", error);
            // Update progress to show error
            updateProgress(fileId, {
              status: "failed",
              error:
                error instanceof Error ? error.message : "Processing failed",
            });
          }
        );

        // Upload complete - mark as 100% (processing will be tracked via Realtime)
        updateProgress(fileId, {
          status: "complete",
          progress: 100,
          materialId: material.id,
        });

        return {
          success: true,
          fileName: file.name,
          materialId: material.id,
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        updateProgress(fileId, { status: "failed", error: errorMessage });
        return {
          success: false,
          fileName: file.name,
          error: errorMessage,
        };
      }
    },
    [user?.id, updateProgress]
  );

  /**
   * Uploads multiple files
   */
  const uploadFiles = useCallback(
    async (files: File[], subjectId: string): Promise<BatchUploadResult> => {
      if (!user?.id) {
        return {
          successful: [],
          failed: [],
          totalFiles: 0,
          successCount: 0,
          failureCount: 0,
        };
      }

      setIsUploading(true);
      setUploadProgress(new Map());

      try {
        // Get current storage usage
        const storageUsage = await getUserStorageUsage(user.id);

        // Validate all files
        const validation = validateFiles(
          files,
          storageUsage.used,
          storageUsage.limit
        );

        // Handle batch errors
        if (validation.batchErrors.length > 0) {
          setIsUploading(false);
          return {
            successful: [],
            failed: files.map((file) => ({
              success: false,
              fileName: file.name,
              error: validation.batchErrors[0].message,
            })),
            totalFiles: files.length,
            successCount: 0,
            failureCount: files.length,
          };
        }

        // Upload valid files (sequentially to avoid overwhelming the system)
        const results: UploadResult[] = [];

        for (const { file } of validation.validFiles) {
          const result = await uploadSingleFile(file, subjectId);
          results.push(result);
        }

        // Add invalid files to results
        for (const { file, error } of validation.invalidFiles) {
          results.push({
            success: false,
            fileName: file.name,
            error: error.message,
          });
        }

        // Separate successful and failed
        const successful = results.filter((r) => r.success);
        const failed = results.filter((r) => !r.success);

        return {
          successful,
          failed,
          totalFiles: results.length,
          successCount: successful.length,
          failureCount: failed.length,
        };
      } finally {
        setIsUploading(false);
      }
    },
    [user?.id, uploadSingleFile]
  );

  /**
   * Clears upload progress
   */
  const clearProgress = useCallback(() => {
    setUploadProgress(new Map());
  }, []);

  /**
   * Retries a failed upload
   */
  const retryUpload = useCallback(
    async (file: File, subjectId: string): Promise<UploadResult> => {
      return uploadSingleFile(file, subjectId);
    },
    [uploadSingleFile]
  );

  return {
    uploadFiles,
    uploadSingleFile,
    retryUpload,
    clearProgress,
    uploadProgress: Array.from(uploadProgress.values()),
    isUploading,
  };
}
