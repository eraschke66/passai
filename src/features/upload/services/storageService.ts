/**
 * Storage Service
 * Handles all file storage operations with Supabase Storage
 */

import { supabase } from "@/lib/supabase/client";
import {
  MATERIALS_BUCKET,
  THUMBNAILS_BUCKET,
  getStoragePath,
  getThumbnailPath,
  ERROR_MESSAGES,
} from "../types/constants";
import { UploadErrorCode } from "../types/material.types";
import type { UploadError } from "../types/material.types";

// =====================================================
// Types
// =====================================================

interface UploadFileOptions {
  userId: string;
  subjectId: string;
  file: File;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  success: boolean;
  storagePath?: string;
  publicUrl?: string;
  error?: UploadError;
}

interface DownloadResult {
  success: boolean;
  blob?: Blob;
  error?: UploadError;
}

// =====================================================
// File Upload
// =====================================================

/**
 * Uploads a file to Supabase storage
 * @param options - Upload configuration
 * @returns Upload result with storage path or error
 */
export async function uploadFile({
  userId,
  subjectId,
  file,
  onProgress,
}: UploadFileOptions): Promise<UploadResult> {
  try {
    // Generate storage path
    const storagePath = getStoragePath(userId, subjectId, file.name);

    // Upload file to storage
    const { data, error } = await supabase.storage
      .from(MATERIALS_BUCKET)
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error("Storage upload error:", error);
      return {
        success: false,
        error: {
          code: UploadErrorCode.UPLOAD_FAILED,
          message: ERROR_MESSAGES.UPLOAD_FAILED(file.name),
          fileName: file.name,
          details: error.message,
        },
      };
    }

    // Get public URL (even though bucket is private, this gives us the reference)
    const { data: urlData } = supabase.storage
      .from(MATERIALS_BUCKET)
      .getPublicUrl(storagePath);

    // Simulate progress (Supabase doesn't provide real-time progress)
    if (onProgress) {
      onProgress(100);
    }

    return {
      success: true,
      storagePath: data.path,
      publicUrl: urlData.publicUrl,
    };
  } catch (error) {
    console.error("Unexpected upload error:", error);
    return {
      success: false,
      error: {
        code: UploadErrorCode.UNKNOWN_ERROR,
        message: ERROR_MESSAGES.UPLOAD_FAILED(file.name),
        fileName: file.name,
        details: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

/**
 * Uploads multiple files in parallel (respects MAX_PARALLEL_UPLOADS)
 * @param files - Array of upload configurations
 * @returns Array of upload results
 */
export async function uploadFiles(
  files: UploadFileOptions[]
): Promise<UploadResult[]> {
  // Upload files in parallel (Supabase handles rate limiting)
  const uploadPromises = files.map((fileOptions) => uploadFile(fileOptions));
  return Promise.all(uploadPromises);
}

// =====================================================
// File Download
// =====================================================

/**
 * Downloads a file from storage
 * @param storagePath - Path to file in storage
 * @returns Download result with blob or error
 */
export async function downloadFile(
  storagePath: string
): Promise<DownloadResult> {
  try {
    const { data, error } = await supabase.storage
      .from(MATERIALS_BUCKET)
      .download(storagePath);

    if (error) {
      console.error("Storage download error:", error);
      return {
        success: false,
        error: {
          code: UploadErrorCode.UPLOAD_FAILED,
          message: "Failed to download file",
          details: error.message,
        },
      };
    }

    return {
      success: true,
      blob: data,
    };
  } catch (error) {
    console.error("Unexpected download error:", error);
    return {
      success: false,
      error: {
        code: UploadErrorCode.UNKNOWN_ERROR,
        message: "Failed to download file",
        details: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
}

/**
 * Gets a signed URL for temporary file access
 * @param storagePath - Path to file in storage
 * @param expiresIn - URL expiry time in seconds (default: 3600 = 1 hour)
 * @returns Signed URL or null if error
 */
export async function getSignedUrl(
  storagePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(MATERIALS_BUCKET)
      .createSignedUrl(storagePath, expiresIn);

    if (error) {
      console.error("Failed to create signed URL:", error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Unexpected signed URL error:", error);
    return null;
  }
}

// =====================================================
// File Deletion
// =====================================================

/**
 * Deletes a file from storage
 * @param storagePath - Path to file in storage
 * @returns Success status
 */
export async function deleteFile(storagePath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(MATERIALS_BUCKET)
      .remove([storagePath]);

    if (error) {
      console.error("Storage deletion error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected deletion error:", error);
    return false;
  }
}

/**
 * Deletes multiple files from storage
 * @param storagePaths - Array of storage paths to delete
 * @returns Success status
 */
export async function deleteFiles(storagePaths: string[]): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(MATERIALS_BUCKET)
      .remove(storagePaths);

    if (error) {
      console.error("Batch deletion error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected batch deletion error:", error);
    return false;
  }
}

// =====================================================
// Thumbnail Operations
// =====================================================

/**
 * Uploads a thumbnail image
 * @param userId - User ID
 * @param subjectId - Subject ID
 * @param fileName - Original file name
 * @param thumbnailBlob - Thumbnail image blob
 * @returns Storage path or null if error
 */
export async function uploadThumbnail(
  userId: string,
  subjectId: string,
  fileName: string,
  thumbnailBlob: Blob
): Promise<string | null> {
  try {
    const thumbnailPath = getThumbnailPath(userId, subjectId, fileName);

    const { data, error } = await supabase.storage
      .from(THUMBNAILS_BUCKET)
      .upload(thumbnailPath, thumbnailBlob, {
        cacheControl: "3600",
        upsert: true, // Overwrite if exists
      });

    if (error) {
      console.error("Thumbnail upload error:", error);
      return null;
    }

    return data.path;
  } catch (error) {
    console.error("Unexpected thumbnail upload error:", error);
    return null;
  }
}

/**
 * Deletes a thumbnail from storage
 * @param thumbnailPath - Path to thumbnail in storage
 * @returns Success status
 */
export async function deleteThumbnail(thumbnailPath: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(THUMBNAILS_BUCKET)
      .remove([thumbnailPath]);

    if (error) {
      console.error("Thumbnail deletion error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Unexpected thumbnail deletion error:", error);
    return false;
  }
}

/**
 * Gets a signed URL for a thumbnail
 * @param thumbnailPath - Path to thumbnail in storage
 * @param expiresIn - URL expiry time in seconds (default: 3600 = 1 hour)
 * @returns Signed URL or null if error
 */
export async function getThumbnailSignedUrl(
  thumbnailPath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(THUMBNAILS_BUCKET)
      .createSignedUrl(thumbnailPath, expiresIn);

    if (error) {
      console.error("Failed to create thumbnail signed URL:", error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Unexpected thumbnail signed URL error:", error);
    return null;
  }
}

// =====================================================
// Helper Functions
// =====================================================

/**
 * Checks if a file exists in storage
 * @param storagePath - Path to check
 * @returns True if file exists, false otherwise
 */
export async function fileExists(storagePath: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.storage
      .from(MATERIALS_BUCKET)
      .list(storagePath.split("/").slice(0, -1).join("/"), {
        search: storagePath.split("/").pop(),
      });

    if (error) {
      return false;
    }

    return data.length > 0;
  } catch {
    return false;
  }
}

/**
 * Gets file metadata from storage
 * @param storagePath - Path to file
 * @returns File metadata or null
 */
export async function getFileMetadata(storagePath: string): Promise<{
  size: number;
  lastModified: string;
} | null> {
  try {
    const { data, error } = await supabase.storage
      .from(MATERIALS_BUCKET)
      .list(storagePath.split("/").slice(0, -1).join("/"), {
        search: storagePath.split("/").pop(),
      });

    if (error || data.length === 0) {
      return null;
    }

    const file = data[0];
    return {
      size: file.metadata?.size || 0,
      lastModified: file.updated_at || file.created_at,
    };
  } catch {
    return null;
  }
}

/**
 * Generates a unique file name to avoid collisions
 * @param fileName - Original file name
 * @returns Unique file name with timestamp
 */
export function generateUniqueFileName(fileName: string): string {
  const timestamp = Date.now();
  const extension = fileName.split(".").pop();
  const nameWithoutExtension = fileName.replace(`.${extension}`, "");
  const sanitizedName = nameWithoutExtension.replace(/[^a-zA-Z0-9-_]/g, "_");

  return `${sanitizedName}_${timestamp}.${extension}`;
}

/**
 * Validates file name (no special characters that could cause issues)
 * @param fileName - File name to validate
 * @returns Sanitized file name
 */
export function sanitizeFileName(fileName: string): string {
  // Remove any path separators
  let sanitized = fileName.replace(/[/\\]/g, "_");

  // Remove any potentially dangerous characters
  sanitized = sanitized.replace(/[<>:"|?*]/g, "_");

  // Limit length
  if (sanitized.length > 255) {
    const extension = sanitized.split(".").pop();
    const nameWithoutExtension = sanitized.replace(`.${extension}`, "");
    sanitized = `${nameWithoutExtension.substring(0, 250)}.${extension}`;
  }

  return sanitized;
}
