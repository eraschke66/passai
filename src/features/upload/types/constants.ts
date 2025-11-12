/**
 * Material Upload Constants
 * All magic strings and configuration values for the upload feature
 */

import { MaterialType } from "./material.types";

// =====================================================
// File Size Limits (in bytes)
// =====================================================

/**
 * Maximum file size for a single image upload (5MB)
 */
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

/**
 * Maximum file size for a single document upload (10MB)
 */
export const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;

/**
 * Maximum file size for premium users (50MB)
 */
export const MAX_PREMIUM_FILE_SIZE = 50 * 1024 * 1024;

/**
 * Maximum total size in a single upload batch (50MB)
 */
export const MAX_BATCH_UPLOAD_SIZE = 50 * 1024 * 1024;

// =====================================================
// Storage Limits (in bytes)
// =====================================================

/**
 * Free tier total storage limit (500MB)
 */
export const FREE_TIER_STORAGE_LIMIT = 500 * 1024 * 1024;

/**
 * Premium tier total storage limit (5GB)
 */
export const PREMIUM_TIER_STORAGE_LIMIT = 5 * 1024 * 1024 * 1024;

/**
 * Storage warning threshold (90% of limit)
 */
export const STORAGE_WARNING_THRESHOLD = 0.9;

// =====================================================
// Upload Configuration
// =====================================================

/**
 * Maximum number of files that can be uploaded at once
 */
export const MAX_FILES_PER_UPLOAD = 10;

/**
 * Maximum number of parallel uploads
 */
export const MAX_PARALLEL_UPLOADS = 3;

/**
 * Number of retry attempts for failed uploads
 */
export const MAX_UPLOAD_RETRIES = 3;

/**
 * Delay between retry attempts (ms)
 */
export const RETRY_DELAY = 1000;

// =====================================================
// Text Extraction Configuration
// =====================================================

/**
 * Minimum characters required in extracted text
 */
export const MIN_TEXT_LENGTH = 50;

/**
 * Maximum text content length to store (500KB as characters)
 */
export const MAX_TEXT_CONTENT_LENGTH = 500 * 1024;

/**
 * Timeout for text extraction operations (ms)
 */
export const EXTRACTION_TIMEOUT = 60000; // 60 seconds

// =====================================================
// MIME Types
// =====================================================

/**
 * Mapping of material types to accepted MIME types
 */
export const MIME_TYPE_MAP: Record<MaterialType, string[]> = {
  [MaterialType.PDF]: ["application/pdf"],
  [MaterialType.IMAGE]: ["image/jpeg", "image/jpg", "image/png"],
  [MaterialType.TEXT]: ["text/plain"],
  [MaterialType.DOCX]: [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  [MaterialType.PPTX]: [
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
};

/**
 * All accepted MIME types (flattened)
 */
export const ACCEPTED_MIME_TYPES = Object.values(MIME_TYPE_MAP).flat();

// =====================================================
// File Extensions
// =====================================================

/**
 * Mapping of material types to file extensions
 */
export const FILE_EXTENSION_MAP: Record<MaterialType, string[]> = {
  [MaterialType.PDF]: [".pdf"],
  [MaterialType.IMAGE]: [".jpg", ".jpeg", ".png"],
  [MaterialType.TEXT]: [".txt"],
  [MaterialType.DOCX]: [".docx"],
  [MaterialType.PPTX]: [".pptx"],
};

/**
 * All accepted file extensions (flattened)
 */
export const ACCEPTED_FILE_EXTENSIONS =
  Object.values(FILE_EXTENSION_MAP).flat();

/**
 * File extensions as a comma-separated string for input accept attribute
 */
export const ACCEPTED_FILE_EXTENSIONS_STRING =
  ACCEPTED_FILE_EXTENSIONS.join(",");

// =====================================================
// Supabase Storage Configuration
// =====================================================

/**
 * Name of the materials storage bucket
 */
export const MATERIALS_BUCKET = "materials";

/**
 * Name of the thumbnails storage bucket
 */
export const THUMBNAILS_BUCKET = "thumbnails";

/**
 * Storage path template: {userId}/{subjectId}/{fileName}
 */
export const getStoragePath = (
  userId: string,
  subjectId: string,
  fileName: string
): string => {
  return `${userId}/${subjectId}/${fileName}`;
};

/**
 * Thumbnail path template: {userId}/{subjectId}/thumb_{fileName}
 */
export const getThumbnailPath = (
  userId: string,
  subjectId: string,
  fileName: string
): string => {
  return `${userId}/${subjectId}/thumb_${fileName}`;
};

// =====================================================
// Error Messages
// =====================================================

export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: (fileName: string, maxSize: string) =>
    `"${fileName}" exceeds the ${maxSize} file size limit. Please compress or split the file.`,

  UNSUPPORTED_TYPE: (fileName: string) =>
    `"${fileName}" is not a supported file type. Only PDF, JPG, PNG, TXT, DOCX, and PPTX files are allowed.`,

  STORAGE_LIMIT_REACHED: (used: string, limit: string) =>
    `You've reached your storage limit (${used} of ${limit}). Delete some materials or upgrade to Premium.`,

  UPLOAD_FAILED: (fileName: string) =>
    `Failed to upload "${fileName}". Please try again.`,

  EXTRACTION_FAILED: (fileName: string, fileType: string) =>
    `Could not extract text from "${fileName}". ${
      fileType === "image"
        ? "Try a clearer photo or scan."
        : "It may be encrypted or corrupted."
    }`,

  NETWORK_ERROR: () =>
    "Network error occurred. Please check your connection and try again.",

  BATCH_SIZE_EXCEEDED: (size: string, limit: string) =>
    `Total upload size (${size}) exceeds the ${limit} batch limit. Please upload fewer files.`,

  TOO_MANY_FILES: (count: number, max: number) =>
    `You can only upload ${max} files at once. You selected ${count} files.`,

  NO_SUBJECT_SELECTED: () =>
    "Please select a subject before uploading materials.",

  TEXT_TOO_SHORT: (fileName: string) =>
    `"${fileName}" does not contain enough text for quiz generation (minimum ${MIN_TEXT_LENGTH} characters).`,
} as const;

// =====================================================
// Success Messages
// =====================================================

export const SUCCESS_MESSAGES = {
  UPLOAD_COMPLETE: (count: number) =>
    `Successfully uploaded ${count} ${count === 1 ? "material" : "materials"}!`,

  MATERIAL_DELETED: (fileName: string) => `"${fileName}" has been deleted.`,

  EXTRACTION_COMPLETE: (fileName: string) =>
    `Text extracted from "${fileName}". You can now generate quizzes!`,
} as const;

// =====================================================
// UI Constants
// =====================================================

/**
 * Default view mode for materials list
 */
export const DEFAULT_VIEW_MODE = "grid" as const;

/**
 * Number of materials to show in subject detail preview
 */
export const SUBJECT_DETAIL_MATERIALS_LIMIT = 5;

/**
 * Number of materials to load per page (pagination)
 */
export const MATERIALS_PER_PAGE = 20;

/**
 * Debounce delay for search input (ms)
 */
export const SEARCH_DEBOUNCE_DELAY = 300;

// =====================================================
// Status Badge Colors
// =====================================================

export const STATUS_BADGE_CONFIG = {
  pending: {
    label: "Pending",
    variant: "secondary" as const,
    color: "bg-gray-500",
  },
  processing: {
    label: "Processing",
    variant: "default" as const,
    color: "bg-yellow-500",
    animated: true,
  },
  ready: {
    label: "Ready",
    variant: "success" as const,
    color: "bg-green-500",
  },
  failed: {
    label: "Failed",
    variant: "destructive" as const,
    color: "bg-red-500",
  },
} as const;

// =====================================================
// File Type Icons & Colors
// =====================================================

export const FILE_TYPE_CONFIG = {
  pdf: {
    icon: "FileText",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  image: {
    icon: "Image",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  text: {
    icon: "FileText",
    color: "text-gray-600",
    bgColor: "bg-gray-50",
  },
  docx: {
    icon: "FileText",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
  },
  pptx: {
    icon: "Presentation",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
} as const;
