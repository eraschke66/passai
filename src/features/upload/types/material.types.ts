/**
 * Material Upload & Management Types
 * Defines all TypeScript interfaces and types for the material upload feature
 */

// =====================================================
// Constants (Using const objects instead of enums)
// =====================================================

/**
 * Supported file types for upload
 */
export const MaterialType = {
  PDF: "pdf",
  IMAGE: "image",
  TEXT: "text",
  DOCX: "docx",
  PPTX: "pptx",
} as const;

export type MaterialType = (typeof MaterialType)[keyof typeof MaterialType];

/**
 * Processing status for material text extraction
 */
export const ProcessingStatus = {
  PENDING: "pending",
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
} as const;

export type ProcessingStatus =
  (typeof ProcessingStatus)[keyof typeof ProcessingStatus];

/**
 * View mode for materials list
 */
export const MaterialViewMode = {
  GRID: "grid",
  LIST: "list",
} as const;

export type MaterialViewMode =
  (typeof MaterialViewMode)[keyof typeof MaterialViewMode];

/**
 * Sort options for materials
 */
export const MaterialSortOption = {
  DATE_DESC: "date_desc",
  DATE_ASC: "date_asc",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  SIZE_DESC: "size_desc",
  SIZE_ASC: "size_asc",
} as const;

export type MaterialSortOption =
  (typeof MaterialSortOption)[keyof typeof MaterialSortOption];

// =====================================================
// Database Types
// =====================================================

/**
 * Study material as stored in the database
 */
export interface StudyMaterial {
  id: string;
  subject_id: string;
  user_id: string;
  file_name: string;
  file_type: MaterialType;
  file_size: number;
  storage_path: string;
  thumbnail_url: string | null;
  text_content: string | null;
  processing_status: ProcessingStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Payload for creating a new material record
 */
export interface CreateMaterialPayload {
  subject_id: string;
  user_id: string;
  file_name: string;
  file_type: MaterialType;
  file_size: number;
  storage_path: string;
  thumbnail_url?: string | null;
  text_content?: string | null;
  processing_status?: ProcessingStatus;
  error_message?: string | null;
}

/**
 * Payload for updating an existing material
 */
export interface UpdateMaterialPayload {
  text_content?: string | null;
  processing_status?: ProcessingStatus;
  error_message?: string | null;
  thumbnail_url?: string | null;
}

// =====================================================
// Upload Types
// =====================================================

/**
 * File being prepared for upload
 */
export interface StagedFile {
  id: string; // Temporary client-side ID
  file: File;
  preview: string; // Data URL or icon identifier
  error?: string;
}

/**
 * Upload progress tracking
 */
export interface UploadProgress {
  fileId: string;
  fileName: string;
  status: "uploading" | "processing" | "complete" | "failed";
  progress: number; // 0-100
  error?: string;
  materialId?: string; // Set when upload completes
}

/**
 * Upload result for a single file
 */
export interface UploadResult {
  success: boolean;
  fileName: string;
  materialId?: string;
  error?: string;
}

/**
 * Batch upload result
 */
export interface BatchUploadResult {
  successful: UploadResult[];
  failed: UploadResult[];
  totalFiles: number;
  successCount: number;
  failureCount: number;
}

// =====================================================
// Filter & Search Types
// =====================================================

/**
 * Filters for materials list
 */
export interface MaterialFilters {
  subjectId?: string | null;
  searchQuery?: string;
  sortBy?: MaterialSortOption;
  processingStatus?: ProcessingStatus | "all";
}

/**
 * Storage usage information
 */
export interface StorageUsage {
  used: number; // Bytes
  limit: number; // Bytes
  percentage: number; // 0-100
}

// =====================================================
// UI State Types
// =====================================================

/**
 * Material detail modal state
 */
export interface MaterialDetailState {
  isOpen: boolean;
  material: StudyMaterial | null;
}

/**
 * Delete confirmation modal state
 */
export interface DeleteConfirmationState {
  isOpen: boolean;
  material: StudyMaterial | null;
}

// =====================================================
// Error Types
// =====================================================

/**
 * Upload error codes
 */
export const UploadErrorCode = {
  FILE_TOO_LARGE: "FILE_TOO_LARGE",
  UNSUPPORTED_TYPE: "UNSUPPORTED_TYPE",
  STORAGE_LIMIT_REACHED: "STORAGE_LIMIT_REACHED",
  UPLOAD_FAILED: "UPLOAD_FAILED",
  EXTRACTION_FAILED: "EXTRACTION_FAILED",
  NETWORK_ERROR: "NETWORK_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type UploadErrorCode =
  (typeof UploadErrorCode)[keyof typeof UploadErrorCode];

/**
 * Structured upload error
 */
export interface UploadError {
  code: UploadErrorCode;
  message: string;
  fileName?: string;
  details?: string;
}

// =====================================================
// Utility Types
// =====================================================

/**
 * MIME type mapping
 */
export type MimeTypeMap = {
  [key in MaterialType]: string[];
};

/**
 * File validation result
 */
export interface FileValidationResult {
  valid: boolean;
  error?: UploadError;
}
