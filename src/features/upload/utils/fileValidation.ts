/**
 * File Validation Utilities
 * Functions for validating files before upload
 */

import {
  MAX_IMAGE_SIZE,
  MAX_DOCUMENT_SIZE,
  MAX_BATCH_UPLOAD_SIZE,
  MAX_FILES_PER_UPLOAD,
  MIME_TYPE_MAP,
  FILE_EXTENSION_MAP,
  ERROR_MESSAGES,
  FREE_TIER_STORAGE_LIMIT,
} from "../types/constants";
import { MaterialType, UploadErrorCode } from "../types/material.types";
import type {
  FileValidationResult,
  UploadError,
} from "../types/material.types";

// =====================================================
// File Type Detection
// =====================================================

/**
 * Determines the material type from file MIME type and extension
 * @param file - File to check
 * @returns Material type or null if unsupported
 */
export function getMaterialType(file: File): MaterialType | null {
  const mimeType = file.type.toLowerCase();
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

  // Check PDF
  if (
    MIME_TYPE_MAP[MaterialType.PDF].includes(mimeType) ||
    FILE_EXTENSION_MAP[MaterialType.PDF].includes(extension)
  ) {
    return MaterialType.PDF;
  }

  // Check IMAGE
  if (
    MIME_TYPE_MAP[MaterialType.IMAGE].includes(mimeType) ||
    FILE_EXTENSION_MAP[MaterialType.IMAGE].includes(extension)
  ) {
    return MaterialType.IMAGE;
  }

  // Check TEXT
  if (
    MIME_TYPE_MAP[MaterialType.TEXT].includes(mimeType) ||
    FILE_EXTENSION_MAP[MaterialType.TEXT].includes(extension)
  ) {
    return MaterialType.TEXT;
  }

  // Check DOCX
  if (
    MIME_TYPE_MAP[MaterialType.DOCX].includes(mimeType) ||
    FILE_EXTENSION_MAP[MaterialType.DOCX].includes(extension)
  ) {
    return MaterialType.DOCX;
  }

  // Check PPTX
  if (
    MIME_TYPE_MAP[MaterialType.PPTX].includes(mimeType) ||
    FILE_EXTENSION_MAP[MaterialType.PPTX].includes(extension)
  ) {
    return MaterialType.PPTX;
  }

  return null;
}

/**
 * Checks if a file type is supported
 * @param file - File to check
 * @returns True if supported, false otherwise
 */
export function isSupportedFileType(file: File): boolean {
  return getMaterialType(file) !== null;
}

// =====================================================
// File Size Validation
// =====================================================

/**
 * Gets the maximum allowed size for a file based on its type
 * @param materialType - Type of material
 * @returns Maximum size in bytes
 */
export function getMaxFileSize(materialType: MaterialType): number {
  if (materialType === MaterialType.IMAGE) {
    return MAX_IMAGE_SIZE;
  }
  return MAX_DOCUMENT_SIZE;
}

/**
 * Validates file size based on its type
 * @param file - File to validate
 * @param materialType - Type of material
 * @returns Validation result
 */
export function validateFileSize(
  file: File,
  materialType: MaterialType
): FileValidationResult {
  const maxSize = getMaxFileSize(materialType);

  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: {
        code: UploadErrorCode.FILE_TOO_LARGE,
        message: ERROR_MESSAGES.FILE_TOO_LARGE(file.name, `${maxSizeMB}MB`),
        fileName: file.name,
      },
    };
  }

  return { valid: true };
}

/**
 * Validates total size of multiple files
 * @param files - Files to validate
 * @returns Validation result
 */
export function validateBatchSize(files: File[]): FileValidationResult {
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  if (totalSize > MAX_BATCH_UPLOAD_SIZE) {
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    const limitMB = MAX_BATCH_UPLOAD_SIZE / (1024 * 1024);
    return {
      valid: false,
      error: {
        code: UploadErrorCode.FILE_TOO_LARGE,
        message: ERROR_MESSAGES.BATCH_SIZE_EXCEEDED(
          `${totalSizeMB}MB`,
          `${limitMB}MB`
        ),
      },
    };
  }

  return { valid: true };
}

/**
 * Validates storage limit
 * @param currentUsage - Current storage usage in bytes
 * @param filesToUpload - Files to upload
 * @param storageLimit - User's storage limit (default: FREE_TIER_STORAGE_LIMIT)
 * @returns Validation result
 */
export function validateStorageLimit(
  currentUsage: number,
  filesToUpload: File[],
  storageLimit: number = FREE_TIER_STORAGE_LIMIT
): FileValidationResult {
  const uploadSize = filesToUpload.reduce((sum, file) => sum + file.size, 0);
  const totalUsage = currentUsage + uploadSize;

  if (totalUsage > storageLimit) {
    const usedMB = (currentUsage / (1024 * 1024)).toFixed(0);
    const limitMB = (storageLimit / (1024 * 1024)).toFixed(0);
    return {
      valid: false,
      error: {
        code: UploadErrorCode.STORAGE_LIMIT_REACHED,
        message: ERROR_MESSAGES.STORAGE_LIMIT_REACHED(
          `${usedMB}MB`,
          `${limitMB}MB`
        ),
      },
    };
  }

  return { valid: true };
}

// =====================================================
// Batch Validation
// =====================================================

/**
 * Validates number of files in a batch
 * @param files - Files to validate
 * @returns Validation result
 */
export function validateFileCount(files: File[]): FileValidationResult {
  if (files.length > MAX_FILES_PER_UPLOAD) {
    return {
      valid: false,
      error: {
        code: UploadErrorCode.FILE_TOO_LARGE,
        message: ERROR_MESSAGES.TOO_MANY_FILES(
          files.length,
          MAX_FILES_PER_UPLOAD
        ),
      },
    };
  }

  return { valid: true };
}

/**
 * Validates a single file (type and size)
 * @param file - File to validate
 * @returns Validation result with material type if valid
 */
export function validateFile(
  file: File
): FileValidationResult & { materialType?: MaterialType } {
  // Check file type
  const materialType = getMaterialType(file);
  if (!materialType) {
    return {
      valid: false,
      error: {
        code: UploadErrorCode.UNSUPPORTED_TYPE,
        message: ERROR_MESSAGES.UNSUPPORTED_TYPE(file.name),
        fileName: file.name,
      },
    };
  }

  // Check file size
  const sizeValidation = validateFileSize(file, materialType);
  if (!sizeValidation.valid) {
    return sizeValidation;
  }

  return {
    valid: true,
    materialType,
  };
}

/**
 * Validates multiple files before upload
 * @param files - Files to validate
 * @param currentStorageUsage - Current storage usage in bytes
 * @param storageLimit - User's storage limit
 * @returns Object with valid files, invalid files, and errors
 */
export function validateFiles(
  files: File[],
  currentStorageUsage: number = 0,
  storageLimit: number = FREE_TIER_STORAGE_LIMIT
): {
  validFiles: Array<{ file: File; materialType: MaterialType }>;
  invalidFiles: Array<{ file: File; error: UploadError }>;
  batchErrors: UploadError[];
} {
  const validFiles: Array<{ file: File; materialType: MaterialType }> = [];
  const invalidFiles: Array<{ file: File; error: UploadError }> = [];
  const batchErrors: UploadError[] = [];

  // Validate file count
  const countValidation = validateFileCount(files);
  if (!countValidation.valid && countValidation.error) {
    batchErrors.push(countValidation.error);
    return { validFiles: [], invalidFiles: [], batchErrors };
  }

  // Validate each file
  for (const file of files) {
    const validation = validateFile(file);
    if (validation.valid && validation.materialType) {
      validFiles.push({ file, materialType: validation.materialType });
    } else if (validation.error) {
      invalidFiles.push({ file, error: validation.error });
    }
  }

  // If no valid files, return early
  if (validFiles.length === 0) {
    return { validFiles, invalidFiles, batchErrors };
  }

  // Validate batch size
  const batchSizeValidation = validateBatchSize(validFiles.map((f) => f.file));
  if (!batchSizeValidation.valid && batchSizeValidation.error) {
    batchErrors.push(batchSizeValidation.error);
    return { validFiles: [], invalidFiles: [], batchErrors };
  }

  // Validate storage limit
  const storageLimitValidation = validateStorageLimit(
    currentStorageUsage,
    validFiles.map((f) => f.file),
    storageLimit
  );
  if (!storageLimitValidation.valid && storageLimitValidation.error) {
    batchErrors.push(storageLimitValidation.error);
    return { validFiles: [], invalidFiles: [], batchErrors };
  }

  return { validFiles, invalidFiles, batchErrors };
}

// =====================================================
// Format Utilities
// =====================================================

/**
 * Formats file size in human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Gets file extension from file name
 * @param fileName - Name of file
 * @returns Extension (e.g., "pdf", "jpg")
 */
export function getFileExtension(fileName: string): string {
  return fileName.split(".").pop()?.toLowerCase() || "";
}

/**
 * Checks if file is an image
 * @param file - File to check
 * @returns True if image, false otherwise
 */
export function isImageFile(file: File): boolean {
  return getMaterialType(file) === MaterialType.IMAGE;
}

/**
 * Checks if file is a PDF
 * @param file - File to check
 * @returns True if PDF, false otherwise
 */
export function isPdfFile(file: File): boolean {
  return getMaterialType(file) === MaterialType.PDF;
}

/**
 * Checks if file is a document (DOCX or PPTX)
 * @param file - File to check
 * @returns True if document, false otherwise
 */
export function isDocumentFile(file: File): boolean {
  const type = getMaterialType(file);
  return type === MaterialType.DOCX || type === MaterialType.PPTX;
}
