/**
 * Material Upload Validation Schemas
 * Zod schemas for validating material upload data
 */

import { z } from "zod";
import {
  MAX_IMAGE_SIZE,
  MAX_DOCUMENT_SIZE,
  MAX_TEXT_CONTENT_LENGTH,
  MIN_TEXT_LENGTH,
} from "../types/constants";

// =====================================================
// Database Schemas
// =====================================================

/**
 * Schema for study material from database
 */
export const studyMaterialSchema = z.object({
  id: z.string().uuid(),
  subject_id: z.string().uuid(),
  user_id: z.string().uuid(),
  file_name: z.string().min(1).max(255),
  file_type: z.enum(["pdf", "image", "text", "docx", "pptx"]),
  file_size: z.number().positive(),
  storage_path: z.string().min(1),
  thumbnail_url: z.string().url().nullable(),
  text_content: z.string().max(MAX_TEXT_CONTENT_LENGTH).nullable(),
  processing_status: z.enum(["pending", "processing", "ready", "failed"]),
  error_message: z.string().nullable(),
  created_at: z.string(), // Accept any string format for timestamps
  updated_at: z.string(), // Accept any string format for timestamps
});

/**
 * Schema for creating a new material
 */
export const createMaterialSchema = z.object({
  subject_id: z.string().uuid("Invalid subject ID"),
  user_id: z.string().uuid("Invalid user ID"),
  file_name: z
    .string()
    .min(1, "File name is required")
    .max(255, "File name too long"),
  file_type: z.enum(["pdf", "image", "text", "docx", "pptx"], {
    message: "Invalid file type",
  }),
  file_size: z
    .number()
    .positive("File size must be positive")
    .refine(
      (size) => size <= MAX_DOCUMENT_SIZE,
      `File size cannot exceed ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB`
    ),
  storage_path: z.string().min(1, "Storage path is required"),
  thumbnail_url: z.string().url().nullable().optional(),
  text_content: z.string().max(MAX_TEXT_CONTENT_LENGTH).nullable().optional(),
  processing_status: z
    .enum(["pending", "processing", "ready", "failed"])
    .optional(),
  error_message: z.string().nullable().optional(),
});

/**
 * Schema for updating a material
 */
export const updateMaterialSchema = z.object({
  text_content: z.string().max(MAX_TEXT_CONTENT_LENGTH).nullable().optional(),
  processing_status: z
    .enum(["pending", "processing", "ready", "failed"])
    .optional(),
  error_message: z.string().nullable().optional(),
  thumbnail_url: z.string().url().nullable().optional(),
});

// =====================================================
// Upload Schemas
// =====================================================

/**
 * Schema for validating a file before upload
 */
export const fileUploadSchema = z.object({
  file: z.instanceof(File, { message: "Must be a valid file" }),
  subjectId: z.string().uuid("Invalid subject ID"),
});

/**
 * Schema for validating image file size
 */
export const imageFileSizeSchema = z
  .number()
  .positive()
  .max(
    MAX_IMAGE_SIZE,
    `Image size cannot exceed ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`
  );

/**
 * Schema for validating document file size
 */
export const documentFileSizeSchema = z
  .number()
  .positive()
  .max(
    MAX_DOCUMENT_SIZE,
    `Document size cannot exceed ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB`
  );

/**
 * Schema for extracted text content
 */
export const extractedTextSchema = z
  .string()
  .min(MIN_TEXT_LENGTH, `Text must be at least ${MIN_TEXT_LENGTH} characters`)
  .max(MAX_TEXT_CONTENT_LENGTH, "Text content too large");

// =====================================================
// Filter & Query Schemas
// =====================================================

/**
 * Schema for material filters
 */
export const materialFiltersSchema = z.object({
  subjectId: z.string().uuid().nullable().optional(),
  searchQuery: z.string().optional(),
  sortBy: z
    .enum([
      "date_desc",
      "date_asc",
      "name_asc",
      "name_desc",
      "size_desc",
      "size_asc",
    ])
    .optional(),
  processingStatus: z
    .union([
      z.enum(["pending", "processing", "ready", "failed"]),
      z.literal("all"),
    ])
    .optional(),
});

/**
 * Schema for storage usage
 */
export const storageUsageSchema = z.object({
  used: z.number().nonnegative(),
  limit: z.number().positive(),
  percentage: z.number().min(0).max(100),
});

// =====================================================
// Error Schemas
// =====================================================

/**
 * Schema for upload errors
 */
export const uploadErrorSchema = z.object({
  code: z.enum([
    "FILE_TOO_LARGE",
    "UNSUPPORTED_TYPE",
    "STORAGE_LIMIT_REACHED",
    "UPLOAD_FAILED",
    "EXTRACTION_FAILED",
    "NETWORK_ERROR",
    "UNKNOWN_ERROR",
  ]),
  message: z.string(),
  fileName: z.string().optional(),
  details: z.string().optional(),
});

// =====================================================
// Response Schemas
// =====================================================

/**
 * Schema for upload result
 */
export const uploadResultSchema = z.object({
  success: z.boolean(),
  fileName: z.string(),
  materialId: z.string().uuid().optional(),
  error: z.string().optional(),
});

/**
 * Schema for batch upload result
 */
export const batchUploadResultSchema = z.object({
  successful: z.array(uploadResultSchema),
  failed: z.array(uploadResultSchema),
  totalFiles: z.number().nonnegative(),
  successCount: z.number().nonnegative(),
  failureCount: z.number().nonnegative(),
});

// =====================================================
// UI State Schemas
// =====================================================

/**
 * Schema for view mode
 */
export const viewModeSchema = z.enum(["grid", "list"]);

/**
 * Schema for sort option
 */
export const sortOptionSchema = z.enum([
  "date_desc",
  "date_asc",
  "name_asc",
  "name_desc",
  "size_desc",
  "size_asc",
]);

// =====================================================
// Type Inference
// =====================================================

// Export inferred types for use throughout the app
export type StudyMaterialSchema = z.infer<typeof studyMaterialSchema>;
export type CreateMaterialSchema = z.infer<typeof createMaterialSchema>;
export type UpdateMaterialSchema = z.infer<typeof updateMaterialSchema>;
export type FileUploadSchema = z.infer<typeof fileUploadSchema>;
export type MaterialFiltersSchema = z.infer<typeof materialFiltersSchema>;
export type StorageUsageSchema = z.infer<typeof storageUsageSchema>;
export type UploadErrorSchema = z.infer<typeof uploadErrorSchema>;
export type UploadResultSchema = z.infer<typeof uploadResultSchema>;
export type BatchUploadResultSchema = z.infer<typeof batchUploadResultSchema>;

// =====================================================
// Helper Functions
// =====================================================

/**
 * Validates and parses study material data from database
 */
export const parseStudyMaterial = (data: unknown) => {
  return studyMaterialSchema.parse(data);
};

/**
 * Validates and parses array of study materials
 */
export const parseStudyMaterials = (data: unknown) => {
  return z.array(studyMaterialSchema).parse(data);
};

/**
 * Validates create material payload
 */
export const validateCreateMaterial = (data: unknown) => {
  return createMaterialSchema.parse(data);
};

/**
 * Validates update material payload
 */
export const validateUpdateMaterial = (data: unknown) => {
  return updateMaterialSchema.parse(data);
};

/**
 * Validates material filters
 */
export const validateMaterialFilters = (data: unknown) => {
  return materialFiltersSchema.parse(data);
};

/**
 * Safely parses study material (returns null on error)
 */
export const safeParseStudyMaterial = (data: unknown) => {
  const result = studyMaterialSchema.safeParse(data);
  return result.success ? result.data : null;
};

/**
 * Safely parses array of study materials (returns empty array on error)
 */
export const safeParseStudyMaterials = (data: unknown) => {
  const result = z.array(studyMaterialSchema).safeParse(data);
  return result.success ? result.data : [];
};
